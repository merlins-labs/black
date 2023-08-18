import type { ChainId } from '@shapeshiftoss/caip'
import type { WithdrawType } from '@shapeshiftoss/types'
import type { WithdrawValues } from 'features/defi/components/Withdraw/Withdraw'
import type { BigNumber } from 'lib/bignumber/bignumber'
import type { DefiType } from 'state/slices/opportunitiesSlice/types'

type SupportedJinxOpportunity = {
  type: DefiType
  provider: string
  version: string
  contractAddress: string
  rewardToken: string
  stakingToken: string
  chain: ChainId
  tvl: BigNumber
  apy: string
  expired: boolean
}

type EstimatedGas = {
  estimatedGasCryptoBaseUnit?: string
}

type JinxWithdrawValues = WithdrawValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoBaseUnit: string
    withdrawType: WithdrawType
  }

export type JinxWithdrawState = {
  jinxOpportunity: SupportedJinxOpportunity
  approve: EstimatedGas
  withdraw: JinxWithdrawValues
  loading: boolean
  txid: string | null
  jinxFeePercentage: string
}
export enum JinxWithdrawActionType {
  SET_OPPORTUNITY = 'SET_OPPORTUNITY',
  SET_WITHDRAW = 'SET_WITHDRAW',
  SET_APPROVE = 'SET_APPROVE',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
  SET_TX_STATUS = 'SET_TX_STATUS',
  SET_JINX_FEE = 'SET_JINX_FEE',
}

type SetVaultAction = {
  type: JinxWithdrawActionType.SET_OPPORTUNITY
  payload: SupportedJinxOpportunity | null
}

type SetApprove = {
  type: JinxWithdrawActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetWithdraw = {
  type: JinxWithdrawActionType.SET_WITHDRAW
  payload: Partial<JinxWithdrawValues>
}

type SetLoading = {
  type: JinxWithdrawActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: JinxWithdrawActionType.SET_TXID
  payload: string
}

type SetJinxFee = {
  type: JinxWithdrawActionType.SET_JINX_FEE
  payload: string
}

export type JinxWithdrawActions =
  | SetVaultAction
  | SetApprove
  | SetWithdraw
  | SetLoading
  | SetTxid
  | SetJinxFee
