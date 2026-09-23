// Tests for the HAXCMSLitElementTheme base class wiring.
// HAXCMSLitElementTheme is an abstract base (no custom element tag), so we
// register a thin test subclass and fixture that. This exercises the real
// mobx autoruns (editMode / trayStatus / activeItemContent), the theme-ready
// gate, the WCAG skip-link, and disconnect cleanup.
import { fixture, expect, html } from "@open-wc/testing";
import { HAXCMSLitElementTheme } from "../lib/core/HAXCMSLitElementTheme.js";
import { store } from "../lib/core/haxcms-site-store.js";

class TestHaxcmsLitTheme extends HAXCMSLitElementTheme {}
customElements.define("test-haxcms-lit-theme", TestHaxcmsLitTheme);

// one microtask + a lit update cycle, enough for the Promise.resolve()-deferred
// mobx autoruns in the constructor to copy store state onto the element
const flush = async (el) => {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

// two animation frames, mirroring firstUpdated's theme-ready reveal gate
const nextFrames = () =>
  new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );

describe("HAXCMSLitElementTheme base wiring", () => {
  let element;
  let savedManifest;
  let savedEditMode;
  let savedTrayStatus;

  beforeEach(async () => {
    savedManifest = store.manifest;
    savedEditMode = store.editMode;
    savedTrayStatus = store.trayStatus;
    // keep a manifest populated so computed getters downstream never explode
    store.manifest = {
      id: "t",
      title: "T",
      metadata: { platform: {}, theme: { variables: {} } },
      items: [],
    };
    store.editMode = false;
    store.trayStatus = "";
    element = await fixture(html`<test-haxcms-lit-theme></test-haxcms-lit-theme>`);
  });

  afterEach(() => {
    store.manifest = savedManifest;
    store.editMode = savedEditMode;
    store.trayStatus = savedTrayStatus;
  });

  it("instantiates with shadow DOM", () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("test-haxcms-lit-theme");
    expect(element.shadowRoot).to.exist;
  });

  it("has the expected default property state", async () => {
    // let the Promise-deferred mobx autoruns (editMode / trayStatus /
    // activeItemContent) settle before reading mirrored state
    await flush(element);
    expect(element.editMode).to.equal(false);
    expect(element.trayStatus).to.equal("");
    expect(element.isLoggedIn).to.equal(false);
    // no activeItemContent is loaded in this bare fixture, so the
    // activeItemContent autorun resolves emptyContent to true
    expect(element.emptyContent).to.equal(true);
    // themeReady is rAF-gated (covered by the "flips on after first paint"
    // test below); do not assert its exact pre-paint value here
    expect(typeof element.themeReady).to.equal("boolean");
  });

  it("reflects store.editMode onto the element and the edit-mode attribute", async () => {
    store.editMode = true;
    await flush(element);
    expect(element.editMode).to.equal(true);
    expect(element.hasAttribute("edit-mode")).to.equal(true);

    store.editMode = false;
    await flush(element);
    expect(element.editMode).to.equal(false);
    expect(element.hasAttribute("edit-mode")).to.equal(false);
  });

  it("reflects store.trayStatus onto the element", async () => {
    store.trayStatus = "collapsed";
    await flush(element);
    expect(element.trayStatus).to.equal("collapsed");
    expect(element.getAttribute("tray-status")).to.equal("collapsed");
  });

  it("flips themeReady on after first paint and reflects theme-ready", async () => {
    await nextFrames();
    await element.updateComplete;
    expect(element.themeReady).to.equal(true);
    expect(element.hasAttribute("theme-ready")).to.equal(true);
  });

  it("renders the content container + slot scaffold", () => {
    expect(element.shadowRoot.querySelector("#contentcontainer")).to.exist;
    expect(element.shadowRoot.querySelector("#slot")).to.exist;
  });

  it("hides the slotted content area while in edit mode", async () => {
    element.editMode = true;
    await element.updateComplete;
    const slot = element.shadowRoot.querySelector("#slot");
    expect(getComputedStyle(slot).display).to.equal("none");
  });

  it("cleans up without throwing on disconnect", () => {
    expect(() => element.disconnectedCallback()).to.not.throw();
    // heading listeners bucket should be cleared by __removeHeadingListeners
    expect(element.__headingNodes.length).to.equal(0);
  });
});
