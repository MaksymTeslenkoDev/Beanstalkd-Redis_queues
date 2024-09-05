'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');

const loadDir = async (dir, sandbox) => {
  const files = await fsp.readdir(dir);
  const container = {};
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(dir, fileName);
    const name = path.basename(fileName, '.js');
    container[name] = await require(filePath)(sandbox);
  }
  return container;
};

module.exports = {
  loadDir,
};
