// duckduckgo.js
// this is an example to fork from that uses common, simple conventions
// for getting data, validating data, and responding in a consistent way.
import { fetch, stdPostBody, stdResponse, invalidRequest } from "../utils/requestHelpers.js";

export default async function handler(req, res) {
  // destructing GET params after ? available in this object
  var { q } = req.query;
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  // fallback support for post
  if (!q && body && body.q) {
    q = body.q;
  }
  // need to know what we're searching for otherwise bail
  if (q) {
    // we import fetch just to simplify endpoint creation but its just node-fetch
    const searchResults = await fetch(`http://api.duckduckgo.com/?q=${q}&format=json`).then((d) => d.ok ? d.json(): {});
    // standard response is how all transactions end
    // this will assume 200 response code unless defined otherwise
    // response data is passed in as searchResults here
    // if type is not set in the options, then it is assumed JSON response
    // and is added to a data param
    res = stdResponse(res, searchResults, {cache: 86400, methods: "OPTIONS, POST" });
  }
  else {
    // invalidate the response and provide a reason
    // this optionally takes in a status code otherwise default is 400
    // vercel will through a 500 if there was any bricking issue so we don't
    // need to throw that most likely
    res = invalidRequest(res, 'missing `q` param');
  }
}