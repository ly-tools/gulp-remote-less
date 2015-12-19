'use strict';

require('should');
require('should-promised');
const File = require('vinyl');
const parseImport = require('../../lib/parseImport');
const path = require('path');

describe('parseImport', () => {
  it('parse normal import', () => {
    return parseImport(new File({
        path: path.join(process.cwd(), 'test', 'test.less'),
        contents: new Buffer(`
        @import './abc.less';
        @import './abc';
        @import './abd';
        @import 'https://aaa.com/bbb.less';
        @import 'http://aaa.com/bbb';
      `)
      }))
      .then(file => file.deps)
      .should.be.fulfilledWith(['./abc.less', './abd.less', 'https://aaa.com/bbb.less', 'http://aaa.com/bbb']);
  });
});
