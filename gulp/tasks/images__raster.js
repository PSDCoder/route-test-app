'use strict';

var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');

module.exports = function (gm, gulp, config) {
    gulp.task('images__raster', function () {
        return gulp.src(config.paths.src.images.raster.all.input)
            .pipe(plumber())
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, imagemin(config.tasksParams.imagemin.raster)))
            .pipe(gulp.dest(config.paths.src.images.raster.all.output));
    });
};