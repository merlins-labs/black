import type { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { TradeOpportunitiesBucket } from './components/TradeOpportunities'

export const TrimmedDescriptionLength = 191

export enum OpportunityTypes {
  LiquidityPool = 'liquidityPools',
  Farming = 'farming',
  BorrowingAndLending = 'borrowingAndLending',
}

export type ExternalOpportunity = {
  name: string | undefined
  type?: DefiType
  apy?: string | null
  link?: string
  icons?: string[] | undefined
  isLoaded?: boolean
  isDisabled?: boolean
  contractAddress?: string
  provider?: string
  highestBalanceAccountAddress?: string
}

export type OpportunitiesBucket = {
  type: OpportunityTypes | DefiType
  title: string
  opportunities: ExternalOpportunity[]
}

export const furyTradeOpportunitiesBuckets: TradeOpportunitiesBucket[] = [
  {
    title: 'plugins.furyPage.dex',
    opportunities: [
      {
        link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3c3dc25ca709de108f6fc9b04bef5976876b05b1&chain=mainnet',
        icon: 'uniswap.png',
      },
      {
        link: 'https://app.thorswap.finance/swap/ETH.ETH_ETH.FURY-0XC770EEFAD204B5180DF6A14EE197D99D808EE52D',
        icon: 'thorswap.png',
      },
    ],
  },
  {
    title: 'plugins.furyPage.centralized',
    opportunities: [
      {
        link: 'https://www.coinbase.com/price/fury-token',
        icon: 'coinbase.png',
      },
    ],
  },
]

export const jinxTradeOpportunitiesBuckets: TradeOpportunitiesBucket[] = [
  {
    title: 'plugins.furyPage.dex',
    opportunities: [
      {
        link: 'https://elasticswap.org/',
        icon: 'elasticswap.png',
      },
    ],
  },
]
