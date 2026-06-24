const gulp = require("gulp");
const fs = require("fs"); 
const path = require("path");
const packageJson = require("./package.json");


gulp.task("watch", () => {
  return gulp.watch(["./*.js","./lib/*", "./demo/*"]);
});

// simple developer flow
gulp.task("dev", gulp.series("watch"));

gulp.task("default", gulp.series("dev"));
