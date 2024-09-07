'use strict';

require('dotenv').config({ path: '../.env' });
const path = require('node:path');
const Queue = require('bull');
const { Logger } = require('../src/logger.js');
const logger = new Logger(path.join(__dirname, '../logs'), 'bs-consumer');

const queue = new Queue('test-default', 'redis://localhost:6379');

(async () => {
  let jobsCount = 0;
  logger.time('100k');
  logger.time('1M');
  queue.process(async (job) => {
    try {
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
      return Promise.resolve();
    } catch (err) {
      logger.error(`Error processing job ${job.id}`, err);
      return Promise.reject();
    }
  });
})();
