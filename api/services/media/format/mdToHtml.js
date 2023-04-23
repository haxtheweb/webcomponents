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
    // @todo make this part of a different parser
    if (body.extra === "notion") {
      // need a regex for notion
      let reg = new RegExp(/#\s(.*?)\n\n?(.*?):\s(.*)\n(.*?):\s((.|\n)*?)\n\n/, 'igm');
      data.headMatter = md.match(reg)[0];
      let reg2 = new RegExp(/(.*?)(:\s)(.*)/, 'igm');
      data.mat = data.headMatter.match(reg2);
    }
    let headers = {
      cache: 180
    };
    if (body.raw) {
      headers.type = 'text/html';
    }
    
    stdResponse(res, data.content, headers);
  }
}