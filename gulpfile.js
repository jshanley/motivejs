var gulp = require('gulp');
var sass = require('gulp-sass');
var gls = require('gulp-live-server');
var runSequence = require('run-sequence');

gulp.task('scss', function() {
  var stream = gulp.src('src/scss/application.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('assets/css'));
  return stream;
})

gulp.task('server', function() {
  var server = gls.static('./', 4000);
  server.start();
  gulp.watch(['./index.html', 'assets/**/*.js', 'assets/**/*.css'], server.notify)
})

gulp.task('watch', function() {
  gulp.watch(['src/scss/*.scss'], ['scss'])
})

gulp.task('build', ['scss'])

gulp.task('serve', function(done) {
  runSequence('build', 'server', 'watch', done);
})

gulp.task('default', ['build']);
