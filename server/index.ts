import fs from 'fs';

import { initWorker } from '../server_worker';
import Logger from './util/logger';

import dotenv from 'dotenv';

dotenv.config();
import { sequelize } from './db';
import { Account } from './db/models';

const logger = new Logger('server', 'purple');
const loggerInit = logger.createSubLogger('init', 'red');
const loggerSetup = logger.createSubLogger('setup', 'yellow');

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const useWorker = process.env.WORKER_ENABLED === 'true';

// Check for .env config exist
if (!fs.existsSync('.env')) {
  fs.copyFileSync('default.env', '.env');
  loggerSetup.warn(`> Created default .env configuration file..`);
  loggerSetup.warn(`> Please Verify Setup.`);
  process.exit(1);
} else {
  loggerSetup.succ(`> Found .env Config for '${appName}'`);
}

async function init() {
  if (useWorker) {
    try {
      // Start worker thread..
      const w = initWorker(true);
      if (!w) {
        loggerSetup.error('Unable to start worker..');
        loggerSetup.warn('>> Server will now abort start <<');
        return process.exit(1);
      } else {
        loggerSetup.succ(`Worker ${w.threadId} starting successfully.`);
      }
    } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ err: any) {
      loggerSetup.error(
        'Unable to start worker: ' + (err.message ? err.message : '')
      );
      loggerSetup.warn('>> Server will now abort start <<');
      return process.exit(1);
    }
  }

  try {
    await sequelize.sync();
    sequelize.modelManager.addModel(Account);

    loggerInit.succ(`>> ${appName} Server has started successfully <<`);
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ err: any) {
    loggerInit.error(
      'Unable to start application: ' + (err.message ? err.message : '')
    );
    return process.exit(1);
  }
}

loggerInit.info(`>> Starting ${appName} Server...`);
init();

// Start .next server app
import './app';
