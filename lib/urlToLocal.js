'use strict';

const url = require('url');
const path = require('path');
const _ = require('lodash');

module.exports = fileUrl => {
  let parsed = url.parse(fileUrl);
  let local = path.join(process.cwd(), 'remote', parsed.protocol.replace(':', ''), parsed.hostname, parsed.pathname);
  return _.endsWith(local, '.less') ? local : `${local}.less`;
};
