'use strict';

var path = require('path');
var rev = require('gulp-rev');
var revDeleteOriginal = require('gulp-rev-delete-original');

module.exports = function (gm, gulp, config) {
    gulp.task('revision__hash', function () {
        return gulp.src(
                path.join(config.paths.destAssets, '**', '*.*(' + config.tasksParams.revision.addHash.join('|') + ')')
            )
            .pipe(rev())
            .pipe(revDeleteOriginal())
            .pipe(gulp.dest(config.paths.destAssets))
            .pipe(rev.manifest(config.tasksParams.revision.manifestFileName, { cwd: config.paths.dest }))
            .pipe(gulp.dest(config.paths.destAssets));
    });
};