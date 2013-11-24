'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      browser_test: {
        files: {
          'tmp/browser_test.js': 'browser_test.js'
        },
        options: {
          ignore: [
            'node_modules/htmlparser2/lib/CollectingHandler.js'
          ],
          debug: true
        }
      }
    },

    connect: {
      browser_test: {
        options: {
          // livereload: true,
          keepalive: true,
          port: 3000,
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', [
    'browserify:browser_test',
    'connect:browser_test'
  ]);

};