import { fetch, stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import * as df from 'markdown-it';
const MarkdownIt = df.default;
const mdClass = new MarkdownIt();

export default async function handler(req, res) {
  const body = stdPostBody(req);
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
    stdResponse(res, await mdClass.render(md), {cache: 180 });
  }
}
