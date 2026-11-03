// Files on a narrow screen: cards instead of the table, one compact filter
// row, and the same selection contract with the admin dialog.
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../lib/core/haxcms-files-admin-dialog.js";

const FILES = [
  {
    path: "files/old-photo.png",
    uuid: "u1",
    name: "old-photo.png",
    mimetype: "image/png",
    size: 2048,
    updated: 1700000000,
  },
  {
    path: "files/a-very-long-file-name-that-will-not-fit-on-one-line-at-all.jpg",
    uuid: "u2",
    name: "a-very-long-file-name-that-will-not-fit-on-one-line-at-all.jpg",
    mimetype: "image/jpeg",
    size: 900000,
    updated: 1790000000,
  },
  {
    path: "files/syllabus.pdf",
    uuid: "u3",
    name: "syllabus.pdf",
    mimetype: "application/pdf",
    size: 51200,
    updated: 1750000000,
  },
];

const real = {};

function stubBackend() {
  real.has = MicroFrontendRegistry.has;
  real.call = MicroFrontendRegistry.call;
  MicroFrontendRegistry.has = () => true;
  MicroFrontendRegistry.call = async () => ({
    status: 200,
    data: { files: FILES, total: FILES.length },
  });
}

function restoreBackend() {
  MicroFrontendRegistry.has = real.has;
  MicroFrontendRegistry.call = real.call;
}

async function filesAt(width) {
  const host = await fixture(
    html`<div style="width: ${width}px; height: 700px"></div>`,
  );
  const el = document.createElement("haxcms-files-admin-dialog");
  el.inShell = true;
  host.appendChild(el);
  await el.updateComplete;
  el.siteName = "site";
  await el.refreshFiles();
  await el.updateComplete;
  return el;
}

describe("haxcms-files-admin-dialog compact layout", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  it("shows cards and one filter row when the section is narrow", async () => {
    const el = await filesAt(390);
    await waitUntil(() => el.compact, "compact from the section width");
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector("editable-table-display")).to.equal(null);
    expect(root.querySelector(".hax-ui-seg")).to.equal(null);
    expect(root.querySelector('select[name="filter-type"]')).to.exist;
    expect(root.querySelector('select[name="sort"]')).to.exist;
    expect(root.querySelector("hax-upload-field").hasAttribute("compact")).to.be
      .true;
    const cards = root.querySelectorAll(".card");
    expect(cards.length).to.equal(3);
    // newest first by default
    expect(cards[0].querySelector(".name").textContent).to.contain(
      "a-very-long",
    );
    const name = cards[0].querySelector(".name");
    expect(getComputedStyle(name).textOverflow).to.equal("ellipsis");
    expect(name.getAttribute("title")).to.contain("files/a-very-long");
    expect(cards[0].querySelector(".meta").textContent).to.contain("JPG");
    // a pdf has no preview: its file-type icon instead
    const pdf = [...cards].find((c) =>
      c.querySelector(".name").textContent.includes("syllabus"),
    );
    expect(pdf.querySelector(".thumb img")).to.equal(null);
    expect(pdf.querySelector(".thumb simple-icon-lite").icon).to.equal(
      "hax:file-pdf",
    );
  });

  it("keeps the table when the section is wide", async () => {
    const el = await filesAt(1100);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    expect(el.compact).to.be.false;
    expect(el.shadowRoot.querySelector("table.files")).to.exist;
    expect(el.shadowRoot.querySelector(".cards")).to.equal(null);
  });

  it("lays out like the design: add area, table, inspector", async () => {
    const el = await filesAt(1200);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    const root = el.shadowRoot;
    // in the shell the page header (and the add area in it) is the
    // shell's: the section reports the add area and keeps no header
    expect(!!root.querySelector(".ph")).to.equal(false);
    expect(el.addArea.hint).to.equal("Drop files here or browse to upload");
    expect(el.addArea.browseHandled).to.equal(true);
    // the uploading field stays, out of sight
    expect(!!root.querySelector("hax-upload-field.uploader")).to.equal(true);
    const heads = [...root.querySelectorAll("table.files thead th")].map((th) =>
      th.textContent.trim(),
    );
    // checkbox column first; the row ⋯ column last, named for readers only
    expect(heads.slice(1, -1)).to.deep.equal([
      "File",
      "Type",
      "Size",
      "Updated",
    ]);
    expect(heads[heads.length - 1]).to.equal("Actions");
    const rows = root.querySelectorAll("table.files tbody tr");
    expect(rows.length).to.equal(3);
    // newest first; type as a word pill
    expect(rows[0].textContent).to.contain("a-very-long-file-name");
    expect(rows[0].querySelector(".pill").textContent.trim()).to.equal("Image");
    // nothing chosen yet: the inspector says so
    expect(root.querySelector(".insp .insp-empty")).to.exist;
    // choose a file: it becomes the selection and shows in the panel
    rows[2].querySelector(".fname").click();
    await el.updateComplete;
    expect(root.querySelector(".insp-name").textContent).to.contain(
      "old-photo.png",
    );
    expect([...el.selectedRows]).to.deep.equal(["u1"]);
    expect(
      root.querySelector("table.files tbody tr.focus").dataset.rowKey,
    ).to.equal("u1");
    // actions live only in the selection bar, not in the details panel
    expect(root.querySelector(".insp button.hax-ui-btn")).to.equal(null);
    expect(root.querySelector(".insp [data-op]")).to.equal(null);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("the add area opens the upload field's picker and hands dropped files to its queue", async () => {
    const el = await filesAt(1200);
    // uploads go to a page
    el.nodeId = "item-1";
    await el.updateComplete;
    const root = el.shadowRoot;
    const field = root.querySelector("hax-upload-field.uploader");
    await field.updateComplete;
    let browsed = 0;
    field._handleBrowse = () => browsed++;
    el.browseFiles();
    expect(browsed).to.equal(1);
    const queue = field.shadowRoot.querySelector("#fileupload");
    const dropped = [];
    queue.handleDrop = (e) => dropped.push(e);
    const file = new File(["x"], "a.png", { type: "image/png" });
    const drop = { type: "drop", dataTransfer: { files: [file] } };
    el.addFiles({ files: [file], event: drop });
    // a drop hands the queue the same event the old zone did
    expect(dropped[0]).to.equal(drop);
    // chosen files (no drop event) reach the queue as a drop of them
    el.addFiles({ files: [file], event: null });
    expect(dropped[1].dataTransfer.files).to.deep.equal([file]);
    // while a file uploads the area says so
    field.dispatchEvent(
      new CustomEvent("upload-before", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.addArea.busy).to.equal(true);
    expect(el.addArea.label).to.contain("Uploading");
    field.dispatchEvent(
      new CustomEvent("upload-response", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.addArea.busy).to.equal(false);
    expect(el.addArea.browseLabel).to.equal("browse");
  });

  it("outside the shell it draws its own header with the add area", async () => {
    const host = await fixture(
      html`<div style="width: 1200px; height: 700px"></div>`,
    );
    const el = document.createElement("haxcms-files-admin-dialog");
    host.appendChild(el);
    await el.updateComplete;
    const area = el.shadowRoot.querySelector(".ph haxcms-admin-add-area");
    expect(!!area).to.equal(true);
    expect(area.hasAttribute("browse-handled")).to.equal(true);
    expect(el.shadowRoot.querySelector(".ph h2").textContent).to.contain(
      "Files",
    );
  });

  it("clicking a name selects only that file; Ctrl adds to the selection", async () => {
    const el = await filesAt(1200);
    await el.updateComplete;
    const root = el.shadowRoot;
    const rows = root.querySelectorAll("table.files tbody tr");
    rows[0].querySelector(".cb").click();
    await el.updateComplete;
    rows[2].querySelector(".fname").click();
    await el.updateComplete;
    expect([...el.selectedRows]).to.deep.equal(["u1"]);
    rows[0].querySelector(".fname").dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
        ctrlKey: true,
      }),
    );
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(2);
    // with several selected the panel says the bar acts on all of them
    expect(root.querySelector(".insp-multi").textContent).to.contain(
      "2 files selected",
    );
    expect(root.querySelector(".insp-name").textContent).to.contain(
      "a-very-long",
    );
    // the bar acts on the selection
    const ran = [];
    el.runAction = (id) => ran.push([id, [...el.selectedRows].sort()]);
    el.runAction("compress");
    expect(ran[0][1].length).to.equal(2);
  });

  it("sorts by a column header, both ways", async () => {
    const el = await filesAt(1200);
    await el.updateComplete;
    const root = el.shadowRoot;
    const names = () =>
      [...root.querySelectorAll("table.files tbody .nm")].map((n) =>
        n.textContent.trim(),
      );
    root.querySelector('.sort[data-sort="name"]').click();
    await el.updateComplete;
    expect(names()[0]).to.equal(
      "a-very-long-file-name-that-will-not-fit-on-one-line-at-all.jpg",
    );
    expect(
      root.querySelector('th[aria-sort="ascending"]').textContent,
    ).to.contain("File");
    root.querySelector('.sort[data-sort="name"]').click();
    await el.updateComplete;
    expect(names()[0]).to.equal("syllabus.pdf");
    root.querySelector('.sort[data-sort="size"]').click();
    await el.updateComplete;
    expect(names()[0]).to.contain("a-very-long");
  });

  it("selects by tapping a card, its checkbox or select all, and reports it", async () => {
    const el = await filesAt(390);
    await waitUntil(() => el.compact);
    await el.updateComplete;
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail.selected),
    );
    const cards = () => el.shadowRoot.querySelectorAll(".card");
    cards()[1].querySelector(".info").click();
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(1);
    expect(cards()[1].classList.contains("selected")).to.be.true;
    expect(cards()[1].querySelector("input").checked).to.be.true;
    // the checkbox toggles it back without the card toggling it twice
    cards()[1].querySelector("input").click();
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(0);
    // embed does not select
    cards()[0].querySelector('[data-action="embed"]').click();
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(0);
    el.shadowRoot
      .querySelector('.selall input[data-action="select-all"]')
      .click();
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(3);
    expect(states[states.length - 1]).to.equal(3);
    el.clearSelection();
    await el.updateComplete;
    expect(el.selectedRows.size).to.equal(0);
  });

  it("sorts the cards", async () => {
    const el = await filesAt(390);
    await waitUntil(() => el.compact);
    await el.updateComplete;
    const sort = el.shadowRoot.querySelector('select[name="sort"]');
    sort.value = "name";
    sort.dispatchEvent(new Event("change"));
    await el.updateComplete;
    const names = [...el.shadowRoot.querySelectorAll(".card .name")].map((n) =>
      n.textContent.trim(),
    );
    expect(names[0]).to.contain("a-very-long");
    expect(names[2]).to.equal("syllabus.pdf");
    sort.value = "size-desc";
    sort.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".card .name").textContent.trim(),
    ).to.contain("a-very-long");
    sort.value = "updated-asc";
    sort.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".card .name").textContent.trim(),
    ).to.equal("old-photo.png");
  });

  it("shows the file-type icon when a preview fails to load", async () => {
    const el = await filesAt(390);
    await waitUntil(() => el.compact);
    await el.updateComplete;
    const card = el.shadowRoot.querySelector('.card[data-row-key="u1"]');
    // with no file server here the preview may already have failed
    const img = card.querySelector(".thumb img");
    if (img) {
      expect(img.getAttribute("alt")).to.equal("");
      img.dispatchEvent(new Event("error"));
      await el.updateComplete;
    }
    expect(card.querySelector(".thumb img")).to.equal(null);
    expect(card.querySelector(".thumb simple-icon-lite").icon).to.equal(
      "hax:file-png",
    );
  });

  it("is accessible compact", async () => {
    const el = await filesAt(390);
    await waitUntil(() => el.compact);
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
