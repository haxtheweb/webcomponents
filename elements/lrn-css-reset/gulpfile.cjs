const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const decomment = require("decomment");
const packageJson = require("./package.json");
// merge all the src files together
gulp.task("css", (done) => {
  let cssResult = "";
  if (packageJson.wcfactory.files.css) {
    cssResult += fs.readFileSync(
      path.join("./", packageJson.wcfactory.files.css)
    );

    cssResult = stripCssComments(cssResult).replace(/[\n\r]/g,'').replace(/\s+/g,' ').replace(/\s?([:\{\}\,\;])\s?/g,'$1').trim();
    fs.writeFile(`./${packageJson.wcfactory.elementName}.min.css`, cssResult, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing CSS file.");
        return console.log(err);
      }
      console.log("CSS file has been saved.");
      return true;
    });
  } else {
    console.log("No CSS File");
  }
  done();
});

gulp.task("merge", () => {
  return gulp
    .src("./src/" + packageJson.wcfactory.elementName + ".js")
    .pipe(
      replace(
        /\/\* REQUIRED FOR TOOLING DO NOT TOUCH \*\//g,
        (classStatement, character, jsFile) => {
          if (!packageJson.wcfactory.files.css) {
            return false;
          }
          let cssResult = "";
          if (packageJson.wcfactory.files.css) {
            cssResult += fs.readFileSync(
              path.join("./", packageJson.wcfactory.files.css)
            );
          }

          cssResult = stripCssComments(cssResult).trim();
          return cssResult;
        }
      )
    )
    .pipe(gulp.dest("./"));
});
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
// copy from the built locations pulling them together
gulp.task("compile", () => {
  return gulp
    .src("./" + packageJson.wcfactory.elementName + ".js")
    .pipe(
      replace(
        /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)(\.js['"];)$/gm,
        "$1$2.umd$3"
      )
    )
    .pipe(
      rename({
        suffix: ".umd"
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("watch", () => {
  return gulp.watch("./src/*", gulp.series("merge", "analyze"));
});

gulp.task("dev", gulp.series("css","merge", "analyze", "watch"));

// discover iconset and build json structure
gulp.task("iconset", (done) => {
  const iconset = packageJson.wcfactory.iconset || {};
  if(iconset.svgsPath && iconset.svgsPath !== ''){
    const path = iconset.svgsPath;
    const manifestFilename = iconset.manifestFilename || `${packageJson.wcfactory.elementName}-iconsets-manifest.js`
    const manifestPath = iconset.manifestPath || `./lib`;
    const exportName = iconset.exportName || `${packageJson.wcfactory.className}IconsetsManifest`;
    const jsonContent = JSON.stringify(dirTree(path).icons, null, 2); 
    const iconVar =  `export const ${exportName} = ${jsonContent};`
    fs.writeFile(`${manifestPath}/${manifestFilename}.js`, iconVar, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing iconset manifest Object to File.");
            return console.log(err);
        }
        console.log("Iconset SVGs and manifest JS file has been saved.");
        return true;
    });
  } else {
    console.log("No Iconset Manifest");
  }
  done();
});

gulp.task(
  "default",
  gulp.series("merge", "analyze", "compile")
);