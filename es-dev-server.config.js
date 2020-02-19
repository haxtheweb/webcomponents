const path = require("path");
module.exports = {
  watch: true,
  http2: true,
  nodeResolve: true,
  open: true,
  dedupe: true,
  rootDir: "../../",
  appIndex: path.join(process.cwd(), "index.html")
};
