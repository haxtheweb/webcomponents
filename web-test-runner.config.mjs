export default {
    concurrency: 10,
    nodeResolve: true,
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: '../../',
    testRunnerHtml: testFramework =>
      `<!DOCTYPE html>
      <html lang="en">
        <body>
          <script>window.process = { env: { NODE_ENV: "development" } }</script>
          <script>document.body.removeAttribute('no-js');window.__appCDN="./node_modules/";window.__appForceUpgrade=false;</script>
          <script>
            window.WCAutoloadRegistryFile = "./wc-registry.json";
            window.WCAutoloadBasePath = "/node_modules/";
            window.WCGlobalBasePath = "/node_modules/";
            // set this in order to simulate the published form of the site
            //window.HAXCMSContext="published";
            // set the below to simulate running a demo / end points to load data
            // this will let you simulate more operations without having a backend
            window.HAXCMSContext="demo";
            window.appSettings = {
              "createNodePath": "dist\/dev\/createNodePath.json",
              "saveOutlinePath": "dist\/dev\/saveNode.json",
              "saveManifestPath": "dist\/dev\/saveManifestPath.json",
              "getSiteFieldsPath": "dist\/dev\/getSiteFieldsPath.json",
              "deleteNodePath": "dist\/dev\/saveNode.json",
              "saveNodePath": "dist\/dev\/saveNode.json",
              "getUserDataPath": "dist\/dev\/userData.json",
              "login": "dist\/dev\/login.json",
              "refreshUrl": "dist\/dev\/refreshUrl.json",
              "logout": "dist\/dev\/logout.json",
              "connectionSettings": "dist\/dev\/connectionSettings.json",
              "publishSitePath": "dist\/dev\/saveNode.json",
              "revertSitePath": "dist\/dev\/saveNode.json",
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
                  "path": "@lrnwebcomponents/haxcms-elements/lib/haxcms-dev-theme.js", 
                  "name": "Developer theme"
                }
              }
            };
          </script>
          <script type="module" src="${testFramework}"></script>
        </body>
      </html>`,
  };