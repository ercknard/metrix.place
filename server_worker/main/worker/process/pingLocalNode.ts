import { parentPort } from 'worker_threads';
import { MetrixRPCNode } from '../../lib/MetrixRPC/MetrixRPC';
import xMessageInterface from '../../util/interface/xMessageInterface';

import Logger from '../../util/logger';

export const pingLocal = async (
  rpc: MetrixRPCNode,
  logger: Logger
): Promise<boolean> => {
  const loggerRunPing = logger.createSubLogger('ping', 'red');
  try {
    const bestBlockHash = await rpc.promiseGetBestBlockHash();
    parentPort?.postMessage({
      type: { group: 'info' },
      content: { cmd: 'bestBlockHash', msg: bestBlockHash }
    } as xMessageInterface);
    return true;
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ e: any) {
    loggerRunPing.error(e.message ? e.message : 'Ping Local Node Error!');
    return false;
  }
};
