import { magicHash } from 'bitcoinjs-message';
import { createHash } from 'crypto';

const metrixPrefix_v1 = '\x15Metrix Signed Message:\n'; // NOTE: the leading byte is wrong!
const metrixPrefix_v2 = '\x17Metrix Signed Message:\n'; // This is the correct prefix.

export const metrixPrefix = metrixPrefix_v2;
export const metrixPrefixLegacy = metrixPrefix_v1;

export const hashSignatureMessage = (message: string) => {
  return magicHash(message, metrixPrefix).toString('hex');
};

export const hashSigMessageHash = (message: string) => {
  const hash = createHash('sha256').update(message).digest();
  return magicHash(hash, metrixPrefix).toString('hex');
};
