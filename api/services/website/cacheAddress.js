// cacheAddress.js
// cache any address for the given period of time
import { stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
export default async function handler(req, res) {
  let cache = 1800; // 30 minutes default
  // GET will be a single string for validating a single link and caching
  if (req.query && req.query.q && typeof req.query.q === 'string') {
    // allow variably cached resource, optional
    if (req.query.cache) {
      cache = req.query.cache;
    }
    let content;
    try {
      content = await fetch(req.query.q).then((d) => d.ok ? d.text(): '');
    }
    catch {
      content = '';
    }
    res = stdResponse(res, content, {cache: cache });
  }
  else {
    // invalidate the response and provide a reason
    // this optionally takes in a status code otherwise default is 400
    // vercel will through a 500 if there was any bricking issue so we don't
    // need to throw that most likely
    res = invalidRequest(res, 'missing `q` param');
  }
}