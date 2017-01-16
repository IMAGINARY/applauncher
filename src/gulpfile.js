'use strict';

var public_dir = '../web';
var site_path = 'localhost/imaginary_applauncher';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var pug = require('gulp-pug');
var rename = require("gulp-rename");

gulp.task('reload', function(){
  browserSync.reload();
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(public_dir + '/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    proxy: site_path
  });

  gulp.watch('./sass/**/*.scss', ['sass', 'reload']);
});

gulp.task('pug', function() {
  gulp
      .src(['./pug/**/*.pug', '!./pug/include/**/*.pug', '!./pug/tpl/**/*.pug', '!./pug/sections/**/*.pug']).pipe(
      pug({
        pretty: true,
        data: function() {
          return require('./data.js');
        }
      })).pipe(
      rename({
        extname: ".html",
      })).pipe(
      gulp.dest(public_dir));
});

gulp.task('default', ['sass']);