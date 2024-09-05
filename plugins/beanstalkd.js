'use strict';

const Jackd = require('jackd');
const fp = require('fastify-plugin');
const Beanstalkd = require('../src/Queues/Beanstalkd');

async function beanstalkd(fastify, options) {
  const client = new Jackd();
  await client.connect(options.beanstalkd);

  const beanstalkd = new Beanstalkd(client);

  fastify.decorate('beanstalkd', beanstalkd);

  fastify.addHook('onClose', async () => {
    fastify.log.info('Closing Redis connection');
    await client.disconnect();
  });
}

module.exports = fp(beanstalkd);
