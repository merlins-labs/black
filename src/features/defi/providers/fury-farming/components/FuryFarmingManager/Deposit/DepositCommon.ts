type EstimatedGas = {
  estimatedGasCryptoPrecision?: string
}

type DepositValues = {
  fiatAmount: string
  cryptoAmount: string
}

type FuryFarmingDepositValues = DepositValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoPrecision: string
  }

export type FuryFarmingDepositState = {
  approve: EstimatedGas
  deposit: FuryFarmingDepositValues
  loading: boolean
  txid: string | null
}

export enum FuryFarmingDepositActionType {
  SET_APPROVE = 'SET_APPROVE',
  SET_DEPOSIT = 'SET_DEPOSIT',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
}

type SetApprove = {
  type: FuryFarmingDepositActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetDeposit = {
  type: FuryFarmingDepositActionType.SET_DEPOSIT
  payload: Partial<FuryFarmingDepositValues>
}

type SetLoading = {
  type: FuryFarmingDepositActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: FuryFarmingDepositActionType.SET_TXID
  payload: string
}

export type FuryFarmingDepositActions = SetApprove | SetDeposit | SetLoading | SetTxid
