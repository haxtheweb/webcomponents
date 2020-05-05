const path = require("path");
const cpy = require("rollup-plugin-cpy");

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
    open: true,
    watch: true,
    https: true,
    dedupe: true,
    preserveSymlinks: true
  },

  // Rollup build output directory (build-storybook only)
  outputDir: "../../../storybooks/lrnwebcomponents",
  // Configuration for rollup (build-storybook only)
  rollup: config => {
    return [
      config[0],
      {
        ...config[1],
        plugins: [
          ...config[1].plugins,
          cpy({
            files: ["elements/*/demo/**/*.{csv,json,jpg,jpeg,png,vtt,mp3,mp4}"],
            dest: "../../storybooks/lrnwebcomponents/",
            options: { parents: true }
          })
        ]
      }
    ];
  }
};
