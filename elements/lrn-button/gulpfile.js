const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const decomment = require("decomment");
const sourcemaps = require("gulp-sourcemaps");
const packageJson = require("./package.json");
// merge all the src files together
gulp.task("merge", () => {
  return gulp
    .src("./src/" + packageJson.wcfactory.elementName + ".js")
    .pipe(
    replace(/extends\s+PolymerElement\s+{/g, (classStatement, character, jsFile) => {
        // extract the templateUrl and styleUrl with regex.  Would prefer to do
        // this by require'ing lrn-button.js and asking it directly, but without
        // node.js support for ES modules, we're stuck with this.
        const oneLineFile = jsFile.slice(character).split("\n").join(" ");
        const [
          ,
          templateUrl
        ] = /templateUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );

        let html = fs
          .readFileSync(path.join("./src", templateUrl))
          .toString()
          .trim();

        html = decomment(html);
        let props = {};
        // pull properties off of the file location
        const [
          ,
          propertiesUrl
        ] = /propertiesUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        props = fs.readFileSync(path.join("./src", propertiesUrl));
        // pull together styles from url
        const [
          ,
          styleUrl
        ] = /styleUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        const styleFilePath = path.join("./src", styleUrl);
        let cssResult = fs.readFileSync(styleFilePath);
        cssResult = stripCssComments(cssResult).trim();
        return `${classStatement}
  static get template() {
    return html\`
<style>
${cssResult}
</style>
${html}\`;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return ${props};
  }`;
      })
    )
    .pipe(gulp.dest("./"));
});
// run polymer build to generate everything fully
gulp.task("build", () => {
  const spawn = require("child_process").spawn;
  let child = spawn("polymer", ["build"]);
  return child.on("close", function (code) {
    console.log("child process exited with code " + code);
  });
});
// run polymer analyze to generate documentation
gulp.task("analyze", () => {
  var exec = require('child_process').exec;
  return exec('polymer analyze --input demo/index.html > analysis.json',
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
});
// copy from the built locations pulling them together
gulp.task("compile", () => {
  // copy outputs
  gulp.src("./build/es6/" + packageJson.wcfactory.elementName + ".js").pipe(gulp.dest("./"));
  gulp.src("./build/es5-amd/" + packageJson.wcfactory.elementName + ".js")
    .pipe(
      rename({
        suffix: ".amd"
      })
    )
    .pipe(gulp.dest("./"));
  return gulp.src("./" + packageJson.wcfactory.elementName + ".js")
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
  return gulp.watch(
    "./src/*",
    gulp.series("merge", "analyze")
  );
});

// shift build files around a bit and build source maps
gulp.task("sourcemaps", () => {
  gulp
    .src("./" + packageJson.wcfactory.elementName + ".amd.js")
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("./"));
  return gulp
    .src("./" + packageJson.wcfactory.elementName + ".js")
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("./"));
});

gulp.task("dev", gulp.series("merge", "analyze", "watch"));

gulp.task("default", gulp.series("merge", "analyze", "build", "compile", "sourcemaps"));