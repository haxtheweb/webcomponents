import { stdResponse, invalidRequest, stdPostBody } from "../../utilities/requestHelpers.js";
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { unsafeHTML } from "lit/directives/unsafe-html.js";
// node parser
import { parse } from 'node-html-parser';

import wcRegistry from "../../wc-registry.json" assert { type: 'json' };

export default async function handler(req, res) {
  // destructing GET params after ? available in this object
  // use this if POST data is what's being sent
  let body = {};
  let q = null;
  if (req.query.q) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  // fallback support for post
  if (body && body.q) {
    q = body.q;
  }
  if (body && body.type == "link") {
    q = await fetch(q).then((d) => d.ok ? d.text() : '');
  }
  // need to know what we're searching for otherwise bail
  if (q) {
    const doc = parse(q);
    // can select all the dt's for term
    // then all the dd's for definition
    // array lengths should match if valid HTML
    // also ensure we have any results at all
    if (doc.querySelectorAll('*').length > 0) {
      const allEls = doc.querySelectorAll('*');
      for (var i=0; i < allEls.length; i++) {
        // see if it's in the registry
        if (wcRegistry[allEls[i].tagName.toLowerCase()]) {
          try {
            console.log(`importing ${wcRegistry[allEls[i].tagName.toLowerCase()]}`);
            await import(wcRegistry[allEls[i].tagName.toLowerCase()]);
          }
          catch(e) {
            console.log(e);
          }
        }
      }
    }
    const myServerTemplate = () => html`${unsafeHTML(q)}`;
    const ssrResult = render(myServerTemplate());
    const content = await collectResult(ssrResult);
    // Awaits promises
    res = stdResponse(res, content, {cache: 86400,type : 'text/html' });
  }
  else {
    // invalidate the response and provide a reason
    // this optionally takes in a status code otherwise default is 400
    // vercel will through a 500 if there was any bricking issue so we don't
    // need to throw that most likely
    res = invalidRequest(res, 'missing `q` param');
  }
}