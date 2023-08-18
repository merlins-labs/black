import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
import { FuryIcon } from 'components/Icons/FuryIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const DemoConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'both',
  icon: FuryIcon,
  name: 'DemoWallet',
}
