import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { siteGlossary } from "./siteGlossary.js";
import fetch from "node-fetch";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let found = [];
  var terms = [];
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.body) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  // html to process
  const html = body.body ? body.body : '';
  // support seeding terms ahead of time
  // this is for locked environments where the service is basically
  // just doing the processing of what terms appear in content
  if (body.terms && body.terms.length > 0) {
    terms = body.terms;
  }
  else if (body.site && body.type) {
    // get URL bits for validating and forming calls
    let url = '';
    if (body.type === 'link') {
      url = body.site.replace('/site.json','');
    }
    else {
      // abuse that we have this prop for where somerthing lives
      url = body.site.file.replace('/site.json','');
    }
    // handle trailing slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    var parseURL = new URL(url);
    // verify we have a path / host
    if (parseURL.pathname && parseURL.host) {
      const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
      if (body.type === 'link') {
        terms = await siteGlossary(base);
      }
      else {
        terms = await siteGlossary(base, body.site);
      }
    }
  }
  if (terms.length > 0) {
    for (var i=0; i < terms.length; i++) {
      // term in contents, push def to a new array
      if (html.indexOf(terms[i].term) !== false) {
        // look for a related wikipedia link
        if (body.wikipedia) {
          const wiki = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&profile=classic&search=${terms[i].term}`).then((d) => d.ok ? d.json(): {});
          if (wiki && wiki.length === 4 && wiki[1].length > 0 && wiki[3].length > 0) {
            terms[i].links = [];
            if (wiki[1][0]) {
              terms[i].links.push({
                title: wiki[1][0] + ' (Wikipedia)',
                href: wiki[3][0]
              });
            }
            if (wiki[1][1]) {
              terms[i].links.push({
                title: wiki[1][1] + ' (Wikipedia)',
                href: wiki[3][1]
              });
            }
            if (wiki[1][2]) {
              terms[i].links.push({
                title: wiki[1][2] + ' (Wikipedia)',
                href: wiki[3][2]
              });
            }
          }
        }
        found.push(terms[i]);
      }
    }    
  }
  let options = {};
  if (!body.cacheBuster) {
    options.cache = 14400;
  }
  // front end will have to apply this as its just a list of what exists
  res = stdResponse(res, found, options);
}