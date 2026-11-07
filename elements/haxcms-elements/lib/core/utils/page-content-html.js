import { sanitizeURLValue } from "@haxtheweb/utils/lib/url.js";

// One inert document, shared. Elements created in a document with no browsing
// context are never upgraded, so no custom element constructor runs while the
// page HTML is assembled. Building it in the live document constructed a
// <page-break> (and every custom element in the page content) only to read
// innerHTML and throw it away; those instances were never connected, so
// anything they set up in their constructor (MobX autoruns, observers,
// listeners) was never released and kept them alive for the life of the tab.
let inertDoc = null;
function getInertDocument() {
  if (!inertDoc) {
    inertDoc = globalThis.document.implementation.createHTMLDocument("");
  }
  return inertDoc;
}

function setAttrIfValue(el, name, value) {
  if (
    typeof value !== typeof undefined &&
    value !== null &&
    String(value) !== ""
  ) {
    el.setAttribute(name, String(value));
  }
}

const LINK_TARGETS = ["_self", "_blank", "_parent", "_top"];

/**
 * Build the HTML HAXcms renders for a page: a site page-break carrying the
 * item's details, then the page content, then (when the item links elsewhere)
 * a link and a short hint. Returns a string; nothing is constructed or
 * connected in the live document.
 *
 * @param {string} htmlcontent page body HTML
 * @param {object} activeItem JOS item (needs metadata)
 * @param {object} [options]
 * @param {boolean} [options.pageBreakHidden] platform hides the page-break
 * @param {string} [options.redirectHint] text under a link-out page's link
 * @returns {string}
 */
export function buildPageContentHTML(htmlcontent, activeItem, options = {}) {
  const doc = getInertDocument();
  const metadata = activeItem.metadata || {};
  const wrapper = doc.createElement("div");
  const pageBreak = doc.createElement("page-break");
  pageBreak.setAttribute("break-type", "site");
  setAttrIfValue(pageBreak, "title", activeItem.title);
  setAttrIfValue(pageBreak, "parent", activeItem.parent);
  setAttrIfValue(pageBreak, "item-id", activeItem.id);
  setAttrIfValue(pageBreak, "slug", activeItem.slug);
  setAttrIfValue(pageBreak, "description", activeItem.description);
  setAttrIfValue(pageBreak, "order", activeItem.order);
  setAttrIfValue(pageBreak, "page-type", metadata.pageType);
  setAttrIfValue(
    pageBreak,
    "tags",
    Array.isArray(metadata.tags) ? metadata.tags.join(",") : metadata.tags,
  );
  setAttrIfValue(pageBreak, "related-items", metadata.relatedItems);
  setAttrIfValue(pageBreak, "image", metadata.image);
  setAttrIfValue(pageBreak, "icon", metadata.icon);
  setAttrIfValue(pageBreak, "accent-color", metadata.accentColor);
  if (metadata.theme && metadata.theme.key) {
    pageBreak.setAttribute("developer-theme", metadata.theme.key);
  }
  const safeLinkUrl = sanitizeURLValue(metadata.linkUrl, "");
  setAttrIfValue(pageBreak, "link-url", safeLinkUrl);
  setAttrIfValue(pageBreak, "link-target", metadata.linkTarget);
  if (metadata.hideInMenu) {
    pageBreak.setAttribute("hide-in-menu", "hide-in-menu");
  }
  if (metadata.locked) {
    pageBreak.setAttribute("locked", "locked");
  }
  if (options.pageBreakHidden) {
    pageBreak.setAttribute("platform-hidden", "platform-hidden");
  }
  if (metadata.published !== false) {
    pageBreak.setAttribute("published", "published");
  }
  if (metadata.overridePathauto) {
    pageBreak.setAttribute("override-pathauto", "override-pathauto");
  }
  wrapper.appendChild(pageBreak);
  // parsed in the inert document: same markup, no element upgrades
  wrapper.insertAdjacentHTML("beforeend", htmlcontent);
  // a link-out page also gets a plain link and a short hint, for visitors
  if (safeLinkUrl) {
    const linkTarget = LINK_TARGETS.includes(metadata.linkTarget)
      ? metadata.linkTarget
      : "_self";
    const linkParagraph = doc.createElement("p");
    const link = doc.createElement("a");
    link.setAttribute("href", String(safeLinkUrl));
    link.setAttribute("target", String(linkTarget));
    link.setAttribute("rel", "noopener noreferrer");
    link.textContent = String(safeLinkUrl);
    linkParagraph.appendChild(link);
    const hintParagraph = doc.createElement("p");
    const hint = doc.createElement("small");
    hint.textContent = options.redirectHint || "";
    hintParagraph.appendChild(hint);
    wrapper.appendChild(linkParagraph);
    wrapper.appendChild(hintParagraph);
  }
  return wrapper.innerHTML;
}
