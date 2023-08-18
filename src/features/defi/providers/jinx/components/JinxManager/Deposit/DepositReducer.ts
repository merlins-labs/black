import { KnownChainIds } from '@shapeshiftoss/types'
import { bn } from 'lib/bignumber/bignumber'
import { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { JinxDepositActions, JinxDepositState } from './DepositCommon'
import { JinxDepositActionType } from './DepositCommon'

export const initialState: JinxDepositState = {
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
  pricePerShare: '',
  deposit: {
    fiatAmount: '',
    cryptoAmount: '',
    slippage: '',
    txStatus: 'pending',
    usedGasFeeCryptoBaseUnit: '',
  },
  isExactAllowance: false,
}

export const reducer = (state: JinxDepositState, action: JinxDepositActions) => {
  switch (action.type) {
    case JinxDepositActionType.SET_OPPORTUNITY:
      return { ...state, jinxOpportunity: { ...state.jinxOpportunity, ...action.payload } }
    case JinxDepositActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case JinxDepositActionType.SET_DEPOSIT:
      return { ...state, deposit: { ...state.deposit, ...action.payload } }
    case JinxDepositActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case JinxDepositActionType.SET_TXID:
      return { ...state, txid: action.payload }
    case JinxDepositActionType.SET_IS_EXACT_ALLOWANCE:
      return { ...state, isExactAllowance: action.payload }
    default:
      return state
  }
}
