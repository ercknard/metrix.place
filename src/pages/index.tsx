import Head from 'next/head';
import { Container, Grid, Icon, Segment, Image } from 'semantic-ui-react';
import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import { NetworkType } from '@metrixcoin/metrilib';
import HandleProviderType from '../helpers/HandleProviderType';
import ContractFunctions from '../components/ContractFunctions';
import { toHexAddress } from '@metrixcoin/metrilib/lib/utils/AddressUtils';
import EditGrid from '../components/EditGrid';
import MapGrid from '../components/MapGrid';
import { AlphaPicker, ColorResult, RGBColor, TwitterPicker } from 'react-color';
import { getMetrixPlace, getMetrixPlaceAddress } from '@place/index';
import ABI from '@place/abi';

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

  const [color, setColor] = React.useState({ r: 0, g: 0, b: 0, a: 0 } as
    | RGBColor
    | string);

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
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => setColor(color.rgb);

  const getOffColor = (color: string | RGBColor): string => {
    const offWhite = '#F8F8F8';
    const offBlack = '#080808';

    const calculateIntensity = (color: RGBColor): number => {
      // Calculate the intensity of the color based on the RGB values
      return (color.r + color.g + color.b) / 3;
    };

    const isCloseToWhite = (color: RGBColor): boolean => {
      const threshold = 200; // Adjust the threshold as needed
      const intensity = calculateIntensity(color);
      return intensity > threshold;
    };

    if (typeof color === 'string') {
      const parsedColor = parseInt(color.slice(1), 16);
      const r = (parsedColor >> 16) & 0xff;
      const g = (parsedColor >> 8) & 0xff;
      const b = parsedColor & 0xff;

      const rgbColor: RGBColor = { r, g, b };

      return isCloseToWhite(rgbColor) ? offBlack : offWhite;
    } else {
      return isCloseToWhite(color) ? offBlack : offWhite;
    }
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
                              fontSize: '1.8em',
                              color: getOffColor(color),
                              background:
                                typeof color === 'string'
                                  ? color
                                  : `#${
                                      BigInt(color.r).toString(16).length == 2
                                        ? BigInt(color.r).toString(16)
                                        : `0${BigInt(color.r).toString(16)}`
                                    },${
                                      BigInt(color.g).toString(16).length == 2
                                        ? BigInt(color.g).toString(16)
                                        : `0${BigInt(color.g).toString(16)}`
                                    },${
                                      BigInt(color.b).toString(16).length == 2
                                        ? BigInt(color.b).toString(16)
                                        : `0${BigInt(color.b).toString(16)}`
                                    }`
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

                    <div className={styles.color_submit}> Submit </div>
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
