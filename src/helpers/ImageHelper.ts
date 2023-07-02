import {
  MetrixRPC,
  NetworkType,
  RPCEventLogs,
  RPCProvider
} from '@metrixcoin/metrilib';
import sharp from 'sharp';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getMetrixPlace } from '@place/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const cacheImages = async (network: NetworkType, provider: RPCProvider) => {
  const place = getMetrixPlace(network, provider);
  const lastBlock = 900000; // TODO: this needs to be replaced with the actual last block
  const allLogs = (await place.getEventLogs()) as RPCEventLogs;
  const logs = allLogs.filter((log) => {
    return log.blockNumber > lastBlock;
  });
  const pixels: number[] = [];
  console.log(__dirname);
  const { data } = await sharp(`${__dirname}/../../public/images/default.jpg`) // TODO: this needs to be replaced with the current latest image.
    .raw()
    .toBuffer({ resolveWithObject: true });
  // TODO: tprocess the logs and set any needed pixels

  if (data.length == 0) {
    for (let i = 0; i < 1024; i++) {
      for (let j = 0; j < 1024; j++) {
        pixels.push(0);
        pixels.push(0);
        pixels.push(0);
        pixels.push(0);
      }
    }
  }

  const input = Uint8Array.from(data.length > 0 ? data : pixels); // or Uint8ClampedArray
  const image = sharp(input, {
    // because the input does not contain its dimensions or how many channels it has
    // we need to specify it in the constructor options
    raw: {
      width: 1024,
      height: 1024,
      channels: 4
    }
  });
  const clone = image.clone();
  await image.toFile(`${__dirname}/../../public/images/default.jpg`); // TODO: this needs to be replaced with the current latest image.
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      await clone
        .clone()
        .extract({
          left: x * 64,
          top: y * 64,
          width: 64,
          height: 64
        })
        .toFile(`${__dirname}/../../public/images/chunks/${y}-${x}.jpg`); // TODO: this needs to be replaced with the chunk storage location.
    }
  }
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

cacheImages('TestNet', provider);
