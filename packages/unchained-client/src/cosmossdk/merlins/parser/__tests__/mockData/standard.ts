import type { Tx } from '../../..'

const tx: Tx = {
  txid: '5E4DE0462EA7F140C122F12B92BEF09C55F430079FABBF426710847006EF1935',
  blockHash: 'E7EF67B3D9BD5727E23951E0195C928924D96AC5E2F820D6A3824B14F14456A6',
  blockHeight: 9473608,
  timestamp: 1645207449,
  confirmations: 2390171,
  fee: {
    amount: '2500',
    denom: 'ufury',
  },
  gasUsed: '62326',
  gasWanted: '85000',
  index: 3,
  value: '',
  messages: [
    {
      index: '0',
      origin: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
      from: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
      to: 'fury14e25lpsedq863vgweqg4m9n0z28c203kexkdgd',
      type: 'send',
      value: {
        amount: '2002965',
        denom: 'ufury',
      },
    },
  ],
  events: {
    '0': {
      coin_received: {
        amount: '2002965ufury',
        receiver: 'fury14e25lpsedq863vgweqg4m9n0z28c203kexkdgd',
      },
      coin_spent: {
        amount: '2002965ufury',
        spender: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
      },
      message: {
        action: '/cosmos.bank.v1beta1.MsgSend',
        module: 'bank',
        sender: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
      },
      transfer: {
        amount: '2002965ufury',
        recipient: 'fury14e25lpsedq863vgweqg4m9n0z28c203kexkdgd',
        sender: 'fury1t5u0jfg3ljsjrh2m9e47d4ny2hea7eehkgtzmz',
      },
    },
  },
}

export default { tx }
