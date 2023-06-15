import { APIProvider } from '@metrixcoin/metrilib';
import { getMetrixPlace } from './index';
import { equal } from 'assert';
import { ZeroAddress } from 'ethers';

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
  it('Can get a pixel color by x and y', async () => {
    const color = await place.getPixelColor(BigInt(0), BigInt(0));
    equal(typeof color, 'number');
  }).timeout(60000);

  it('Can get a pixel color by pixelIndex', async () => {
    const color = await place.pixels(BigInt(0));
    equal(typeof color, 'number');
  }).timeout(60000);

  it('Can get a chunk of pixel colors', async () => {
    const colors = await place.getChunkColors(BigInt(0), BigInt(0));
    equal(colors.length > 0, true);
  }).timeout(60000);

  it('Can get the last block modified by an address', async () => {
    const modified = await place.lastBlockModified(ZeroAddress);
    equal(modified, BigInt(0));
  }).timeout(60000);

  it('Can encode x and y to pixelIndex', async () => {
    const pixelIndex = await place.encodeKey(BigInt(10), BigInt(10));
    equal(pixelIndex, (BigInt(10) << BigInt(16)) | BigInt(10));
  }).timeout(60000);
});
