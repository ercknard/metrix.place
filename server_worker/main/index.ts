import { MetrixRPCNode } from './lib/MetrixRPC/MetrixRPC';

import { parentPort, workerData } from 'worker_threads';
import xMessageInterface, {
  MessageContent
} from './util/interface/xMessageInterface';
import isJson from './util/isJson';

import MetrixContract from './lib/contract/MetrixContract';

import Logger from '../main/util/logger';
import { run, setup } from './worker';
const logger = new Logger('worker', 'magenta');
const loggerWorker = logger.createSubLogger('main', 'blue');
const loggerInit = loggerWorker.createSubLogger('init', 'green');
const loggerMsg = loggerWorker.createSubLogger('msg', 'yellow');

export {};

/**
 * RPC Thread Worker
 */
const worker = async () => {
  let _run = true;

  // Start metrix RPC..
  const rpc = new MetrixRPCNode(
    null,
    workerData.rpc.host,
    workerData.rpc.user,
    workerData.rpc.pass
  );

  /**
   * Initialize Worker
   */
  const init = async () => {
    loggerInit.info('RPC Worker Initializing..');
    // run worker
    if ((_run = (await setup()) && (await run(rpc)))) {
      parentPort?.postMessage({
        id: 'i',
        type: { group: 'init' },
        content: { cmd: 'init', msg: 'RPC Worker Started' }
      } as xMessageInterface);
    } else {
      _run = false;
      loggerInit.error('RPC Worker Initialization Failed!!');
      parentPort?.postMessage({
        id: 'x',
        type: { group: 'error' },
        content: {
          cmd: 'init',
          msg: 'run error',
          error: 'RPC Worker Start Failed'
        }
      } as xMessageInterface);
    }
  };

  parentPort?.on('message', async (value: any) => {
    if (isJson(value) && value.type) {
      //loggerMsg.debug(`message from master: ${JSON.stringify(value)}`);
      const msg: xMessageInterface = value;
      const type = msg.type.group;
      const cont = msg.content;
      //loggerMsg.debug(`Receive - Cmd Type: ${type} Cmd: ${cont.cmd}`);
      switch (type) {
        case 'init':
          if (cont.cmd === 'run') {
            await init();
          }

          parentPort?.postMessage({
            id: msg.id,
            type: { group: 'result' },
            content: { cmd: cont.msg, msg: 'started' }
          } as xMessageInterface);
          break;
        case 'cmd':
          if (!_run) {
            parentPort?.postMessage({
              id: msg.id,
              type: { group: 'error' },
              content: {
                cmd: cont.cmd,
                msg: cont.msg,
                error: `Error: No Active RPC Connection!`
              }
            } as xMessageInterface);
            break;
          }
          if (cont.cmd === 'contract_raw') {
            loggerMsg.debug(
              `cmd: ${cont.cmd}  addr: ${cont.addr}  msg: ${cont.msg}`
            );
            try {
              callContract(msg.id, cont);
            } catch (e: any) {
              loggerWorker.error(e ? e.message : 'Worker Error!');
              console.log(e);
            }
          }
          break;
        default:
          parentPort?.postMessage({
            id: msg.id,
            type: { group: 'result' },
            content: { cmd: cont.msg, msg: 'error', error: 'no response' }
          } as xMessageInterface);
          break;
      }
    }
  });

  /********************************************************************** */
  /********************************************************************** */

  /**
   * Call Contract
   *
   * @param cont
   * @param abi
   * @returns
   */
  const callContract = async (
    id: string,
    cont: MessageContent
  ): Promise<void> => {
    if (!cont.addr) {
      return;
    }
    const metrixContract = new MetrixContract(
      rpc,
      '',
      cont.addr,
      undefined,
      ''
    );

    const response = await metrixContract.rawCall(
      cont.addr,
      cont.data,
      cont.msg
    );
    const result = response.executionResult.output;
    //loggerMsg.debug('response= ' + JSON.stringify(response));

    parentPort?.postMessage({
      id,
      type: { group: 'result' },
      content: { cmd: cont.data, msg: 'response', data: result }
    } as xMessageInterface);
  };
};

worker();
