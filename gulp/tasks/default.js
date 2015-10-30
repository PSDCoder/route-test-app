'use strict';

var runSequence = require('run-sequence');

module.exports = function (gm, gulp, config) {
    gulp.task('default', function (cb) {
        runSequence('build', cb); //'watch'
    });
};