const gulp = require("gulp");
const fs = require("fs"); 
const path = require("path");
const packageJson = require("./package.json");

// run polymer analyze to generate documentation
gulp.task("analyze", () => {
  var exec = require("child_process").exec;
  return exec(
    "polymer analyze --input demo/index.html > analysis.json",
    function(error, stdout, stderr) {
      if (error !== null) {
        console.log("exec error: " + error);
      }
    }
  );
});

gulp.task("watch", () => {
  return gulp.watch(["./*.js","./lib/*", "./demo/*"], gulp.series("analyze"));
});

gulp.task("dev", gulp.series("analyze", "watch"));

gulp.task(
  "default",
  gulp.series("analyze")
);