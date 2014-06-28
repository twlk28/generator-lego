var gulp = require('gulp'),
    gulpif = require('gulp-if'),
	argv = require('yargs').argv,
	// connect = require('gulp-connect-multi')(),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
	log = console.log;

var paths = {
	scripts: ['src/js/**/*.js'],
	images: ['src/img/**', 'src/slice/**'],
	css: ['src/css/*.css'],
	html: ['src/*.html']
},
	p = +argv.p || 9000,
    env = argv._[0]==='release'?'release':'dev';


log('env: ', env);
gulp.task('conn_src', function(){
	connect.server({
		root: 'src',
		port: p,
		livereload: {
			port: p+1
		}
	})
})

// gulp.task('conn_src', connect.server({
// 	root: ['src'],
// 	port: p,
// 	livereload: {
// 		port: p+1
// 	},
// 	open: {
// 		browser: '/Applications/Google\ Chrome.app'
// 	}
// }))

// gulp.task('conn_dest', connect.server({
//     root: ['dest'],
//     port: 9100,
//     livereload: false,
//     open: {
//         browser: '/Applications/Google\ Chrome.app'
//     }
// }))

gulp.task('html', function(){
    gulp.src(['src/*.html'])
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', gulp.dest('dest')) )
})
gulp.task('css', function(){
    gulp.src('src/css/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', minifyCSS()) )
        .pipe( gulpif(env==='release', gulp.dest('dest/css')) )
})
gulp.task('js', function(){
    gulp.src('src/js/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', uglify()) )
        .pipe( gulpif(env==='release', gulp.dest('dest/js')) )
})
gulp.task('img', function(){
    gulp.src('src/img/**')
        .pipe( gulpif(env==='dev', watch()) )
        .pipe( gulpif(env==='dev', connect.reload()) )
        .pipe( gulpif(env==='release', imagemin({ progressive: true })) )
        .pipe( gulpif(env==='release', gulp.dest('dest/img')) )
})
gulp.task('sass', function(){
	var config = {
		sourceComments : 'map',
		outputStyle : 'compressed'
	}
	gulp.src('src/sass/global.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
})

gulp.task('clean_dest', function(){
    return gulp.src('dest', {read: false})
        .pipe( clean() )
})

gulp.task('watch_sass', function(){
	gulp.src('src/sass/**')
		.pipe(watch())
		.pipe(sass())
        .pipe(gulp.dest('src/css/'));
});

// state: using
// usage1> gulp
// usage2> gulp -p 1234
gulp.task('default', ['conn_src', 'watch_sass', 'js', 'img', 'css', 'html'])

// usage1> gulp release
gulp.task('release', ['clean_dest', 'conn_dest', 'js', 'img', 'css', 'html'])

// zip
gulp.task('zip', function () {
    log('uglify...');
});