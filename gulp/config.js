'use strict';

var path = require('path');
var rootPath = path.resolve(path.join(__dirname, '..'));

module.exports = function (gm) {
    var ENVIRONMENTS = {
        PROD: 'prod',
        DEV: 'dev'
    };
    var ENVIRONMENT_FOLDERS = {};
    ENVIRONMENT_FOLDERS[ENVIRONMENTS.PROD] = 'dist';
    ENVIRONMENT_FOLDERS[ENVIRONMENTS.DEV] = 'dev';
    var currentEnv = gm.getArg('env') || ENVIRONMENTS.DEV;

    //folders helpers
    var dest = path.join(rootPath, ENVIRONMENT_FOLDERS[currentEnv]);
    var destAssets = path.join(dest, 'assets');
    var app = path.join(rootPath, 'app');
    var assets = path.join(app, 'assets');
    var src = path.join(app, 'src');
    var test = path.join(rootPath, 'test');

    return {
        ENVIRONMENTS: ENVIRONMENTS,
        ENV: currentEnv,
        server: {
            host: 'localhost',
            port: 8000
        },
        rcFiles: {
            htmlhintrc: path.join(process.cwd(), '.htmlhintrc')
        },
        paths: {
            root: rootPath,
            app: app,
            dest: dest,
            destAssets: destAssets,
            destAssetsRelative: path.relative(dest, destAssets),
            src: {
                html: {
                    index: {
                        input: path.join(app, 'index.html'),
                        output: dest,
                        outputFilename: 'index.html'
                    },
                    templates: {
                        input: [
                            path.join(src, '**', '*.html'),
                            '!' + path.join(app, 'index.html')
                        ],
                        outputFilename: 'templates.js'
                    }
                },
                templates: {
                    input: [
                        path.join(app, '**', '*.html')
                    ],
                    output: destAssets,
                    outputFilename: 'templates.js'
                },
                js: {
                    vendors: {
                        output: destAssets,
                        outputFilename: 'vendors.js'
                    },
                    app: {
                        input: [
                            path.join(src, '**', '*.module.js'),
                            path.join(src, '**', '*.js')
                        ],
                        output: destAssets,
                        outputFilename: 'app.js'
                    }
                },
                scss: {
                    main: {
                        input: path.join(assets, 'styles', 'main.scss'),
                        inputWatch: [
                            path.join(assets, 'styles', '*.*'),
                            path.join(src, '**', '*.scss')
                        ],
                        output: destAssets,
                        outputFilename: 'main.css'
                    },
                    vendors: {
                        outputFilename: 'vendors.css'
                    }
                },
                images: {
                    raster: {
                        all: {
                            input: [
                                path.join(assets, 'images', '**', '*.+(jpeg|jpg|png|gif)'),
                                '!' + path.join(assets, 'images', 'sprite', '*.*')
                            ],
                            output: path.join(dest, 'assets', 'images')
                        },
                        sprite: {
                            input: path.join(assets, 'images', 'sprite', '*.+(jpeg|jpg|png|gif)'),
                            output: path.join(dest, 'assets', 'images'),
                            outputFilename: 'sprite.png',
                            outputScss: path.join(assets, 'styles'),
                            outputScssFilename: '_sprite.scss'
                        }
                    },
                    svg: {
                        all: {
                            input: [
                                path.join(assets, 'svgs', '**', '*.svg'),
                                '!' + path.join(assets, 'svgs', 'sprite', '*.svg')
                            ],
                            output: path.join(dest, 'assets', 'svgs')
                        },
                        sprite: {
                            input: [
                                path.join(assets, 'svgs', 'sprite', '*.svg')
                            ],
                            output: path.join(dest, 'assets', 'svgs'),
                            outputFilename: 'sprite.svg',
                            outputFallbackPng: path.join(dest, 'assets', 'svgs'),
                            outputFallbackPngFilename: 'sprite-svg-fallback.png',
                            outputFallbackScss: path.join(assets, 'styles'),
                            outputFallbackScssFilename: 'sprite-svg-fallback.scss'
                        }
                    }
                }
            }
        },
        tasksParams: {
            ngAnnotate: {
                'single_quotes': true
            },
            sprite: {
                raster: {
                    templatePath: path.join(assets, 'styles', 'sprite.handlebars')
                },
                svg: {
                    fallback: {
                        backgroundUrl: '/' + path.join('assets', 'svgs', 'sprite-svg-fallback.png'),
                        cssTemplate: path.join(assets, 'styles', 'sprite-svg-fallback.lodash.tpl')
                    },
                    svgSprite: {
                        svg: {
                            xmlDeclaration: false,
                            doctypeDeclaration: false,
                            transform: [
                                function (svg) {
                                    var xmldom = require('xmldom');
                                    var doc = (new xmldom.DOMParser()).parseFromString(svg, 'text/xml');
                                    var root = doc.documentElement;

                                    root.setAttribute('id','svg-sprite');
                                    root.setAttribute('width','0');
                                    root.setAttribute('height','0');

                                    return (new xmldom.XMLSerializer()).serializeToString(doc);
                                }
                            ]
                        },
                        shape: {
                            dimension: {
                                maxWidth: 32,
                                maxHeight: 32
                            },
                            spacing: {
                                padding: 0
                            }
                        },
                        mode: {
                            symbol: true
                        }
                    }
                }
            },
            imagemin: {
                raster: {
                    progressive: true,
                    optimizationLevel: currentEnv === ENVIRONMENTS.PROD ? 6 : 3,
                    use: [
                        require('imagemin-pngquant')()
                    ]
                },
                svg: {
                    multipass: currentEnv === ENVIRONMENTS.PROD,
                    svgoPlugins: [
                        { cleanupIDs: false }
                    ]
                }
            },
            revision: {
                manifestFileName: 'revision-manifest.json',
                addHash: ['css', 'js', 'map', 'png', 'jpg', 'jpeg', 'gif', 'svg'],
                replaceIn: ['html', 'css', 'js']
            },
            test: {
                watch: {
                    rebuild: [
                        path.join(src, '**', '**/*.module.js'),
                        path.join(src, '**', '!(*.module|*.spec).js')
                    ],
                    refresh: [
                        path.join(test, 'phantomjs-extending.js'),
                        path.join(test, 'global.js'),
                        path.join(src, '**', '*.spec.js')
                    ]
                },
                karmaConfig: {
                    basePath: '',
                    files: transformPatterns([
                        path.join(rootPath, 'node_modules/phantomjs-polyfill/bind-polyfill.js'),
                        path.join(test, 'phantomjs-extending.js'),
                        path.join(test, 'global.js'),
                        path.join(destAssets, 'vendors.js'),
                        path.join(app, 'bower_components/angular-mocks/angular-mocks.js'),
                        path.join(destAssets, 'templates.js'),
                        path.join(destAssets, 'app.js'),
                        path.join(src, '**', '*.spec.js')
                    ])
                    .concat([
                        //static
                        {
                            pattern: path.join(destAssets, '/**/*.+(png|jpg|jpeg|svg)'),
                            included: false,
                            served: true,
                            watched: false,
                            nocache: true
                        }
                    ]),
                    proxies: {
                        '/assets/': path.join(destAssets, '/')
                    },
                    frameworks: ['mocha', 'chai', 'sinon'],
                    browsers: ['PhantomJS'],
                    plugins: [
                        'karma-phantomjs-launcher',
                        'karma-spec-reporter',
                        'karma-mocha',
                        'karma-chai',
                        'karma-sinon'
                    ],
                    reporters: ['spec']
                }
            }
        }
    };
};

function transformPatterns(array) {
    return array.map(function (pattern) {
        return {
            pattern: pattern,
            watched: false
        };
    });
}