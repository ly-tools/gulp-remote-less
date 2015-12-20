'use strict';

const co = require('co');
const _ = require('lodash');
const parseImport = require('./parseImport');
const getDepFiles = require('./getDepFiles');
const logger = require('./logger');

const fetchFileDep = _.curryRight(co.wrap(function*(file, config) {
  return parseImport(file, config)
    .then(getDepFiles(config))
    .then(co.wrap(function*(files) {
      yield files.map(f => fetchFileDep(f, config));
      logger.debug(`done: ${file.path}`);
    }));
}), 2);


module.exports = fetchFileDep;
