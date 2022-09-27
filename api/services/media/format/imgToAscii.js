import { stdResponse } from "../../../../utilities/requestHelpers.js";

import asciify from 'asciify-image';
import busboy from 'busboy';
import concat from "concat-stream";

export default async function handler(req, res) {
  var img = '';
  var buffer = {
    filename: null,
    data: null,
  };
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    // ensure we have a filename
    if(filename.length > 0 && mimeType.startsWith("image/") === true) {
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
        var options = {
            fit:    'box',
            width:  50,
            height: 25
        }
        img = await asciify(buffer.data, options)
            .then(function (asciified) {
              // Print asciified image to console
              console.log(asciified);
              return asciified;
            })
            .catch(function (err) {
            // Print error to console
            console.error(err);
            });
      }
      catch(e) {
        // put in the output
        img = e;
      }
    }
    res = stdResponse(res, 
      {
        filename: buffer.filename,
        image: img
      }
    );
  });
  req.pipe(bb);
}