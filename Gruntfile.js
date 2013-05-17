module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			build: {
				src: [
					'src/intro.js',
					'src/primitives.js',
					'src/functions.js',
					'src/api.js',
					'src/note.js',
					'src/chord.js',
					'src/scale.js',
					'src/outro.js'
				],
				dest: '<%= pkg.name %>.js'
			}
		},
		uglify: {
			build: {
				src: '<%= pkg.name %>.js',
				dest: '<%= pkg.name %>.min.js'
			}
		}
	});
	grunt.registerTask('default', ['concat', 'uglify']);
};