const path = require("path");
module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: [/\.js$/],
    loader: require.resolve(
      "@open-wc/webpack/loaders/import-meta-url-loader.js"
    )
  });
  return defaultConfig;
};
