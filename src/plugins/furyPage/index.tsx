import { type Plugins } from 'plugins/types'
import { RouteCategory } from 'Routes/helpers'
import { FuryIcon } from 'components/Icons/FuryIcon'

import { FuryPage } from './furyPage'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'furyPage',
      {
        name: 'furyPage',
        icon: <FuryIcon />,
        routes: [
          {
            path: '/fury',
            label: 'navBar.furyToken',
            main: () => <FuryPage />,
            icon: <FuryIcon />,
            category: RouteCategory.Explore,
            hide: true,
            routes: [
              {
                path: '/fury',
                label: 'navBar.furyToken',
                main: () => <FuryPage />,
              },
              {
                path: '/jinx',
                label: 'navBar.furyToken',
                main: () => <FuryPage />,
              },
            ],
          },
        ],
      },
    ],
  ]
}
