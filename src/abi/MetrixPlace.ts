const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: 'x',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'y',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'color',
        type: 'uint32'
      }
    ],
    name: 'PixelUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'canvasSize',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'chunkSize',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'x', type: 'uint16' },
      { internalType: 'uint16', name: 'y', type: 'uint16' }
    ],
    name: 'encodeKey',
    outputs: [{ internalType: 'uint32', name: 'key', type: 'uint32' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'startX', type: 'uint16' },
      { internalType: 'uint16', name: 'startY', type: 'uint16' }
    ],
    name: 'getChunkColors',
    outputs: [
      {
        internalType: 'uint32[64][64]',
        name: '',
        type: 'uint32[64][64]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'x', type: 'uint16' },
      { internalType: 'uint16', name: 'y', type: 'uint16' }
    ],
    name: 'getPixelColor',
    outputs: [{ internalType: 'uint32', name: 'color', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'lastBlockModified',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    name: 'pixels',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'x', type: 'uint16' },
      { internalType: 'uint16', name: 'y', type: 'uint16' },
      { internalType: 'uint32', name: 'color', type: 'uint32' }
    ],
    name: 'setPixelColor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default abi;
