'use strict';

require('should');
const urlToLocal = require('../../lib/urlToLocal');
const path = require('path');

describe('urlToLocal', () => {
  it('get right local', () => {
    urlToLocal('http://abc.com/a/b/c', 'remote').should.be.eql(path.join(process.cwd(), 'remote', 'http', 'abc.com', 'a', 'b', 'c.less'));
  });
});
