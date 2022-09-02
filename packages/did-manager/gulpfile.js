const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const ts = require('gulp-typescript')
const del = require('del')

const isDev = process.argv[2] === '--dev'

function clean() {
  return del('./libs/**')
}

function buildStyle(dir) {
  return () => {
    return gulp
      .src(['./src/**/*.scss'], {
        base: './src/'
      })
      .pipe(sass())
      .pipe(gulp.dest(`./libs/${dir}`))
  }
}

function copyAssets(dir) {
  return () => {
    return gulp
      .src('./src/assets/**/*')
      .pipe(gulp.dest(`./libs/${dir}/assets/`))
  }
}

function buildJs(dir) {
  const module = dir === 'cjs' ? 'commonjs' : 'es2020'
  return () => {
    return gulp
      .src(['./src/**/*.{ts,tsx}'])
      .pipe(
        ts({
          target: 'es2020',
          module,
          declaration: true,
          jsx: 'react-jsx',
          skipLibCheck: true,
          moduleResolution: 'node'
        })
      )
      .pipe(gulp.dest(`./libs/${dir}`))
  }
}

if (isDev) {
  exports.default = function () {
    gulp.watch(
      './src/**/*.{ts,tsx,scss}',
      gulp.series(
        buildJs('cjs'),
        buildStyle('cjs'),
        copyAssets('cjs'),
        buildJs('es'),
        buildStyle('es'),
        copyAssets('es')
      )
    )
  }
} else {
  exports.default = gulp.series(
    clean,
    buildJs('cjs'),
    buildStyle('cjs'),
    copyAssets('cjs'),
    buildJs('es'),
    buildStyle('es'),
    copyAssets('es')
  )
}
