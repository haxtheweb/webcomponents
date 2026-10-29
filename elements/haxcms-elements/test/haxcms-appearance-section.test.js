import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-appearance-admin-dialog.js";

function makeManifest() {
  return {
    id: "appearance-site",
    title: "Appearance Site",
    metadata: {
      site: { name: "appearance-site", lang: "en" },
      platform: {},
      theme: {
        element: "clean-one",
        variables: {
          image: "files/banner.jpg",
          imageAlt: "A banner",
          imageLink: "",
          icon: "icons:face",
          cssVariable: "--simple-colors-default-theme-blue-7",
          palette: "2",
        },
        regions: {
          header: ["item-2"],
          sidebarFirst: null,
          sidebarSecond: null,
          contentTop: null,
          contentBottom: null,
          footerPrimary: [{ node: "item-1" }],
          footerSecondary: null,
        },
      },
    },
    items: [
      {
        id: "item-1",
        title: "Welcome",
        slug: "welcome",
        location: "pages/welcome/index.html",
        order: 0,
        parent: null,
        indent: 0,
        metadata: {},
      },
      {
        id: "item-2",
        title: "Unit 1",
        slug: "unit-1",
        location: "pages/unit-1/index.html",
        order: 1,
        parent: null,
        indent: 0,
        metadata: {},
      },
    ],
  };
}

// what the Save tap sent for makeManifest() before the shell existed
// (captured from the pre-change element)
const BASELINE_PAYLOAD = {
  site: { name: "appearance-site" },
  manifest: {
    theme: {
      "manifest-metadata-theme-element": "clean-one",
      "manifest-metadata-theme-variables-palette": "2",
      "manifest-metadata-theme-variables-cssVariable": "blue",
      "manifest-metadata-theme-variables-image": "files/banner.jpg",
      "manifest-metadata-theme-variables-imageAlt": "A banner",
      "manifest-metadata-theme-variables-imageLink": "",
      "manifest-metadata-theme-variables-icon": "icons:face",
      "manifest-metadata-theme-regions-header": ["item-2"],
      "manifest-metadata-theme-regions-sidebarFirst": [],
      "manifest-metadata-theme-regions-sidebarSecond": [],
      "manifest-metadata-theme-regions-contentTop": [],
      "manifest-metadata-theme-regions-contentBottom": [],
      "manifest-metadata-theme-regions-footerPrimary": ["item-1"],
      "manifest-metadata-theme-regions-footerSecondary": [],
    },
  },
};

let savedManifest;
let savedSound;

async function settle(el) {
  // refreshFromManifest holds a value-change lock until the next tick
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
}

/** the simple-fields that renders a field, wherever the element puts it */
function fieldsFor(el, key) {
  return [...el.shadowRoot.querySelectorAll("simple-fields")].find(
    (sf) => sf.value && Object.prototype.hasOwnProperty.call(sf.value, key),
  );
}

/** change a field the way simple-fields reports an edit */
function setField(el, key, value) {
  const sf = fieldsFor(el, key);
  // simple-fields reports its whole current value, edits included
  const current = sf.__testValue || sf.value;
  const next = Object.assign({}, JSON.parse(JSON.stringify(current)), {
    [key]: value,
  });
  sf.__testValue = next;
  sf.dispatchEvent(
    new CustomEvent("value-changed", { detail: { value: next } }),
  );
}

/** fire the section's save, today's Save tap or the shell's save() */
function triggerSave(el) {
  if (typeof el.save === "function") {
    return el.save();
  }
  return el._saveAppearanceSettingsTap();
}

async function appearance(attrs = {}) {
  const el = document.createElement("haxcms-appearance-admin-dialog");
  Object.assign(el, attrs);
  const host = await fixture(html`<div></div>`);
  host.appendChild(el);
  await settle(el);
  return el;
}

describe("haxcms-appearance-admin-dialog", () => {
  beforeEach(() => {
    savedManifest = store.manifest;
    savedSound = store.playSound;
    store.playSound = () => {};
    store.manifest = makeManifest();
  });
  afterEach(() => {
    store.manifest = savedManifest;
    store.playSound = savedSound;
  });

  describe("save payload parity", () => {
    it("sends the loaded values unchanged", async () => {
      const el = await appearance({ inShell: true });
      setTimeout(() => triggerSave(el));
      const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
      expect(e.detail).to.deep.equal(BASELINE_PAYLOAD);
    });

    it("sends edited theme, palette, accent, branding and regions", async () => {
      const el = await appearance({ inShell: true });
      setField(el, "manifest-metadata-theme-element", "polaris-flex-theme");
      setField(el, "manifest-metadata-theme-variables-palette", "5");
      setField(
        el,
        "manifest-metadata-theme-variables-cssVariable",
        "--simple-colors-default-theme-orange-7",
      );
      setField(el, "manifest-metadata-theme-variables-imageAlt", "New alt");
      setField(
        el,
        "manifest-metadata-theme-variables-imageLink",
        "https://example.com",
      );
      setField(el, "manifest-metadata-theme-variables-icon", "icons:home");
      setField(el, "manifest-metadata-theme-regions-sidebarFirst", [
        { node: "item-1" },
        { node: "item-2" },
      ]);
      setField(el, "manifest-metadata-theme-regions-header", []);
      setTimeout(() => triggerSave(el));
      const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
      const expected = JSON.parse(JSON.stringify(BASELINE_PAYLOAD));
      Object.assign(expected.manifest.theme, {
        "manifest-metadata-theme-element": "polaris-flex-theme",
        "manifest-metadata-theme-variables-palette": "5",
        "manifest-metadata-theme-variables-cssVariable": "orange",
        "manifest-metadata-theme-variables-imageAlt": "New alt",
        "manifest-metadata-theme-variables-imageLink": "https://example.com",
        "manifest-metadata-theme-variables-icon": "icons:home",
        "manifest-metadata-theme-regions-sidebarFirst": ["item-1", "item-2"],
        "manifest-metadata-theme-regions-header": [],
      });
      expect(e.detail).to.deep.equal(expected);
    });

    it("sends a theme preview selection the same way", async () => {
      const el = await appearance({ inShell: true });
      el.applyThemePreviewSelection({
        theme: "polaris-flex-theme",
        palette: "7",
      });
      setTimeout(() => triggerSave(el));
      const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
      const expected = JSON.parse(JSON.stringify(BASELINE_PAYLOAD));
      expected.manifest.theme["manifest-metadata-theme-element"] =
        "polaris-flex-theme";
      expected.manifest.theme["manifest-metadata-theme-variables-palette"] =
        "7";
      expect(e.detail).to.deep.equal(expected);
    });
  });

  describe("section state", () => {
    it("reports no changes once loaded from the manifest", async () => {
      const el = await appearance({ inShell: true });
      expect(el.changedFields).to.deep.equal([]);
      expect(el.canSave).to.equal(true);
    });

    it("counts a theme preview selection as unsaved changes", async () => {
      const el = document.createElement("haxcms-appearance-admin-dialog");
      el.inShell = true;
      const states = [];
      el.addEventListener("haxcms-admin-section-state", (e) =>
        states.push(e.detail),
      );
      // the editor's order: refresh, then the preview pick, then connect
      el.refreshFromManifest();
      el.applyThemePreviewSelection({
        theme: "polaris-flex-theme",
        palette: "7",
      });
      const last = states[states.length - 1];
      expect(last.dirty).to.equal(true);
      expect(last.changes).to.deep.equal(["Theme", "Palette"]);
      expect(last.canSave).to.equal(true);
      // connecting refreshes again and keeps the pick as a change
      const host = await fixture(html`<div></div>`);
      host.appendChild(el);
      await settle(el);
      expect(el.changedFields).to.deep.equal(["Theme", "Palette"]);
      expect(el.values["manifest-metadata-theme-element"]).to.equal(
        "polaris-flex-theme",
      );
    });

    it("reports field edits and marks the changed row", async () => {
      const el = await appearance({ inShell: true });
      setTimeout(() =>
        setField(el, "manifest-metadata-theme-variables-imageAlt", "New alt"),
      );
      const e = await oneEvent(el, "haxcms-admin-section-state");
      expect(e.detail.dirty).to.equal(true);
      expect(e.detail.changes).to.deep.equal(["Banner alt"]);
      expect(e.detail.canSave).to.equal(true);
      await el.updateComplete;
      const row = el.shadowRoot.querySelector(
        '.fr[data-field="manifest-metadata-theme-variables-imageAlt"]',
      );
      const dot = row.querySelector(".dot");
      expect(dot).to.exist;
      expect(dot.getAttribute("aria-label")).to.contain("changed");
      expect(el.shadowRoot.querySelectorAll(".fr .dot").length).to.equal(1);
    });

    it("does not count a region edit that saves the same", async () => {
      const el = await appearance({ inShell: true });
      setField(el, "manifest-metadata-theme-regions-header", [
        { node: "item-2" },
        { node: "" },
      ]);
      expect(el.changedFields).to.deep.equal([]);
    });

    it("discard restores the manifest values and drops the preview pick", async () => {
      const el = await appearance({ inShell: true });
      el.applyThemePreviewSelection({ theme: "polaris-flex-theme" });
      await settle(el);
      setField(el, "manifest-metadata-theme-variables-icon", "icons:home");
      expect(el.changedFields.length).to.equal(2);
      setTimeout(() => el.discard());
      const e = await oneEvent(el, "haxcms-admin-section-state");
      expect(e.detail.dirty).to.equal(false);
      expect(el.values["manifest-metadata-theme-element"]).to.equal(
        "clean-one",
      );
      expect(el.values["manifest-metadata-theme-variables-icon"]).to.equal(
        "icons:face",
      );
      // a later refresh does not bring the preview pick back
      el.refreshFromManifest();
      expect(el.changedFields).to.deep.equal([]);
    });

    it("cannot save without settings", async () => {
      store.manifest = { title: "x" };
      const el = await appearance({ inShell: true });
      expect(el.canSave).to.equal(false);
      expect(el.save()).to.equal(false);
    });
  });

  describe("in the one admin dialog", () => {
    it("drops its own title and buttons and offers Theme Preview in the header", async () => {
      const el = await appearance({ inShell: true });
      expect(el.shadowRoot.querySelector(".intro")).to.not.exist;
      expect(el.shadowRoot.querySelector(".actions")).to.not.exist;
      setTimeout(() => el._emitState());
      const e = await oneEvent(el, "haxcms-admin-section-state");
      expect(e.detail.headerActions).to.deep.equal([
        {
          id: "themePreview",
          label: "Theme Preview",
          icon: "image:remove-red-eye",
          disabled: false,
        },
      ]);
    });

    it("does not close the modal after saving", async () => {
      const el = await appearance({ inShell: true });
      let hides = 0;
      const countHide = () => hides++;
      globalThis.addEventListener("simple-modal-hide", countHide);
      expect(el.save()).to.equal(true);
      await new Promise((r) => setTimeout(r, 20));
      globalThis.removeEventListener("simple-modal-hide", countHide);
      expect(hides).to.equal(0);
    });

    it("lights up Save for a theme preview selection", async () => {
      const shell = await fixture(
        html`<haxcms-site-admin
          style="--simple-modal-height: 720px"
        ></haxcms-site-admin>`,
      );
      shell.allowRoute = () => true;
      shell.configureSection = (route, el) => {
        el.refreshFromManifest();
        el.applyThemePreviewSelection({
          theme: "polaris-flex-theme",
          palette: "7",
        });
      };
      shell.route = "appearance";
      await waitUntil(() => shell._sectionEl, "section element created");
      await settle(shell._sectionEl);
      await shell.updateComplete;
      const save = shell.shadowRoot.querySelector(".ftr .save");
      expect(save.disabled).to.equal(false);
      expect(shell.hasUnsavedChanges).to.equal(true);
      expect(shell.shadowRoot.querySelector(".ftr .st").textContent).to.contain(
        "2 unsaved changes",
      );
      setTimeout(() => save.click());
      const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
      expect(
        e.detail.manifest.theme["manifest-metadata-theme-element"],
      ).to.equal("polaris-flex-theme");
    });

    it("opens the theme preview right away when nothing is unsaved", async () => {
      const shell = await fixture(
        html`<haxcms-site-admin></haxcms-site-admin>`,
      );
      shell.allowRoute = () => true;
      shell.configureSection = (route, el) => el.refreshFromManifest();
      shell.route = "appearance";
      await waitUntil(() => shell._sectionEl, "section element created");
      await settle(shell._sectionEl);
      setTimeout(() => shell._sectionEl.runHeaderAction("themePreview"));
      const e = await oneEvent(globalThis, "haxcms-open-theme-preview-program");
      expect(e.detail).to.deep.equal({ source: "appearance-admin-dialog" });
    });

    it("asks before leaving for the theme preview with unsaved changes", async () => {
      const shell = await fixture(
        html`<haxcms-site-admin></haxcms-site-admin>`,
      );
      shell.allowRoute = () => true;
      shell.configureSection = (route, el) => el.refreshFromManifest();
      shell.route = "appearance";
      await waitUntil(() => shell._sectionEl, "section element created");
      const el = shell._sectionEl;
      await settle(el);
      setField(el, "manifest-metadata-theme-variables-icon", "icons:home");
      await shell.updateComplete;
      let opened = false;
      const onOpen = () => {
        opened = true;
      };
      globalThis.addEventListener("haxcms-open-theme-preview-program", onOpen);
      el.runHeaderAction("themePreview");
      await shell.updateComplete;
      await new Promise((r) => setTimeout(r, 20));
      expect(opened).to.equal(false);
      expect(shell.shadowRoot.querySelector('[role="alertdialog"]')).to.exist;
      shell.shadowRoot.querySelector(".leave .discard-leave").click();
      await new Promise((r) => setTimeout(r, 20));
      globalThis.removeEventListener(
        "haxcms-open-theme-preview-program",
        onOpen,
      );
      expect(opened).to.equal(true);
      expect(el.changedFields).to.deep.equal([]);
    });
  });

  describe("standalone (not in the shell)", () => {
    it("keeps its title, Theme Preview and Save, and closes after saving", async () => {
      const el = await appearance();
      expect(el.shadowRoot.querySelector(".intro h2").textContent).to.contain(
        "Appearance",
      );
      const buttons = el.shadowRoot.querySelectorAll(".actions button");
      expect(buttons.length).to.equal(2);
      setTimeout(() => buttons[1].click());
      const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
      expect(e.detail).to.deep.equal(BASELINE_PAYLOAD);
      await oneEvent(globalThis, "simple-modal-hide");
    });

    it("Theme Preview closes the modal and opens the preview", async () => {
      const el = await appearance();
      setTimeout(() =>
        el.shadowRoot.querySelectorAll(".actions button")[0].click(),
      );
      await oneEvent(globalThis, "simple-modal-hide");
      const e = await oneEvent(globalThis, "haxcms-open-theme-preview-program");
      expect(e.detail.source).to.equal("appearance-admin-dialog");
    });
  });

  it("passes the a11y audit with unsaved changes", async () => {
    const el = await appearance({ inShell: true });
    el.applyThemePreviewSelection({ theme: "polaris-flex-theme" });
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible({
      // simple-fields' own inner controls are covered by its own tests
      ignoredRules: ["color-contrast"],
    });
  });
});
