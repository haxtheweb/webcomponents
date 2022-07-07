import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import {create as toPDF } from 'html-pdf';

const generatePDF = (html, base = '/') => {
  return new Promise (
      (resolve, reject) => {
          toPDF(html, {
              format: 'A4',
              orientation: 'portrait',
              border: ".5in",
              timeout: 30000,
              base: base,
          }).toBuffer((error, buffer) => {
              if(error) { 
                  reject(error) 
              }
              else {
                  resolve(buffer.toString('base64'))
              }
          });
      }
  )
}

export default async function handler(req, res) {
  const body = stdPostBody(req);
  if (body === null) {
    res = invalidRequest(res, 'missing body');
  }
  else if (!body.html) {
    res = invalidRequest(res, 'missing `html` param');
  }
  else {
    const base = body.base || '';
    var html = `<html><body>${body.html}</body></html>`;
    res = stdResponse(res, await generatePDF(html, base), {cache: 86400 });
  }
}