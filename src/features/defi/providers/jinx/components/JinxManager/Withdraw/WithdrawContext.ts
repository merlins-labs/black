import { createContext } from 'react'

import type { JinxWithdrawActions, JinxWithdrawState } from './WithdrawCommon'

interface IWithdrawContext {
  state: JinxWithdrawState | null
  dispatch: React.Dispatch<JinxWithdrawActions> | null
}

export const WithdrawContext = createContext<IWithdrawContext>({ state: null, dispatch: null })
