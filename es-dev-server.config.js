const path = require("path");
module.exports = {
  watch: true,
  https: true,
  nodeResolve: true,
  open: true,
  dedupe: true,
  rootDir: "../../",
  appIndex: path.join(process.cwd(), "index.html"),
};
