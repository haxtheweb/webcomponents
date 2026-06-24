const gulp = require("gulp");
const fs = require("fs"); 
const path = require("path");
const packageJson = require("./package.json");


gulp.task("watch", () => {
  return gulp.watch(["./*.js","./lib/*", "./demo/*"]);
});

gulp.task("dev", gulp.series("watch"));

// discover iconset and build json structure
gulp.task("iconset", (done) => {
  const iconset = packageJson.wcfactory.iconset || {};
  if(iconset.svgsPath && iconset.svgsPath !== ''){
    const path = iconset.svgsPath;
    const manifestFilename = iconset.manifestFilename || `${packageJson.wcfactory.elementName}-iconsets-manifest.js`
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

gulp.task(
  "default",
  gulp.series("analyze")
);
