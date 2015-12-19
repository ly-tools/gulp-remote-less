'use strict';
// require('should');
// const path = require('path');
// const runSeq = require('run-sequence');
// const CWD = process.cwd();
// const testPath = path.join(CWD, 'test');
//
// function runTest(testCase) {
//   const casePath = path.join(testPath, testCase.name);
//   return new Promise(resolve => {
//     process.chdir(casePath);
//     const gulpInst = require(path.join(casePath, 'gulpfile'));
//     runSeq.use(gulpInst)('default', () => {
//       process.chdir(CWD);
//       resolve();
//     });
//   });
// }
//
// const Cases = [{
//   desc: 'description of case1',
//   name: 'case1'
// }, {
//   desc: 'description of case2',
//   name: 'case2'
// }];
//
// let chain = Promise.resolve();
//
// Cases.forEach(testCase => chain = chain.then(() => runTest(testCase)));
//
// chain.then(() => {
//   describe('...', () => {
//     Cases.map(testCase => it(testCase.desc, function() {
//       // ...
//     }));
//   });
//   run();
// }).catch(e => {
//   throw e;
// });

require('./lib/parseImport');
require('./lib/getPathInfo');
require('./lib/urlToLocal');
require('./lib/fileExists');
require('./lib/fetcher');
require('./lib/isLess');
require('./lib/fetchDeps');
