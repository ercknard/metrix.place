export const toHexString: (byteArray: Uint8Array) => string = (
  byteArray: Uint8Array
) => {
  /* eslint-disable */
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};

const padLeft = (base: number, baseLen?: number) => {
  if (!baseLen) {
    baseLen = 2;
  }
  const len = baseLen - String(base).length;
  return len > 0 ? new Array(len + 1).join('0') + base : base;
};

export const formatDate = (date: Date) => {
  const d = new Date(date);
  const dformat =
    [
      d.getFullYear(),
      padLeft(d.getMonth() + 1, 2),
      padLeft(d.getDate(), 2)
    ].join('/') +
    ' ' +
    [
      padLeft(d.getHours(), 2),
      padLeft(d.getMinutes(), 2),
      padLeft(d.getSeconds(), 2)
    ].join(':');
  return dformat;
};

export function bnToHex(bn: bigint) {
  const base = 16;
  let hex = bn.toString(base);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  return `0x${hex}`;
}
