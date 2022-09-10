const path = require("path");
const copy = require("rollup-plugin-copy");

var outputDir = "storybook";
module.exports = {
  // Globs of all the stories in your project
  stories: ["./**.stories.{js,mdx}", "../elements/*/**.stories.{js,mdx}", "../elements/*/lib/**.stories.{js,mdx}"],

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
            src: 'elements/rpg-character/lib/',
            dest: `${outputDir}/elements/rpg-character`,
            flatten: false
          },
          {
            src: ['elements/simple-icon/lib/svgs/*', '!elements/simple-icon/lib/svgs/elmsln-custom'],
            dest: `${outputDir}/elements/simple-icon/lib/svgs`,
            flatten: false
          },
          {
            src: 'elements/hax-iconset/lib/svgs/',
            dest: `${outputDir}/elements/hax-iconset/lib`,
            flatten: false
          },
          {
            src: 'elements/chartist-render/lib/chartist/dist',
            dest: `${outputDir}/elements/chartist-render/lib/chartist`,
            flatten: false
          },
          {
            src: 'elements/img-pan-zoom/lib/openseadragon/',
            dest: `${outputDir}/elements/img-pan-zoom/lib`,
            flatten: false
          },
          {
            src: 'node_modules/flag-icons/flags/',
            dest: `${outputDir}/node_modules/flag-icons/flags`,
            flatten: false
          },
          {
            src: 'node_modules/monaco-editor/min/',
            dest: `${outputDir}/node_modules/monaco-editor`,
            flatten: false
          },
        ],
      }),    );
    return config;
  },
};
