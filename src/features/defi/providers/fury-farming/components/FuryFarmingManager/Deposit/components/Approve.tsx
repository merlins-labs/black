import { useToast } from '@chakra-ui/react'
import type { AccountId } from '@shapeshiftoss/caip'
import { supportsETH } from '@shapeshiftoss/hdwallet-core'
import { Approve as ReusableApprove } from 'features/defi/components/Approve/Approve'
import { ApprovePreFooter } from 'features/defi/components/Approve/ApprovePreFooter'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction, DefiStep } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { canCoverTxFees } from 'features/defi/helpers/utils'
import { useFuryFarming } from 'features/defi/providers/fury-farming/hooks/useFuryFarming'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { usePoll } from 'hooks/usePoll/usePoll'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { fromBaseUnit } from 'lib/math'
import { trackOpportunityEvent } from 'lib/mixpanel/helpers'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { isSome } from 'lib/utils'
import { assertIsFuryEthStakingContractAddress } from 'state/slices/opportunitiesSlice/constants'
import { toOpportunityId } from 'state/slices/opportunitiesSlice/utils'
import {
  selectAggregatedEarnUserStakingOpportunityByStakingId,
  selectAssetById,
  selectAssets,
  selectMarketDataById,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { FuryFarmingDepositActionType } from '../DepositCommon'
import { DepositContext } from '../DepositContext'

type FuryFarmingApproveProps = {
  accountId: AccountId | undefined
  onNext: (arg: DefiStep) => void
}

export const Approve: React.FC<FuryFarmingApproveProps> = ({ accountId, onNext }) => {
  const { poll } = usePoll()
  const { state, dispatch } = useContext(DepositContext)
  const wallet = useWallet().state.wallet
  const toast = useToast()
  const estimatedGasCryptoPrecision = state?.approve.estimatedGasCryptoPrecision
  const translate = useTranslate()
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { assetNamespace, chainId, contractAddress } = query

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
  assertIsFuryEthStakingContractAddress(contractAddress)

  const { allowance, approve, getStakeFees } = useFuryFarming(contractAddress)

  const assets = useAppSelector(selectAssets)

  const asset = useAppSelector(state =>
    selectAssetById(state, furyFarmingOpportunity?.underlyingAssetId ?? ''),
  )
  const feeMarketData = useAppSelector(state => selectMarketDataById(state, feeAssetId))

  const handleApprove = useCallback(async () => {
    if (
      !state?.deposit.cryptoAmount ||
      !dispatch ||
      !furyFarmingOpportunity ||
      !wallet ||
      !supportsETH(wallet)
    )
      return

    try {
      if (!asset) return
      dispatch({ type: FuryFarmingDepositActionType.SET_LOADING, payload: true })
      await approve()
      await poll({
        fn: () => allowance(),
        validate: (result: string) => {
          const allowance = bn(fromBaseUnit(result, asset.precision))
          return allowance.gte(bnOrZero(state?.deposit.cryptoAmount))
        },
        interval: 15000,
        maxAttempts: 30,
      })

      // Get deposit gas estimate
      const fees = await getStakeFees(state.deposit.cryptoAmount)
      if (!fees) return

      dispatch({
        type: FuryFarmingDepositActionType.SET_DEPOSIT,
        payload: {
          estimatedGasCryptoPrecision: fromBaseUnit(
            fees.networkFeeCryptoBaseUnit,
            feeAsset.precision,
          ),
        },
      })

      onNext(DefiStep.Confirm)
      trackOpportunityEvent(
        MixPanelEvents.DepositApprove,
        {
          opportunity: furyFarmingOpportunity,
          fiatAmounts: [],
          cryptoAmounts: [],
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
    state?.deposit.cryptoAmount,
    dispatch,
    furyFarmingOpportunity,
    wallet,
    asset,
    approve,
    poll,
    getStakeFees,
    feeAsset.precision,
    onNext,
    assets,
    allowance,
    toast,
    translate,
  ])

  const hasEnoughBalanceForGas = useMemo(
    () =>
      isSome(estimatedGasCryptoPrecision) &&
      isSome(accountId) &&
      canCoverTxFees({
        feeAsset,
        estimatedGasCryptoPrecision,
        accountId,
      }),
    [accountId, feeAsset, estimatedGasCryptoPrecision],
  )

  const preFooter = useMemo(
    () => (
      <ApprovePreFooter
        accountId={accountId}
        action={DefiAction.Deposit}
        feeAsset={feeAsset}
        estimatedGasCryptoPrecision={estimatedGasCryptoPrecision}
      />
    ),
    [accountId, feeAsset, estimatedGasCryptoPrecision],
  )
  if (!state || !dispatch || !furyFarmingOpportunity || !asset) return null

  return (
    <ReusableApprove
      asset={asset}
      spenderName={furyFarmingOpportunity.provider}
      feeAsset={feeAsset}
      icons={furyFarmingOpportunity.icons}
      estimatedGasFeeCryptoPrecision={bnOrZero(state.approve.estimatedGasCryptoPrecision).toFixed(
        5,
      )}
      disabled={!hasEnoughBalanceForGas}
      fiatEstimatedGasFee={bnOrZero(state.approve.estimatedGasCryptoPrecision)
        .times(feeMarketData.price)
        .toFixed(2)}
      loading={state.loading}
      loadingText={translate('common.approve')}
      preFooter={preFooter}
      providerIcon='https://assets.coincap.io/assets/icons/256/fury.png'
      learnMoreLink='https://shapeshift.zendesk.com/hc/en-us/articles/360018501700'
      onCancel={() => onNext(DefiStep.Info)}
      onConfirm={handleApprove}
      spenderContractAddress={furyFarmingOpportunity?.contractAddress ?? ''}
    />
  )
}
