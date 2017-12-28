const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require("gulp.spritesmith");
const rimraf = require('rimraf');
const rename = require('gulp-rename');

/****************************************************************/
/************************ STATIC SERVER ************************/
/**************************************************************/
gulp.task('browser-sync', function() {
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
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.scss'))
        .pipe(gulp.dest('build/style'));
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
gulp.watch('source/template/**/*.pug', gulp.series('template:compile'));
gulp.watch('source/style/**/*.scss', gulp.series('style:compile'));

gulp.task('default', gulp.series(
   'clean',
    gulp.parallel('template:compile','style:compile','sprite','copy'),
    gulp.parallel('watch', 'server')
    )
);