// pageCache.js
// cache any HAXcms site page via UUID + site address
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";
import { pageContent } from "./lib/JOSHelpers.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  let item = {};
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.site) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (body.site && body.type && body.uuid) {
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
      const siteData = body.site || null;
      const uuid = body.uuid || null;
      if (body.type === 'link') {
        item = await pageContent(base, null, uuid);
      }
      else {
        item = await pageContent(base, siteData, uuid);
      }
    }
    let options = {};
    // optional support for HTML response vs data of the full page as data object
    if (!body.data) {
      options.type = "text/html";
      content = item.content;
    }
    else {
      content = item;
      content.site = body.site;
      content.uuid = body.uuid;
    }
    // 15 minute cache default
    if (!body.cacheBuster) {
      options.cache = 900;
    }
    res = stdResponse(res, content, options);
  }
  else {
    res = invalidRequest(res, 'site, type, uuid required');
  }
}