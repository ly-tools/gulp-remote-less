'use strict';

const File = require('vinyl');
const fs = require('fs-extra');

module.exports = dep => {
  let rst = new File({
    path: dep.path,
    contents: fs.readFileSync(dep.path)
  });
  rst.url = dep.url;
  return rst;
};
