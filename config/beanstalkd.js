'use strict';

module.exports = ({ envs }) => Object.freeze({
    host: envs.BEANSTALKD_HOST || 'localhost',
    port: envs.BEANSTALKD_PORT || 11300,
});