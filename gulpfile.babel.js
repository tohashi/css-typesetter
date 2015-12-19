import gulp from 'gulp';
import fs from 'fs';
import browserify from 'browserify';
import watchify from 'watchify';
import sass from 'gulp-sass';
import webserver from 'gulp-webserver';

function bundle(watch = false) {
  fs.existsSync('dist') || fs.mkdirSync('dist');
  browserify({
    entries: ['src/js/app.js'],
    plugin: [watch ? 'watchify' : null],
    debug: true
  })
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(fs.createWriteStream('dist/bundle.js'));
}

gulp.task('build:js', () => bundle());
gulp.task('build:css', () => {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/'));
});
gulp.task('build', ['build:js', 'build:css']);

gulp.task('watch:js', () => {
  gulp.watch('src/js/**/*.js', () => bundle(true));
});
gulp.task('watch:css', () => {
  gulp.watch('src/scss/**/*.scss', ['build:css']);
});
gulp.task('watch', ['watch:js', 'watch:css'], () => {
  gulp.src('./')
    .pipe(webserver({ port: 3333 }));
});

gulp.task('default', ['build', 'watch']);

