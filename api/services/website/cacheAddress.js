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
      // note location includes base path of site bc of nature of how system builds base URIs
      let __fetchOptions = {
        method: "GET",
      };
        // test for aanda elms as "basic auth" is required to bypass azure
        // and defer to app level permissions handling
      if (req.query.q.includes('.aanda.psu.edu') || req.query.q.includes('.ed.science.psu.edu')) {
        let buff = Buffer.from(process.env.ELMSLN_VERCEL_SERVICE_AUTH).toString('base64');
        __fetchOptions.headers = {'Authorization': 'Basic ' + buff};
      }
      content = await fetch(req.query.q, __fetchOptions).then((d) => d.ok ? d.text(): '');
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