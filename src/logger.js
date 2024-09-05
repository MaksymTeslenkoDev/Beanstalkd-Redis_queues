'use strict';

const fs = require('node:fs');
const path = require('node:path');
const util = require('node:util');

const COLORS = {
  info: '\x1b[1;37m',
  debug: '\x1b[1;33m',
  error: '\x1b[0;31m',
  system: '\x1b[1;34m',
  access: '\x1b[1;38m',
};

const DATETIME_LENGTH = 19;

class Logger {
  constructor(logPath, fileName) {
    this.path = logPath;
    const date = new Date().toISOString().substring(0, 19);
    const filePath = path.join(
      logPath,
      fileName ? `${fileName}:${date}.log` : `${date}.log`,
    );
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
    this.regexp = new RegExp(path.dirname(this.path), 'g');
    this.timers = new Map();
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve));
  }

  write(type = 'info', s) {
    const now = new Date().toISOString();
    const date = now.substring(0, DATETIME_LENGTH);
    const color = COLORS[type];
    const line = date + '\t' + s;
    console.log(color + line + '\x1b[0m');
    const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
    this.stream.write(out);
  }

  log(...args) {
    const msg = util.format(...args);
    this.write('info', msg);
  }

  dir(...args) {
    const msg = util.inspect(...args);
    this.write('info', msg);
  }

  debug(...args) {
    const msg = util.format(...args);
    this.write('debug', msg);
  }

  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.write('error', msg.replaceAll(path.dirname(this.path), ''));
  }

  system(...args) {
    const msg = util.format(...args);
    this.write('system', msg);
  }

  access(...args) {
    const msg = util.format(...args);
    this.write('access', msg);
  }

  time(label) {
    if (this.timers.has(label)) {
      this.error(`Timer "${label}" already exists`);
      return;
    }
    this.timers.set(label, Date.now());
    this.log(`${label}: Timer started`);
  }

  timeEnd(label) {
    if (!this.timers.has(label)) {
      this.error(`Timer "${label}" does not exist`);
      return;
    }
    const startTime = this.timers.get(label);
    const duration = Date.now() - startTime; // Duration in milliseconds
    this.log(`${label}: ${duration}ms elapsed`);
    this.timers.delete(label);
  }
}

class StreamForLogger {
  #logFileStream;
  folderPath;
  date;

  constructor(folderPath) {
    this.folderPath = folderPath;
    this.date = new Date().toISOString().substring(0, 19);
    this.#createFileStream();
  }

  write(msg) {
    process.stdout.write(msg);
    const currentDate = new Date().toISOString().substring(0, 10);
    if (currentDate !== this.date) {
      this.date = currentDate;
      this.#createFileStream();
    }
    this.#logFileStream.write(msg);
  }

  #createFileStream() {
    if (this.#logFileStream) {
      this.#logFileStream.end();
    }
    const filePath = path.join(this.folderPath, `${this.date}.log`);
    this.#logFileStream = fs.createWriteStream(filePath, { flags: 'a' });
    return this.#logFileStream;
  }
}

module.exports = {
  StreamForLogger,
  Logger,
};
