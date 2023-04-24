import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

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
    var md = body.md;
    // md is actually a link reference so fetch it 1st
    if (body.type === 'link' && md) {
      md = await fetch(md.trim()).then((d) => d.ok ? d.text(): '');
    }
    let data = {
      content : await mdClass.render(md),
    };
    // pull head matter out into variables
    // need a regex for notion
    let reg = new RegExp(/#\s(.*?)\n\n?(.*?):\s(.*)\n(.*?):\s((.|\n)*?)\n\n/, 'igm');
    data.headMatter = md.match(reg)[0];
    let reg2 = new RegExp(/(.*?)(:\s)(.*)/, 'igm');
    data.mat = data.headMatter.match(reg2);
    // pull title into name of the page
    // pull data out into the fields of the page
    // create 1 JOS item from this info and converting the content

    // after that
    // figure out how to import multiple by scanning just the entry point file
    // need to hunt for titles after a git clone if possible
    // look for entry folder and take all names and split off the file from the UUID
    // use the UUID to inform the JOS item
    // loop through

    // then handle the files which we can repurpose for other importers
    // put all files to download into another field that HAXcms will then have to understand how to handle
    // rewrite the paths to those files
    let headers = {
      cache: 180
    };
    if (body.raw) {
      headers.type = 'text/html';
    }
    
    stdResponse(res, data.content, headers);
  }
}