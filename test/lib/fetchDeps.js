'use strict';

require('should');
require('should-promised');
const fetchDeps = require('../../lib/fetchDeps');
const path = require('path');
const File = require('vinyl');
const fs = require('fs-extra');
const CWD = process.cwd();

describe('fetcher', () => {
  before(() => process.chdir(path.join(CWD, 'test', 'fetcher')));
  after(() => process.chdir(CWD));
  it('should fetch file deps', () => {
    return fetchDeps(new File({
      path: path.join(__dirname, '..', 'source', 'a.less'),
      contents: fs.readFileSync(path.join(__dirname, '..', 'source', 'a.less'))
    }), {
      useLocal: true
    }).then(files => console.log(files)).catch(e => console.error(e.message, e.stack));
  });
});
