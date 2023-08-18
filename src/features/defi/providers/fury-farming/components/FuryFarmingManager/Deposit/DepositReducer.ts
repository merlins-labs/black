import type { FuryFarmingDepositActions, FuryFarmingDepositState } from './DepositCommon'
import { FuryFarmingDepositActionType } from './DepositCommon'

export const initialState: FuryFarmingDepositState = {
  txid: null,
  loading: false,
  approve: {},
  deposit: {
    fiatAmount: '',
    cryptoAmount: '',
    txStatus: 'pending',
    usedGasFeeCryptoPrecision: '',
  },
}

export const reducer = (
  state: FuryFarmingDepositState,
  action: FuryFarmingDepositActions,
): FuryFarmingDepositState => {
  switch (action.type) {
    case FuryFarmingDepositActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case FuryFarmingDepositActionType.SET_DEPOSIT:
      return { ...state, deposit: { ...state.deposit, ...action.payload } }
    case FuryFarmingDepositActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case FuryFarmingDepositActionType.SET_TXID:
      return { ...state, txid: action.payload }
    default:
      return state
  }
}
