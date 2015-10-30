'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var template = require('gulp-template');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function (gm, gulp, config) {
    gulp.task('js__vendors', function (cb) {
        var assets = useref.assets({ searchPath: path.relative(process.cwd(), config.paths.app) });

        return gulp.src(config.paths.src.html.index.input)
            .pipe(plumber())
            .pipe(template({ config: config }))
            .pipe(assets)
            .pipe(filter([path.join('**', config.paths.src.js.vendors.outputFilename)]))
            .pipe(sourcemaps.init())
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, uglify()))
            .pipe(rename(function (filePath) {
                filePath.dirname = '/';
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.src.js.vendors.output));
    });
};

