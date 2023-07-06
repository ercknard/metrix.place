import { parentPort } from 'worker_threads';
import { MetrixRPC, NetworkType, RPCProvider } from '@metrixcoin/metrilib';
import xMessageInterface from '../../util/interface/xMessageInterface';
import { getMetrixPlace } from '../../../../place';

import Logger from '../../util/logger';

export const cacheFullPlace = async (
  network: NetworkType,
  rpc: MetrixRPC.MetrixRPCNode,
  logger: Logger
): Promise<boolean> => {
  const sublogger = logger.createSubLogger('cache', 'red');
  try {
    const provider = new RPCProvider(
      network,
      rpc,
      process.env.RPC_SENDER as string
    );
    const place = getMetrixPlace(network, provider);
    const pixels = [];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const chunk: number[][] = await place.getChunkColors(
          BigInt(y * 64),
          BigInt(x * 64)
        ); /*[]*/

        for (const row of chunk) {
          for (const col of row) {
            const r = (col >> 24) & 0xff;
            const g = (col >> 16) & 0xff;
            const b = (col >> 8) & 0xff;
            const a = col & 0xff;
            pixels.push(r);
            pixels.push(g);
            pixels.push(b);
            pixels.push(a);
          }
        }
      }
    }
    // TODO: cache full place from current state.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const buffer = Uint8Array.from(pixels);

    parentPort?.postMessage({
      type: { group: 'info' },
      content: { cmd: 'place', msg: '' }
    } as xMessageInterface);
    return true;
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ e: any) {
    sublogger.error(e.message ? e.message : 'Ping Local Node Error!');
    return false;
  }
};
