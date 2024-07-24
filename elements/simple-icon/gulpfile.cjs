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
          let rawprops = "{}";
          rawprops = fs.readFileSync(
            path.join("./", packageJson.wcfactory.files.properties)
          );
          let props = `${rawprops}`,
            comma = props
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\/\/.*/g, "")
              .replace(/[\{\s\n\}]/g, "");
          (props = props.replace(/\"type\": \"(\w+)\"/g, '"type": $1')),
            (superprops =
              comma === "" ? `...super.properties` : `...super.properties,`);
          props = props.replace(/\{([\s\n]*)/, `{$1$1${superprops}$1$1`);
          let cssResult = "";
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

          cssResult = stripCssComments(cssResult).trim();
          let litResult =
              packageJson.wcfactory.customElementClass !== "LitElement"
                ? ``
                : `
  //styles function
  static get styles() {
    return  [
      ${
        packageJson.wcfactory.sharedStyles &&
        packageJson.wcfactory.sharedStyles.length > 0
          ? `${packageJson.wcfactory.sharedStyles.join(",")},`
          : ``
      }
      css\`
${cssResult}
      \`
    ];
  }`,
            styleResult =
              packageJson.wcfactory.customElementClass !== "LitElement"
                ? `<style>
${cssResult}
        </style>`
                : ``;

          return `${litResult}

// render function
  render() {
    return html\`
${styleResult}
${html}\`;
  }
${haxString}
  // properties available to the custom element for data binding
  static get properties() {
    return ${props};
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

// walk the tree and build the icon structure
function dirTree(filename) {
  var stats = fs.lstatSync(filename),
      info;
  // go deeper for the directory as it's got yummy icons
  if (stats.isDirectory()) {
    info = {
      name: path.basename(filename),
      icons: fs.readdirSync(filename).map(function(child) {
        return dirTree(filename + '/' + child);
      })
    };
  }
  // sniff for svg's
  else if (path.basename(filename).includes('.svg')) {
    info = path.basename(filename).replace('.svg','');
  }
  else {
    info = {
      name: path.basename(filename),
      icons: []
    };
  }
  return info;
}

// discover iconset and build json structure
gulp.task("iconset", (done) => {
  const iconset = packageJson.wcfactory.iconset || {};
  if(iconset.svgsPath && iconset.svgsPath !== ''){
    const path = iconset.svgsPath;
    const manifestFilename = iconset.manifestFilename || `${packageJson.wcfactory.elementName}-iconsets-manifest`
    const manifestPath = iconset.manifestPath || `./lib`;
    const exportName = iconset.exportName || `${packageJson.wcfactory.className}IconsetsManifest`;
    const jsonContent = JSON.stringify(dirTree(path).icons, null, 2); 
    const iconVar =  `import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";

/**
 * @const ${exportName} 
 */
export const ${exportName} = ${jsonContent};
SimpleIconsetStore.registerManifest(${exportName});`
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
gulp.task("default", gulp.series("merge", "analyze", "iconset"));