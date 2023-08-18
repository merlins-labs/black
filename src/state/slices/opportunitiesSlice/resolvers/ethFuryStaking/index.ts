import { fromAccountId, fromAssetId, furyAssetId } from '@shapeshiftoss/caip'
import type { MarketData } from '@shapeshiftoss/types'
import { ETH_FURY_POOL_CONTRACT_ADDRESS } from 'contracts/constants'
import { fetchUniV2PairData, getOrCreateContractByAddress } from 'contracts/contractManager'
import dayjs from 'dayjs'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { toBaseUnit } from 'lib/math'
import type { AssetsState } from 'state/slices/assetsSlice/assetsSlice'
import { selectMarketDataById } from 'state/slices/marketDataSlice/selectors'

import {
  assertIsFuryEthStakingContractAddress,
  furyEthLpAssetId,
  furyEthPair,
  furyEthStakingIds,
  STAKING_ID_TO_VERSION,
} from '../../constants'
import type {
  GetOpportunityIdsOutput,
  GetOpportunityMetadataOutput,
  GetOpportunityUserStakingDataOutput,
} from '../../types'
import { DefiProvider, DefiType } from '../../types'
import { serializeUserStakingId } from '../../utils'
import type { OpportunityMetadataResolverInput, OpportunityUserDataResolverInput } from '../types'
import { makeTotalLpApr, rewardRatePerToken } from './utils'

export const ethFuryStakingMetadataResolver = async ({
  opportunityId,
  defiType,
  reduxApi,
}: OpportunityMetadataResolverInput): Promise<{
  data: GetOpportunityMetadataOutput
}> => {
  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency
  const assets: AssetsState = state.assets
  const lpAssetPrecision = assets.byId[furyEthLpAssetId]?.precision ?? 0
  const lpTokenMarketData: MarketData = selectMarketDataById(state, furyEthLpAssetId)
  const lpTokenPrice = lpTokenMarketData?.price

  const { assetReference: contractAddress } = fromAssetId(opportunityId)

  if (bnOrZero(lpTokenPrice).isZero()) {
    throw new Error(`Market data not ready for ${furyEthLpAssetId}`)
  }

  assertIsFuryEthStakingContractAddress(contractAddress)
  const furyFarmingContract = getOrCreateContractByAddress(contractAddress)
  const uniV2LPContract = getOrCreateContractByAddress(ETH_FURY_POOL_CONTRACT_ADDRESS)

  // tvl
  const totalSupply = await furyFarmingContract.totalSupply()
  const tvl = bnOrZero(totalSupply.toString())
    .div(bn(10).pow(lpAssetPrecision))
    .times(lpTokenPrice)
    .toFixed(2)

  // apr
  const furyRewardRatePerTokenV7 = await rewardRatePerToken(furyFarmingContract)

  const pair = await fetchUniV2PairData(furyEthLpAssetId)

  // Getting the ratio of the LP token for each asset
  const reserves = await uniV2LPContract.getReserves()
  const lpTotalSupply = (await uniV2LPContract.totalSupply()).toString()
  const furyReserves = bnOrZero(bnOrZero(reserves[1].toString()).toString())
  const ethReserves = bnOrZero(bnOrZero(reserves[0].toString()).toString())
  const ethPoolRatio = ethReserves.div(lpTotalSupply).toString()
  const furyPoolRatio = furyReserves.div(lpTotalSupply).toString()

  const totalSupplyV2 = await uniV2LPContract.totalSupply()

  const token1PoolReservesEquivalent = bnOrZero(pair.reserve1.toFixed())
    .times(2) // Double to get equivalent of both sides of pool
    .times(bn(10).pow(pair.token1.decimals)) // convert to base unit value

  const furyEquivalentPerLPToken = token1PoolReservesEquivalent
    .div(bnOrZero(totalSupplyV2.toString()))
    .times(bn(10).pow(pair.token1.decimals)) // convert to base unit value
    .toString()
  const apy = bnOrZero(makeTotalLpApr(furyRewardRatePerTokenV7, furyEquivalentPerLPToken))
    .div(100)
    .toString()

  const timeStamp = await furyFarmingContract.periodFinish()
  const expired =
    timeStamp.toNumber() === 0 ? false : dayjs().isAfter(dayjs.unix(timeStamp.toNumber()))
  const version = STAKING_ID_TO_VERSION[opportunityId]

  const data = {
    byId: {
      [opportunityId]: {
        apy,
        assetId: opportunityId,
        id: opportunityId,
        provider: DefiProvider.EthFuryStaking,
        tvl,
        type: DefiType.Staking,
        underlyingAssetId: furyEthLpAssetId,
        underlyingAssetIds: furyEthPair,
        underlyingAssetRatiosBaseUnit: [
          toBaseUnit(ethPoolRatio.toString(), assets.byId[furyEthPair[0]]?.precision ?? 0),
          toBaseUnit(furyPoolRatio.toString(), assets.byId[furyEthPair[1]]?.precision ?? 0),
        ] as const,
        expired,
        name: 'Fury Farming',
        version,
        rewardAssetIds: [furyAssetId] as const,
        isClaimableRewards: true,
      },
    },
    type: defiType,
  } as const

  return { data }
}

export const ethFuryStakingUserDataResolver = async ({
  opportunityId,
  accountId,
  reduxApi,
}: OpportunityUserDataResolverInput): Promise<{ data: GetOpportunityUserStakingDataOutput }> => {
  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency
  const lpTokenMarketData: MarketData = selectMarketDataById(state, furyEthLpAssetId)
  const lpTokenPrice = lpTokenMarketData?.price

  const { assetReference: contractAddress } = fromAssetId(opportunityId)
  const { account: accountAddress } = fromAccountId(accountId)

  if (bnOrZero(lpTokenPrice).isZero()) {
    throw new Error(`Market data not ready for ${furyEthLpAssetId}`)
  }

  assertIsFuryEthStakingContractAddress(contractAddress)

  const furyFarmingContract = getOrCreateContractByAddress(contractAddress)

  const stakedBalance = await furyFarmingContract.balanceOf(accountAddress)
  const earned = await furyFarmingContract.earned(accountAddress)
  const stakedAmountCryptoBaseUnit = bnOrZero(stakedBalance.toString()).toString()
  const rewardsCryptoBaseUnit = { amounts: [earned.toString()] as [string], claimable: true }

  const userStakingId = serializeUserStakingId(accountId, opportunityId)

  const data = {
    byId: {
      [userStakingId]: {
        userStakingId,
        stakedAmountCryptoBaseUnit,
        rewardsCryptoBaseUnit,
      },
    },
    type: DefiType.Staking,
  }

  return { data }
}

export const ethFuryStakingOpportunityIdsResolver = (): Promise<{
  data: GetOpportunityIdsOutput
}> => Promise.resolve({ data: [...furyEthStakingIds] })
