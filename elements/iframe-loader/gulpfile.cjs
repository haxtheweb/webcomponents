const gulp = require("gulp");
const fs = require("fs");
const path = require("path");

const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const decomment = require("decomment");
const packageJson = require("./package.json");
// merge all the src files together
gulp.task("merge", () => {
  return gulp
    .src("./src/" + packageJson.wcfactory.elementName + ".js")
    .pipe(
      replace(
        /\/\* REQUIRED FOR TOOLING DO NOT TOUCH \*\//g,
        (classStatement, character, jsFile) => {
          // pull these off the package wcfactory files area
          let html = fs
            .readFileSync(path.join("./", packageJson.wcfactory.files.html))
            .toString()
            .trim();
          html = decomment(html);
          let haxString = "";
          if (packageJson.wcfactory.useHAX) {
            let HAXProps = fs.readFileSync(
              path.join("./", packageJson.wcfactory.files.hax)
            );
            haxString = `
  // haxProperty definition
  static get haxProperties() {
    return ${HAXProps};
  }`;
          }
          let props = "{}";
          props = fs.readFileSync(
            path.join("./", packageJson.wcfactory.files.properties)
          );
          let cssResult = "<style>";
          if (
            packageJson.wcfactory.useSass &&
            packageJson.wcfactory.files.scss
          ) {
            // we don't support scss anymore
          } else if (packageJson.wcfactory.files.css) {
            cssResult += fs.readFileSync(
              path.join("./", packageJson.wcfactory.files.css)
            );
          }
          cssResult += "</style>";
          cssResult = stripCssComments(cssResult).trim();
          return `
  // render function
  render() {
    return html\`
${cssResult}
${html}\`;
  }
${haxString}
  // properties available to the custom element for data binding
  static get properties() {
    let props = ${props};
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }`;
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

gulp.task("watch", () => {
  return gulp.watch("./src/*", gulp.series("merge", "analyze"));
});

// simple developer flow
gulp.task("dev", gulp.series("merge", "analyze", "watch"));

gulp.task("default", gulp.series("merge", "analyze"));
