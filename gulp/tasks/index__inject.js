'use strict';

var pathsInjector = require('gulp-paths-injector');
var plumber = require('gulp-plumber');
var path = require('path');
var saveFile = require('gulp-savefile');

module.exports = function (gm, gulp, config) {
    var injector = pathsInjector();

    gulp.task('index__inject', function () {
        return gulp.src(config.paths.src.html.index.input)
            .pipe(plumber())
            .pipe(injector.inject())
            .pipe(saveFile());
    });
};