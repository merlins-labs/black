import type { ChainId } from '@shapeshiftoss/caip'
import type { DepositValues } from 'features/defi/components/Deposit/Deposit'
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

type JinxDepositValues = DepositValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoBaseUnit: string
  }

export type JinxDepositState = {
  jinxOpportunity: SupportedJinxOpportunity
  approve: EstimatedGas
  deposit: JinxDepositValues
  loading: boolean
  pricePerShare: string
  txid: string | null
  isExactAllowance: boolean
}

export enum JinxDepositActionType {
  SET_OPPORTUNITY = 'SET_OPPORTUNITY',
  SET_APPROVE = 'SET_APPROVE',
  SET_DEPOSIT = 'SET_DEPOSIT',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
  SET_IS_EXACT_ALLOWANCE = 'SET_IS_EXACT_ALLOWANCE',
}

type SetJinxOpportunitiesAction = {
  type: JinxDepositActionType.SET_OPPORTUNITY
  payload: SupportedJinxOpportunity | null
}

type SetApprove = {
  type: JinxDepositActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetDeposit = {
  type: JinxDepositActionType.SET_DEPOSIT
  payload: Partial<JinxDepositValues>
}

type SetLoading = {
  type: JinxDepositActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: JinxDepositActionType.SET_TXID
  payload: string
}

type SetIsExactAllowance = {
  type: JinxDepositActionType.SET_IS_EXACT_ALLOWANCE
  payload: boolean
}

export type JinxDepositActions =
  | SetJinxOpportunitiesAction
  | SetApprove
  | SetDeposit
  | SetLoading
  | SetTxid
  | SetIsExactAllowance
