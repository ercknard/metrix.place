import { RPCProvider, MetrixRPC, NetworkType } from '@metrixcoin/metrilib';

import { NextApiRequest, NextApiResponse } from 'next';
import { bnToHex } from '../../../../utils/Parsers';
import { RpcCredentials } from '../../../../config/RpcCredentials';

const getValues = (obj: any /* eslint-disable-line */) => {
  let values: any;
  if (obj instanceof Error) {
    values = {};
    values.message = (obj as Error).message;
    values.stack = (obj as Error).stack;
  } else if (obj instanceof Function) {
    values = `function: ${(obj as Function).name}` /* eslint-le-line */;
  } else if (typeof obj === 'bigint') {
    values = bnToHex(obj as bigint);
  } else if (typeof obj === 'object' && obj !== null) {
    values = !Array.isArray(obj) ? {} : [];
    if (Object.entries(obj).length > 0) {
      for (const [key, value] of Object.entries(obj)) {
        values[key] = getValues(value);
      }
    } else {
      values = obj;
    }
  } else {
    values = obj;
  }
  return values;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const data = req.body;

    switch (data.command) {
      case '*': {
        const network: NetworkType = data.network;
        const contract: string = data.contract;
        const method: string = data.method;
        const _data: any[] = data.content;
        const abi: any[] = data.abi;

        const mrpc: MetrixRPC.MetrixRPCNode = new MetrixRPC.MetrixRPCNode(
          null,
          RpcCredentials.uri(),
          RpcCredentials.username,
          RpcCredentials.password
        );
        const provider = new RPCProvider(network, mrpc, RpcCredentials.sender);

        try {
          const response = await provider.callContract(
            contract,
            method,
            _data,
            abi
          );

          if (response) {
            const r = getValues(response);
            //console.log(r);
            res.status(200).json(r);
          } else {
            console.log('Error: Response is undefined in Contract Call!');
            res.status(500).json('Internal Error on response!');
          }
        } catch (e) {
          //console.log('Internal Error on Contract Call!');
          if (process.env.NODE_ENV !== 'production') {
            const err = e as Error;
            if (err.message.includes('ERC721: invalid token ID')) {
              err.message.includes('ERC721: invalid token ID');
            } else if (
              err.message.includes('ERC721: owner query for nonexistent token')
            ) {
              console.log(
                `>>> Internal Error on Contract Call! -\tERC721: owner query for nonexistent token <<<`
              );
            } else {
              console.log(e);
            }
          }
          res.status(500).json('Internal Error on Contract Call!');
        }

        break;
      }
      default: {
        res.status(404).json('Call not found!');
        break;
      }
    }
  } else {
    res.status(405).end();
  }
}
