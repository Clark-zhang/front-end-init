//general
var gulp = require('gulp');
var options = require('gulp-options');
var removeFiles = require('gulp-remove-files');
//css
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
let minifyCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
//js
var concat = require('gulp-concat');
var gp_rename = require('gulp-rename')
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compileCss', function() {
    //remove existing bundle.css
    gulp.src('./dist/css/bundle.css')
        .pipe(removeFiles());

    //compile sass
    gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'));


    //compile sprite
    gulp.src('./src/images/icons/*.png')
        .pipe(
            spritesmith({
                retinaSrcFilter: ['./src/images/icons/*@2x.png'],
                imgName: 'sprite.png',
                retinaImgName: 'sprite@2x.png',
                // imgName: 'sprite' + '-' + timestamp + '.png',
                // retinaImgName: 'sprite@2x' + '-' + timestamp + '.png',
                imgPath: '../images/sprite.png',
                retinaImgPath: '../images/sprite@2x.png',
                cssName: '../css/sprite.css',
                hash: true,
                })
            )
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('minifyCss', function(){
    if (options.has('dev')) {
        //concat css
        gulp.src('./dist/css/*.css')
            .pipe(concatCss("bundle.css"))
            .pipe(gulp.dest('./dist/css'));
    } else {
        //concat css
        //minify css
        gulp.src('./dist/css/*.css')
            .pipe(concatCss("bundle.css"))
            .pipe(minifyCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('./dist/css'));
    }
})

gulp.task('compileJs', function() {
    //remove existing bundle.js
    gulp.src(['./dist/js/bundle.js', './dist/js/concat.js'])
        .pipe(removeFiles());

    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
})

gulp.task('minifyJs', function(cb) {
    if (options.has('dev')) {
         return gulp.src('./dist/js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'));
    } else {
         return gulp.src('./dist/js/*.js')
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(gp_rename('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
    }
})

//Watch task
gulp.task('watch',function() {
    //css
    gulp.watch('./src/scss/**/*.scss',['compileCss']);
    gulp.watch('./src/images/*.png',['compileCss']);
    gulp.watch('./dist/css/*.css',['minifyCss']);

    //js
    gulp.watch('./src/js/*.js',['compileJs']);
    gulp.watch('./dist/js/*.js',['minifyJs']);
});


//compiel all
//might not work for minifyJs, as it take a long time
gulp.task('compile',function() {
    //css
    gulp.start('compileCss');
    gulp.start('minifyCss');

    //js
    gulp.start('compileJs');
    gulp.start('minifyJs');
});