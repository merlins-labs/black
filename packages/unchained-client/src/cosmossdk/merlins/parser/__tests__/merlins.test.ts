import { merlinsAssetId, merlinsChainId } from '@shapeshiftoss/caip'

import { TransferType, TxStatus } from '../../../../types'
import type { ParsedTx } from '../../../parser'
import { TransactionParser } from '../index'
import delegate from './mockData/delegate'
import ibc_receive from './mockData/ibc_receive'
import ibc_transfer from './mockData/ibc_transfer'
import redelegate from './mockData/redelegate'
import reward from './mockData/reward'
import standard from './mockData/standard'
import undelegate from './mockData/undelegate'

const txParser = new TransactionParser({ chainId: merlinsChainId, assetId: merlinsAssetId })

describe('parseTx', () => {
  it('should be able to parse a standard send tx', async () => {
    const { tx } = standard
    const address = 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '2500',
      },
      transfers: [
        {
          type: TransferType.Send,
          from: address,
          to: 'fury14e25lpsedq863vgweqg4m9n0z28c203kexkdgd',
          assetId: merlinsAssetId,
          totalValue: '2002965',
          components: [{ value: '2002965' }],
        },
      ],
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse a standard receive tx', async () => {
    const { tx } = standard
    const address = 'fury14e25lpsedq863vgweqg4m9n0z28c203kexkdgd'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      transfers: [
        {
          type: TransferType.Receive,
          from: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
          to: address,
          assetId: merlinsAssetId,
          totalValue: '2002965',
          components: [{ value: '2002965' }],
        },
      ],
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse a delegate tx', async () => {
    const { tx } = delegate
    const address = 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '6250',
      },
      transfers: [
        {
          type: TransferType.Send,
          assetId: merlinsAssetId,
          from: address,
          to: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
          totalValue: '1920000',
          components: [{ value: '1920000' }],
        },
      ],
      data: {
        parser: 'staking',
        method: 'delegate',
        delegator: address,
        destinationValidator: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
        assetId: merlinsAssetId,
        value: '1920000',
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse a undelegate tx', async () => {
    const { tx } = undelegate
    const address = 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '6250',
      },
      transfers: [
        {
          assetId: merlinsAssetId,
          components: [{ value: '200000' }],
          from: 'furyvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9un28ucz',
          to: address,
          totalValue: '200000',
          type: TransferType.Receive,
        },
      ],
      data: {
        parser: 'staking',
        method: 'begin_unbonding',
        delegator: address,
        destinationValidator: 'furyvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9un28ucz',
        assetId: merlinsAssetId,
        value: '200000',
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse a redelegate tx', async () => {
    const { tx } = redelegate
    const address = 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '6250',
      },
      transfers: [],
      data: {
        parser: 'staking',
        method: 'begin_redelegate',
        sourceValidator: 'furyvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9un28ucz',
        delegator: address,
        destinationValidator: 'furyvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuu69uvgy',
        assetId: merlinsAssetId,
        value: '500000',
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse a reward tx', async () => {
    const { tx } = reward
    const address = 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '7000',
      },
      transfers: [
        {
          type: TransferType.Receive,
          assetId: merlinsAssetId,
          from: 'furyvaloper1hdrlqvyjfy5sdrseecjrutyws9khtxxa9n994n',
          to: address,
          totalValue: '39447',
          components: [{ value: '39447' }],
        },
        {
          type: TransferType.Receive,
          assetId: merlinsAssetId,
          from: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
          to: address,
          totalValue: '7',
          components: [{ value: '7' }],
        },
      ],
      data: {
        parser: 'staking',
        method: 'withdraw_delegator_reward',
        delegator: address,
        destinationValidator: address,
        value: '39447',
        assetId: merlinsAssetId,
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse an ibc transfer tx', async () => {
    const { tx } = ibc_transfer
    const address = 'fury1syj2za9lxkhgpd9zm5lzfss9f6qcuycaplupy5'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      fee: {
        assetId: merlinsAssetId,
        value: '3250',
      },
      transfers: [
        {
          type: TransferType.Send,
          assetId: merlinsAssetId,
          from: address,
          to: 'osmo1syj2za9lxkhgpd9zm5lzfss9f6qcuycae0x7pf',
          totalValue: '600000',
          components: [{ value: '600000' }],
        },
      ],
      data: {
        parser: 'ibc',
        method: 'transfer',
        ibcDestination: 'osmo1syj2za9lxkhgpd9zm5lzfss9f6qcuycae0x7pf',
        ibcSource: address,
        assetId: merlinsAssetId,
        value: '600000',
        sequence: '1258481',
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })

  it('should be able to parse an ibc receive tx', async () => {
    const { tx } = ibc_receive
    const address = 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk'

    const expected: ParsedTx = {
      txid: tx.txid,
      blockHash: tx.blockHash,
      blockHeight: tx.blockHeight,
      blockTime: tx.timestamp,
      confirmations: tx.confirmations,
      status: TxStatus.Confirmed,
      address,
      chainId: merlinsChainId,
      transfers: [
        {
          type: TransferType.Receive,
          assetId: merlinsAssetId,
          from: 'osmo1fx4jwv3aalxqwmrpymn34l582lnehr3eg40jnt',
          to: address,
          totalValue: '3230396',
          components: [{ value: '3230396' }],
        },
      ],
      data: {
        parser: 'ibc',
        method: 'recv_packet',
        ibcDestination: address,
        ibcSource: 'osmo1fx4jwv3aalxqwmrpymn34l582lnehr3eg40jnt',
        assetId: merlinsAssetId,
        value: '3230396',
        sequence: '516701',
      },
    }

    const actual = await txParser.parse(tx, address)

    expect(expected).toEqual(actual)
  })
})
