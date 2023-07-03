import { NextApiRequest, NextApiResponse } from 'next';

import sharp from 'sharp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const body = req.body;
    const { x, y } = body;
    console.log(`./plc/chunks/${x}-${y}.png`);
    const { data, info } = await sharp(`./plc/chunks/${x}-${y}.png`, {
      raw: { width: 64, height: 64, channels: 4 }
    })
      .ensureAlpha()
      // output the raw pixels
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);
    return res.status(200).json({ data: pixelArray });
  }
}
