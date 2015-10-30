'use strict';

var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');

module.exports = function (gm, gulp, config) {
    gulp.task('js__app-lint', function () {
        return gulp.src(config.paths.src.js.app.input)
            .pipe(plumber())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(jscs())
            .pipe(jscs.reporter());
    });
};
