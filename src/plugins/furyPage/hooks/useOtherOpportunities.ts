import type { AssetId } from '@shapeshiftoss/caip'
import { fromAccountId, fromAssetId, furyAssetId, jinxAssetId } from '@shapeshiftoss/caip'
import { useMemo } from 'react'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { jinxAddresses } from 'lib/investor/investor-jinx'
import {
  furyEthLpAssetId,
  furyEthStakingAssetIdV7,
} from 'state/slices/opportunitiesSlice/constants'
import type { StakingId } from 'state/slices/opportunitiesSlice/types'
import { DefiType } from 'state/slices/opportunitiesSlice/types'
import {
  selectAggregatedEarnUserLpOpportunity,
  selectHighestBalanceAccountIdByLpId,
  selectHighestBalanceAccountIdByStakingId,
  selectLpOpportunitiesById,
  selectStakingOpportunitiesById,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import type { OpportunitiesBucket } from '../FuryCommon'
import { OpportunityTypes } from '../FuryCommon'

export const useOtherOpportunities = (assetId: AssetId) => {
  const highestFarmingBalanceAccountIdFilter = useMemo(
    () => ({
      stakingId: furyEthStakingAssetIdV7 as StakingId,
    }),
    [],
  )
  const highestFarmingBalanceAccountId = useAppSelector(state =>
    selectHighestBalanceAccountIdByStakingId(state, highestFarmingBalanceAccountIdFilter),
  )

  const lpOpportunitiesById = useAppSelector(selectLpOpportunitiesById)

  const defaultLpOpportunityData = useMemo(
    () => lpOpportunitiesById[furyEthLpAssetId],
    [lpOpportunitiesById],
  )
  const lpOpportunityId = furyEthLpAssetId
  const highestBalanceLpAccountIdFilter = useMemo(
    () => ({ lpId: lpOpportunityId }),
    [lpOpportunityId],
  )
  const highestBalanceLpAccountId = useAppSelector(state =>
    selectHighestBalanceAccountIdByLpId(state, highestBalanceLpAccountIdFilter),
  )

  const furyEthLpOpportunityFilter = useMemo(
    () => ({
      lpId: furyEthLpAssetId,
      assetId: furyEthLpAssetId,
    }),
    [],
  )
  const furyEthLpOpportunity = useAppSelector(state =>
    selectAggregatedEarnUserLpOpportunity(state, furyEthLpOpportunityFilter),
  )

  const stakingOpportunities = useAppSelector(selectStakingOpportunitiesById)

  const furyFarmingOpportunityMetadata = useMemo(
    () => stakingOpportunities[furyEthStakingAssetIdV7 as StakingId],
    [stakingOpportunities],
  )

  const otherOpportunities = useMemo(() => {
    const opportunities: Record<AssetId, OpportunitiesBucket[]> = {
      [furyAssetId]: [
        {
          type: DefiType.Staking,
          title: 'plugins.furyPage.farming',
          opportunities: [
            ...(furyFarmingOpportunityMetadata
              ? [
                  {
                    ...furyFarmingOpportunityMetadata,
                    apy: Boolean(defaultLpOpportunityData && furyFarmingOpportunityMetadata)
                      ? bnOrZero(furyFarmingOpportunityMetadata?.apy)
                          .plus(defaultLpOpportunityData?.apy ?? 0)
                          .toString()
                      : undefined,
                    contractAddress: fromAssetId(furyFarmingOpportunityMetadata.assetId)
                      .assetReference,
                    highestBalanceAccountAddress:
                      highestFarmingBalanceAccountId &&
                      fromAccountId(highestFarmingBalanceAccountId).account,
                  },
                ]
              : []),
          ],
        },
        {
          type: DefiType.LiquidityPool,
          title: 'plugins.furyPage.liquidityPools',
          opportunities: [
            ...(furyEthLpOpportunity
              ? [
                  {
                    ...furyEthLpOpportunity,
                    type: DefiType.LiquidityPool,
                    contractAddress: fromAssetId(furyEthLpAssetId).assetReference,
                    highestBalanceAccountAddress:
                      highestBalanceLpAccountId && fromAccountId(highestBalanceLpAccountId).account,
                  },
                ]
              : []),
          ],
        },
        {
          type: OpportunityTypes.BorrowingAndLending,
          title: 'plugins.furyPage.borrowingAndLending',
          opportunities: [
            {
              name: 'FURY',
              isLoaded: true,
              apy: null,
              link: 'https://app.rari.capital/fuse/pool/79',
              icons: ['https://assets.coincap.io/assets/icons/256/fury.png'],
              isDisabled: true,
            },
          ],
        },
      ],
      [jinxAssetId]: [
        {
          type: OpportunityTypes.LiquidityPool,
          title: 'plugins.furyPage.liquidityPools',
          opportunities: [
            {
              name: 'ElasticSwap',
              contractAddress: jinxAddresses[0].staking,
              isLoaded: true, // No network request here
              apy: null,
              link: 'https://elasticswap.org/#/liquidity',
              icons: [
                'https://raw.githubusercontent.com/shapeshift/lib/main/packages/asset-service/src/generateAssetData/ethereum/icons/jinx-icon.png',
              ],
            },
          ],
        },
      ],
    }

    return opportunities[assetId]
  }, [
    assetId,
    defaultLpOpportunityData,
    furyFarmingOpportunityMetadata,
    furyEthLpOpportunity,
    highestBalanceLpAccountId,
    highestFarmingBalanceAccountId,
  ])

  return otherOpportunities
}
