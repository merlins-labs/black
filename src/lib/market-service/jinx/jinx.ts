import { ethereum } from '@shapeshiftoss/chain-adapters'
import type {
  HistoryData,
  MarketCapResult,
  MarketData,
  MarketDataArgs,
  PriceHistoryArgs,
} from '@shapeshiftoss/types'
import * as unchained from '@shapeshiftoss/unchained-client'
import { jinxAddresses, JinxApi } from 'lib/investor/investor-jinx'

import type { MarketService } from '../api'
import { CoinGeckoMarketService } from '../coingecko/coingecko'
import type { ProviderUrls } from '../market-service-manager'

export const JINX_ASSET_ID = 'eip155:1/erc20:0xDc49108ce5C57bc3408c3A5E95F3d864eC386Ed3'
const FURY_ASSET_ID = 'eip155:1/erc20:0x3c3dc25ca709de108f6fc9b04bef5976876b05b1'
const JINX_ASSET_PRECISION = '18'

export class JinxMarketService extends CoinGeckoMarketService implements MarketService {
  providerUrls: ProviderUrls

  constructor({ providerUrls }: { providerUrls: ProviderUrls }) {
    super()

    this.providerUrls = providerUrls
  }

  async findAll() {
    try {
      const assetId = JINX_ASSET_ID
      const marketData = await this.findByAssetId({ assetId })

      return { [assetId]: marketData } as MarketCapResult
    } catch (e) {
      console.warn(e)
      return {}
    }
  }

  async findByAssetId({ assetId }: MarketDataArgs): Promise<MarketData | null> {
    try {
      if (assetId.toLowerCase() !== JINX_ASSET_ID.toLowerCase()) {
        console.warn('JinxMarketService(findByAssetId): Failed to find by AssetId')
        return null
      }

      const coinGeckoData = await super.findByAssetId({
        assetId: FURY_ASSET_ID,
      })

      if (!coinGeckoData) return null

      const ethChainAdapter = new ethereum.ChainAdapter({
        providers: {
          ws: new unchained.ws.Client<unchained.ethereum.Tx>(
            this.providerUrls.unchainedEthereumWsUrl,
          ),
          http: new unchained.ethereum.V1Api(
            new unchained.ethereum.Configuration({
              basePath: this.providerUrls.unchainedEthereumHttpUrl,
            }),
          ),
        },
        rpcUrl: this.providerUrls.jsonRpcProviderUrl,
      })

      // Make maxSupply as an additional field, effectively EIP-20's totalSupply
      const api = new JinxApi({
        adapter: ethChainAdapter,
        providerUrl: this.providerUrls.jsonRpcProviderUrl,
        jinxAddresses,
      })

      const tokenContractAddress = jinxAddresses[0].jinx
      const jinxTotalSupply = await api.tvl({ tokenContractAddress })
      const supply = jinxTotalSupply

      return {
        price: coinGeckoData.price,
        marketCap: '0', // TODO: add marketCap once able to get jinx marketCap data
        changePercent24Hr: coinGeckoData.changePercent24Hr,
        volume: '0', // TODO: add volume once able to get jinx volume data
        supply: supply?.div(`1e+${JINX_ASSET_PRECISION}`).toString(),
        maxSupply: jinxTotalSupply?.div(`1e+${JINX_ASSET_PRECISION}`).toString(),
      }
    } catch (e) {
      console.warn(e)
      throw new Error('JinxMarketService(findByAssetId): error fetching market data')
    }
  }

  async findPriceHistoryByAssetId({
    assetId,
    timeframe,
  }: PriceHistoryArgs): Promise<HistoryData[]> {
    if (assetId.toLowerCase() !== JINX_ASSET_ID.toLowerCase()) {
      console.warn(
        'JinxMarketService(findPriceHistoryByAssetId): Failed to find price history by AssetId',
      )
      return []
    }

    try {
      const priceHistory = await super.findPriceHistoryByAssetId({
        assetId: FURY_ASSET_ID,
        timeframe,
      })
      return priceHistory
    } catch (e) {
      console.warn(e)
      throw new Error('JinxMarketService(findPriceHistoryByAssetId): error fetching price history')
    }
  }
}
