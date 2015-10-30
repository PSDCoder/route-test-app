'use strict';

var runSequence = require('run-sequence');

module.exports = function (gm, gulp, config) {
    gulp.task('build', function (cb) {
        var tasksList = [
            'clean',
            'index__inject',
            'index__copy',
            'js__app-lint',
            ['js__app', 'js__vendors', 'js__templates', 'images'],
            ['styles__vendors', 'styles__scss']
        ];

        if (config.ENV === config.ENVIRONMENTS.PROD) {
            tasksList.push('revision');
        }

        tasksList.push(cb);
        runSequence.apply(runSequence, tasksList);
    });
};