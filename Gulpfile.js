var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var cleanCSS = require('gulp-clean-css');
var babelify = require("babelify");

var path = {
    css: 'public/css/style.scss',
    js: 'public/js/main.js',
    images: 'public/images/*',
    fonts: 'public/fonts/*'
};

var dist = {
    css: 'dist/css/',
    js: 'dist/js/',
    images: 'dist/images/',
    fonts: 'dist/fonts/'
};

gulp.task('browserify:dev', function() {
    return browserify(path.js)
    .transform(stringify, {
        appliesTo: { includeExtensions: ['.html'] }
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(dist.js));
});

gulp.task('browserify:production', function() {
    return browserify(path.js)
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] }
        })
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(dist.js));
});

gulp.task('styles:dev', function() {
    return gulp.src(path.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest(dist.css));
});
gulp.task('styles:production', function() {
    return gulp.src(path.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss("style.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dist.css));
});
gulp.task('copy-images', function() {
    gulp.src(path.images)
        .pipe(gulp.dest(dist.images));
});

gulp.task('copy-fonts', function() {
    gulp.src(path.fonts)
        .pipe(gulp.dest(dist.fonts));
});

gulp.task('watch', function() {
    gulp.watch(['public/css/*.scss', 'public/css/*.css', 'public/css/**/*.scss'] ,['styles:dev']);
    gulp.watch(['public/js/*', 'public/js/**/*', 'public/templates/*', 'public/templates/**/*'],['browserify:dev']);
});

gulp.task('build:dev', ['copy-images', 'copy-fonts', 'styles:dev', 'browserify:dev']);
gulp.task('build:production', ['copy-images', 'copy-fonts', 'styles:production', 'browserify:production']);
gulp.task('build', ['build:dev']);
gulp.task('default', ['build', 'watch']);