'use strict';

const co = require('co');
const _ = require('lodash');
const parseImport = require('./parseImport');
const getPathInfo = require('./getPathInfo');
const getDepFiles = require('./getDepFiles');

const fetchFileDep = _.curryRight(co.wrap(function*(file, config) {
  return parseImport(file)
    .then(getPathInfo(config))
    .then(getDepFiles(config))
    .then(co.wrap(function*(files) {
      let rst = yield files.map(fetchFileDep);
      return rst;
    }));
}), 2);


module.exports = fetchFileDep;
