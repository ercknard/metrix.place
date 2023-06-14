import Head from 'next/head';
import {
  Button,
  Container,
  Grid,
  Icon,
  Message,
  Image,
  Header,
  Segment
} from 'semantic-ui-react';
import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import { NetworkType, Web3Provider } from '@metrixcoin/metrilib';
import DebugContracts from '../components/DebugContracts';
import { getMetrixPlace, getMetrixPlaceAddress } from '../place';
import Web3TransactionModal from '../modals/Web3TransactionModal';
import { ZeroHash } from 'ethers';
import HandleProviderType from '../helpers/HandleProviderType';
import ContractFunctions from '../components/ContractFunctions';
import { toHexAddress } from '@metrixcoin/metrilib/lib/utils/AddressUtils';
import ABI from '../abi';
import EditGrid from '../components/EditGrid';
import MapGrid from '../components/MapGrid';

export default function Home() {
  const [debugging, setDebugging] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [network, setNetwork] = React.useState(
    undefined as NetworkType | undefined
  );
  const [address, setAddress] = React.useState(undefined as string | undefined);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState('' as string | JSX.Element);
  const [debug, setDebug] = React.useState([] as JSX.Element[]);

  const [modalMessage, setModalMessage] = React.useState(
    undefined as string | JSX.Element | undefined
  );

  const setup = async () => {
    const provider = HandleProviderType(network ? network : 'MainNet');
    const place = getMetrixPlace(network ? network : 'MainNet', provider);
  };

  const handleMessage = async (
    message: any,
    handleAccountChanged: (payload?: any) => void
  ) => {
    if (message.data && message.data.target) {
      if (message.data.target.startsWith('metrimask') && message.data.message) {
        switch (message.data.message.type) {
          case 'GET_INPAGE_METRIMASK_ACCOUNT_VALUES':
            console.log('Updating MetriMask context');
            break;
          case 'METRIMASK_ACCOUNT_CHANGED':
            handleAccountChanged(message.data.message.payload);
            break;
          case 'METRIMASK_INSTALLED_OR_UPDATED':
            if (window) {
              window.location.reload();
            }
            break;
          case 'METRIMASK_WINDOW_CLOSE':
            console.log('Canceled!!!');
            handleAccountChanged();
            break;
          case 'SIGN_TX_URL_RESOLVED':
            break;
          case 'RPC_REQUEST':
            break;
          case 'RPC_RESPONSE':
            break;
          case 'RPC_SEND_TO_CONTRACT':
            break;
          default:
            break;
        }
      }
    }
  };
  const handleAccountChanged = (data: any): void => {
    if (typeof data === 'undefined') {
      setNetwork(undefined);
      setAddress(undefined);
      setConnected(false);
      return;
    }
    const account = data.account;
    if (account && account.loggedIn) {
      setAddress(toHexAddress(account.address));
      setNetwork(account.network ? account.network : 'MainNet');
      setConnected(true);
      setError(false);
      setup();
      setMessage('');
      setDebug([
        <Segment inverted key={'SegmentTokenBuyback'}>
          <ContractFunctions
            network={account.network ? account.network : 'MainNet'}
            contract={'TokenBuyback'}
            address={getMetrixPlaceAddress(
              account.network ? account.network : 'MainNet'
            )}
            abi={ABI.MetrixPlace}
            key={0}
          />
        </Segment>
      ]);
    } else {
      setNetwork(undefined);
      setAddress(undefined);
      setConnected(false);
    }
  };

  const doHandleMessage = (message: any): void => {
    handleMessage(message, (payload) => {
      handleAccountChanged(payload);
    });
  };

  React.useEffect(() => {
    if (window) {
      if (
        (window as any).metrimask &&
        (window as any).metrimask.account &&
        (window as any).metrimask.account.loggedIn === true
      ) {
        setAddress(toHexAddress((window as any).metrimask.account.address));
        setNetwork((window as any).metrimask.account.network as NetworkType);
      }

      window.addEventListener('message', doHandleMessage, false);
      window.postMessage({ message: { type: 'CONNECT_METRIMASK' } }, '*');
    }
  }, []);

  return (
    <>
      <Head>
        <title>metrix.place</title>
        <meta
          name="description"
          content="A communal graffiti board which any address can set a single pixel per MetrixCoin block by paying the gas fee for the transaction."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.png" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.h1}> metrix.place </h1>
        <div className={styles.main_box}>
          <div className={styles.sample_box}>
            <EditGrid x={0} y={0} />
          </div>
          <div className={styles.to_flex}>
            <div className={styles.eye_box}>
              <Icon className={styles.eye_icon} name="eye" />
            </div>
            <div className={styles.secondary_box}>
              <MapGrid />
            </div>
            <div className={styles.color_pallete}>
              <ul className={styles.color_list}>
                <li className={styles.color_preset}></li>
                <li className={styles.color_preset}></li>
                <li className={styles.color_preset}></li>
                <li className={styles.color_preset}></li>
                <li className={styles.color_preset}></li>
                <li className={styles.color_preset}></li>
                <li className={styles.gear_box}>
                  <Icon className={styles.gear_icon} name="cog" />
                </li>
              </ul>
              <div className={styles.color_input}> #FFFFFF </div>
              <div className={styles.color_submit}> Submit </div>
            </div>
            {/* <div className={styles.metrix_centri}> <Image alt="metrix" className={styles.metrix_icon} src="/images/2021_Metrix_Icon_Silver.png"/> </div> */}
          </div>
        </div>
        <Container>
          <Grid padded stackable stretched container>
            <Grid.Row stretched>
              <Grid.Column stretched>{/** Components goes here */}</Grid.Column>
            </Grid.Row>

            <Grid.Row stretched>
              <Grid.Column stretched>
                <Footer />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </main>
    </>
  );
}
