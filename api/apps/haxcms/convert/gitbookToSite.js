import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import { JSONOutlineSchema } from "../lib/JSONOutlineSchema.js";
import { JSONOutlineSchemaItem } from "../lib/JSONOutlineSchemaItem.js";
import fetch from "node-fetch";
import { parse } from 'node-html-parser';
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

const site = new JSONOutlineSchema();
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
    let tmp = new URL(sourceLink);
    // md is a link
    let md = await fetch(sourceLink.trim()).then((d) => d.ok ? d.text(): '');
    // if theme is set, bring it along
    let theme = 'clean-one';
    if (body.theme) {
      theme = body.theme;
    }
    let name = tmp.pathname.split('/')[1] || 'New site';
    if (body.name) {
      name = body.name;
    }
    stdResponse(res, listToJOS(await mdClass.render(md), sourceLink, theme, name), {cache: 180 });
  }
}

function listToJOS(html, sourceLink, theme, name) {
  const doc = parse(`<div>${html}</div>`);
  let top = doc.querySelector('ul');
  top.childNodes.forEach((node, index) => {
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.parent = null;
      item.order = index;
      item.indent = 0;
      item.slug = a.getAttribute('href');
      item.location = baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'));
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        recurseToJOS(item, node.querySelector('ul'), 1, sourceLink);
      }
    }
  });
  site.title = name;
  site.metadata = {
    author: {},
    site: {
      name: name,
      logo: "assets/banner.jpg",
      version: "6.0.0",
      created: Date.now(),
      updated: Date.now(),
    },
    theme: {
      element: theme,
      path: `@lrnwebcomponents/${theme}/${theme}.js`,
      name: theme,
      variables: {
        image: "",
        hexCode: "#aeff00",
        cssVariable: "--simple-colors-default-theme-light-blue-7",
        icon: "av:closed-caption"
      }
    }
  };
  return site;
}

function recurseToJOS(parent, node, depth, sourceLink) {
  node.childNodes.forEach((node, index) => {
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.parent = parent.id;
      item.order = index;
      item.indent = depth;
      item.slug = a.getAttribute('href');
      item.location = baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'));
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        recurseToJOS(item, node.querySelector('ul'), depth+1, sourceLink);
      }
    }
  });
}