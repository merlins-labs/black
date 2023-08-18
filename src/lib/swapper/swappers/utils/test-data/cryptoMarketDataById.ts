import {
  AVAX,
  BSC,
  BTC,
  ETH,
  FURY_GNOSIS,
  FURY_MAINNET,
  OPTIMISM,
  RUNE,
  USDC_GNOSIS,
  USDC_MAINNET,
  WBTC,
  WETH,
} from 'lib/swapper/swappers/utils/test-data/assets'

export const cryptoMarketDataById = {
  [FURY_MAINNET.assetId]: { price: '0.04' },
  [FURY_GNOSIS.assetId]: { price: '0.04' },
  [ETH.assetId]: { price: '1300' },
  [AVAX.assetId]: { price: '14.63' },
  [BSC.assetId]: { price: '308.33' },
  [BTC.assetId]: { price: '26836' },
  [RUNE.assetId]: { price: '1.17' },
  [OPTIMISM.assetId]: { price: '1.69' },
  [USDC_MAINNET.assetId]: { price: '1.00' },
  [USDC_GNOSIS.assetId]: { price: '1.00' },
  [WBTC.assetId]: { price: '26783' },
  [WETH.assetId]: { price: '1300' },
}
