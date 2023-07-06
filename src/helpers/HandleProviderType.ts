import ProviderDefault from '../config/ProviderDefault';
import LocalProvider from '../provider/LocalProvider';
import { APIProvider, NetworkType } from '@metrixcoin/metrilib';

export default function HandleProviderType(network: NetworkType) {
  let provider;
  if (
    network == process.env.NEXT_PUBLIC_APP_NETWORK &&
    ProviderDefault.type == 'rpc'
  ) {
    provider = new LocalProvider(network);
    if (process.env.NODE_ENV != 'production') {
      console.log('using local provider');
    }
  } else {
    provider = new APIProvider(network);
    if (process.env.NODE_ENV != 'production') {
      console.log('using api provider');
    }
  }
  return provider;
}
