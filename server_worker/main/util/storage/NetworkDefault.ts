const NETWORK = process.env.NEXT_PUBLIC_APP_NETWORK;

export default NETWORK as 'MainNet' | 'TestNet' | 'None';
