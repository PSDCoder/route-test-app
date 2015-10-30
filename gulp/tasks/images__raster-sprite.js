'use strict';

var plumber = require('gulp-plumber');
var path = require('path');
var spritesmith = require('gulp.spritesmith');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');

module.exports = function (gm, gulp, config) {
    gulp.task('images__raster-sprite', function () {
        var spriteData = gulp.src(config.paths.src.images.raster.sprite.input)
            .pipe(plumber())
            .pipe(spritesmith({
                imgName: config.paths.src.images.raster.sprite.outputFilename,
                cssName: config.paths.src.images.raster.sprite.outputScssFilename,
                imgPath: '/' + path.join(
                    path.relative(config.paths.dest, config.paths.src.images.raster.sprite.output),
                    config.paths.src.images.raster.sprite.outputFilename
                ),
                cssTemplate: config.tasksParams.sprite.raster.templatePath
            }));
        var imgStream = spriteData.img
            .pipe(plumber())
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, imagemin(config.tasksParams.imagemin.raster)))
            .pipe(gulp.dest(config.paths.src.images.raster.sprite.output));

        var cssStream = spriteData.css
            .pipe(plumber())
            .pipe(gulp.dest(config.paths.src.images.raster.sprite.outputScss));

        return merge(imgStream, cssStream);
    });
};
