import type { Tx } from '../../..'

const tx: Tx = {
  txid: '1795FE6ED7B5A8C5478CBDE27F35C8FB64FC6229B7B90FA47D4406AA2078BBAB',
  blockHash: '140D9DEC3087EA26248B60559D9C044F649749E4483E8E1F30143A8E47E7FFE8',
  blockHeight: 9636932,
  timestamp: 1646429915,
  confirmations: 2226912,
  fee: {
    amount: '6250',
    denom: 'ufury',
  },
  gasUsed: '159777',
  gasWanted: '250000',
  index: 8,
  value: '',
  messages: [
    {
      index: '0',
      origin: 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk',
      from: 'furyvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9un28ucz',
      to: 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk',
      type: 'begin_unbonding',
      value: {
        amount: '200000',
        denom: 'ufury',
      },
    },
  ],
  events: {
    '0': {
      coin_received: {
        amount: '200000ufury',
        receiver: 'fury1tygms3xhhs3yv487phx3dw4a95jn7t7l3su3uv',
      },
      coin_spent: {
        amount: '200000ufury',
        spender: 'fury1fl48vsnmsdzcv85q5d2q4z5ajdha8yu39sqq2c',
      },
      message: {
        action: '/cosmos.staking.v1beta1.MsgUndelegate',
        module: 'staking',
        sender: 'fury1fx4jwv3aalxqwmrpymn34l582lnehr3es94dkk',
      },
      transfer: {
        amount: '200000ufury',
        recipient: 'fury1tygms3xhhs3yv487phx3dw4a95jn7t7l3su3uv',
        sender: 'fury1fl48vsnmsdzcv85q5d2q4z5ajdha8yu39sqq2c',
      },
      unbond: {
        amount: '200000ufury',
        completion_time: '2022-03-25T21:38:35Z',
        validator: 'furyvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9un28ucz',
      },
    },
  },
}

export default { tx }
