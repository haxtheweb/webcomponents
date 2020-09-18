const path = require("path");
const fs = require("fs");
const cpy = require("rollup-plugin-cpy");

module.exports = {
  // Globs of all the stories in your project
  stories: ["./**.stories.{js,mdx}", "../elements/*/**.stories.{js,mdx}"],

  // Addons to be loaded, note that you need to import
  // them from storybook-prebuilt
  addons: [
    "storybook-prebuilt/addon-actions/register.js",
    "storybook-prebuilt/addon-knobs/register.js",
    "storybook-prebuilt/addon-a11y/register.js",
    "storybook-prebuilt/addon-docs/register.js",
  ],

  // Configuration for es-dev-server (start-storybook only)
  esDevServer: {
    nodeResolve: true,
    open: true,
    watch: true,
    https: true,
    dedupe: true,
    preserveSymlinks: true,
  },

  // Rollup build output directory (build-storybook only)
  outputDir: "../../../storybooks/styleguide",

  // Configuration for rollup (build-storybook only)
  rollup: (config) => {
    config.plugins.push(
      cpy({
        files: ["elements/*/demo/**/*.{csv,json,jpg,jpeg,png,vtt,mp3,mp4}"],
        dest: "../../storybooks/styleguide",
        options: { parents: true },
      }),
      cpy({
        files: ["node_modules/monaco-editor/min/**/*"],
        dest: "../../storybooks/styleguide/",
        options: { parents: true },
      }),
      cpy({
        files: ["elements/chartist-render/lib/chartist/dist/chartist.min.*"],
        dest: "../../storybooks/styleguide/",
        options: { parents: true },
      }),
      cpy({
        files: ["elements/img-pan-zoom/lib/openseadragon/*"],
        dest: "../../storybooks/styleguide/",
        options: { parents: true },
      }),
      cpy({
        files: ["elements/fullscreen-behaviors/lib/screenfull/dist/*"],
        dest: "../../storybooks/styleguide/",
        options: { parents: true },
      })
    );
    return config;
  },
};
