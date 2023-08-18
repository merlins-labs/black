import { Button, Card, CardBody, CardHeader, Heading, Link } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useTranslate } from 'react-polyglot'
import { Text } from 'components/Text'
import { useFeatureFlag } from 'hooks/useFeatureFlag/useFeatureFlag'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'

export const DappBack = () => {
  const translate = useTranslate()
  const isFuryBondCTAEnabled = useFeatureFlag('FuryBondCTA')

  const handleClick = useCallback(() => {
    getMixPanel()?.track(MixPanelEvents.Click, { element: 'Dappback Button' })
  }, [])
  if (!isFuryBondCTAEnabled) return null
  return (
    <Card>
      <CardHeader>
        <Heading as='h5'>
          <Text translation='plugins.furyPage.dappBack.title' />
        </Heading>
      </CardHeader>
      <CardBody display='flex' gap={6} flexDirection='column'>
        <Text color='text.subtle' translation='plugins.furyPage.dappBack.body' />
        <Button
          as={Link}
          href='https://dappback.com/shapeshift'
          isExternal
          colorScheme='blue'
          onClick={handleClick}
        >
          {translate('plugins.furyPage.dappBack.cta')}
        </Button>
      </CardBody>
    </Card>
  )
}
