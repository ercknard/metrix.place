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

    const { data } = await sharp(
      `${__dirname}/../../public/images/chunks/${x}-${y}.png`
    )
      .raw()
      .toBuffer({ resolveWithObject: true });

    return res.status(200).json({ data });
  }
}
