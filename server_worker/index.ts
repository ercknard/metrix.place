import { isMainThread, threadId, Worker } from 'worker_threads';
import isJson from './main/util/isJson';
import xMessageInterface, {
  CmdType,
  MessageContent
} from './main/util/interface/xMessageInterface';

import Logger from './main/util/logger';
import { randomBytes, randomUUID } from 'crypto';
const logger = new Logger('worker', 'magenta');
const loggerMaster = logger.createSubLogger('master', 'purple');
const loggerInit = loggerMaster.createSubLogger('init', 'red');
const loggerMsg = loggerMaster.createSubLogger('msg', 'orange');

// worker instance..
let worker: Worker;

/**
 * Initialize Worker Thread Handler
 *
 * @param run Handler Start
 */
const initWorker = (run: boolean): Worker | undefined => {
  if (!worker) {
    if (!process.env.RPC_HOST || !process.env.RPC_USER) {
      return undefined;
    }
    const rpcHost = `${
      process.env.RPC_HOST.endsWith('/')
        ? process.env.RPC_HOST.substring(0, process.env.RPC_HOST.length)
        : process.env.RPC_HOST
    }:${process.env.RPC_PORT}`;
    const rpcUser = process.env.RPC_USER ? process.env.RPC_USER : '';
    const rpcPass = process.env.RPC_PASS ? process.env.RPC_PASS : '';
    loggerInit.debug(`Triggering Worker Init.. Connecting to: ${rpcHost}`);

    worker = new Worker('./server_worker/main/index.js', {
      workerData: {
        value: 1,
        path: './index.ts',
        rpc: {
          host: rpcHost,
          user: rpcUser,
          pass: rpcPass
        }
      }
    });
    if (worker) {
      loggerInit.debug(
        `>> Worker '${worker.threadId}' Created from '${
          !isMainThread ? threadId : '*'
        }' <<`
      );
      if (run) {
        runWorker();
      }
    }
  }
  return worker;
};

/**
 * Handle worker setup
 */
const runWorker = () => {
  // handle message from worker
  worker.on(
    'message',
    (/* eslint-disable @typescript-eslint/no-explicit-any */ value: any) => {
      if (isJson(value) && value.type) {
        //loggerMsg.debug(`message from worker: ${JSON.stringify(value)}`);
        const msg: xMessageInterface = JSON.parse(JSON.stringify(value));
        //console.log(msg);
        const type = msg.type.group;
        const cont = msg.content;
        loggerMsg.debug(`Response - Cmd Type: ${type} Cmd: ${cont.cmd}`);
        switch (type) {
          case 'init':
            loggerMsg.info(`Message from worker: ${cont.msg}`);
            break;
          case 'info':
            loggerMsg.info(`Info from worker: ${cont.msg}`);
            break;
          case 'error':
            loggerMsg.warn(`Error from worker: ${cont.error}`);
            break;
          default:
            break;
        }
      }
    }
  );

  const begin = async () => {
    loggerInit.debug('> Begin Run Worker..');
    // send init message to worker.
    await sendMsg({ group: 'init' }, 'run', 'start');
  };

  begin();
};

/**
 * send command to worker
 *
 * @param cmd Command
 * @param msg Content Message
 * @param cmdCallback Result
 */
const sendCmd = (
  cmd: string,
  msg: string,
  /* eslint-disable no-unused-vars */
  cmdCallback: (content: MessageContent) => void
): void => {
  initWorker(false);
  const msgId = randomUUID.toString();
  // send message to worker thread
  worker.postMessage({
    id: msgId,
    type: { group: 'cmd' },
    content: { cmd, msg }
  } as xMessageInterface);
  // handle error timeout
  const timeout = setTimeout(() => {
    cmdCallback({ cmd, msg: '', error: 'timeout error' } as MessageContent);
  }, 5500);
  // Listen for response..
  worker.once(
    'message',
    (/* eslint-disable @typescript-eslint/no-explicit-any */ value: any) => {
      if (isJson(value) && value.type) {
        const msg: xMessageInterface = JSON.parse(JSON.stringify(value));
        if (msg.type.group === 'result') {
          clearTimeout(timeout);
          cmdCallback(msg.content);
        }
      }
    }
  );
};

/**
 * send promise message to worker
 *
 * @param type Command Type
 * @param cmd Command
 * @param msg Content Message
 * @returns
 */
async function sendMsg(
  type: CmdType,
  cmd: string,
  msg: string
): Promise<MessageContent> {
  return new Promise<MessageContent>((resolve, reject) => {
    if (!initWorker(false)) {
      reject({ cmd, msg: 'error', error: 'worker invalid' } as MessageContent);
    }
    const msgId = randomUUID.toString();
    // send message to worker thread
    worker.postMessage({
      id: msgId,
      type,
      content: { cmd, msg }
    } as xMessageInterface);
    // Listen for response..
    const listener = (
      /* eslint-disable @typescript-eslint/no-explicit-any */ value: any
    ) => {
      if (isJson(value) && value.type) {
        const msg: xMessageInterface = JSON.parse(JSON.stringify(value));
        if (msg.type.group === 'result') {
          clearTimeout(timeout);
          resolve(msg.content);
        }
        if (msg.type.group === 'error') {
          clearTimeout(timeout);
          resolve(msg.content);
        }
        worker.removeListener('message', listener);
      }
    };

    // handle error timeout
    const timeout = setTimeout(() => {
      worker.removeListener('message', listener);
      resolve({ cmd, msg: '', error: 'timeout error' } as MessageContent);
    }, 10400);

    worker.addListener('message', listener);
  });
}

/**
 * Send promise message call to worker
 *
 * @param type Command Type
 * @param cmd Command
 * @param addr Contract Address
 * @param call Contract Call
 * @param msg Content Message
 * @param data Content Data
 * @returns MessageContent as Promise
 */
async function sendCall(
  type: CmdType,
  cmd: string,
  addr: string,
  call: string,
  msg: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */ data?: any
): Promise<MessageContent> {
  return new Promise<MessageContent>((resolve, reject) => {
    if (!initWorker(false)) {
      reject({ cmd, msg: 'error', error: 'worker invalid' } as MessageContent);
    }
    const bytes = randomBytes(8);
    const hex = bytes.toString('hex');
    const msgId = `0x${hex}`;
    // send message to worker thread
    worker.postMessage({
      id: msgId,
      type,
      content: { cmd, msg, call, addr, data }
    } as xMessageInterface);
    // Listen for response..
    const listener = (
      /* eslint-disable @typescript-eslint/no-explicit-any */ value: any
    ) => {
      if (isJson(value) && value.type) {
        const msg: xMessageInterface = JSON.parse(JSON.stringify(value));
        //console.log('MSG ID: ' + msg.id);
        if (msg.id === msgId) {
          if (msg.type.group === 'result') {
            clearTimeout(timeout);
            resolve(msg.content);
          }
          if (msg.type.group === 'error') {
            clearTimeout(timeout);
            resolve(msg.content);
          }
          worker.removeListener('message', listener);
        }
      }
    };

    // handle error timeout
    const timeout = setTimeout(() => {
      worker.removeListener('message', listener);
      resolve({ cmd, msg: 'error', error: 'timeout error' } as MessageContent);
    }, 10400);

    worker.addListener('message', listener);
  });
}

export { initWorker, sendCmd, sendMsg, sendCall };
