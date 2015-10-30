'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var svgFallback = require('gulp-svgfallback');

module.exports = function (gm, gulp, config) {
    gulp.task('images__svg-fallback', function () {
        var pngFilter = filter('*.png', { restore: true });
        var cssFilter = filter('*.css');

        return gulp.src(config.paths.src.images.svg.sprite.input)
            .pipe(plumber())
            .pipe(svgFallback(config.tasksParams.sprite.svg.fallback))
            .pipe(pngFilter)
            .pipe(rename(function (filePath) {
                var outputFilename = config.paths.src.images.svg.sprite.outputFallbackPngFilename;

                filePath.dirname = '/';
                filePath.basename = path.basename(outputFilename, path.extname(outputFilename));
            }))
            .pipe(gulp.dest(config.paths.src.images.svg.sprite.outputFallbackPng))
            .pipe(pngFilter.restore)
            .pipe(cssFilter)
            .pipe(rename(function (filePath) {
                var outputFilename = config.paths.src.images.svg.sprite.outputFallbackScssFilename;

                filePath.dirname = '/';
                filePath.extname = path.extname(outputFilename);
                filePath.basename = path.basename(outputFilename, filePath.extname);
            }))
            .pipe(gulp.dest(config.paths.src.images.svg.sprite.outputFallbackScss));
    });
};