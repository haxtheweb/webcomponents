import { expect } from "@open-wc/testing";
import { buildPageContentHTML } from "../lib/core/utils/page-content-html.js";

// Counts constructions of a custom element, so we can tell whether building
// the page HTML instantiates anything in the live document.
class PageContentProbe extends HTMLElement {
  constructor() {
    super();
    PageContentProbe.constructed++;
  }
}
PageContentProbe.constructed = 0;
if (!globalThis.customElements.get("page-content-probe")) {
  globalThis.customElements.define("page-content-probe", PageContentProbe);
}
class PageBreakProbe extends HTMLElement {
  constructor() {
    super();
    PageBreakProbe.constructed++;
  }
}
PageBreakProbe.constructed = 0;
// stands in for <page-break> so the test does not load the real element
if (!globalThis.customElements.get("page-break")) {
  globalThis.customElements.define("page-break", PageBreakProbe);
}

const item = (metadata = {}, extra = {}) => ({
  id: "item-1",
  title: "Lesson 1",
  parent: "item-0",
  slug: "lesson-1",
  description: "First lesson",
  order: 2,
  metadata,
  ...extra,
});

// The previous implementation, kept here as the reference: built in the live
// document. Output of the new helper must match it exactly.
function legacyBuild(
  htmlcontent,
  activeItem,
  pageBreakHidden,
  redirectHint,
  safeLinkUrl,
) {
  const setAttrIfValue = (el, name, value) => {
    if (
      typeof value !== typeof undefined &&
      value !== null &&
      String(value) !== ""
    ) {
      el.setAttribute(name, String(value));
    }
  };
  const doc = globalThis.document;
  const wrapper = doc.createElement("div");
  const pageBreak = doc.createElement("page-break");
  pageBreak.setAttribute("break-type", "site");
  setAttrIfValue(pageBreak, "title", activeItem.title);
  setAttrIfValue(pageBreak, "parent", activeItem.parent);
  setAttrIfValue(pageBreak, "item-id", activeItem.id);
  setAttrIfValue(pageBreak, "slug", activeItem.slug);
  setAttrIfValue(pageBreak, "description", activeItem.description);
  setAttrIfValue(pageBreak, "order", activeItem.order);
  setAttrIfValue(pageBreak, "page-type", activeItem.metadata.pageType);
  setAttrIfValue(
    pageBreak,
    "tags",
    Array.isArray(activeItem.metadata.tags)
      ? activeItem.metadata.tags.join(",")
      : activeItem.metadata.tags,
  );
  setAttrIfValue(pageBreak, "related-items", activeItem.metadata.relatedItems);
  setAttrIfValue(pageBreak, "image", activeItem.metadata.image);
  setAttrIfValue(pageBreak, "icon", activeItem.metadata.icon);
  setAttrIfValue(pageBreak, "accent-color", activeItem.metadata.accentColor);
  if (activeItem.metadata.theme && activeItem.metadata.theme.key) {
    pageBreak.setAttribute("developer-theme", activeItem.metadata.theme.key);
  }
  setAttrIfValue(pageBreak, "link-url", safeLinkUrl);
  setAttrIfValue(pageBreak, "link-target", activeItem.metadata.linkTarget);
  if (activeItem.metadata.hideInMenu)
    pageBreak.setAttribute("hide-in-menu", "hide-in-menu");
  if (activeItem.metadata.locked) pageBreak.setAttribute("locked", "locked");
  if (pageBreakHidden)
    pageBreak.setAttribute("platform-hidden", "platform-hidden");
  if (activeItem.metadata.published !== false)
    pageBreak.setAttribute("published", "published");
  if (activeItem.metadata.overridePathauto)
    pageBreak.setAttribute("override-pathauto", "override-pathauto");
  wrapper.appendChild(pageBreak);
  wrapper.appendChild(doc.createRange().createContextualFragment(htmlcontent));
  if (safeLinkUrl) {
    const linkTarget = ["_self", "_blank", "_parent", "_top"].includes(
      activeItem.metadata.linkTarget,
    )
      ? activeItem.metadata.linkTarget
      : "_self";
    const p1 = doc.createElement("p");
    const a = doc.createElement("a");
    a.setAttribute("href", String(safeLinkUrl));
    a.setAttribute("target", String(linkTarget));
    a.setAttribute("rel", "noopener noreferrer");
    a.textContent = String(safeLinkUrl);
    p1.appendChild(a);
    const p2 = doc.createElement("p");
    const small = doc.createElement("small");
    small.textContent = redirectHint;
    p2.appendChild(small);
    wrapper.appendChild(p1);
    wrapper.appendChild(p2);
  }
  return wrapper.innerHTML;
}

describe("buildPageContentHTML", () => {
  beforeEach(() => {
    PageContentProbe.constructed = 0;
    PageBreakProbe.constructed = 0;
  });

  it("constructs no custom elements while building the page HTML", () => {
    const html = buildPageContentHTML(
      "<p>intro</p><page-content-probe><page-content-probe></page-content-probe></page-content-probe>",
      item(),
    );
    expect(PageBreakProbe.constructed).to.equal(0);
    expect(PageContentProbe.constructed).to.equal(0);
    expect(html).to.contain(
      "<page-content-probe><page-content-probe></page-content-probe></page-content-probe>",
    );
  });

  it("puts a site page-break with the item details first", () => {
    const html = buildPageContentHTML(
      "<p>body</p>",
      item({ pageType: "lesson", tags: ["a", "b"], icon: "icons:star" }),
    );
    const holder = document.createElement("template");
    holder.innerHTML = html;
    const first = holder.content.firstElementChild;
    expect(first.localName).to.equal("page-break");
    expect(first.getAttribute("break-type")).to.equal("site");
    expect(first.getAttribute("title")).to.equal("Lesson 1");
    expect(first.getAttribute("item-id")).to.equal("item-1");
    expect(first.getAttribute("parent")).to.equal("item-0");
    expect(first.getAttribute("order")).to.equal("2");
    expect(first.getAttribute("page-type")).to.equal("lesson");
    expect(first.getAttribute("tags")).to.equal("a,b");
    expect(first.getAttribute("icon")).to.equal("icons:star");
    expect(first.hasAttribute("published")).to.equal(true);
    expect(holder.content.lastElementChild.outerHTML).to.equal("<p>body</p>");
  });

  it("marks unpublished, locked, hidden and platform-hidden pages", () => {
    const html = buildPageContentHTML(
      "",
      item({
        published: false,
        locked: true,
        hideInMenu: true,
        overridePathauto: true,
      }),
      { pageBreakHidden: true },
    );
    expect(html).to.not.contain(" published=");
    expect(html).to.contain('locked="locked"');
    expect(html).to.contain('hide-in-menu="hide-in-menu"');
    expect(html).to.contain('platform-hidden="platform-hidden"');
    expect(html).to.contain('override-pathauto="override-pathauto"');
  });

  it("adds a sanitized link and hint for link-out pages", () => {
    const html = buildPageContentHTML(
      "<p>x</p>",
      item({ linkUrl: "https://example.com/a", linkTarget: "_blank" }),
      {
        redirectHint: "You are being redirected",
      },
    );
    expect(html).to.contain('link-url="https://example.com/a"');
    expect(html).to.contain(
      '<a href="https://example.com/a" target="_blank" rel="noopener noreferrer">https://example.com/a</a>',
    );
    expect(html).to.contain("<small>You are being redirected</small>");
  });

  it("drops an unsafe link url and falls back to _self for unknown targets", () => {
    const unsafe = buildPageContentHTML(
      "<p>x</p>",
      item({ linkUrl: "javascript:alert(1)" }),
    );
    expect(unsafe).to.not.contain("javascript:");
    expect(unsafe).to.not.contain("<a ");
    const odd = buildPageContentHTML(
      "<p>x</p>",
      item({ linkUrl: "https://example.com", linkTarget: "_evil" }),
    );
    expect(odd).to.contain('target="_self"');
  });

  it("matches the previous live-document output exactly", () => {
    const cases = [
      ["<p>plain</p>", item(), false, "", ""],
      [
        '<grid-plate layout="1-1"><div slot="col-1"><p>a</p></div></grid-plate><template preserve-content="preserve-content"><b>t</b></template>',
        item({
          pageType: "lesson",
          tags: "x,y",
          accentColor: "blue",
          theme: { key: "dark" },
          relatedItems: "item-2",
        }),
        true,
        "",
        "",
      ],
      [
        "<ul><li>1</li><li>2</li></ul><!-- note --><code-sample></code-sample>",
        item({ published: false, locked: true }),
        false,
        "",
        "",
      ],
      [
        "<p>go</p>",
        item({ linkUrl: "https://example.com/z", linkTarget: "_top" }),
        false,
        "Redirecting",
        "https://example.com/z",
      ],
      [
        "text only &amp; entities &lt;b&gt;",
        item({}, { order: 0, description: "" }),
        false,
        "",
        "",
      ],
    ];
    for (const [content, it, hidden, hint, link] of cases) {
      const expected = legacyBuild(content, it, hidden, hint, link);
      const actual = buildPageContentHTML(content, it, {
        pageBreakHidden: hidden,
        redirectHint: hint,
      });
      expect(actual).to.equal(expected);
    }
  });
});
