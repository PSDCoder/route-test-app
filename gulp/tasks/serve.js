'use strict';

var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

module.exports = function (gm, gulp, config) {
    var bs = gm.set('browserSync', browserSync.create());

    gulp.task('serve', function (cb) {
        var tasks = ['build'];

        if (gm.getArg('watch')) {
            if (gm.getArg('env') === config.ENVIRONMENTS.PROD) {
                console.info('You can\'t use --watch options in prod mode');
            } else {
                tasks.push('watch');
            }
        }

        tasks.push(function () {
            bs.init({
                server: {
                    baseDir: config.paths.dest
                },
                port: config.server.port || 3333
            }, cb);
        });

        runSequence.apply(null, tasks);
    });
};