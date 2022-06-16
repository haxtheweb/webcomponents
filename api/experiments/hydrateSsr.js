import { fetch, stdPostBody, stdResponse } from "../utilities/requestHelpers.js";

// @todo remote load HTML or accept string
// leverage the WC registry supplied OR default to a CDN
// return hydrated shadow using Lit hydration thing
import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { Readable } from 'stream';
import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import pkg from 'jsdom';
const { JSDOM } = pkg;

export default async function handler(req, res) {
  const body = stdPostBody(req);
  var htmlContent = body.html;
  var domBody = '';
  // md is actually a link reference so fetch it 1st
  if (body.type === 'link' && htmlContent) {
    htmlContent = await fetch(htmlContent.trim()).then((d) => d.ok ? d.text(): '');
    const dom = new JSDOM(htmlContent);
    domBody = dom.window.document.querySelector("body").innerHTML;
    console.log(domBody);
  }
  const ssrContent = await readStream(Readable.from(render(html`
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
        import("./node_modules/@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js");
      </script>
  `)));
  res = stdResponse(res, ssrContent)
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