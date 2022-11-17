// siteManifest.js
// cache any HAXcms site page via UUID + site address
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { resolveSiteData } from "./lib/JOSHelpers.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let siteManifest = {};
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.site) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (body.site) {
    // get URL bits for validating and forming calls
    let url = '';
    url = body.site.replace('/site.json', '');
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
      siteManifest = await resolveSiteData(base);
      const items = siteManifest.orderTree(siteManifest.items);
      siteManifest.items = [...items];
    }
    let options = {};
    // 15 minute cache default
    if (!body.cacheBuster) {
      options.cache = 900;
    }
    res = stdResponse(res, siteManifest, options);
  }
  else {
    res = invalidRequest(res, 'site location required');
  }
}