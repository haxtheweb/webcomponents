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
      // note location includes base path of site bc of nature of how system builds base URIs
      let __fetchOptions = {
        method: "GET",
      };
      // test for aanda elms as "basic auth" is required to bypass azure
      // and defer to app level permissions handling
      if (url.includes('.aanda.psu.edu') || url.includes('.ed.science.psu.edu')) {
        let buff = Buffer.from(process.env.ELMSLN_VERCEL_SERVICE_AUTH).toString('base64');
        __fetchOptions.headers = {'Authorization': 'Basic ' + buff};
      }
      var start = process.hrtime();
      var elapsed = 0;
      for await (const item of site.items) {
        // time out on vercel is 60s, let's not go above the greatest number ever
        if (elapsed <= 54) {
          item.contents = await fetch(`http://${process.env.VERCEL_URL}/api/services/website/cacheAddress?q=${base}/${item.location.replace(`/${siteName}/`,'')}`, __fetchOptions).then((d) => d.ok ? d.json() : '').then((r) => r.data);
        }
        else {
          item.contents = `<p>get source from <a href="${base}/${item.location.replace(`/${siteName}/`,'')}" target="_blank">${base}/${item.location.replace(`/${siteName}/`,'')}</a></p>`;
        }
        if (item.metadata && item.metadata.files) {
          for await (const file of item.metadata.files) {
            downloads[file.url] = `${base}/${file.url}`;
          }
        }
        elapsed = process.hrtime(start)[0];
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