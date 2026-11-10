import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/hax-plate-context.js";

const bar = (el) => el.shadowRoot;

describe("hax-plate-context block bar", () => {
  it("shows one row: grip, move, format, insert, layout, remove, More tools", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    [
      "#drag",
      "#up",
      "#down",
      "#chip",
      "#insert",
      "#layout",
      "#remove",
      "#more",
    ].forEach((id) => expect(bar(el).querySelector(id), id).to.exist);
    // More tools is closed by default; its tools wait in the hidden extra
    expect(bar(el).querySelector("#extra").hidden).to.equal(true);
    expect(bar(el).querySelector("#more").getAttribute("aria-label")).to.equal(
      "More tools",
    );
  });

  it("every button has a name with no block selected", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    [...bar(el).querySelectorAll("button")].forEach((b) => {
      expect(b.getAttribute("aria-label"), b.id).to.not.equal("");
    });
    await expect(el).to.be.accessible();
  });

  it("the drag handle has no menu", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const grip = bar(el).querySelector("#drag");
    expect(grip.hasAttribute("aria-haspopup")).to.equal(false);
    grip.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    grip.click();
    await el.updateComplete;
    expect(bar(el).querySelector(".pop")).to.not.exist;
  });

  it("arrow keys on the grip move the block", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const grip = bar(el).querySelector("#drag");
    setTimeout(() =>
      grip.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
      ),
    );
    const e = await oneEvent(el, "hax-context-item-selected");
    expect(e.detail.eventName).to.equal("hax-plate-up");
  });

  it("Insert asks above or below, then offers the common blocks with Paragraph first", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    bar(el).querySelector("#insert").click();
    await el.updateComplete;
    const where = [...bar(el).querySelectorAll(".pop .mi")];
    expect(where.map((b) => b.textContent.trim())).to.deep.equal([
      "Insert item above",
      "Insert item below",
    ]);
    where[1].click();
    await el.updateComplete;
    const blocks = [...bar(el).querySelectorAll(".pop .mi")].map((b) =>
      b.textContent.trim().replace(/\s+/g, " "),
    );
    expect(blocks[0]).to.equal("Paragraph");
    expect(blocks).to.include("Heading");
    expect(blocks[blocks.length - 1]).to.contain("Blocks…");
    setTimeout(() => bar(el).querySelector(".pop .mi").click());
    const e = await oneEvent(el, "hax-context-item-selected");
    expect(e.detail.eventName).to.equal("insert-block");
    expect(e.detail.value).to.deep.equal({ tag: "p", above: false });
  });

  it("Layout offers all twelve grid-plate layouts", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    bar(el).querySelector("#layout").click();
    await el.updateComplete;
    const tiles = [...bar(el).querySelectorAll(".lgrid button")];
    expect(tiles.length).to.equal(12);
    expect(tiles[0].getAttribute("aria-label")).to.equal("1: full width");
    expect(tiles[11].getAttribute("aria-label")).to.equal("4: equal width");
  });

  it("asks before removing a block", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const remove = bar(el).querySelector("#remove");
    setTimeout(() => remove.click());
    let e = await oneEvent(el, "hax-context-item-selected");
    expect(e.detail.eventName).to.equal("hax-plate-delete-arm");
    await el.updateComplete;
    expect(remove.getAttribute("aria-label")).to.equal("Confirm delete");
    setTimeout(() => remove.click());
    e = await oneEvent(el, "hax-context-item-selected");
    expect(e.detail.eventName).to.equal("hax-plate-delete");
  });

  it("Escape keeps the block after Remove was pressed once", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const remove = bar(el).querySelector("#remove");
    remove.click();
    await el.updateComplete;
    setTimeout(() =>
      remove.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
    );
    const e = await oneEvent(el, "hax-context-item-selected");
    expect(e.detail.eventName).to.equal("hax-plate-delete-disarm");
    await el.updateComplete;
    expect(remove.getAttribute("aria-label")).to.equal("Remove");
  });

  it("More tools asks hax-body to open the rest of the bar", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    setTimeout(() => bar(el).querySelector("#more").click());
    const e = await oneEvent(el, "hax-block-bar-more");
    expect(e.detail.open).to.equal(true);
    el.moreOpen = true;
    await el.updateComplete;
    expect(bar(el).querySelector("#extra").hidden).to.equal(false);
    expect(bar(el).querySelector("#duplicate")).to.exist;
  });
});
