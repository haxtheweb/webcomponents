/**
 * Frozen copy of the sanitizer tree walk as it was before it was made linear
 * (haxtheweb/issues#3263). It is NOT used by any element: sanitize-linear.test.js
 * runs it side by side with lib/sanitize.js on hostile fixtures to prove the
 * one-pass walk removes exactly what the old per-subtree passes removed.
 * Only the tree-walking parts are copied; the per-attribute predicates
 * (isEventHandlerAttribute, isURLAttribute, URL protocol checks) are shared
 * with the real module so the comparison is about the walk, not the rules.
 */
import {
  badJSEventAttributes,
  badIFrameAttributes,
  badContentElements,
  isEventHandlerAttribute,
  isURLAttribute,
  neutralizeStrayScripts,
} from "../lib/sanitize.js";
import { hasUnsafeURLProtocol, sanitizeEmbeddableURL } from "../lib/url.js";
import { encapScript } from "../lib/safe-html.js";

export function legacyRemoveUnsafeElements(root) {
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

export function legacyRemoveUnsafeURLAttributes(el) {
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

export function legacyRemoveUnsafeIframeAttributes(el) {
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

export function legacyRemoveBadJSEventAttributes(el) {
  if (el) {
    if (el.attributes) {
      for (let i = 0; i < badJSEventAttributes.length; i++) {
        el.removeAttribute(badJSEventAttributes[i]);
        let replacement = el.querySelectorAll(`[${badJSEventAttributes[i]}]`);
        for (let j = 0; j < replacement.length; j++) {
          replacement[j].removeAttribute(badJSEventAttributes[i]);
        }
      }
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
    legacyRemoveUnsafeIframeAttributes(el);
    legacyRemoveUnsafeURLAttributes(el);
  }
  return el;
}

export function legacySanitizeNodeTree(
  root,
  { sanitizeTemplateContents = true } = {},
) {
  if (!root) {
    return root;
  }
  legacyRemoveUnsafeElements(root);
  if (root.nodeType === globalThis.Node.ELEMENT_NODE) {
    legacyRemoveBadJSEventAttributes(root);
    if (
      sanitizeTemplateContents &&
      root.tagName &&
      root.tagName.toLowerCase() === "template" &&
      root.content
    ) {
      legacySanitizeNodeTree(root.content, {
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
        legacySanitizeNodeTree(child, {
          sanitizeTemplateContents: sanitizeTemplateContents,
        });
      }
    }
  }
  return root;
}

/**
 * The old sanitizeHTMLString pipeline, using the legacy walk above.
 */
export function legacySanitizeHTMLString(
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
  legacySanitizeNodeTree(template.content, {
    sanitizeTemplateContents: sanitizeTemplateContents,
  });
  return template.innerHTML;
}
