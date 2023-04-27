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
    var siteName = url;
    // verify we have a path / host
    if (parseURL.pathname && parseURL.host) {
      const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
      site = await resolveSiteData(base);
      // use legit prop or just pull off the url
      siteName = (site.metadata && site.metadata.site && site.metadata.site.name) ? site.metadata.site.name : parseURL.pathname.split('/').pop();
      for await (const item of site.items) {
        // note location includes base path of site bc of nature of how system builds base URIs
        item.contents = await fetch(`${base}/${item.location.replace(`/${siteName}/`,'')}`).then((d) => d.ok ? d.text(): '');
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
        filename: siteName,
        files: downloads
      },
      status: 200
    }, {cache: 180, type: "application/json" });
  }
}