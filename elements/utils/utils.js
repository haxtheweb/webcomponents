/**
 * A collection of utility functions exported for convenience
 */

// wrap an element with another; super basic but makes it consistent across our apps
function wrap(el, wrapper) {
  if (el && el.parentNode) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
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
// resolve platform differences in mouse path
// some platforms falling back to just the target itself
export function normalizeEventPath(e) {
  if (e.composed && e.composedPath) {
    return e.composedPath();
  } else if (e.path) {
    return e.path;
  } else if (e.originalTarget) {
    return [e.originalTarget];
  } else {
    return [e.target];
  }
}
// nicely formats / indents an HTML DOM tree for output
function formatHTML(str) {
  var div = document.createElement("div");
  div.innerHTML = str.trim();

  return formatHTMLInternals(div, 0).innerHTML;
}
// HTML internals of the DOM tree
function formatHTMLInternals(node, level) {
  let indentBefore = new Array(level++ + 1).join("  "),
    indentAfter = new Array(level - 1).join("  "),
    textNode;
  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode("\n" + indentBefore);
    node.insertBefore(textNode, node.children[i]);
    formatHTMLInternals(node.children[i], level);
    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode("\n" + indentAfter);
      node.appendChild(textNode);
    }
  }
  return node;
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
/**
 * Take an array of items and apply a map of values to generate a new
 * array that is the structure you're looking for with default values
 * filling in the gaps.
 */
function valueMapTransform(items, map) {
  // ensure we have a map to render
  let tmpAry = [];
  if (map) {
    items.forEach((item) => {
      // create tag for the map
      let tmp = {};
      for (var key in map) {
        let value = map[key];
        // complex transform capability for values that need processing
        // prior to being set
        if (value === true || value === false || value === null) {
          tmp[key] = value;
        } else if (typeof value === "function") {
          try {
            tmp[key] = value(item);
          } catch (e) {
            console.warn(e);
          }
        }
        // only set the value in the node IF we have a match in the item for data
        // odd trap but the transform case can potentially miss above and this then pass
        // which varExists requires value be a string
        else if (typeof value === "string" && varExists(item, value)) {
          tmp[key] = varGet(item, value);
        } else {
          tmp[key] = value;
        }
      }
      tmpAry.push(tmp);
    });
  }
  return tmpAry;
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
 */
function haxElementToNode(haxSchema) {
  let tag = haxSchema.tag;
  let content = haxSchema.content ? haxSchema.content : "";
  let properties = haxSchema.properties ? haxSchema.properties : {};
  // support sandboxed environments which
  // will hate iframe tags but love webview
  if (
    window.HaxStore &&
    window.HaxStore.instance &&
    window.HaxStore.instance._isSandboxed &&
    tag === "iframe"
  ) {
    tag = "webview";
  }
  var frag = document.createElement(tag);
  frag.innerHTML = content;
  // clone the fragment which will force an escalation to full node
  var newNode = frag.cloneNode(true);

  // support for properties if they exist
  for (var property in properties) {
    let attributeName = camelToDash(property);
    if (properties.hasOwnProperty(property)) {
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
    html = html.replace(/<hax[\s\S]*?>/gi, "");
    html = html.replace(/<\/hax[\s\S]*?>/gi, "");
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
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  } else {
    for (var i in element.childNodes) {
      // test for element nodes to be safe
      if (
        typeof element.childNodes[i] !== typeof undefined &&
        element.childNodes[i].slot === slot
      ) {
        element.removeChild(element.childNodes[i]);
      }
    }
  }
}
/**
 * Generate a uinque ID
 */
function generateResourceID(base = "#") {
  function idPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    base +
    idPart() +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    idPart() +
    idPart()
  );
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
  // 3. remove tags leave content if any
  output = output.replace(
    /<(\/)*(meta|link|html|head|body|span|font|br|\\\\?xml:|xml|st1:|o:|w:|m:|v:)(\s|.)*?>/gim,
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
  // 5. remove attributes ' style="..."', align, start and others that we know we dont need
  output = output.replace(/ style='(\s|.)*?'/gim, "");
  output = output.replace(/ face="(\s|.)*?"/gim, "");
  output = output.replace(/ align=.*? /g, "");
  output = output.replace(/ start='.*?'/g, "");
  // ID's wont apply meaningfully on a paste
  output = output.replace(/ id="(\s|.)*?"/gim, "");
  // Google Docs ones
  output = output.replace(/ dir="(\s|.)*?"/gim, "");
  output = output.replace(/ role="(\s|.)*?"/gim, "");
  // these are universally true tho so fine to have here
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");
  // some medium, box, github and other paste stuff as well as general paste clean up for classes
  // in multiple html primatives
  output = output.replace(/ data-(\s|.)*?"(\s|.)*?"/gim, "");
  output = output.replace(/ class="(\s|.)*?"/gim, "");
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
  // some other things we know not to allow to wrap
  output = output.replace(/<b><p>/gm, "<p>");
  output = output.replace(/<\/p><\/b>/gm, "</p>");
  // drop list wrappers
  output = output.replace(/<li><p>/gm, "<li>");
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
  // wow do I hate contenteditable and the dom....
  // bold and italic are treated as if they are block elements in a paste scenario
  // 8. check for empty bad tags
  for (var i in badTags) {
    let emptyTagRemove = new RegExp(
      "<" + badTags[i] + "></" + badTags[i] + ">",
      "gi"
    );
    output = output.replace(emptyTagRemove, "");
  }
  output = output.trim();
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
    if (o) {
      if (k in o) {
        o = o[k];
      } else {
        return r;
      }
    } else {
      return r;
    }
  }
  return o;
}
/**
 * Convert a node to a HAX element. Hax elements ensure
 * a certain level of sanitization by verifying tags and
 * properties / attributes that have values.
 */
function nodeToHaxElement(node, eventName = "insert-element") {
  if (!node) {
    return null;
  }
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
        props[property] = node[property];
      } else {
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
        !tmpProps.hasOwnProperty(dashToCamel(node.attributes[attribute].name))
      ) {
        props[dashToCamel(node.attributes[attribute].name)] =
          node.attributes[attribute].value;
      } else {
        // note: debug here if experiencing attributes that won't bind
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
        node.attributes[attribute].value != ""
      ) {
        props[dashToCamel(node.attributes[attribute].name)] =
          node.attributes[attribute].value;
      }
    }
  }
  // support sandboxed environments which
  // will hate iframe tags but love webview
  let tag = node.tagName.toLowerCase();
  if (window.HaxStore.instance._isSandboxed && tag === "iframe") {
    tag = "webview";
  }
  let slotContent = window.HaxStore.instance.getHAXSlot(node);
  // support fallback on inner text if there were no nodes
  if (slotContent == "") {
    slotContent = node.innerText;
  }
  // special edge case for slot binding in primatives
  if (tag === "a") {
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
            this[this.__winEvents[eName]].bind(this)
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
  unwrap,
  formatHTML,
  validURL,
  valueMapTransform,
  haxElementToNode,
  dashToCamel,
  camelToDash,
  camelCaseToDash,
  encapScript,
  findTagsInHTML,
  wipeSlot,
  generateResourceID,
  stripMSWord,
  varExists,
  varGet,
  objectValFromStringPos,
  nodeToHaxElement,
};

/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const debug = false;

const validNodeTypes = [
  Node.ELEMENT_NODE,
  Node.TEXT_NODE,
  Node.DOCUMENT_FRAGMENT_NODE,
];
function isValidNode(node) {
  return validNodeTypes.includes(node.nodeType);
}

function findNode(s, parentNode, isLeft) {
  const nodes = parentNode.childNodes || parentNode.children;
  if (!nodes) {
    return parentNode; // found it, probably text
  }

  for (let i = 0; i < nodes.length; ++i) {
    const j = isLeft ? i : nodes.length - 1 - i;
    const childNode = nodes[j];
    if (!isValidNode(childNode)) {
      continue;
    }

    debug && console.debug("checking child", childNode, "IsLeft", isLeft);
    if (s.containsNode(childNode, true)) {
      if (s.containsNode(childNode, false)) {
        debug && console.info("found child", childNode);
        return childNode;
      }
      debug && console.info("descending child", childNode);
      return findNode(s, childNode, isLeft);
    }
    debug && console.info(parentNode, "does NOT contain", childNode);
  }
  return parentNode;
}

/**
 * @param {function(!Event)} fn to add to selectionchange internals
 */
const addInternalListener = (() => {
  const testNode = document.createElement("div");
  const testRoot = testNode.attachShadow({ mode: "open" });
  if (testRoot.getSelection) {
    // getSelection really exists, why are you using us?
    document.addEventListener("selectionchange", (ev) => {
      document.dispatchEvent(new CustomEvent("-shadow-selectionchange"));
    });
    return () => {};
  }

  let withinInternals = false;
  const handlers = [];

  document.addEventListener("selectionchange", (ev) => {
    if (withinInternals) {
      return;
    }
    document.dispatchEvent(new CustomEvent("-shadow-selectionchange"));
    withinInternals = true;
    window.setTimeout(() => {
      withinInternals = false;
    }, 0);
    handlers.forEach((fn) => fn(ev));
  });

  return (fn) => handlers.push(fn);
})();

let wasCaret = false;
let resolveTask = null;
addInternalListener((ev) => {
  const s = window.getSelection();
  if (s.type === "Caret") {
    wasCaret = true;
  } else if (wasCaret && !resolveTask) {
    resolveTask = Promise.resolve(true).then(() => {
      wasCaret = false;
      resolveTask = null;
    });
  }
});

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} node the node to walk from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {boolean} whether the selection contains the following node (even partially)
 */
function containsNextElement(s, node, walkForward) {
  const start = node;
  while ((node = walkFromNode(node, walkForward))) {
    // walking (left) can contain our own parent, which we don't want
    if (!node.contains(start)) {
      break;
    }
  }
  if (!node) {
    return false;
  }
  // we look for Element as .containsNode says true for _every_ text node, and we only care about
  // elements themselves
  return node instanceof Element && s.containsNode(node, true);
}

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} leftNode the left node
 * @param {!Node} rightNode the right node
 * @return {boolean|undefined} whether this has natural direction
 */
function getSelectionDirection(s, leftNode, rightNode) {
  if (s.type !== "Range") {
    return undefined; // no direction
  }
  const measure = () => s.toString().length;

  const initialSize = measure();
  debug && console.info(`initial selection: "${s.toString()}"`);

  if (initialSize === 1 && wasCaret && leftNode === rightNode) {
    // nb. We need to reset a single selection as Safari _always_ tells us the cursor was dragged
    // left to right (maybe RTL on those devices).
    // To be fair, Chrome has the same bug.
    debug && console.debug("resetting size=1");
    s.extend(leftNode, 0);
    s.collapseToEnd();
    return undefined;
  }

  let updatedSize;

  // Try extending forward and seeing what happens.
  s.modify("extend", "forward", "character");
  updatedSize = measure();
  debug && console.info(`forward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, rightNode, true)) {
    debug && console.info("got forward >, moving right");
    s.modify("extend", "backward", "character");
    return true;
  } else if (updatedSize < initialSize || !s.containsNode(leftNode)) {
    debug && console.info("got forward <, moving left");
    s.modify("extend", "backward", "character");
    return false;
  }

  // Maybe we were at the end of something. Extend backwards.
  // TODO(samthor): We seem to be able to get away without the 'backwards' case.
  s.modify("extend", "backward", "character");
  updatedSize = measure();
  debug && console.info(`backward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, leftNode, false)) {
    debug && console.info("got backwards >, moving left");
    s.modify("extend", "forward", "character");
    return false;
  } else if (updatedSize < initialSize || !s.containsNode(rightNode)) {
    debug && console.info("got backwards <, moving right");
    s.modify("extend", "forward", "character");
    return true;
  }

  // This is likely a select-all.
  return undefined;
}

/**
 * Returns the next valid node (element or text). This is needed as Safari doesn't support
 * TreeWalker inside Shadow DOM. Don't escape shadow roots.
 *
 * @param {!Node} node to start from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {Node} node found, if any
 */
function walkFromNode(node, walkForward) {
  if (!walkForward) {
    return node.previousSibling || node.parentNode || null;
  }
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * @param {!Node} node to start from
 * @param {boolean} isLeft is this a left node
 * @param {string} s expected string
 * @return {?{node: !Node, offset: number}}
 */
function walkTextFromNode(node, isLeft, s) {
  for (; node; node = walkFromNode(node, isLeft)) {
    if (node.nodeType !== Node.TEXT_NODE) {
      continue;
    }

    const t = node.textContent;
    if (isLeft) {
      if (s.length < t.length) {
        return { node, offset: s.length };
      }

      const prefix = s.substr(0, t.length);
      if (prefix !== t) {
        console.debug("unexpected string prefix", prefix, "expected", t);
      }

      s = s.substr(t.length);
    } else {
      if (s.length < t.length) {
        return { node, offset: t.length - s.length };
      }

      const suffix = s.substr(s.length - t.length);
      if (suffix !== t) {
        console.debug("unexpected string suffix", suffix, "expected", t);
      }

      s = s.substr(0, s.length - t.length);
    }
  }

  return null; // too far
}

/**
 * @param {!Node} node
 * @return {number} count of initial space
 */
function initialSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  return /^\s*/.exec(node.textContent)[0].length;
}

/**
 * @param {!Node} node
 * @return {number} count of ignored trailing space
 */
function ignoredTrailingSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  const trailingSpaceCount = /\s*$/.exec(node.textContent)[0].length;
  if (!trailingSpaceCount) {
    return 0;
  }
  return trailingSpaceCount - 1; // always allow single last
}

const cachedRange = new Map();
export function getRange(root) {
  if (root.getSelection) {
    const s = root.getSelection();
    return s.rangeCount ? s.getRangeAt(0) : null;
  }

  const thisFrame = cachedRange.get(root);
  if (thisFrame) {
    return thisFrame;
  }

  const initialText = window.getSelection().toString();
  const result = internalGetShadowSelection(root);
  const rs = (result && result.range && result.range.toString()) || null;
  if (rs !== null && rs !== initialText) {
    // TODO: sometimes triggers on single-char hack etc

    if (rs.replace(/\s/g, "") !== initialText.replace(/\s/g, "")) {
      // nb. selection eats initial/ending space, range does not: if whitespace is the only
      // difference, then ignore
      console.warn("invalid range, initial text:", initialText);
      console.warn("vs", rs, result.mode, result.range);
    }
  }

  cachedRange.set(root, result.range);
  window.setTimeout(() => {
    cachedRange.delete(root);
  }, 0);
  debug && console.debug("getRange got", result);
  return result.range;
}

const fakeSelectionNode = document.createTextNode("");
export function internalGetShadowSelection(root) {
  const range = document.createRange();

  const s = window.getSelection();
  if (s && root.host && !s.containsNode(root.host, true)) {
    return { range: null, mode: "none" };
  }

  // TODO: inserting fake nodes isn't ideal, but containsNode doesn't work on nearby adjacent
  // text nodes (in fact it returns true for all text nodes on the page?!).

  // insert a fake 'before' node to see if it's selected
  root.insertBefore(fakeSelectionNode, root.childNodes[0]);
  const includesBeforeRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesBeforeRoot) {
    return { range: null, mode: "outside-before" };
  }

  // insert a fake 'after' node to see if it's selected
  root.appendChild(fakeSelectionNode);
  const includesAfterRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesAfterRoot) {
    return { range: null, mode: "outside-after" };
  }

  const measure = () => s.toString().length;
  const initialSelectionContent = s.toString();
  if (s.type === "None") {
    return null;
  }
  if (!(s.type === "Caret" || s.type === "Range")) {
    throw new TypeError("unexpected type: " + s.type);
  }
  const initialCaret = s.type === "Caret";

  const leftNode = findNode(s, root, true);
  let rightNode;
  let isNaturalDirection = undefined;
  if (s.type === "Range") {
    rightNode = findNode(s, root, false); // get right node here _before_ getSelectionDirection
    isNaturalDirection = getSelectionDirection(s, leftNode, rightNode);
    // isNaturalDirection means "going right"
  }

  if (s.type === "Caret") {
    // we might transition to being a caret, so don't check initial value
    s.extend(leftNode, 0);
    const at = measure();
    s.collapseToEnd();
    if (
      leftNode.nodeType === 1 &&
      leftNode.childNodes &&
      leftNode.childNodes.length > 0
    ) {
      range.setStart(leftNode.childNodes[0], at);
      range.setEnd(leftNode.childNodes[0], at);
    } else {
      range.setStart(leftNode, at);
      range.setEnd(leftNode, at);
    }
    return { range, mode: "caret" };
  } else if (isNaturalDirection === undefined) {
    if (s.type !== "Range") {
      throw new TypeError("unexpected type: " + s.type);
    }
    // This occurs when we can't move because we can't extend left or right to measure the
    // direction we're moving in. Good news though: we don't need to _change_ the selection
    // to measure it, so just return immediately.
    range.setStart(leftNode.childNodes[0], 0);
    range.setEnd(rightNode, rightNode.length);
    return { range, mode: "all" };
  }

  const size = measure();
  let offsetLeft, offsetRight;

  // only one newline/space char is cared about
  const validRightLength = rightNode.length - ignoredTrailingSpace(rightNode);

  if (isNaturalDirection) {
    // walk in the opposite direction first
    s.extend(leftNode, 0);
    offsetLeft = measure() + initialSpace(leftNode); // measure doesn't include initial space

    // then in our actual direction
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - (measure() - size);

    // then revert to the original position
    s.extend(rightNode, offsetRight);
  } else {
    // walk in the opposite direction first
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - measure();

    // then in our actual direction
    s.extend(leftNode, 0);
    offsetLeft = measure() - size + initialSpace(leftNode); // doesn't include initial space

    // then revert to the original position
    s.extend(leftNode, offsetLeft);
  }

  if (debug) {
    if (leftNode === rightNode) {
      console.info(
        "got string",
        leftNode.textContent.substr(offsetLeft, offsetRight - offsetLeft)
      );
    } else {
      console.info(">>> string", leftNode.textContent.substr(offsetLeft));
      console.info("<<< string", rightNode.textContent.substr(0, offsetRight));
    }
  }

  range.setStart(leftNode, offsetLeft);
  range.setEnd(rightNode, offsetRight);
  return {
    mode: isNaturalDirection ? "right" : "left",
    range,
  };
}

// polyfill from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
export function ReplaceWithPolyfill() {
  "use-strict"; // For safari, and IE > 10
  var parent = this.parentNode,
    i = arguments.length,
    currentNode;
  if (!parent) return;
  if (!i)
    // if there are no arguments
    parent.removeChild(this);
  while (i--) {
    // i-- decrements i and returns the value of i before the decrement
    currentNode = arguments[i];
    if (typeof currentNode !== "object") {
      currentNode = this.ownerDocument.createTextNode(currentNode);
    } else if (currentNode.parentNode) {
      currentNode.parentNode.removeChild(currentNode);
    }
    // the value of "i" below is after the decrement
    if (!i)
      // if currentNode is the first argument (currentNode === arguments[0])
      parent.replaceChild(currentNode, this);
    // if currentNode isn't the first
    else parent.insertBefore(currentNode, this.nextSibling);
  }
}
