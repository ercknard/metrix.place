import jwt, { JwtPayload } from 'jsonwebtoken';
import { toHexString } from '@src/utils/Parsers';
import { randomBytes } from 'crypto';
import { fqdn } from '@src/config/confServer';

const JWT_KEY = process.env.JWT_KEY;
let SECRET_KEY = toHexString(randomBytes(22));
if (JWT_KEY) {
  SECRET_KEY = JWT_KEY;
}

export interface jwtPayload {
  id: string;
  usr: string;
  iss: string;
  sub: string;
  dat: string;
  nbs: number;
  exp: number;
  iat: number;
  adm?: boolean;
  chn?: 'BSC' | 'ETH' | 'MRX';
  pal?: string;
  sct?: string;
}

export function createToken(
  id: string,
  account: string,
  admin: boolean,
  chain: 'BSC' | 'ETH' | 'MRX'
) {
  // TODO: setup admin systems..
  admin =
    account === '81fb24515ede85c0d19eeac67c04f2fe7f237b28' || // squid
    account === '5b9a6f4b81ec426e35134fcbaf213cec0697f745' || // jude
    account === 'cde73b9511133e2789d4a399217d644c0d857e88'; // seqsee
  if (admin) {
    console.log('ADMIN ADDED!!!');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  /* Create JWT Payload */
  const payload: JwtPayload = {
    id,
    usr: account,
    iss: fqdn,
    sub: 'auth',
    nbs: timestamp - 20,
    exp: timestamp + 21600, // 6 hours in seconds
    iat: timestamp,
    adm: admin,
    chn: chain
  } as jwtPayload;
  /* Sign token */
  const token = jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS512'
  });
  return token;
}

export function verifyToken(jwtToken: string): jwtPayload | undefined {
  try {
    return jwt.verify(jwtToken, SECRET_KEY, {
      algorithms: ['HS512']
    }) as jwtPayload;
  } catch (e) {
    //console.log('e:', e);
    return undefined;
  }
}

export const signatureMessage =
  'Welcome to metrix.place\n' + '-----SESSION SIGNATURE NONCE-----\n';

// palette
// last sector
export function createStorageToken(
  id: string,
  palette: string,
  last_sector: string,
  data?: string
) {
  const timestamp = Math.floor(Date.now() / 1000);
  /* Create JWT Payload */
  const payload: JwtPayload = {
    id,
    usr: 'local',
    pal: palette,
    sct: last_sector,
    dat: data ? data : '',
    iss: fqdn,
    sub: 'auth',
    nbs: timestamp - 20,
    exp: timestamp + 21600, // 6 hours in seconds
    iat: timestamp
  } as jwtPayload;
  /* Sign token */
  const token = jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS512'
  });
  return token;
}
