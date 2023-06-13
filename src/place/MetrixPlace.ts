import {MetrixContract, Provider} from '@metrixcoin/metrilib';
import ABI from '@/abi';

export default class MetrixPlace extends MetrixContract {
  constructor(address: string, provider: Provider) {
    super(address, provider, ABI.MetrixPlace);
  }
}
