import { createContext } from 'react'

import type { FuryFarmingWithdrawActions, FuryFarmingWithdrawState } from './WithdrawCommon'

interface IWithdrawContext {
  state: FuryFarmingWithdrawState | null
  dispatch: React.Dispatch<FuryFarmingWithdrawActions> | null
}

export const WithdrawContext = createContext<IWithdrawContext>({ state: null, dispatch: null })
