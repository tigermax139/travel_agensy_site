const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require("gulp.spritesmith");
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

/****************************************************************/
/************************ STATIC SERVER ************************/
/**************************************************************/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
});

gulp.watch('build/**/*').on('change', browserSync.reload);

/****************************************************************/
/************************ TEMPLATES COMPILE ********************/
/**************************************************************/
gulp.task('template:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/****************************************************************/
/************************ STYLE COMPILE ************************/
/**************************************************************/
gulp.task('style:compile', function () {
    return gulp.src('source/css/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/style'))
});


/**********************************************************/
/************************ SPRITES ************************/
/********************************************************/
gulp.task('sprite', function () {
    const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/img'));
    spriteData.css.pipe(gulp.dest('source/css/global'));
    cb();
});

/*************************************************************/
/************************ GULP CLEAN ************************/
/***********************************************************/
gulp.task('clean', function del(cb) {
   return rimraf('build', cb);
});

/*************************************************************/
/************************ FONTS COPY ************************/
/***********************************************************/
gulp.task('copy:fonts', () => {
    return gulp.src('source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/***********************************************************/
/************************ IMG COPY ************************/
/*********************************************************/
gulp.task('copy:img', () => {
    return gulp.src('./source/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

/**************************************************************/
/************************ GULP COPY   ************************/
/************************************************************/
gulp.task('copy', gulp.parallel('copy:fonts','copy:img'));


/************************************************************/
/************************ WATCHERS  ************************/
/**********************************************************/
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/css/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
   'clean',
    gulp.parallel('template:compile','style:compile','copy'),
    gulp.parallel('watch', 'server')
    )
);