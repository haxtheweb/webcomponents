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
var downloads = {};
var fileMap = {};
export default async function handler(req, res) {
  let body = {};
  body = stdPostBody(req);
  if (!body || !body.md) {
    res = invalidRequest(res, 'missing `md` param');
  }
  else {
    const sourceLink = body.md;
    let tmp = new URL(sourceLink);
    // ensure we end in /SUMMARY.md or else we don't know what to load up
    //https://raw.githubusercontent.com/dmd-program/dmd-300-master/master/SUMMARY.md
    //https://github.com/dmd-program/dmd-300-master
    // ensure we go from github to raw git response for the md
    if (tmp.href.indexOf("github.com")) {
      tmp.href = tmp.href.replace('github.com', 'raw.githubusercontent.com');
    }
    // if we have /blob/ that's on the frontend so remove it from the path
    if (tmp.href.indexOf('/blob/')) {
      tmp.href = tmp.href.replace('/blob/','/');
    }
    // if we lack summary, add it in
    if (tmp.href.indexOf('SUMMARY.md') == -1) {
      tmp.href += '/master/SUMMARY.md';
    }
    let url = sourceLink.trim();
    let pieces = url.replace("https://github.com/","").split('/');
    const owner = pieces[0];
    const repo = pieces[1];
    let basePath = `https://api.github.com/repos/${owner}/${repo}`;
    var branch = await fetch(`${basePath}`).then((d) => d.ok ? d.json(): {}).then(d => d.default_branch);
    var filepathBase = '';
    var githubData = await fetch(`${basePath}/git/trees/${branch}?recursive=1`).then((d) => d.ok ? d.json(): {}).then(d => d.tree);
    // establish file map and base path for all files PRIOR to getting contents
    for await (const ghFile of githubData) {
      // should be 1st file in the tree
      if (ghFile.path.indexOf('.md') === -1) {
        // it's a file that we need to account for later on when we download the files
        // ignore folders
        if (ghFile.path.indexOf('.') !== -1) {
          downloads[encodeURI(`files/${ghFile.path}`)] = encodeURI(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${ghFile.path}`);
          fileMap[encodeURI(`files/${ghFile.path}`)] = encodeURI(ghFile.path.replace(`${filepathBase}/`,''));
        }
      }
    }


    // md is a link
    let md = await fetch(tmp.href.trim()).then((d) => d.ok ? d.text(): '');
    let name = tmp.pathname.split('/')[1] || 'New site';
    const JOS = await listToJOS(await mdClass.render(md), tmp.href.trim(), name);
    stdResponse(res, {
      data: {
        items: JOS.items,
        filename: name,
        files: downloads
      },
      status: 200
    }, {cache: 180, type: "application/json" });
  }
}

async function listToJOS(html, sourceLink, name) {
  const doc = parse(`<div>${html}</div>`);
  let top = doc.querySelector('ul');
  for (var index in top.childNodes) {
    let node = top.childNodes[index];
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.parent = null;
      item.order = index;
      item.indent = 0;
      item.slug = a.getAttribute('href');
      item.location = `content/${a.getAttribute('href')}`;
      item.contents = await fetch(baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'))).then((d) => d.ok ? d.text(): '');
      // replace all file references
      for await (const file of Object.keys(fileMap)) {
        item.contents = item.contents.replaceAll(fileMap[file], file);
      }
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        await recurseToJOS(item, node.querySelector('ul'), 1, sourceLink);
      }
    }
  }
  return site;
}

async function recurseToJOS(parent, top, depth, sourceLink) {
  for (var index in top.childNodes) {
    let node = top.childNodes[index];
    if (node.tagName === 'LI') {
      let item = new JSONOutlineSchemaItem();
      let a = node.querySelector('a');
      item.title = a.innerText;
      item.parent = parent.id;
      item.order = index;
      item.indent = depth;
      item.slug = a.getAttribute('href');
      item.location = `content/${a.getAttribute('href')}`;
      item.contents = await fetch(baseMdUrl + sourceLink.replace('SUMMARY.md', a.getAttribute('href'))).then((d) => d.ok ? d.text(): '');
      // replace all file references
      for await (const file of Object.keys(fileMap)) {
        item.contents = item.contents.replaceAll(fileMap[file], file);
      }
      site.addItem(item);
      // see if we have items under here
      if (node.querySelector('ul')) {
        await recurseToJOS(item, node.querySelector('ul'), depth+1, sourceLink);
      }
    }
  }
}