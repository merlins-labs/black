import { Center } from '@chakra-ui/react'
import type { AccountId } from '@shapeshiftoss/caip'
import { KnownChainIds } from '@shapeshiftoss/types'
import { ethers } from 'ethers'
import { DefiModalContent } from 'features/defi/components/DefiModal/DefiModalContent'
import { DefiModalHeader } from 'features/defi/components/DefiModal/DefiModalHeader'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction, DefiStep } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { useJinxQuery } from 'features/defi/providers/jinx/components/JinxManager/useJinxQuery'
import qs from 'qs'
import { useEffect, useMemo, useReducer } from 'react'
import { useTranslate } from 'react-polyglot'
import { useSelector } from 'react-redux'
import type { AccountDropdownProps } from 'components/AccountDropdown/AccountDropdown'
import { CircularProgress } from 'components/CircularProgress/CircularProgress'
import type { DefiStepProps } from 'components/DeFi/components/Steps'
import { Steps } from 'components/DeFi/components/Steps'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { getJinxApi } from 'state/apis/jinx/jinxApiSingleton'
import {
  selectBIP44ParamsByAccountId,
  selectMarketDataById,
  selectPortfolioLoading,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { Approve } from './components/Approve'
import { Confirm } from './components/Confirm'
import { Status } from './components/Status'
import { Withdraw } from './components/Withdraw'
import { JinxWithdrawActionType } from './WithdrawCommon'
import { WithdrawContext } from './WithdrawContext'
import { initialState, reducer } from './WithdrawReducer'

export const JinxWithdraw: React.FC<{
  onAccountIdChange: AccountDropdownProps['onChange']
  accountId: AccountId | undefined
}> = ({ onAccountIdChange: handleAccountIdChange, accountId }) => {
  const jinxApi = getJinxApi()
  const translate = useTranslate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { query, history, location } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { assetReference: jinxStakingContractAddress } = query
  const { feeAssetId, underlyingAsset, underlyingAssetId, stakingAsset } = useJinxQuery()

  const marketData = useAppSelector(state => selectMarketDataById(state, underlyingAssetId))

  const feeMarketData = useAppSelector(state => selectMarketDataById(state, feeAssetId))
  const accountFilter = useMemo(() => ({ accountId: accountId ?? '' }), [accountId])
  const bip44Params = useAppSelector(state => selectBIP44ParamsByAccountId(state, accountFilter))

  // user info
  const chainAdapterManager = getChainAdapterManager()
  const chainAdapter = chainAdapterManager.get(KnownChainIds.EthereumMainnet)
  const { state: walletState } = useWallet()
  const loading = useSelector(selectPortfolioLoading)

  useEffect(() => {
    ;(async () => {
      try {
        if (
          !(
            walletState.wallet &&
            jinxStakingContractAddress &&
            chainAdapter &&
            jinxApi &&
            bip44Params
          )
        )
          return
        const jinxOpportunity = await jinxApi.getJinxOpportunityByStakingAddress(
          ethers.utils.getAddress(jinxStakingContractAddress),
        )
        // Get jinx fee for instant sends
        const jinxFeePercentage = await jinxApi.instantUnstakeFee({
          contractAddress: jinxStakingContractAddress,
        })

        dispatch({
          type: JinxWithdrawActionType.SET_JINX_FEE,
          payload: bnOrZero(jinxFeePercentage).toString(),
        })
        dispatch({
          type: JinxWithdrawActionType.SET_OPPORTUNITY,
          payload: jinxOpportunity,
        })
      } catch (error) {
        // TODO: handle client side errors
        console.error(error)
      }
    })()
  }, [jinxApi, bip44Params, chainAdapter, jinxStakingContractAddress, walletState.wallet])

  const StepConfig: DefiStepProps = useMemo(() => {
    return {
      [DefiStep.Info]: {
        label: translate('defi.steps.withdraw.info.title'),
        description: translate('defi.steps.withdraw.info.yieldyDescription', {
          asset: stakingAsset.symbol,
        }),
        component: ownProps => (
          <Withdraw {...ownProps} accountId={accountId} onAccountIdChange={handleAccountIdChange} />
        ),
      },
      [DefiStep.Approve]: {
        label: translate('defi.steps.approve.title'),
        component: ownProps => <Approve {...ownProps} accountId={accountId} />,
        props: { contractAddress: jinxStakingContractAddress },
      },
      [DefiStep.Confirm]: {
        label: translate('defi.steps.confirm.title'),
        component: ownProps => <Confirm {...ownProps} accountId={accountId} />,
      },
      [DefiStep.Status]: {
        label: 'Status',
        component: ownProps => <Status {...ownProps} accountId={accountId} />,
      },
    }
  }, [accountId, handleAccountIdChange, jinxStakingContractAddress, translate, stakingAsset.symbol])

  const handleBack = () => {
    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        ...query,
        modal: DefiAction.Overview,
      }),
    })
  }

  if (loading || !underlyingAsset || !marketData || !feeMarketData)
    return (
      <Center minW='350px' minH='350px'>
        <CircularProgress />
      </Center>
    )

  return (
    <WithdrawContext.Provider value={{ state, dispatch }}>
      <DefiModalContent>
        <DefiModalHeader
          onBack={handleBack}
          title={translate('modals.withdraw.withdrawFrom', {
            opportunity: `${stakingAsset.symbol} Yieldy`,
          })}
        />
        <Steps steps={StepConfig} />
      </DefiModalContent>
    </WithdrawContext.Provider>
  )
}
