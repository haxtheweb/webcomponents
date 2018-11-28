const path = require("path");
module.exports = (baseConfig, env, defaultConfig) => {
  // Make whatever fine-grained changes you need
  defaultConfig.resolve.alias = {
    "../../whatwg-fetch/fetch.js": path.join(
      __dirname,
      "../node_modules/whatwg-fetch/fetch.js"
    ),
    "../../numeral/min/numeral.min.js": path.join(
      __dirname,
      "../node_modules/numeral/min/numeral.min.js"
    ),
    "../../numeral/numeral.js": path.join(
      __dirname,
      "../node_modules/numeral/numeral.js"
    ),
    "../../dialog-polyfill/dialog-polyfill.js": path.join(
      __dirname,
      "../node_modules/dialog-polyfill/dialog-polyfill.js"
    )
  };
  defaultConfig.module.rules.push({
    test: /elements\/.*\/.*.js$/,
    loader: require.resolve(
      "@open-wc/webpack/loaders/import-meta-url-loader.js"
    )
  });
  return defaultConfig;
};
