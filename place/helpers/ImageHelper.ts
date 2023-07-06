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
        nBlock: number,
        nTransaction: number
      ] = [
        Number(decoded[0].toString()),
        Number(decoded[1].toString()),
        BigInt(decoded[2].toString()).toString(16),
        log.blockNumber,
        log.transactionIndex
      ];
      return tup;
    })
    .sort((a, b) => {
      if (a[0] !== b[0]) {
        return a[0] - b[0]; // Sort by lowest block number first
      }

      // If block numbers are the same, compare transaction indexes
      return a[1] - b[1]; // Sort by lowest transaction index within the same block
    });
  const pixels: number[] = [];
  let d = undefined;
  try {
    const { data } = await sharp(`${__dirname}/../../plc/latest.png`, {
      raw: {
        width: 1024,
        height: 1024,
        channels: 4
      }
    })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    d = data;
  } catch (e) {
    console.log(e);
    d = [];
  }

  if (d.length == 0) {
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        let r = 0; // Red value (0-255)
        let g = 0; // Green value (0-255)
        let b = 0; // Blue value (0-255)
        let a = 0; // Alpha value (0-255)
        for (const log of logs.filter((log) => log[0] === x && log[1] === y)) {
          if (log[3] > last) last = log[3];
          const hex =
            log[2].length === 8
              ? log[2]
              : `${'0'.repeat(8 - log[2].length)}${log[2]}`;

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
        for (const log of logs.filter(
          (log) => log[0] === x && log[1] === y && log[3] >= last
        )) {
          if (log[3] > last) last = log[3];
          const hex =
            log[2].length === 8
              ? log[2]
              : `${'0'.repeat(8 - log[2].length)}${log[2]}`;

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
  await image.toFile(`${__dirname}/../../plc/latest.png`);
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
        .toFile(`${__dirname}/../../plc/chunks/${x}-${y}.png`);
    }
  }
  return last;
};
