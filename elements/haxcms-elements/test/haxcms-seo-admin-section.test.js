import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-seo-admin-dialog.js";

const MANIFEST = {
  title: "Intro to Biology",
  description: "Cells and things",
  license: "by",
  author: "Top Author",
  metadata: {
    author: {
      name: "Ada",
      email: "ada@example.edu",
      image: "files/ada.jpg",
    },
    site: {
      domain: "https://example.edu/bio",
      logo: "files/leaf.png",
      settings: {
        lang: "en",
        gaID: "",
        private: false,
        canonical: true,
        pathauto: false,
        publishPagesOn: true,
      },
    },
  },
};

const manifest = () => JSON.parse(JSON.stringify(MANIFEST));

// captured from the SEO dialog before it moved into the one admin dialog
const UNCHANGED_PAYLOAD = {
  license: "by",
  description: "Cells and things",
  logo: "files/leaf.png",
  domain: "https://example.edu/bio",
  lang: "en",
  gaID: "",
  private: false,
  canonical: true,
  authorImage: "files/ada.jpg",
  authorName: "Ada",
  authorEmail: "ada@example.edu",
  authorSocialLink: "",
  authorSocialLink2: "",
  authorPhone: "",
  authorLocation: "",
  authorWebsite: "",
  authorWebsite2: "",
  pathauto: false,
  publishPagesOn: true,
};

const EDITED_PAYLOAD = Object.assign({}, UNCHANGED_PAYLOAD, {
  license: "by-nc",
  description: "New desc",
  lang: "fr-CA",
  private: true,
  authorName: "Grace",
  authorWebsite2: "https://g.example",
  pathauto: true,
});

function applyEdits(el) {
  el._setValue("manifest-description", "New desc");
  el._setValue("manifest-metadata-site-settings-lang", "fr-CA");
  el._setValue("manifest-metadata-site-settings-private", true);
  el._setValue("manifest-metadata-site-settings-pathauto", true);
  el._setValue("manifest-license", "by-nc");
  el._setValue("manifest-metadata-author-name", "Grace");
  el._setValue("manifest-metadata-author-website2", "https://g.example");
}

async function seoInShell(route = "seo") {
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  // what haxcms-site-editor-ui's configure step does for seo / author
  shell.configureSection = (r, el) => {
    if (r === "seo" || r === "author") {
      el.activeGroup = r === "author" ? "author" : "seo";
    }
  };
  shell.route = route;
  await waitUntil(() => shell._sectionEl, "section element created");
  await shell.updateComplete;
  const seo = shell._sectionEl;
  await seo.updateComplete;
  seo.refreshFromManifest(manifest());
  await seo.updateComplete;
  await shell.updateComplete;
  return { shell, seo };
}

const saveButton = (shell) => shell.shadowRoot.querySelector(".ftr .save");

describe("haxcms-seo-admin-dialog save payload", () => {
  it("fires haxcms-save-seo-data with the same payload as before when nothing changed", async () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    el.inShell = true;
    el.refreshFromManifest(manifest());
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-seo-data");
    expect(e.detail).to.deep.equal(UNCHANGED_PAYLOAD);
    expect(e.bubbles).to.equal(true);
    expect(e.composed).to.equal(true);
    expect(e.cancelable).to.equal(true);
  });

  it("fires haxcms-save-seo-data with the same payload as before after edits in both groups", async () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    el.inShell = true;
    el.refreshFromManifest(manifest());
    applyEdits(el);
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-seo-data");
    expect(e.detail).to.deep.equal(EDITED_PAYLOAD);
  });

  it("will not save before settings load, like the old disabled Save", () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    el.refreshFromManifest({ title: "no metadata" });
    expect(el.canSave).to.equal(false);
    expect(el.save()).to.equal(false);
  });

  it("closes the modal after saving only when standalone", async () => {
    let hides = 0;
    const onHide = () => hides++;
    globalThis.addEventListener("simple-modal-hide", onHide);
    try {
      const inShell = document.createElement("haxcms-seo-admin-dialog");
      inShell.inShell = true;
      inShell.refreshFromManifest(manifest());
      expect(inShell.save()).to.equal(true);
      await new Promise((r) => setTimeout(r, 10));
      expect(hides).to.equal(0);
      const standalone = document.createElement("haxcms-seo-admin-dialog");
      standalone.refreshFromManifest(manifest());
      expect(standalone.save()).to.equal(true);
      await new Promise((r) => setTimeout(r, 10));
      expect(hides).to.equal(1);
    } finally {
      globalThis.removeEventListener("simple-modal-hide", onHide);
    }
  });
});

describe("haxcms-seo-admin-dialog state", () => {
  it("reports changed fields by label and discards them", async () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    el.refreshFromManifest(manifest());
    setTimeout(() => el._setValue("manifest-metadata-author-name", "Grace"));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Name"],
      canSave: true,
    });
    el._setValue("manifest-metadata-site-settings-canonical", false);
    expect(el.changedFields.map((f) => f.title)).to.deep.equal([
      "Canonical",
      "Name",
    ]);
    setTimeout(() => el.discard());
    const d = await oneEvent(el, "haxcms-admin-section-state");
    expect(d.detail.dirty).to.equal(false);
    expect(el.values["manifest-metadata-author-name"]).to.equal("Ada");
    expect(el.values["manifest-metadata-site-settings-canonical"]).to.equal(
      true,
    );
  });

  it("reports once its data loads", async () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    setTimeout(() => el.refreshFromManifest(manifest()));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      dirty: false,
      changes: [],
      canSave: true,
    });
  });

  it("marks a changed field with a dot", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog in-shell></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".fr .dot")).to.equal(null);
    el._setValue("manifest-metadata-site-domain", "https://new.example");
    await el.updateComplete;
    const dot = el.shadowRoot.querySelector(
      'label[for="f-manifest-metadata-site-domain"] .dot',
    );
    expect(dot).to.not.equal(null);
    expect(dot.getAttribute("aria-label")).to.equal("changed");
  });

  it("stages typed input and switch taps", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog in-shell></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    const input = el.shadowRoot.querySelector(
      "#f-manifest-metadata-site-domain",
    );
    input.value = "https://typed.example";
    input.dispatchEvent(new Event("input"));
    el.shadowRoot
      .querySelector("#f-manifest-metadata-site-settings-private")
      .click();
    await el.updateComplete;
    expect(el.values["manifest-metadata-site-domain"]).to.equal(
      "https://typed.example",
    );
    expect(el.values["manifest-metadata-site-settings-private"]).to.equal(true);
  });
});

describe("haxcms-seo-admin-dialog groups", () => {
  it("keeps both groups and opens SEO by default", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog in-shell></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    const seo = el.shadowRoot.querySelector('details[data-group="seo"]');
    const author = el.shadowRoot.querySelector('details[data-group="author"]');
    expect(seo.open).to.equal(true);
    expect(author.open).to.equal(false);
  });

  it("opens Author when the editor asks for the author group", async () => {
    const el = document.createElement("haxcms-seo-admin-dialog");
    el.inShell = true;
    el.activeGroup = "author";
    document.body.appendChild(el);
    try {
      // let the store autorun's first load land, then load a known manifest
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      el.refreshFromManifest(manifest());
      await el.updateComplete;
      expect(
        el.shadowRoot.querySelector('details[data-group="author"]').open,
      ).to.equal(true);
      expect(
        el.shadowRoot.querySelector('details[data-group="seo"]').open,
      ).to.equal(false);
      el.activeGroup = "seo";
      await el.updateComplete;
      await el.updateComplete;
      expect(
        el.shadowRoot.querySelector('details[data-group="seo"]').open,
      ).to.equal(true);
    } finally {
      el.remove();
    }
  });

  it("renders the shared language picker allowing custom codes", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog in-shell></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    const picker = el.shadowRoot.querySelector(
      "haxcms-language-picker#f-manifest-metadata-site-settings-lang",
    );
    expect(picker).to.not.equal(null);
    expect(picker.allowCustom).to.equal(true);
    expect(picker.value).to.equal("en");
    picker.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "fr-CA", key: "fr-CA", option: null },
      }),
    );
    expect(el.values["manifest-metadata-site-settings-lang"]).to.equal("fr-CA");
  });

  it("keeps Normalize slugs, firing the same event as before", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog in-shell></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector(".normalize");
    setTimeout(() => btn.click());
    const e = await oneEvent(globalThis, "haxcms-normalize-slugs");
    expect(e.detail).to.deep.equal({});
  });

  it("draws its own Save only when standalone", async () => {
    const el = await fixture(
      html`<haxcms-seo-admin-dialog></haxcms-seo-admin-dialog>`,
    );
    el.refreshFromManifest(manifest());
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".standalone-actions .save"),
    ).to.not.equal(null);
    el.inShell = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".standalone-actions")).to.equal(null);
  });
});

describe("haxcms-seo-admin-dialog in the one admin dialog", () => {
  it("saves through the shell action bar", async () => {
    const { shell, seo } = await seoInShell();
    expect(saveButton(shell).disabled).to.equal(true);
    seo._setValue("manifest-metadata-site-settings-gaID", "G-123");
    await shell.updateComplete;
    expect(saveButton(shell).disabled).to.equal(false);
    setTimeout(() => saveButton(shell).click());
    const e = await oneEvent(globalThis, "haxcms-save-seo-data");
    expect(e.detail).to.deep.equal(
      Object.assign({}, UNCHANGED_PAYLOAD, { gaID: "G-123" }),
    );
    expect(shell._status).to.equal("saving");
  });

  it("opens the Author group on the author route", async () => {
    const { seo } = await seoInShell("author");
    expect(seo.activeGroup).to.equal("author");
    expect(
      seo.shadowRoot.querySelector('details[data-group="author"]').open,
    ).to.equal(true);
    expect(
      seo.shadowRoot.querySelector('details[data-group="seo"]'),
    ).to.not.equal(null);
  });

  it("passes the a11y audit with unsaved changes", async () => {
    const { shell, seo } = await seoInShell();
    seo._setValue("manifest-description", "Changed");
    await seo.updateComplete;
    await shell.updateComplete;
    await expect(shell).shadowDom.to.be.accessible();
    await expect(seo).shadowDom.to.be.accessible({
      // simple-fields-upload's URL combo sets autocomplete="both"; that is
      // the upload field's own markup, not this section's
      ignoredRules: ["autocomplete-valid"],
    });
  });
});
