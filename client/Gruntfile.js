module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: ['public'],

    //copy files to public folder
    copy: {
      project: {
        expand: true,
        cwd : 'src',
        src: ['index.html', './app/assets/*'],
        dest: 'public'
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          'src/common/bootstrap-datepicker/datepicker.css',
          'public/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: 'public/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        src: [ 
          'vendor/jquery/dist/jquery.min.js', 
          'vendor/bootstrap/dist/js/bootstrap.min.js', 
          'vendor/moment/min/moment.min.js', 
          'vendor/moment-timezone/builds/moment-timezone-with-data.min.js', 
          'vendor/bs-typeahead/js/bootstrap-typeahead.min.js',
          'vendor/bootstrap-waitingfor/build/bootstrap-waitingfor.min.js',
          'src/**/*.js', 
        ],
        dest: 'public/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    //uglify
    uglify: {
      js: { //target
        src: ['./public/js/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: './public/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      compile: {
        files: {
          'public/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'src/less/main.less'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    }

  });

  //load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  //register grunt default task
  grunt.registerTask('default', ['clean', 'less:compile', 'copy:project', 'concat:compile_js', 'concat:build_css', 'uglify']);
}