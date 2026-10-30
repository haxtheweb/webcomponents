import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/ui/haxcms-site-platform-ui.js";

/**
 * Put the element into a known loaded state, the way its HAXStore autorun
 * hydrates it from platformConfig.
 */
async function load(el, config) {
  // let the connect-time autoruns settle first so they do not overwrite us
  await new Promise((r) => setTimeout(r, 0));
  el.platformConfig = config;
  el.audience = config.audience || "expert";
  el.features = Object.assign({}, config.features || {});
  el.allowedBlocks =
    config.allowedBlocks === null ? null : new Set(config.allowedBlocks || []);
  if (typeof el._captureBaseline === "function") {
    el._captureBaseline();
  }
  await el.updateComplete;
}

// today's Save tap in platform settings mode
function triggerSave(el) {
  if (typeof el.save === "function") {
    return el.save();
  }
  return el._savePlatformSettings();
}

const CONFIG = {
  audience: "novice",
  features: { deletePage: false, viewSource: true },
  allowedBlocks: ["video-player", "p", "accent-card"],
};

describe("haxcms-site-platform-ui save payload parity", () => {
  it("sends audience, features and sorted allowed blocks as before", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    el.inShell = true;
    el._setFeatureChecked("deletePage", true);
    el._setFeatureChecked("addBlock", false);
    setTimeout(() => triggerSave(el));
    const e = await oneEvent(el, "haxcms-save-platform-settings");
    expect(e.detail).to.deep.equal({
      audience: "novice",
      features: { deletePage: true, viewSource: true, addBlock: false },
      allowedBlocks: ["accent-card", "video-player"],
    });
  });

  it("keeps a null allowedBlocks as null", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, { features: {}, allowedBlocks: null });
    el.inShell = true;
    el._setFeatureChecked("community", false);
    setTimeout(() => triggerSave(el));
    const e = await oneEvent(el, "haxcms-save-platform-settings");
    expect(e.detail).to.deep.equal({
      audience: "expert",
      features: { community: false },
      allowedBlocks: null,
    });
  });
});

describe("haxcms-site-platform-ui standalone", () => {
  it("platform settings mode keeps its title and Save, and closes after saving", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    expect(el.shadowRoot.querySelector("h2").textContent).to.contain(
      "Platform Features",
    );
    const button = el.shadowRoot.querySelector(".actions button");
    expect(button.textContent.trim()).to.equal("Save");
    let saved = null;
    el.addEventListener("haxcms-save-platform-settings", (e) => {
      saved = e.detail;
    });
    setTimeout(() => button.click());
    await oneEvent(el, "simple-modal-hide");
    expect(saved).to.deep.equal({
      audience: "novice",
      features: { deletePage: false, viewSource: true },
      allowedBlocks: ["accent-card", "video-player"],
    });
  });

  it("skeleton export mode still offers the experience level and download", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    expect(el.shadowRoot.querySelector("h2")).to.exist;
    expect(el.shadowRoot.querySelector("select#audience")).to.exist;
    const button = el.shadowRoot.querySelector(".actions button");
    expect(button.textContent.trim()).to.equal("Download skeleton");
    let saved = false;
    el.addEventListener("haxcms-save-platform-settings", () => {
      saved = true;
    });
    // the button is still wired to the download, never to the save
    let downloaded = false;
    el._download = () => {
      downloaded = true;
    };
    el.requestUpdate();
    await el.updateComplete;
    el.shadowRoot.querySelector(".actions button").click();
    expect(downloaded).to.equal(true);
    expect(saved).to.equal(false);
    expect(el._platformConfigForExport()).to.deep.equal({
      audience: "novice",
      features: { deletePage: false, viewSource: true },
      allowedBlocks: ["accent-card", "video-player"],
    });
  });
});

describe("haxcms-site-platform-ui section state", () => {
  it("drops its title and Save button in the shell", async () => {
    const el = document.createElement("haxcms-site-platform-ui");
    el.inShell = true;
    el.platformSettingsMode = true;
    document.body.appendChild(el);
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    expect(el.shadowRoot.querySelector("h2")).to.not.exist;
    expect(el.shadowRoot.querySelector(".actions")).to.not.exist;
    // the warning stays: it is not the shell's description
    expect(el.shadowRoot.querySelector(".admin-note")).to.exist;
    // platform settings mode never offered the experience level picker
    expect(el.shadowRoot.querySelector("select#audience")).to.not.exist;
    el.remove();
  });

  it("reports changed features with their new state", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    el.inShell = true;
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    expect(el.changedFields).to.deep.equal([]);
    setTimeout(() => el._setFeatureChecked("deletePage", true));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Delete pages on"],
      canSave: true,
    });
    el._setFeatureChecked("viewSource", false);
    expect(el.changedFields).to.deep.equal([
      "Delete pages on",
      "View source off",
    ]);
    await el.updateComplete;
    const row = el.shadowRoot
      .querySelector('[data-key="deletePage"]')
      .closest(".frow");
    expect(row.querySelector(".dot")).to.exist;
    // turning it back is not a change
    el._setFeatureChecked("deletePage", false);
    el._setFeatureChecked("viewSource", true);
    expect(el.changedFields).to.deep.equal([]);
  });

  it("discard restores the loaded features exactly", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    el._setFeatureChecked("addPage", false);
    setTimeout(() => el.discard());
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.dirty).to.equal(false);
    expect(el.features).to.deep.equal({ deletePage: false, viewSource: true });
  });

  it("save in the shell does not close the modal", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    el.inShell = true;
    let hidden = false;
    el.addEventListener("simple-modal-hide", () => {
      hidden = true;
    });
    el._setFeatureChecked("addPage", false);
    expect(el.save()).to.equal(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(hidden).to.equal(false);
  });

  it("offers no header actions in the shell", async () => {
    const el = await fixture(
      html`<haxcms-site-platform-ui
        platform-settings-mode
      ></haxcms-site-platform-ui>`,
    );
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    setTimeout(() => el._setFeatureChecked("addPage", false));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.headerActions).to.equal(undefined);
  });
});

describe("haxcms-site-platform-ui in haxcms-site-admin", () => {
  it("drives the shell's action bar", async () => {
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    // what the editor's configure step does for this route
    shell.configureSection = (route, el) => {
      if (route === "features") {
        el.platformSettingsMode = true;
      }
    };
    shell.route = "features";
    await waitUntil(() => shell._sectionEl, "section element created");
    const el = shell._sectionEl;
    expect(el.inShell).to.equal(true);
    await load(el, JSON.parse(JSON.stringify(CONFIG)));
    await shell.updateComplete;
    const save = shell.shadowRoot.querySelector(".ftr .save");
    expect(save.disabled).to.equal(true);
    el.shadowRoot.querySelector('[data-key="addPage"]').click();
    await shell.updateComplete;
    expect(save.disabled).to.equal(false);
    expect(shell.shadowRoot.querySelector(".ftr .st").textContent).to.contain(
      "Add pages off",
    );
    setTimeout(() => save.click());
    const e = await oneEvent(globalThis, "haxcms-save-platform-settings");
    expect(e.detail).to.deep.equal({
      audience: "novice",
      features: { deletePage: false, viewSource: true, addPage: false },
      allowedBlocks: ["accent-card", "video-player"],
    });
    expect(shell._status).to.equal("saving");
    await expect(el).shadowDom.to.be.accessible();
  });
});
