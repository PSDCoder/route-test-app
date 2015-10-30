'use strict';

var path = require('path');
var runSequence = require('run-sequence');

module.exports = function (gm, gulp, config) {
    gulp.task('revision', function (cb) {
        runSequence('revision__hash', 'revision__replace', cb);
    });
};