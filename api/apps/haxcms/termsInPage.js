import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { siteGlossary } from "./siteGlossary.js";
import fetch from "node-fetch";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let found = [];
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  // html to process
  const html = body.body ? body.body : '';
  // get URL bits for validating and forming calls
  let url = body.site.replace('/site.json','');
  // handle trailing slash
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  var parseURL = new URL(url);
  // verify we have a path / host
  if (parseURL.pathname && parseURL.host) {
    const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
    const terms = await siteGlossary(base);
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
  let options = {methods: "OPTIONS, POST" };
  if (!body.cacheBuster) {
    options.cache = 86400;
  }
  // front end will have to apply this as its just a list of what exists
  res = stdResponse(res, found, options);
}