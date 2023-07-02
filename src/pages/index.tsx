import Head from 'next/head';
import { Icon, Segment, Image, Container, Grid } from 'semantic-ui-react';
import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import { NetworkType, Web3Provider } from '@metrixcoin/metrilib';
import HandleProviderType from '../helpers/HandleProviderType';
import ContractFunctions from '../components/ContractFunctions';
import { toHexAddress } from '@metrixcoin/metrilib/lib/utils/AddressUtils';
import EditGrid from '../components/EditGrid';
import MapGrid from '../components/MapGrid';
import { AlphaPicker, ColorResult, RGBColor, TwitterPicker } from 'react-color';
import { getMetrixPlace, getMetrixPlaceAddress } from '@place/index';
import ABI from '@place/abi';
import { ZeroHash } from 'ethers';
import Web3TransactionModal from '@src/modals/Web3TransactionModal';

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
  const [sector, setSector] = React.useState([0, 0] as [x: number, y: number]);
  const [pixel, setPixel] = React.useState(
    undefined as undefined | [x: number, y: number]
  );

  const [color, setColor] = React.useState({
    r: 0,
    g: 0,
    b: 0,
    a: 0
  } as RGBColor);

  const doSetPixel = async () => {
    if (network && pixel) {
      const r = BigInt(color.r).toString(16);
      const g = BigInt(color.g).toString(16);
      const b = BigInt(color.g).toString(16);
      const a = BigInt(Math.floor((color.a ? color.a : 0) * 255)).toString(16);
      const provider = new Web3Provider(network);
      const place = getMetrixPlace(network, provider);
      const x = Number(pixel[0] + 64 * sector[0]);
      const y = Number(pixel[1] + 64 * sector[1]);
      const tx = await place.setPixelColor(
        BigInt(x),
        BigInt(y),
        `${r.length == 2 ? r : `0${r}`}${g.length == 2 ? g : `0${g}`}${
          b.length == 2 ? b : `0${b}`
        }${a.length == 2 ? a : `0${a}`}`
      );
      if (tx.txid && tx.txid != ZeroHash.replace('0x', '')) {
        setModalMessage(
          <a
            style={{ color: '#9627ba !important' }}
            href={`https://${
              (network ? network : 'MainNet') === 'TestNet' ? 'testnet-' : ''
            }explorer.metrixcoin.com/tx/${tx.txid}`}
            target="_blank"
          >
            {tx.txid}
          </a>
        );
      } else {
        setModalMessage('Tranaction failed');
      }
    }
  };

  const setup = async () => {
    const provider = HandleProviderType(
      network ? network : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType)
    );
    const place = getMetrixPlace(
      network ? network : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType),
      provider
    );
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
      setNetwork(
        account.network
          ? account.network
          : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType)
      );
      setConnected(true);
      setError(false);
      setup();
      setMessage('');
      setDebug([
        <Segment inverted key={'SegmentTokenBuyback'}>
          <ContractFunctions
            network={
              account.network
                ? account.network
                : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType)
            }
            contract={'TokenBuyback'}
            address={getMetrixPlaceAddress(
              account.network
                ? account.network
                : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType)
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
  const handleChange = (
    newColor: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColor(newColor.rgb);
  };

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
        {
          /* network && connected && address */ true ? (
            <>
              <div className={styles.main_box}>
                <div className={styles.sample_box}>
                  <EditGrid
                    sector={sector}
                    x={0}
                    y={0}
                    pixel={pixel}
                    setPixel={setPixel}
                    setColor={setColor}
                    color={color}
                  />
                </div>
                <div className={styles.to_flex}>
                  <div className={styles.to_flex_icons}>
                    <div className={styles.eye_box}>
                      <Icon
                        className={styles.eye_icon}
                        name="file code outline"
                      />
                    </div>
                    <div className={styles.eye_box}>
                      <Icon className={styles.eye_icon} name="eye" />
                    </div>
                    <div className={styles.eye_box}>
                      <Icon className={styles.eye_icon} name="cog" />
                    </div>
                  </div>
                  <div className={styles.secondary_box}>
                    <div className={styles.tertiary_box}>
                      <MapGrid
                        sector={sector}
                        setSector={setSector}
                        setPixel={setPixel}
                      />
                    </div>
                  </div>
                  <div className={styles.color_pallete}>
                    <div>
                      <TwitterPicker
                        color={color}
                        onChangeComplete={handleChange}
                        styles={{
                          default: {
                            card: {
                              justifyContent: 'center',
                              background: '#4c455c',
                              border: 'none',
                              boxShadow: 'none'
                            },
                            input: {
                              fontFamily: 'vt323',
                              fontSize: '1.8em'
                            },
                            swatch: {
                              boxShadow:
                                '1px 1px 2px rgba(0, 0, 0, .25) inset, 1px 1px 2px rgba(0, 0, 0, 1)'
                            }
                          }
                        }}
                        triangle="hide"
                      />

                      <AlphaPicker
                        className={styles.alpha}
                        color={color}
                        onChangeComplete={handleChange}
                      />
                    </div>
                    <Web3TransactionModal
                      message={modalMessage}
                      setMessage={setModalMessage}
                      trigger={
                        <div
                          className={styles.color_submit}
                          onClick={() => {
                            if (network && address) doSetPixel();
                          }}
                        >
                          {' '}
                          Submit{' '}
                        </div>
                      }
                    />
                  </div>
                  {/* <div className={styles.metrix_centri}> <Image alt="metrix" className={styles.metrix_icon} src="/images/2021_Metrix_Icon_Silver.png"/> </div> */}
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                style={{ width: '70vh', height: '70vh' }}
                src="/images/default.png"
                alt="logo"
              />
            </>
          )
        }
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
