import { stdPostBody, stdResponse } from "../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "./lib/JSONOutlineSchema.js";

// site object to validate response from passed in url
export default async function handler(req, res) {
  let content = '';
  // use this if POST data is what's being sent
  const body = stdPostBody(req);
  if (body.type) {
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
      const siteData = body.site || null;
      const ancestor = body.ancestor || null;
      if (body.type === 'link') {
        content = await siteHTMLContent(base, null, ancestor);
      }
      else {
        content = await siteHTMLContent(base, siteData, ancestor);
      }
    }
  }
  let options = {methods: "OPTIONS, POST" };
  if (!body.cacheBuster) {
    options.cache = 86400;
  }
  // support rendering full document with paths and magic script
  if (body.magic) {
    content = `
<html>
  <head>
    ${body.base ? `<base href="${body.base}" />` : ``}
  </head>
  <body>
  ${content}      
  </body>
  <script>window.__appCDN="${body.magic}";</script>
  <script src="${body.magic}/build.js"></script>
</html>`;
  }
  res = stdResponse(res, content, options);
}

export async function siteHTMLContent(siteLocation, siteData = null, ancestor = null, noTitles = false) {
  const site = new JSONOutlineSchema();
  var siteContent = '';
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
  // support slicing the structure to only the branch in question
  // this will set the "root" for buildind an HTML structure to be something different than
  // null and as a result will build the whole site
  let items = [];
  if (ancestor != null) {
    items = site.findBranch(ancestor);
  }
  else {
    items = site.orderTree(site.items);
  }
  // ordered
  // get every page and stuff it together
  for (var i in items) {
    if (!noTitles) {
      siteContent += `<h1>${items[i].title}</h1>`;
    }
    let content = await site.getContentById(items[i].id);
    siteContent += content;
  }
  return siteContent;
}