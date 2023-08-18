import type { AssetId } from '@shapeshiftoss/caip'
import type { Asset } from 'lib/asset-service'

const fury: Partial<Asset> = {
  color: '#3761F9',
  icon: 'https://assets.coincap.io/assets/icons/256/fury.png',
}

export const overrideAssets: Record<AssetId, Partial<Asset>> = {
  'eip155:1/erc20:0x3c3dc25ca709de108f6fc9b04bef5976876b05b1': {
    name: 'FURY on Ethereum',
    ...fury,
  },
  'eip155:10/erc20:0xf1a0da3367bc7aa04f8d94ba57b862ff37ced174': {
    name: 'FURY on Optimism',
    ...fury,
  },
  'eip155:100/erc20:0xb8bb23d6ffada23258c5b22aa25ac8706962b358': {
    name: 'FURY on Gnosis',
    ...fury,
  },
  'eip155:137/erc20:0x65a05db8322701724c197af82c9cae41195b0aa8': {
    name: 'FURY on Polygon',
    ...fury,
  },
  'eip155:100/erc20:0xddafbb505ad214d7b80b1f830fccc89b60fb7a83': {
    name: 'USD Coin on Gnosis',
    precision: 6,
  },
}
