import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";

describe("haxcms-site-editor-ui My learning menu item", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await aTimeout(0);
  });

  it("sits in the main menu after the sites dashboard, before the character", () => {
    const menu = element.shadowRoot.querySelector("#user-menu");
    const items = [...menu.querySelectorAll('[slot="main-menu"]')].map(
      (n) => n.getAttribute("part") || n.tagName.toLowerCase(),
    );
    const at = items.indexOf("mylearningbtn");
    expect(at).to.be.greaterThan(-1);
    expect(items.indexOf("mysiteslink")).to.equal(at - 1);
    expect(items.indexOf("customizecharacterbtn")).to.equal(at + 1);
    const btn = element.shadowRoot.querySelector("#mylearningbtn");
    expect(btn.getAttribute("label")).to.equal("My learning");
  });

  it("opens my-learning for the whole site in a dialog", async () => {
    let detail = null;
    const grab = (e) => {
      detail = e.detail;
      e.stopImmediatePropagation();
    };
    globalThis.addEventListener("simple-modal-show", grab, { capture: true });
    try {
      element.shadowRoot.querySelector("#mylearningbtn").click();
      for (let i = 0; i < 50 && !detail; i++) {
        await aTimeout(20);
      }
    } finally {
      globalThis.removeEventListener("simple-modal-show", grab, {
        capture: true,
      });
    }
    expect(detail).to.not.equal(null);
    expect(detail.title).to.equal("My learning");
    expect(detail.modal).to.equal(true);
    const el = detail.elements.content;
    expect(el.tagName.toLowerCase()).to.equal("my-learning");
    expect(el.getAttribute("scope")).to.equal("site");
    expect(el.hasAttribute("in-dialog")).to.equal(true);
    expect(el.recent).to.equal(true);
    expect(el.preferences).to.equal(true);
  });
});
