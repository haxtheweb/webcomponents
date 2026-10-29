import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/ui/haxcms-editor-settings-dialog-ui.js";

async function editorInShell() {
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  shell.route = "editor";
  await waitUntil(() => shell._sectionEl, "section element created");
  const editor = shell._sectionEl;
  // the platformConfig autorun loads the baseline on connect
  await waitUntil(() => editor.__baseline === editor.audience, "loaded");
  await editor.updateComplete;
  await shell.updateComplete;
  return { shell, editor };
}

const saveButton = (shell) => shell.shadowRoot.querySelector(".ftr .save");

describe("haxcms-editor-settings-dialog-ui save payload", () => {
  it("fires haxcms-save-editor-settings with the same payload as before", async () => {
    const el = document.createElement("haxcms-editor-settings-dialog-ui");
    el.inShell = true;
    el._audienceChanged({ detail: { value: { audience: "novice" } } });
    setTimeout(() => el.save());
    const e = await oneEvent(el, "haxcms-save-editor-settings");
    // captured from the Editor dialog before it moved into the shell
    expect(e.detail).to.deep.equal({ audience: "novice" });
    expect(e.bubbles).to.equal(true);
    expect(e.composed).to.equal(true);
    expect(e.cancelable).to.equal(true);
  });

  it("will not save an audience the handler rejects", () => {
    const el = document.createElement("haxcms-editor-settings-dialog-ui");
    el.audience = "admin";
    expect(el.canSave).to.equal(false);
    expect(el.save()).to.equal(false);
    el.audience = "expert";
    expect(el.canSave).to.equal(true);
  });

  it("closes the modal after saving only when standalone", async () => {
    const standalone = document.createElement(
      "haxcms-editor-settings-dialog-ui",
    );
    setTimeout(() => standalone.save());
    const hide = await oneEvent(standalone, "simple-modal-hide");
    expect(hide.detail).to.equal(false);
    const inShell = document.createElement("haxcms-editor-settings-dialog-ui");
    inShell.inShell = true;
    let hides = 0;
    inShell.addEventListener("simple-modal-hide", () => hides++);
    expect(inShell.save()).to.equal(true);
    expect(hides).to.equal(0);
  });
});

describe("haxcms-editor-settings-dialog-ui state", () => {
  it("reports the experience level change and discards it", async () => {
    const el = document.createElement("haxcms-editor-settings-dialog-ui");
    setTimeout(() =>
      el._audienceChanged({ detail: { value: { audience: "novice" } } }),
    );
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Experience Level"],
      canSave: true,
    });
    setTimeout(() => el.discard());
    const d = await oneEvent(el, "haxcms-admin-section-state");
    expect(d.detail.dirty).to.equal(false);
    expect(el.audience).to.equal("expert");
  });

  it("stages the select and marks it changed", async () => {
    const el = await fixture(
      html`<haxcms-editor-settings-dialog-ui
        in-shell
      ></haxcms-editor-settings-dialog-ui>`,
    );
    await waitUntil(() => el.__baseline === el.audience, "loaded");
    const select = el.shadowRoot.querySelector("select#audience");
    select.value = "novice";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.audience).to.equal("novice");
    const dot = el.shadowRoot.querySelector('label[for="audience"] .dot');
    expect(dot).to.not.equal(null);
    expect(dot.getAttribute("aria-label")).to.equal("changed");
    expect(el.shadowRoot.querySelector(".toolbar-preview").src).to.contain(
      "novice.png",
    );
  });

  it("drops its title and Save in the shell, keeps them standalone", async () => {
    const el = await fixture(
      html`<haxcms-editor-settings-dialog-ui></haxcms-editor-settings-dialog-ui>`,
    );
    expect(el.shadowRoot.querySelector("h2")).to.not.equal(null);
    expect(
      el.shadowRoot.querySelector(".standalone-actions .save"),
    ).to.not.equal(null);
    el.inShell = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("h2")).to.equal(null);
    expect(el.shadowRoot.querySelector(".standalone-actions")).to.equal(null);
  });
});

describe("haxcms-editor-settings-dialog-ui in the one admin dialog", () => {
  it("saves through the shell action bar", async () => {
    const { shell, editor } = await editorInShell();
    expect(saveButton(shell).disabled).to.equal(true);
    const next = editor.audience === "novice" ? "expert" : "novice";
    editor._audienceChanged({ detail: { value: { audience: next } } });
    await shell.updateComplete;
    expect(saveButton(shell).disabled).to.equal(false);
    setTimeout(() => saveButton(shell).click());
    const e = await oneEvent(globalThis, "haxcms-save-editor-settings");
    expect(e.detail).to.deep.equal({ audience: next });
    expect(shell._status).to.equal("saving");
  });

  it("passes the a11y audit with unsaved changes", async () => {
    const { shell, editor } = await editorInShell();
    editor._audienceChanged({ detail: { value: { audience: "novice" } } });
    await editor.updateComplete;
    await shell.updateComplete;
    await expect(shell).shadowDom.to.be.accessible();
    await expect(editor).shadowDom.to.be.accessible();
  });
});

describe("haxcms-editor-settings-dialog-ui discard after a select change", () => {
  it("puts the select back to the loaded value", async () => {
    const el = await fixture(
      html`<haxcms-editor-settings-dialog-ui></haxcms-editor-settings-dialog-ui>`,
    );
    el.inShell = true;
    await el.updateComplete;
    const select = el.shadowRoot.querySelector("#audience");
    const loaded = el.audience;
    const other = loaded === "novice" ? "expert" : "novice";
    select.value = other;
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.audience).to.equal(other);
    el.discard();
    await el.updateComplete;
    await el.updateComplete;
    expect(el.audience).to.equal(loaded);
    expect(select.value).to.equal(loaded);
  });
});
