'use strict';

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
        options: {
            sourceMap: false
        },
        dist: {
          files: [{
              "expand": true,
              "cwd": "public/javascripts",
              "src": ["*.ec6"],
              "dest": "public/javascripts/",
              "ext": ".js"
          }]
        }
    },
    watch: {
      ec6: {
        files: ['public/javascripts/**'],
        tasks: ['babel'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: ['gruntfile.js', 'app.js', 'app/**/*.js', 'public/javascripts/**'],
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
        src: ['gruntfile.js', 'app.js', 'app/**/*.js', 'public/javascripts/*.ec6'],
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
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-babel');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent']);


};
