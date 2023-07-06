/* eslint-disable */

const TestNet = require((('../../../../networks/' +
  process.env.NEXT_PUBLIC_APP_VERSION) as string) + '/TestNet');
const MainNet = require((('../../../../networks/' +
  process.env.NEXT_PUBLIC_APP_VERSION) as string) + '/MainNet');
const None = undefined;

const CONTRACTS = {
  TestNet,
  MainNet,
  None
};
export default CONTRACTS;
