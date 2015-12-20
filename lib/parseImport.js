'use strict';

const co = require('co');
const _ = require('lodash');
const path = require('path');
const url = require('url');
const RE_IMPORT = /@import ['"](.*)['"]/;
const RE_IMPORT_G = /@import ['"](.*)['"]/g;
const RE_REMOTE = /^https?:\/\//;
const urlToLocal = require('./urlToLocal');
const saveFile = require('./saveFile');
const addExtname = require('./addExtname')('less');
const logger = require('./logger');


module.exports = co.wrap(function*(file) {
  let parentPath = file.path;
  let parentUrl = file.url;
  let contents = file.contents.toString();
  try {
    let deps = _(contents.match(RE_IMPORT_G) || [])
      .map(dep => (dep.match(RE_IMPORT) || [])[1])
      .filter(v => !!v)
      .unique()
      .map(dep => {
        if (RE_REMOTE.test(dep))
          return {
            path: urlToLocal(dep),
            url: dep,
            raw: dep
          };
        else if (parentUrl) {
          let selfUrl = url.resolve(parentUrl, dep);
          return {
            path: addExtname(urlToLocal(selfUrl)),
            url: selfUrl,
            raw: dep
          };
        }
        return {
          path: addExtname(path.resolve(path.dirname(parentPath), dep)),
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
    logger.debug(`解析less依赖失败：${e.message}\n文件路径：${file.path}`);
    return Promise.reject(e);
  }
});
