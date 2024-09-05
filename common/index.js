'use strict';
const { faker } = require('@faker-js/faker');

async function* generateUsers(total) {
  let counter = 0;

  while (counter < total) {
    // const userName = faker.internet.userName();
    // const email = faker.internet.email();
    counter++;
    yield { userName:'username', email:'email' };
    await new Promise((resolve) => setImmediate(resolve));
  }
}


module.exports = {
    generateUsers,
};