// @haxcms/docxToSite
import { stdResponse } from "../../../utilities/requestHelpers.js";
import { JSONOutlineSchemaItem } from "./lib/JSONOutlineSchemaItem.js";
import { cleanTitle, validURL } from "./lib/JOSHelpers.js";
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
  var type = "";
  var method = 'site';
  var parentId = null;
  // this allows mapping document styles to html tags
  var mammothOptions = {
    styleMap: [
        "u => em", // convert underline to emphasis tag
        "strike => del" // convert strike to del tag instead of s
    ]
  };
  const bb = busboy({ headers: req.headers });
  bb.on('field', async (name, fieldValue, info) => {
    if (name === 'method') {
      method = fieldValue;
    }
    else if (name === 'type') {
      type = fieldValue;
    }
    else if (name === 'parentId' && fieldValue !== 'null') {
      parentId = fieldValue;
    }
  });
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
    const doc = parse(`<div id="docx-import-wrapper">${html}</div>`);
    let items = [];
    // find all the h1s, then h2, h3, h4
    //https://vanillajstoolkit.com/helpers/nextuntil/
    // while we keep selecting next siblings, and its not another at our level
    // then we keep selecting
    // so it's a select all, then a while loop, then while it's not the next
    // element selection with support for the ending ones
    let order;
    switch (method) {
      // h1 -> page, h2 -> child page, h3 -> heading, h4 -> subheading (container + page + structure import)
      case 'site':
        let h1s = doc.querySelectorAll('h1');
        order = 0;
        for (const h1 of h1s) {
          let item = new JSONOutlineSchemaItem();
          item.title = h1.innerText.trim().replace('  ', ' ').replace('  ', ' ');
          item.slug = cleanTitle(item.title);
          item.order = order;
          item.parent = parentId; // null default, supports importing deep structure under a parent though
          order += 1;
          let tmp = nextUntilElement(h1, ['H1']);
          let h1Children = tmp.siblings;
          let contents = '';
          for (const h1Child of h1Children) {
            if (h1Child.tagName === 'H2') {
              // implies we need to drill down bc we have nested pages
              break;
            }
            else {
              contents += htmlFromEl(h1Children.pop());
            }
          }
          // if empty, make it a blank p so it has at least something
          item.contents = contents !== '' ? contents : getFallbackContent(type);
          items.push(item);
          // we found an h2 under an h1, associate down more
          if (h1Children.length > 0) {
            order = 0;
            let h2 = h1Children[0];
            while (h2 !== null && h2.tagName === 'H2') {
              let item2 = new JSONOutlineSchemaItem();
              item2.title = h2.innerText.trim().replace('  ', ' ').replace('  ', ' ');
              item2.slug = item.slug + '/' + cleanTitle(item2.title);
              item2.order = order;
              order += 1;
              item2.indent = 1;
              // this page's parent is the prev item
              item2.parent = item.id;
              // get next h2, or run out at an h1
              let tmp = nextUntilElement(h2, ['H1','H2']);
              let h2Children = tmp.siblings;
              h2 = tmp.lastEl;
              let contents2 = '';
              for (const h2Child of h2Children) {
                contents2 += htmlFromEl(h2Child);
              }
              item2.contents = contents2 !== '' ? contents2 : '<p></p>';
              items.push(item2);
            }
          }
        }
      break;
      // h1 -> page, h2 -> heading, h3 -> subheading, h4 -> sub-subheading (flat page structure import, file name === container)
      case 'branch':
        let els = doc.querySelectorAll('h1');
        order = 0;
        for (const h1 of els) {
          let item = new JSONOutlineSchemaItem();
          item.title = h1.innerText.trim().replace('  ', ' ').replace('  ', ' ');
          item.slug = cleanTitle(item.title);
          item.order = order;
          item.parent = parentId; // null default, supports importing structure under a parent though
          order += 1;
          let tmp = nextUntilElement(h1, ['H1']);
          let h1Children = tmp.siblings;
          let contents = '';
          for (const h1Child of h1Children) {
            contents += htmlFromEl(h1Child);
          }
          // if empty, make it a blank p so it has at least something
          item.contents = contents !== '' ? contents : getFallbackContent(type);
          items.push(item);
        }
      break;
      // h1 -> heading, h2 -> subheading, h3 -> sub-subheading, h4 -> sub-sub-subheading (single page import)
      case 'page':
        let item = new JSONOutlineSchemaItem();
        item.title = buffer.filename.replace('.docx','');
        item.slug = cleanTitle(item.title);
        item.parent = parentId; // null default, supports importing to a new page under a parent though
        // parser helps ensure validity of HTML structure, though it should
        // be ok given that it came from mammoth
        item.contents = doc.querySelector('#docx-import-wrapper').innerHTML;
      break;
    }
    res = stdResponse(res,
      {
        items: items,
        filename: buffer.filename,
      }
    );
  });
  req.pipe(bb);
}

// replacement for tabs, also support for single line video player calls
function htmlFromEl(el) {
  // test if this is a stand alone, valid URL
  if (validURL(el.innerText) && (
    el.innerText.includes('youtube.com') ||
    el.innerText.includes('youtu.be') ||
    el.innerText.includes('youtube-nocookie.com') ||
    el.innerText.includes('vimeo.com') ||
    el.innerText.includes('.mp4')
    )
  ) {
    return `<video-player source="${el.innerText}"></video-player>`;
  }
  // test for ! which implies a specififc tag is going to be inserted
  else if (el.innerText.startsWith('!') && el.innerText.includes('-')) {
    let tag = el.innerText.replace('!', '').trim();
    return `<${tag}></${tag}>`;
  }
  // test for a common convention for a place holder
  else if (el.innerText.startsWith('[') && el.innerText.endsWith(']')) {
    let text = el.innerText.replace('[','').replace(']','');
    return `<place-holder type="text" text="${text}"></place-holder>`;
  }
  // test for a more specific place holder convention
  else if (el.innerText.startsWith('>') || el.innerText.startsWith('&gt;')) {
    let tmp = el.innerText.split(':');
    if (tmp.length > 1) {
      let type = tmp.shift().replace('>','').replace('&gt;','');
      let text = tmp.join(':').trim();
      return `<place-holder type="${type}" text="${text}"></place-holder>`;
    }
  }
  return el.outerHTML.replace(/\t/g, '');
}

// based on https://vanillajstoolkit.com/helpers/nextuntil/
function nextUntilElement(elem, tagMatches) {
	// Setup siblings array
	var siblings = [];
	// Get the next sibling element
	elem = elem.nextElementSibling;
	// As long as a sibling exists
	while (elem) {
		// If we've reached a tag name we want to stop on, bail
		if (tagMatches.includes(elem.tagName)) break;
		// Otherwise, push it to the siblings array
		siblings.push(elem);
		// Get the next sibling element
		elem = elem.nextElementSibling;
	}
	return {
    siblings: siblings,
    lastEl: elem,
  }
};

function getFallbackContent(type) {
  switch (type) {
    case 'portfolio':
      return `<p>Enjoy my portfolio and let me know if you have questions.</p>
<lesson-overview>
  <lesson-highlight smart="pages"></lesson-highlight>
</lesson-overview>`;
    break;
    case 'course':
    return `<p>Welcome to the lesson.</p>
<lesson-overview>
  <lesson-highlight smart="pages"></lesson-highlight>
  <lesson-highlight smart="readTime"></lesson-highlight>
  <lesson-highlight smart="selfChecks"></lesson-highlight>
  <lesson-highlight smart="audio"></lesson-highlight>
  <lesson-highlight smart="video"></lesson-highlight>
</lesson-overview>
<p>Let's begin!</p>`;
    break;
    default:
      return '<p></p>';
    break;
  }
}