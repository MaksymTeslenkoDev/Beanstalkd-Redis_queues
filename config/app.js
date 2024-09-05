'use strict';

module.exports = ({ envs }) =>
  Object.freeze({
    host: envs.APP_HOST || '0.0.0.0',
    port: envs.APP_PORT || 8080,
  });
