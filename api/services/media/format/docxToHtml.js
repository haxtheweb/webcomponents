import { stdResponse } from "../../../../utilities/requestHelpers.js";

import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';
import concat from "concat-stream";

export default async function handler(req, res) {
  var html = '';
  var img = '';
  var buffer = {
    filename: null,
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
        html = await convertToHtml({buffer: buffer.data})
        .then((result) => {
          return result.value; // The generated HTML
        });
      }
      catch(e) {
        // put in the output
        html = e;
      }
    }
    res = stdResponse(res,
      {
        contents: html,
        filename: buffer.filename,
      },
      {
        methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
      }
    );
  });
  req.pipe(bb);
}