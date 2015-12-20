'use strict';
require('should');
require('should-promised');
const path = require('path');
const run = require('run-gulp-task');
const CWD = process.cwd();
const testPath = path.join(CWD, 'test');
const fs = require('fs-extra');
const logger = require('../lib/logger');
logger.setDebug(true);

function runTest(testCase) {
  const casePath = path.join(testPath, testCase);
  process.chdir(casePath);
  return run('default', path.join(casePath, 'gulpfile.js'))
    .then(() => process.chdir(CWD))
    .catch(e => console.error(e.message));
}

require('./lib/parseImport');
require('./lib/urlToLocal');
require('./lib/fileExists');
require('./lib/isLess');

describe('gulp-remote-less', () => {
  it('should get remote deps', () => {
    return runTest('case1')
      .then(() => fs.readFileSync(path.join(testPath, 'case1', 'build', 'test.css'), 'utf-8'))
      .should.be.fulfilledWith(fs.readFileSync(path.join(testPath, 'case1', 'expected', 'test.css'), 'utf-8'));
  });
});
