import { createContext } from 'react'

import type { FuryFarmingDepositActions, FuryFarmingDepositState } from './DepositCommon'

interface IDepositContext {
  state: FuryFarmingDepositState | null
  dispatch: React.Dispatch<FuryFarmingDepositActions> | null
}

export const DepositContext = createContext<IDepositContext>({ state: null, dispatch: null })
