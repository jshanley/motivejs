var gulp = require('gulp');
var sass = require('gulp-sass');
var gls = require('gulp-live-server');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var minifyCss = require('gulp-minify-css');

gulp.task('scss', function() {
  var stream = gulp.src('src/scss/application.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('assets/css'));
  return stream;
})

gulp.task('css:vendor', function() {
  var stream = gulp.src([
    './node_modules/highlight.js/styles/github.css'
  ])
    .pipe(concat('vendor.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('assets/css'))
})

gulp.task('browserify:highlightjs', function() {
  var stream = browserify('./browserify-builds/highlightjs.build.js')
    .bundle()
    .pipe(source('highlight.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
  return stream;
})

gulp.task('browserify', ['browserify:highlightjs'])

gulp.task('server', function() {
  var server = gls.static('./', 4000);
  server.start();
  gulp.watch(['./index.html', 'assets/**/*.js', 'assets/**/*.css'], server.notify)
})

gulp.task('watch', function() {
  gulp.watch(['src/scss/*.scss'], ['scss'])
})

gulp.task('build', ['scss', 'css:vendor', 'browserify'])

gulp.task('serve', function(done) {
  runSequence('build', 'server', 'watch', done);
})

gulp.task('default', ['build']);
