/**
 * A collection of utility functions exported for convenience
 */
import { isWebKit, isSafari } from "./lib/browser.js";
import { copyToClipboard } from "./lib/clipboard.js";
import { normalizeEventPath } from "./lib/events.js";
import { generateResourceID } from "./lib/ids.js";
import { detectMarkdown, markdownToHTML } from "./lib/markdown.js";
import {
  objectValFromStringPos,
  valueMapTransform,
  varExists,
  varGet,
} from "./lib/object-path.js";
import {
  getRange,
  internalGetShadowSelection,
  isElementInViewport,
  ReplaceWithPolyfill,
} from "./lib/selection.js";
import { wipeSlot } from "./lib/slot.js";
import {
  badURLProtocols,
  hasUnsafeURLProtocol,
  sanitizeEmbeddableURL,
  sanitizeURLValue,
} from "./lib/url.js";
export {
  badURLProtocols,
  copyToClipboard,
  detectMarkdown,
  generateResourceID,
  getRange,
  hasUnsafeURLProtocol,
  internalGetShadowSelection,
  isElementInViewport,
  isSafari,
  isWebKit,
  markdownToHTML,
  normalizeEventPath,
  objectValFromStringPos,
  ReplaceWithPolyfill,
  sanitizeEmbeddableURL,
  sanitizeURLValue,
  valueMapTransform,
  varExists,
  varGet,
  wipeSlot,
};
export var badJSEventAttributes = [
  // these are all leaker JS event attributes we don't allow
  "onabort",
  "onanimationcancel",
  "onanimationend",
  "onanimationiteration",
  "onanimationstart",
  "onauxclick",
  "onafterprint",
  "onbeforematch",
  "onbeforeinput",
  "onbeforeprint",
  "onbeforeunload",
  "onbeforetoggle",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncontextlost",
  "oncontextmenu",
  "oncontextrestored",
  "oncontentvisibilityautostatechange",
  "oncopy",
  "oncuechange",
  "oncut",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onfocusin",
  "onfocusout",
  "onformdata",
  "onhashchange",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onlanguagechange",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onmessage",
  "onmessageerror",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onoffline",
  "ononline",
  "onpagehide",
  "onpageshow",
  "onpaste",
  "onpause",
  "onpointercancel",
  "onpointerdown",
  "onpointerenter",
  "onpointerleave",
  "onpointermove",
  "onpointerout",
  "onpointerover",
  "onpointerrawupdate",
  "onpointerup",
  "onplay",
  "onplaying",
  "onpopstate",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onrejectionhandled",
  "onscroll",
  "onscrollend",
  "onsecuritypolicyviolation",
  "onseeked",
  "onseeking",
  "onselect",
  "onslotchange",
  "onstalled",
  "onstorage",
  "onsubmit",
  "onsuspend",
  "ontouchcancel",
  "ontouchend",
  "ontouchmove",
  "ontouchstart",
  "ontimeupdate",
  "ontoggle",
  "ontransitioncancel",
  "ontransitionend",
  "ontransitionrun",
  "ontransitionstart",
  "onunhandledrejection",
  "onunload",
  "onvolumechange",
  "onwaiting",
  "onwheel",
];
export var badIFrameAttributes = ["srcdoc"];

export function isURLAttribute(attributeName) {
  if (!attributeName || typeof attributeName !== "string") {
    return false;
  }
  const name = attributeName.toLowerCase();
  return (
    [
      "src",
      "srcset",
      "source",
      "url",
      "link-url",
      "href",
      "xlink:href",
      "action",
      "formaction",
      "poster",
      "data",
      "cite",
    ].includes(name) || /(^|[-_:])(src|source|href|url)$/.test(name)
  );
}

export function removeUnsafeURLAttributes(el) {
  if (!el) {
    return el;
  }
  let replacements = [];
  if (el.attributes) {
    replacements.push(el);
  }
  if (el.querySelectorAll) {
    const nested = el.querySelectorAll("*");
    for (let i = 0; i < nested.length; i++) {
      replacements.push(nested[i]);
    }
  }
  for (let i = 0; i < replacements.length; i++) {
    if (!replacements[i].attributes) {
      continue;
    }
    for (let j = replacements[i].attributes.length - 1; j >= 0; j--) {
      const attr = replacements[i].attributes.item(j);
      if (
        attr &&
        isURLAttribute(attr.name) &&
        hasUnsafeURLProtocol(attr.value)
      ) {
        replacements[i].removeAttribute(attr.name);
      }
    }
  }
  return el;
}

function isIframeLikeElement(el) {
  return (
    el && el.tagName && ["iframe", "webview"].includes(el.tagName.toLowerCase())
  );
}

export function removeUnsafeIframeAttributes(el) {
  if (!el) {
    return el;
  }
  let replacements = [];
  if (isIframeLikeElement(el)) {
    replacements.push(el);
  }
  if (el.querySelectorAll) {
    const nested = el.querySelectorAll("iframe, webview");
    for (let i = 0; i < nested.length; i++) {
      replacements.push(nested[i]);
    }
  }
  for (let i = 0; i < replacements.length; i++) {
    for (let j = 0; j < badIFrameAttributes.length; j++) {
      replacements[i].removeAttribute(badIFrameAttributes[j]);
    }
    const src = replacements[i].getAttribute("src");
    const safeSrc = sanitizeEmbeddableURL(src, "");
    if (safeSrc === "") {
      replacements[i].removeAttribute("src");
    } else if (safeSrc !== src) {
      replacements[i].setAttribute("src", safeSrc);
    }
  }
  return el;
}

export function removeBadJSEventAttributes(el) {
  // remove any bad event attributes that might have snuck in
  if (el) {
    if (el.attributes) {
      // remove any attributes that are not allowed
      for (let i = 0; i < badJSEventAttributes.length; i++) {
        el.removeAttribute(badJSEventAttributes[i]);
        // regex the innerHTML to remove the current attribute
        let replacement = el.querySelectorAll(`[${badJSEventAttributes[i]}]`);
        for (let j = 0; j < replacement.length; j++) {
          replacement[j].removeAttribute(badJSEventAttributes[i]);
        }
      }
    }
    removeUnsafeIframeAttributes(el);
    removeUnsafeURLAttributes(el);
  }
  return el;
}
export function sanitizeNodeTree(
  root,
  { sanitizeTemplateContents = true } = {},
) {
  if (!root) {
    return root;
  }
  if (root.nodeType === globalThis.Node.ELEMENT_NODE) {
    removeBadJSEventAttributes(root);
    if (
      sanitizeTemplateContents &&
      root.tagName &&
      root.tagName.toLowerCase() === "template" &&
      root.content
    ) {
      sanitizeNodeTree(root.content, {
        sanitizeTemplateContents: sanitizeTemplateContents,
      });
    }
  }
  if (root.childNodes && root.childNodes.length > 0) {
    for (let i = 0; i < root.childNodes.length; i++) {
      const child = root.childNodes[i];
      if (
        child.nodeType === globalThis.Node.ELEMENT_NODE ||
        child.nodeType === globalThis.Node.DOCUMENT_FRAGMENT_NODE
      ) {
        sanitizeNodeTree(child, {
          sanitizeTemplateContents: sanitizeTemplateContents,
        });
      }
    }
  }
  return root;
}
export function sanitizeHTMLForImport(
  html,
  { sanitizeTemplateContents = true, encapsulateScriptTags = true } = {},
) {
  const safeHTML = encapsulateScriptTags
    ? encapScript(typeof html === "string" ? html : "")
    : typeof html === "string"
      ? html
      : "";
  const template = globalThis.document.createElement("template");
  template.innerHTML = safeHTML;
  sanitizeNodeTree(template.content, {
    sanitizeTemplateContents: sanitizeTemplateContents,
  });
  return template.content.cloneNode(true);
}

/**
 * Convert a base64 encoded string to type Blob
 * @param {String} b64Data - base64 encoded string
 * @param {String} contentType - type to mark as the encoding of the blob
 * @param {Number} sliceSize - size of chunks
 * @returns {Blob} class blob for file operations
 */
export function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

/**
 * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
 */
export function CSVtoArray(text) {
  let p = "",
    row = [""],
    ret = [row],
    i = 0,
    r = 0,
    s = !0,
    l;
  for (l in text) {
    l = text[l];
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      if ("\r" === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}
/**
 * Check source of the video, potentially correcting bad links.
 */
export function cleanVideoSource(input) {
  input = sanitizeEmbeddableURL(input, "");
  if (input === "") {
    return input;
  }
  // strip off the ? modifier for youtube/vimeo so we can build ourselves
  var tmp = input.split("?");
  var v = "";
  input = tmp[0];
  if (tmp.length == 2) {
    let tmp2 = tmp[1].split("&"),
      args = tmp2[0].split("="),
      qry = Array.isArray(tmp2.shift()) ? tmp2.shift().join("") : tmp2.shift();
    if (args[0] == "v") {
      let q = qry !== undefined && qry !== "" ? "?" + qry : "";
      v = args[1] + q;
    }
  }
  // link to the vimeo video instead of the embed player address
  if (
    input.indexOf("player.vimeo.com") == -1 &&
    input.indexOf("vimeo.com") != -1
  ) {
    // normalize what the API will return since it is API based
    // and needs cleaned up for front-end
    if (input.indexOf("/videos/") != -1) {
      input = input.replace("/videos/", "/");
    }
    return input.replace("vimeo.com/", "player.vimeo.com/video/");
  }
  // copy and paste from the URL
  else if (input.indexOf("youtube.com/watch") != -1) {
    return input.replace("youtube.com/watch", "youtube.com/embed/") + v;
  }
  // copy and paste from the URL
  else if (input.indexOf("youtube-no-cookie.com/") != -1) {
    return input.replace("youtube-no-cookie.com/", "youtube.com/") + v;
  }
  // weird share-ly style version
  else if (input.indexOf("youtu.be") != -1) {
    return input.replace("youtu.be/", "www.youtube.com/embed/") + v;
  }
  // copy and paste from the URL for sketchfab
  else if (
    input.indexOf("sketchfab.com") != -1 &&
    input.indexOf("/embed") == -1
  ) {
    return input + "/embed";
  }
  return input;
}
// wrap an element with another; super basic but makes it consistent across our apps
function wrap(el, wrapper) {
  if (el && el.parentNode) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }
}

// shadowDOM consumption of lightDOM
// this is useful for progressive enhancement and other
// edge cases where we want HTML rendered in lightDOM but
// then be consumed and rendered as part of the shadowDOM
// tracking, self updating web engines, and SEO among reasons
export function lightChildrenToShadowRootSelector(el, selector) {
  let child = el.firstElementChild;
  while (child) {
    el.shadowRoot.querySelector(selector).appendChild(child);
    child = el.firstElementChild;
  }
}

/**
 * Wrap an array of items all at once
 */
function wrapAll(ary, wrapper) {
  if (ary && ary.length) {
    ary[0].parentNode.insertBefore(wrapper, ary[0]);
    for (var i in ary) {
      wrapper.appendChild(ary[i]);
    }
  }
}

// unwrap away from an element; super basic but makes it consistent across our apps
function unwrap(el) {
  if (el && el.parentNode) {
    // move all children out of the element
    while (el.firstChild) {
      el.parentNode.insertBefore(el.firstChild, el);
    }
    // remove the empty element
    el.remove();
  }
}

// based on https://github.com/max-mapper/commonjs-html-prettyprinter/blob/v1.0.0/lib/html.js#L39
function formatHTML(html_source, options) {
  //Wrapper function to invoke all the necessary constructors and deal with the output.

  var multi_parser,
    indent_size,
    indent_character,
    max_char,
    brace_style,
    unformatted;

  options = options || {};
  indent_size = options.indent_size || 2;
  indent_character = options.indent_char || " ";
  brace_style = options.brace_style || "collapse";
  max_char = options.max_char == 0 ? Infinity : options.max_char || 80;
  unformatted = options.unformatted || [
    "template",
    "code-sample",
    "simple-icon",
    "vocab-term",
    "inline-audio",
    "lrn-math",
    "oer-schema",
    "moar-sarcasm",
    "a",
    "span",
    "bdo",
    "em",
    "strong",
    "dfn",
    "code",
    "mark",
    "samp",
    "kbd",
    "var",
    "cite",
    "abbr",
    "acronym",
    "q",
    "sub",
    "sup",
    "tt",
    "i",
    "b",
    "big",
    "small",
    "u",
    "s",
    "strike",
    "font",
    "ins",
    "del",
    "pre",
    "address",
    "dt",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ];
  function Parser() {
    this.pos = 0; //Parser position
    this.token = "";
    this.current_mode = "CONTENT"; //reflects the current Parser mode: TAG/CONTENT
    this.tags = {
      //An object to hold tags, their position, and their parent-tags, initiated with default values
      parent: "parent1",
      parentcount: 1,
      parent1: "",
    };
    this.tag_type = "";
    this.token_text = this.last_token = this.last_text = this.token_type = "";

    this.Utils = {
      //Uilities made available to the various functions
      whitespace: "\n\r\t ".split(""),
      single_token:
        "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?=".split(
          ",",
        ), //all the single tags for HTML
      extra_liners: "head,body,/html".split(","), //for tags that need a line of whitespace before them
      in_array: function (what, arr) {
        for (var i = 0; i < arr.length; i++) {
          if (what === arr[i]) {
            return true;
          }
        }
        return false;
      },
    };

    this.get_content = function () {
      //function to capture regular content between tags

      var input_char = "",
        content = [],
        space = false; //if a space is needed

      while (this.input.charAt(this.pos) !== "<") {
        if (this.pos >= this.input.length) {
          return content.length ? content.join("") : ["", "TK_EOF"];
        }

        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (content.length) {
            space = true;
          }
          this.line_char_count--;
          continue; //don't want to insert unnecessary space
        } else if (space) {
          if (this.line_char_count >= this.max_char) {
            //insert a line when the max_char is reached
            content.push("\n");
            for (var i = 0; i < this.indent_level; i++) {
              content.push(this.indent_string);
            }
            this.line_char_count = 0;
          } else {
            content.push(" ");
            this.line_char_count++;
          }
          space = false;
        }
        content.push(input_char); //letter at-a-time (or string) inserted to an array
      }
      return content.length ? content.join("") : "";
    };

    this.get_contents_to = function (name) {
      //get the full content of a script or style to pass to js_beautify
      if (this.pos == this.input.length) {
        return ["", "TK_EOF"];
      }
      var input_char = "";
      var content = "";
      var reg_match = new RegExp("</" + name + "\\s*>", "igm");
      reg_match.lastIndex = this.pos;
      var reg_array = reg_match.exec(this.input);
      var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
      if (this.pos < end_script) {
        //get everything in between the script tags
        content = this.input.substring(this.pos, end_script);
        this.pos = end_script;
      }
      return content;
    };

    this.record_tag = function (tag) {
      //function to record a tag and its parent in this.tags Object
      if (this.tags[tag + "count"]) {
        //check for the existence of this tag type
        this.tags[tag + "count"]++;
        this.tags[tag + this.tags[tag + "count"]] = this.indent_level; //and record the present indent level
      } else {
        //otherwise initialize this tag type
        this.tags[tag + "count"] = 1;
        this.tags[tag + this.tags[tag + "count"]] = this.indent_level; //and record the present indent level
      }
      this.tags[tag + this.tags[tag + "count"] + "parent"] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
      this.tags.parent = tag + this.tags[tag + "count"]; //and make this the current parent (i.e. in the case of a div 'div1')
    };

    this.retrieve_tag = function (tag) {
      //function to retrieve the opening tag to the corresponding closer
      if (this.tags[tag + "count"]) {
        //if the openener is not in the Object we ignore it
        var temp_parent = this.tags.parent; //check to see if it's a closable tag.
        while (temp_parent) {
          //till we reach '' (the initial value);
          if (tag + this.tags[tag + "count"] === temp_parent) {
            //if this is it use it
            break;
          }
          temp_parent = this.tags[temp_parent + "parent"]; //otherwise keep on climbing up the DOM Tree
        }
        if (temp_parent) {
          //if we caught something
          this.indent_level = this.tags[tag + this.tags[tag + "count"]]; //set the indent_level accordingly
          this.tags.parent = this.tags[temp_parent + "parent"]; //and set the current parent
        }
        delete this.tags[tag + this.tags[tag + "count"] + "parent"]; //delete the closed tags parent reference...
        delete this.tags[tag + this.tags[tag + "count"]]; //...and the tag itself
        if (this.tags[tag + "count"] == 1) {
          delete this.tags[tag + "count"];
        } else {
          this.tags[tag + "count"]--;
        }
      }
    };

    this.get_tag = function () {
      //function to get a full tag and parse its type
      var input_char = "",
        content = [],
        space = false,
        tag_start,
        tag_end;

      do {
        if (this.pos >= this.input.length) {
          return content.length ? content.join("") : ["", "TK_EOF"];
        }

        input_char = this.input.charAt(this.pos);
        this.pos++;
        this.line_char_count++;

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          //don't want to insert unnecessary space
          space = true;
          this.line_char_count--;
          continue;
        }

        if (input_char === "'" || input_char === '"') {
          if (!content[1] || content[1] !== "!") {
            //if we're in a comment strings don't get treated specially
            input_char += this.get_unformatted(input_char);
            space = true;
          }
        }

        if (input_char === "=") {
          //no space before =
          space = false;
        }

        if (
          content.length &&
          content[content.length - 1] !== "=" &&
          input_char !== ">" &&
          space
        ) {
          //no space after = or before >
          if (this.line_char_count >= this.max_char) {
            this.print_newline(false, content);
            this.line_char_count = 0;
          } else {
            content.push(" ");
            this.line_char_count++;
          }
          space = false;
        }
        if (input_char === "<") {
          tag_start = this.pos - 1;
        }
        content.push(input_char); //inserts character at-a-time (or string)
      } while (input_char !== ">");

      var tag_complete = content.join("");
      var tag_index;
      if (tag_complete.indexOf(" ") != -1) {
        //if there's whitespace, thats where the tag name ends
        tag_index = tag_complete.indexOf(" ");
      } else {
        //otherwise go with the tag ending
        tag_index = tag_complete.indexOf(">");
      }
      var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
      if (
        tag_complete.charAt(tag_complete.length - 2) === "/" ||
        this.Utils.in_array(tag_check, this.Utils.single_token)
      ) {
        //if this tag name is a single tag type (either in the list or has a closing /)
        this.tag_type = "SINGLE";
      } else if (tag_check === "script") {
        //for later script handling
        this.record_tag(tag_check);
        this.tag_type = "SCRIPT";
      } else if (tag_check === "style") {
        //for future style handling (for now it justs uses get_content)
        this.record_tag(tag_check);
        this.tag_type = "STYLE";
      } else if (this.Utils.in_array(tag_check, unformatted)) {
        // do not reformat the "unformatted" tags
        var comment = this.get_unformatted(
          "</" + tag_check + ">",
          tag_complete,
        ); //...delegate to get_unformatted function
        content.push(comment);
        // Preserve collapsed whitespace either before or after this tag.
        if (
          tag_start > 0 &&
          this.Utils.in_array(
            this.input.charAt(tag_start - 1),
            this.Utils.whitespace,
          )
        ) {
          content.splice(0, 0, this.input.charAt(tag_start - 1));
        }
        tag_end = this.pos - 1;
        if (
          this.Utils.in_array(
            this.input.charAt(tag_end + 1),
            this.Utils.whitespace,
          )
        ) {
          content.push(this.input.charAt(tag_end + 1));
        }
        this.tag_type = "SINGLE";
      } else if (tag_check.charAt(0) === "!") {
        //peek for <!-- comment
        if (tag_check.indexOf("[if") != -1) {
          //peek for <!--[if conditional comment
          if (tag_complete.indexOf("!IE") != -1) {
            //this type needs a closing --> so...
            var comment = this.get_unformatted("-->", tag_complete); //...delegate to get_unformatted
            content.push(comment);
          }
          this.tag_type = "START";
        } else if (tag_check.indexOf("[endif") != -1) {
          //peek for <!--[endif end conditional comment
          this.tag_type = "END";
          this.unindent();
        } else if (tag_check.indexOf("[cdata[") != -1) {
          //if it's a <[cdata[ comment...
          var comment = this.get_unformatted("]]>", tag_complete); //...delegate to get_unformatted function
          content.push(comment);
          this.tag_type = "SINGLE"; //<![CDATA[ comments are treated like single tags
        } else {
          var comment = this.get_unformatted("-->", tag_complete);
          content.push(comment);
          this.tag_type = "SINGLE";
        }
      } else {
        if (tag_check.charAt(0) === "/") {
          //this tag is a double tag so check for tag-ending
          this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
          this.tag_type = "END";
        } else {
          //otherwise it's a start-tag
          this.record_tag(tag_check); //push it on the tag stack
          this.tag_type = "START";
        }
        if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
          //check if this double needs an extra line
          this.print_newline(true, this.output);
        }
      }
      return content.join(""); //returns fully formatted tag
    };

    this.get_unformatted = function (delimiter, orig_tag) {
      //function to return unformatted content in its entirety

      if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) != -1) {
        return "";
      }
      var input_char = "";
      var content = "";
      var space = true;
      do {
        if (this.pos >= this.input.length) {
          return content;
        }

        input_char = this.input.charAt(this.pos);
        this.pos++;

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          if (!space) {
            this.line_char_count--;
            continue;
          }
          if (input_char === "\n" || input_char === "\r") {
            content += "\n";
            /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
              for (var i=0; i<this.indent_level; i++) {
                content += this.indent_string;
              }
              space = false; //...and make sure other indentation is erased
              */
            this.line_char_count = 0;
            continue;
          }
        }
        content += input_char;
        this.line_char_count++;
        space = true;
      } while (content.toLowerCase().indexOf(delimiter) == -1);
      return content;
    };

    this.get_token = function () {
      //initial handler for token-retrieval
      var token;

      if (
        this.last_token === "TK_TAG_SCRIPT" ||
        this.last_token === "TK_TAG_STYLE"
      ) {
        //check if we need to format javascript
        var type = this.last_token.substr(7);
        token = this.get_contents_to(type);
        if (typeof token !== "string") {
          return token;
        }
        return [token, "TK_" + type];
      }
      if (this.current_mode === "CONTENT") {
        token = this.get_content();
        if (typeof token !== "string") {
          return token;
        } else {
          return [token, "TK_CONTENT"];
        }
      }

      if (this.current_mode === "TAG") {
        token = this.get_tag();
        if (typeof token !== "string") {
          return token;
        } else {
          var tag_name_type = "TK_TAG_" + this.tag_type;
          return [token, tag_name_type];
        }
      }
    };

    this.get_full_indent = function (level) {
      level = this.indent_level + level || 0;
      if (level < 1) return "";

      return Array(level + 1).join(this.indent_string);
    };

    this.printer = function (
      js_source,
      indent_character,
      indent_size,
      max_char,
      brace_style,
    ) {
      //handles input/output and some other printing functions

      this.input = js_source || ""; //gets the input for the Parser
      this.output = [];
      this.indent_character = indent_character;
      this.indent_string = "";
      this.indent_size = indent_size;
      this.brace_style = brace_style;
      this.indent_level = 0;
      this.max_char = max_char;
      this.line_char_count = 0; //count to see if max_char was exceeded

      for (var i = 0; i < this.indent_size; i++) {
        this.indent_string += this.indent_character;
      }

      this.print_newline = function (ignore, arr) {
        this.line_char_count = 0;
        if (!arr || !arr.length) {
          return;
        }
        if (!ignore) {
          //we might want the extra line
          while (
            this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)
          ) {
            arr.pop();
          }
        }
        arr.push("\n");
        for (var i = 0; i < this.indent_level; i++) {
          arr.push(this.indent_string);
        }
      };

      this.print_token = function (text) {
        this.output.push(text);
      };

      this.indent = function () {
        this.indent_level++;
      };

      this.unindent = function () {
        if (this.indent_level > 0) {
          this.indent_level--;
        }
      };
    };
    return this;
  }

  /*_____________________--------------------_____________________*/

  multi_parser = new Parser(); //wrapping functions Parser
  multi_parser.printer(
    html_source,
    indent_character,
    indent_size,
    max_char,
    brace_style,
  ); //initialize starting values

  while (true) {
    var t = multi_parser.get_token();
    multi_parser.token_text = t[0];
    multi_parser.token_type = t[1];

    if (multi_parser.token_type === "TK_EOF") {
      break;
    }

    switch (multi_parser.token_type) {
      case "TK_TAG_START":
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.indent();
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_STYLE":
      case "TK_TAG_SCRIPT":
        multi_parser.print_newline(false, multi_parser.output);
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_END":
        //Print new line only if the tag has no content and has child
        if (
          multi_parser.last_token === "TK_CONTENT" &&
          multi_parser.last_text === ""
        ) {
          var tag_name = multi_parser.token_text.match(/\w+/)[0];
          var tag_extracted_from_last_output =
            multi_parser.output[multi_parser.output.length - 1].match(
              /<\s*(\w+)/,
            );
          if (
            tag_extracted_from_last_output === null ||
            tag_extracted_from_last_output[1] !== tag_name
          )
            multi_parser.print_newline(true, multi_parser.output);
        }
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_TAG_SINGLE":
        // Don't add a newline before elements that should remain unformatted.
        var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
        if (
          !tag_check ||
          !multi_parser.Utils.in_array(tag_check[1], unformatted)
        ) {
          multi_parser.print_newline(false, multi_parser.output);
        }
        multi_parser.print_token(multi_parser.token_text);
        multi_parser.current_mode = "CONTENT";
        break;
      case "TK_CONTENT":
        if (multi_parser.token_text !== "") {
          multi_parser.print_token(multi_parser.token_text);
        }
        multi_parser.current_mode = "TAG";
        break;
      case "TK_STYLE":
      case "TK_SCRIPT":
        if (multi_parser.token_text !== "") {
          multi_parser.output.push("\n");
          var text = multi_parser.token_text;
          if (multi_parser.token_type == "TK_SCRIPT") {
            var _beautifier = typeof js_beautify == "function" && js_beautify;
          } else if (multi_parser.token_type == "TK_STYLE") {
            var _beautifier = typeof css_beautify == "function" && css_beautify;
          }

          if (options.indent_scripts == "keep") {
            var script_indent_level = 0;
          } else if (options.indent_scripts == "separate") {
            var script_indent_level = -multi_parser.indent_level;
          } else {
            var script_indent_level = 1;
          }

          var indentation = multi_parser.get_full_indent(script_indent_level);
          if (_beautifier) {
            // call the Beautifier if avaliable
            text = _beautifier(text.replace(/^\s*/, indentation), options);
          } else {
            // simply indent the string otherwise
            var white = text.match(/^\s*/)[0];
            var _level =
              white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string)
                .length - 1;
            var reindent = multi_parser.get_full_indent(
              script_indent_level - _level,
            );
            text = text
              .replace(/^\s*/, indentation)
              .replace(/\r\n|\r|\n/g, "\n" + reindent)
              .replace(/\s*$/, "");
          }
          if (text) {
            multi_parser.print_token(text);
            multi_parser.print_newline(true, multi_parser.output);
          }
        }
        multi_parser.current_mode = "TAG";
        break;
    }
    multi_parser.last_token = multi_parser.token_type;
    multi_parser.last_text = multi_parser.token_text;
  }
  return multi_parser.output.join("");
}

// with type, safely get data from local storage (assumes it was set using the setter below)
export function localStorageGet(name, defaultValue = "") {
  try {
    if (localStorage.getItem(name) === null) {
      return defaultValue;
    }
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return false;
  }
}

// convert mimetype into a readable file extension
export function mimeTypeToName(mimeType) {
  let data = mimeType.split("/");
  switch (data[1]) {
    case "msword":
      return ".doc";
    case "application/vnd.ms-excel":
      return ".xls";
    case "vnd.ms-powerpoint":
      return ".ppt";
    case "vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";
    case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return ".xlsx";
    case "vnd.openxmlformats-officedocument.presentationml.presentation":
      return ".pptx";
    case "mpeg":
      return ".mp3";
    case "svg+xml":
      return ".svg";
    case "markdown":
      return ".md";
    case "plain":
      return "text";
    case "text":
      return ".txt";
    case "rtf":
    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
    case "webm":
    case "webp":
    case "html":
    case "htm":
    case "zip":
    case "csv":
    case "pdf":
    case "mp4":
      return `.${data[1]}`;
  }

  return "file";
}

// set type safe variables
export function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, JSON.stringify(newItem));
  } catch (e) {
    return false;
  }
}

// delete item from local storage
export function localStorageDelete(name) {
  try {
    return localStorage.removeItem(name);
  } catch (e) {
    return false;
  }
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  let url;
  try {
    url = new URL(str);
  } catch (e) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator
    return !!pattern.test(str);
  }
  return url.protocol === "https:";
}

/**
 * Helper to convert camel case to dash; important when setting attributes.
 */
function camelToDash(str) {
  return str
    .replace(/\W+/g, "-")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Helper to convert dash to camel; important when reading attributes.
 */
function dashToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
/**
 * Convert a haxElement to a DOM node.
 * @return {Node} DOM node.
 */
function haxElementToNode(haxSchema) {
  let tag = haxSchema.tag;
  let content = haxSchema.content ? haxSchema.content : "";
  let properties = haxSchema.properties ? haxSchema.properties : {};
  // support sandboxed environments which
  // will hate iframe tags but love webview
  if (
    globalThis.HaxStore &&
    globalThis.HaxStore.instance &&
    globalThis.HaxStore.instance._isSandboxed &&
    tag === "iframe"
  ) {
    tag = "webview";
  }
  var frag = globalThis.document.createElement(tag);
  frag.innerHTML = content;
  // clone the fragment which will force an escalation to full node
  var newNode = frag.cloneNode(true);

  // support for properties if they exist
  for (var property in properties) {
    // skip innerHTML and innerText as they should be handled as content, not attributes
    if (property === "innerHTML" || property === "innerText") {
      continue;
    }
    let attributeName = camelToDash(property);
    // as we handle our VDOM through here regularly, make sure the bad JSEventAttributes
    // don't get set as attributes on the node, ever.
    if (
      properties.hasOwnProperty(property) &&
      badJSEventAttributes.indexOf(property) === -1 &&
      !(
        ["iframe", "webview"].includes(tag.toLowerCase()) &&
        badIFrameAttributes.includes(attributeName)
      )
    ) {
      // special supporting for boolean because html is weird :p
      if (properties[property] === true) {
        newNode.setAttribute(attributeName, properties[property]);
      } else if (properties[property] === false) {
        newNode.removeAttribute(attributeName);
      } else if (
        properties[property] != null &&
        properties[property].constructor === Array
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = [...properties[property]];
          }
        }
      } else if (
        properties[property] != null &&
        properties[property].constructor === Object
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = { ...properties[property] };
          }
        }
      } else {
        newNode.setAttribute(attributeName, properties[property]);
      }
    }
  }
  removeBadJSEventAttributes(newNode);
  return newNode;
}
/**
 * Conver camel case to dash case
 */
function camelCaseToDash(key) {
  return key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
/**
 * Encapsulate script types in an HTML blob
 */
function encapScript(html) {
  // ensure this is a string to then do replacements on, rare but possible w/ null
  if (html && typeof html.replace === "function") {
    html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
    html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
    // ensure that HAX tags aren't leaking in here
    html = html.replace(/<hax-(body|tray|store)[\s\S]*?>/gi, "");
    html = html.replace(/<\/hax-(body|tray|store)[\s\S]*?>/gi, "");
    html = html.replace(/<h-a-x[\s\S]*?>/gi, "");
    html = html.replace(/<\/h-a-x*?>/gi, "");
    html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
    html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
    // special case, it's inside a template tag
    html = html.replace(
      /<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi,
      function (match, contents, offset, input_string) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      },
    );
  }
  return html;
}
/**
 * Find custom elements in HTML
 */
function findTagsInHTML(html) {
  let tags = {};
  let tag = "";
  var matches = html.match(/<\/([a-z,0-9]*?)-(\S*?)>/g);
  for (var i in matches) {
    tag = matches[i].replace("</", "").replace(">", "");
    tags[tag] = tag;
  }
  return tags;
}
//converts unicode to HTML entity
export function utf2Html(str) {
  return [...str]
    .map((char) =>
      char.codePointAt() > 127 ? `&#${char.codePointAt()};` : char,
    )
    .join("");
}

export function htmlEntities(s) {
  return s.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
}
/**
 * Strip word BS as well as GDocs, box notes, Medium and some others as best we can
 */
function stripMSWord(input) {
  // 1. remove line breaks / Mso classes right off the bat
  var output = input
    .split("\n\r")
    .join("\n")
    .split("\r")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n")
    .join(" ")
    .replace(/( class=(")?Mso[a-zA-Z]+(")?)/g, "");

  // 2. strip Word generated HTML comments
  output = output.replace(/<\!--(\s|.)*?-->/gim, "");
  output = output.replace(/<\!(\s|.)*?>/gim, "");
  // 3. remove tags leave content if any (but NOT span tags yet)
  output = output.replace(
    /<(\/)*(meta|link|title|html|head|body|font|br|\\\\?xml:|xml|st1:|o:|w:|m:|v:)(\s|.)*?>/gim,
    "",
  );
  // Handle spans specially - remove span wrapper but preserve content and nested elements
  output = output.replace(/<span[^>]*>([\s\S]*?)<\/span>/gim, "$1");
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  var badTags = ["style", "script", "applet", "embed", "noframes", "noscript"];
  for (var i in badTags) {
    let tagStripper = new RegExp(
      "<" + badTags[i] + "(s|.)*?" + badTags[i] + "(.*?)>",
      "gim",
    );
    output = output.replace(tagStripper, "");
  }
  // 5. remove attributes ' style="..."', align, start and others that we know we dont need
  output = output.replace(/ style='(\s|.)*?'/gim, "");
  output = output.replace(/ style="(\s|.)*?"/gim, ""); // Fix: handle double-quoted style attributes
  output = output.replace(/ face="(\s|.)*?"/gim, "");
  output = output.replace(/ align=.*? /g, "");
  output = output.replace(/ start='.*?'/g, "");
  // remove line-height; commonly set via html copy and paste in google docs
  output = output.replace(/line-height:.*?\"/g, '"');
  output = output.replace(/line-height:.*?;/g, "");
  // normal font cause... obviously
  output = output.replace(/font-weight:normal;/g, "");
  // text decoration in a link...
  output = output.replace(/text-decoration:none;/g, "");
  // margin clean up that is in point values; only machines make these
  output = output.replace(/margin-.*?:.*?\"/g, '"');
  output = output.replace(/margin-.*?:.*?;/g, "");
  // empty style tags
  output = output.replace(/ style=""/g, "");
  // ID's wont apply meaningfully on a paste
  output = output.replace(/ id="(\s|.)*?"/gim, "");
  // Google Docs ones
  output = output.replace(/ dir="(\s|.)*?"/gim, "");
  output = output.replace(/ role="(\s|.)*?"/gim, "");
  // these are universally true tho so fine to have here
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");
  // some medium, box, github and other paste stuff as well as general paste clean up for classes
  // in multiple HTML primitives
  output = output.replace(/ data-(\s|.)*?"(\s|.)*?"/gim, "");
  output = output.replace(/ class="(\s|.)*?"/gim, "");
  output = output.replace(/<pstyle/gm, "<p style");
  // HIGHLY specific to certain platforms, empty link tag
  output = output.replace(/<a name=\"_GoBack\"><\/a>/gm, "");
  // 7. clean out empty paragraphs and endlines that cause weird spacing
  output = output.replace(/&nbsp;/gm, " ");
  // start of double, do it twice for nesting
  output = output.replace(/<section>/gm, "<p>");
  output = output.replace(/<\/section>/gm, "</p>");
  output = output.replace(/<p><p>/gm, "<p>");
  output = output.replace(/<p><p>/gm, "<p>");
  // double, do it twice for nesting
  output = output.replace(/<\/p><\/p>/gm, "</p>");
  output = output.replace(/<\/p><\/p>/gm, "</p>");
  // normalize BR's; common from GoogleDocs
  output = output.replace(/<br \/>/gm, "<br/>");
  output = output.replace(/<p><br \/><b>/gm, "<p><b>");
  output = output.replace(/<\/p><br \/><\/b>/gm, "</p></b>");
  // some other things we know not to allow to wrap and
  // some things bold stuff like crazy for some odd reason
  output = output.replace(/<b><p>/gm, "<p>");
  output = output.replace(/<\/p><\/b>/gm, "</p>");
  output = output.replace(/<b>/gm, "<strong>");
  output = output.replace(/<\/b>/gm, "</strong>");
  // clean up in lists because they get messy for no real reason...ever.
  // tables as well
  output = output.replace(/<p style=\".*?\">/gm, "<p>");
  output = output.replace(/<ul style=\".*?\">/gm, "<ul>");
  output = output.replace(/<ol style=\".*?\">/gm, "<ol>");
  output = output.replace(/<li style=\".*?\">/gm, "<li>");
  output = output.replace(/<td style=\".*?\">/gm, "<td>");
  output = output.replace(/<tr style=\".*?\">/gm, "<tr>");
  // drop list wrappers (handle attributes on <p> e.g. Google Docs)
  output = output.replace(/<li><p[^>]*>/gm, "<li>");
  output = output.replace(/<\/p><\/li>/gm, "</li>");
  // bold wraps as an outer tag like p can, and on lists
  output = output.replace(/<b><ul>/gm, "<ul>");
  output = output.replace(/<\/ul><\/b>/gm, "</ul>");
  output = output.replace(/<b><ol>/gm, "<ol>");
  output = output.replace(/<\/ol><\/b>/gm, "</ol>");
  // try ax'ing extra spans
  output = output.replace(/<span><p>/gm, "<p>");
  output = output.replace(/<\/p><\/span>/gm, "</p>");
  // empty with lots of space
  output = output.replace(/<p>(\s*)<\/p>/gm, " ");
  // empty p / more or less empty
  output = output.replace(/<p><\/p>/gm, "");
  output = output.replace(/<p>&nbsp;<\/p>/gm, " ");
  // br somehow getting through here
  output = output.replace(/<p><br\/><\/p>/gm, "");
  output = output.replace(/<p><br><\/p>/gm, "");

  // whitespace in reverse of the top case now that we've cleaned it up
  output = output.replace(/<\/p>(\s*)<p>/gm, "</p><p>");
  // target and remove hax specific things from output if they slipped through
  output = output.replace(/ data-hax-ray="(\s|.)*?"/gim, "");
  output = output.replace(/ class=""/gim, "");
  output = output.replace(/ class="hax-active"/gim, "");
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");
  output = output.replace(/ t="(\s|.)*?"/gim, "");
  // wow do I hate contenteditable and the dom....
  // bold and italic are treated as if they are block elements in a paste scenario
  // 8. check for empty bad tags
  for (var i in badTags) {
    let emptyTagRemove = new RegExp(
      "<" + badTags[i] + "></" + badTags[i] + ">",
      "gi",
    );
    output = output.replace(emptyTagRemove, "");
  }
  output = output.trim();
  return output;
}

/**
 * Normalize clipboard HTML for known sources (Google Docs, Notion, etc.)
 * Uses DOM-based manipulation so nested structures are handled robustly.
 */
export function normalizeClipboardHTML(html) {
  if (!html || typeof html !== "string") {
    return html;
  }
  const template = globalThis.document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;

  // Google Docs uses <b> as generic text wrappers.
  // Real bold is indicated by an inline style with font-weight:700.
  fragment.querySelectorAll("b").forEach((b) => {
    const style = b.getAttribute("style") || "";
    if (
      style.includes("font-weight:700") ||
      style.includes("font-weight:bold")
    ) {
      // Convert real bold to <strong> so stripMSWord can clean styles later
      const strong = globalThis.document.createElement("strong");
      while (b.firstChild) {
        strong.appendChild(b.firstChild);
      }
      b.parentNode.replaceChild(strong, b);
    } else {
      // Fake bold: unwrap, preserving children
      const parent = b.parentNode;
      while (b.firstChild) {
        parent.insertBefore(b.firstChild, b);
      }
      parent.removeChild(b);
    }
  });

  // Convert Google Docs font-weight spans to <strong>
  fragment.querySelectorAll('span[style*="font-weight:700"]').forEach((span) => {
    const strong = globalThis.document.createElement("strong");
    while (span.firstChild) {
      strong.appendChild(span.firstChild);
    }
    span.parentNode.replaceChild(strong, span);
  });

  // Unwrap Google Docs <p> inside <li> (GDocs wraps each list item in a paragraph)
  fragment.querySelectorAll("li > p").forEach((p) => {
    const li = p.parentNode;
    while (p.firstChild) {
      li.insertBefore(p.firstChild, p);
    }
    li.removeChild(p);
  });

  // Remove Google Docs role="text" and generated class names
  fragment.querySelectorAll('[role="text"]').forEach((el) => {
    el.removeAttribute("role");
  });
  fragment.querySelectorAll('[class^="c"]').forEach((el) => {
    const cls = el.getAttribute("class") || "";
    if (/^c\d/.test(cls)) {
      el.removeAttribute("class");
    }
  });

  // Unwrap all spans using DOM methods.
  // The regex-based unwrapping in stripMSWord is fragile with nested spans,
  // which Notion and Google Docs both use extensively.
  let span;
  while ((span = fragment.querySelector("span"))) {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  }

  // Serialize the DocumentFragment back to a string.
  // DocumentFragment.innerHTML is not standard, so use a temporary element.
  const wrapper = globalThis.document.createElement("div");
  wrapper.appendChild(fragment);
  return wrapper.innerHTML;
}

/**
 * Convert a node to a HAX element. Hax elements ensure
 * a certain level of sanitization by verifying tags and
 * properties / attributes that have values.
 */
async function nodeToHaxElement(node, eventName = "insert-element") {
  if (!node) {
    return null;
  }
  const nodeTag = node.tagName.toLowerCase();
  // build out the properties to send along
  var props = {};
  // support basic styles
  if (typeof node.style !== typeof undefined) {
    props.style = node.getAttribute("style");
  }
  // don't set a null style
  if (props.style === null || props.style === "null") {
    delete props.style;
  }
  // test if a class exists, not everything scopes
  if (typeof node.attributes.class !== typeof undefined) {
    props.class = node.attributes.class.value.replace("hax-active", "");
  }
  // test if a id exists as its a special case in attributes... of course
  if (typeof node.attributes.id !== typeof undefined) {
    props.id = node.getAttribute("id");
  }
  let tmpProps;
  // relatively cross library
  if (customElements.get(node.tagName.toLowerCase())) {
    tmpProps = customElements.get(node.tagName.toLowerCase()).properties;
  }
  // weak fallback
  if (typeof tmpProps === typeof undefined) {
    tmpProps = node.__data;
  }
  // complex elements need complex support
  if (typeof tmpProps !== typeof undefined) {
    // run through attributes, though non-reflected props won't be here
    // run through props, we always defer to property values
    for (var property in tmpProps) {
      // make sure we only set things that have a value
      if (
        property != "class" &&
        property != "style" &&
        tmpProps.hasOwnProperty(property) &&
        typeof node[property] !== undefined &&
        node[property] != null &&
        node[property] != ""
      ) {
        props[property] = node[property];
      }
      // special support for false boolean
      else if (node[property] === false) {
        props[property] = false;
      } else if (node[property] === true) {
        props[property] = true;
      } else if (node[property] === 0) {
        props[property] = 0;
      } else {
        // unknown prop setting / ignored
        //console.warn(node[property], property);
      }
    }
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != "" &&
        !(
          ["iframe", "webview"].includes(nodeTag) &&
          node.attributes[attribute].name === "srcdoc"
        ) &&
        !tmpProps.hasOwnProperty(dashToCamel(node.attributes[attribute].name))
      ) {
        props[node.attributes[attribute].name] =
          node.attributes[attribute].value;
      } else if (
        node.attributes[attribute].value == "0" &&
        !(
          ["iframe", "webview"].includes(nodeTag) &&
          node.attributes[attribute].name === "srcdoc"
        )
      ) {
        props[node.attributes[attribute].name] =
          node.attributes[attribute].value;
      } else {
        // note: debug here if experiencing attributes that won't bind
        //console.warn(node.attributes[attribute].name, node.attributes[attribute].value);
      }
    }
  } else {
    // much easier case, usually just in primatives
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != "" &&
        !(
          ["iframe", "webview"].includes(nodeTag) &&
          node.attributes[attribute].name === "srcdoc"
        )
      ) {
        props[node.attributes[attribute].name] =
          node.attributes[attribute].value;
      }
    }
  }
  // support sandboxed environments which
  // will hate iframe tags but love webview
  let tag = nodeTag;
  if (
    globalThis.HaxStore &&
    globalThis.HaxStore.instance &&
    globalThis.HaxStore.instance._isSandboxed &&
    tag === "iframe"
  ) {
    tag = "webview";
  }
  let slotContent = "";
  // if hax store around, allow it to get slot content of the node
  if (globalThis.HaxStore && globalThis.HaxStore.instance) {
    slotContent = await globalThis.HaxStore.instance.getHAXSlot(node);
  } else {
    // if HAX isn't around, just return the innerHTML as a string for asignment to content
    slotContent = node.innerHTML;
  }
  // support fallback on inner text if there were no nodes
  if (slotContent == "") {
    slotContent = node.innerText;
  }
  // special edge case for slot binding in primatives
  if (tag === "a" || tag === "mark" || tag === "abbr") {
    props.innerText = slotContent;
  } else if (
    tag === "p" ||
    tag === "table" ||
    tag === "ol" ||
    tag === "ul" ||
    tag === "div"
  ) {
    props.innerHTML = slotContent;
  }
  let element = {
    tag: tag,
    properties: props,
    content: slotContent,
  };

  if (eventName !== null) {
    element.eventName = eventName;
  }
  return element;
}

/**
 * Manage window based events in a consistent and simple manner
 */
export const winEventsElement = function (SuperClass) {
  return class extends SuperClass {
    __applyWinEvents(status) {
      if (this.__winEvents) {
        for (var eName in this.__winEvents) {
          window[`${status ? "add" : "remove"}EventListener`](
            eName,
            this[this.__winEvents[eName]],
          );
        }
      }
    }
    /**
     * HTMLElement connected element
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // bind to this context prior to assignment so we can enable and disable accurately from window
      for (var eName in this.__winEvents) {
        this[this.__winEvents[eName]] =
          this[this.__winEvents[eName]].bind(this);
      }
      this.__applyWinEvents(true);
    }
    /**
     * HTML Element disconnected element
     */
    disconnectedCallback() {
      this.__applyWinEvents(false);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
};

export {
  wrap,
  wrapAll,
  unwrap,
  formatHTML,
  validURL,
  haxElementToNode,
  dashToCamel,
  camelToDash,
  camelCaseToDash,
  encapScript,
  findTagsInHTML,
  stripMSWord,
  nodeToHaxElement,
};
