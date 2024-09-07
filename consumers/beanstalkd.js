'use strict';

require('dotenv').config({ path: '../.env' });
const path = require('node:path');
const { Logger } = require('../src/logger.js');

const logger = new Logger(path.join(__dirname, '../logs'), 'bs-consumer');
const Jackd = require('jackd');

const client = new Jackd();

(async () => {
  try {
    await client.connect({
      host: process.env.BEANSTALKD_HOST,
      port: process.env.BEANSTALKD_PORT,
    });

    logger.log(
      `Connected to Beanstalkd ${process.env.BEANSTALKD_HOST}:${process.env.BEANSTALKD_PORT}`,
    );

    let jobsCount = 0;

    while (true) {
      const job = await client.reserve();
      if (jobsCount === 0) {
        logger.time('100k');
        logger.time('1M');
      }
      // await client.delete(job.id);
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

process.once('SIGINT', async function closeApplication() {
  const tenSeconds = 10_000;
  const timeout = setTimeout(function forceClose() {
    app.log.error('force closing server');
    process.exit(1);
  }, tenSeconds);
  timeout.unref();
  try {
    await client.disconnect();
    logger.log('bye bye');
  } catch (err) {
    logger.error(err, 'the app had trouble turning off');
  }
});
