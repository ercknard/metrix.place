import { NetworkType } from '@metrixcoin/metrilib';
import { ProviderType } from '@/types/ProviderType';

const PROVIDER = process.env.NEXT_PUBLIC_APP_PROVIDER as ProviderType;
const NETWORK = process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType;

const ProviderDefault = { type: PROVIDER, network: NETWORK }
export default ProviderDefault;
