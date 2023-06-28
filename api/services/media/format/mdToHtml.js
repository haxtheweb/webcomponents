import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

export default async function handler(req, res) {
  let body = {};
  if (req.query.md) {
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
    let headers = {
      cache: 180
    };
    if (body.raw) {
      headers.type = 'text/html';
    }
    
    stdResponse(res, await mdClass.render(md), headers);
  }
}