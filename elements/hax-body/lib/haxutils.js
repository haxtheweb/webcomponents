import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
/**
 * A collection of utility functions exported for convenience
 */

function encapScript(html) {
  // ensure this is a string to then do replacements on, rare but possible w/ null
  if (html && typeof html.replace === "function") {
    html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
    html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
    // ensure that HAX tags aren't leaking in here
    html = html.replace(/<hax[\s\S]*?>/gi, "");
    html = html.replace(/<\/hax[\s\S]*?>/gi, "");
    html = html.replace(/<h-a-x[\s\S]*?>/gi, "");
    html = html.replace(/<\/h-a-x*?>/gi, "");
    html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
    html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
    // special case, it's inside a template tag
    html = html.replace(
      /<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi,
      function(match, contents, offset, input_string) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      }
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
/**
 * Wipe slotted content
 */
function wipeSlot(element, slot = "*") {
  // 100% clean slate
  if (slot === "*") {
    while (dom(element).firstChild !== null) {
      dom(element).removeChild(dom(element).firstChild);
    }
  } else {
    for (var i in dom(element).childNodes) {
      // test for element nodes to be safe
      if (
        typeof dom(element).childNodes[i] !== typeof undefined &&
        dom(element).childNodes[i].slot === slot
      ) {
        dom(element).removeChild(dom(element).childNodes[i]);
      }
    }
  }
}

/**
 * Strip word BS
 */
function stripMSWord(input) {
  // 1. remove line breaks / Mso classes
  var output = input.replace(/(\|\\r| class=(")?Mso[a-zA-Z]+(")?)/g, "");
  // 2. strip Word generated HTML comments
  output = output.replace(/<\!--(\s|.)*?-->/gim, "");
  output = output.replace(/<\!(\s|.)*?>/gim, "");
  // 3. remove tags leave content if any
  output = output.replace(
    /<(\/)*(meta|link|html|head|body|span|\\\\?xml:|xml|st1:|o:|w:|m:|v:|font)(\s|.)*?>/gim,
    ""
  );
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  var badTags = ["style", "script", "applet", "embed", "noframes", "noscript"];
  for (var i in badTags) {
    let tagStripper = new RegExp(
      "<" + badTags[i] + "(s|.)*?" + badTags[i] + "(.*?)>",
      "gim"
    );
    output = output.replace(tagStripper, "");
  }

  // 5. remove attributes ' style="..."', align, start
  output = output.replace(/ style='(\s|.)*?'/gim, "");
  output = output.replace(/ align=.*? /g, "");
  output = output.replace(/ start='.*?'/g, "");

  // 6. some HAX specific things in case this was moving content around
  // these are universally true tho so fine to have here
  output = output.replace(/ style="(\s|.)*?"/gim, "");
  output = output.replace(/ data-editable="(\s|.)*?"/gim, "");
  output = output.replace(/ data-hax-ray="(\s|.)*?"/gim, "");
  output = output.replace(/ class=""/gim, "");
  output = output.replace(/ class="hax-active"/gim, "");
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");

  return output;
}

/**
 * Test if a variable along a given object path exists
 */
function varExists(obj, path) {
  let g = objectValFromStringPos(obj, path, "__failedToFind__");
  if (g != "__failedToFind__") {
    return true;
  }
  return false;
}
/**
 * Return an object path or fallback value if not set
 */
function varGet(obj, path, fallback = "") {
  return objectValFromStringPos(obj, path, fallback);
}

// helper to use strings for index in Objects
function objectValFromStringPos(o, s, r = null) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return r;
    }
  }
  return o;
}

export {
  encapScript,
  findTagsInHTML,
  wipeSlot,
  stripMSWord,
  varExists,
  varGet,
  objectValFromStringPos
};
