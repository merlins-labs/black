import { furyAssetId, jinxAssetId } from '@shapeshiftoss/caip'
import { matchPath } from 'react-router'

const FURY_PAGE_DEFAULT_ASSET = 'fury'

export const getFuryPageRouteAssetId = (pathname: string) => {
  const furyPageAssetIdPathMatch = matchPath<{ furyAsset?: 'fury' | 'jinx' }>(pathname, {
    path: '/fury/:furyAsset?',
  })

  const furyAsset = furyPageAssetIdPathMatch?.params?.furyAsset ?? FURY_PAGE_DEFAULT_ASSET

  return furyAsset === 'fury' ? furyAssetId : jinxAssetId
}
