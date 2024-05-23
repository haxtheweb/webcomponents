import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "./lib/JSONOutlineSchema.js";

import url from "url";
import Epub from "epub-gen";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  let body = {};
  if (req.query.url) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  // get URL bits for validating and forming calls
  const parseURL = url.parse(body.url.replace('/site.json',''));
  // verify we have a path / host
  if (parseURL.pathname && parseURL.host) {
    const base = `${parseURL.protocol}//${parseURL.host}${parseURL.pathname}`;
    const site = new JSONOutlineSchema();
    await site.load(`${base}/site.json`);
    // load all pages for their content
    const items = await pagesAsData(site);
    const options = {
      title: site.title,
      author: 'btopro',
      publisher: 'btopro',
      cover: "https://oer.hax.psu.edu/bto108/sites/edtechjoker/assets/banner.jpg",
      output: `/home/bto108a/haxtheweb/${site.title}.epub`,
      content: items
    };
    new Epub(options).promise.then(() => console.log('Done'));    
  }
  if (!body.cacheBuster) {
    res = stdResponse(res, content, { cache: 86400 });
  }
  else {
    res = stdResponse(res, content);  
  }
}

export async function pagesAsData(site) {
  var data = [];
  // ordered
  const items = site.orderTree(site.items);
  // get every page and stuff it together
  for (var i in items) {
    let item = site.items[i];
    let content = await site.getContentById(item.id, true);
    data.push({
      title: item.title,
      data: content
    });
  }
  return data;
}