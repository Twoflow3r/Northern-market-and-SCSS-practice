const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify  = require('gulp-uglify');
const del  = require('del');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();


function image() {
    return gulp.src('./dev/images/*')
                 .pipe(imagemin())
                    .pipe(gulp.dest('./build/images'))
                 }  

function styles() {
    return gulp.src('./dev/styles/**/*.scss')
                    .pipe(sass().on('error', sass.logError))
                    .pipe(concat('main.css'))
                    .pipe(autoprefixer({
                        browsers: ['> 0.1%'],
                        cascade: false
                    }))
                    .pipe(cleanCSS({
                        level: 2
                    }))
                    .pipe(gulp.dest('./build/style'))
                    .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src('./dev/scripts/*.js')
                    .pipe(concat('main.js'))
                    .pipe(uglify({
                        toplevel: true
                    }))
                    .pipe(gulp.dest('./build/scripts'))
                    .pipe(browserSync.stream());
}
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./dev/style/**/*.css',styles);
    gulp.watch('./dev/scripts/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}

function clean(){
    return del(['build/*']);
}

gulp.task('scripts', scripts);
gulp.task('styles', styles);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean,
                        gulp.parallel(styles,scripts,image)
                        ));

gulp.task('dev', gulp.series('build', 'watch'));