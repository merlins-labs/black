import type { ToAssetIdArgs } from '@shapeshiftoss/caip'
import { ethChainId, fromAccountId, fromAssetId, jinxAssetId, toAssetId } from '@shapeshiftoss/caip'
import dayjs from 'dayjs'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { jinxApi } from 'state/apis/jinx/jinxApi'
import { getJinxApi } from 'state/apis/jinx/jinxApiSingleton'
import { selectAssetById } from 'state/slices/assetsSlice/selectors'
import { selectPortfolioCryptoBalanceBaseUnitByFilter } from 'state/slices/common-selectors'
import { selectMarketDataById } from 'state/slices/marketDataSlice/selectors'
import { selectBIP44ParamsByAccountId } from 'state/slices/portfolioSlice/selectors'

import type {
  GetOpportunityIdsOutput,
  GetOpportunityMetadataOutput,
  GetOpportunityUserStakingDataOutput,
  OpportunitiesState,
  OpportunityMetadata,
  StakingId,
} from '../../types'
import { DefiProvider, DefiType } from '../../types'
import { serializeUserStakingId, toOpportunityId } from '../../utils'
import type {
  OpportunitiesMetadataResolverInput,
  OpportunitiesUserDataResolverInput,
} from '../types'

export const jinxStakingOpportunitiesMetadataResolver = async ({
  defiType,
  reduxApi,
}: OpportunitiesMetadataResolverInput): Promise<{ data: GetOpportunityMetadataOutput }> => {
  const allOpportunities = await getJinxApi().getJinxOpportunities()

  const jinxApr = await reduxApi.dispatch(jinxApi.endpoints.getJinxApr.initiate())

  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency

  const stakingOpportunitiesById: Record<StakingId, OpportunityMetadata> = {}

  for (const opportunity of allOpportunities) {
    // JINX Token
    const rewardTokenAssetId = toAssetId({
      chainId: ethChainId,
      assetNamespace: 'erc20',
      assetReference: opportunity.rewardToken,
    })
    // FURY Token
    const tokenAssetId = toAssetId({
      chainId: ethChainId,
      assetNamespace: 'erc20',
      assetReference: opportunity.stakingToken,
    })
    // FURYy staking contract
    const toAssetIdParts: ToAssetIdArgs = {
      assetNamespace: 'erc20',
      assetReference: opportunity.contractAddress,
      chainId: ethChainId,
    }

    const assetId = toAssetId(toAssetIdParts)
    const opportunityId = toOpportunityId(toAssetIdParts)
    const underlyingAsset = selectAssetById(state, tokenAssetId)
    const marketData = selectMarketDataById(state, tokenAssetId)

    if (!underlyingAsset) continue

    const tvl = bnOrZero(opportunity.tvl)
      .div(`1e+${underlyingAsset?.precision}`)
      .times(marketData.price)
      .toString()

    const apy = jinxApr.data?.jinxApr ?? '0'

    stakingOpportunitiesById[opportunityId] = {
      apy,
      assetId,
      id: opportunityId,
      provider: DefiProvider.ShapeShift as const,
      tvl,
      type: DefiType.Staking as const,
      underlyingAssetId: rewardTokenAssetId,
      underlyingAssetIds: [tokenAssetId],
      underlyingAssetRatiosBaseUnit: [
        bn(1).times(bn(10).pow(underlyingAsset.precision)).toString(),
      ],
      name: underlyingAsset.symbol,
      rewardAssetIds: [],
      isClaimableRewards: true,
    }
  }

  const data = {
    byId: stakingOpportunitiesById,
    type: defiType,
  }

  return { data }
}

export const jinxStakingOpportunitiesUserDataResolver = async ({
  accountId,
  reduxApi,
  opportunityIds,
}: OpportunitiesUserDataResolverInput): Promise<{ data: GetOpportunityUserStakingDataOutput }> => {
  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency

  const stakingOpportunitiesUserDataByUserStakingId: OpportunitiesState['userStaking']['byId'] = {}

  const jinxInvestor = getJinxApi()

  for (const stakingOpportunityId of opportunityIds) {
    const balanceFilter = { accountId, assetId: jinxAssetId }
    const balance = selectPortfolioCryptoBalanceBaseUnitByFilter(state, balanceFilter)

    const asset = selectAssetById(state, jinxAssetId)
    if (!asset) continue

    const toAssetIdParts: ToAssetIdArgs = {
      assetNamespace: fromAssetId(stakingOpportunityId).assetNamespace,
      assetReference: fromAssetId(stakingOpportunityId).assetReference,
      chainId: fromAssetId(stakingOpportunityId).chainId,
    }
    const opportunityId = toOpportunityId(toAssetIdParts)
    const userStakingId = serializeUserStakingId(accountId, opportunityId)

    const opportunities = await jinxInvestor.getJinxOpportunities()

    // investor-jinx is architected around many FURYy addresses/opportunity, but akchually there's only one
    if (!opportunities[0]) continue

    const opportunity = opportunities[0]

    // FURYy is a rebasing token so there aren't rewards in the sense of rewards claim
    // These technically exist and are effectively accrued, but we're unable to derive them
    const rewardsAmountsCryptoBaseUnit = ['0'] as [string] | [string, string]

    const bip44Params = selectBIP44ParamsByAccountId(state, { accountId })

    if (!bip44Params) continue

    const withdrawInfo = await jinxInvestor.getWithdrawInfo({
      contractAddress: opportunity.contractAddress,
      userAddress: fromAccountId(accountId).account,
      bip44Params,
    })

    const undelegations = [
      {
        completionTime: dayjs(withdrawInfo.releaseTime).unix(),
        undelegationAmountCryptoBaseUnit: bnOrZero(withdrawInfo.amount).toFixed(),
      },
    ]

    stakingOpportunitiesUserDataByUserStakingId[userStakingId] = {
      userStakingId,
      stakedAmountCryptoBaseUnit: balance,
      rewardsCryptoBaseUnit: { amounts: rewardsAmountsCryptoBaseUnit, claimable: true },
      undelegations,
    }
  }

  const data = {
    byId: stakingOpportunitiesUserDataByUserStakingId,
  }

  return Promise.resolve({ data })
}

export const jinxStakingOpportunityIdsResolver = async (): Promise<{
  data: GetOpportunityIdsOutput
}> => {
  const opportunities = await getJinxApi().getJinxOpportunities()

  return {
    data: opportunities.map(opportunity => {
      const assetId = toOpportunityId({
        assetNamespace: 'erc20',
        assetReference: opportunity.contractAddress,
        chainId: ethChainId,
      })
      return assetId
    }),
  }
}
