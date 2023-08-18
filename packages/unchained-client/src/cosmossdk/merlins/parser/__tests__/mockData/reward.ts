import type { Tx } from '../../..'

const tx: Tx = {
  txid: 'E34AFB3A28198957040073034E16D4A979B403E672859651B41C207538136ABE',
  blockHash: 'DFFDB4B083138492721673E6754FAE5533C8D2D0AFC1928E959CDBB464E20864',
  blockHeight: 9636957,
  timestamp: 1646430088,
  confirmations: 2226945,
  fee: {
    amount: '7000',
    denom: 'ufury',
  },
  gasUsed: '161819',
  gasWanted: '280000',
  index: 4,
  value: '',
  messages: [
    {
      index: '0',
      origin: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      from: 'furyvaloper1hdrlqvyjfy5sdrseecjrutyws9khtxxa9n994n',
      to: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      type: 'withdraw_delegator_reward',
      value: {
        amount: '39447',
        denom: 'ufury',
      },
    },
    {
      index: '1',
      origin: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      from: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
      to: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      type: 'withdraw_delegator_reward',
      value: {
        amount: '7',
        denom: 'ufury',
      },
    },
  ],
  events: {
    '0': {
      coin_received: {
        amount: '39447ufury',
        receiver: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      coin_spent: {
        amount: '39447ufury',
        spender: 'fury1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8h5dn6s',
      },
      message: {
        action: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        module: 'distribution',
        sender: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      transfer: {
        amount: '39447ufury',
        recipient: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
        sender: 'fury1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8h5dn6s',
      },
      withdraw_rewards: {
        amount: '39447ufury',
        validator: 'furyvaloper1hdrlqvyjfy5sdrseecjrutyws9khtxxa9n994n',
      },
    },
    '1': {
      coin_received: {
        amount: '7ufury',
        receiver: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      coin_spent: {
        amount: '7ufury',
        spender: 'fury1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8h5dn6s',
      },
      message: {
        action: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        module: 'distribution',
        sender: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
      },
      transfer: {
        amount: '7ufury',
        recipient: 'fury179k2lz70rxvjrvvr65cynw9x5c8v3kftc7nrum',
        sender: 'fury1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8h5dn6s',
      },
      withdraw_rewards: {
        amount: '7ufury',
        validator: 'furyvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxqkzvfj',
      },
    },
  },
}

export default { tx }
