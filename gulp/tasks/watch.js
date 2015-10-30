'use strict';

var path = require('path');
var watch = require('gulp-watch');
var pathsInjector = require('gulp-paths-injector');
var runSequence = require('run-sequence');

module.exports = function (gm, gulp, config) {
    var browserSync = gm.get('browserSync');

    gulp.task('watch', function () {
        //HTML
        watch(config.paths.src.html.index.input, function () {
            runSequence('index__inject', 'index__copy', browserSync.reload);
        });
        watch(config.paths.src.html.templates.input, function () {
            runSequence('js__templates', browserSync.reload);
        });

        //IMAGES
        watch(config.paths.src.images.raster.all.input, function () {
            runSequence('images__raster', browserSync.reload);
        });
        watch(config.paths.src.images.raster.sprite.input, function () {
            runSequence('images__raster-sprite');
            //will be reloaded after scss build
        });
        watch(config.paths.src.images.svg.all.input, function () {
            runSequence('images__svg', browserSync.reload);
        });
        watch(config.paths.src.images.svg.sprite.input, function () {
            runSequence('images__svg-sprite', browserSync.reload);
        });

        //JS
        pathsInjector()
            .getGlobs(config.paths.src.html.index.input, 'js', 'app')
            .then(function (globs) {
                globs = globs.map(function (file) {
                    return path.join(config.paths.app, file);
                });
                watch(globs, function () {
                    runSequence(
                        ['index__inject', 'index__copy'],
                        'js__app-lint',
                        'js__app',
                        browserSync.reload
                    );
                });
            }, function (reason) {
                console.error(reason);
            });

        //SCSS
        watch(config.paths.src.scss.main.inputWatch, function () {
            runSequence('styles__scss', browserSync.reload);
        });
    });
};

