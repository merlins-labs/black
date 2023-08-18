type EstimatedGas = {
  estimatedGasCryptoPrecision?: string
}

type WithdrawValues = {
  lpAmount: string
  fiatAmount: string
}

type FuryFarmingWithdrawValues = WithdrawValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoPrecision: string
    isExiting: boolean
  }

export type FuryFarmingWithdrawState = {
  approve: EstimatedGas
  withdraw: FuryFarmingWithdrawValues
  loading: boolean
  txid: string | null
}

export enum FuryFarmingWithdrawActionType {
  SET_WITHDRAW = 'SET_WITHDRAW',
  SET_LOADING = 'SET_LOADING',
  SET_APPROVE = 'SET_APPROVE',
  SET_TXID = 'SET_TXID',
  SET_TX_STATUS = 'SET_TX_STATUS',
}

type SetWithdraw = {
  type: FuryFarmingWithdrawActionType.SET_WITHDRAW
  payload: Partial<FuryFarmingWithdrawValues>
}

type SetLoading = {
  type: FuryFarmingWithdrawActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: FuryFarmingWithdrawActionType.SET_TXID
  payload: string
}

type SetApprove = {
  type: FuryFarmingWithdrawActionType.SET_APPROVE
  payload: EstimatedGas
}

export type FuryFarmingWithdrawActions = SetWithdraw | SetApprove | SetLoading | SetTxid
