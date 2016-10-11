var gulp = require('gulp');
var inject = require('gulp-inject');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglifyjs');
var fs = require('fs');
var json = JSON.parse(fs.readFileSync('./package.json'));   

gulp.task('inject-btn-css', function () {

 var minifiedCss = gulp.src(['./src/btn.css']).pipe(cleanCSS({compatibility: 'ie8'}));

  gulp.src('./src/bootstrap-btn-color.js')
  .pipe(inject(minifiedCss, {
    starttag: '/* inject:btn */',
    endtag: '/* endinject */',
    transform: function (filePath, file) {
      // return file contents as string 
      return file.contents.toString('utf8')
    }
  }))
  .pipe(rename('bootstrap-btn-color.' + json.version + '.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function() {
  gulp.src('./dist/bootstrap-btn-color.' + json.version + '.js')
    .pipe(uglify())
    .pipe(rename('bootstrap-btn-color.' + json.version + '.min.js'))
  .pipe(gulp.dest('./dist'));
});