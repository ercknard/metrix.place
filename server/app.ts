import express from 'express';
import next from 'next';
import cors from 'cors';

import Logger from './util/logger';
const logger = new Logger('server', 'purple');
const loggerApp = logger.createSubLogger('app', 'green');

const port = parseInt(process.env.NEXT_PUBLIC_HOST_PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: process.cwd() });

const handle = app.getRequestHandler();

const corsOptions = {
  origin: `http://localhost:${port}`
};

app.prepare().then(() => {
  loggerApp.info(`>> Running as ${process.env.NODE_ENV} on Port ${port}`);

  const server = express();

  server.use(cors(corsOptions));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const serve = process.env.SERVE_PATH_ROOT
    ? (process.env.SERVE_PATH_ROOT as string)
    : '*';
  /* eslint-disable @typescript-eslint/no-explicit-any */
  server.all(serve, (req: any, res: any) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    loggerApp.info(`> Ready on http://localhost:${port}`);
  });
});
