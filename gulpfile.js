var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('lint', function() {

  return gulp.src([
    'lib/*.js',
    'test/*.js'
  ]).pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('test', function() {

  return gulp.src('test/*.js', {read: false})
    .pipe(mocha())
    .once('error', function(err) {
      console.error(err);
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });

});

gulp.task('default', ['lint', 'test']);
