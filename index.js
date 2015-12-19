'use strict';

const _ = require('lodash');
const through = require('through2');
const isLess = require('./lib/isLess');
const logger = require('./lib/logger');
const fetchDeps = require('./lib/fetchDeps');

const defaultOpts = {};

module.exports = opts => {
  opts = _.defaults(opts || {}, defaultOpts);
  return through.obj((file, encoding, callback) => {
    if (file.isNull()) return callback(null, file);
    if (file.isStream()) {
      logger.error(`不支持流格式文件`);
      return callback(PluginError('Stream is not supported'));
    }
    callback(null, file);
    // if (!isLess(file)) return callback(null, file);
    // file.absolutePath = file.path;
    // fetchDeps(file)
    //   .then(() => callback(null, file))
    //   .catch(e => {
    //     logger.error(e.message);
    //     callback(e);
    //   });
  });
};
