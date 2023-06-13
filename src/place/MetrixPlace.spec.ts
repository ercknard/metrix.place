import {APIProvider} from '@metrixcoin/metrilib';
import {getMetrixPlace} from './index';
import {equal} from 'assert';

describe('MetrixPlace tests', () => {
  const network = 'TestNet';
  const provider = new APIProvider(network);
  const place = getMetrixPlace(network, provider);
  it('Can get the canvas size', async () => {
    const size = await place.canvasSize();
    equal(size, BigInt(1024));
  }).timeout(60000);
  it('Can get the chunk size', async () => {
    const size = await place.chunkSize();
    equal(size, BigInt(64));
  }).timeout(60000);
});
