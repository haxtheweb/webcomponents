import "@lrnwebcomponents/utils/lib/nodejs-fake-dom-polyfill.cjs";
import * as tmp from 'gulp';
import * as tmp2 from 'gulp-concat-util';
import { HAXWiring } from './elements/hax-body-behaviors/lib/HAXWiring.js';
const gulp = tmp.default;
const concat = tmp2.default;
// merge the web component factory libraries the user has installed 
gulp.task("default", () => {
  return gulp
    .src("../../templates/libraries/**/package.json")
    .pipe(
      concat(".wcflibcache.json", {
        process: function (src, filePath) {
          return src + ",";
        },
      })
    )
    .pipe(concat.header("["))
    .pipe(concat.footer("{}]"))
    .pipe(gulp.dest("./"));
});


// merge the web component factory libraries the user has installed 
gulp.task("haxschema", async () => {
  const args = process.argv.pop();
  console.log(args.replace("--", ""));
  const hax = new HAXWiring();
  console.log(hax);
  return true;
});
