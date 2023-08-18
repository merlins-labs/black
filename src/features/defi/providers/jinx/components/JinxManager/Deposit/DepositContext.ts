import { createContext } from 'react'

import type { JinxDepositActions, JinxDepositState } from './DepositCommon'

export interface IDepositContext {
  state: JinxDepositState | null
  dispatch: React.Dispatch<JinxDepositActions> | null
}

export const DepositContext = createContext<IDepositContext>({ state: null, dispatch: null })
