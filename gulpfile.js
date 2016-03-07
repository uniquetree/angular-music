/**
 * Created by 郑树聪 on 2016/2/13.
 */
var gulp = require('gulp');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var minifyHtml = require("gulp-minify-html");
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var del = require('del');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
// 加载bower引入的框架插件
var wiredep = require('gulp-wiredep');
var mainBowerFiles = require('main-bower-files');
// 在gulp中配合webpack
var webpack = require('webpack-stream');

// 清理任务
gulp.task('clean', function(){

    del.sync(['./app/libs', './app/views', './app/fonts', './app/styles', './app/scripts', './app/images'], {force: true});
});

// 在html文件中引入bower加载的框架及插件
gulp.task('bower', function(){

    return gulp.src('./src/index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./app/views'))
        .pipe(notify({ message: 'Bower task complete' }));
});
gulp.task('bower:copy', function(){
    return gulp.src(mainBowerFiles(), {
            base: './bower_components'
        })
        .pipe(gulp.dest('./app/libs'))
        .pipe(notify({ message: 'MainBowerFiles task complete' }));
});

// 图片处理任务
gulp.task('image', function(){

    return gulp.src('./src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./app/images/'))
        .pipe(notify({ message: 'Images task complete' }));
});

// html处理任务
gulp.task('html', function(){

    return gulp.src('./src/views/**/*.html')
        //.pipe(minifyHtml())
        .pipe(gulp.dest('./app/views/'));
});

// 样式处理任务,编译/压缩/合并
gulp.task('sass', function () {

    // app页面的样式文件
    return gulp.src('./src/components/**/*.scss')
        .pipe(concat('app.scss'))
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        //.pipe(minifycss())
        .pipe(gulp.dest('./app/styles/'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// js脚本处理任务,这里进行webpack处理
gulp.task('script', function(){

    var jsFilter = gulpFilter('**/*.js', {restore: true});
    var fontFilter = gulpFilter('fonts/*', {restore: true});
    var cssFilter = gulpFilter('**/*.css', {restore: true});

    return gulp.src('./src/components/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(jsFilter)
        //.pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./app/scripts/'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(rename({ suffix: '.min' }))
        //.pipe(minifycss())
        .pipe(gulp.dest('./app/styles/'))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(gulp.dest('./app/'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 默认任务,开发环境
gulp.task('default', ['clean', 'image', 'html', 'sass', 'script'], function(){

    //gulp.watch('./bower.json', ['bower']);

    gulp.watch('./src/views/**/*.html', ['html']);

    gulp.watch('./src/images/**/*', ['image']);

    //gulp.watch('./src/components/**/*.scss', ['sass']);

    gulp.watch('./src/components/**/*.js', ['script']);

    livereload.listen();
    gulp.watch(['./app/**/*']).on('change', livereload.changed);
});

// 发布版本时执行此任务
gulp.task('publish', function(){

    return gulp.run(['clean', 'image', 'html', 'sass', 'script']);
});
