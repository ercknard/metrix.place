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

  try {
    const bestBlockHash = await rpc.promiseGetBestBlockHash();
    const lastHeight = await rpc.promiseGetBlockCount();

    const chainState = await ChainState.findOne({ where: { id: 0 } });
    if (chainState) {
      const state = chainState.get();
      lastBlock = state.blockNumber;
    } else {
      ChainState.create({ blockNumber: lastBlock, blockHash: bestBlockHash });
    }

    if (lastBlock == lastHeight) {
      return true;
    }

    const provider = new RPCProvider(
      NETWORK as NetworkType,
      rpc,
      process.env.RPC_SENDER as string
    );

    lastBlock = await cacheImages(NETWORK as NetworkType, provider, lastBlock);

    const blockhash = await rpc.promiseGetBlockHash(lastBlock);

    ChainState.update(
      { blockNumber: lastBlock, blockHash: blockhash },
      { where: { id: 0 } }
    );
    parentPort?.postMessage({
      type: { group: 'info' },
      content: { cmd: 'cache', msg: bestBlockHash }
    } as xMessageInterface);
    loggerRunCache.succ(`Updated Cached Images. Block Height: ${lastBlock}`);

    return true;
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ e: any) {
    loggerRunCache.error(e.message ? e.message : 'Cachek Images Error!');
    return false;
  }
};
