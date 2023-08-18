import {
  BTC,
  ETH,
  FURY_GNOSIS,
  FURY_MAINNET,
  WBTC,
  WETH,
  XDAI,
} from 'lib/swapper/swappers/utils/test-data/assets'

import { cowSwapper } from './CowSwapper2'

jest.mock('./getCowSwapTradeQuote/getCowSwapTradeQuote', () => ({
  getCowSwapTradeQuote: jest.fn(),
}))

jest.mock('state/slices/assetsSlice/selectors', () => {
  const {
    BTC,
    ETH,
    FURY_GNOSIS,
    FURY_MAINNET,
    WBTC,
    WETH,
    XDAI,
  } = require('lib/swapper/swappers/utils/test-data/assets')

  return {
    ...jest.requireActual('state/slices/assetsSlice/selectors'),
    selectAssets: jest.fn(() => ({
      [BTC.assetId]: BTC,
      [ETH.assetId]: ETH,
      [FURY_GNOSIS.assetId]: FURY_GNOSIS,
      [FURY_MAINNET.assetId]: FURY_MAINNET,
      [WBTC.assetId]: WBTC,
      [WETH.assetId]: WETH,
      [XDAI.assetId]: XDAI,
    })),
  }
})

const ASSETS = [ETH, WBTC, WETH, BTC, FURY_MAINNET, XDAI]

describe('CowSwapper', () => {
  describe('filterAssetIdsBySellable', () => {
    it('returns empty array when called with an empty array', async () => {
      expect(await cowSwapper.filterAssetIdsBySellable([])).toEqual([])
    })

    it('returns array filtered out of non erc20 tokens', async () => {
      expect(await cowSwapper.filterAssetIdsBySellable(ASSETS)).toEqual([
        WBTC.assetId,
        WETH.assetId,
        FURY_MAINNET.assetId,
      ])
    })

    it('returns array filtered out of unsupported tokens', async () => {
      const assetIds = [FURY_MAINNET, FURY_GNOSIS, BTC]

      expect(await cowSwapper.filterAssetIdsBySellable(assetIds)).toEqual([
        FURY_MAINNET.assetId,
        FURY_GNOSIS.assetId,
      ])
    })
  })

  describe('filterBuyAssetsBySellAssetId', () => {
    it('returns empty array when called with an empty assetIds array', async () => {
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: [],
          sellAsset: WETH,
        }),
      ).toEqual([])
    })

    it('returns empty array when called with sellAssetId that is not sellable', async () => {
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: ASSETS,
          sellAsset: ETH,
        }),
      ).toEqual([])
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: ASSETS,
          sellAsset: BTC,
        }),
      ).toEqual([])
    })

    it('returns array filtered out of non erc20 tokens when called with a sellable sellAssetId', async () => {
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: ASSETS,
          sellAsset: WETH,
        }),
      ).toEqual([ETH.assetId, WBTC.assetId, FURY_MAINNET.assetId])
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: ASSETS,
          sellAsset: WBTC,
        }),
      ).toEqual([ETH.assetId, WETH.assetId, FURY_MAINNET.assetId])
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets: ASSETS,
          sellAsset: FURY_MAINNET,
        }),
      ).toEqual([ETH.assetId, WBTC.assetId, WETH.assetId])
    })

    it('returns array filtered out of unsupported tokens when called with a sellable sellAssetId', async () => {
      const assets = [FURY_MAINNET, BTC]
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets,
          sellAsset: WETH,
        }),
      ).toEqual([FURY_MAINNET.assetId])
      expect(
        await cowSwapper.filterBuyAssetsBySellAssetId({
          assets,
          sellAsset: FURY_MAINNET,
        }),
      ).toEqual([])
    })
  })
})
