import { Button, Skeleton, Stack, Text as CText } from '@chakra-ui/react'
import { DefiModalContent } from 'features/defi/components/DefiModal/DefiModalContent'
import { EmptyOverview } from 'features/defi/components/EmptyOverview/EmptyOverview'
import { Amount } from 'components/Amount/Amount'
import { Text } from 'components/Text'
import type { Asset } from 'lib/asset-service'

type JinxEmptyProps = {
  assets: Asset[]
  apy: string | undefined
  onClick?: () => void
}

export const JinxEmpty = ({ assets, apy, onClick }: JinxEmptyProps) => {
  return (
    <DefiModalContent>
      <EmptyOverview
        assets={assets}
        footer={
          <Button width='full' colorScheme='blue' onClick={onClick}>
            <Text translation='defi.modals.jinxOverview.cta' />
          </Button>
        }
      >
        <Stack direction='row' flexWrap='wrap' spacing={1} justifyContent='center' mb={4}>
          <Text translation='defi.modals.jinxOverview.header' />
          <CText color='green.500'>
            <Skeleton isLoaded={Boolean(apy)}>
              <Amount.Percent value={apy ?? ''} suffix='APR' />
            </Skeleton>
          </CText>
        </Stack>
        <Text color='text.subtle' translation='defi.modals.jinxOverview.body' />
        <Text color='text.subtle' translation='defi.modals.jinxOverview.rewards' />
      </EmptyOverview>
    </DefiModalContent>
  )
}
