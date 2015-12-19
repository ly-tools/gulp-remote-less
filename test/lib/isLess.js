'use strict';

require('should');
require('should-promised');
const isLess = require('../../lib/isLess');
const File = require('vinyl');

describe('isLess', () => {
  it('should return true when less file', () => {
    return isLess(new File({
      path: 'abc.less',
      contents: new Buffer('abc')
    })).should.be.true();
  });
  it('should return false when others', () => {
    return isLess(new File({
      path: 'abc.json',
      contents: new Buffer('abc')
    })).should.be.false();
  });
});
