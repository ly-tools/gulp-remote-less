'use strict';

const _ = require('lodash');

module.exports = extname => dep => _.endsWith(dep, `.${extname}`) ? dep : `${dep}.${extname}`;
