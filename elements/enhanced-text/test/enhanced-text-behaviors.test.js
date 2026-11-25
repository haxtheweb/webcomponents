import { fixture, expect, html } from "@open-wc/testing";
import sinon from "sinon";

import "../enhanced-text.js";

// Gap-closing behavioral tests for enhanced-text: glossary term
// application (single text node, element-only content, links, mark-all)
// and enhance(), which runs in the browser: vide through the text-vide
// library and the glossary from the site's own glossary page (fetch is
// stubbed so no network is ever hit, and no outside service is called).
const SITE = {
  items: [
    { id: "a", slug: "intro", location: "pages/intro/index.html" },
    { id: "g", slug: "glossary", location: "pages/glossary/index.html" },
  ],
};
const GLOSSARY =
  "<dl><dt>body</dt><dd>The main part</dd><dt>text</dt><dd>Words</dd></dl>";
function stubFetch(routes) {
  return sinon.stub(globalThis, "fetch").callsFake(async (url) => {
    const key = Object.keys(routes).find((k) => String(url).endsWith(k));
    if (!key) return new Response("", { status: 404 });
    const value = routes[key];
    return new Response(
      typeof value === "string" ? value : JSON.stringify(value),
      { status: 200 },
    );
  });
}
describe("enhanced-text behaviors", () => {
  it("wraps a matching term in vocab-term from a single text node", async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    );
    el.applyTermFromList({
      status: true,
      data: [{ term: "sample", definition: "A representative part" }],
    });
    const termEl = el.querySelector("vocab-term");
    expect(termEl).to.exist;
    expect(termEl.term).to.equal("sample");
    expect(termEl.information).to.equal("A representative part");
  });

  it("splits element-only content via innerText before applying terms", async () => {
    const el = await fixture(
      html`<enhanced-text><p>sample text here</p></enhanced-text>`,
    );
    // no direct text nodes: the innerText fallback path must run
    el.applyTermFromList({
      status: true,
      data: [{ term: "sample", definition: "A representative part" }],
    });
    const termEl = el.querySelector("vocab-term");
    expect(termEl).to.exist;
    expect(termEl.term).to.equal("sample");
    // the wrapping p was cleared by the innerHTML reset
    expect(el.querySelector("p")).to.equal(null);
  });

  it("does nothing without status or data", async () => {
    const el = await fixture(html`<enhanced-text>plain text</enhanced-text>`);
    el.applyTermFromList({ status: false });
    el.applyTermFromList({ status: true, data: [] });
    expect(el.querySelector("vocab-term")).to.equal(null);
    expect(el.textContent.trim()).to.equal("plain text");
    // null payload is ignored by the applyTermFromList null guard
    // (haxtheweb/issues#3102)
    expect(() => el.applyTermFromList(null)).to.not.throw();
    expect(el.querySelector("vocab-term")).to.equal(null);
  });

  it("appends definition links inside the vocab-term", async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    );
    el.applyTermFromList({
      status: true,
      data: [
        {
          term: "sample",
          definition: "A representative part",
          links: [{ href: "https://haxtheweb.org", title: "HAXTheWeb" }],
        },
      ],
    });
    const termEl = el.querySelector("vocab-term");
    expect(termEl).to.exist;
    const div = termEl.querySelector("div.links");
    expect(div).to.exist;
    const a = div.querySelector("a");
    expect(a.getAttribute("href")).to.equal("https://haxtheweb.org");
    expect(a.innerText).to.equal("HAXTheWeb");
  });

  it("only marks the first match unless haxcms-mark-all is set", async () => {
    const el = await fixture(
      html`<enhanced-text>sample and sample</enhanced-text>`,
    );
    el.applyTermFromList({
      status: true,
      data: [{ term: "sample", definition: "d" }],
    });
    expect(el.querySelectorAll("vocab-term").length).to.equal(1);
    const all = await fixture(
      html`<enhanced-text haxcms-mark-all>sample and sample</enhanced-text>`,
    );
    all.applyTermFromList({
      status: true,
      data: [{ term: "sample", definition: "d" }],
    });
    expect(all.querySelectorAll("vocab-term").length).to.equal(2);
  });

  it("enhance() bolds word starts with text-vide in the browser", async () => {
    const fetchStub = stubFetch({});
    try {
      const el = await fixture(
        html`<enhanced-text vide>Some body text</enhanced-text>`,
      );
      const p = el.enhance();
      expect(el.loading).to.equal(true);
      await p;
      expect(el.querySelectorAll("b").length).to.be.greaterThan(0);
      expect(el.textContent.replace(/\s+/g, " ").trim()).to.equal(
        "Some body text",
      );
      expect(fetchStub.callCount).to.equal(0);
      expect(el.loading).to.equal(false);
    } finally {
      fetchStub.restore();
    }
  });

  it("enhance() reads the glossary from haxcms-site data, relative to the page", async () => {
    const fetchStub = stubFetch({ "pages/glossary/index.html": GLOSSARY });
    try {
      const el = await fixture(
        html`<enhanced-text haxcms-glossary .haxcmsSite=${SITE}
          >Some body text</enhanced-text
        >`,
      );
      expect(await el.siteGlossaryTerms()).to.deep.equal([
        { term: "body", definition: "The main part" },
        { term: "text", definition: "Words" },
      ]);
      await el.enhance();
      expect(el.querySelectorAll("vocab-term").length).to.equal(2);
      expect(String(fetchStub.getCall(0).args[0])).to.equal(
        "pages/glossary/index.html",
      );
      expect(el.loading).to.equal(false);
    } finally {
      fetchStub.restore();
    }
  });

  it("enhance() reads the glossary from a haxcms-site-location, never from Wikipedia", async () => {
    const fetchStub = stubFetch({
      "/site.json": SITE,
      "pages/glossary/index.html": GLOSSARY,
    });
    try {
      const el = await fixture(
        html`<enhanced-text
          haxcms-glossary
          haxcms-site-location="https://example.com/sites/a/site.json"
          wikipedia
          >Some body text</enhanced-text
        >`,
      );
      await el.enhance();
      const urls = fetchStub.getCalls().map((c) => String(c.args[0]));
      expect(urls).to.deep.equal([
        "https://example.com/sites/a/site.json",
        "https://example.com/sites/a/pages/glossary/index.html",
      ]);
      expect(urls.join(" ").indexOf("wikipedia")).to.equal(-1);
      expect(el.querySelectorAll("vocab-term").length).to.equal(2);
    } finally {
      fetchStub.restore();
    }
  });

  it("a site without a glossary page, or one that fails to load, leaves the text alone", async () => {
    const fetchStub = stubFetch({ "/site.json": { items: [] } });
    try {
      const el = await fixture(
        html`<enhanced-text
          haxcms-glossary
          haxcms-site-location="https://example.com/sites/b"
          >Some body text</enhanced-text
        >`,
      );
      expect(await el.siteGlossaryTerms()).to.deep.equal([]);
      el.haxcmsSiteLocation = "https://example.com/sites/missing";
      expect(await el.siteGlossaryTerms()).to.deep.equal([]);
      await el.enhance();
      expect(el.querySelectorAll("vocab-term").length).to.equal(0);
      expect(el.loading).to.equal(false);
    } finally {
      fetchStub.restore();
    }
  });

  it("enhance() does nothing without enhancement flags", async () => {
    const fetchStub = stubFetch({});
    try {
      const el = await fixture(
        html`<enhanced-text>Some body text</enhanced-text>`,
      );
      await el.enhance();
      expect(fetchStub.callCount).to.equal(0);
      expect(el.innerHTML).to.equal("Some body text");
      expect(el.loading).to.equal(false);
      // glossary without a site or location also skips
      el.haxcmsGlossary = true;
      await el.enhance();
      expect(fetchStub.callCount).to.equal(0);
    } finally {
      fetchStub.restore();
    }
  });

  it("firstUpdated auto-enhances once connected with flags", async () => {
    const el = await fixture(
      html`<enhanced-text auto vide>Some body text</enhanced-text>`,
    );
    const done = await new Promise((resolve) => {
      let tries = 0;
      const check = () => {
        if (el.querySelectorAll("b").length || tries++ > 100) {
          resolve(el.querySelectorAll("b").length > 0);
        } else {
          setTimeout(check, 20);
        }
      };
      check();
    });
    expect(done).to.be.true;
  });

  it("invokes the response callback data into innerHTML", async () => {
    const el = await fixture(
      html`<enhanced-text>Some body text</enhanced-text>`,
    );
    el.enhancedTextResponse({
      status: true,
      data: "<p>Enhanced <b>text</b></p>",
    });
    expect(el.innerHTML).to.contain("<b>text</b>");
  });

  it("loads the vocab-term dynamic import graph cleanly", async () => {
    // haxtheweb/issues#3107: the suite used to log an unhandled promise
    // rejection from the vocab-term dynamic import graph (a bare-lit
    // ifDefined import, since fixed). Waiting on the same dynamic import
    // the element fires in applyTermFromList turns any future
    // module-graph regression into a hard failure instead of console
    // noise.
    const mod = await import("@haxtheweb/vocab-term/vocab-term.js");
    expect(mod.VocabTerm).to.exist;
    expect(mod.VocabTerm.tag).to.equal("vocab-term");
  });

  it("passes the a11y audit with a vocab-term applied", async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    );
    el.applyTermFromList({
      status: true,
      data: [{ term: "sample", definition: "A representative part" }],
    });
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});
