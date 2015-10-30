'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var template = require('gulp-template');
var useref = require('gulp-useref');
var htmlHint = require('gulp-htmlhint');
var saveFile = require('gulp-savefile');

module.exports = function (gm, gulp, config) {
    gulp.task('index__copy', function () {
        return gulp.src(config.paths.src.html.index.input)
            .pipe(plumber())
            .pipe(template({ config: config }))
            .pipe(useref())
            .pipe(htmlHint({ htmlhintrc: config.rcFiles.htmlhintrc }))
            .pipe(htmlHint.reporter())
            .pipe(gulp.dest(config.paths.src.html.index.output));
    });
};