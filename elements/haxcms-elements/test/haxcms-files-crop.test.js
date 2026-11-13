// Files: Crop… on the selected images (haxtheweb/issues#1149)
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../lib/core/haxcms-files-admin-dialog.js";
import { answerAdminDialogs } from "./fixtures/admin-dialog-answers.js";

// a real, small image the test server serves, for the centered crop
const ICON = new URL("../demo/assets/icon-48x48.png", import.meta.url).href;

const FILES = [
  {
    path: "files/banner.jpg",
    uuid: "u1",
    name: "banner.jpg",
    mimetype: "image/jpeg",
    size: 2048,
  },
  {
    path: "files/logo.svg",
    uuid: "u2",
    name: "logo.svg",
    mimetype: "image/svg+xml",
    size: 900,
  },
  {
    path: "files/team.png",
    uuid: "u3",
    name: "team.png",
    mimetype: "image/png",
    size: 4096,
  },
  {
    path: "files/syllabus.pdf",
    uuid: "u4",
    name: "syllabus.pdf",
    mimetype: "application/pdf",
    size: 51200,
  },
];

describe("haxcms-files-admin-dialog crop", () => {
  let el, real, calls, restoreDialogs;

  beforeEach(async () => {
    real = { has: MicroFrontendRegistry.has, call: MicroFrontendRegistry.call };
    calls = [];
    restoreDialogs = () => {};
    MicroFrontendRegistry.has = () => true;
    MicroFrontendRegistry.call = async (name, params) => {
      calls.push({ name, params });
      if (name === "@site/listFiles") {
        return { status: 200, data: { files: FILES, total: FILES.length } };
      }
      return { status: 200, data: { operation: "replace-content" } };
    };
    const host = await fixture(
      html`<div style="width: 1200px; height: 760px"></div>`,
    );
    el = document.createElement("haxcms-files-admin-dialog");
    el.inShell = true;
    host.appendChild(el);
    await el.updateComplete;
    el.siteName = "site";
    await el.refreshFiles();
    await el.updateComplete;
    calls = [];
  });
  afterEach(() => {
    MicroFrontendRegistry.has = real.has;
    MicroFrontendRegistry.call = real.call;
    restoreDialogs();
  });

  const select = async (...names) => {
    el.selectedRows = new Set(
      el.rows.filter((r) => names.includes(r.name)).map((r) => el._rowKey(r)),
    );
    await el.updateComplete;
  };
  const cropAction = () => el.selectionActions.find((a) => a.id === "crop");
  const root = () => el.shadowRoot;

  it("offers Crop… only when a JPG, PNG or WebP is selected", async () => {
    await select("logo.svg", "syllabus.pdf");
    expect(cropAction().label).to.equal("Crop…");
    expect(cropAction().disabled).to.equal(true);
    await select("logo.svg", "team.png");
    expect(cropAction().disabled).to.equal(false);
  });

  it("opens the editor beside the list with only the croppable files", async () => {
    await select("banner.jpg", "logo.svg", "team.png");
    el.runAction("crop");
    await el.updateComplete;
    expect(el._crop.rows.map((r) => r.name)).to.deep.equal([
      "banner.jpg",
      "team.png",
    ]);
    const split = root().querySelector(".split");
    expect(split.classList.contains("cropping")).to.equal(true);
    expect(root().querySelector(".insp")).to.equal(null);
    expect(root().querySelector(".tw")).to.exist;
    const cropper = root().querySelector("hax-image-crop");
    expect(cropper.heading).to.equal("Crop 1 of 2: banner.jpg");
    expect(cropper.mimeType).to.equal("image/jpeg");
    expect(cropper.note).to.contain("Replaces banner.jpg");
    const labels = [...root().querySelectorAll(".cropper [slot=actions]")].map(
      (b) => b.textContent.trim(),
    );
    expect(labels).to.deep.equal([
      "Download",
      "Skip",
      "Cancel",
      "Replace and next",
    ]);
    // a free crop has no crop-all
    expect(root().querySelector(".crop-all")).to.equal(null);
    await expect(root().querySelector(".cropper")).to.be.accessible();
  });

  it("Skip moves on, and the last file says Replace original", async () => {
    await select("banner.jpg", "team.png");
    el.runAction("crop");
    await el.updateComplete;
    el._nextCrop();
    await el.updateComplete;
    const cropper = root().querySelector("hax-image-crop");
    expect(cropper.heading).to.equal("Crop 2 of 2: team.png");
    const labels = [...root().querySelectorAll(".cropper [slot=actions]")].map(
      (b) => b.textContent.trim(),
    );
    expect(labels).to.deep.equal(["Download", "Cancel", "Replace original"]);
    el._nextCrop();
    await el.updateComplete;
    expect(el._crop).to.equal(null);
    expect(root().querySelector(".cropper")).to.equal(null);
  });

  it("Escape closes the editor without changing anything", async () => {
    await select("banner.jpg");
    el.runAction("crop");
    await el.updateComplete;
    root()
      .querySelector(".cropper")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    await el.updateComplete;
    expect(el._crop).to.equal(null);
    expect(calls).to.deep.equal([]);
  });

  it("Replace sends the crop to replaceFileContent and opens the next file", async () => {
    await select("banner.jpg", "team.png");
    el.runAction("crop");
    await el.updateComplete;
    const cropper = root().querySelector("hax-image-crop");
    cropper.toBlob = async () => new Blob(["x"], { type: "image/jpeg" });
    await el._replaceWithCrop();
    await el.updateComplete;
    const replace = calls.find((c) => c.name === "@site/replaceFileContent");
    expect(replace).to.exist;
    expect(replace.params instanceof FormData).to.equal(true);
    expect(replace.params.get("fileUuid")).to.equal("u1");
    expect(replace.params.get("upload").name).to.equal("banner.jpg");
    expect(el._crop.index).to.equal(1);
    expect(el._crop.done).to.equal(1);
  });

  it("a failed replace stays on the file and shows the reason", async () => {
    MicroFrontendRegistry.call = async () => ({
      status: 400,
      data: null,
      message: "Only JPG, PNG and WebP images can be replaced",
    });
    await select("banner.jpg");
    el.runAction("crop");
    await el.updateComplete;
    const cropper = root().querySelector("hax-image-crop");
    cropper.toBlob = async () => new Blob(["x"], { type: "image/jpeg" });
    await el._replaceWithCrop();
    await el.updateComplete;
    expect(el._crop.index).to.equal(0);
    expect(cropper.error).to.contain("can be replaced");
  });

  it("a fixed aspect offers to crop the rest, confirmed like other overwrites", async () => {
    const prompts = [];
    restoreDialogs = answerAdminDialogs({
      confirm: (msg) => {
        prompts.push(msg);
        return true;
      },
    });
    await select("banner.jpg", "team.png");
    el.runAction("crop");
    await el.updateComplete;
    el._crop = Object.assign({}, el._crop, { aspect: "16:9" });
    await el.updateComplete;
    const all = root().querySelector(".crop-all .hax-ui-btn");
    expect(all.textContent.trim()).to.equal("Crop all 2 to 16:9");
    const ran = [];
    el._runBulkOp = async (rows, fn, verb, opts) => {
      ran.push({ names: rows.map((r) => r.name), verb, opts });
    };
    await el._cropAll();
    expect(prompts.length).to.equal(1);
    expect(prompts[0].startsWith("Crop 2 files")).to.equal(true);
    expect(ran).to.deep.equal([
      {
        names: ["banner.jpg", "team.png"],
        verb: "Cropped",
        opts: { refreshMedia: true },
      },
    ]);
    expect(el._crop).to.equal(null);
  });

  it("crops a file to a ratio, centered, without opening it", async () => {
    const row = {
      uuid: "u9",
      name: "icon.png",
      mimetype: "image/png",
      publicUrl: ICON,
    };
    const result = await el._cropCentered(row, 2);
    expect(result.ok).to.equal(true);
    const replace = calls.find((c) => c.name === "@site/replaceFileContent");
    const bitmap = await createImageBitmap(replace.params.get("upload"));
    expect(bitmap.width).to.equal(48);
    expect(bitmap.height).to.equal(24);
    // already square: nothing to send
    calls = [];
    expect((await el._cropCentered(row, 1)).ok).to.equal(true);
    expect(calls).to.deep.equal([]);
  });

  it("the row shortcut C crops the focused file", async () => {
    await waitUntil(() =>
      root().querySelector("table.files tbody tr[data-row-key]"),
    );
    const tr = [
      ...root().querySelectorAll("table.files tbody tr[data-row-key]"),
    ].find((row) => row.textContent.indexOf("team.png") !== -1);
    tr.querySelector("input").dispatchEvent(
      new KeyboardEvent("keydown", { key: "c", bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el._crop).to.exist;
    expect(el._crop.rows[0].name).to.equal("team.png");
  });
});
