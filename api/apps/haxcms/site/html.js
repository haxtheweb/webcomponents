import url from "url";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
import { stdPostBody, stdResponse, invalidRequest } from "../../../utilities/requestHelpers.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  // get URL bits for validating and forming calls
  const parseURL = url.parse(body.url.replace('/site.json',''));
  parseURL.endsWith('/')
  // verify we have a path / host
  if (parseURL.pathname && parseURL.host) {
    const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
    content = await fullSiteContent(base);
  }
  let options = {methods: "OPTIONS, POST" };
  if (!body.cacheBuster) {
    options.cache = 86400;
  }
  res = stdResponse(res, content, options);

}

export async function fullSiteContent(siteLocation, noTitles = false) {
  var siteContent = '';
  const site = new JSONOutlineSchema();
  await site.load(`${siteLocation}/site.json`);
  // ordered
  const items = site.orderTree(site.items);
  // get every page and stuff it together
  for (var i in items) {
    let item = site.items[i];
    if (!noTitles) {
      siteContent += `<h1>${item.title}</h1>`;
    }
    let content = await site.getContentById(item.id);
    siteContent += content;
  }
  return siteContent;
}