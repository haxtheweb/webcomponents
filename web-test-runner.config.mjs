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
              "createNodePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/createNodePath.json",
              "saveOutlinePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "saveManifestPath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveManifestPath.json",
              "getSiteFieldsPath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/getSiteFieldsPath.json",
              "deleteNodePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "saveNodePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "getUserDataPath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/userData.json",
              "login": "\/elements\/haxcms-elements\/demo\/dist\/dev\/login.json",
              "refreshUrl": "\/elements\/haxcms-elements\/demo\/dist\/dev\/refreshUrl.json",
              "logout": "\/elements\/haxcms-elements\/demo\/dist\/dev\/logout.json",
              "connectionSettings": "\/elements\/haxcms-elements\/demo\/dist\/dev\/connectionSettings.json",
              "publishSitePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
              "revertSitePath": "\/elements\/haxcms-elements\/demo\/dist\/dev\/saveNode.json",
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