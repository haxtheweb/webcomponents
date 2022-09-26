// linkValidator.js
// validate links or return what codes there are with a timeout interval
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
export default async function handler(req, res) {
  let responses = {};
  let links = [];
  // GET will be a single string for validating a single link and caching
  if (req.query && req.query.links) {
    links = req.query.links;
  }
  else {
    // use this if POST data is what's being sent
    let body = stdPostBody(req);
    // fallback support for post
    links = body.links ? body.links : null;
  }
  if (links) {
    // 1 vs multiple
    if ( typeof links === 'string') {
      links = [links];
    }
    for (const link of links) {
      let resp;
      try {
        resp = await fetch(link, { method: "HEAD"});
        // rare but implies HEAD request not allowed
        if (resp.status === 405) {
          resp = await fetch(link, { method: "GET"});
        }
      }
      catch {
        resp = {
          ok: false,
          status: 999
        }
      }
      responses[link] = {
        ok: resp.ok,
        status: resp.status,
      }
    }
    res = stdResponse(res, responses, {cache: 1800 });
  }
  else {
    // invalidate the response and provide a reason
    // this optionally takes in a status code otherwise default is 400
    // vercel will through a 500 if there was any bricking issue so we don't
    // need to throw that most likely
    res = invalidRequest(res, 'missing `links` param');
  }
}