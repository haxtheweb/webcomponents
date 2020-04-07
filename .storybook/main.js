const path = require('path');
module.exports = {
  // Globs of all the stories in your project
  stories: ["../elements/*/**.stories.{js,mdx}"],

  // Addons to be loaded, note that you need to import
  // them from storybook-prebuilt
  addons: [
    "storybook-prebuilt/addon-actions/register.js",
    "storybook-prebuilt/addon-knobs/register.js",
    "storybook-prebuilt/addon-a11y/register.js",
    "storybook-prebuilt/addon-docs/register.js"
  ],

  // Configuration for es-dev-server (start-storybook only)
  esDevServer: {
    nodeResolve: true,
    open: true
  },

  // Rollup build output directory (build-storybook only)
  outputDir: "../../../storybooks/lrnwebcomponents",
  // Configuration for rollup (build-storybook only)
  rollup: config => {
    return config;
  }
};
