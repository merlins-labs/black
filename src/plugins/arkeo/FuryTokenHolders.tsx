import { Button, CardBody, Flex } from '@chakra-ui/react'
import { furyAssetId } from '@shapeshiftoss/caip'
import { useCallback } from 'react'
import { useTranslate } from 'react-polyglot'
import { useHistory } from 'react-router'
import { AssetIcon } from 'components/AssetIcon'
import { FiatRampAction } from 'components/Modals/FiatRamps/FiatRampsCommon'
import { Text } from 'components/Text'
import { useModal } from 'hooks/useModal/useModal'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'

import { ArkeoCard } from './ArkeoCard'

export const FuryTokenHolders = () => {
  const history = useHistory()
  const translate = useTranslate()
  const fiatRamps = useModal('fiatRamps')

  const handleClick = useCallback(() => {
    getMixPanel()?.track(MixPanelEvents.Click, { element: 'Fury Token Holders Button' })
    history.push('/trade/eip155:1/erc20:0x3c3dc25ca709de108f6fc9b04bef5976876b05b1')
  }, [history])

  const handleBuySellClick = useCallback(() => {
    fiatRamps.open({
      assetId: furyAssetId,
      fiatRampAction: FiatRampAction.Buy,
    })
  }, [fiatRamps])

  return (
    <ArkeoCard>
      <CardBody display='flex' flexDir='column' gap={4} height='100%'>
        <Flex>
          <AssetIcon assetId={furyAssetId} />
        </Flex>
        <Text fontSize='xl' fontWeight='bold' translation={'arkeo.furyTokenHolders.title'} />
        <Text color='text.subtle' translation={'arkeo.furyTokenHolders.body'} />
        <Flex mt='auto' gap={4}>
          <Button width='full' colorScheme='blue' onClick={handleClick}>
            {translate('arkeo.furyTokenHolders.cta')}
          </Button>
          <Button onClick={handleBuySellClick} width='full' colorScheme='blue' variant='link'>
            {translate('arkeo.furyTokenHolders.secondary')}
          </Button>
        </Flex>
      </CardBody>
    </ArkeoCard>
  )
}
