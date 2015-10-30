'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var gulpIf = require('gulp-if');
var svgSprite = require('gulp-svg-sprite');
var imagemin = require('gulp-imagemin');

module.exports = function (gm, gulp, config) {
    gulp.task('images__svg-sprite', function () {
        return gulp.src(config.paths.src.images.svg.sprite.input)
            .pipe(plumber())
            .pipe(svgSprite(config.tasksParams.sprite.svg.svgSprite))
            .pipe(rename(function (filePath) {
                var outputFilename = config.paths.src.images.svg.sprite.outputFilename;

                filePath.dirname = '/';
                filePath.basename = path.basename(outputFilename, path.extname(outputFilename));
            }))
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, imagemin(config.tasksParams.imagemin.svg)))
            .pipe(gulp.dest(config.paths.src.images.svg.sprite.output));
    });
};