var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var cleanCSS = require('gulp-clean-css');

var path = {
    css: ['public/css/*.scss', 'public/css/*.css'],
    js: 'public/js/main.js',
    images: 'public/images/*'
};

var dist = {
    css: 'dist/css/',
    js: 'dist/js/',
    images: 'dist/images/'
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
            appliesTo: { includeExtensions: ['.html'] },
            minify: true
        })
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

gulp.task('watch', function() {
    gulp.watch(path.css,['styles:dev']);
    gulp.watch(path.js,['browserify:dev']);
});

gulp.task('build:dev', ['copy-images', 'styles:dev', 'browserify:dev']);
gulp.task('build:production', ['copy-images', 'styles:production', 'browserify:production']);
gulp.task('build', ['build:dev']);
gulp.task('default', ['build', 'watch']);