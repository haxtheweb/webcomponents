import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import { resolveSiteData } from "../lib/JOSHelpers.js";
import fetch from "node-fetch";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let site = {};
  let body = {};
  let downloads = {};
  // must POST a md 
  body = stdPostBody(req);
  if (!body || !body.repoUrl) {
    res = invalidRequest(res, 'missing `repoUrl` param');
  }
  if (body.repoUrl) {
    // get URL bits for validating and forming calls
    let url = '';
    url = body.repoUrl.replace('/site.json', '');
    // handle trailing slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    // parse the url
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
      site = await resolveSiteData(base);
      for await (const item of site.items) {
        item.contents = await fetch(`${base}/${item.location}`).then((d) => d.ok ? d.text(): '');
        if (item.metadata && item.metadata.files) {
          for await (const file of item.metadata.files) {
            downloads[file.url] = `${base}/${file.url}`;
          }
        }
      }
    }
    res = stdResponse(res, {
      data: {
        items: site.items,
        filename: (site.metadata && site.metadata.site && site.metadata.site.name) ? site.metadata.site.name : parseURL.pathname.split('/').pop(),
        files: downloads
      },
      status: 200
    }, {cache: 180, type: "application/json" });
  }
}