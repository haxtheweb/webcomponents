import { stdPostBody, stdResponse, invalidRequest } from "../../../../utilities/requestHelpers.js";
import fetch from "node-fetch";
import { encode } from "base64-arraybuffer";

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
    const base = `<base href="${body.base.replace('.stage-hax.vmhost.', '.hax.').replace('iam.hax.', 'oer.hax.')}"  />` || '';
    const magic = 'https://hax.psu.edu/cdn/1.x.x/';
    var html = `
    <html>
      <head>
        ${base}
      </head>
      <body>
        ${body.html}
      </body>
      <script>window.__appCDN="${magic}";</script>
      <script src="${magic}build.js"></script>
    </html>`;
    const response = await fetch(`https://pdf-from.elmsln.vercel.app/api/pdfFrom`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'html',
        url: html,
      }),
    }
    );
    console.log(response);
    const pdf = encode(await response.arrayBuffer());
    res = stdResponse(res, pdf, {cache: 86400 });
  }
}