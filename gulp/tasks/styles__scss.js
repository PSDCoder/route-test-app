'use strict';

var path = require('path');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

module.exports = function (gm, gulp, config) {
    gulp.task('styles__scss', function () {
        return gulp.src(config.paths.src.scss.main.input)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([
                autoprefixer({
                    browsers: ['last 2 versions']
                })
            ]))
            .pipe(minifyCss({ sourceMap: true }))
            .pipe(rename(function (filePath) {
                filePath.extname = path.extname(config.paths.src.scss.main.outputFilename);
                filePath.basename = path.basename(config.paths.src.scss.main.outputFilename, filePath.extname);
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.src.scss.main.output))
            .pipe(gm.get('browserSync').stream());
    });
};