module.exports = function(grunt) {
	
	grunt.initConfig({
		babel: {
			options: {
				stage: 1
			},
			dist:{
				files: { 'dist/Router.js': 'lib/Router.js' }
			}
		}
	})
	
	grunt.loadNpmTasks('grunt-babel');
	
	grunt.registerTask('default', ['babel']);
}