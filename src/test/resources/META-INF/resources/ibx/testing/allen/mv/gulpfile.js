var gulp = require('gulp');
var inline = require('gulp-inline');
var uglify = require('gulp-uglify');
var fs = require("fs");
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

// add src files inline
gulp.task('inline', function ()
{
   return gulp.src('./src/index.html')
              .pipe(inline({
                 base: 'src/',
                 // js: uglify, /*uncomment to minify the js*/
                 css: minifyCss
              }))
              .pipe(replace("<!--JSPHEAD-->", fs.readFileSync('./src/templates/head.jsp', 'utf8')))
              .pipe(rename('slp.jsp'))
              .pipe(gulp.dest('./build'))
});

gulp.task('default', ['inline']);