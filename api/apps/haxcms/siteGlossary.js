import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "./lib/JSONOutlineSchema.js";
import { parse } from 'node-html-parser';

// site object to validate response from passed in url
export default async function handler(req, res) {
  let terms = [];
  // use this if POST data is what's being sent
  let body = {};
  if (req.query.url) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
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
    terms = await siteGlossary(base);

  }
  let options = {};
  if (!body.cacheBuster) {
    options.cache = 14400;
  }
  res = stdResponse(res, terms, options);
}

// return glossary terms from file
export async function siteGlossary(siteLocation = '', siteData = null, terms = []) {
  const site = new JSONOutlineSchema();
  // support side-loading site.json data through direct access
  // this is most useful for themes and solutions that are actively
  // running a HAXcms site and already have access to these details
  if (siteData) {
    site.file = siteData.file;
    site.id = siteData.id;
    site.title = siteData.title;
    site.author = siteData.author;
    site.description = siteData.description;
    site.license = siteData.license;
    site.metadata = siteData.metadata;
    site.items = siteData.items;
  }
  else {
    await site.load(`${siteLocation}/site.json`);
  }
  const item = site.getItemByProperty('slug', 'glossary');
  if (item) {
    let glossaryContent = await site.getContentById(item.id, true);
    // parse dom of the content in the glossary page
    const doc = parse(glossaryContent);
    // can select all the dt's for term
    // then all the dd's for definition
    // array lengths should match if valid HTML
    // also ensure we have any results at all
    if (doc.querySelectorAll('dt').length === doc.querySelectorAll('dd').length && doc.querySelectorAll('dt').length != 0) {
      const dts = doc.querySelectorAll('dt');
      const dds = doc.querySelectorAll('dd');
      for (var i=0; i < dts.length; i++) {
        terms.push({
          term: dts[i].rawText,
          definition: dds[i].rawText,
        });
      }
    }
  }
  return terms;
}