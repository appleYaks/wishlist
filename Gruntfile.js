/*jshint indent:4*/
// Generated on 2013-05-01 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    var karmaConfig = {
        app: {
            configFile: 'karma.app.conf.js',
            port: 9876
        }
    };

    var nodemonIgnoredFiles = [
        'README.md',
        'Gruntfile.js',
        'node-inspector.js',
        'karma.conf.js',
        '/.git/',
        '/node_modules/',
        '/app/',
        '/dist/',
        '/test/',
        '/coverage/',
        '/temp/',
        '/.tmp',
        '/.sass-cache',
        '*.txt',
        '*.jade',
    ];

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            // coffee: {
            //     files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
            //     tasks: ['coffee:dist']
            // },
            // coffeeTest: {
            //     files: ['test/spec/{,*/}*.coffee'],
            //     tasks: ['coffee:test']
            // },
            options: {
                livereload: true
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server'],
                options: {
                    livereload: false,
                },
            },
            emberTemplates: {
                files: [
                    '<%= yeoman.app %>/scripts/app/templates/**/*.hbs',
                    '<%= yeoman.app %>/scripts/app/templates/**/*.hjs',
                    '<%= yeoman.app %>/scripts/app/templates/**/*.handlebars',
                ],
                tasks: ['emberTemplates:app'],
                options: {
                    livereload: false,
                },
            },

            scripts: {
                files: [
                    '<%= yeoman.app %>/scripts/app/**/*.js',
                ],
                tasks: ['clean:transpiled', 'transpile', 'concat_sourcemap:client'],
                options: {
                    livereload: false
                }
            },

            miscScripts: {
                files: [
                    '<%= yeoman.app %>/scripts/misc/**/*.js',
                    '<%= yeoman.app %>/scripts/vendor/**/*.js',
                ],
                tasks: ['concat:dev-ember'],
                options: {
                    livereload: false
                }
            },

            // put all karma targets into the `tasks` array
            // karma: {
            //     files: [
            //         '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
            //         'test/frontend/**/*.js',
            //     ],
            //     tasks: ['karma:app:run'],
            //     options: {
            //         livereload: false,
            //     },
            // },
            // coverageBackend: {
            //     files: [
            //         '!Gruntfile.js',
            //         '!node-inspector.js',
            //         '!karma.conf.js',
            //         '*.js',
            //         'lib/**/*.js',
            //         'test/backend/**/*.js',
            //     ],
            //     tasks: ['coverageBackend'],
            //     options: {
            //         livereload: false,
            //     },
            // },

            css: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                ],
            },
            images: {
                files: [
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,webp}'
                ],
            },
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '.sass-cache',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: ['.tmp', '.sass-cache'],
            compassSprites: {
                files: [{
                    src: [
                        '<%= yeoman.dist %>/<%= yeoman.app %>/images/sprites/*',
                        '!<%= yeoman.dist %>/<%= yeoman.app %>/images/sprites/*.*',
                    ],
                }],
            },
            transpiled: {
                files: [{
                    src: [
                        '.tmp/transpiled/'
                    ],
                }],
            }
        },

        // jshint: {
        //     options: {
        //         jshintrc: '.jshintrc'
        //     },
        //     all: [
        //         'Gruntfile.js',
        //         '<%= yeoman.app %>/scripts/**/*.js',
        //         '!<%= yeoman.app %>/scripts/vendor/*',
        //         'test/spec/**/*.js'
        //     ]
        // },
        // mocha: {
        //     all: {
        //         options: {
        //             run: true,
        //             // urls: ['http://localhost:<%= connect.options.port %>/index.html']
        //         }
        //     }
        // },
        // coffee: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= yeoman.app %>/scripts',
        //             src: '{,*/}*.coffee',
        //             dest: '.tmp/app/scripts',
        //             ext: '.js'
        //         }]
        //     },
        //     test: {
        //         files: [{
        //             expand: true,
        //             cwd: 'test/spec',
        //             src: '{,*/}*.coffee',
        //             dest: '.tmp/spec',
        //             ext: '.js'
        //         }]
        //     }
        // },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                generatedImagesDir: '.tmp/images',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                importPath: 'bower_components',

                // advanced compass config necessary for spritemaps
                // https://gist.github.com/passy/5270050
                // https://github.com/yeoman/yeoman/issues/419
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images',
                httpFontsPath: '/styles/fonts',
                // let the grunt-rev task handle cache-busting
                assetCacheBuster: false,
                // `relativeAssets: true` messes up spritemap url() references in CSS
                relativeAssets: false,
                // this can house any extra settings we might
                // need not provided by grunt-contrib-compass.
                // cannot be combined with these options:
                //   * generatedImagesDir
                //   * httpImagesPath
                //   * httpGeneratedImagesPath
                //   * httpFontsPath
                //   * assetCacheBuster
                // config: 'compass.rb',
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/<%= yeoman.app %>/images'
                }
            },
            server: {
                options: {
                    debugInfo: true,
                }
            }
        },
        // Uglify task does concat,
        // but still available if needed
        concat: {
            'dev-ember': {
                files: {
                    '.tmp/scripts/vendor.js': [
                        'app/scripts/vendor/loader.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/jquery-ui/ui/jquery-ui.js',
                        'bower_components/hammerjs/dist/jquery.hammer.js',
                        'bower_components/handlebars/handlebars.js',
                        'bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.js',
                        'bower_components/ember/ember.js',
                        'bower_components/ember-data/ember-data.js',
                        'bower_components/ember-resolver/dist/ember-resolver.js',
                        'bower_components/ember-load-initializers/ember-load-initializers.js',
                        'bower_components/validator-js/validator.js',
                        'bower_components/moment/moment.js',
                        'app/scripts/misc/config.js',
                    ]
                }
            }
        },

        // ### grunt-es6-module-transpiler
        // Compiles Ember es6 modules
        concat_sourcemap: {
            client: {
                src: ['.tmp/transpiled/**/*.js'],
                dest: '.tmp/scripts/dev-ember.js',
                options: {
                    sourcesContent: true
                }
            }
        },

        requirejs: {
            app: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: 'app/scripts/app',
                    // notifies the optimizer that has() test branches with this/these variables can be optimized out
                    // http://requirejs.org/docs/optimization.html#hasjs
                    has: {
                        // a has() assignment only for unit testing. RequireJS modules are able to
                        // return different values when unit tests set this variable to true
                        //
                        // http://arvelocity.com/2013/07/02/running-an-express-server-with-grunt-and-yeoman-part-3/
                        internalTest: false,
                    },
                    // since usemin uses our development requirejs config file, this will
                    // apply the relevant portions of the config, except where they differ. in this case,
                    // the path is left intact except for the JST path, which is replaced for the build.
                    paths: {
                        JST: '../../../.tmp/scripts/app/templates',
                    },
                    shim: {
                        handlebars: {
                            deps: [],
                            exports: 'Handlebars',
                        },
                        underscore: {
                            deps: [],
                            exports: '_',
                            // remove the global reference to _
                            // and make it internal to RequireJS
                            init: function () {
                                return this._.noConflict();
                            },
                        },
                        backbone: {
                            deps: ['jquery', 'underscore'],
                            exports: 'Backbone',
                            // remove the global reference to Backbone
                            // and make it internal to RequireJS
                            init: function (jquery, underscore) {
                                return this.Backbone.noConflict();
                            },
                        },
                    },
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                    // optimize: 'uglify2',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                }
            },
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/<%= yeoman.app %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/<%= yeoman.app %>/styles/**/*.css',
                        '<%= yeoman.dist %>/<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/<%= yeoman.app %>/styles/fonts/**/*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>/<%= yeoman.app %>'
            },
            html: ['<%= yeoman.app %>/{,*/}*.html', 'views/**/*.jade']
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>/<%= yeoman.app %>'],
                basedir: '<%= yeoman.dist %>/<%= yeoman.app %>',
            },
            html: ['<%= yeoman.dist %>/<%= yeoman.app %>/{,*/}*.html', '<%= yeoman.dist %>/views/**/*.jade'],
            css: ['<%= yeoman.dist %>/<%= yeoman.app %>/styles/{,*/}*.css']
        },
       imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.app %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/<%= yeoman.app %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/<%= yeoman.app %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>/<%= yeoman.app %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/<%= yeoman.app %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                    ]
                }, {
                    // express server jade views
                    expand: true,
                    dot: true,
                    cwd: 'views',
                    dest: '<%= yeoman.dist %>/views/',
                    src: '**/*.jade',
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
        },
        modernizr: {
            devFile: 'bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/<%= yeoman.app %>/scripts/vendor/modernizr.js',
            files: [
                '<%= yeoman.dist %>/<%= yeoman.app %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/<%= yeoman.app %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/<%= yeoman.app %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            nodemon: {
                options: {
                    logConcurrentOutput: true,
                },
                tasks: [
                    'nodemon:nodeInspector',
                    'nodemon:dev',
                    'watch',
                ],
            },
            server: [
                // 'coffee:dist',
                'compass:server',
                'copy:styles',
                // 'handlebars:app',
                'emberTemplates:app',
                'concat:dev-ember',
                'concat_sourcemap:client',
            ],
            // test: [
                // 'coffee',
                // 'compass',
                // 'handlebars:app',
            // ],
            dist: [
                // 'coffee',
                // 'handlebars:app',
                'transpile',
                'emberTemplates:app',
                'copy:styles',
                'compass:dist',
                'svgmin',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        },
        // handlebars: {
        //     app: {
        //         options: {
        //             namespace: false,
        //             amd: true,
        //             processContent: function(content) {
        //                 content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
        //                 content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
        //                 return content;
        //             }
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: '<%= yeoman.app %>/scripts/app/templates/',
        //             src: ['**/*.hbs'],
        //             dest: '.tmp/scripts/app/templates/',
        //             ext: '.js',
        //         }],
        //     },
        // },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: ['development', karmaConfig.app.port],
                    nodeArgs: ['--debug'],
                    // ext: 'js',
                    ext: 'dontRestart',
                    // nodemon watches the current directory recursively by default
                    // watch: ['.'], // default
                    delay: 1,
                    ignore: nodemonIgnoredFiles,
                }
            },
            nodeInspector: {
                script: 'node-inspector.js',
                options: {
                    // ext: 'js',
                    ext: 'dontRestart',
                    ignore: nodemonIgnoredFiles,
                    exec: 'node-inspector',
                },
            },
        },
        karma: {
            options: {
                // configure browsers that will work for you.
                // it's also possible to specify scripts/binaries that will take a URL argument:
                // browsers: ['/usr/bin/firefox'],

                // Currently available:
                // - Chrome
                // - ChromeCanary
                // - Firefox
                // - Opera
                // - Safari (only Mac)
                // - PhantomJS
                // - IE (only Windows)
                browsers: ['PhantomJS'],
                // run karma in a child process so it doesn't block subsequent grunt tasks.
                background: true,
            },
            // NoCoverage tasks are slightly faster
            // Continous tasks are used for a single run, such as during a build

            // `karma` task settings for testing the namespaced client-side app
            app: {
                configFile: karmaConfig.app.configFile,
                port: karmaConfig.app.port,

                reporters: ['dots', 'coverage'],
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/frontend/app/',
                },
                preprocessors: {
                    '**/app/scripts/app/**/*.js': 'coverage',
                },
            },
            appNoCoverage: {
                configFile: karmaConfig.app.configFile,
                port: karmaConfig.app.port,

                reporters: ['dots'],
            },
            appContinuous: {
                configFile: karmaConfig.app.configFile,
                port: karmaConfig.app.port,

                reporters: ['dots', 'coverage'],
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/frontend/app/',
                },
                preprocessors: {
                    '**/app/scripts/app/**/*.js': 'coverage',
                },

                background: false,
                singleRun: true,
            },
            appContinuousNoCoverage: {
                configFile: karmaConfig.app.configFile,
                port: karmaConfig.app.port,

                reporters: ['dots'],

                background: false,
                singleRun: true,
            },
        },
        // simplemocha executes server-side tests
        // without Istanbul Coverage, significantly faster
        simplemocha: {
            options: {
                globals: [
                    'sinon',
                    'chai',
                    'should',
                    'expect',
                    'assert',
                    'AssertionError',
                ],
                timeout: 3000,
                ignoreLeaks: false,
                // grep: '*.spec',
                ui: 'bdd',
                reporter: 'spec'
            },
            backend: {
                src: [
                    // add chai and sinon globally
                    'test/backend/support/globals.js',

                    // tests
                    'test/backend/**/*.spec.js',
                ],
            },
        },

        transpile: {
            client: {
                type: 'amd',
                moduleName: function (path) {
                    return 'client' + path;
                },
                files: [{
                    expand: true,
                    cwd: 'app/scripts/app',
                    src: ['**/*.js'],
                    dest: '.tmp/transpiled/'
                }]
            }
        },

        emberTemplates: {
            app: {
                options: {
                    templateBasePath: /app\/scripts\/app/,
                    templateFileExtensions: /\.hbs|\.hjs|\.handlebars/,
                    templateRegistration: function (name, template) {
                        return grunt.config.process("define('client/") + name + "', ['exports'], function(__exports__){ __exports__['default'] = " + template + "; });";
                    }
                },
                // files: [{
                //     expand: true,
                //     cwd: '<%= yeoman.app %>/scripts/app/templates/',
                //     src: ['**/*.hbs', '**/*.handlebars'],
                //     dest: '.tmp/scripts/app/templates/',
                //     ext: '.js',
                // }],
                files: {
                    ".tmp/scripts/templates-ember.js": "app/scripts/app/templates/**/*.hbs"
                }
            }
        },
    });

    grunt.registerTask('coverageBackend', 'Test backend files as well as code coverage.', function () {
        var done = this.async();

        var path = './test/backend/runner.js';

        var options = {
            cmd: 'istanbul',
            grunt: false,
            args: [
                'cover',
                '--default-excludes',
                '-x', 'app/**',
                '--report', 'lcov',
                '--dir', './coverage/backend',
                path
            ],
            opts: {
                // preserve colors for stdout in terminal
                stdio: 'inherit',
            },
        };

        function doneFunction(error, result, code) {
            if (result && result.stderr) {
                process.stderr.write(result.stderr);
            }

            if (result && result.stdout) {
                grunt.log.writeln(result.stdout);
            }

            // abort tasks in queue if there's an error
            done(error);
        }

        grunt.util.spawn(options, doneFunction);
    });

    grunt.registerTask('server', [
        'clean:server',
        'transpile',
        'concurrent:server',

        // start karma server
        'karma:app',

        'concurrent:nodemon',
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'transpile',
        'concurrent:server',

        // tests with coverage.
        // the server-side coverage test is slower
        'karma:appContinuous',
        'coverageBackend',

        // faster tests without Istanbul coverage
        // 'karma:appContinuousNoCoverage',
        // 'simplemocha:backend',
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',

        'karma:appContinuous',
        'coverageBackend',

        'useminPrepare',

        // Any other requirejs 'sub-projects' can be
        // compiled with 'requirejs:subprojectName'
        'requirejs:app',

        // place after compass:dist in order to
        // ensure compass spritemaps are generated
        // before images are copied over to dist/
        'imagemin',

        'concat',
        'cssmin',
        'uglify',
        'modernizr',
        'copy:dist',

        'rev',
        'usemin',

        // remove sprites folders in dist/images/sprites/
        // in favor of having just the spritesheet files
        'clean:compassSprites',
    ]);

    grunt.registerTask('default', [
        // 'jshint',
        // 'test',
        'build'
    ]);
};
