'use strict';

var path = require('path');
var revReplace = require('gulp-rev-replace');

module.exports = function (gm, gulp, config) {
    gulp.task('revision__replace', function () {
        return gulp.src([
                path.join(config.paths.dest, '**', '*.*(' + config.tasksParams.revision.replaceIn.join('|') + ')')
            ])
            .pipe(revReplace({
                manifest: gulp.src(path.join(config.paths.dest, config.tasksParams.revision.manifestFileName))
            }))
            .pipe(gulp.dest(config.paths.dest));
    });
};