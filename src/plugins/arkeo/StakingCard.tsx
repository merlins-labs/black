import { Button, CardBody, Skeleton, SkeletonText } from '@chakra-ui/react'
import { useTranslate } from 'react-polyglot'
import { AssetIcon } from 'components/AssetIcon'
import { Text } from 'components/Text'
import { bnOrZero } from 'lib/bignumber/bignumber'
import type { EarnOpportunityType, OpportunityId } from 'state/slices/opportunitiesSlice/types'
import { DefiProvider } from 'state/slices/opportunitiesSlice/types'
import { selectAssetById } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { ArkeoCard } from './ArkeoCard'

type StakingCardProps = {
  onClick: (opportunityId: OpportunityId) => void
} & EarnOpportunityType

export const StakingCard: React.FC<StakingCardProps> = props => {
  const translate = useTranslate()
  const { onClick, ...opportunity } = props
  const { assetId, underlyingAssetId, provider, apy, opportunityName } = opportunity
  const currentAssetId = underlyingAssetId ?? assetId
  const asset = useAppSelector(state => selectAssetById(state, currentAssetId ?? ''))
  const opportunityApy = bnOrZero(apy).times(100).toFixed(2)
  const providerName = [DefiProvider.CosmosSdk, DefiProvider.OsmosisLp].includes(
    provider as DefiProvider,
  )
    ? translate('common.validator', { name: opportunityName })
    : provider

  const { title, body, cta } = (() => {
    switch (provider) {
      case DefiProvider.ShapeShift:
        return {
          title: 'arkeo.jinxTokenHolders.title',
          body: 'arkeo.jinxTokenHolders.body',
          cta: 'arkeo.jinxTokenHolders.cta',
        }
      case DefiProvider.EthFuryStaking:
        return {
          title: 'arkeo.furyFarmers.title',
          body: 'arkeo.furyFarmers.body',
          cta: 'arkeo.furyFarmers.cta',
        }
      default:
        return {
          title: 'arkeo.staking.title',
          body: 'arkeo.staking.body',
          cta: 'arkeo.staking.cta',
        }
    }
  })()

  return (
    <ArkeoCard>
      <CardBody display='flex' flexDir='column' gap={4} height='100%'>
        <AssetIcon assetId={currentAssetId} />
        <Text fontSize='xl' fontWeight='bold' translation={[title, { asset: asset?.name }]} />
        <SkeletonText noOfLines={4} isLoaded={bnOrZero(opportunityApy).gt(0)}>
          <Text
            color='text.subtle'
            translation={[
              body,
              { asset: asset?.name, apy: `${opportunityApy}%`, provider: providerName },
            ]}
          />
        </SkeletonText>
        <Skeleton isLoaded={bnOrZero(opportunityApy).gt(0)} mt='auto'>
          <Button width='full' colorScheme='blue' onClick={() => onClick(opportunity.id)}>
            {translate(cta, { asset: asset?.name })}
          </Button>
        </Skeleton>
      </CardBody>
    </ArkeoCard>
  )
}
