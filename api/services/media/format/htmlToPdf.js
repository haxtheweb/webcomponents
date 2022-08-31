import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";


export default async function handler(req, res) {
  const body = stdPostBody(req);
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.html) {
    res = invalidRequest(res, 'missing `html` param');
  }
  else {
    // need to outsource this endpoint from vercel 1 to 2 for scale reasons
    const base = body.base || '';
    var html = `<html><body>${body.html}</body></html>`;
    const pdf = await fetch(`https://pdf-from.elmsln.vercel.app/api/pdfFrom?type=html&url=${html}`);
    res = stdResponse(res, pdf, {cache: 86400 });
  }
}