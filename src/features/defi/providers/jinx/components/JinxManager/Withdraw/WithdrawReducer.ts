import { KnownChainIds, WithdrawType } from '@shapeshiftoss/types'
import { bn } from 'lib/bignumber/bignumber'
import { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { JinxWithdrawActions, JinxWithdrawState } from './WithdrawCommon'
import { JinxWithdrawActionType } from './WithdrawCommon'

export const initialState: JinxWithdrawState = {
  txid: null,
  jinxOpportunity: {
    contractAddress: '',
    stakingToken: '',
    provider: '',
    chain: KnownChainIds.EthereumMainnet,
    type: DefiType.Staking,
    expired: false,
    version: '',
    rewardToken: '',
    tvl: bn(0),
    apy: '',
  },
  loading: false,
  approve: {},
  withdraw: {
    fiatAmount: '',
    cryptoAmount: '',
    slippage: '',
    txStatus: 'pending',
    usedGasFeeCryptoBaseUnit: '',
    withdrawType: WithdrawType.DELAYED,
  },
  jinxFeePercentage: '',
}

export const reducer = (state: JinxWithdrawState, action: JinxWithdrawActions) => {
  switch (action.type) {
    case JinxWithdrawActionType.SET_OPPORTUNITY:
      return { ...state, jinxOpportunity: { ...state.jinxOpportunity, ...action.payload } }
    case JinxWithdrawActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case JinxWithdrawActionType.SET_WITHDRAW:
      return { ...state, withdraw: { ...state.withdraw, ...action.payload } }
    case JinxWithdrawActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case JinxWithdrawActionType.SET_TXID:
      return { ...state, txid: action.payload }
    case JinxWithdrawActionType.SET_JINX_FEE:
      return { ...state, jinxFeePercentage: action.payload }
    default:
      return state
  }
}
