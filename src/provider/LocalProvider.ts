import { APIProvider, NetworkType } from '@metrixcoin/metrilib';
import { callContractRPC } from '../utils/ContractUtils';
import { Result } from 'ethers';

export default class LocalProvider extends APIProvider {
  constructor(network: NetworkType) {
    super(network);
  }

  async callContract(
    contract: string,
    method: string,
    data: any[],
    abi: any[]
  ): Promise<Result | undefined> {
    //console.log(contract, method);
    return await callContractRPC(
      this.network,
      contract.startsWith('0x')
        ? contract.slice(2).toLowerCase()
        : contract.toLowerCase(),
      method,
      data,
      abi
    );
  }
}
