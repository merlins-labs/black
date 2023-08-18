import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
import { FuryIcon } from 'components/Icons/FuryIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const MobileConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'app',
  icon: FuryIcon,
  name: 'ShapeShift Mobile',
}
