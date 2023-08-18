import { KnownChainIds } from '@shapeshiftoss/types'
import type { Asset } from 'lib/asset-service'
import type { GetTradeQuoteInput, TradeQuote } from 'lib/swapper/api'
import { FURY_MAINNET, WETH } from 'lib/swapper/swappers/utils/test-data/assets'

import { DEFAULT_SLIPPAGE } from '../constants'

export const setupQuote = () => {
  const sellAsset: Asset = { ...FURY_MAINNET }
  const buyAsset: Asset = { ...WETH }
  const tradeQuote: TradeQuote<KnownChainIds.EthereumMainnet> = {
    rate: '1',
    steps: [
      {
        allowanceContract: 'allowanceContractAddress',
        buyAmountBeforeFeesCryptoBaseUnit: '',
        sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000',
        sellAsset,
        buyAsset,
        accountNumber: 0,
        feeData: {
          networkFeeCryptoBaseUnit: '0',
          protocolFees: {},
        },
        rate: '1',
        sources: [],
      },
    ],
  }

  const quoteInput: GetTradeQuoteInput = {
    chainId: KnownChainIds.EthereumMainnet,
    sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000',
    sellAsset,
    buyAsset,
    accountNumber: 0,
    receiveAddress: '0x3c3dc25ca709de108f6fc9b04bef5976876b05b1',
    affiliateBps: '0',
    supportsEIP1559: false,
    allowMultiHop: false,
    slippageTolerancePercentage: DEFAULT_SLIPPAGE,
  }
  return { quoteInput, tradeQuote, buyAsset, sellAsset }
}
