import { stdPostBody, stdResponse, invalidRequest } from "./requestHelpers.js";
import fetch from "node-fetch";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();
export default async function handler(req, res) {
  const postBody = stdPostBody(req, res);
  const body = postBody.body;
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.md) {
    res = invalidRequest(res, 'missing `md` param');
  }
  else {
    var md = body.md;
    // md is actually a link reference so fetch it 1st
    if (body.type === 'link' && md) {
      md = await fetch(md.trim()).then((d) => d.ok ? d.text(): '');
    }
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=180');
    stdResponse(res, await mdClass.render(md));
  }
}
