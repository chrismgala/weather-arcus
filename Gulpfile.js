"use strict";
const gulp = require('gulp'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    wait = require('gulp-wait'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),
    path = require('path'),
    yargs = require('yargs');

const argv = yargs.argv;
const reload = browserSync.reload;
const root = 'src';
const paths = {
    dist: './dist/',
    scripts: [`${root}/app/**/*.js`,
        `!${root}/app/**/*.routes.js`,
        `!${root}/app/**/*.util.js`,
    ],
    controllers: `${root}/app/controllers/*.js`,
    images: `${root}/app/assets/img/*`,
    styles: [`${root}/app/assets/css/**/*.scss`, `${root}/app/assets/css/*.css`],
    fonts: `${root}/app/assets/font/**`,
    templates: `${root}/app/**/*.html`,
    modules: [
        'jquery/dist/jquery.js',
        'angular/angular.js',
        'angular-ui-router/release/angular-ui-router.js',
        'angular-loading-bar/build/loading-bar.js',
        'angular-messages/angular-messages.js',
        'materialize-css/dist/js/materialize.js',
        'angular-materialize/src/angular-materialize.js',
        'angular-animate/angular-animate.js',
    ],
    static: [`${root}/index.html`, `${root}/server.js`]
};

gulp.task('templates', () => {
    return gulp.src(paths.templates)
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(templateCache({
            root: 'app',
            standalone: true,
            transformUrl: function (url) {
                return url.replace(path.dirname(url), '.');
            }
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('modules', () => {
    return gulp.src(paths.modules.map(item => 'node_modules/' + item))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest(paths.dist + 'app/assets/js/'));
});

gulp.task('styles', () => {
    gulp.src(paths.styles)
        .pipe(wait(500))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.dist + 'app/assets/css'));

    return setTimeout(function () {
        reload({
            stream : false
        });
    }, 1000);
});

gulp.task('scripts', ['modules', 'templates'], () => {
    return gulp.src([
        `${root}/app/**/*.module.js`,
        './templates.js',
        ...paths.scripts
    ])
    .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.deploy, uglify()))
    .pipe(gulp.dest(paths.dist + 'app/assets/js'));
});

gulp.task('config', () => {
    return gulp.src('src/config/**/*')
        .pipe(gulp.dest(paths.dist + 'config'));
});

gulp.task('copy', ['templates', 'styles', 'scripts', 'config'], () => {
    return gulp.src([
            paths.controllers,
            paths.images,
            paths.fonts,
        ...paths.static,
        ], {
            base: 'src'
        })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('browser-sync', ['nodemon'],  () => {
    browserSync.init({
        port: "5000",
        proxy: "http://localhost:8080",
        notify: true,
    });
});

gulp.task('nodemon', ['templates', 'styles', 'scripts', 'config', 'copy'], () => {
    let stream = nodemon({
        script: 'dist/server.js',
        ignore: [
            './node_modules/**',
        ]
    });

    stream
        .on('restart', () => {
            console.log('Restarting app!');
            setTimeout(function () {
                reload({
                    stream : false
                });
            }, 1000);
        })
        .on('crash', () => {
            console.error('App has crashed!\n');
            stream.emit('restart', 10);
        })
});

gulp.task('jshint', () => {
    return gulp.src(['src/app/**/*.js', '!src/app/**/*.spec.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['nodemon', 'browser-sync'], () => {
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch([paths.scripts, paths.templates], ['scripts']);
    gulp.watch(`${root}/config/**/*`, ['config']);
    gulp.watch([`${root}/app/**/*.js`], ['jshint']);
    gulp.watch([paths.controllers, paths.static, paths.images, paths.fonts], ['copy']);
});

gulp.task('default', [
    'templates',
    'styles',
    'modules',
    'scripts',
    'config',
    'jshint',
    'copy',
    'nodemon',
    'browser-sync',
    'watch'
]);