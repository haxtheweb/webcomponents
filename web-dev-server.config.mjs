import path from "path";

// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: process.env.STORYBOOK ? '/' : true,
  rootDir: process.env.STORYBOOK ? '/' : '../../',
  watch: !hmr,
  https: true,
  dedupe: true,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  
  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'demo/index.html',
  appIndex: path.join(process.cwd(), "demo", "index.html"),

  /**
   * simple-fields loads some fields on demand from a base path that is
   * node_modules/ once published but the repo root here, so the request
   * arrives as /@haxtheweb/<package>/...; redirect it to elements/<package>/
   * (a redirect, not a rewrite, so the module's relative imports resolve to
   * the same URLs as everything else and nothing loads twice)
   * https://github.com/haxtheweb/issues/issues/3208
   */
  middleware: [
    function haxtheWebMonorepoPackages(context, next) {
      const match = context.url.match(/^\/@haxtheweb\/([^/?#]+)\/(.*)$/);
      if (match) {
        context.redirect(`/elements/${match[1]}/${match[2]}`);
        return undefined;
      }
      return next();
    },
  ],

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],

  // See documentation for all available options
});
