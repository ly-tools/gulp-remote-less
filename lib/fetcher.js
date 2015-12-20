'use strict';
const request = require('request');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile');
const TPL_ERROR_MSG = _.template(`Request failed: <%= url %>\nreason: <%= reason %>`);
let cache = {};

module.exports = dep => new Promise((resolve, reject) => {
  if (cache[dep.url]) return resolve(cache[dep.url]);
  request({
    method: 'GET',
    'content-type': 'text/plain',
    uri: dep.url
  }, (e, response, body) => {
    console.log(response, body);
    if (e)
      return reject(new Error(TPL_ERROR_MSG({
        reason: e.message,
        url: dep.url
      })));
    if (response.statusCode === 404)
      return reject(new Error(TPL_ERROR_MSG({
        reason: '404 file not found',
        url: dep.url
      })));
    fs.mkdirsSync(path.dirname(dep.path));
    fs.writeFileSync(dep.path, new Buffer(body));
    cache[dep.url] = createFile(dep);
    resolve(cache[dep.url]);
  });
});
