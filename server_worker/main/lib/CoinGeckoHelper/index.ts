import CoinGeckoHelper from './CoinGeckoHelper';

const coinGeckoHelper: CoinGeckoHelper = new CoinGeckoHelper();

const test = async () => {
  await coinGeckoHelper.init();
  const price = await coinGeckoHelper.getPrice('linda', ['usd']);
  console.log(Math.floor(parseFloat((1 / price.linda.usd).toFixed(8)) * 1e8));
};

test();
