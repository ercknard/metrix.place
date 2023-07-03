import fs from 'fs';
import path from 'path';
import { isSupportedFile } from './FileCheck';

const staticBasePath = './stc';

export const staticServe = (req: any, res: any /* eslint-disable-line */) => {
  let fileLoc = path.resolve(staticBasePath);
  let url = req.url;
  if (url.startsWith('../')) {
    url = url.replace('../', '/');
  }
  fileLoc = path.join(fileLoc, url);
  const exts = ['.jpg', '.png', '.gif'];

  if (!fs.existsSync(fileLoc)) {
    let fil = '';
    let ext = '';
    if (fileLoc.endsWith('.jpg')) {
      fil = fileLoc.replace('.jpg', '');
      ext = '.jpg';
    } else if (fileLoc.endsWith('.png')) {
      fil = fileLoc.replace('.png', '');
      ext = '.png';
    } else if (fileLoc.endsWith('.gif')) {
      fil = fileLoc.replace('.gif', '');
      ext = '.gif';
    }
    //console.log('File Path: ' + fil + ' ' + ext);
    for (const ex of exts) {
      if (fs.existsSync(fil + ex) && ex != ext) {
        //console.log('Found Matching File!!');
        fileLoc = fil + ex;
        break;
      }
    }
  }

  if (!fs.existsSync(fileLoc)) {
    res.writeHead(404, 'Not Found');
    res.end('Not Found!');
    return;
  }

  //const qry = req.url;

  //console.log(`fileLoc: ${fileLoc}`);

  try {
    if (!isSupportedFile(fs.readFileSync(fileLoc))) {
      res.writeHead(404, 'Not Found');
      res.end();
    }
    const stream = fs.createReadStream(fileLoc);

    stream.on('error', function (error /* eslint-disable-line */) {
      res.writeHead(404, 'Not Found');
      res.end();
    });

    stream.pipe(res);
    //res.end();
  } catch (e) {
    res.writeHead(404, 'Not Found');
    res.end();
  }
};
