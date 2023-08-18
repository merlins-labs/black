import { Center } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CircularProgress } from 'components/CircularProgress/CircularProgress'
import { FuryIcon } from 'components/Icons/FuryIcon'
import { SlideTransitionY } from 'components/SlideTransitionY'
import { useIsAnyApiFetching } from 'hooks/useIsAnyApiFetching/useIsAnyApiFetching'

export const AppLoadingIcon: React.FC = () => {
  const isLoading = useIsAnyApiFetching()
  return (
    <Link to='/'>
      <AnimatePresence exitBeforeEnter initial={true}>
        {isLoading ? (
          <SlideTransitionY key='loader'>
            <Center boxSize='7'>
              <CircularProgress size={7} />
            </Center>
          </SlideTransitionY>
        ) : (
          <SlideTransitionY key='logo'>
            <FuryIcon boxSize='7' />
          </SlideTransitionY>
        )}
      </AnimatePresence>
    </Link>
  )
}
