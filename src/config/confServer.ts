const protocol = process.env.HOST_PROTOCOL;
const host = process.env.HOST_URI;
const port = process.env.HOST_PORT;

const apiUrl =
  host != undefined ? `${protocol}://${host}:${port}/api` : undefined;

export { apiUrl };

const fqdn = process.env.NEXT_PUBLIC_FQDN
  ? process.env.NEXT_PUBLIC_FQDN
  : 'metriverse.exchange';

export { fqdn };
