import Head from 'next/head';
import { Icon, Image, Container, Grid } from 'semantic-ui-react';
import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import { NetworkType, Web3Provider } from '@metrixcoin/metrilib';
import { toHexAddress } from '@metrixcoin/metrilib/lib/utils/AddressUtils';
import EditGrid from '../components/EditGrid';
import MapGrid from '../components/MapGrid';
import {
  AlphaPicker,
  Color,
  ColorResult,
  RGBColor,
  TwitterPicker
} from 'react-color';
import { getMetrixPlace } from '@place/index';
import { decodeBase64, ZeroHash } from 'ethers';
import Web3TransactionModal from '@src/modals/Web3TransactionModal';
import PlaceViewModal from '@src/modals/PlaceViewModal';
import UserSettingsModal from '@src/modals/UserSettingsModal';
import { io } from 'socket.io-client';
import DebugModal from '@src/modals/DebugModal';
import { useCookies } from 'react-cookie';
import isJson from '@src/utils/isJson';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URI as string);

export default function Home() {
  const [connected, setConnected] = React.useState(false);
  const [network, setNetwork] = React.useState(
    undefined as NetworkType | undefined
  );
  const [address, setAddress] = React.useState(undefined as string | undefined);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState('' as string | JSX.Element);

  const [modalMessage, setModalMessage] = React.useState(
    undefined as string | JSX.Element | undefined
  );
  const [sector, setSector] = React.useState([0, 0] as [x: number, y: number]);
  const [pixel, setPixel] = React.useState(
    undefined as undefined | [x: number, y: number]
  );

  const [updated, setUpdated] = React.useState(0);

  // ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']
  const [palette, setPalette] = React.useState([
    '#FF6900',
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF'
  ] as string[]);
  const [cookie, setCookie] = useCookies(['metrix.place-palette']);

  const [color, setColor] = React.useState({
    r: 0,
    g: 0,
    b: 0,
    a: 1
  } as RGBColor);
  const reloadImages = () => {
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i].src;
      images[i].src = '';
      images[i].src = imageUrl;
    }
  };

  React.useEffect(() => {
    socket.on('update', () => {
      setUpdated(new Date().getTime());
      reloadImages();
    });

    return () => {
      socket.off('update');
    };
  }, []);

  React.useEffect(() => {
    if (cookie && cookie['metrix.place-palette']) {
      const b = cookie['metrix.place-palette'];
      const c = String.fromCharCode(...decodeBase64(b));
      if (isJson(c)) {
        const data = JSON.parse(c);
        let palet = [];
        for (const cc of data) {
          palet.push(cc.color);
        }
        setPalette(palet);
      }
    }
  }, [cookie]);

  const doSetPixel = async () => {
    console.log(
      `connected: ${connected} network: ${network} address: ${address}`
    );
    if (network && pixel && address && connected) {
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
            className={styles.lavenderLink_css}
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
    } else {
      setModalMessage('Login to a Metrix Web3 wallet to continue');
    }
  };

  const setup = async () => {
    /*
    const provider = HandleProviderType(
      network ? network : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType)
    );
    const place = getMetrixPlace(
      network ? network : (process.env.NEXT_PUBLIC_APP_NETWORK as NetworkType),
      provider
    );*/
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
        {network && connected && address ? (
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
                  updated={updated}
                />
              </div>
              <div className={styles.to_flex}>
                <div className={styles.to_flex_icons}>
                  <div className={styles.eye_box}>
                    <a
                      style={{ color: '#000000' }}
                      href="https://github.com/Cryptech-Services/metrix.place"
                      target="_blank"
                    >
                      <Icon
                        className={styles.eye_icon}
                        name="file code outline"
                      />
                    </a>
                  </div>
                  <DebugModal
                    connected={connected}
                    network={network}
                    trigger={
                      <div className={styles.eye_box}>
                        <Icon className={styles.eye_icon} name="terminal" />
                      </div>
                    }
                  />
                  <PlaceViewModal
                    trigger={
                      <div className={styles.eye_box}>
                        <Icon className={styles.eye_icon} name="eye" />
                      </div>
                    }
                  />
                  <UserSettingsModal
                    colors={palette}
                    trigger={
                      <div className={styles.eye_box}>
                        <Icon className={styles.eye_icon} name="cog" />
                      </div>
                    }
                  />
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
                      colors={palette}
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
                            fontSize: '1.5em'
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
            <Image size="massive" src="/plc/latest.png" alt="logo" />
          </>
        )}
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
