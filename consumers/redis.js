'use strict';

require('dotenv').config({ path: '../.env' });
const path = require('node:path');
const Client = require('ioredis');
const { Logger } = require('../src/logger.js');
const logger = new Logger(path.join(__dirname, '../logs'), 'bs-consumer');

(async () => {
  try {
    const client = new Client({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    let jobsCount = 0;
    logger.time('100k');
    logger.time('1M');

    while (true) {
      await client.rpop('default-example');
      jobsCount++;
      if (jobsCount % 100_000 === 0) {
        logger.log(`Processed 100K jobs`);
        logger.timeEnd('100k');
        logger.time('100k');
      }
      if (jobsCount % 1_000_000 === 0) {
        logger.log(`Processed 1M jobs`);
        logger.timeEnd('1M');
        logger.time('1M');
      }
    }
  } catch (err) {
    logger.error('Happened an error ', err);
  }
})();
