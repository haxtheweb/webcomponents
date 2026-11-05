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

/**
 * Remove elements that are unsafe in content: base / meta (URL hijack and
 * refresh redirects), script-loading custom elements, and SVG animations
 * that rewrite href (bypasses per-attribute URL checks).
 */
export function removeUnsafeElements(root) {
  if (!root || !root.querySelectorAll) {
    return root;
  }
  const bad = root.querySelectorAll(
    badContentElements.join(",") + ",set,animate",
  );
  for (let i = 0; i < bad.length; i++) {
    const tag = bad[i].tagName.toLowerCase();
    if (tag === "set" || tag === "animate") {
      const target = (bad[i].getAttribute("attributeName") || "")
        .trim()
        .toLowerCase();
      if (target !== "href" && target !== "xlink:href") {
        continue;
      }
    }
    if (bad[i].parentNode) {
      bad[i].parentNode.removeChild(bad[i]);
    }
  }
  return root;
}

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
      // security: catch any remaining on* handler the browser supports
      const all = [el];
      if (el.querySelectorAll) {
        const nested = el.querySelectorAll("*");
        for (let i = 0; i < nested.length; i++) {
          all.push(nested[i]);
        }
      }
      for (let i = 0; i < all.length; i++) {
        if (!all[i].attributes) {
          continue;
        }
        for (let j = all[i].attributes.length - 1; j >= 0; j--) {
          const attr = all[i].attributes.item(j);
          if (attr && isEventHandlerAttribute(attr.name)) {
            all[i].removeAttribute(attr.name);
          }
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
  removeUnsafeElements(root);
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
  if (encapsulateScriptTags) {
    neutralizeStrayScripts(template.content);
  }
  sanitizeNodeTree(template.content, {
    sanitizeTemplateContents: sanitizeTemplateContents,
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
  const safeHTML = encapsulateScriptTags
    ? encapScript(typeof html === "string" ? html : "")
    : typeof html === "string"
      ? html
      : "";
  const template = globalThis.document.createElement("template");
  template.innerHTML = safeHTML;
  if (encapsulateScriptTags) {
    neutralizeStrayScripts(template.content);
  }
  sanitizeNodeTree(template.content, {
    sanitizeTemplateContents: sanitizeTemplateContents,
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
// security (F7/JS-URL-001): validate scheme before navigation
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
