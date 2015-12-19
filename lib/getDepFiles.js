'use strict';

const _ = require('lodash');
const co = require('co');
const createFile = require('./createFile');
const fileExists = require('./fileExists');
const fetcher = require('./fecher');

let cache = {};

module.exports = _.curryRight(co.wrap(function*(file, config) {
  deps = file.deps || [];
  return deps.map((remoteList, dep) => {
    if (!cache[dep.path]) {
      if (config.useLocal && fileExists(dep.path))
        cache[dep.path] = createFile(dep, fs.readFileSync(dep.path));
      else
        cache[dep.path] = yield fetcher(dep);
    }
    return cache[dep.path];
  });
}), 2);
