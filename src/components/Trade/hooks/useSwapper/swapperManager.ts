import {
  avalancheChainId,
  bscChainId,
  ethChainId,
  optimismChainId,
  polygonChainId,
} from '@shapeshiftoss/caip'
import type {
  avalanche,
  bnbsmartchain,
  ethereum,
  optimism,
  polygon,
} from '@shapeshiftoss/chain-adapters'
import { KnownChainIds } from '@shapeshiftoss/types'
import { getConfig } from 'config'
import stableStringify from 'fast-json-stable-stringify'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { SwapperManager } from 'lib/swapper/manager/SwapperManager'
import { CowSwapper } from 'lib/swapper/swappers/CowSwapper/CowSwapper'
import { LifiSwapper } from 'lib/swapper/swappers/LifiSwapper/LifiSwapper'
import { OneInchSwapper } from 'lib/swapper/swappers/OneInchSwapper/OneInchSwapper'
import { OsmosisSwapper } from 'lib/swapper/swappers/OsmosisSwapper/OsmosisSwapper'
import { ThorchainSwapper } from 'lib/swapper/swappers/ThorchainSwapper/ThorchainSwapper'
import { ZrxSwapper } from 'lib/swapper/swappers/ZrxSwapper/ZrxSwapper'
import { getWeb3InstanceByChainId } from 'lib/web3-instance'
import type { FeatureFlags } from 'state/slices/preferencesSlice/preferencesSlice'

// singleton - do not export me, use getSwapperManager
let _swapperManager: Promise<SwapperManager> | undefined

// singleton - do not export me
// Used to short circuit calls to getSwapperManager if flags have not changed
let previousFlags: string = ''

export const _getSwapperManager = async (flags: FeatureFlags): Promise<SwapperManager> => {
  // instantiate if it doesn't already exist
  const swapperManager = new SwapperManager()

  const adapterManager = getChainAdapterManager()
  const ethWeb3 = getWeb3InstanceByChainId(ethChainId)
  const avaxWeb3 = getWeb3InstanceByChainId(avalancheChainId)
  const optimismWeb3 = getWeb3InstanceByChainId(optimismChainId)

  const ethereumChainAdapter = adapterManager.get(
    KnownChainIds.EthereumMainnet,
  ) as unknown as ethereum.ChainAdapter

  if (flags.Cowswap) {
    const cowSwapper = new CowSwapper({
      adapter: ethereumChainAdapter,
      apiUrl: getConfig().REACT_APP_COWSWAP_HTTP_URL,
      web3: ethWeb3,
    })
    swapperManager.addSwapper(cowSwapper)
  }

  if (flags.ZrxEthereumSwap) {
    const zrxEthereumSwapper = new ZrxSwapper({
      web3: ethWeb3,
      adapter: ethereumChainAdapter,
    })
    swapperManager.addSwapper(zrxEthereumSwapper)
  }

  if (flags.ZrxAvalancheSwap) {
    const avalancheChainAdapter = adapterManager.get(
      KnownChainIds.AvalancheMainnet,
    ) as unknown as avalanche.ChainAdapter

    const zrxAvalancheSwapper = new ZrxSwapper({
      web3: avaxWeb3,
      adapter: avalancheChainAdapter,
    })
    swapperManager.addSwapper(zrxAvalancheSwapper)
  }

  if (flags.ZrxOptimismSwap) {
    const optimismChainAdapter = adapterManager.get(
      KnownChainIds.OptimismMainnet,
    ) as unknown as optimism.ChainAdapter

    const zrxOptimismSwapper = new ZrxSwapper({
      web3: optimismWeb3,
      adapter: optimismChainAdapter,
    })
    swapperManager.addSwapper(zrxOptimismSwapper)
  }

  if (flags.ZrxBnbSmartChainSwap) {
    const bscWeb3 = getWeb3InstanceByChainId(bscChainId)

    const bscChainAdapter = adapterManager.get(
      KnownChainIds.BnbSmartChainMainnet,
    ) as unknown as bnbsmartchain.ChainAdapter

    const zrxBscSwapper = new ZrxSwapper({
      web3: bscWeb3,
      adapter: bscChainAdapter,
    })
    swapperManager.addSwapper(zrxBscSwapper)
  }

  if (flags.ZrxPolygonSwap) {
    const polygonWeb3 = getWeb3InstanceByChainId(polygonChainId)

    const polygonChainAdatper = adapterManager.get(
      KnownChainIds.PolygonMainnet,
    ) as unknown as polygon.ChainAdapter

    const zrxPolygonSwapper = new ZrxSwapper({
      web3: polygonWeb3,
      adapter: polygonChainAdatper,
    })
    swapperManager.addSwapper(zrxPolygonSwapper)
  }

  if (flags.ThorSwap) {
    const midgardUrl = getConfig().REACT_APP_MIDGARD_URL
    const daemonUrl = getConfig().REACT_APP_THORCHAIN_NODE_URL
    const thorSwapper = new ThorchainSwapper({
      daemonUrl,
      midgardUrl,
      adapterManager,
      web3: ethWeb3,
    })
    await thorSwapper.initialize()
    swapperManager.addSwapper(thorSwapper)
  }

  if (flags.OsmosisSwap) {
    const osmoUrl = `${getConfig().REACT_APP_OSMOSIS_NODE_URL}/lcd`
    const cosmosUrl = `${getConfig().REACT_APP_COSMOS_NODE_URL}/lcd`
    const osmoSwapper = new OsmosisSwapper({ adapterManager, osmoUrl, cosmosUrl })
    swapperManager.addSwapper(osmoSwapper)
  }

  if (flags.LifiSwap) {
    const lifiSwapper = new LifiSwapper()
    await lifiSwapper.initialize()
    swapperManager.addSwapper(lifiSwapper)
  }

  if (flags.OneInch) {
    const oneInchApiUrl = getConfig().REACT_APP_ONE_INCH_API_URL
    const oneInchSwapper = new OneInchSwapper({ apiUrl: oneInchApiUrl })
    swapperManager.addSwapper(oneInchSwapper)
  }

  return swapperManager
}

export const getSwapperManager = (flags: FeatureFlags): Promise<SwapperManager> => {
  const flagsChanged = previousFlags !== stableStringify(flags)
  if (!_swapperManager || flagsChanged) {
    _swapperManager = _getSwapperManager(flags)
    previousFlags = stableStringify(flags)
  }

  return _swapperManager
}
