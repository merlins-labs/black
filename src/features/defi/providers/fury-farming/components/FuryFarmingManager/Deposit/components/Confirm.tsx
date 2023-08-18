import { Alert, AlertIcon, Box, Stack, useToast } from '@chakra-ui/react'
import type { AccountId } from '@shapeshiftoss/caip'
import { fromAccountId } from '@shapeshiftoss/caip'
import { Confirm as ReusableConfirm } from 'features/defi/components/Confirm/Confirm'
import { PairIcons } from 'features/defi/components/PairIcons/PairIcons'
import { Summary } from 'features/defi/components/Summary'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiStep } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { useFuryFarming } from 'features/defi/providers/fury-farming/hooks/useFuryFarming'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { Amount } from 'components/Amount/Amount'
import type { StepComponentProps } from 'components/DeFi/components/Steps'
import { Row } from 'components/Row/Row'
import { RawText, Text } from 'components/Text'
import { useFuryEth } from 'context/FuryEthProvider/FuryEthProvider'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { trackOpportunityEvent } from 'lib/mixpanel/helpers'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { assertIsFuryEthStakingContractAddress } from 'state/slices/opportunitiesSlice/constants'
import { toOpportunityId } from 'state/slices/opportunitiesSlice/utils'
import {
  selectAggregatedEarnUserStakingOpportunityByStakingId,
  selectAssetById,
  selectAssets,
  selectMarketDataById,
  selectPortfolioCryptoPrecisionBalanceByFilter,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { FuryFarmingDepositActionType } from '../DepositCommon'
import { DepositContext } from '../DepositContext'

export const Confirm: React.FC<StepComponentProps & { accountId: AccountId | undefined }> = ({
  accountId,
  onNext,
}) => {
  const { state, dispatch } = useContext(DepositContext)
  const translate = useTranslate()
  const mixpanel = getMixPanel()
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { assetNamespace, chainId, contractAddress, assetReference } = query

  assertIsFuryEthStakingContractAddress(contractAddress)

  const { stake } = useFuryFarming(contractAddress)

  const feeAssetId = getChainAdapterManager().get(chainId)?.getFeeAssetId()
  if (!feeAssetId) throw new Error(`Cannot get fee AssetId for chainId ${chainId}`)
  const feeAsset = useAppSelector(state => selectAssetById(state, feeAssetId))
  if (!feeAsset) throw new Error(`Fee asset not found for AssetId ${feeAssetId}`)

  const furyFarmingOpportunityFilter = useMemo(
    () => ({
      stakingId: toOpportunityId({
        assetNamespace,
        assetReference: contractAddress,
        chainId,
      }),
    }),
    [assetNamespace, chainId, contractAddress],
  )
  const furyFarmingOpportunity = useAppSelector(state =>
    selectAggregatedEarnUserStakingOpportunityByStakingId(state, furyFarmingOpportunityFilter),
  )

  const { onOngoingFarmingTxIdChange } = useFuryEth()

  const assets = useAppSelector(selectAssets)

  const asset = useAppSelector(state =>
    selectAssetById(state, furyFarmingOpportunity?.underlyingAssetId ?? ''),
  )

  const feeMarketData = useAppSelector(state => selectMarketDataById(state, feeAssetId))

  // user info
  const { state: walletState } = useWallet()
  const accountAddress = useMemo(
    () => (accountId ? fromAccountId(accountId).account : null),
    [accountId],
  )

  // notify
  const toast = useToast()

  const feeAssetBalanceFilter = useMemo(
    () => ({ assetId: feeAsset?.assetId, accountId: accountId ?? '' }),
    [accountId, feeAsset?.assetId],
  )
  const feeAssetBalance = useAppSelector(s =>
    selectPortfolioCryptoPrecisionBalanceByFilter(s, feeAssetBalanceFilter),
  )

  const hasEnoughBalanceForGas = useMemo(
    () =>
      bnOrZero(feeAssetBalance).minus(bnOrZero(state?.deposit.estimatedGasCryptoPrecision)).gte(0),
    [feeAssetBalance, state?.deposit.estimatedGasCryptoPrecision],
  )

  const handleDeposit = useCallback(async () => {
    if (
      !dispatch ||
      !state ||
      !accountAddress ||
      !assetReference ||
      !walletState.wallet ||
      !asset ||
      !furyFarmingOpportunity
    )
      return
    try {
      dispatch({ type: FuryFarmingDepositActionType.SET_LOADING, payload: true })
      const txid = await stake(state.deposit.cryptoAmount)
      if (!txid) throw new Error('Transaction failed')
      dispatch({ type: FuryFarmingDepositActionType.SET_TXID, payload: txid })
      onOngoingFarmingTxIdChange(txid, contractAddress)
      onNext(DefiStep.Status)
      trackOpportunityEvent(
        MixPanelEvents.DepositConfirm,
        {
          opportunity: furyFarmingOpportunity,
          fiatAmounts: [state.deposit.fiatAmount],
          cryptoAmounts: [
            {
              assetId: asset.assetId,
              amountCryptoHuman: state.deposit.cryptoAmount,
            },
          ],
        },
        assets,
      )
    } catch (error) {
      console.error(error)
      toast({
        position: 'top-right',
        description: translate('common.transactionFailedBody'),
        title: translate('common.transactionFailed'),
        status: 'error',
      })
    } finally {
      dispatch({ type: FuryFarmingDepositActionType.SET_LOADING, payload: false })
    }
  }, [
    accountAddress,
    asset,
    assetReference,
    assets,
    contractAddress,
    dispatch,
    furyFarmingOpportunity,
    onNext,
    onOngoingFarmingTxIdChange,
    stake,
    state,
    toast,
    translate,
    walletState.wallet,
  ])

  useEffect(() => {
    if (!hasEnoughBalanceForGas) {
      mixpanel?.track(MixPanelEvents.InsufficientFunds)
    }
  }, [hasEnoughBalanceForGas, mixpanel])

  if (!state || !dispatch || !furyFarmingOpportunity || !asset) return null

  return (
    <ReusableConfirm
      onCancel={() => onNext(DefiStep.Info)}
      onConfirm={handleDeposit}
      loading={state.loading}
      loadingText={translate('common.confirm')}
      isDisabled={!hasEnoughBalanceForGas}
      headerText='modals.confirm.deposit.header'
    >
      <Summary>
        <Row variant='vertical' p={4}>
          <Row.Label>
            <Text translation='modals.confirm.amountToDeposit' />
          </Row.Label>
          <Row px={0} fontWeight='medium'>
            <Stack direction='row' alignItems='center'>
              <PairIcons
                icons={furyFarmingOpportunity?.icons!}
                iconBoxSize='5'
                h='38px'
                p={1}
                borderRadius={8}
              />
              <RawText>{asset.name}</RawText>
            </Stack>
            <Row.Value>
              <Amount.Crypto value={state.deposit.cryptoAmount} symbol={asset.symbol} />
            </Row.Value>
          </Row>
        </Row>
        <Row p={4}>
          <Row.Label>
            <Text translation='modals.confirm.estimatedGas' />
          </Row.Label>
          <Row.Value>
            <Box textAlign='right'>
              <Amount.Fiat
                fontWeight='bold'
                value={bnOrZero(state.deposit.estimatedGasCryptoPrecision)
                  .times(feeMarketData.price)
                  .toFixed(2)}
              />
              <Amount.Crypto
                color='text.subtle'
                value={bnOrZero(state.deposit.estimatedGasCryptoPrecision).toFixed(5)}
                symbol={feeAsset.symbol}
              />
            </Box>
          </Row.Value>
        </Row>
      </Summary>
      <Alert status='info' borderRadius='lg'>
        <AlertIcon />
        <Text translation='modals.confirm.deposit.preFooter' />
      </Alert>
      {!hasEnoughBalanceForGas && (
        <Alert status='error' borderRadius='lg'>
          <AlertIcon />
          <Text translation={['modals.confirm.notEnoughGas', { assetSymbol: feeAsset.symbol }]} />
        </Alert>
      )}
    </ReusableConfirm>
  )
}
