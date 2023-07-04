import { NetworkType } from '@metrixcoin/metrilib';
import Deployment from '@place/interfaces/Deployment';
import { contracts as MainNet } from '@place/network/MainNet/1.0.0';
import { contracts as TestNet } from '@place/network/TestNet/1.0.0';
import { ethers } from 'ethers';
import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';

interface ContractProps {
  network: NetworkType;
  contract: 'MetrixPlace';
  address: string;
  abi: any[];
}

const contracts: { MainNet: Deployment; TestNet: Deployment } = {
  MainNet: MainNet,
  TestNet: TestNet
};

export default function ContractFunctions(props: ContractProps): JSX.Element {
  const getDeployedContract = (network: NetworkType, name: string) => {
    const deployments = contracts[network];
    return (deployments as any)[name];
  };

  const setupFunctions = async () => {
    if (window) {
      const functions = document.getElementById(`${props.contract}Functions`);
      if (functions) {
        functions.innerHTML = '';
        let colCount = 0;
        const iface = new ethers.Interface(props.abi);
        iface.forEachFunction(
          (func: ethers.FunctionFragment, index: number) => {
            const sig = func.format('sighash').replace('0x', '');
            const key = `${func.name}(${
              func.inputs.length > 0
                ? `${func.inputs
                    .map((input) => {
                      return input.type;
                    })
                    .join(',')}`
                : ''
            })`;
            const segment = document.createElement('div');
            let color = 'violet';
            let cs = 'vio';
            switch (func.stateMutability) {
              case 'payable':
                color = 'pink';
                cs = 'pnk';
                break;
              case 'nonpayable':
                color = 'purple';
                cs = 'prp';
                break;
              default:
                break;
            }
            segment.className = `ui segment compact inverted`;
            segment.style.opacity = '0.88';
            const column = document.createElement('div');
            column.className = 'eight wide column stretched';
            const form = document.createElement('form');
            form.className = 'ui form';
            form.id = `${props.contract}_${sig}`;
            form.onsubmit = (event) => {
              const sigMsg = document.getElementById(
                `${props.contract}_${sig}Msg`
              );
              if (sigMsg) {
                sigMsg.innerHTML = ``;
                sigMsg.classList.remove('negative');
                sigMsg.classList.add('hidden');
                const sigForm = document.getElementById(
                  `${props.contract}_${sig}`
                );
                if (sigForm instanceof HTMLFormElement) {
                  const tmp = new FormData(sigForm as HTMLFormElement);
                  const values = [];
                  let i = 0;
                  try {
                    for (let [, v] of tmp.entries() as IterableIterator<
                      [string, any]
                    >) {
                      if (i <= func.inputs.length - 1) {
                        const x = func.inputs[i++];
                        if (x.type === 'bool') {
                          v = v === 'true';
                        }
                        if (v) values.push(v);
                        else values.push('');
                      }
                    }

                    const encoded =
                      func.inputs.length > 0
                        ? iface.encodeFunctionData(key, values)
                        : iface.encodeFunctionData(key, []);
                    let getResponse;
                    if (
                      func.stateMutability !== 'nonpayable' &&
                      func.stateMutability !== 'payable'
                    ) {
                      getResponse = async () => {
                        const call = await (
                          window as any
                        ).metrimask.rpcProvider.rawCall('callcontract', [
                          getDeployedContract(props.network, props.contract),
                          encoded.replace('0x', '')
                        ]);
                        const result = call.executionResult;
                        let decoded;
                        try {
                          decoded = iface.decodeFunctionResult(
                            key,
                            `0x${result.output}`
                          );
                        } catch (e) {
                          decoded = [result.excepted];
                        }

                        decoded = decoded.map((data) => {
                          return `${data}`;
                        });
                        const msg =
                          decoded && decoded.join(' ').length > 0
                            ? decoded.join(' ')
                            : 'No Response';
                        sigMsg.innerHTML = `<div class="header" style="font-family: VT323; font-size: 1.5rem;">Response</div><p style="font-size: 1.2rem; font-weight: normal;">${msg}</p>`;
                        sigMsg.classList.remove('hidden');
                      };
                    } else {
                      if (func.stateMutability !== 'payable') {
                        tmp.append(`${key}value`, '0');
                      }
                      getResponse = async () => {
                        const call = await (
                          window as any
                        ).metrimask.rpcProvider.rawCall('sendtocontract', [
                          getDeployedContract(props.network, props.contract),
                          encoded.replace('0x', ''),
                          tmp.get(`${key}value`),
                          250000,
                          5000
                        ]);

                        const response = JSON.parse(JSON.stringify(call));
                        const msg =
                          response && JSON.stringify(response).length > 0
                            ? JSON.stringify(response)
                            : 'No Response';
                        sigMsg.classList.remove('negative');
                        sigMsg.innerHTML = `<div class="header" style="font-family: VT323; font-size: 1.5rem;">Response</div><p style="font-size: 1.2rem; font-weight: normal;">${msg}</p>`;
                        sigMsg.classList.remove('hidden');
                      };
                    }
                    getResponse();
                  } catch (e) {
                    const msg = (e as any).message
                      ? (e as any).message
                      : 'An error occurred';
                    sigMsg.classList.add('negative');
                    sigMsg.innerHTML = `<div class="header">Error</div><p>${msg}</p>`;
                    sigMsg.classList.remove('hidden');
                  }
                }
              }
              return false;
            };

            const functionTitle = document.createElement('div');
            functionTitle.className = 'field';
            const label = document.createElement('label');
            label.innerHTML = key;
            label.className = `ui ${color} label`;
            label.style.fontWeight = 'normal';
            label.style.fontSize = '1.2rem';
            functionTitle.appendChild(label);
            form.appendChild(functionTitle);
            const msg = document.createElement('div');
            msg.className = 'ui hidden message';
            msg.id = `${props.contract}_${sig}Msg`;
            (msg.style as any)['word-break'] = 'break-all';
            form.appendChild(msg);
            for (const finput of func.inputs) {
              const field = document.createElement('div');
              field.className = 'field';
              const input = document.createElement('div');
              input.className = 'ui labeled input';
              input.innerHTML = `<div class="ui label ${cs}" style="font-size: 1.2rem;font-weight: normal;">${finput.type}:${finput.name}</div><input type="text" name="${props.contract}_${finput.name}" />`;
              field.appendChild(input);
              form.appendChild(field);
            }
            if (func.stateMutability === 'payable') {
              const field = document.createElement('div');
              field.className = 'field';
              const input = document.createElement('div');
              input.className = 'ui labeled input';
              input.innerHTML = `<div class="ui label pnk">Value</div><input type="number" step="0.00000001" name="${props.contract}_${key}value" value="0.00000000" />`;
              field.appendChild(input);
              form.appendChild(field);
            }
            const submit = document.createElement('button');
            submit.className = `ui button ${color} inverted`;
            submit.innerHTML = 'Call';
            submit.style.fontFamily = 'VT323';
            submit.style.fontWeight = 'normal';
            submit.style.fontSize = '1.2rem';
            form.appendChild(submit);
            segment.appendChild(form);
            column.appendChild(segment);
            functions.appendChild(column);
            colCount++;
          }
        );

        /*
        for (const key of Object.keys(iface.functions)) {
          
        }*/
        if (colCount % 2 !== 0) {
          for (let i = 0; i < colCount % 2; i++) {
            const column = document.createElement('div');
            column.className = 'column';
            functions.appendChild(column);
          }
        }
      }
    }
  };

  React.useEffect(() => {
    setupFunctions();
  }, []);
  return props.abi.length > 0 ? (
    <Grid>
      <Grid.Row>
        <Segment inverted>
          <Header
            style={{
              color: 'whitesmoke',
              fontWeight: 'normal',
              fontSize: '2em',
              fontFamily: 'VT323'
            }}
          >
            {`${props.contract}`}.sol
          </Header>
        </Segment>
      </Grid.Row>
      <Grid.Row>
        <Grid stackable id={`${props.contract}Functions`}></Grid>
      </Grid.Row>
    </Grid>
  ) : (
    <div>Error Invalid Contract</div>
  );
}
