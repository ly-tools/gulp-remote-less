'use strict';

const _ = require('lodash');
const co = require('co');
const createFile = require('./createFile');
const fileExists = require('./fileExists');
const fetcher = require('./fetcher');
const fs = require('fs-extra');

let cache = {};

module.exports = _.curryRight(co.wrap(function*(file, config) {
  let deps = file.deps || [];
  let rst = yield deps.map(co.wrap(function*(dep) {
    if (!cache[dep.path]) {
      if (!dep.url)
        cache[dep.path] = createFile(dep, fs.readFileSync(dep.path));
      else if (config.useLocal && fileExists(dep.path))
        cache[dep.path] = createFile(dep, fs.readFileSync(dep.path));
      else
        cache[dep.path] = yield fetcher(dep);
    }
    if (!cache[dep.path])
      return Promise.reject(new Error(`Can not get file: ${dep.path}`));
    return cache[dep.path];
  }));
  return rst;
}), 2);
