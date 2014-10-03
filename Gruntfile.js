'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: {
            // configurable paths
            src: 'src',
            dist: 'dist'
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>/*',
                            '<%= config.dist %>/**/*',
                            '!<%= config.dist %>/.git*'
                        ]
                    }
                ]
            },
            docs: 'docs',
            build: 'build'
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [
                    {
                        src: '<%= config.src %>/apModalService.js',
                        dest: '<%= config.dist %>/apModalService.js'
                    }
                ]
            }
        },

        uglify: {
            js: {
                src: ['<%= config.dist %>/apModalService.js'],
                dest: '<%= config.dist %>/apModalService.min.js'
            }
        },

        ngdocs: {
            options: {
                dest: 'docs',
                scripts: [
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.js',
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular-animate.min.js'
                ],
                html5Mode: false,
                analytics: {
                    account: 'UA-51195298-1',
                    domainName: 'scatcher.github.io'
                },
//                startPage: '/api',
                title: 'apModalService API Docs'
            },
            api: {
                src: [
                    '<%= config.src %>/*.js'
                ],
                title: 'API Documentation',
                api: false
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ['**']
        },
        'bump': {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                push: false
            }
        },
        karma: {
            options: {
                browsers: ['Chrome', 'PhantomJS'],
                configFile: 'karma.conf.js'
            },
            unit: {
                autoWatch: false,
                singleRun: true,
                browsers: ['PhantomJS']
            },
            continuous: {
                autoWatch: true,
                singleRun: false,
                browsers: ['PhantomJS']
            },
            coverage: {
                singleRun: true,
                browsers: ['Chrome'],
                preprocessors: {
                    'src/services/*.js': ['coverage'],
                    'src/factories/*.js': ['coverage']
                }
            },
            debug: {
                browsers: ['Chrome'],
                autoWatch: true
            }
        }
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('coverage', [
        'karma:coverage'
    ]);

    grunt.registerTask('debugtest', [
        'karma:debug'
    ]);

    grunt.registerTask('autotest', [
        'karma:continuous'
    ]);

    grunt.registerTask('build', [
        'coverage',
        'bump',
        'clean:dist',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('build-docs', [
        'doc',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
