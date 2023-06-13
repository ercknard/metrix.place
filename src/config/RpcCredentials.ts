import RpcCredentialProvider from '@/interfaces/RpcCredentialProvider';

export const RpcCredentials: RpcCredentialProvider = {
  username: process.env.RPC_USER as string,
  password: process.env.RPC_PASS as string,
  host: process.env.RPC_HOST as string,
  port: process.env.RPC_PORT as string,
  sender: process.env.RPC_SENDER as string,
  uri: () => {
    return `${process.env.RPC_HOST as string}:${process.env.RPC_PORT as string}`;
  }
};
