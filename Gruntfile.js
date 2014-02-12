module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		smash: {
			build: {
				src: 'src/motive.js',
				dest: 'motive.js'
			}
		},
		shell: {
			jsbeautify: {
				command: "js-beautify motive.js -o motive.js -s 2"
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			build: {
				files: {
					'motive.min.js': ['motive.js']
				}
			}
		}

	});
	grunt.loadNpmTasks('grunt-smash');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['smash', 'shell:jsbeautify', 'uglify']);
};