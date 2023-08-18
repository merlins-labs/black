import { CosmosManager } from 'features/defi/providers/cosmos/components/CosmosManager/CosmosManager'
import { FuryFarmingManager } from 'features/defi/providers/fury-farming/components/FuryFarmingManager/FuryFarmingManager'
import { IdleManager } from 'features/defi/providers/idle/components/IdleManager/IdleManager'
import { JinxManager } from 'features/defi/providers/jinx/components/JinxManager/JinxManager'
import { OsmosisManager } from 'features/defi/providers/osmosis/components/OsmosisManager/OsmosisManager'
import { ThorchainSaversManager } from 'features/defi/providers/thorchain-savers/components/ThorchainSaversManager/ThorchainSaversManager'
import { UniV2LpManager } from 'features/defi/providers/univ2/components/UniV2Manager/UniV2LpManager'
import { DefiProvider, DefiType } from 'state/slices/opportunitiesSlice/types'

export const DefiProviderToDefiModuleResolverByDeFiType = {
  [`${DefiProvider.UniV2}`]: {
    [`${DefiType.LiquidityPool}`]: UniV2LpManager,
  },
  [`${DefiProvider.EthFuryStaking}`]: {
    [`${DefiType.Staking}`]: FuryFarmingManager,
  },
  [DefiProvider.Idle]: {
    [`${DefiType.Staking}`]: IdleManager,
  },
  [DefiProvider.ThorchainSavers]: {
    [`${DefiType.Staking}`]: ThorchainSaversManager,
  },
  [DefiProvider.ShapeShift]: JinxManager,
  [DefiProvider.CosmosSdk]: CosmosManager,
  [DefiProvider.OsmosisLp]: OsmosisManager,
}
// Not curried since we can either have a list of providers by DefiType, or a single one for providers not yet migrated to the abstraction
export const getDefiProviderModulesResolvers = (defiProvider: DefiProvider) =>
  DefiProviderToDefiModuleResolverByDeFiType[defiProvider]
