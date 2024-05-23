import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import { encode } from "base64-arraybuffer";

export default async function handler(req, res) {
  const body = stdPostBody(req);
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.html) {
    res = invalidRequest(res, 'missing `html` param');
  }
  else {
    // need to outsource this endpoint from vercel 1 to 2 for scale reasons
    const base = `<base href="${body.base.replace('iam.', 'oer.')}"  />` || '';
    const magic = 'https://hax.psu.edu/cdn/1.x.x/';
    var html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        ${base}
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
        <style>
        body {
          margin:40px;
        }
        </style>
      </head>
      <body>
        ${body.html}
      </body>
      <script>window.__appCDN="${magic}";</script>
      <script src="${magic}build.js"></script>
      <script src="${magic}build-haxcms.js"></script>
    </html>`;
    const response = await fetch(`https://pdffrom-haxtheweb.vercel.app/api/pdfFrom`,
      {
        method: 'POST',
        body: JSON.stringify({
          type: 'html',
          url: html,
        }),
      }
    );
    const pdf = encode(await response.arrayBuffer());
    res = stdResponse(res, pdf, {cache: 86400 });
  }
}