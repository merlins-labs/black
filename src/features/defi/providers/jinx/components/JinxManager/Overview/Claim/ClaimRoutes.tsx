import type { AccountId } from '@shapeshiftoss/caip'
import { useJinxQuery } from 'features/defi/providers/jinx/components/JinxManager/useJinxQuery'
import { AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Route, Switch, useLocation } from 'react-router'
import { SlideTransition } from 'components/SlideTransition'
import {
  makeTotalUndelegationsCryptoBaseUnit,
  serializeUserStakingId,
  supportsUndelegations,
  toOpportunityId,
} from 'state/slices/opportunitiesSlice/utils'
import { selectEarnUserStakingOpportunityByUserStakingId } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { ClaimConfirm } from './ClaimConfirm'
import { ClaimStatus } from './ClaimStatus'

type ClaimRouteProps = {
  accountId: AccountId | undefined
  onBack: () => void
}

export const ClaimRoutes: React.FC<ClaimRouteProps> = ({ onBack, accountId }) => {
  const { contractAddress, stakingAssetId, chainId } = useJinxQuery()

  const opportunityDataFilter = useMemo(() => {
    return {
      userStakingId: serializeUserStakingId(
        accountId ?? '',
        toOpportunityId({
          chainId,
          assetNamespace: 'erc20',
          assetReference: contractAddress,
        }),
      ),
    }
  }, [accountId, chainId, contractAddress])

  const jinxEarnOpportunityData = useAppSelector(state =>
    opportunityDataFilter
      ? selectEarnUserStakingOpportunityByUserStakingId(state, opportunityDataFilter)
      : undefined,
  )

  const undelegationAmount = useMemo(
    () =>
      jinxEarnOpportunityData && supportsUndelegations(jinxEarnOpportunityData)
        ? makeTotalUndelegationsCryptoBaseUnit(jinxEarnOpportunityData.undelegations).toFixed()
        : '0',
    [jinxEarnOpportunityData],
  )

  const location = useLocation()

  return (
    <SlideTransition>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.key}>
          <Route exact path='/'>
            <ClaimConfirm
              stakingAssetId={stakingAssetId}
              accountId={accountId}
              chainId={chainId}
              contractAddress={contractAddress}
              onBack={onBack}
              amount={undelegationAmount}
            />
          </Route>
          <Route exact path='/status'>
            <ClaimStatus accountId={accountId} />
          </Route>
        </Switch>
      </AnimatePresence>
    </SlideTransition>
  )
}
