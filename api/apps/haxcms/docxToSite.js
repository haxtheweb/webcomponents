// @haxcms/docxToSite
import { stdResponse } from "../../../../utilities/requestHelpers.js";
import { JSONOutlineSchemaItem } from "./lib/JSONOutlineSchemaItem.js";
import df from 'mammoth';
const { convertToHtml } = df;
import busboy from 'busboy';
import concat from "concat-stream";
import { parse } from 'node-html-parser';

export default async function handler(req, res) {
  var html = '';
  var buffer = {
    filename: null,
    data: null,
  };
  // this allows mapping document styles to html tags
  var mammothOptions = {
    styleMap: [
        "u => em", // convert underline to emphasis tag
        "strike => del" // convert strike to del tag instead of s
    ]
  };
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    if(filename.length > 0 && ['application/octet-stream', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
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
        html = await convertToHtml({buffer: buffer.data}, mammothOptions)
        .then((result) => {
          return result.value; // The generated HTML
        });
      }
      catch(e) {
        // put in the output
        html = e;
      }
    }
    const doc = parse(`<div id="wrapper">${html}</div>`);
    // find all the h1s, then h2, h3, h4
    // need like mode 1 2 3 4 based on
    /**
    h1 -> page, h2 -> child page, h3 -> child, of child page, h4 -> child, of child, of child page (full course structure)
    h1 -> page, h2 -> child page, h3 -> child, of child page, h4 -> heading (deeper structure; unit, topic, page)
    h1 -> page, h2 -> child page, h3 -> heading, h4 -> subheading (container + page + structure import)
    h1 -> page, h2 -> heading, h3 -> subheading, h4 -> sub-subheading (flat page structure import, file name === container)
    h1 -> heading, h2 -> subheading, h3 -> sub-subheading, h4 -> sub-sub-subheading (single page import)
     */
    var topLevel = doc.querySelectorAll('h1');
    if (topLevel.length === 0) {
      topLevel = doc.querySelectorAll('h2');
    }
    if (topLevel.length === 0) {
      topLevel = doc.querySelectorAll('h3');
    }
    for (const tag of topLevel) {
      let item = JSONOutlineSchemaItem();
      item.title = tag.innerText;
      // @todo need to run that "between tags" call that worked for page-break
    }
    res = stdResponse(res,
      {
        contents: html,
        filename: buffer.filename,
      }
    );
  });
  req.pipe(bb);
}