import type { UserStakingOpportunityBase } from '../../types'

export type UserUndelegation = {
  completionTime: number
  undelegationAmountCryptoBaseUnit: string
}

export type JinxSpecificUserStakingOpportunity = UserStakingOpportunityBase & {
  // Undelegations is a Cosmos SDK specific terminology https://docs.cosmos.network/main/modules/staking
  // The terminology has been reused here for FURYy to keep things abstracted, but Cosmos SDK undelegations
  // and FURYy delayed withdraws are two very different implementations, on two different chains
  undelegations: UserUndelegation[]
}
