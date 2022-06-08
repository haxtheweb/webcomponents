import url from "url";
import Epub from "epub-gen";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  const body = JSON.parse(req.body);
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
      output: `/home/bto108a/lrnwebcomponents/${site.title}.epub`,
      content: items
    };
    new Epub(options).promise.then(() => console.log('Done'));    
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

export async function pagesAsData(site) {
  var data = [];
  // ordered
  const items = site.orderTree(site.items);
  // get every page and stuff it together
  for (var i in items) {
    let item = site.items[i];
    let content = await site.getContentById(item.id);
    data.push({
      title: item.title,
      data: content
    });
  }
  return data;
}