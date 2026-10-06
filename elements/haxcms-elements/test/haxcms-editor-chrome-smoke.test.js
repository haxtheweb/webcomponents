import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/haxcms-site-editor.js";
import "../lib/core/haxcms-site-editor-ui.js";
import "../lib/core/haxcms-outline-editor-dialog.js";
import "../lib/core/haxcms-editor-builder.js";

// tier-3 held editor chrome (render depth intentionally held for the
// upcoming editor UI rewrite): each element still gets the required
// smoke + accessibility baseline so it stays verified working and
// accessible now and drifts loud through the rewrite.

describe("haxcms-site-editor smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`);
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("haxcms-site-editor");
  });

  it("is accessible on its baseline render", async () => {
    const el = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`);
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});

describe("haxcms-site-editor-ui smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("haxcms-site-editor-ui");
  });

  it("is accessible on its baseline render", async () => {
    const el = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});

describe("haxcms-outline-editor-dialog smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("haxcms-outline-editor-dialog");
  });

  it("is accessible on its baseline render", async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});

describe("haxcms-editor-builder smoke + a11y baseline", () => {
  let savedCmsSiteEditor;
  beforeEach(() => {
    savedCmsSiteEditor = store.cmsSiteEditor;
    // the builder constructor loads the demo backend whose async editor
    // wiring writes onto store.cmsSiteEditor.instance; keep a truthy fake
    // instance so those callbacks don't throw across test boundaries
    store.cmsSiteEditor = { instance: { jwt: null } };
  });
  afterEach(() => {
    store.cmsSiteEditor = savedCmsSiteEditor;
  });

  it("instantiates and registers itself into the HAXCMS store pieces", async () => {
    const el = await fixture(
      html`<haxcms-editor-builder></haxcms-editor-builder>`,
    );
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("haxcms-editor-builder");
    const HAXCMS = globalThis.HAXCMS.requestAvailability();
    expect(HAXCMS.storePieces.editorBuilder).to.exist;
  });

  it("is accessible", async () => {
    const el = await fixture(
      html`<haxcms-editor-builder></haxcms-editor-builder>`,
    );
    await expect(el).to.be.accessible();
  });
});

describe("HAXCMSUserStylesMenu module smoke", () => {
  // NOTE: lib/core/utils/HAXCMSUserStylesMenu.js is currently dead code —
  // nothing imports it and it exports nothing, so its mixin cannot be
  // instantiated by any consumer or test. This only verifies the module
  // still parses and executes its module-level code without error; wiring
  // it up (or deleting it) is a decision for the editor UI rewrite.
  it("loads without error", async () => {
    await import("../lib/core/utils/HAXCMSUserStylesMenu.js");
  });
});
