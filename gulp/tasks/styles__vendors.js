'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var template = require('gulp-template');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-minify-css');

module.exports = function (gm, gulp, config) {
    gulp.task('styles__vendors', function () {
        var assets = useref.assets({ searchPath: path.relative(process.cwd(), config.paths.app)});

        return gulp.src(config.paths.src.html.index.input)
            .pipe(plumber())
            .pipe(template({ config: config }))
            .pipe(assets)
            .pipe(filter([path.join('**', config.paths.src.scss.vendors.outputFilename)]))
            .pipe(gulpIf(config.ENV === config.ENVIRONMENTS.PROD, minifyCss()))
            .pipe(gulp.dest(config.paths.dest));
    });
};