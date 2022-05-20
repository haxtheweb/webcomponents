const path = require("path");
const copy = require("rollup-plugin-copy");

var outputDir = "storybook";
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
  outputDir: '../' + outputDir,

  // Configuration for rollup (build-storybook only)
  rollup: (config) => {
    config.plugins.push(
      copy({
        targets: [
          {
            src: 'node_modules/@lrnwebcomponents/rpg-character/lib/**',
            dest: outputDir,
            flatten: false
          },
          {
            src: ['node_modules/@lrnwebcomponents/simple-icon/lib/svgs/*', '!node_modules/@lrnwebcomponents/simple-icon/lib/svgs/elmsln-custom'],
            dest: outputDir,
            flatten: false
          },
          {
            src: 'node_modules/@lrnwebcomponents/hax-iconset/lib/svgs',
            dest: outputDir,
            flatten: false
          },
          {
            src: 'node_modules/@lrnwebcomponents/chartist-render/lib/chartist/dist',
            dest: outputDir,
            flatten: false
          },
          {
            src: 'node_modules/@lrnwebcomponents/img-pan-zoom/lib/openseadragon',
            dest: outputDir,
            flatten: false
          },
          {
            src: 'node_modules/flag-icon-css/flags/*',
            dest: outputDir,
            flatten: false
          },
          {
            src: 'node_modules/monaco-editor/min/**',
            dest: outputDir,
            flatten: false
          },
        ],
      }),    );
    return config;
  },
};
