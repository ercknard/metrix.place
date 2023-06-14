import { Result, ZeroAddress } from 'ethers';

import { fetchWrapper } from '../helpers/FetchWrapper';
import { NetworkType, Provider } from '@metrixcoin/metrilib';
import { MetrixPlace } from '../place';
import { Version } from '../types/Version';
import { CONTRACTS } from '../constants';

const getMetrixPlace = (
  network: NetworkType,
  provider: Provider,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].MetrixPlace === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return new MetrixPlace(CONTRACTS[version][network].MetrixPlace, provider);
};

const getMetrixPlaceAddress = (
  network: NetworkType,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].MetrixPlace === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return CONTRACTS[version][network].MetrixPlace;
};

/**
 * Read only call to contract using local RPC
 *
 * @param network
 * @param contract
 * @param method
 * @param data
 * @param abi
 * @returns
 */
const callContractRPC: (
  network: string,
  contract: string,
  method: string,
  data: any[],
  abi: any[]
) => Promise<Result | undefined> = async (
  network: string,
  contract: string,
  method: string,
  data: any[],
  abi: any[]
) => {
  //console.log(`method ${method}`);
  //console.log(`data ${data}`);
  //console.log(`encoded ${encoded}`);
  try {
    const command = '*';
    let s = `http://localhost:${process.env.NEXT_PUBLIC_HOST_PORT}/api/contract/call`;
    if (typeof window !== 'undefined') {
      s = '/api/contract/call';
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(`callContractRPC: ${s}`);
      console.log(contract, method, data);
    }

    const result = await fetchWrapper.post(s, {
      command,
      contract,
      method,
      content: data,
      abi,
      network
    });
    if (result && !result.error) {
      return result;
    } else if (result && result.error) {
      return result.error;
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('error!!! callContractRPC()');
      console.log(e);
    }
  }
  return undefined;
};

export { callContractRPC, getMetrixPlace, getMetrixPlaceAddress };
