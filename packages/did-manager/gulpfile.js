const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const ts = require('gulp-typescript')
const del = require('del')

const isDev = process.argv[2] === '--dev'

function clean() {
  return del('./dist/**')
}

function buildStyle() {
  return () => {
    return gulp
      .src(['./src/styles/style.scss'], {
        base: './src/'
      })
      .pipe(sass())
      .pipe(gulp.dest(`./dist/`))
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
      .pipe(gulp.dest(`./dist/${dir}`))
  }
}

if (isDev) {
  exports.default = function () {
    gulp.watch(
      './src/**/*.{ts,tsx,scss}',
      gulp.series(
        buildJs('cjs'),
        buildStyle('cjs'),
        buildJs('es'),
        buildStyle('es')
      )
    )
  }
} else {
  exports.default = gulp.series(
    clean,
    buildJs('cjs'),
    buildStyle('cjs'),
    buildJs('es'),
    buildStyle('es')
  )
}
