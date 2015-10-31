module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                stage: 1
            },
           dist: {
                files: {
                    'dist/Router.js': 'lib/Router.js',
                    'dist/errors/RouteNotFoundError.js': 'lib/errors/RouteNotFoundError.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['babel']);
}