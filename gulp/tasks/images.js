'use strict';

var runSequence = require('run-sequence');

module.exports = function (gm, gulp, config) {
    gulp.task('images', function (cb) {
        runSequence([
            'images__raster',
            'images__raster-sprite',
            'images__svg',
            'images__svg-sprite',
            'images__svg-fallback'
        ], cb);
    });
};