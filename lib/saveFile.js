'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = function(files) {
  (Array.isArray(files) ? files : [files]).forEach(file => {
    fs.mkdirsSync(path.dirname(file.path));
    fs.writeFileSync(file.path, file.contents);
  });
  return files;
};
