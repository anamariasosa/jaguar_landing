var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


/*
  Open the browser in the port 9000.
  if the html file or js file changes,
  reload the browser.
*/
gulp.task('browser-sync', function() {
  browserSync.init({
    notify: false,
    open: true,
    port: 9000,
    server: { baseDir: "./dist" },
  });

  gulp.watch(['dist/*.html'])
    .on('change', browserSync.reload);


});

/*
  Convert SASS to CSS
  after that, send the convert file to styles(dist/style) folder.
*/
gulp.task('sass', function () {
  return plugins.rubySass('app/sass/main.scss', {
      style: 'expanded',
      lineNumbers: true
  })
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.reload({stream: true}));
});

/*
  Convert Jade to HTML
  then send to distribution(dist) folder.
  Notify if you have sintax errors
*/
gulp.task('views', function () {
  return gulp.src('app/views/*.jade')
    .pipe(plugins.jade({ pretty: true }))
    .on('error', plugins.notify.onError(function (err) { console.log(err.message); return "💔 Jade Error "; }))
    .pipe(gulp.dest('dist'))
});


// Listen the changes in the jade, scss
gulp.task('watch', function () {
  gulp.watch(['./app/*.jade'], ['views']);
  gulp.watch(['./app/views/**/*.jade'], ['views']);
  gulp.watch(['./app/sass/**/*.scss'], ['sass']);

});

gulp.task("default", ["browser-sync", "views", "sass", "watch"]);