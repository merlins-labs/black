import type { Tx } from '../../..'

const tx: Tx = {
  txid: '8136FF781B38919958249308CFABFD253CF371514661119BCD231875968BD06B',
  blockHash: 'D8186504233B8AD92ED2799D88A16A38F706889A99F1AEC49A6EA96EC94AE4E7',
  blockHeight: 9636923,
  timestamp: 1646429842,
  confirmations: 2226870,
  fee: {
    amount: '6250',
    denom: 'ufury',
  },
  gasUsed: '151141',
  gasWanted: '250000',
  index: 7,
  value: '',
  messages: [
    {
      index: '0',
      origin: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      from: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      to: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
      type: 'delegate',
      value: {
        amount: '1920000',
        denom: 'ufury',
      },
    },
  ],
  events: {
    '0': {
      coin_received: {
        amount: '1920000ufury',
        receiver: 'fury1fl48vsnmsdzcv85q5d2q4z5ajdha8yu39sqq2c',
      },
      coin_spent: {
        amount: '1920000ufury',
        spender: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      delegate: {
        amount: '1920000ufury',
        new_shares: '1920000.000000000000000000',
        validator: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
      },
      message: {
        action: '/cosmos.staking.v1beta1.MsgDelegate',
        module: 'staking',
        sender: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      transfer: {
        amount: '78085ufury',
        recipient: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
        sender: 'fury1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8h5dn6s',
      },
    },
  },
}

export default { tx }
