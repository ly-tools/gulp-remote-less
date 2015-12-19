'use strict';

const path = require('path');

module.exports = file => path.extname(file.path) === '.less';
