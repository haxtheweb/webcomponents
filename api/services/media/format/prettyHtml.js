import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import * as prettyJS from 'pretty';
const pretty = prettyJS.default;

export default async function handler(req, res) {
  let body = null;
  if (req.query.html) {
    body = req.query;
  }
  else {
    body = stdPostBody(req);
  }
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.html) {
    res = invalidRequest(res, 'missing `html` param');
  }
  else {
    var html = body.html;
    // md is actually a link reference so fetch it 1st
    if (body.type === 'link' && html) {
      html = await fetch(html.trim()).then((d) => d.ok ? d.text(): '');
    }
    stdResponse(res, await pretty(html, {ocd: true}), {cache: 180 });
  }
}