import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/hax-plate-context.js";

describe("hax-plate-context block bar", () => {
  it("shows one row with More and Show all tools by default", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(el.barSize).to.equal("compact");
    expect(root.querySelector("#moremenu")).to.exist;
    expect(root.querySelector("#layoutmenu")).to.exist;
    expect(root.querySelector("#barsize").label).to.equal("Show all tools");
    // column ops stay reachable inside the Layout menu
    expect(root.querySelector("#layoutmenu #right")).to.exist;
  });

  it("shows every tool as a button when all tools are shown", async () => {
    const el = await fixture(
      html`<hax-plate-context bar-size="full"></hax-plate-context>`,
    );
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector("#moremenu")).to.not.exist;
    expect(root.querySelector("#layoutmenu")).to.not.exist;
    expect(root.querySelector("#right")).to.exist;
    expect(root.querySelector("#barsize").label).to.equal("Show fewer tools");
  });

  it("asks hax-body to change the bar size", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const toggle = el.shadowRoot.querySelector("#barsize");
    setTimeout(() => toggle.shadowRoot.querySelector("button").click());
    const e = await oneEvent(el, "hax-block-bar-size");
    expect(e.detail.size).to.equal("full");
  });

  it("asks before removing a block", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    const remove = el.shadowRoot.querySelector("#remove");
    expect(remove.label).to.equal("Remove");
    expect(remove.eventName).to.equal("hax-plate-delete-arm");
    remove.shadowRoot.querySelector("button").click();
    await el.updateComplete;
    expect(remove.label).to.equal("Confirm delete");
    expect(remove.eventName).to.equal("hax-plate-delete");
  });

  it("uses matching icons for Add column and Remove column", async () => {
    const el = await fixture(
      html`<hax-plate-context bar-size="full"></hax-plate-context>`,
    );
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector("#right").icon).to.equal(
      "hax:table-column-plus-after",
    );
    expect(root.querySelector("#rightremove").icon).to.equal(
      "hax:table-column-remove",
    );
  });
});
