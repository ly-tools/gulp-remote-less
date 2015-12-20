'use strict';

const url = require('url');
const path = require('path');
const _ = require('lodash');

module.exports = _.curryRight((fileUrl, base) => {
  let parsed = url.parse(fileUrl);
  let local = path.join(process.cwd(), base, parsed.protocol.replace(':', ''), parsed.hostname, parsed.pathname);
  return _.endsWith(local, '.less') ? local : `${local}.less`;
});
