'use strict';

require('should');
require('should-promised');
const fileExists = require('../../lib/fileExists');
const path = require('path');

describe('fileExists', () => {
  it('should return true when file exists', () => {
    return fileExists(path.join(process.cwd(), 'package.json')).should.be.true();
  });
  it('should return false when file does not exist', () => {
    return fileExists(path.join(process.cwd(), 'notExists.json')).should.be.false();
  });
});
