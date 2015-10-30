'use strict';

var templateCache = require('gulp-angular-templatecache');
var htmlHint = require('gulp-htmlhint');

module.exports = function (gm, gulp, config) {
    gulp.task('js__templates', function () {
        return gulp.src(config.paths.src.templates.input)
            .pipe(htmlHint({ htmlhintrc: config.rcFiles.htmlhintrc }))
            .pipe(htmlHint.reporter())
            .pipe(templateCache(config.paths.src.templates.outputFilename, {
                standalone: true,
                templateHeader: 'angular.module(\'<%= module %>\'<%= standalone %>)' +
                    '.run([\'$templateCache\', function($templateCache) {',
                templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');',
                templateFooter: '}]);',
                transformUrl: function (url) {
                    if (url.indexOf('/') !== 0) {
                        url = '/' + url;
                    }

                    return url;
                }
            }))
            .pipe(gulp.dest(config.paths.src.templates.output));
    });
};