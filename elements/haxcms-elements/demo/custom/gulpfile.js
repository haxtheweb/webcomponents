// @ts-nocheck
const gulp = require("gulp");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
// copy from the built locations pulling them together
gulp.task("default", () => {
  return gulp
    .src("./build/custom.es6-amd.js")
    .pipe(
      babel({
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta",
          "@babel/plugin-transform-modules-amd",
        ],
        presets: [
          [
            "@babel/env",
            {
              targets: [
                "last 2 Chrome major versions",
                "last 2 ChromeAndroid major versions",
                "last 2 Edge major versions",
                "last 2 Firefox major versions",
                "last 2 Safari major versions",
                "last 2 iOS major versions",
              ],
              useBuiltIns: false,
            },
          ],
        ],
      }),
    )
    .pipe(terser())
    .pipe(gulp.dest("./build/"));
});
