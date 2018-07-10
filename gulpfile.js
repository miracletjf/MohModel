var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function () {
  gulp.src('./css/*.less')
    .pipe(less())
    .pipe(gulp.dest(function (f) {
      console.log(f);
    }))
})

gulp.task('table', function () {
  gulp.src('./module/table/*.less')
    .pipe(less())
    .pipe(gulp.dest('./module/table/'))
});

gulp.task('default', ['less', 'table'], function () {
  gulp.watch('./css/*.less', ['less']);
  gulp.watch('./module/table/*.less', ['table']);
})