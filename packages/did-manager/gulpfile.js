const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const ts = require('gulp-typescript')
const rename = require('gulp-rename')
const del = require('del')
const path = require('path')
const tsconfig = require('./tsconfig.json')

const isDev = process.argv[2] === '--dev'

function clean() {
  return del('./lib/**')
}

function buildStyle() {
  return gulp
    .src(['./src/**/*.scss'], {
      base: './src/'
    })
    .pipe(sass())
    .pipe(gulp.dest('./lib/'))
}

function copyAssets() {
  return gulp.src('./src/assets/**/*').pipe(gulp.dest('./lib/assets'))
}

function buildJs() {
  return gulp
    .src(['./src/**/*.{ts,tsx}'])
    .pipe(
      ts({
        target: 'esnext',
        module: 'commonjs',
        declaration: true,
        jsx: 'react-jsx',
        skipLibCheck: true,
        moduleResolution: 'node'
      })
    )
    .pipe(gulp.dest('./lib'))
}

if (isDev) {
  exports.default = function () {
    gulp.watch(
      './src/**/*.{ts,tsx,scss}',
      gulp.series(buildJs, buildStyle, copyAssets)
    )
  }
} else {
  exports.default = gulp.series(clean, buildJs, buildStyle, copyAssets)
}
