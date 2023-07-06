export default interface xMessageInterface {
  id: string;
  type: CmdType;
  content: MessageContent;
}

export interface MessageContent {
  cmd: string;
  msg: string;
  call?: string;
  addr?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data?: any;
  error?: string;
}

export type CmdType = {
  group: 'init' | 'cmd' | 'error' | 'debug' | 'info' | 'result';
};
