import { stdResponse } from "../../../../utilities/requestHelpers.js";
import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';
import concat from "concat-stream";
import fetch from "node-fetch";
import { encode } from "base64-arraybuffer";

export default async function handler(req, res) {
  var string64 = '';
  var buffer = {
    data: null,
  };
  
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    if(filename.length > 0 && mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      file.pipe(concat((fileBuffer) => {
        buffer.filename = filename;
        buffer.data = fileBuffer;
      }));
    }
  });
  // file closed / finished
  bb.on('close', async () => {
    if (buffer.data) {
      try {
        string64 = await convertToHtml({buffer: buffer.data})
        .then(async (result) => {
              // need to outsource this endpoint from vercel 1 to 2 for scale reasons
            let html = `<html><body>${result.value}</body></html>`;
            const response = await fetch(`https://pdffrom-haxtheweb.vercel.app/api/pdfFrom`,
              {
                method: 'POST',
                body: JSON.stringify({
                  type: 'html',
                  url: html,
                }),
              }
            );
            const pdf = encode(await response.arrayBuffer());
            return pdf;
        });
      }
      catch(e) {
        // put in the output
        string64 = e;
      }
    }

    res = stdResponse(res, {
        filename: buffer.filename,
        pdf: string64
      }
    );
  });
  req.pipe(bb);
}