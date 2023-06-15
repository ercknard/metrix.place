import { ethers, utils } from 'ethers';
import ContractResponse from '../interface/ContractResponse';
import TransactionReceipt from '../interface/TransactionReceipt';
import { MetrixRPCNode } from '../MetrixRPC/MetrixRPC';

const AddressZero = ethers.constants.AddressZero.replace('0x', '');

export default class MetrixContract {
  mrpc: MetrixRPCNode;
  name: string;
  address: string;
  abi?: any[];
  bytecode: string;

  constructor(
    mrpc: MetrixRPCNode,
    name: string,
    address: string,
    abi: any[] | undefined,
    bytecode: string
  ) {
    this.mrpc = mrpc;
    this.name = name;
    this.address = address;
    this.abi = abi;
    this.bytecode = bytecode;
  }

  private async getTxReceipts(tx: any) {
    if (!this.abi) {
      return [];
    }
    let receipts: TransactionReceipt[] = [];
    try {
      const { txid, sender, hash160 } = tx;
      console.log(`txid: ${txid}`, `sender: ${sender}`, `hash160: ${hash160}`);
      let transaction = await this.mrpc.promiseGetTransaction(txid);
      let transactionReceipt: TransactionReceipt[] =
        await this.mrpc.promiseGetTransactionReceipt(txid);
      console.log(
        `txid: ${transaction.txid}`,
        `confirmations: ${transaction.confirmations}`
      );
      while (
        transactionReceipt.length < 1 ||
        (transaction.confirmations < 1 && transaction.confirmations > -1)
      ) {
        console.log('Waiting for the transaction to confirm');
        await new Promise((resolve) => setTimeout(resolve, 60000));
        transaction = await this.mrpc.promiseGetTransaction(txid);
        transactionReceipt = await this.mrpc.promiseGetTransactionReceipt(txid);
      }
      console.log(
        `txid: ${transaction.txid}`,
        `confirmations: ${transaction.confirmations}`
      );
      if (transaction.confirmations == -1) {
        console.log(`Failed, transaction orphaned`);
        return [];
      }
      const iface = new utils.Interface(this.abi);

      const eventMap = new Map();
      for (const receipt of transactionReceipt) {
        for (const log of receipt.log) {
          console.log(`log: ${JSON.stringify(log)}`);

          if (log.address === this.address) {
            const topics = log.topics.map((topic: string) => {
              return `0x${topic}`;
            });
            console.log(`topics: ${JSON.stringify(topics)}`);
            const data = `0x${log.data}`;
            const description = iface.parseLog({ data, topics });
            const event = description.eventFragment;
            if (description && event) {
              const name = event.name;
              const events = eventMap.get(name) ? eventMap.get(name) : [];
              events.push({ event, description, timestamp: log.timestamp });
              eventMap.set(name, events);
            }
          }
        }
        console.log(`receipt: ${JSON.stringify(transactionReceipt, null, 2)}`);
        receipts.push(receipt);
      }
      for (const key of eventMap.keys()) {
        for (const event of eventMap.get(key) ? eventMap.get(key) : []) {
          console.log(JSON.stringify(event, null, 2));
        }
      }
    } catch (e: any) {
      console.log(
        `Failed, ${e.message ? e.message : 'An unknown error occurred'}`
      );
    }
    return receipts;
  }

  /**
   * Deploy the contract
   *
   * @param {string[]|undefined} constructorArgs The constructor arguments for the contract
   *
   * @return {string} The address of the deployed contract or the zero address if it failed
   *
   * @public
   */
  public async deploy(constructorArgs?: string[]): Promise<string> {
    console.log(
      `Attempting to deploy ${this.name}(${
        constructorArgs ? `${JSON.stringify(constructorArgs)}` : ''
      })`
    );
    let contract;

    if (this.abi && this.bytecode) {
      const iface: utils.Interface = new utils.Interface(this.abi);
      const data =
        constructorArgs && constructorArgs.length > 0
          ? iface.encodeDeploy([...constructorArgs]).replace('0x', '')
          : '';
      const deployment = await this.mrpc.promiseCreateContract(
        `${this.bytecode}${data}`,
        Number(process.env.GAS_LIMIT),
        parseFromIntString(process.env.GAS_PRICE as string, 8),
        process.env.DEPLOYMENT_ACCT as string
      );
      if (deployment) {
        const receipts = await this.getTxReceipts(deployment);
        if (receipts.length > 0) {
          for (const receipt of receipts) {
            if (
              receipt.excepted == 'OutOfGas' ||
              receipt.excepted == 'OutOfGasIntrinsic'
            ) {
              console.log(`Failed, ${receipt.excepted}`);
              return AddressZero;
            } else {
              contract = receipt.contractAddress;
              console.log('Success!');
            }
          }
        } else {
          console.log(`Failed, no receipts`);
          return AddressZero;
        }
      }
    }

    this.address = contract ? contract : AddressZero;
    return this.address;
  }

  /**
   * Perform calltocontract
   *
   * @param {string} method The contract method to call
   * @param {string[]|undefined} args The arguments
   *
   * @return {utils.Result} see ethers.utils.Result
   *
   * @public
   */
  public async call(method: string, args?: string[]): Promise<any> {
    let result: utils.Result | undefined = undefined;
    if (!this.abi) {
      return result;
    }
    const iface = new utils.Interface(this.abi);
    const encoded = iface.encodeFunctionData(method, args).replace('0x', '');
    const response: ContractResponse = (await this.mrpc.promiseCallContract(
      this.address,
      encoded,
      process.env.DEPLOYMENT_ACCT as string
    )) as ContractResponse;
    if (response) {
      const output = response.executionResult.output;
      result = iface.decodeFunctionResult(method, `0x${output}`);
    }
    return result;
  }

  public async rawCall(
    contract: string,
    data: string,
    sender: string
  ): Promise<ContractResponse> {
    const response: ContractResponse = (await this.mrpc.promiseCallContract(
      contract,
      data,
      sender
    )) as ContractResponse;
    return response;
  }

  /**
   * Perform sendtocontract
   *
   * @param {string} method The contract method to send to
   * @param {string[] | undefined} args The arguments to use
   * @param {string | undefined} value The amount to send to the contract
   * @param {number | undefined} gasLimit The amount of gas units allowed
   * @param {number | undefined} gasPrice The satoshi price per gas
   *
   * @return {utils.Result} see ethers.utils.Result
   *
   * @public
   */
  public async send(
    method?: string,
    args?: any[],
    value: string | undefined = '0',
    gasLimit: number | undefined = 250000,
    gasPrice: number | undefined = 5000
  ): Promise<{
    txid: string;
    sender: string;
    hash160: string;
  }> {
    let result = {
      txid: ethers.constants.HashZero.replace('0x', ''),
      sender: AddressZero,
      hash160: AddressZero
    };
    if (!this.abi) {
      return result;
    }
    const iface = new utils.Interface(this.abi);
    const encoded = method
      ? iface.encodeFunctionData(method, args).replace('0x', '')
      : '';
    const response = await this.mrpc.promiseSendToContract(
      this.address,
      encoded,
      value,
      gasLimit,
      gasPrice * 1e-8,
      process.env.DEPLOYMENT_ACCT as string,
      true,
      true
    );
    if (response) {
      const receipts = await this.getTxReceipts(response);
      if (receipts.length > 0) {
        result = {
          txid: receipts[0].transactionHash,
          sender: await this.mrpc.promiseFromHexAddress(receipts[0].from),
          hash160: receipts[0].from
        };
      }
    }
    return result;
  }

  public async rawSend(
    contract: string,
    data: string,
    sender: string,
    value: string | undefined = '0',
    gasLimit: number | undefined = 250000,
    gasPrice: number | undefined = 5000
  ): Promise<{
    txid: string;
    sender: string;
    hash160: string;
  }> {
    let result = {
      txid: ethers.constants.HashZero.replace('0x', ''),
      sender: AddressZero,
      hash160: AddressZero
    };
    const response = await this.mrpc.promiseSendToContract(
      contract,
      data,
      value,
      gasLimit,
      gasPrice * 1e-8,
      sender,
      true,
      true
    );
    if (response) {
      const receipts = await this.getTxReceipts(response);
      if (receipts.length > 0) {
        result = {
          txid: receipts[0].transactionHash,
          sender: await this.mrpc.promiseFromHexAddress(receipts[0].from),
          hash160: receipts[0].from
        };
      }
    }
    return result;
  }
}

function parseFromIntString(intString: string, precision: number): string {
  const length = intString.length;
  let integers = '0';
  let decimals = '0';
  if (length > precision) {
    integers = intString.substring(0, length - precision);
    decimals = intString.substring(length - precision, length);
  } else {
    integers = '0';
    decimals = '';
    for (let i = 0; i < precision; i++) {
      if (i <= length - 1) {
        decimals += intString.substring(i, i + 1);
      } else {
        decimals = '0' + decimals;
      }
    }
  }
  return `${integers}.${decimals}`;
}
