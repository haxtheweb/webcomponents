import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/ui/haxcms-allowed-blocks-ui.js";

const BLOCKS = [
  {
    tag: "video-player",
    title: "Video",
    icon: "av:play-arrow",
    tags: ["Media"],
    meta: {},
  },
  {
    tag: "simple-cta",
    title: "Call to action",
    icon: "hax:blocks",
    tags: ["Layout"],
    meta: {},
  },
  {
    tag: "accent-card",
    title: "Accent card",
    icon: "hax:blocks",
    tags: ["Layout"],
    meta: {},
  },
  // required primitive: always on, never saved
  { tag: "p", title: "Paragraph", icon: "hax:blocks", tags: ["Text"] },
];

/**
 * Put the element into a known loaded state, the way its HAXStore autorun
 * would: a block inventory and the allowed list from platformConfig.
 */
async function load(el, allowed, defined) {
  // let the connect-time autorun settle first so it does not overwrite us
  await new Promise((r) => setTimeout(r, 0));
  el.inventoryReady = true;
  el.haxBlocks = BLOCKS.map((b) => Object.assign({}, b));
  el.allowedBlocks = new Set(allowed);
  el.allowedBlocksDefined = defined;
  if (typeof el._captureBaseline === "function") {
    el._captureBaseline();
  }
  await el.updateComplete;
}

// today's Save tap; save() in the shell must send exactly the same thing
function triggerSave(el) {
  if (typeof el.save === "function") {
    return el.save();
  }
  return el._saveAllowedBlocks();
}

describe("haxcms-allowed-blocks-ui save payload parity", () => {
  it("sends the sorted allowed list without required primitives", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player", "simple-cta", "accent-card"], true);
    el.inShell = true;
    el._setBlockChecked("simple-cta", false);
    el.allowedBlocks.add("p");
    setTimeout(() => triggerSave(el));
    const e = await oneEvent(el, "haxcms-save-allowed-blocks");
    expect(e.detail).to.deep.equal({
      allowedBlocksDefined: true,
      allowedBlocks: ["accent-card", "video-player"],
    });
  });

  it("sends null when every optional block is turned off", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player", "simple-cta", "accent-card"], false);
    el.inShell = true;
    el._deselectAll({ currentTarget: { dataset: { category: "all-blocks" } } });
    setTimeout(() => triggerSave(el));
    const e = await oneEvent(el, "haxcms-save-allowed-blocks");
    expect(e.detail).to.deep.equal({
      allowedBlocksDefined: true,
      allowedBlocks: null,
    });
  });

  it("keeps allowedBlocksDefined false when nothing was ever set", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player", "simple-cta", "accent-card"], false);
    el.inShell = true;
    setTimeout(() => triggerSave(el));
    const e = await oneEvent(el, "haxcms-save-allowed-blocks");
    expect(e.detail).to.deep.equal({
      allowedBlocksDefined: false,
      allowedBlocks: ["accent-card", "simple-cta", "video-player"],
    });
  });
});

describe("haxcms-allowed-blocks-ui standalone", () => {
  it("keeps its title and Save button, and closes the modal after saving", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], true);
    expect(el.shadowRoot.querySelector("h2").textContent).to.contain("Blocks");
    const button = el.shadowRoot.querySelector(".actions button");
    expect(button).to.exist;
    let saved = null;
    el.addEventListener("haxcms-save-allowed-blocks", (e) => {
      saved = e.detail;
    });
    setTimeout(() => button.click());
    await oneEvent(el, "simple-modal-hide");
    expect(saved).to.deep.equal({
      allowedBlocksDefined: true,
      allowedBlocks: ["video-player"],
    });
  });
});

describe("haxcms-allowed-blocks-ui section state", () => {
  it("drops its title and Save button in the shell", async () => {
    const el = document.createElement("haxcms-allowed-blocks-ui");
    el.inShell = true;
    document.body.appendChild(el);
    await load(el, ["video-player"], true);
    expect(el.shadowRoot.querySelector("h2")).to.not.exist;
    expect(el.shadowRoot.querySelector(".actions")).to.not.exist;
    el.remove();
  });

  it("reports changed blocks and can save", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player", "simple-cta"], true);
    expect(el.changedFields).to.deep.equal([]);
    setTimeout(() => el._setBlockChecked("accent-card", true));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      dirty: true,
      changes: ["Accent card on"],
      count: 1,
      canSave: true,
    });
    await el.updateComplete;
    const dot = () =>
      el.shadowRoot
        .querySelector("#allowed-block-accent-card")
        .closest("tr")
        .querySelector(".dot");
    // standalone (app-hax system blocks) shows no changed marks
    expect(dot()).to.equal(null);
    el.inShell = true;
    await el.updateComplete;
    expect(dot()).to.exist;
  });

  it("summarises long change lists", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    const many = [];
    for (let i = 0; i < 12; i++) {
      many.push({
        tag: `block-${i}`,
        title: `Block ${i}`,
        icon: "hax:blocks",
        tags: ["Other"],
        meta: {},
      });
    }
    await new Promise((r) => setTimeout(r, 0));
    el.inventoryReady = true;
    el.haxBlocks = many;
    el.allowedBlocks = new Set(many.map((b) => b.tag));
    el.allowedBlocksDefined = true;
    el._captureBaseline();
    setTimeout(() =>
      el._deselectAll({
        currentTarget: { dataset: { category: "all-blocks" } },
      }),
    );
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.dirty).to.equal(true);
    expect(e.detail.changes).to.deep.equal(["12 blocks"]);
    expect(e.detail.count).to.equal(12);
    expect(el.changedFields.length).to.equal(12);
  });

  it("will not save until the inventory is ready", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], true);
    el.inShell = true;
    el.inventoryReady = false;
    expect(el.canSave).to.equal(false);
    expect(el.save()).to.equal(false);
  });

  it("discard restores what was loaded", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], false);
    el._setBlockChecked("simple-cta", true);
    el._setBlockChecked("video-player", false);
    expect(el.changedFields.length).to.equal(2);
    setTimeout(() => el.discard());
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.dirty).to.equal(false);
    expect(Array.from(el.allowedBlocks)).to.deep.equal(["video-player"]);
    expect(el.allowedBlocksDefined).to.equal(false);
  });

  it("save in the shell does not close the modal", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], true);
    el.inShell = true;
    let hidden = false;
    el.addEventListener("simple-modal-hide", () => {
      hidden = true;
    });
    el._setBlockChecked("simple-cta", true);
    expect(el.save()).to.equal(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(hidden).to.equal(false);
  });
});

describe("haxcms-allowed-blocks-ui in haxcms-site-admin", () => {
  it("drives the shell's action bar", async () => {
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "blocks";
    await waitUntil(() => shell._sectionEl, "section element created");
    const el = shell._sectionEl;
    expect(el.inShell).to.equal(true);
    await load(el, ["video-player"], true);
    await shell.updateComplete;
    const save = shell.shadowRoot.querySelector(".ftr .save");
    expect(save.disabled).to.equal(true);
    el._setBlockChecked("simple-cta", true);
    await shell.updateComplete;
    expect(save.disabled).to.equal(false);
    setTimeout(() => save.click());
    const e = await oneEvent(globalThis, "haxcms-save-allowed-blocks");
    expect(e.detail).to.deep.equal({
      allowedBlocksDefined: true,
      allowedBlocks: ["simple-cta", "video-player"],
    });
    expect(shell._status).to.equal("saving");
    await expect(el).shadowDom.to.be.accessible({
      ignoredRules: ["color-contrast"],
    });
  });
});
