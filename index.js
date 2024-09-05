'use strict';

require('dotenv').config();
const path = require('node:path');
const { loadDir } = require('./src/loader.js');
const server = require('./server.js');

const ENVS = process.env;

const APPLICATION_PATH = path.join(process.cwd(), `./`);
const sandbox = Object.freeze({
  envs: ENVS,
  appPath: APPLICATION_PATH,
});

(async () => {
  const config = await loadDir(path.join(APPLICATION_PATH, 'config'), sandbox);
  const app = await server(config);

  process.once('SIGINT', async function closeApplication() {
    const tenSeconds = 10_000;
    const timeout = setTimeout(function forceClose() {
      app.log.error('force closing server');
      process.exit(1);
    }, tenSeconds);
    timeout.unref();
    try {
      await app.close();
      app.log.info('bye bye');
    } catch (err) {
      app.log.error(err, 'the app had trouble turning off');
    }
  });
  
})();
