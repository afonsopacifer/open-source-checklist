module.exports = function( grunt ) {

  "use strict"

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //watch and compile all files
    watch: {

      html: {
        files: 'site/*.html',
      },

      css: {
        files: 'site/assets/styles/*.css',
      },

      jd: {
        files: ['src/*.jade','src/**/*.jade'],
        tasks: ['jade:compile'],
      },

      styl: {
        files: ['src/assets/styles/*.styl','src/assets/**/*.styl'],
        tasks: ['stylus:compile'],
      },

      javascript: {
        files: 'src/assets/scripts/*.js',
        tasks: ['uglify'],
      },

      img: {
        files: ['src/assets/img/*.{png,jpg,gif}','src/assets/img/**/*.{png,jpg,gif}'],
        tasks: ['newer:imagemin'],
      },

      json: {
        files: ['checklist.json'],
        tasks: ['build'],
      },

      options: {
        livereload: true
      }

    },

    // The jade compile task
    jade: {
      //compile for production
      compile: {
        files: {
					"site/index.html": ["src/index.jade"],
          "site/pt-br.html": ["src/pt-br.jade"]
				},
        options: {
            data: grunt.file.readJSON("checklist.json")
        }
      },
      //compile for validation
      valid: {
        options: {
          pretty: true
        },
        files: {
					"temp/index.html": ["src/index.jade"]
				}
      }
    },

    //The stylus compile task
    stylus: {
      //compile for production
      compile: {
        files: {
          'site/assets/styles/style.min.css':'src/assets/styles/style.styl' // 1:1 compile
        }
      },
      //compile for Lint
      lint: {
        options: {
          compress: false
        },
        files: {
            'temp/style.css':'src/assets/styles/style.styl' // 1:1 compile
        }
      }
    },

    //concat all JS
    concat: {
			dist: {
		      src: 'src/assets/scripts/*.js',
		      dest: 'site/assets/scripts/scripts.js'
		    }
		},

    //compress all js
    uglify: {
      my_target: {
        files: {
        'site/assets/scripts/scripts.min.js': ['src/assets/scripts/*.js']
        }
      }
    },

    //validate the HTML with W3C rules
    validation: {
      options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
      },
      files: {
        src: ['temp/index.html']
      }
    },

    //Lint the CSS
    csslint: {
      strict: {
        src: ['temp/style.css']
      }
    },

    postcss: {
      options: {
        cascade: false,
        map: true,
        processors: [
          require('autoprefixer-core')({browsers: 'last 2 version, ie >= 9'})
        ]
      },
      dist: {
        src: 'site/assets/styles/*.css'
      }
    },

    //imagemin
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['assets/img/*.{png,jpg,gif}','assets/img/**/*.{png,jpg,gif}'],
          dest: 'site/'
        }]
      }
    },

    //Deploy the production files for gh-pages
    'gh-pages': {
      options: {
        base: 'site/'
      },
      src: ['**']
    },

    //Starts the static server
    connect: {
      server: {
        options: {
          port: 9000,
          base: "site/",
          hostname: "localhost",
          livereload: true,
          open: true
        }
      }

    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('serve', ['connect','watch']);
  grunt.registerTask('build', ['jade:compile','stylus:compile','concat','uglify']);
  grunt.registerTask('validation', ['jade:valid','validation']);
  grunt.registerTask('lint', ['stylus:lint','csslint']);
  grunt.registerTask('autoprefixer', ['postcss']);
  grunt.registerTask('deploy', ['gh-pages']);

};
