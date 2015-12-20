'use strict';
const request = require('request');
const _ = require('lodash');
const logger = require('./logger');
const createFile = require('./createFile');
const TPL_ERROR_MSG = _.template(`Request failed: <%= url %>\nreason: <%= reason %>`);
let cache = {};

module.exports = dep => new Promise((resolve, reject) => {
  if (cache[dep.url]) return resolve(cache[dep.url]);
  logger.debug(`Requesting start: ${dep.url}`);
  request({
    method: 'GET',
    'content-type': 'text/plain',
    uri: dep.url
  }, (e, response, body) => {
    logger.debug(`Requesting end: ${dep.url}`);
    if (e)
      return reject(new Error(TPL_ERROR_MSG({
        reason: e.message,
        url: dep.url
      })));
    if (response.statusCode !== 200)
      return reject(new Error(TPL_ERROR_MSG({
        reason: `${response.statusCode}`,
        url: dep.url
      })));
    cache[dep.url] = createFile(dep, new Buffer(body));
    resolve(cache[dep.url]);
  });
});
