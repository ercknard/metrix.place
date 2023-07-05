import { MetrixRPC } from '@metrixcoin/metrilib';
import { pingLocal } from './process/pingLocalNode';

import Logger from '../util/logger';
import { localCacheImages } from './process/localCacheImages';
const logger = new Logger('worker', 'magenta');
const loggerWorker = logger.createSubLogger('main', 'blue');
const loggerRun = loggerWorker.createSubLogger('run', 'yellow');
const loggerRunSetup = loggerRun.createSubLogger('setup', 'red');

// default counter
let counter = 40;
const check_interval = 15;
const counter_max = 90;

// db init flag
let db = false;

/*************************************************************** */

// Setup pre config
export const setup = async (): Promise<boolean> => {
  //await new Promise((resolve) => setTimeout(resolve, 200));
  await setupDB();
  return Promise.resolve(db);
};

// Start runner
export const run = async (rpc: MetrixRPC.MetrixRPCNode): Promise<boolean> => {
  if (!rpc) {
    loggerRunSetup.error('Unable to connect to local RPC instance!');
    loggerRunSetup.warn('>> Worker will now abort start <<');
    return false;
  }

  // Interval Set
  async function start() {
    if (!db) {
      return false;
    }
    // Worker interval loop..
    setInterval(async () => {
      //parentPort?.postMessage({ type: 'debug', counter: counter });
      if (counter > counter_max) {
        counter = 0;
      }
      if (++counter % check_interval == 0) {
        try {
          // perform work
          await doWork();
        } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ e: any) {
          loggerRun.error('Worker Run Error!');
          loggerRun.error(JSON.stringify(e));
        }
      }
    }, 1000);
    return true;
  }

  /* Do Work */
  async function doWork() {
    if (counter == counter_max) {
      const ping = await pingLocal(rpc, loggerRun);
      if (!ping) {
        return;
      }
    }
    /*
    const cache = await cacheFullPlace(
      process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType,
      rpc,
      loggerRun
    );*/

    if (!(await localCacheImages(rpc, loggerRun))) {
      loggerRun.error('localCacheImages Failed!');
    }
  }

  /************************ */
  // Return run success start
  return start();
};

/*************************************************************** */
/*************************************************************** */

// Setup/Check the database connection
async function setupDB(): Promise<void> {
  try {
    db = true;
    if (db) {
      /*loggerRunSetup.succ(
        'Connection to database has been established successfully.'
      );*/
    }
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ err: any) {
    loggerRunSetup.error(
      'Unable to connect to the database: ' + (err.message ? err.message : '')
    );
    loggerRunSetup.warn('>> Worker will now abort start <<');
  }
  Promise.resolve();
}
