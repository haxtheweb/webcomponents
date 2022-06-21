import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "./lib/JSONOutlineSchema.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  // get URL bits for validating and forming calls
  let url = body.url.replace('/site.json','');
  // handle trailing slash
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  var parseURL = new URL(url);
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