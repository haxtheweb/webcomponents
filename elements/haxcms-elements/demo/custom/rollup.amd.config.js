// @ts-nocheck
const path = require("path");
const autoExternal = require("rollup-plugin-auto-external");
const rewriteImports = require("rollup-plugin-rewrite-imports");
const production = true;
module.exports = function () {
  return {
    input: "src/custom.js",
    treeshake: !!production,
    output: {
      file: `build/custom.es6-amd.js`,
      format: "esm",
      sourcemap: false,
    },
    plugins: [
      autoExternal({
        builtins: false,
        dependencies: true,
        packagePath: path.resolve("../../../package.json"),
        peerDependencies: false,
      }),
      rewriteImports(`../../build/es6-amd/node_modules/`),
    ],
  };
};
