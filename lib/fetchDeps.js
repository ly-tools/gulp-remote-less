'use strict';

const co = require('co');
const _ = require('lodash');
const parseImport = require('./parseImport');
const getDepFiles = require('./getDepFiles');

const fetchFileDep = _.curryRight(co.wrap(function*(file, config) {
  return parseImport(file)
    .then(getLocalPath(config))
    .then(getDepFiles(config))
    .then(files => {
      yield files.map(fetchFileDep);
    });
}), 2);


module.exports = fetchFileDep;
