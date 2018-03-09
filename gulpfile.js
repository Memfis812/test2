'use strict';

const gulp = require('gulp');
const mincss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const prefixer = require('gulp-autoprefixer');
const rigger = require('gulp-rigger');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const browserSync = require("browser-sync");
const del = require('del');
const reload = browserSync.reload;
const cssbeautify = require('gulp-cssbeautify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require( 'gulp-notify' );
const sourcemaps = require('gulp-sourcemaps');

let path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*js',
    css: 'src/css/*.scss',
    img: 'src/img/**/*.*'
  },
  watch: { 
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    css: 'src/css/**/*.scss',
    img: 'src/img/**/*.*',
  }
};

let config = {
  server: {
      baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 7070,
  logPrefix: "app-build"
};

gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html)) 
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
  return gulp.src(path.src.css)
    .pipe(sass().on('error', notify.onError({
      message: "<%= error.message %>",
      title  : "Sass Error!"
    })))
    .pipe(prefixer())
    .pipe(mincss())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
  return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  return gulp.src(path.src.img) 
    .pipe(imagemin({ 
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
      gulp.start('html:build');
  });
  watch([path.watch.css], function(event, cb) {
      gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
      gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
});

gulp.task('del', function() {
  return del('build/**/*.*');
});

gulp.task('build', ['html:build', 'style:build', 'js:build', 'image:build']);

gulp.task('server', function () {
  browserSync(config);
});

gulp.task('default', ['build', 'server', 'watch']);



