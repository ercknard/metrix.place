import { MetrixContract, Provider, Transaction } from '@metrixcoin/metrilib';
import ABI from './abi';

export default class MetrixPlace extends MetrixContract {
  constructor(address: string, provider: Provider) {
    super(address, provider, ABI.MetrixPlace);
  }

  /**
   * Get the size of the full canvas
   * @returns the bigint size of the canvas
   */
  async canvasSize(): Promise<bigint> {
    const size = await this.call(`canvasSize()`, []);
    return size ? BigInt(size.toString()) : BigInt(0);
  }

  /**
   * Get the size of chunks used in {@link getChunkColors}
   * @returns the bigint size of chunks
   */
  async chunkSize(): Promise<bigint> {
    const size = await this.call(`chunkSize()`, []);
    return size ? BigInt(size.toString()) : BigInt(0);
  }

  /**
   * Encodes uint16 coordinates to a uint32 key
   * @param x the x coordinate of the pixel
   * @param y the y coordinate of the pixel
   * @returns the encoded pixel key (pixelIndex)
   */
  async encodeKey(x: bigint, y: bigint): Promise<bigint> {
    const size = await this.call(`encodeKey(uint16,uint16)`, [
      `0x${x.toString(16)}`,
      `0x${y.toString(16)}`
    ]);
    return size ? BigInt(size.toString()) : BigInt(0);
  }

  /**
   * Gets 64x64 pixel chunks of pixels
   * @param startX the leftmost x coordinate of the chunk
   * @param startY the topmost y coordinate of the chunk
   * @returns a 2d number array of hex colors (32 bit unsigned integer )
   */
  async getChunkColors(startX: bigint, startY: bigint): Promise<number[][]> {
    const pixels = await this.call(`getChunkColors(uint16,uint16)`, [
      `0x${startX.toString(16)}`,
      `0x${startY.toString(16)}`
    ]);
    const colors: number[][] = [];
    if (pixels && pixels.toArray().length > 0) {
      for (const pixls of pixels[0]) {
        const arr: number[] = [];
        for (const pix of pixls) {
          arr.push(Number(pix ? pix.toString() : 0));
        }
        colors.push(arr);
      }
    }
    return colors;
  }
  /**
   * Get the color of a specific pixel
   * @param x the x coordinate of the pixel
   * @param y the y coordinate of the pixel
   * @returns color of the pixel as 32 bit unsigned integer
   */
  async getPixelColor(x: bigint, y: bigint): Promise<number> {
    const pixel = await this.call(`getPixelColor(uint16,uint16)`, [
      `0x${x.toString(16)}`,
      `0x${y.toString(16)}`
    ]);
    return Number(pixel ? pixel.toString() : 0);
  }

  /**
   * Get the last block an address modified the board
   * @param address the EVM style address to check
   * @returns the last block or 0 if this address has never modified the board
   */
  async lastBlockModified(address: string): Promise<bigint> {
    const lastBlock = await this.call(`lastBlockModified(address)`, [address]);
    return lastBlock ? BigInt(lastBlock.toString()) : BigInt(0);
  }

  /**
   * Get the color of a specific pixel
   * @param pixelIndex pixel index ((uint32(x) << 16) | uint32(y))
   * @returns color of the pixel as 32 bit unsigned integer
   */
  async pixels(pixelIndex: bigint): Promise<number> {
    const pixel = await this.call(`pixels(uint32)`, [
      `0x${pixelIndex.toString(16)}`
    ]);
    return Number(pixel ? pixel.toString() : 0);
  }

  /**
   * Set the color of a pixel.
   * Will revert if this address has set a pixel within the same block.
   *
   * @param x the x coordinate of the pixel
   * @param y the y coordinate of the pixel
   * @param color the hex color #nnnnnn to set the pixel
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async setPixelColor(
    x: bigint,
    y: bigint,
    color: string
  ): Promise<Transaction> {
    const tx = await this.send('setPixelColor(uint16,uint16,uint32)', [
      `0x${x.toString(16)}`,
      `0x${y.toString(16)}`,
      `0x${color.replace('#', '')}`
    ]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts
    };
  }
}
