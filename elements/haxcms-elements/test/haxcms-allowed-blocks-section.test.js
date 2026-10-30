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
        .closest(".block-row")
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
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("haxcms-allowed-blocks-ui rows and preview", () => {
  it("lists each block as one row with a count per category", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui
        in-shell
        style="width: 390px"
      ></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player", "accent-card"], true);
    // no table and no cards: one list row per block
    expect(el.shadowRoot.querySelector("table")).to.equal(null);
    expect(el.shadowRoot.querySelectorAll("li.block-row").length).to.equal(4);
    const layout = el.shadowRoot.querySelector(
      'details.block-category[data-group="layout"]',
    );
    expect(layout.querySelector(".group-count").textContent).to.contain(
      "1 of 2 on",
    );
    // the category select-all still works on its own group
    layout.open = true;
    await el.updateComplete;
    layout.querySelectorAll(".group-tools .tool")[0].click();
    await el.updateComplete;
    expect(el.allowedBlocks.has("simple-cta")).to.be.true;
    expect(el.allowedBlocks.has("video-player")).to.be.true;
    // required primitives stay on and locked
    expect(el.shadowRoot.querySelector("#allowed-block-p").disabled).to.be.true;
  });

  it("opens the preview inside the section, closes on Esc and refocuses", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui
        in-shell
        style="width: 390px; height: 700px; display: block"
      ></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], true);
    el.shadowRoot.querySelectorAll("details").forEach((d) => {
      d.open = true;
    });
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector(
      '.preview-button[data-tag="video-player"]',
    );
    expect(btn.getAttribute("aria-label")).to.equal("Preview Video");
    btn.click();
    await el.updateComplete;
    const panel = el.shadowRoot.querySelector(".preview-panel");
    expect(panel).to.exist;
    // narrow: a sheet that never runs past the section's right edge
    expect(panel.classList.contains("sheet")).to.be.true;
    const host = el.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    expect(box.left).to.be.at.least(host.left);
    expect(box.right).to.be.at.most(host.right + 0.5);
    await el.updateComplete;
    expect(el.shadowRoot.activeElement.classList.contains("close")).to.be.true;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    await expect(el).shadowDom.to.be.accessible();
    panel.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".preview-panel")).to.equal(null);
    expect(el.shadowRoot.activeElement).to.equal(btn);
  });

  it("keeps a wide preview beside the button and inside the section", async () => {
    const el = await fixture(
      html`<haxcms-allowed-blocks-ui
        in-shell
        style="width: 1000px; height: 700px; display: block"
      ></haxcms-allowed-blocks-ui>`,
    );
    await load(el, ["video-player"], true);
    el.shadowRoot.querySelectorAll("details").forEach((d) => {
      d.open = true;
    });
    await el.updateComplete;
    el.shadowRoot
      .querySelector('.preview-button[data-tag="accent-card"]')
      .click();
    await el.updateComplete;
    const panel = el.shadowRoot.querySelector(".preview-panel");
    expect(panel.classList.contains("sheet")).to.be.false;
    const host = el.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    expect(box.right).to.be.at.most(host.right + 0.5);
    expect(box.left).to.be.at.least(host.left);
    // clicking outside closes it
    el.shadowRoot.querySelector(".preview-scrim").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".preview-panel")).to.equal(null);
  });
});
