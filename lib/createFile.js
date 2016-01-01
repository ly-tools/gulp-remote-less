'use strict';

const File = require('vinyl');
const fs = require('fs-extra');

module.exports = (dep, contents) => {
  let rst = new File({
    path: dep.path,
    contents: contents || fs.readFileSync(dep.path)
  });
  rst.url = dep.url;
  rst.origin = dep.origin;
  return rst;
};
