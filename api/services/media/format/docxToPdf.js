import { stdResponse } from "../../../utilities/requestHelpers.js";
import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';
import concat from "concat-stream";
import {create as toPDF } from 'html-pdf';

const generatePDF = (html) => {
    return new Promise (
        (resolve, reject) => {
            toPDF(html, {
                format: 'A4',
                orientation: 'portrait',
                margin: {
                    top: "10mm",
                    right: "10mm",
                    bottom: "10mm",
                    left: "10mm",
                },
                timeout: 30000,
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
  var string64 = '';
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
        string64 = await convertToHtml({buffer: buffer.data})
        .then(async (result) => {
            let html = `<html><body>${result.value}</body></html>`;
            return await generatePDF(html);
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
      },
      {
        methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
      }
    );
  });
  req.pipe(bb);
}