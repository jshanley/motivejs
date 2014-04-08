module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    smash: {
      dist: {
        src: 'src/index.js',
        dest: 'motive.js'
      }
    },

    jsbeautifier: {
      files: ['motive.js'],
      options: {
        js: {
          indentChar: ' ',
          indentSize: 2,
          indentWithTabs: false
        }
      }
    },

    uglify: {
      standalone: {
        files: {
          'motive.min.js': ['motive.js']
        }
      }
    },

    nodeunit: {
      all: ['test/**/*_test.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.registerTask('default', ['build', 'test']);
  grunt.registerTask('build', ['smash', 'jsbeautifier', 'uglify']);
  grunt.registerTask('test', ['nodeunit']);
};
