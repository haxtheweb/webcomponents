import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import pkg from 'html-to-docx';
const HTMLtoDOCX = pkg;

export default async function handler(req, res) {
  const body = stdPostBody(req);
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.html) {
    res = invalidRequest(res, 'missing `html` param');
  }
  else {
    var html = body.html;
    const docx = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    res = stdResponse(res, docx.toString('base64'), {
      cache: 180,
    });
  }
}