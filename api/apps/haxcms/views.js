import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { resolveSiteData } from "./lib/JOSHelpers.js";

// vercel to slice our data into views that we can remix at will
export default async function handler(req, res) {
  let siteManifest = {};
  let items = [];
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.site) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
if (body.site && body.type) {
    // get URL bits for validating and forming calls
    let url = '';
    if (body.type === 'link') {
      url = body.site.replace('/site.json', '');
    }
    else {
      body.site.file = body.site.file.replace('iam.', 'oer.');
      // abuse that we have this prop for where somerthing lives
      url = body.site.file.replace('/site.json', '');
    }
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
      var siteData = body.site || null;
      let itemId = body.activeId || null;
      if (itemId === 'null') {
        itemId = null;
      }
      if (body.type === 'link') {
        siteData = null;
      }
      siteManifest = await resolveSiteData(base);
      items = siteManifest.orderTree(siteManifest.items);
      if (body.tag) {
        items = items.filter((item) => {
          if (item.metadata && item.metadata.tags && item.metadata.tags.includes(body.tag)) {
            return true;
          }
          return false;
        });
      }
      // now we have everything, let's mess with it
    }
    let options = {};
    // 15 minute cache default
    if (!body.cacheBuster) {
      options.cache = 300;
    }
    res = stdResponse(res, items, options);
  }
  else {
    res = invalidRequest(res, 'site location required');
  }
}