import type { FuryFarmingWithdrawActions, FuryFarmingWithdrawState } from './WithdrawCommon'
import { FuryFarmingWithdrawActionType } from './WithdrawCommon'

export const initialState: FuryFarmingWithdrawState = {
  txid: null,
  loading: false,
  approve: {},
  withdraw: {
    lpAmount: '',
    fiatAmount: '',
    txStatus: 'pending',
    usedGasFeeCryptoPrecision: '',
    isExiting: false,
  },
}

export const reducer = (
  state: FuryFarmingWithdrawState,
  action: FuryFarmingWithdrawActions,
): FuryFarmingWithdrawState => {
  switch (action.type) {
    case FuryFarmingWithdrawActionType.SET_WITHDRAW:
      return { ...state, withdraw: { ...state.withdraw, ...action.payload } }
    case FuryFarmingWithdrawActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case FuryFarmingWithdrawActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case FuryFarmingWithdrawActionType.SET_TXID:
      return { ...state, txid: action.payload }
    default:
      return state
  }
}
