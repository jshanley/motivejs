'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', 'test/*.js']
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

    watch: {
      jshint: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint:lint']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-gluejs');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['jshint', 'gluejs']);
};
