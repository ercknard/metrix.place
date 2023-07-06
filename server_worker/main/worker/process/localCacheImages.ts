import { MetrixRPC, NetworkType, RPCProvider } from '@metrixcoin/metrilib';
import NETWORK from '../../util/storage/NetworkDefault';
import { cacheImages } from '../../../../place/helpers/ImageHelper';
import { ChainState } from '../../../../server/db/';

import Logger from '../../util/logger';
import { parentPort } from 'worker_threads';
import xMessageInterface from 'server_worker/main/util/interface/xMessageInterface';

export const localCacheImages = async (
  rpc: MetrixRPC.MetrixRPCNode,
  logger: Logger
): Promise<boolean> => {
  const loggerRunCache = logger.createSubLogger('cacheImages', 'green');

  let lastBlock = 0;
  let lastBlockLog = 0;

  try {
    const bestBlockHash = await rpc.promiseGetBestBlockHash();
    const lastHeight = (await rpc.promiseGetBlockCount()) as number;

    const chainState = await ChainState.findOne({ where: { id: 1 } });
    if (chainState) {
      const state = chainState.get();
      lastBlock = state.blockNumber;
      lastBlockLog = state.blockNumberLastLog;
    } else {
      ChainState.create({
        blockHash: bestBlockHash,
        blockNumber: lastBlock,
        blockNumberLastLog: 0
      });
    }

    if (lastBlockLog == lastHeight) {
      loggerRunCache.debug('Log Height Matches Chain');
      return true;
    } else if (lastBlock == lastHeight) {
      loggerRunCache.debug('Last Height Matches Chain');
      return true;
    }

    const provider = new RPCProvider(
      NETWORK as NetworkType,
      rpc,
      process.env.RPC_SENDER as string
    );

    loggerRunCache.info(
      `Updating Cached Images. Last Logs Height: ${lastBlockLog}  Detected Chain Height: ${lastHeight}`
    );
    lastBlockLog = await cacheImages(
      NETWORK as NetworkType,
      provider,
      lastBlockLog
    );

    ChainState.update(
      {
        blockHash: bestBlockHash,
        blockNumber: lastHeight,
        blockNumberLastLog: lastBlockLog
      },
      { where: { id: 1 } }
    );

    parentPort?.postMessage({
      type: { group: 'info' },
      content: { cmd: 'cache', msg: bestBlockHash }
    } as xMessageInterface);

    if (lastBlockLog != lastBlock) {
      loggerRunCache.succ(
        `Updated Cached Images. Logs Block Height: ${lastBlockLog}`
      );
    }

    return true;
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ e: any) {
    loggerRunCache.error(e.message ? e.message : 'Cachek Images Error!');
    return false;
  }
};
