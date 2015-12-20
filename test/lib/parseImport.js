'use strict';

require('should');
require('should-promised');
const File = require('vinyl');
const parseImport = require('../../lib/parseImport');
const path = require('path');

describe('parseImport', () => {
  it('should get local path info', () => {
    return parseImport(new File({
        path: path.join(process.cwd(), 'a', 'b', 'c.less'),
        contents: new Buffer(`
          @import (inline) './d.less';
          @import (multiple) '../e.less';
          @import 'https://abcdefg.com/f.less';
          @import 'https://abcdefg.com/a/b/c/d/f.less';
          // @import 'asdfasdfasd';
          /*
            @import 'asdfasdfasdff';
            @import 'asdfasdfasdff';
          */
        `)
      }), {
        base: 'github'
      })
      .then(rst => rst.deps)
      .should.be.fulfilledWith([{
        path: path.join(process.cwd(), 'a', 'b', 'd.less'),
        raw: './d.less'
      }, {
        path: path.join(process.cwd(), 'a', 'e.less'),
        raw: '../e.less'
      }, {
        path: path.join(process.cwd(), 'github', 'https', 'abcdefg.com', 'f.less'),
        url: 'https://abcdefg.com/f.less',
        raw: 'https://abcdefg.com/f.less'
      }, {
        path: path.join(process.cwd(), 'github', 'https', 'abcdefg.com', 'a', 'b', 'c', 'd', 'f.less'),
        url: 'https://abcdefg.com/a/b/c/d/f.less',
        raw: 'https://abcdefg.com/a/b/c/d/f.less'
      }]);
  });
  it('should get remote path info', () => {
    let file = new File({
      path: path.join(process.cwd(), 'test', 'case1', 'github', 'parseImport.less'),
      contents: new Buffer(`
        @import './d.less';
        @import '../e.less';
        @import 'https://abcdefg.com/f.less';
        @import 'https://abcdefg.com/a/b/c/d/f.less';
      `)
    });
    file.url = 'http://asdf.com/a/b';
    return parseImport(file, {
        base: 'github'
      })
      .then(rst => rst.deps)
      .should.be.fulfilledWith([{
        path: path.join(process.cwd(), 'github', 'http', 'asdf.com', 'a', 'd.less'),
        url: 'http://asdf.com/a/d.less',
        raw: './d.less'
      }, {
        path: path.join(process.cwd(), 'github', 'http', 'asdf.com', 'e.less'),
        url: 'http://asdf.com/e.less',
        raw: '../e.less'
      }, {
        path: path.join(process.cwd(), 'github', 'https', 'abcdefg.com', 'f.less'),
        url: 'https://abcdefg.com/f.less',
        raw: 'https://abcdefg.com/f.less'
      }, {
        path: path.join(process.cwd(), 'github', 'https', 'abcdefg.com', 'a', 'b', 'c', 'd', 'f.less'),
        url: 'https://abcdefg.com/a/b/c/d/f.less',
        raw: 'https://abcdefg.com/a/b/c/d/f.less'
      }]);
  });
});
