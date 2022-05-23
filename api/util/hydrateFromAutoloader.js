// @todo remote load HTML or accept string
// leverage the WC registry supplied OR default to a CDN
// return hydrated shadow using Lit hydration thing
import fetch from "node-fetch";
import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { Readable } from 'stream';
import { html as htmlLit } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import pkg from 'jsdom';
const { JSDOM } = pkg;

import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-builder.js";
export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  var html = body.html;
  var domBody = '';
  // md is actually a link reference so fetch it 1st
  if (body.type === 'link' && html) {
    html = await fetch(html.trim()).then((d) => d.ok ? d.text(): '');
    const dom = new JSDOM(html);
    domBody = dom.window.document.querySelector("body").innerHTML;
    console.log(domBody);
  }
  const ssrContent = await readStream(Readable.from(render(htmlLit`
    ${unsafeHTML(domBody)}
    <script type="module">
        // Hydrate template-shadowroots eagerly after rendering (for browsers without
        // native declarative shadow roots)
        import {
          hasNativeDeclarativeShadowRoots,
          hydrateShadowRoots
        } from './node_modules/@webcomponents/template-shadowroot/template-shadowroot.js';
        if (!hasNativeDeclarativeShadowRoots) {
          hydrateShadowRoots(document.body);
        }
        // ...
        // Load and hydrate components lazily
        import("@lrnwebcomponents/wc-autoload/wc-autoload.js");
      </script>
  `)));
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json({
    status: "success",
    data: ssrContent
  });
}

function readStream(stream, encoding = "utf8") {
	stream.setEncoding(encoding);
	return new Promise((resolve, reject) => {
			let data = "";
			stream.on("data", chunk => data += chunk);
			stream.on("end", () => resolve(data));
			stream.on("error", error => reject(error));
	});
}