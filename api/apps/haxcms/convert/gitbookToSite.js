import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
import { JSONOutlineSchemaItem } from "../lib/JSONOutlineSchemaItem.js";

import fetch from "node-fetch";

import { parse } from 'node-html-parser';
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

const baseMdUrl = `${process.env.VERCEL_ENV !== 'development' ? 'https': 'http'}://${process.env.VERCEL_URL}/api/services/media/format/mdToHtml?type=link&raw=1&md=`
export default async function handler(req, res) {
  let body = {};
  if (req.query) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (!body || !body.md) {
    res = invalidRequest(res, 'missing `md` param');
  }
  else {
    const sourceLink = body.md;
    // md is a link
    let md = await fetch(sourceLink.trim()).then((d) => d.ok ? d.text(): '');
    let output = listToJOS(await mdClass.render(md), sourceLink);
    stdResponse(res, output, {cache: 180 });
  }
}

function listToJOS(html, sourceLink) {
  const site = new JSONOutlineSchema();
  const doc = parse(`<div id="wrapper">${html}</div>`);
  let top = doc.querySelector('ul');
  top.childNodes.forEach((node, index) => {
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.order = index;
      // @todo will need to be something that transforms this
      item.location = baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'));
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        recurseToJOS(item, node.querySelector('ul'), site, 1, sourceLink);
      }
    }
  });
  return site;
}

function recurseToJOS(parent, node, site, depth, sourceLink) {
  node.childNodes.forEach((node, index) => {
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.parent = parent.id;
      item.order = index;
      item.indent = depth;
      // @todo will need to be something that transforms this
      item.location = baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'));
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        recurseToJOS(item, node.querySelector('ul'), site, depth+1, sourceLink);
      }
    }
  });
}