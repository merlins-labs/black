import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { SlideTransition } from 'components/SlideTransition'
import { useFuryEth } from 'context/FuryEthProvider/FuryEthProvider'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'

import { Claim } from './Claim/Claim'
import { FuryFarmingDeposit } from './Deposit/FuryFarmingDeposit'
import { FuryFarmingOverview } from './Overview/FuryFarmingOverview'
import { FuryFarmingWithdraw } from './Withdraw/FuryFarmingWithdraw'

export const FuryFarmingManager = () => {
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { modal } = query
  const { farmingAccountId, setFarmingAccountId: handleFarmingAccountIdChange } = useFuryEth()

  // farmingAccountId isn't a local state field - it is a memoized state field from the <FuryEthContext /> and will stay hanging
  // This makes sure to clear it on modal close
  useEffect(() => {
    return () => {
      handleFarmingAccountIdChange(undefined)
    }
  }, [handleFarmingAccountIdChange])

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {modal === DefiAction.Overview && (
        <SlideTransition key={DefiAction.Overview}>
          <FuryFarmingOverview
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Deposit && (
        <SlideTransition key={DefiAction.Deposit}>
          <FuryFarmingDeposit
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Withdraw && (
        <SlideTransition key={DefiAction.Withdraw}>
          <FuryFarmingWithdraw
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Claim && (
        <SlideTransition key={DefiAction.Claim}>
          <Claim accountId={farmingAccountId} onAccountIdChange={handleFarmingAccountIdChange} />
        </SlideTransition>
      )}
    </AnimatePresence>
  )
}
