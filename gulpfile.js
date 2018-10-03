const gulp = require("gulp");
const concat = require("gulp-concat-util");
// merge the web component factory libraries the user has installed
gulp.task("default", () => {
  return gulp
    .src("../../templates/libraries/**/package.json")
    .pipe(
      concat(".wcflibcache.json", {
        process: function(src, filePath) {
          return src + ",";
        }
      })
    )
    .pipe(concat.header("["))
    .pipe(concat.footer("{}]"))
    .pipe(gulp.dest("./"));
});
