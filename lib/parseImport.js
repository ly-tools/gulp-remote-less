'use strict';

const co = require('co');
const _ = require('lodash');
const path = require('path');
const url = require('url');
const RE_IMPORT = /@import ['"](.*)['"]/;
const RE_IMPORT_G = /@import ['"](.*)['"]/g;
const RE_REMOTE = /^https?:\/\//;
const RE_COMMENT = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm;
const urlToLocal = require('./urlToLocal');
const saveFile = require('./saveFile');
const addExtLess = require('./addExtname')('less');
const logger = require('./logger');

module.exports = _.curryRight(co.wrap(function*(file, config) {
  let parentPath = file.path;
  let parentUrl = file.url;
  let contents = file.contents.toString();
  let toLocal = urlToLocal(config.base);
  try {
    let deps = _(contents.replace(RE_COMMENT, '').match(RE_IMPORT_G) || [])
      .map(dep => (dep.match(RE_IMPORT) || [])[1])
      .filter(v => !!v)
      .unique()
      .map(dep => {
        if (RE_REMOTE.test(dep))
          return {
            path: toLocal(dep),
            url: addExtLess(dep),
            raw: dep
          };
        else if (parentUrl) {
          let selfUrl = url.resolve(parentUrl, dep);
          return {
            path: addExtLess(toLocal(selfUrl)),
            url: addExtLess(selfUrl),
            raw: dep
          };
        }
        return {
          path: addExtLess(path.resolve(path.dirname(parentPath), dep)),
          raw: dep
        };
      });
    deps.forEach(dep => contents = contents.replace(dep.raw, path.relative(path.dirname(parentPath), dep.path)));
    file.contents = new Buffer(contents);
    if (file.url)
      saveFile(file);
    return {
      inst: file,
      deps: deps.value()
    };
  } catch (e) {
    logger.debug(`Parse less file error: ${e.message}\nFile path：${file.path}`);
    return Promise.reject(e);
  }
}), 2);
