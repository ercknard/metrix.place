import { parentPort } from 'worker_threads';
import { MetrixRPC, NetworkType, RPCProvider } from '@metrixcoin/metrilib';
import { getMetrixPlace } from '../../../../src/utils/ContractUtils';
import xMessageInterface from '../../util/interface/xMessageInterface';

import Logger from '../../util/logger';

export const cacheFullPlace = async (
  network: NetworkType,
  rpc: MetrixRPC.MetrixRPCNode,
  logger: Logger
): Promise<boolean> => {
  const sublogger = logger.createSubLogger('cache', 'red');
  try {
    const provider = new RPCProvider(network, rpc, '');
    const place = getMetrixPlace(network, provider);
    const pixels = [];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const chunk = await place.getChunkColors(
          BigInt(y * 64),
          BigInt(x * 64)
        );

        for (const row of chunk) {
          for (const col of row) {
            const r = col << 16;
            const g = (col - r) << 8;
            const b = col - r - g;
            pixels.push(r);
            pixels.push(g);
            pixels.push(b);
          }
        }
      }
    }
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
