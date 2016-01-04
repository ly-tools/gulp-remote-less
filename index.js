'use strict';

const _ = require('lodash');
const path = require('path');
const through = require('through2');
const isLess = require('./lib/isLess');
const logger = require('./lib/logger');
const fetchDeps = require('./lib/fetchDeps');
const PluginError = require('gulp-util').PluginError;

const defaultOpts = {
  useLocal: true,
  base: path.join(process.cwd(), 'remote'),
  timeout: 5000,
  debug: false
};

module.exports = config => {
  config = _.defaults(config || {}, defaultOpts);
  return through.obj((file, encoding, callback) => {
    if (file.isNull()) return callback(null, file);
    if (file.isStream()) return callback(new PluginError('gulp-remote-less', `Stream is not supported`));
    if (config.debug) logger.setDebug(true);
    if (!isLess(file)) return callback(null, file);
    fetchDeps(file, config)
      .then(() => callback(null, file))
      .catch(e => callback(new PluginError('gulp-remote-less', e)));
  });
};
