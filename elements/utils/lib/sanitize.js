/**
 * HTML / DOM sanitizing helpers for authored and imported content.
 * Split out of utils.js so first-paint code can import them without the
 * rest of the utils barrel; utils.js re-exports them unchanged.
 */
import { hasUnsafeURLProtocol, sanitizeEmbeddableURL } from "./url.js";
import { encapScript } from "./safe-html.js";

export let badJSEventAttributes = [
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
export let badIFrameAttributes = ["srcdoc"];
// elements that never belong in authored / imported content
export let badContentElements = ["base", "meta", "lrn-math-controller"];

/**
 * Is this attribute an inline event handler the browser will execute?
 * security: the fixed badJSEventAttributes list goes stale as browsers add
 * events (e.g. oncommand), so also ask the platform. Only base prototypes are
 * checked so custom element attributes like "one-line" are left alone.
 */
export function isEventHandlerAttribute(attributeName) {
  if (!attributeName || typeof attributeName !== "string") {
    return false;
  }
  const name = attributeName.toLowerCase();
  if (badJSEventAttributes.includes(name)) {
    return true;
  }
  if (!/^on[a-z]+$/.test(name)) {
    return false;
  }
  return (
    (globalThis.HTMLElement && name in globalThis.HTMLElement.prototype) ||
    (globalThis.SVGElement && name in globalThis.SVGElement.prototype) ||
    (globalThis.Element && name in globalThis.Element.prototype) ||
    (globalThis.Document && name in globalThis.Document.prototype) ||
    name in globalThis
  );
}

// ---------------------------------------------------------------------------
// Tree walking. Every sanitizer below visits each element exactly once and
// only looks at that element's own attributes, so sanitizing is linear in the
// size of the content. The old implementation re-scanned every subtree from
// every ancestor (roughly nodes x depth x 114 querySelectorAll calls), which
// is what made entering edit mode on a large page drop frames
// (haxtheweb/issues#3263). What gets removed is unchanged; see
// test/sanitize-linear.test.js, which compares against the old walk.
// ---------------------------------------------------------------------------

/**
 * Next element after `node` in document order, staying inside `root`.
 * Template contents are a separate tree and are never entered, matching
 * querySelectorAll("*").
 * @param {Element} node current element
 * @param {Node} root walk root (never returned)
 * @param {Boolean} skipChildren true to step over node's descendants
 * @returns {Element|null}
 */
function nextElementInTree(node, root, skipChildren) {
  if (!skipChildren && node.firstElementChild) {
    return node.firstElementChild;
  }
  let current = node;
  while (current && current !== root) {
    if (current.nextElementSibling) {
      return current.nextElementSibling;
    }
    current = current.parentNode;
  }
  return null;
}

/**
 * Call fn on every element below root (not root itself), in document order.
 * fn may return true to remove that element; its subtree is then skipped.
 */
function walkDescendants(root, fn) {
  if (!root || typeof root.firstElementChild === "undefined") {
    return;
  }
  let node = root.firstElementChild;
  while (node) {
    const remove = fn(node) === true;
    // work out where to go next before any removal unlinks the node
    const next = nextElementInTree(node, root, remove);
    if (remove && node.parentNode) {
      node.parentNode.removeChild(node);
    }
    node = next;
  }
}

function isElementNode(node) {
  return !!node && node.nodeType === 1;
}

function isUnsafeContentElement(el) {
  const tag = (el.localName || "").toLowerCase();
  if (badContentElements.includes(tag)) {
    return true;
  }
  // SVG animations that rewrite href bypass per-attribute URL checks
  if (tag === "set" || tag === "animate") {
    const target = (el.getAttribute("attributeName") || "")
      .trim()
      .toLowerCase();
    return target === "href" || target === "xlink:href";
  }
  return false;
}

// remove one attribute node; removeAttributeNode also catches odd-cased
// names set through setAttributeNS that removeAttribute(name) would miss
function dropAttribute(el, attr) {
  try {
    el.removeAttributeNode(attr);
  } catch {
    el.removeAttribute(attr.name);
  }
}

/**
 * Remove inline event handler attributes from this one element.
 */
function stripEventHandlerAttributes(el) {
  const attrs = el.attributes;
  if (!attrs) {
    return;
  }
  for (let j = attrs.length - 1; j >= 0; j--) {
    const attr = attrs.item(j);
    if (attr && isEventHandlerAttribute(attr.name)) {
      dropAttribute(el, attr);
    }
  }
}

function isIframeLikeElement(el) {
  return (
    el && el.tagName && ["iframe", "webview"].includes(el.tagName.toLowerCase())
  );
}

/**
 * Remove srcdoc and any non http(s) src from this one iframe / webview.
 */
function stripUnsafeIframeAttributes(el) {
  if (!isIframeLikeElement(el)) {
    return;
  }
  for (let j = 0; j < badIFrameAttributes.length; j++) {
    el.removeAttribute(badIFrameAttributes[j]);
  }
  const src = el.getAttribute("src");
  const safeSrc = sanitizeEmbeddableURL(src, "");
  if (safeSrc === "") {
    el.removeAttribute("src");
  } else if (safeSrc !== src) {
    el.setAttribute("src", safeSrc);
  }
}

/**
 * Remove URL attributes carrying javascript: / vbscript: / data: from this
 * one element.
 */
function stripUnsafeURLAttributes(el) {
  const attrs = el.attributes;
  if (!attrs) {
    return;
  }
  for (let j = attrs.length - 1; j >= 0; j--) {
    const attr = attrs.item(j);
    if (attr && isURLAttribute(attr.name) && hasUnsafeURLProtocol(attr.value)) {
      dropAttribute(el, attr);
    }
  }
}

/**
 * Everything the attribute sanitizers do, for one element, in the same order
 * removeBadJSEventAttributes has always applied them.
 */
function sanitizeElementAttributes(el, stripEvents) {
  if (stripEvents) {
    stripEventHandlerAttributes(el);
  }
  stripUnsafeIframeAttributes(el);
  stripUnsafeURLAttributes(el);
}

/**
 * Remove elements that are unsafe in content: base / meta (URL hijack and
 * refresh redirects), script-loading custom elements, and SVG animations
 * that rewrite href (bypasses per-attribute URL checks).
 */
/**
 * security: html-block runs its slotted markup as raw script when it carries
 * `allowscript`, but that attribute travels with the authored content. Only
 * a platform that opted in (globalThis.HAXHtmlBlockAllowScript or
 * appSettings.htmlBlockAllowScript, see html-block) may keep it; everywhere
 * else it is stripped so saved content cannot grant itself script.
 */
function platformAllowsHtmlBlockScript() {
  if (globalThis.HAXHtmlBlockAllowScript === true) {
    return true;
  }
  return !!(
    globalThis.appSettings &&
    globalThis.appSettings.htmlBlockAllowScript === true
  );
}

export function removeUnsafeElements(root) {
  if (!root || !root.querySelectorAll) {
    return root;
  }
  if (!platformAllowsHtmlBlockScript()) {
    const scripted = root.querySelectorAll("[allowscript]");
    for (let i = 0; i < scripted.length; i++) {
      scripted[i].removeAttribute("allowscript");
    }
    if (
      root.removeAttribute &&
      root.hasAttribute &&
      root.hasAttribute("allowscript")
    ) {
      root.removeAttribute("allowscript");
    }
  }
  walkDescendants(root, isUnsafeContentElement);
  return root;
}

const URL_ATTRIBUTE_NAMES = [
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
];

export function isURLAttribute(attributeName) {
  if (!attributeName || typeof attributeName !== "string") {
    return false;
  }
  const name = attributeName.toLowerCase();
  return (
    URL_ATTRIBUTE_NAMES.includes(name) ||
    /(^|[-_:])(src|source|href|url)$/.test(name)
  );
}

export function removeUnsafeURLAttributes(el) {
  if (!el) {
    return el;
  }
  if (isElementNode(el)) {
    stripUnsafeURLAttributes(el);
  }
  walkDescendants(el, stripUnsafeURLAttributes);
  return el;
}

export function removeUnsafeIframeAttributes(el) {
  if (!el) {
    return el;
  }
  stripUnsafeIframeAttributes(el);
  walkDescendants(el, stripUnsafeIframeAttributes);
  return el;
}

/**
 * Remove inline event handlers, unsafe iframe attributes and unsafe URL
 * attributes from el and everything below it (template contents excluded,
 * as before). One pass, each element's own attributes checked once.
 */
export function removeBadJSEventAttributes(el) {
  // remove any bad event attributes that might have snuck in
  if (el) {
    // event handlers were only ever stripped when called on an element
    const stripEvents = !!el.attributes;
    if (isElementNode(el)) {
      sanitizeElementAttributes(el, stripEvents);
    }
    walkDescendants(el, (node) => {
      sanitizeElementAttributes(node, stripEvents);
    });
  }
  return el;
}

/**
 * Sanitize a parsed tree in place: drop unsafe elements, strip unsafe
 * attributes from every element, and (by default) do the same inside
 * <template> contents. One walk over the tree.
 * @param {Node} root element, fragment or document
 * @param {Object} opts sanitizeTemplateContents (default true)
 * @returns {Node} root
 */
export function sanitizeNodeTree(
  root,
  { sanitizeTemplateContents = true } = {},
) {
  if (!root) {
    return root;
  }
  const allowScript = platformAllowsHtmlBlockScript();
  const visit = (el) => {
    sanitizeElementAttributes(el, true);
    if (!allowScript && el.hasAttribute && el.hasAttribute("allowscript")) {
      el.removeAttribute("allowscript");
    }
    if (
      sanitizeTemplateContents &&
      el.tagName &&
      el.tagName.toLowerCase() === "template" &&
      el.content
    ) {
      sanitizeNodeTree(el.content, {
        sanitizeTemplateContents: sanitizeTemplateContents,
      });
    }
  };
  // the root itself is sanitized but never removed
  if (root.nodeType === globalThis.Node.ELEMENT_NODE) {
    visit(root);
  }
  walkDescendants(root, (el) => {
    if (isUnsafeContentElement(el)) {
      return true;
    }
    visit(el);
    return false;
  });
  return root;
}
/**
 * Turn any <script> / <style> that is NOT inside a <template> back into
 * inert text, matching what encapScript intends. encapScript works on the
 * raw string and deliberately restores scripts inside <template> (code-sample
 * keeps example code there), but a string scan can be fooled into restoring a
 * script that the browser actually parses outside the template, e.g.
 * `<template></template><script>` or `<!--<template>--><script>`. This is the
 * DOM-level check: querySelectorAll never descends into template content, so
 * only stray scripts / styles are matched.
 * @param {DocumentFragment|Element} root parsed content
 * @returns {DocumentFragment|Element} root, modified in place
 */
export function neutralizeStrayScripts(root) {
  if (!root || !root.querySelectorAll) {
    return root;
  }
  const stray = root.querySelectorAll("script,style");
  for (let i = 0; i < stray.length; i++) {
    const el = stray[i];
    const tag = el.tagName.toLowerCase();
    el.replaceWith(
      globalThis.document.createTextNode(
        "<" + tag + ">" + el.textContent + "</" + tag + ">",
      ),
    );
  }
  return root;
}
/**
 * Parse untrusted HTML into a <template> that belongs to a separate, inert
 * document, then sanitize it. Nothing parsed here runs or loads: the inert
 * document has no browsing context (no scripts, event handlers, images or
 * custom element upgrades), and the live page's DOM is never written with
 * the unsanitized markup. Parsing in a <template> keeps fragment rules, so
 * table parts like <tr>/<td> survive on their own. Callers append the
 * sanitized nodes, which adopts them into the page.
 * @param {String} html raw HTML
 * @param {Object} opts same options as sanitizeHTMLForImport
 * @returns {HTMLTemplateElement} template whose content is sanitized
 */
function parseSanitizedTemplate(
  html,
  { sanitizeTemplateContents = true, encapsulateScriptTags = true } = {},
) {
  const raw = typeof html === "string" ? html : "";
  const safeHTML = encapsulateScriptTags ? encapScript(raw) : raw;
  const inert = globalThis.document.implementation.createHTMLDocument("");
  const template = inert.createElement("template");
  template.innerHTML = safeHTML;
  if (encapsulateScriptTags) {
    neutralizeStrayScripts(template.content);
  }
  sanitizeNodeTree(template.content, {
    sanitizeTemplateContents: sanitizeTemplateContents,
  });
  return template;
}
export function sanitizeHTMLForImport(
  html,
  { sanitizeTemplateContents = true, encapsulateScriptTags = true } = {},
) {
  const template = parseSanitizedTemplate(html, {
    sanitizeTemplateContents,
    encapsulateScriptTags,
  });
  return template.content.cloneNode(true);
}

/**
 * Sanitize an HTML string and return a safe serialized string for use with
 * `unsafeHTML` / `innerHTML` sinks (mirrors sanitizeHTMLForImport's pipeline
 * but returns a string instead of a DocumentFragment).
 * @param {String} html - raw HTML to sanitize
 * @param {Object} opts - same options as sanitizeHTMLForImport
 * @returns {String} sanitized HTML string safe for string-based DOM sinks
 */
export function sanitizeHTMLString(
  html,
  { sanitizeTemplateContents = true, encapsulateScriptTags = true } = {},
) {
  // Security (fail closed): sanitizing needs a real HTML parser. Where there
  // is none, such as Lit server rendering, return nothing rather than the
  // unsanitized input, so markup only ever reaches a sink after it has been
  // parsed and cleaned. The browser fills it in when the element renders.
  if (
    !globalThis.document ||
    !globalThis.document.implementation ||
    typeof globalThis.document.implementation.createHTMLDocument !== "function"
  ) {
    return "";
  }
  const template = parseSanitizedTemplate(html, {
    sanitizeTemplateContents,
    encapsulateScriptTags,
  });
  // security: return serialized safe HTML for unsafeHTML/innerHTML sinks
  // (prevents stored XSS via onerror/onload event handlers and javascript: URLs)
  return template.innerHTML;
}

/**
 * Validate a navigation target so only http/https schemes reach a
 * `globalThis.location` assignment sink. Mirrors jwt-login.safeRedirect:
 * resolve the value relative to the current page, then reject any
 * non-http(s) scheme so attacker-influenced values can't execute script
 * on navigation (blocks javascript:/data:/vbscript:).
 * @param {String} raw - raw navigation target (absolute href or relative path)
 * @returns {String} validated href safe for globalThis.location assignment
 */
// security (JS-URL): validate scheme before navigation
export function safeNavigateHref(raw) {
  try {
    const u = new URL(raw, globalThis.location.href);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return "/";
    }
    return u.href;
  } catch {
    return "/";
  }
}
