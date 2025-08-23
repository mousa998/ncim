// Gulpfile.js
import * as sass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import browserSync from "browser-sync";
import fileInclude from "gulp-file-include";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";
import pngquant from "imagemin-pngquant";
import svgo from "imagemin-svgo";
import newer from "gulp-newer";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import cached from "gulp-cached";
import { deleteAsync } from "del";
import dependents from "gulp-dependents";
import gulp from "gulp";
const { src, dest, series, parallel, watch } = gulp;

import autoprefixer from "gulp-autoprefixer";
import replace from "gulp-replace";

const compiledSass = gulpSass(sass);
const server = browserSync.create();

// Detect environment
const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.BASE_PATH || ""; // get from Actions
const basePath = isProd ? repoName : "/";

// Configuration
const config = {
  src: {
    html: "src/html/**/*.html",
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.js",
    images: "src/images/**/*.{jpg,jpeg,png,gif,svg,webp}",
    fonts: "src/fonts/**/*",
    videos: "src/videos/**/*",
    vendors: "src/vendors/**/*",
  },
  dist: {
    base: "dist",
    css: "dist/css",
    js: "dist/js",
    images: "dist/images",
    fonts: "dist/fonts",
    videos: "dist/videos",
    vendors: "dist/vendors",
  },
};

// Clean dist folder
export function clean() {
  return deleteAsync([config.dist.base]);
}

// HTML processing with base path injection
export function html() {
  return gulp
    .src(config.src.html)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(replace("{{basePath}}", basePath))
    .pipe(gulp.dest(config.dist.base))
    .pipe(server.stream());
}

/* =====================
   SCSS TASKS
===================== */
export function stylesDev() {
  return src(config.src.scss, { sourcemaps: !isProd })
    .pipe(cached("scss"))
    .pipe(dependents())
    .pipe(
      compiledSass({ outputStyle: "expanded" }).on(
        "error",
        compiledSass.logError
      )
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(dest(config.dist.css, { sourcemaps: isProd ? false : "." }))
    .pipe(server.stream());
}

export function stylesProd() {
  return src("src/scss/styles.scss", { sourcemaps: false })
    .pipe(dependents())
    .pipe(
      compiledSass({
        loadPaths: ["node_modules"],
        outputStyle: "compressed",
      }).on("error", compiledSass.logError)
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(config.dist.css));
}

/* =====================
   JS TASKS
===================== */
export function scriptsDev() {
  return gulp
    .src(config.src.js, { sourcemaps: true })
    .pipe(cached("js"))
    .pipe(gulp.dest(config.dist.js, { sourcemaps: "." }))
    .pipe(server.stream());
}

export function scriptsProd() {
  return gulp
    .src(config.src.js)
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(config.dist.js));
}

/* =====================
   IMAGE TASKS
===================== */
export function images() {
  return gulp
    .src(config.src.images)
    .pipe(newer(config.dist.images))
    .pipe(
      imagemin(
        [
          mozjpeg({ quality: 80, progressive: true }),
          pngquant({
            quality: [0.7, 0.9],
            speed: 1,
          }),
          svgo({
            plugins: [
              { name: "removeViewBox", active: true },
              // Remove the problematic plugins
            ],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(gulp.dest(config.dist.images))
    .pipe(server.stream());
}
/* =====================
   COPY TASKS
===================== */
export function fonts() {
  return gulp.src(config.src.fonts).pipe(gulp.dest(config.dist.fonts));
}

export function videos() {
  return gulp.src(config.src.videos).pipe(gulp.dest(config.dist.videos));
}

export function vendors() {
  return gulp.src(config.src.vendors).pipe(gulp.dest(config.dist.vendors));
}

/* =====================
   SERVER + WATCH
===================== */
export function serve() {
  server.init({
    server: {
      baseDir: config.dist.base,
      index: "index.html",
    },
    notify: false,
  });

  gulp.watch(config.src.html, html);
  gulp.watch(config.src.scss, stylesDev);
  gulp.watch(config.src.js, scriptsDev);
  gulp.watch(config.src.images, images);
  gulp.watch(config.src.fonts, fonts);
  gulp.watch(config.src.videos, videos);
  gulp.watch(config.src.vendors, vendors);
}

/* =====================
   TASK SEQUENCES
===================== */
export const build = gulp.series(
  clean,
  gulp.parallel(html, stylesProd, scriptsProd, images, fonts, videos, vendors)
);

export const dev = gulp.series(
  clean,
  gulp.parallel(html, stylesDev, scriptsDev, images, fonts, videos, vendors),
  serve
);

export default dev;
