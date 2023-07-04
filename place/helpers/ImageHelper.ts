import {
  MetrixRPC,
  NetworkType,
  RPCEventLogs,
  RPCProvider
} from '@metrixcoin/metrilib';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { getMetrixPlace } from '../index';
import { Interface } from 'ethers';
import ABI from '../abi/index';

dotenv.config();

export const cacheImages = async (
  network: NetworkType,
  provider: RPCProvider,
  lastBlock: number
) => {
  let last = lastBlock;
  const place = getMetrixPlace(network, provider);
  const allLogs = (await place.getEventLogs()) as RPCEventLogs;
  const logs = allLogs

    .filter((log) => {
      return log.blockNumber > lastBlock;
    })

    .map((log) => {
      const iface = new Interface(ABI.MetrixPlace);
      const encoded = `0x${log.log[0].data.replace('0x', '')}`;
      const decoded = iface.decodeEventLog('PixelUpdated', encoded);

      const tup: readonly [
        x: number,
        y: number,
        color: string,
        nBlock: number
      ] = [
        Number(decoded[0].toString()),
        Number(decoded[1].toString()),
        BigInt(decoded[2].toString()).toString(16),
        log.blockNumber
      ];
      return tup;
    })
    .reverse();

  const pixels: number[] = [];
  let d = undefined;
  try {
    const { data } = await sharp(`${__dirname}/../../../plc/latest.png`, {
      raw: {
        width: 1024,
        height: 1024,
        channels: 4
      }
    }) // TODO: this needs to be replaced with the current latest image.
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    d = data;
  } catch (e) {
    console.log(e);
    d = [];
  }

  // TODO: tprocess the logs and set any needed pixels

  if (d.length == 0) {
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        let r = 0; // Red value (0-255)
        let g = 0; // Green value (0-255)
        let b = 0; // Blue value (0-255)
        let a = 0; // Alpha value (0-255)
        const px = logs.find((log) => {
          return log[0] === x && log[1] === y;
        });
        if (px) {
          if (px[3] > last) last = px[3];
          const hex =
            px[2].length === 8
              ? px[2]
              : `${'0'.repeat(8 - px[2].length)}${px[2]}`;

          r = Number(`0x${hex.slice(0, 2)}`); // Red value (0-255)
          g = Number(`0x${hex.slice(2, 4)}`); // Green value (0-255)
          b = Number(`0x${hex.slice(4, 6)}`); // Blue value (0-255)
          a = Number(`0x${hex.slice(6, 8)}`); // Alpha value (0-255)
        }

        pixels.push(r);
        pixels.push(g);
        pixels.push(b);
        pixels.push(a);
      }
    }
  } else {
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        const pixelIndex = (x + y * 1024) * 4; // Calculate the index for the desired pixel
        let r = d[pixelIndex]; // Red value (0-255)
        let g = d[pixelIndex + 1]; // Green value (0-255)
        let b = d[pixelIndex + 2]; // Blue value (0-255)
        let a = d[pixelIndex + 3]; // Alpha value (0-255)
        const px = logs.find((log) => {
          return log[0] === x && log[1] === y;
        });
        if (px) {
          if (px[3] > last) last = px[3];

          const hex =
            px[2].length === 8
              ? px[2]
              : `${'0'.repeat(8 - px[2].length)}${px[2]}`;

          r = Number(`0x${hex.slice(0, 2)}`); // Red value (0-255)
          g = Number(`0x${hex.slice(2, 4)}`); // Green value (0-255)
          b = Number(`0x${hex.slice(4, 6)}`); // Blue value (0-255)
          a = Number(`0x${hex.slice(6, 8)}`); // Alpha value (0-255)
        }

        pixels.push(r);
        pixels.push(g);
        pixels.push(b);
        pixels.push(a);
      }
    }
  }

  const input = Uint8Array.from(pixels); // or Uint8ClampedArray
  const image = sharp(input, {
    // because the input does not contain its dimensions or how many channels it has
    // we need to specify it in the constructor options
    raw: {
      width: 1024,
      height: 1024,
      channels: 4
    }
  });
  const clone = image.clone().ensureAlpha();
  await image.toFile(`${__dirname}/../../../plc/latest.png`); // TODO: this needs to be replaced with the current latest image.
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      await clone
        .clone()
        .ensureAlpha()
        .extract({
          left: x * 64,
          top: y * 64,
          width: 64,
          height: 64
        })
        .toFile(`${__dirname}/../../../plc/chunks/${x}-${y}.png`); // TODO: this needs to be replaced with the chunk storage location.
    }
  }
  return last;
};

const mrpc: MetrixRPC.MetrixRPCNode = new MetrixRPC.MetrixRPCNode(
  process.env.RPC_SENDER as string,
  `${process.env.RPC_HOST}:${process.env.RPC_PORT}`,
  process.env.RPC_USER as string,
  process.env.RPC_PASS as string
);
const provider = new RPCProvider(
  'TestNet',
  mrpc,
  process.env.RPC_SENDER as string
);

//const doTest = async () => {
//const lastBlock = await cacheImages('TestNet', provider, 900000);

// TODO: save lastblock

// last block storage
// const chainstate = await ChainState.findOne();
//};

//doTest();
