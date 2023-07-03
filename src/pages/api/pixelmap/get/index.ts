import { NextApiRequest, NextApiResponse } from 'next';

import {
  MetrixRPC,
  NetworkType,
  RPCEventLogs,
  RPCProvider
} from '@metrixcoin/metrilib';
import sharp from 'sharp';
import dotenv from 'dotenv';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const body = req.body;
    const { x, y } = body;
    console.log(`./plc/chunks/${x}-${y}.png`);
    const { data, info } = await sharp(`./plc/chunks/${x}-${y}.png`)
      // output the raw pixels
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);
    return res.status(200).json({ data: pixelArray });
  }
}
