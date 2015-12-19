'use strict';

const co = require('co');
const _ = require('lodash');
const logger = require('./logger');
const RE_IMPORT = /@import ['"](.*)['"]/;
const RE_IMPORT_G = /@import ['"](.*)['"]/g;
const RE_REMOTE = /^https?:\/\//;

module.exports = co.wrap(function*(file) {
  try {
    let deps = (file.contents.toString('utf-8').match(RE_IMPORT_G) || [])
      .map(dist => (dist.match(RE_IMPORT) || [])[1])
      .filter(v => !!v);
    return {
      inst: file,
      deps: _(deps).map(dist => {
        if (RE_REMOTE.test(dist)) return dist;
        return _.endsWith(dist, '.less') ? dist : `${dist}.less`;
      }).unique().value()
    };
  } catch (e) {
    logger.debug(`解析less依赖失败：${e.message}\n文件路径：${file.path}`);
    return Promise.reject(e);
  }
});
