'use strict';

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'app.js', 'app/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        },
      },
      html: {
        files: ['views/**'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: ['public/stylesheets/**'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: ['gruntfile.js', 'app.js', 'app/**/*.js'],
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js',
          nodeArgs: ['--inspect'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'nodemon', 'watch']);

};
