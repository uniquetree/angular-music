/**
 * Created by 郑树聪 on 2016/2/13.
 */
var gulp = require('gulp');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

var webpack = require('webpack-stream');

// 清理任务
gulp.task('clean', function(){

    return gulp.src(['./app/libs/', './app/styles/', './app/scripts/', './app/images/'], {read: false})
        .pipe(clean())
        .pipe(notify({ message: 'Clean task complete' }));
});

gulp.task('copy', function(){
    gulp.src('./bower_components/angular/angular.min.js')
        .pipe('./app/libs/');
    //gulp.src('./bower_components/angular/angular.min.js')
    //    .pipe('./app/libs/');
});

// 图片处理任务
gulp.task('image', function(){

    return gulp.src('./src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./app/images/'))
        .pipe(notify({ message: 'Images task complete' }));
});

// 样式处理任务,编译/压缩/合并
gulp.task('sass', function () {

    // app页面的样式文件
    gulp.src('./src/styles/app/**/*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/styles/'))
        .pipe(notify({ message: 'App-Styles task complete' }));
    // admin页面的样式文件
    gulp.src('./src/styles/admin/**/*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('admin.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/styles/'))
        .pipe(notify({ message: 'Admin-Styles task complete' }));
});

// js脚本处理任务,这里进行webpack处理
gulp.task('script', ['image', 'sass'], function(){

    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./app/scripts/'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 默认任务,开发环境
gulp.task('default', ['clean', 'image', 'sass', 'script'], function(){

    gulp.watch('./src/images/**/*', ['image']);

    gulp.watch('./src/styles/**/*.scss', ['sass']);

    gulp.watch('./src/scripts/**/*.js', ['script']);

    livereload.listen();
    gulp.watch(['./app/**/*']).on('change', livereload.changed);
});

// 发布版本时执行此任务
gulp.task('publish', function(){

    return gulp.run(['clean', 'image', 'sass', 'script']);
});
