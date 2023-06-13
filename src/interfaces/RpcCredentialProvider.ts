export default interface RpcCredentialProvider {
  username: string;
  password: string;
  host: string;
  port: string;
  sender: string;
  uri: () => string;
}
