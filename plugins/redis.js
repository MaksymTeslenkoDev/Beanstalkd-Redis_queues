'use strict';

const fp = require('fastify-plugin');
const Redis = require('ioredis');

async function cache(fastify, options) {
  const { redis } = options;
  const client = new Redis(redis.client);

  fastify.decorate('queue', client);

  client.on('connect', () => {
    fastify.log.info('Connected to Redis');
  });

  client.on('ready', async () => {
    fastify.log.info('Redis is ready');
    client
      .set('ping', 'pong', 'EX', 14 * 60)
      .then((res) => fastify.log.info(`ping pong ${res}`))
      .catch((err) => fastify.log.error(`ping pong error ${err}`));
  });

  client.on('error', (err) => {
    fastify.log.error(`Error happend in Redis: ${err.message}`);
  });

  fastify.addHook('onClose', async () => {
    fastify.log.info('Closing Redis connection');
    client.quit();
  });
}

module.exports = fp(cache);
