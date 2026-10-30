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
    expect(root.querySelector(".seg")).to.equal(null);
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
    expect(el.shadowRoot.querySelector("editable-table-display")).to.exist;
    expect(el.shadowRoot.querySelector(".cards")).to.equal(null);
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
