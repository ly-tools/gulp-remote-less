'use strict';

const _ = require('lodash');
const through = require('through2');

const defaultOpts = {};

module.exports = opts => {
  opts = _.defaults(opts || {}, defaultOpts);
  return through.obj((file, encoding, callback) => {
    // your logic here
    callback(null, file);
  }, done => {
    // your logic here
    done();
  });
};
