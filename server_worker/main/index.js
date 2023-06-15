/* eslint-disable */
const path = require('path');
const { workerData } = require('worker_threads');

const workerPath = path.resolve(__dirname, workerData.path);
if (process.env.NODE_ENV !== 'production') {
  console.log(`>>> Loading worker at '${workerPath}'`);
}

require('ts-node').register();
const worker = require(workerPath);

module.exports = worker;
