// duckduckgo.js
// this is an example to fork from that uses common, simple conventions
// for getting data, validating data, and responding in a consistent way.
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { parse } from 'node-html-parser';
import fetch from "node-fetch";
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
  // need to know what we're searching for otherwise bail
  if (q) {
    // we import fetch just to simplify endpoint creation but its just node-fetch
    const page = await fetch(`http://${process.env.VERCEL_URL}/api/services/website/cacheAddress?q=${q}`).then((d) => d.ok ? d.json() : '').then((r) => r.data);
    const doc = parse(`<div id="wrapper">${page}</div>`);
    const tags = doc.querySelectorAll('title,meta,script[type="application/ld+json"]');
    var metadata = {};
    for await (const tag of tags) {
      let key = null;
      let value = null;
      // json ld support
      if (tag.tagName === "SCRIPT") {
        key = 'ld+json';
        try {
          value = JSON.parse(tag.innerText);
        }
        catch(e) {
          value = null;
        }
      }
      else if (tag.tagName === "TITLE") {
        key = 'title';
        value = tag.innerText;
      }
      else {
        // meta tags w/ two methods of support
        if (tag.getAttribute('name')) {
          key = tag.getAttribute('name');
        }
        else if (tag.getAttribute('property')) {
          key = tag.getAttribute('property');
        }
        if (tag.getAttribute('content')) {
          value = tag.getAttribute('content');
        }
      }

      if (key && value) {
        metadata[key] = value;
      }
    }
    // include initial request url in response
    metadata.url = q;
    res = stdResponse(res, metadata, {cache: 86400});
  }
  else {
    res = invalidRequest(res, 'missing `q` param');
  }
}