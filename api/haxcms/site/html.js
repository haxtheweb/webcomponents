import url from "url";
import { JSONOutlineSchema } from "@haxtheweb/haxcms/lib/JSONOutlineSchema.js";
// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  const body = JSON.parse(req.body);
  // get URL bits for validating and forming calls
  const parseURL = url.parse(body.url.replace('/site.json',''));
  // verify we have a path / host
  if (parseURL.pathname && parseURL.host) {
    const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
    content = await fullSiteContent(base);
  }
  if (!body.cacheBuster) {
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.json({
    status: "success",
    data: content
  });
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