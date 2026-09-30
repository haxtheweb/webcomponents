import path from 'node:path';

// When tests are launched from an element directory (cd elements/<name> &&
// yarn test), scope coverage collection to that element's own sources.
// Workspace symlinks pull sibling elements' files (d-d-d, simple-icon, ...)
// into the browser session, and because those resolve to real paths inside
// the monorepo root they land in the coverage report with tiny
// partial-execution percentages that dilute the element's own number.
// When launched from the monorepo root (yarn test:all), keep collecting
// everything so the aggregate stays a true whole-project number.
const cwd = process.cwd();
const relativeToRoot = path.relative(path.resolve(cwd, '../../'), cwd);
const isElementDir =
  relativeToRoot.split(path.sep).length === 2 &&
  relativeToRoot.split(path.sep)[0] === 'elements';

export default {
    concurrency: 10,
    nodeResolve: true,
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: '../../',
    // @web/test-runner-coverage-v8 doesn't know how to resolve the
    // /__wds-outside-root__/{depth}/... virtual path prefix used for
    // monorepo packages living outside of an element's own directory,
    // so it throws harmless ENOENT errors trying to read coverage for
    // them. Exclude these from coverage collection entirely to silence
    // the noise; this doesn't affect coverage of an element's own source.
    coverageConfig: {
      // only collect the element's own files when testing a single element
      ...(isElementDir ? { include: [`${cwd}/**`] } : {}),
      exclude: ['**/__wds-outside-root__/**', '**/node_modules/**'],
    },
    testRunnerHtml: testFramework =>
      `<!DOCTYPE html>
      <html lang="en">
        <body>
          <script>window.process = { env: { NODE_ENV: "development" } }</script>
          <script>document.body.removeAttribute('no-js');window.__appCDN="./node_modules/";window.__appForceUpgrade=false;</script>
          <script>
            window.WCAutoloadRegistryFile = "\/elements\/haxcms-elements\/demo\/wc-registry.json";
            window.WCAutoloadBasePath = "/node_modules/";
            window.WCGlobalBasePath = "/node_modules/";
            // set this in order to simulate the published form of the site
            //window.HAXCMSContext="published";
            // set the below to simulate running a demo / end points to load data
            // this will let you simulate more operations without having a backend
            window.HAXCMSContext="demo";
            window.appSettings = {
              "demo": true,
              "getSitesList": "sites.json",
              "createNodePath": "elements\/haxcms-elements\/demo\/dist\/dev\/createNodePath.json",
              "saveOutlinePath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "saveManifestPath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveManifestPath.json",
              "getSiteFieldsPath": "elements\/haxcms-elements\/demo\/dist\/dev\/getSiteFieldsPath.json",
              "deleteNodePath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "saveNodePath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "getUserDataPath": "elements\/haxcms-elements\/demo\/dist\/dev\/userData.json",
              "login": "elements\/haxcms-elements\/demo\/dist\/dev\/login.json",
              "refreshUrl": "elements\/haxcms-elements\/demo\/dist\/dev\/refreshUrl.json",
              "logout": "elements\/haxcms-elements\/demo\/dist\/dev\/logout.json",
              "connectionSettings": "elements\/haxcms-elements\/demo\/dist\/dev\/connectionSettings.json",
              "publishSitePath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "revertSitePath": "elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "getFieldsToken": "adskjadshjudfu823u823u8fu8fij",
              "appStore": {
                "url": "dist\/dev\/appstore.json"
              },
              "jwt": "made-up-thing",
              // add your custom theme here if testing locally and wanting to emulate the theme selector
              // this isn't really nessecary though
              "themes": { 
                "haxcms-dev-theme": { 
                  "element": "haxcms-dev-theme", 
                  "path": "@haxtheweb/haxcms-elements/lib/haxcms-dev-theme.js", 
                  "name": "Developer theme"
                }
              }
            };
          </script>
          <script type="module" src="${testFramework}"></script>
        </body>
      </html>`,
  };