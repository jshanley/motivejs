/**
 * motive
 * https://github.com/johnshanley/motive/
 * Copyright (c) 2014 John Shanley
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', 'test/*.js']
    },

    assemble: {
      options: {flatten: true},
      docs: {
        src: ['docs/index.hbs'],
        dest: '<%= site.destination %>/',
      }
    },

    gluejs: {
      options: {
        export: 'motive',
        main: 'src/motive.js'
      },
      files: {
        src: ['src/*.js', 'src/**/*.js'],
        dest: './motive.js'
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      example: ['<%= site.destination %>/*.html']
    },

    nodeunit: {
      files: ['test/test-*.js']
    },

    watch: {
      jshint: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint:lint']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-gluejs');
  grunt.loadNpmTasks('assemble');

  // Tests to be run.
  grunt.registerTask('test', ['nodeunit']);

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['clean', 'jshint', 'test', 'assemble']);
};
