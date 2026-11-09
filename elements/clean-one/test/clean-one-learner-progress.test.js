// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import "../clean-one.js";

// haxtheweb/issues#3267: My learning replaces the activities bar under the title
describe("clean-one learner progress", () => {
  it("no longer renders the activities done bar under the page title", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("site-page-progress")).to.equal(null);
  });

  it("puts My learning right after the menu button; PDF, Print and QR go right; no RSS", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    const left = el.shadowRoot.querySelector(".site-header .pull-left");
    const btn = left.querySelector("my-learning-button");
    expect(btn).to.exist;
    expect(btn.hasAttribute("compact")).to.equal(false);
    expect(btn.getAttribute("part")).to.equal("my-learning-btn");
    // nothing but the menu button comes before it
    const before = [];
    let n = btn.previousElementSibling;
    while (n) {
      before.push(n.id || n.tagName);
      n = n.previousElementSibling;
    }
    expect(before.every((x) => /menubutton/i.test(x))).to.equal(true);
    expect(left.querySelector("site-print-button, .pdf-page-btn")).to.equal(
      null,
    );
    const right = el.shadowRoot.querySelector(".site-header .pull-right");
    expect(right.querySelector("site-print-button, .print-branch-btn")).to
      .exist;
    expect(el.shadowRoot.querySelector("site-rss-button")).to.equal(null);
  });

  it("has a bottom-left My learning for mobile, hidden on wide layouts", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    const mobile = el.shadowRoot.querySelector(
      "footer my-learning-button.learning-btn-mobile",
    );
    expect(mobile).to.exist;
    // the footer holds it before the page navigation cluster
    expect(mobile.nextElementSibling.tagName).to.equal("NAV");
    if (globalThis.innerWidth >= 1024) {
      expect(getComputedStyle(mobile).display).to.equal("none");
    }
  });
});

describe("clean-one toolbar row", () => {
  it("keeps its right end (PDF, Print, QR) on screen", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await el.updateComplete;
    const header = el.shadowRoot.querySelector(".site-header");
    if (getComputedStyle(header).display === "none") {
      return;
    }
    const r = header.getBoundingClientRect();
    expect(r.right).to.be.at.most(globalThis.innerWidth + 1);
    const right = el.shadowRoot.querySelector(".pull-right");
    expect(right.getBoundingClientRect().right).to.be.at.most(
      globalThis.innerWidth + 1,
    );
  });
});
