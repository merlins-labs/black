import { KnownChainIds } from '@shapeshiftoss/types'
import { Ok } from '@sniptt/monads'
import type { AxiosStatic } from 'axios'

import type { GetTradeQuoteInput, TradeQuote } from '../../../api'
import { SwapperName } from '../../../api'
import { ETH, FURY_MAINNET, USDC_GNOSIS, WETH, XDAI } from '../../utils/test-data/assets'
import {
  COW_SWAP_NATIVE_ASSET_MARKER_ADDRESS,
  DEFAULT_ADDRESS,
  DEFAULT_APP_DATA,
  ERC20_TOKEN_BALANCE,
} from '../utils/constants'
import { cowService } from '../utils/cowService'
import type { CowSwapSellQuoteApiInput } from '../utils/helpers/helpers'
import { getCowSwapTradeQuote } from './getCowSwapTradeQuote'

const furyRate = '0.0873'
const usdcXdaiRate = '1.001'
const ethRate = '1233.65940923824103061992'
const wethRate = '1233.65940923824103061992'

jest.mock('@shapeshiftoss/chain-adapters')
jest.mock('../utils/cowService', () => {
  const axios: AxiosStatic = jest.createMockFromModule('axios')
  axios.create = jest.fn(() => axios)

  return {
    cowService: axios.create(),
  }
})
jest.mock('../utils/helpers/helpers', () => {
  return {
    ...jest.requireActual('../utils/helpers/helpers'),
    getNowPlusThirtyMinutesTimestamp: () => 1656797787,
  }
})

jest.mock('../../utils/helpers/helpers', () => {
  return {
    ...jest.requireActual('../../utils/helpers/helpers'),
    getApproveContractData: () => '0xABCDEFGH',
  }
})

const expectedApiInputWethToFury: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0x3c3dc25ca709de108f6fc9b04bef5976876b05b1',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '1000000000000000000',
  sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  validTo: 1656797787,
}

const expectedApiInputSmallAmountWethToFury: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0x3c3dc25ca709de108f6fc9b04bef5976876b05b1',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '1000000000000',
  sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  validTo: 1656797787,
}

const expectedApiInputFuryToEth: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '1000000000000000000000',
  sellToken: '0x3c3dc25ca709de108f6fc9b04bef5976876b05b1',
  validTo: 1656797787,
}

const expectedApiInputUsdcGnosisToXdai: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: COW_SWAP_NATIVE_ASSET_MARKER_ADDRESS,
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '20000000',
  sellToken: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
  validTo: 1656797787,
}

const expectedTradeQuoteWethToFury: TradeQuote<KnownChainIds.EthereumMainnet> = {
  id: '123',
  rate: '14924.80846543344314936607', // 14942 FURY per WETH
  steps: [
    {
      allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      rate: '14924.80846543344314936607', // 14942 FURY per WETH
      feeData: {
        protocolFees: {
          [WETH.assetId]: {
            amountCryptoBaseUnit: '14557942658757988',
            requiresBalance: false,
            asset: WETH,
          },
        },
        networkFeeCryptoBaseUnit: '0',
      },
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000',
      buyAmountBeforeFeesCryptoBaseUnit: '14913256100953839475750', // 14913 FURY
      sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
      buyAsset: FURY_MAINNET,
      sellAsset: WETH,
      accountNumber: 0,
    },
  ],
}

const expectedTradeQuoteFuryToEth: TradeQuote<KnownChainIds.EthereumMainnet> = {
  id: '123',
  rate: '0.00004995640398295996',
  steps: [
    {
      allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      rate: '0.00004995640398295996',
      feeData: {
        protocolFees: {
          [FURY_MAINNET.assetId]: {
            amountCryptoBaseUnit: '61804771879693983744',
            requiresBalance: false,
            asset: FURY_MAINNET,
          },
        },
        networkFeeCryptoBaseUnit: '0',
      },
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000000',
      buyAmountBeforeFeesCryptoBaseUnit: '51242479117266593',
      sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
      buyAsset: ETH,
      sellAsset: FURY_MAINNET,
      accountNumber: 0,
    },
  ],
}

const expectedTradeQuoteUsdcToXdai: TradeQuote<KnownChainIds.GnosisMainnet> = {
  id: '123',
  rate: '1.0003121775396440882',
  steps: [
    {
      allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      rate: '1.0003121775396440882',
      feeData: {
        protocolFees: {
          [USDC_GNOSIS.assetId]: {
            amountCryptoBaseUnit: '1188',
            requiresBalance: false,
            asset: USDC_GNOSIS,
          },
        },
        networkFeeCryptoBaseUnit: '0',
      },
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '20000000',
      buyAmountBeforeFeesCryptoBaseUnit: '21006555357465608755',
      sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
      buyAsset: XDAI,
      sellAsset: USDC_GNOSIS,
      accountNumber: 0,
    },
  ],
}

const expectedTradeQuoteSmallAmountWethToFury: TradeQuote<KnownChainIds.EthereumMainnet> = {
  id: '123',
  rate: '14716.04718939437523468382', // 14716 FURY per WETH
  steps: [
    {
      allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      rate: '14716.04718939437523468382', // 14716 FURY per WETH
      feeData: {
        protocolFees: {
          [WETH.assetId]: {
            amountCryptoBaseUnit: '1455794265875791',
            requiresBalance: false,
            asset: WETH,
          },
        },
        networkFeeCryptoBaseUnit: '0',
      },
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000',
      buyAmountBeforeFeesCryptoBaseUnit: '165590332317788059940', // 165.59 FURY
      sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
      buyAsset: FURY_MAINNET,
      sellAsset: WETH,
      accountNumber: 0,
    },
  ],
}

describe('getCowTradeQuote', () => {
  it('should throw an exception if sell asset is not an erc20', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: ETH,
      buyAsset: FURY_MAINNET,
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '11111',
      accountNumber: 0,
      receiveAddress: DEFAULT_ADDRESS,
      affiliateBps: '0',
      supportsEIP1559: false,
      allowMultiHop: false,
      slippageTolerancePercentage: '0.005', // 0.5%
    }

    const maybeTradeQuote = await getCowSwapTradeQuote(input, {
      sellAssetUsdRate: ethRate,
      buyAssetUsdRate: furyRate,
    })
    expect(maybeTradeQuote.isErr()).toBe(true)
    expect(maybeTradeQuote.unwrapErr()).toMatchObject({
      cause: undefined,
      code: 'UNSUPPORTED_PAIR',
      details: { sellAsset: ETH },
      message: '[CowSwap: assertValidTrade] - Sell asset must be an ERC-20',
      name: 'SwapError',
    })
  })

  it('should call cowService with correct parameters, handle the fees and return the correct trade quote when selling WETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: WETH,
      buyAsset: FURY_MAINNET,
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000',
      accountNumber: 0,
      receiveAddress: DEFAULT_ADDRESS,
      affiliateBps: '0',
      supportsEIP1559: false,
      allowMultiHop: false,
      slippageTolerancePercentage: '0.005', // 0.5%
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve(
        Ok({
          data: {
            id: 123,
            quote: {
              ...expectedApiInputWethToFury,
              sellAmountBeforeFee: undefined,
              sellAmount: '985442057341242012',
              buyAmount: '14707533959600717283163',
              feeAmount: '14557942658757988',
              sellTokenBalance: ERC20_TOKEN_BALANCE,
              buyTokenBalance: ERC20_TOKEN_BALANCE,
            },
          },
        }),
      ),
    )

    const maybeTradeQuote = await getCowSwapTradeQuote(input, {
      sellAssetUsdRate: wethRate,
      buyAssetUsdRate: furyRate,
    })

    expect(maybeTradeQuote.isOk()).toBe(true)
    expect(maybeTradeQuote.unwrap()).toEqual(expectedTradeQuoteWethToFury)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputWethToFury,
    )
  })

  it('should call cowService with correct parameters, handle the fees and return the correct trade quote when buying ETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: FURY_MAINNET,
      buyAsset: ETH,
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000000000000',
      accountNumber: 0,
      receiveAddress: DEFAULT_ADDRESS,
      affiliateBps: '0',
      supportsEIP1559: false,
      allowMultiHop: false,
      slippageTolerancePercentage: '0.005', // 0.5%
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve(
        Ok({
          data: {
            id: 123,
            quote: {
              ...expectedApiInputFuryToEth,
              sellAmountBeforeFee: undefined,
              sellAmount: '938195228120306016256',
              buyAmount: '46868859830863283',
              feeAmount: '61804771879693983744',
              sellTokenBalance: ERC20_TOKEN_BALANCE,
              buyTokenBalance: ERC20_TOKEN_BALANCE,
            },
          },
        }),
      ),
    )

    const maybeTradeQuote = await getCowSwapTradeQuote(input, {
      sellAssetUsdRate: furyRate,
      buyAssetUsdRate: ethRate,
    })

    expect(maybeTradeQuote.isOk()).toBe(true)
    expect(maybeTradeQuote.unwrap()).toEqual(expectedTradeQuoteFuryToEth)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputFuryToEth,
    )
  })

  it('should call cowService with correct parameters, handle the fees and return the correct trade quote when buying XDAI', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.GnosisMainnet,
      sellAsset: USDC_GNOSIS,
      buyAsset: XDAI,
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '20000000',
      accountNumber: 0,
      receiveAddress: DEFAULT_ADDRESS,
      affiliateBps: '0',
      supportsEIP1559: false,
      allowMultiHop: false,
      slippageTolerancePercentage: '0.005', // 0.5%
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve(
        Ok({
          data: {
            id: 123,
            quote: {
              ...expectedApiInputUsdcGnosisToXdai,
              sellAmountBeforeFee: undefined,
              sellAmount: '20998812',
              buyAmount: '21005367357465608755',
              feeAmount: '1188',
              sellTokenBalance: ERC20_TOKEN_BALANCE,
              buyTokenBalance: ERC20_TOKEN_BALANCE,
            },
          },
        }),
      ),
    )

    const maybeTradeQuote = await getCowSwapTradeQuote(input, {
      sellAssetUsdRate: usdcXdaiRate,
      buyAssetUsdRate: usdcXdaiRate,
    })

    expect(maybeTradeQuote.isOk()).toBe(true)
    expect(maybeTradeQuote.unwrap()).toEqual(expectedTradeQuoteUsdcToXdai)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/xdai/api/v1/quote/',
      expectedApiInputUsdcGnosisToXdai,
    )
  })

  it('should call cowService with correct parameters and return quote with original sellAmount when selling a very small amount of WETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: WETH,
      buyAsset: FURY_MAINNET,
      sellAmountIncludingProtocolFeesCryptoBaseUnit: '1000000000000',
      accountNumber: 0,
      receiveAddress: DEFAULT_ADDRESS,
      affiliateBps: '0',
      supportsEIP1559: false,
      allowMultiHop: false,
      slippageTolerancePercentage: '0.005', // 0.5%
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve(
        Ok({
          data: {
            id: 123,
            quote: {
              ...expectedApiInputSmallAmountWethToFury,
              sellAmountBeforeFee: undefined,
              sellAmount: '9854420573412420',
              buyAmount: '145018118182475950905',
              feeAmount: '1455794265875791',
              sellTokenBalance: ERC20_TOKEN_BALANCE,
              buyTokenBalance: ERC20_TOKEN_BALANCE,
            },
          },
        }),
      ),
    )

    const maybeTradeQuote = await getCowSwapTradeQuote(input, {
      sellAssetUsdRate: wethRate,
      buyAssetUsdRate: furyRate,
    })

    expect(maybeTradeQuote.isErr()).toBe(false)
    expect(maybeTradeQuote.unwrap()).toEqual(expectedTradeQuoteSmallAmountWethToFury)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputSmallAmountWethToFury,
    )
  })
})
