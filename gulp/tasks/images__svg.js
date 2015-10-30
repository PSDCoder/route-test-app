'use strict';

var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');

module.exports = function (gm, gulp, config) {
    gulp.task('images__svg', function () {
        return gulp.src(config.paths.src.images.svg.all.input)
            .pipe(plumber())
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, imagemin(config.tasksParams.imagemin.svg)))
            .pipe(gulp.dest(config.paths.src.images.svg.all.output));
    });
};