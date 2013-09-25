module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildsrc: [
        'src/fossil-i18next.js'
    ],
    concurrent: {
        dev: {
            tasks: ['watch', 'connect:server:keepalive'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    watch: {
        src: {
            files: 'src/**/*.js',
            tasks: ['concat:library', 'concat:amd']
        }
    },
    connect: {
        server: {
            options: {
                port: 8000,
                base: '.',
                hostname: '*'
            }
        }
    },
    mocha: {
        options: {
            log: true,
            ingnoreLeaks: false,
            reporter: 'Spec',
            run: true
        },
        service: ['tests/test.html', 'tests/handlebars.html']
    },
    concat: {
        library:{
            options: {
                banner: "(function (_, Fossil, Handlebars, i18next, jQuery) {\n",
                footer: [
                    "return Fossil.Services.I18next;",
                    "})(_, Fossil, Handlebars, i18n, jQuery);"
                ].join("\n")
            },
            src: '<%= buildsrc %>',
            dest: '<%= pkg.name %>.js'
        },
        amd:{
            options: {
                banner: [
                    "define('fossil-i18next', ",
                    "['underscore', 'fossil', 'handlebars', 'i18next', 'jquery'], ",
                    "function (_, Fossil, Handlebars, i18next, jQuery) {\n"
                ].join("\n"),
                footer: [
                    "return Fossil.Services.I18next;",
                    "});"
                ].join("\n")
            },
            src: '<%= buildsrc %>',
            dest: '<%= pkg.name %>-amd.js'
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      library: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      },
      amd: {
        src: '<%= pkg.name %>-amd.js',
        dest: '<%= pkg.name %>-amd.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha');

  // Default task(s).
  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('dev', ['concat:library', 'concat:amd', 'concurrent:dev']);
  grunt.registerTask('release', ['concat:library', 'concat:amd', 'test', 'uglify:library', 'uglify:amd']);
  grunt.registerTask('default', ['release']);

};
