const gulp = require("gulp");
const fs = require("fs");
const path = require("path");

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
  return gulp.watch("./*.js", gulp.series("analyze"));
});

// simple developer flow
gulp.task("dev", gulp.series("analyze", "watch"));

// walk the tree and build the icon structure
function dirTree(filename) {
  var stats = fs.lstatSync(filename),
      info;
  // go deeper for the directory as it's got yummy icons
  if (stats.isDirectory()) {
    info = {
      name: path.basename(filename),
      path: filename,
      icons: fs.readdirSync(filename).map(function(child) {
        return dirTree(filename + '/' + child);
      })
    };
  }
  // sniff for svg's
  else if (path.basename(filename).includes('.svg')) {
    info = path.basename(filename).replace('.svg','');
  }
  return info;
}

// discover iconset and build json structure
gulp.task("iconset", (done) => {
  const path = "./lib/svgs";
  const jsonContent = JSON.stringify(dirTree(path).icons, null, 2);  
  fs.writeFile("./lib/iconsets.json", jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
      console.log("JSON file has been saved.");
      return true;
  });
  done();
});
gulp.task("default", gulp.series("analyze", "iconset"));