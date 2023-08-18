import type { AccountId } from '@shapeshiftoss/caip'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SlideTransition } from 'components/SlideTransition'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'

import { JinxDeposit } from './Deposit/JinxDeposit'
import { JinxClaim } from './Overview/Claim/Claim'
import { JinxOverview } from './Overview/JinxOverview'
import { JinxWithdraw } from './Withdraw/JinxWithdraw'

export const JinxManager = () => {
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { modal } = query
  const [accountId, setAccountId] = useState<AccountId | undefined>()

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {modal === DefiAction.Overview && (
        <SlideTransition key={DefiAction.Overview}>
          <JinxOverview onAccountIdChange={setAccountId} accountId={accountId} />
        </SlideTransition>
      )}
      {modal === DefiAction.Deposit && (
        <SlideTransition key={DefiAction.Deposit}>
          <JinxDeposit onAccountIdChange={setAccountId} accountId={accountId} />
        </SlideTransition>
      )}
      {modal === DefiAction.Withdraw && (
        <SlideTransition key={DefiAction.Withdraw}>
          <JinxWithdraw onAccountIdChange={setAccountId} accountId={accountId} />
        </SlideTransition>
      )}
      {modal === DefiAction.Claim && (
        <SlideTransition key={DefiAction.Claim}>
          <JinxClaim accountId={accountId} />
        </SlideTransition>
      )}
    </AnimatePresence>
  )
}
