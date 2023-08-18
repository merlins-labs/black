import type { AssetId } from '@shapeshiftoss/caip'
import { furyAssetId } from '@shapeshiftoss/caip'

import type { CreateUrlProps } from '../types'

type SupportedAssetReturn = {
  buy: AssetId[]
  sell: AssetId[]
}

export const getCoinbaseSupportedAssets = (): SupportedAssetReturn => {
  return {
    buy: [furyAssetId],
    sell: [furyAssetId],
  }
}

export const createCoinbaseUrl = ({ assetId }: CreateUrlProps): string => {
  // this is a very specific use case and doesn't need an adpater
  const tickers = { [furyAssetId]: 'fury-token' }
  const ticker = tickers[assetId]
  return `https://www.coinbase.com/price/${ticker}`
}
