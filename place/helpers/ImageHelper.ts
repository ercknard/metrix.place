import {
  MetrixRPC,
  NetworkType,
  RPCEventLogs,
  RPCProvider
} from '@metrixcoin/metrilib';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { getMetrixPlace } from '../index';

dotenv.config();

const cacheImages = async (
  network: NetworkType,
  provider: RPCProvider,
  lastBlock: number
) => {
  const place = getMetrixPlace(network, provider);
  const allLogs = (await place.getEventLogs()) as RPCEventLogs;
  const logs = allLogs.filter((log) => {
    return log.blockNumber > lastBlock;
  });
  console.log(`logs.length: ${logs.length}`);
  const pixels: number[] = [];
  const { data } = await sharp(`${__dirname}/../../../public/images/latest.png`) // TODO: this needs to be replaced with the current latest image.
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
  const clone = image.clone().ensureAlpha();
  await image.toFile(`${__dirname}/../../../public/images/latest.png`); // TODO: this needs to be replaced with the current latest image.
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
        .toFile(`${__dirname}/../../../public/images/chunks/${x}-${y}.png`); // TODO: this needs to be replaced with the chunk storage location.
    }
  }
  return logs[0].blockNumber;
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

const doTest = async () => {
  const lastBlock = await cacheImages('TestNet', provider, 900000);

  // TODO: save lastblock

  // last block storage
  // const chainstate = await ChainState.findOne();
};

doTest();
