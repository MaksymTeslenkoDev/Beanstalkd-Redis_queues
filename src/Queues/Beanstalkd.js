'use strict';

class Beanstalkd {
  constructor(client) {
    this.client = client;
  }

  async putJob(data, options = { priority: 0, delay: 0, ttr: 60 }) {
    return await this.client.put(data, options);
  }

  async consumeJob() {
    return await this.client.reserve().then(payload=>JSON.parse(payload));
  }
}

module.exports = Beanstalkd;