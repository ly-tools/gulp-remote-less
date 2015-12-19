'use strict';

const co = require('co');
const _ = require('lodash');
const path = require('path');
const url = require('url');
const urlToLocal = require('./urlToLocal');
const RE_REMOTE = /^https?:\/\//;

module.exports = _.curryRight(co.wrap(function*(file, config) {
  let parentPath = file.inst.path;
  let parentUrl = file.inst.url;
  file.deps = file.deps.map(dep => {
    if (RE_REMOTE.test(dep))
      return {
        path: urlToLocal(dep),
        url: dep
      };
    else if (parentUrl) {
      let selfUrl = url.resolve(parentUrl, dep);
      return {
        path: urlToLocal(selfUrl),
        url: selfUrl
      };
    }
    return {
      path: path.resolve(path.dirname(parentPath), dep)
    };
  });
  return file;
}), 2);
