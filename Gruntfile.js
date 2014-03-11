'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']
    },

    browserify: {
      dist: {
        files: {
          'standalone/motive.js': ['src/motive.js']
        },
        options: {
          standalone: 'motive'
        }
      }
    },

    uglify: {
      standalone: {
        files: {
          'standalone/motive.min.js': ['standalone/motive.js']
        }
      }
    },

    nodeunit: {
      all: ['test/**/*_test.js']
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-browserify');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify', 'nodeunit']);
  grunt.registerTask('test', ['nodeunit']);
};
