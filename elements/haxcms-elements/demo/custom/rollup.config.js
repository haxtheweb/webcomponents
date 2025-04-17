// @ts-nocheck
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import esbuild from 'rollup-plugin-esbuild';

const inputFile = "src/custom.js";
export default {
  input : inputFile,
  output: {
    file: `build/custom.es6.js`,
    format: 'es',
    sourcemap: false,
  },
  external: (assetPath) => {
    // remove current working directory for eval
    let asset = assetPath.replace(process.cwd(), '');
    // matches input file, or starts with ./ or /src/ then we know it's a local file for processing
    // the goal is to be able to correctly reference @haxtheweb / other project bare assets
    // and correctly assess that they are to be treated as 'external'
    // @todo read off of wc-registry.json to make this assessment if local or otherwise need to hit a CDN based copy
    if (asset.endsWith(inputFile) || asset.startsWith('./') || asset.startsWith('/src/')) {
      return false;
    }
    return true;
  },
  preserveEntrySignatures: false,
  plugins: [
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS, compile JS to a lower language target */
    esbuild({
      minify: true,
      target: ['chrome64', 'firefox67', 'safari11.1'],
    }),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Minify html and css tagged template literals */
    babel(),
  ],
};