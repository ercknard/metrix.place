import { MetrixRPCNode } from '../lib/MetrixRPC/MetrixRPC';
import { pingLocal } from './process/pingLocalNode';

import Logger from '../util/logger';
const logger = new Logger('worker', 'magenta');
const loggerWorker = logger.createSubLogger('main', 'blue');
const loggerRun = loggerWorker.createSubLogger('run', 'yellow');
const loggerRunSetup = loggerRun.createSubLogger('setup', 'red');

// default counter
let counter = 30;
const counter_max = 60;

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
export const run = async (rpc: MetrixRPCNode): Promise<boolean> => {
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
      if (counter++ == 0) {
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
    const ping = await pingLocal(rpc, loggerRun);
    if (!ping) {
      return;
    }

    // TODO: Do work here..
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
