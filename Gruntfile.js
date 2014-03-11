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

    gluejs: {
      options: {
        export: 'motive',
        main: 'src/motive.js'
      },
      files: {
        src: ['src/*.js', 'src/**/*.js'],
        dest: 'standalone/motive.js'
      }
    },

    uglify: {
      browser_build: {
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
  grunt.loadNpmTasks('grunt-contrib-gluejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['jshint', 'gluejs', 'uglify', 'nodeunit']);
  grunt.registerTask('test', ['nodeunit']);
};
