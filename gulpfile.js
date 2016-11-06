'use strict';

const gulp = require('gulp'),

    // Mixed
    ext_replace = require('gulp-ext-replace'),

    //Prevent pipe breaking caused by errors from gulp plugins
    plumber = require('gulp-plumber'),

    // CSS
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    precss = require('precss'),
    sass = require('gulp-scss'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),

    // JS & TS
    js_uglify = require('gulp-uglify'),
    ts = require('gulp-typescript'),

    //Images
    imgMin = require('gulp-imagemin'),

    // Assets develop root path
    assetsDev = './assets/',
    // Assets product root path
    assetsProd = './src/',
    appDev = './dev/',
    appProd = './app/',

    tsProject = ts.createProject('tsconfig.json'),

    devPaths = {
        scss: [assetsDev + 'scss/**/*.scss', '!' + assetsDev + 'scss/**/_*.scss'],
        img: assetsDev + 'img/**/*.{gif,jpeg,jpg,png}',
        ts: appDev + '**/*.ts',
        html: assetsDev + '**/*.html'
    };

gulp.task('build-css', () => {
    var processors = [
        precss,
        autoprefixer,
        cssnano
    ];

    return gulp.src(devPaths.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(ext_replace('.css'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(assetsProd + 'css/'))
});

gulp.task('build-ts', () => {
    return gulp.src(devPaths.ts)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        //.pipe(js_uglify())
        .pipe(gulp.dest(appProd))
});

gulp.task('build-img', () => {
    return gulp.src(devPaths.img)
        .pipe(imgMin({
            progressive: true
        }))
        .pipe(gulp.dest(assetsProd + 'img/'))
});

gulp.task('build-html', () => {
    return gulp.src(devPaths.html)
        .pipe(gulp.dest(assetsProd + 'views/'))
});

gulp.task('watch', () => {
    gulp.watch(devPaths.ts, ['build-ts']);
    gulp.watch(devPaths.scss, ['build-css']);
    gulp.watch(devPaths.img, ['build-img']);
});

gulp.task('default', ['build-ts', 'build-css', 'watch']);