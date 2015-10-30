'use strict';

var path = require('path');
var del = require('del');

module.exports = function (gm, gulp, config) {
    gulp.task('clean', function (cb) {
        del([path.join(config.paths.dest, '**', '*')]).then(function () {
            cb();
        });
    });
};