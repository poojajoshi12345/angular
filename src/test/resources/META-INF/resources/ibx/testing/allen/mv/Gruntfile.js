/**
 *
 * Created by aw14286 on 11/15/2017.
 */
module.exports = function (grunt)
{
   require('load-grunt-tasks')(grunt);
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      /* concatenate all of the production dependencies installed in bower_modules*/
      'bower_concat': {
         all: {
            options: {
               separator: ';\n\n'
            },
            dest: "workspace/lib.js"
         }
      },
      /* remove all leftover artifacts in the workspace and build directories */
      clean: ["build", "workspace"],
      concat: {
         options: {
            separator: '\n\n',
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - Built:' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
            process: function (src, filepath)
            {
               // Strips only /* ... */ block comment banners, excluding /*! ... */.
               var re = new RegExp('^\\s*(?:\\/\\*[^!][\\s\\S]*?\\*\\/)\\s*', '');
               return "/*! source path:" + filepath + " */\n" + src.replace(re, '');
            },
            footer: '\n/*! <%= pkg.name %> - Built:' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
         },
         js: {
            src: ["workspace/lib.js", "jsp-fallback.js", "src/js/wfcontent.js"],
            dest: "build/mv.js"
         }
      },
      copy: {
         pushToJSP: {
            files: [
               {
                  src: ["build/slp.jsp"],
                  dest: grunt.file.expand("C:/ibi/WebFOCUS82/webapps/webfocus/WEB-INF/jsp")[0] + "/slp/slp.jsp"
               }]
         },
         pushToWF: {
            files: [
               {
                  src: ["build/slp.jsp"],
                  dest: grunt.file.expand("C:/ibi/WebFOCUS8?/webapps/webfocus/")[0] + "/slp/slp.jsp"
               }]
         }
      },
      uglify: {
         js: {
            compress: true,
            files: {
               'build/mv.min.js': ["build/mv.js"]
            }
         }
      },
      cssmin: {
         css: {
            files: {
               'build/mv.min.css': ["src/css/styles.css"]
            }
         }

      },
      htmlbuild: {
         all: {
            src: 'src/index.html',
            dest: 'build/slp.jsp',
            options: {
               sections: {
                  head: "src/templates/head.jsp",
                  ibx: "src/templates/ibx-script.html"
               },
               scripts: {
                  script: "build/mv.min.js"
               },
               styles: {
                  style: ["build/mv.min.css"]
               }
            }
         }
      },
      rollup: {
         options: {
            format: 'iife'
         },
         files: {
            'src/js/wfcontent.js': 'src/typescripts/wfcontent.js'
         }
      },
      watch: {
         scripts: {
            files: ['src/js/*.js'],
            tasks: ['jsp'],
            options: {
               debounceDelay: 3000,
            }
         },
         type: {
            files: ['src/typescripts/*.js'],
            tasks: ['rollup']
         }
      }
   });
   grunt.registerTask("build", ["clean" ,"bower_concat", "concat:js", "uglify", "cssmin", "force:on", "htmlbuild:all", "force:off"]);
   grunt.registerTask("jsp", ["build", "copy:pushToJSP", "copy:pushToWF"]);
   grunt.registerTask("push", ["copy:pushToJSP", "copy:pushToWF"]);
};