'use strict';

const co = require('co');
const _ = require('lodash');
const path = require('path');
const url = require('url');
const RE_IMPORT = /@import(?:\s+\(.*\))?\s+['"](.*)['"]/;
const RE_IMPORT_G = /@import(?:\s+\(.*\))?\s+['"](.*)['"]/g;
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
        let origin = path.join(path.dirname(file.origin || file.path), dep);
        let relativePath = path.relative(path.join(process.cwd()), origin);
        return {
          path: path.join(process.cwd(), config.base, '__local', relativePath),
          raw: dep,
          origin: origin
        };
      });
    deps.forEach(dep => contents = contents.replace(new RegExp(`['"]${dep.raw}(.less)?['"]`), path.relative(path.dirname(parentPath), dep.path)));
    file.contents = new Buffer(contents);
    if (file.url || file.origin)
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
