/* eslint-disable */

import { ethers } from 'ethers';

export const getABI = async (contract: string) => {
  let abi: any[] = [];
  const version = process.env.NEXT_PUBLIC_APP_VERSION as string;
  try {
    abi = JSON.parse(
      JSON.stringify(await import(`../../../../src/abi/${version}/${contract}`))
    )[contract];
  } catch (e) {
    console.log(e);
  }
  return abi;
};

export const getABIloc = async (contract: 'MRC20' | 'MRC721' | string) => {
  let abi: any[] = [];
  try {
    abi = JSON.parse(
      JSON.stringify(await import(`../../../../src/abi/token/${contract}`))
    )[contract];
  } catch (e) {
    console.log(e);
  }
  return abi;
};

export const AddressZero = ethers.constants.AddressZero.replace('0x', '');

export const getContractAddress = (network: string, contract: string) => {
  const ContractAddresses = require(`../../../../networks/${process.env.NEXT_PUBLIC_APP_VERSION}/${network}.json`);
  const address = ContractAddresses[contract];
  return address ? address : AddressZero;
};
