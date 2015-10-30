'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var template = require('gulp-template');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function (gm, gulp, config) {
    gulp.task('js__app', function () {
        var assets = useref.assets({ searchPath: path.relative(process.cwd(), config.paths.app)});

        return gulp.src(config.paths.src.html.index.input)
            .pipe(plumber())
            .pipe(template({ config: config }))
            .pipe(assets)
            .pipe(filter([path.join('**', config.paths.src.js.app.outputFilename)]))
            .pipe(sourcemaps.init())
            .pipe(ngAnnotate(config.tasksParams.ngAnnotate))
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, uglify()))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.dest));
    });
};