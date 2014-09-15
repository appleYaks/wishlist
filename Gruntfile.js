/*jshint indent:4*/
// Generated on 2013-05-01 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

var path = require('path'),
    susy = path.join(__dirname, 'bower_components/susy/sass/'),
    breakpoint = path.join(__dirname, 'bower_components/breakpoint-sass/stylesheets/'),
    fontAwesome = path.join(__dirname, 'bower_components/font-awesome/scss'),
    normalize = path.join(__dirname, 'bower_components/normalize-scss/');

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
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['sass:dev'],
            },
            emberTemplates: {
                files: [
                    '<%= yeoman.app %>/scripts/app/templates/**/*.hbs',
                    '<%= yeoman.app %>/scripts/app/templates/**/*.hjs',
                    '<%= yeoman.app %>/scripts/app/templates/**/*.handlebars',
                ],
                tasks: ['emberTemplates:app'],
            },

            scripts: {
                files: [
                    '<%= yeoman.app %>/scripts/app/**/*.js',
                ],
                tasks: ['clean:transpiled', 'transpile', 'concat_sourcemap:client'],
            },

            miscScripts: {
                files: [
                    '<%= yeoman.app %>/scripts/misc/**/*.js',
                    '<%= yeoman.app %>/scripts/vendor/**/*.js',
                ],
                tasks: ['concat:dev-ember'],
            },
            css: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                ],
                options: {
                    livereload: {
                        port: 35729
                    },
                },
            },
            images: {
                files: [
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,webp}'
                ],
                options: {
                    livereload: {
                        port: 35729
                    }
                },
            },
            express: {
                files:  ['server.js', 'lib/**/*.js'],
                tasks:  ['express:dev'],
                options: {
                    // **Note:** Without this option specified express won't be reloaded
                    spawn: false
                }
            },
            tests: {
                files: ['test/frontend/**/*.js'],
                tasks: ['concat:tests']
            }
        },

        // ### grunt-express-server
        // Start a Ghost expess server for use in development and testing
        express: {
            options: {
            },
            dev: {
                options: {
                    script: 'server.js',
                    output: 'Express started on port*',
                    opts: ['--debug'],
                    args: ['development', karmaConfig.app.port],
                    node_env: 'development',
                    port: 9000
                }
            },
            test: {
                options: {
                    node_env: 'testing'
                }
            }
        },
        sass: {
            options: {
                loadPath: [susy, breakpoint, normalize, fontAwesome],
                compass: true,
                require: [],
            },
            dev: {
                files: {
                    '.tmp/styles/main.css': 'app/styles/main.scss',
                }
            },
            dist: {
                options: {
                    sourcemap: false,
                    style: 'compressed',
                },
                files: {
                    'dist/styles/main.css': 'app/styles/main.scss',
                }
            }
        },
        clean: {
            server: ['.tmp', '.sass-cache'],
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

        // Uglify task does concat,
        // but still available if needed
        concat: {
            'dev-ember': {
                files: {
                    '.tmp/scripts/vendor.js': [
                        'bower_components/loader.js/loader.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/hammerjs/dist/jquery.hammer.js',
                        'bower_components/handlebars/handlebars.js',
                        'bower_components/ember/ember.js',
                        'bower_components/ember-resolver/dist/ember-resolver.js',
                        'bower_components/ember-load-initializers/ember-load-initializers.js',
                        'bower_components/validator-js/validator.js',
                        'bower_components/moment/moment.js',
                        'app/scripts/misc/ms-device-width.js',
                    ]
                }
            },
            tests: {
                files: {
                    '.tmp/scripts/tests.js': 'test/frontend/**/*.js'
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
        },
        concurrent: {
            server: [
                'sass:dev',
                'concat:tests',
                'emberTemplates:app',
                'concat:dev-ember',
                'concat_sourcemap:client',
            ],
            // test: [
            // ],
            dist: [
                'transpile',
                'emberTemplates:app',
                'compass:dist',
                'svgmin',
                'htmlmin',
                'sass:dist',
            ]
        },
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

    grunt.registerTask('server', [
        'clean:server',
        'transpile',
        'concurrent:server',
        'express:dev',
        'watch',
    ]);

    grunt.registerTask('test', [
        // 'jshint',
        'clean:server',
        'transpile',
        'concat:tests',
        'concurrent:server',
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'concat',
        'uglify',
        'copy:dist',
        'sass:dist',
    ]);

    grunt.registerTask('default', [
        'server'
    ]);
};
