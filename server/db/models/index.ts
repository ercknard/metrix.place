//Use this file to export all models as one object

import { Account } from './account';
import { ChainState } from './chainstate';
import { EventLog } from './event_log';
import { PixelMap } from './pixelmap';

export { Account, ChainState, EventLog, PixelMap };
/*
const sync = async () => {
  if ((await PixelMap.count()) < 1024) {
    await PixelMap.sync().then(async () => {
      const mapping = [];
      for (let x = 0; x < 1024; x++) {
        for (let y = 0; y < 1024; y++) {
          mapping.push({
            cell_x: x,
            cell_y: y,
            hexValue: '00000000'
          });
        }
      }
      await PixelMap.bulkCreate(mapping);
      console.log('>>> Created default PixelMap <<<');
    });
  }
};*/

// WARNING: This takes 10 minutes to run....
//sync();
