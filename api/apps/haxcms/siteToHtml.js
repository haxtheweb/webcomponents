import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { siteHTMLContent } from "./lib/JOSHelpers.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.site) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (body.site && body.type) {
    // get URL bits for validating and forming calls
    let url = '';
    if (body.type === 'link') {
      url = body.site.replace('/site.json', '');
    }
    else {
      body.site.file = body.site.file.replace('iam.', 'oer.');
      // abuse that we have this prop for where somerthing lives
      url = body.site.file.replace('/site.json', '');
    }
    // handle trailing slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    var parseURL = new URL(url);
    // verify we have a path / host
    if (parseURL.pathname && parseURL.host) {
      // support for iam vs oer
      if (parseURL.host) {
        // specific to our instances but iam is going to block access when querying for the site content
        // iam is the authoring domain while oer is the openly available one which if printing
        // and rendering the content appropriately, this is the way to do it
        parseURL.host = parseURL.host.replace('iam.', 'oer.');
      }
      const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
      const siteData = body.site || null;
      const ancestor = body.ancestor || null;
      if (body.type === 'link') {
        content = await siteHTMLContent(base, null, ancestor);
      }
      else {
        content = await siteHTMLContent(base, siteData, ancestor);
      }
    }
  }
  let options = {};
  if (!body.cacheBuster) {
    options.cache = 14400;
  }
  // support rendering full document with paths and magic script
  if (body.magic) {
    const isDev = process.env.NODE_ENV === 'development';
    const magic = body.magic;
    options.type = "text/html";
    // local vercel development needs special paths but output should be the same
    content = isDev ? `
    <!DOCTYPE html>
    <html lang="en">
    <script>
      window.process = window.process || {
        env: {
          NODE_ENV: "production"
        }
      };
    </script>
      <head>
        <meta charset="utf-8">
        ${body.base ? `<base href="${body.base.replace('iam.', 'oer.')}" />` : ``}
    </head>
    <body>
    <haxcms-print-theme>
      ${content}
    </haxcms-print-theme>
    </body>
    <script type="module">
      import "${body.base}/../../../wc-autoload/wc-autoload.js";
    </script>
    <script>
      window.WCAutoloadRegistryFile = "./wc-registry.json";
      window.WCAutoloadBasePath = "/node_modules/";
      window.WCGlobalBasePath = "/node_modules/";
    </script>
    </html>
    ` : `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        ${body.base ? `<base href="${body.base.replace('iam.', 'oer.')}" />` : ``}
        <link rel="preconnect" crossorigin href="${magic}">
        <link rel="preconnect" crossorigin href="https://fonts.googleapis.com">
        <link rel="preload" href="${magic}build.js" as="script" />
        <link rel="preload" href="${magic}wc-registry.json" as="fetch" crossorigin="anonymous" />
        <link rel="preload" href="${magic}build/es6/node_modules/@haxtheweb/dynamic-import-registry/dynamic-import-registry.js" as="script" crossorigin="anonymous" />
        <link rel="modulepreload" href="${magic}build/es6/node_modules/@haxtheweb/dynamic-import-registry/dynamic-import-registry.js" />
        <link rel="preload" href="${magic}build/es6/node_modules/@haxtheweb/wc-autoload/wc-autoload.js" as="script" crossorigin="anonymous" />
        <link rel="modulepreload" href="${magic}build/es6/node_modules/@haxtheweb/wc-autoload/wc-autoload.js" />
        <link rel="stylesheet" href="${magic}build/es6/node_modules/@haxtheweb/haxcms-elements/lib/base.css" />
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
      </head>
      <body>
      <haxcms-print-theme>
        ${content}
      </haxcms-print-theme>
      </body>
      <script>window.__appCDN="${magic}";</script>
      <script src="${magic}build.js"></script>

    </html>`;
  }
  res = stdResponse(res, content, options);
}