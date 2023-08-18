import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
import { FuryIcon } from 'components/Icons/FuryIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const NativeConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'browser',
  icon: FuryIcon,
  name: 'ShapeShift',
}
