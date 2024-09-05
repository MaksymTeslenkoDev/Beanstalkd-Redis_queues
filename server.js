'use strict';

const fastify = require('fastify');
const beanstalkd = require('./plugins/beanstalkd.js');
const { generateUsers } = require('./common/index.js');

module.exports = async ({
  app: appConfig,
  server: serverConfig,
  redis: redisConfig,
  beanstalkd: beanstalkdConfig,
}) => {
  const app = fastify({ ...serverConfig });

  //   app.register(cache, { redis: redisConfig });
  app.register(beanstalkd, { beanstalkd: beanstalkdConfig });

  app.post('/bs', async function seed(request, reply) {
    try {
      const { amount } = request.query;
      request.log.info(`Posting ${amount} messages to beanstalkd`);

      for await (const user of generateUsers(amount)) {
        await this.beanstalkd.putJob(JSON.stringify(user));
      }
      request.log.info('Messages posted successfully');
      return { message: 'Messages posted successfully' };
    } catch (err) {
      throw new Error(err.message);
    }
  });

  await app.listen({
    port: appConfig.port,
    host: appConfig.host,
  });

  return app;
};
