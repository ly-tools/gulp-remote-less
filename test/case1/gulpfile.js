'use strict';
const Gulp = require('gulp').Gulp;
const gulp = new Gulp();
const plugin = require('../../index');
const del = require('del');

gulp.task('clean', cb => del('build', cb));

gulp.task('default', ['clean'], () => {
  return gulp.src('src/**/*')
    // ...
    .pipe(plugin({
      // options here
    }))
    // ...
    .pipe(gulp.dest('build'));
});

module.exports = gulp;
