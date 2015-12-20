'use strict';
const Gulp = require('gulp').Gulp;
const gulp = new Gulp();
const less = require('gulp-less');
const plugin = require('../../index');
const del = require('del');

gulp.task('clean', cb => del(['build', 'remote'], cb));

gulp.task('default', ['clean'], () => {
  return gulp.src('src/**/*')
    .pipe(plugin({
      useLocal: true
    }))
    .pipe(less())
    .pipe(gulp.dest('build'));
});

module.exports = gulp;
