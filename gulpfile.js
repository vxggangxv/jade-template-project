"use strict";
/**
 * 모듈 호출
 * [gulp-if]            - 조건 처리
 * [gulp-rename]        - 파일 이름 변경
 * [gulp-connect]       - 웹 서버
 * [gulp-watch]         - 변경된 파일만 처리
 * [gulp-plumber]       - 오류 발생해도 watch 업무 지속
 * [gulp-open]          - 브라우저 오픈
 * [gulp-jade]          - Jade 컴파일
 * [gulp-html-prettify] - HTML 구조 읽기 쉽게 변경
 * [del]                - 폴더(디렉토리)/파일 제거
 */
var gulp     = require('gulp'),
	gulpif   = require('gulp-if'),
	rename   = require('gulp-rename'),
	connect  = require('gulp-connect'),
	watch    = require('gulp-watch'),
	plumber  = require('gulp-plumber'),
	open     = require('gulp-open'),
	jade     = require('gulp-jade'),
	prettify = require('gulp-html-prettify'),
	del      = require('del'),

	// 환경설정 config.json
	config   = require('./config.json');

// Jade & CSS 경로 설정
var cssSrc   = config.output+'/css/*.css';
// 밑줄 기호(_)가 붙은 파일은 컴파일 대상에서 제외.
var jadeSrc  = config.input+'/jade/**/!(_)*.jade';
// 부품(Parts) 폴더 _*.jade 파일 주소
var jadePartsSrc = config.input+'/jade/parts/_*.jade';

/**
 * Gulp 업무(Tasks) 정의
 */
// 기본 업무
gulp.task('default', ['jade', 'css', 'connect', 'open', 'watch']);

// 관찰 업무
gulp.task('watch', function () {
	watch([jadeSrc, jadePartsSrc], function () {
		gulp.start('jade');
	});
}); 

// 웹 서버 업무 (LiveReload 사용)
gulp.task('connect', function() {
	connect.server({
		root: config.output,
		port: config.port,
		livereload: config.livereload
	});
});
// 브라우저 오픈 업무
gulp.task('open', function() {
	var options = {
		url: 'http://localhost:'+config.port, 
		app: config.browser // chrome, firefox, iexplore, opera, safari
	};
	gulp.src(config.output+'/index.html')
		.pipe(open('<%file.path%>', options));
});

// CSS 변경 내용, 자동 갱신(업데이트)
gulp.task('css', function() {
	gulp.src(cssSrc)
		.pipe(watch(cssSrc))
		.pipe(connect.reload());
});
// Jade 컴파일
gulp.task('jade', function() {
	gulp.src(jadeSrc)
		.pipe(plumber())
		.pipe(jade())
		.pipe(prettify(config.html_prettify))
		.pipe(gulp.dest(config.output))
		.pipe(connect.reload());
});