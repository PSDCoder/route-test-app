'use strict';

var path = require('path');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var KarmaServer = require('karma').Server;

module.exports = function (gm, gulp, config) {
    gulp.task('test', function () {
        if (config.ENV !== config.ENVIRONMENTS.DEV) {
            throw new Error('You may run "test" task only in DEV mode');
        }

        runSequence('build', function () {
            var karmaConfig = Object.assign(
                {},
                config.tasksParams.test.karmaConfig,
                {
                    autoWatch: gm.getArg('watch'),
                    singleRun: !gm.getArg('watch')
                }
            );
            var testServer = new KarmaServer(karmaConfig, function (exitCode) {
                console.log('Karma has exited with ' + exitCode);
                process.exit(exitCode);
            });

            testServer.start();

            if (gm.getArg('watch')) {
                watch(config.tasksParams.test.watch.rebuild, function () {
                    runSequence('js__app-lint', 'js__app', testServer.refreshFiles.bind(testServer));
                });
                watch(config.tasksParams.test.watch.refresh, testServer.refreshFiles.bind(testServer));
            }
        });
    });
};