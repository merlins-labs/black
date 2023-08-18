import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react'
import type { AssetId, ToAssetIdArgs } from '@shapeshiftoss/caip'
import { ethChainId, furyAssetId, jinxAssetId } from '@shapeshiftoss/caip'
import { supportsETH } from '@shapeshiftoss/hdwallet-core'
import qs from 'qs'
import { useCallback, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { useHistory, useLocation } from 'react-router'
import { AssetMarketData } from 'components/AssetHeader/AssetMarketData'
import { SEO } from 'components/Layout/Seo'
import { WalletActions } from 'context/WalletProvider/actions'
import { useRouteAssetId } from 'hooks/useRouteAssetId/useRouteAssetId'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { jinxAddresses } from 'lib/investor/investor-jinx'
import { trackOpportunityEvent } from 'lib/mixpanel/helpers'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { useGetJinxAprQuery } from 'state/apis/jinx/jinxApi'
import { useGetAssetDescriptionQuery } from 'state/slices/assetsSlice/assetsSlice'
import { DefiProvider } from 'state/slices/opportunitiesSlice/types'
import { toOpportunityId } from 'state/slices/opportunitiesSlice/utils'
import {
  selectAggregatedEarnUserStakingOpportunityByStakingId,
  selectAssetById,
  selectAssets,
  selectPortfolioCryptoPrecisionBalanceByFilter,
  selectPortfolioUserCurrencyBalanceByAssetId,
  selectSelectedLocale,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'
import { breakpoints } from 'theme/theme'

import { AssetActions } from './components/AssetActions'
import { BondProtocolCta } from './components/BondProtocolCta'
import { DappBack } from './components/DappBack'
import { FuryChart } from './components/FuryChart'
import { FuryTab } from './components/FuryTab'
import { Governance } from './components/Governance'
import { Layout } from './components/Layout'
import { MainOpportunity } from './components/MainOpportunity'
import { OtherOpportunities } from './components/OtherOpportunities/OtherOpportunities'
import { Total } from './components/Total'
import type { TradeOpportunitiesBucket } from './components/TradeOpportunities'
import { TradeOpportunities } from './components/TradeOpportunities'
import { furyTradeOpportunitiesBuckets, jinxTradeOpportunitiesBuckets } from './FuryCommon'
import { useOtherOpportunities } from './hooks/useOtherOpportunities'

export enum FuryPageRoutes {
  Fury = '/fury/fury',
  Jinx = '/fury/jinx',
}

const assetsRoutes: Record<AssetId, FuryPageRoutes> = {
  [furyAssetId]: FuryPageRoutes.Fury,
  [jinxAssetId]: FuryPageRoutes.Jinx,
}

const assetsTradeOpportunitiesBuckets: Record<AssetId, TradeOpportunitiesBucket[]> = {
  [furyAssetId]: furyTradeOpportunitiesBuckets,
  [jinxAssetId]: jinxTradeOpportunitiesBuckets,
}

export const FuryPage = () => {
  const {
    state: { wallet },
    dispatch,
  } = useWallet()
  const translate = useTranslate()
  const history = useHistory()
  const location = useLocation()
  const mixpanel = getMixPanel()

  const activeAssetId = useRouteAssetId()
  const allAssets = useAppSelector(selectAssets)
  // TODO(gomes): Use useRouteAssetId and selectAssetById programmatically
  const assetFury = useAppSelector(state => selectAssetById(state, furyAssetId))
  const assetJinx = useAppSelector(state => selectAssetById(state, jinxAssetId))
  if (!assetFury) throw new Error(`Asset not found for AssetId ${furyAssetId}`)
  if (!assetJinx) throw new Error(`Asset not found for AssetId ${jinxAssetId}`)

  const otherOpportunities = useOtherOpportunities(activeAssetId)

  const assets = useMemo(() => [assetFury, assetJinx], [assetFury, assetJinx])

  const selectedAssetIndex = useMemo(
    () => assets.findIndex(asset => asset?.assetId === activeAssetId),
    [activeAssetId, assets],
  )

  const selectedAsset = assets[selectedAssetIndex]

  const furyFilter = useMemo(() => ({ assetId: furyAssetId }), [])
  const jinxFilter = useMemo(() => ({ assetId: jinxAssetId }), [])
  const fiatBalanceFury =
    useAppSelector(s => selectPortfolioUserCurrencyBalanceByAssetId(s, furyFilter)) ?? '0'
  const fiatBalanceJinx =
    useAppSelector(s => selectPortfolioUserCurrencyBalanceByAssetId(s, jinxFilter)) ?? '0'
  const cryptoHumanBalanceFury =
    useAppSelector(s => selectPortfolioCryptoPrecisionBalanceByFilter(s, furyFilter)) ?? '0'
  const cryptoHumanBalanceJinx =
    useAppSelector(s => selectPortfolioCryptoPrecisionBalanceByFilter(s, jinxFilter)) ?? '0'

  const fiatBalances = useMemo(
    () => [fiatBalanceFury, fiatBalanceJinx],
    [fiatBalanceFury, fiatBalanceJinx],
  )

  const cryptoHumanBalances = useMemo(
    () => [cryptoHumanBalanceFury, cryptoHumanBalanceJinx],
    [cryptoHumanBalanceFury, cryptoHumanBalanceJinx],
  )

  const { data: jinxAprData, isLoading: isJinxAprLoading } = useGetJinxAprQuery()

  const totalFiatBalance = bnOrZero(fiatBalanceFury).plus(bnOrZero(fiatBalanceJinx)).toString()

  const [isLargerThanMd] = useMediaQuery(`(min-width: ${breakpoints['md']})`, { ssr: false })
  const mobileTabBg = useColorModeValue('gray.100', 'gray.750')
  const description =
    selectedAsset.assetId === furyAssetId
      ? translate('plugins.furyPage.furyDescription') // FURY has a custom description, other assets can use the asset-service one
      : selectedAsset.description

  const selectedLocale = useAppSelector(selectSelectedLocale)
  // TODO(gomes): Export a similar RTK select() query, consumed to determine wallet + staking balance loaded
  const getAssetDescriptionQuery = useGetAssetDescriptionQuery({
    assetId: selectedAsset.assetId,
    selectedLocale,
  })
  const isAssetDescriptionLoaded = !getAssetDescriptionQuery.isLoading

  const toAssetIdParts: ToAssetIdArgs = {
    assetNamespace: 'erc20',
    assetReference: jinxAddresses[0].staking,
    chainId: ethChainId,
  }

  const opportunityId = toOpportunityId(toAssetIdParts)
  const opportunityDataFilter = useMemo(() => {
    return {
      stakingId: opportunityId,
    }
  }, [opportunityId])

  const jinxEarnOpportunityData = useAppSelector(state =>
    opportunityDataFilter
      ? selectAggregatedEarnUserStakingOpportunityByStakingId(state, opportunityDataFilter)
      : undefined,
  )

  const handleTabClick = useCallback(
    (assetId: AssetId, assetName: string) => {
      if (assetId === activeAssetId) {
        return
      }
      mixpanel?.track(MixPanelEvents.Click, { element: `${assetName} toggle` })
      history.push(assetsRoutes[assetId])
    },
    [activeAssetId, history, mixpanel],
  )

  const handleOpportunityClick = useCallback(() => {
    if (!jinxEarnOpportunityData) return
    if (!wallet || !supportsETH(wallet)) {
      dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
      return
    }

    trackOpportunityEvent(
      MixPanelEvents.ClickOpportunity,
      {
        opportunity: jinxEarnOpportunityData,
        element: 'Fury Page Row',
      },
      allAssets,
    )

    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        provider: DefiProvider.ShapeShift,
        chainId: assetJinx.chainId,
        assetNamespace: 'erc20',
        contractAddress: jinxAddresses[0].jinx,
        assetReference: jinxAddresses[0].staking,
        rewardId: jinxAddresses[0].jinx,
        modal: 'overview',
      }),
      state: { background: location },
    })
  }, [allAssets, assetJinx.chainId, dispatch, jinxEarnOpportunityData, history, location, wallet])

  if (!isAssetDescriptionLoaded || !activeAssetId) return null
  if (wallet && supportsETH(wallet) && !jinxEarnOpportunityData) return null

  return (
    <Layout
      title={translate('plugins.furyPage.furyToken', {
        assetSymbol: selectedAsset.symbol,
      })}
      description={description ?? ''}
      icon={selectedAsset.icon}
    >
      <SEO
        title={translate('plugins.furyPage.furyToken', {
          assetSymbol: selectedAsset.symbol,
        })}
      />
      <Tabs variant='unstyled' index={selectedAssetIndex}>
        <TabList>
          <SimpleGrid
            gridTemplateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
            gridGap={4}
            mb={4}
            width='full'
          >
            <Total fiatAmount={totalFiatBalance} icons={[assetFury.icon, assetJinx.icon]} />
            {isLargerThanMd &&
              assets.map((asset, index) => (
                <FuryTab
                  key={asset.assetId}
                  assetSymbol={asset.symbol}
                  assetIcon={asset.icon}
                  cryptoAmount={cryptoHumanBalances[index]}
                  fiatAmount={fiatBalances[index]}
                  onClick={() => handleTabClick(asset.assetId, asset.name)}
                />
              ))}
            {!isLargerThanMd && (
              <Box mb={4}>
                <Menu matchWidth>
                  <Box mx={{ base: 4, md: 0 }}>
                    <MenuButton
                      borderWidth='2px'
                      borderColor='primary'
                      height='auto'
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      bg={mobileTabBg}
                      width='full'
                    >
                      {selectedAsset && (
                        <FuryTab
                          assetSymbol={selectedAsset.symbol}
                          assetIcon={selectedAsset.icon}
                          cryptoAmount={cryptoHumanBalances[selectedAssetIndex]}
                          fiatAmount={fiatBalances[selectedAssetIndex]}
                        />
                      )}
                    </MenuButton>
                  </Box>
                  <MenuList zIndex={3}>
                    {assets.map((asset, index) => (
                      <MenuItem
                        key={asset.assetId}
                        onClick={() => handleTabClick(asset.assetId, asset.name)}
                      >
                        <FuryTab
                          assetSymbol={asset.symbol}
                          assetIcon={asset.icon}
                          cryptoAmount={cryptoHumanBalances[index]}
                          fiatAmount={fiatBalances[index]}
                          as={Box}
                        />
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            )}
          </SimpleGrid>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Stack
              alignItems='flex-start'
              spacing={4}
              mx='auto'
              direction={{ base: 'column', xl: 'row' }}
            >
              <Stack spacing={4} flex='1 1 0%' width='full'>
                <MainOpportunity
                  assetId={selectedAsset.assetId}
                  apy={jinxAprData?.jinxApr ?? ''}
                  tvl={bnOrZero(jinxEarnOpportunityData?.tvl).toString()}
                  isLoaded={Boolean(jinxEarnOpportunityData && !isJinxAprLoading)}
                  balance={bnOrZero(jinxEarnOpportunityData?.cryptoAmountBaseUnit)
                    .div(bn(10).pow(assetJinx.precision))
                    .toFixed()}
                  onClick={handleOpportunityClick}
                />

                <OtherOpportunities
                  title={`plugins.furyPage.otherOpportunitiesTitle.${selectedAsset.symbol}`}
                  description={`plugins.furyPage.otherOpportunitiesDescription.${selectedAsset.symbol}`}
                  opportunities={otherOpportunities}
                />
                <Governance />
              </Stack>
              <Stack flex='1 1 0%' width='full' maxWidth={{ base: 'full', lg: 'sm' }} spacing={4}>
                <AssetActions assetId={furyAssetId} />
                <BondProtocolCta />
                <DappBack />
                <TradeOpportunities opportunities={assetsTradeOpportunitiesBuckets[furyAssetId]} />
                <AssetMarketData assetId={selectedAsset.assetId} />
                <FuryChart assetId={furyAssetId} />
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel p={0}>
            <Stack
              alignItems='flex-start'
              spacing={4}
              mx='auto'
              direction={{ base: 'column', xl: 'row' }}
            >
              <Stack spacing={4} flex='1 1 0%' width='full'>
                <OtherOpportunities
                  title={`plugins.furyPage.otherOpportunitiesTitle.${selectedAsset.symbol}`}
                  description={`plugins.furyPage.otherOpportunitiesDescription.${selectedAsset.symbol}`}
                  opportunities={otherOpportunities}
                />
              </Stack>
              <Stack flex='1 1 0%' width='full' maxWidth={{ base: 'full', lg: 'sm' }} spacing={4}>
                <AssetActions assetId={jinxAssetId} />
                <DappBack />
                <TradeOpportunities opportunities={assetsTradeOpportunitiesBuckets[jinxAssetId]} />
                <AssetMarketData assetId={selectedAsset.assetId} />
                <FuryChart assetId={jinxAssetId} />
              </Stack>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  )
}
