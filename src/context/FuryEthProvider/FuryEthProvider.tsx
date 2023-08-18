import type { AccountId } from '@shapeshiftoss/caip'
import { ethAssetId, ethChainId, fromAccountId } from '@shapeshiftoss/caip'
import { TxStatus } from '@shapeshiftoss/unchained-client'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { opportunitiesApi } from 'state/slices/opportunitiesSlice/opportunitiesApiSlice'
import { fetchAllStakingOpportunitiesUserDataByAccountId } from 'state/slices/opportunitiesSlice/thunks'
import { DefiProvider, DefiType } from 'state/slices/opportunitiesSlice/types'
import { toOpportunityId } from 'state/slices/opportunitiesSlice/utils'
import { selectAssetById, selectStakingAccountIds, selectTxById } from 'state/slices/selectors'
import { serializeTxIndex } from 'state/slices/txHistorySlice/utils'
import { useAppDispatch, useAppSelector } from 'state/store'

type FuryEthProviderProps = {
  children: React.ReactNode
}

type IFuryEthContext = {
  farmingAccountId: AccountId | undefined
  setFarmingAccountId: (accountId: AccountId | undefined) => void
  // TODO(gomes): now that LP is gone, how about we remove this whole hook
  onOngoingFarmingTxIdChange: (txid: string, contractAddress?: string) => void
}

const FuryEthContext = createContext<IFuryEthContext>({
  farmingAccountId: undefined,
  setFarmingAccountId: _accountId => {},
  onOngoingFarmingTxIdChange: (_txid: string) => Promise.resolve(),
})

export const FuryEthProvider = ({ children }: FuryEthProviderProps) => {
  const ethAsset = useAppSelector(state => selectAssetById(state, ethAssetId))
  if (!ethAsset) throw new Error(`Asset not found for AssetId ${ethAssetId}`)

  const dispatch = useAppDispatch()

  const [ongoingTxId, setOngoingTxId] = useState<string | null>(null)
  const [ongoingTxContractAddress, setOngoingTxContractAddress] = useState<string | null>(null)
  const [farmingAccountId, setFarmingAccountId] = useState<AccountId | undefined>()

  const stakingAccountIds = useAppSelector(selectStakingAccountIds)

  const refetchFuryEthStakingAccountData = useCallback(async () => {
    await Promise.all(
      stakingAccountIds.map(
        async accountId =>
          await fetchAllStakingOpportunitiesUserDataByAccountId(accountId, { forceRefetch: true }),
      ),
    )
  }, [stakingAccountIds])

  const transaction = useAppSelector(gs => selectTxById(gs, ongoingTxId ?? ''))

  const handleOngoingTxIdChange = useCallback(
    (_type: 'farming', txid: string, contractAddress?: string) => {
      const accountId = farmingAccountId
      if (!accountId) return
      const accountAddress = fromAccountId(accountId).account
      setOngoingTxId(serializeTxIndex(accountId ?? '', txid, accountAddress))
      if (contractAddress) setOngoingTxContractAddress(contractAddress)
    },
    [farmingAccountId],
  )

  const handleOngoingFarmingTxIdChange = useCallback(
    (txid: string, contractAddress?: string) => {
      handleOngoingTxIdChange('farming', txid, contractAddress)
    },
    [handleOngoingTxIdChange],
  )

  useEffect(() => {
    if (farmingAccountId && transaction && transaction.status !== TxStatus.Pending) {
      if (transaction.status === TxStatus.Confirmed) {
        refetchFuryEthStakingAccountData()
        if (ongoingTxContractAddress)
          dispatch(
            opportunitiesApi.endpoints.getOpportunityUserData.initiate(
              {
                accountId: farmingAccountId,
                opportunityId: toOpportunityId({
                  assetNamespace: 'erc20',
                  chainId: ethChainId,
                  assetReference: ongoingTxContractAddress,
                }),
                defiType: DefiType.Staking,
                defiProvider: DefiProvider.EthFuryStaking,
              },
              // Any previous query without portfolio loaded will be rejected
              // The first successful one will be cached unless forceRefetch is overriden with queryOptions
              { forceRefetch: true },
            ),
          )
        setOngoingTxId(null)
        setOngoingTxContractAddress(null)
      }
    }
  }, [
    dispatch,
    farmingAccountId,
    ongoingTxContractAddress,
    refetchFuryEthStakingAccountData,
    transaction,
  ])

  const value = useMemo(
    () => ({
      farmingAccountId,
      onOngoingFarmingTxIdChange: handleOngoingFarmingTxIdChange,
      setFarmingAccountId,
    }),
    [farmingAccountId, handleOngoingFarmingTxIdChange],
  )

  return <FuryEthContext.Provider value={value}>{children}</FuryEthContext.Provider>
}

export const useFuryEth = () => useContext(FuryEthContext)
