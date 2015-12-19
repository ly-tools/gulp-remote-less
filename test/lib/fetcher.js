'use strict';

require('should');
require('should-promised');
const fetcher = require('../../lib/fetcher');
const path = require('path');

describe('fetcher', () => {
  it('should fetch remote file to local', () => {
    return fetcher({
      path: path.join(process.cwd(), 'test', 'fetcher', 'fetchTest.less'),
      url: 'http://lingyucoder.github.io/react-as-tagfield/src/style/index.less'
    }).should.be.fulfilled();
  });
});
