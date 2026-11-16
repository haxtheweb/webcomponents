// Closing the admin dialog (outline designer, files, settings) loads the
// site and the page on screen again from source, so the page and its
// page-break match what the backend holds. Not while editing: that would
// throw away the author's unsaved work.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import { store } from "../lib/core/haxcms-site-store.js";

describe("haxcms-site-editor-ui reloads the page when the admin dialog closes", () => {
  let el;
  let fired;
  let savedEditMode;
  const record = (e) => fired.push(e.type);

  beforeEach(async () => {
    fired = [];
    savedEditMode = store.editMode;
    store.editMode = false;
    globalThis.addEventListener("haxcms-trigger-update", record);
    globalThis.addEventListener("haxcms-trigger-update-node", record);
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    fired = [];
  });

  afterEach(() => {
    globalThis.removeEventListener("haxcms-trigger-update", record);
    globalThis.removeEventListener("haxcms-trigger-update-node", record);
    store.editMode = savedEditMode;
  });

  it("asks for the site and the page again", () => {
    el._refreshActivePageFromSource();
    expect(fired).to.deep.equal([
      "haxcms-trigger-update",
      "haxcms-trigger-update-node",
    ]);
  });

  it("leaves the page alone while it is being edited", () => {
    store.editMode = true;
    el._refreshActivePageFromSource();
    expect(fired).to.deep.equal([]);
  });

  it("reloads once the admin dialog has closed", async () => {
    el.__currentAdminRoutePath = "structure";
    el._simpleModalClosed();
    await aTimeout(80);
    expect(fired).to.include("haxcms-trigger-update-node");
  });

  it("does not reload when some other dialog closes", async () => {
    el.__currentAdminRoutePath = null;
    el._simpleModalClosed();
    await aTimeout(80);
    expect(fired).to.deep.equal([]);
  });
});
