import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// a narrow designer (a phone) folds its toolbar into Options so the outline
// keeps the room: Add page, Options and the host's actions slot stay, the
// rest open from Options, and keyboard help shows only on request.
function makeItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: "p" + i,
      title: "Page " + i,
      slug: "page-" + i,
      location: "pages/page-" + i + "/index.html",
      order: i,
      parent: null,
      indent: 0,
      contents: "<p>Page " + i + "</p>",
      metadata: {},
    });
  }
  return items;
}

async function settle(el) {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

async function designerAt(width) {
  const wrap = await fixture(html`
    <div style="width: ${width}px; height: 640px; display: flex">
      <outline-designer
        style="flex: 1 1 auto; min-width: 0; overflow: auto"
        .items="${makeItems(8)}"
      >
        <button slot="controls" id="importbtn" type="button">Import</button>
        <button slot="actions" id="savebtn" type="button">Save</button>
      </outline-designer>
    </div>
  `);
  const el = wrap.querySelector("outline-designer");
  await settle(el);
  return el;
}

// what a pointer or keyboard activates: the toolbar button's own button
const press = (btn) =>
  (btn.shadowRoot && btn.shadowRoot.querySelector("button")
    ? btn.shadowRoot.querySelector("button")
    : btn
  ).click();

const visible = (node) =>
  !!node && getComputedStyle(node).display !== "none" && node.offsetWidth > 0;

describe("outline-designer narrow toolbar", () => {
  it("keeps every control in the toolbar when there is room", async () => {
    const el = await designerAt(1000);
    const root = el.shadowRoot;
    expect(visible(root.querySelector(".controls > .options-btn"))).to.be.false;
    expect(visible(root.querySelector(".density"))).to.be.true;
    expect(visible(root.querySelector(".hints"))).to.be.true;
    expect(visible(el.querySelector("#savebtn"))).to.be.true;
  });

  it("folds into Options on a narrow host", async () => {
    const el = await designerAt(380);
    const root = el.shadowRoot;
    const options = root.querySelector(".controls > .options-btn");
    expect(visible(options)).to.be.true;
    expect(visible(root.querySelector(".density"))).to.be.false;
    expect(visible(el.querySelector("#importbtn"))).to.be.false;
    // the host's Save stays in reach
    expect(visible(el.querySelector("#savebtn"))).to.be.true;
    expect(visible(root.querySelector(".hints"))).to.be.false;
    expect(options.getAttribute("aria-expanded")).to.equal("false");
    press(options);
    await settle(el);
    expect(options.getAttribute("aria-expanded")).to.equal("true");
    expect(visible(root.querySelector(".density"))).to.be.true;
    expect(visible(el.querySelector("#importbtn"))).to.be.true;
    // keyboard help on request
    press(root.querySelector(".more .options-btn"));
    await settle(el);
    expect(el.showHints).to.be.true;
    expect(visible(root.querySelector(".hints"))).to.be.true;
    expect(el._optionsOpen).to.be.false;
  });

  it("closes Options with Escape and on a click outside", async () => {
    const el = await designerAt(380);
    const root = el.shadowRoot;
    const options = root.querySelector(".controls > .options-btn");
    press(options);
    await settle(el);
    root.querySelector("#more").dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );
    await settle(el);
    expect(el._optionsOpen).to.be.false;
    press(options);
    await settle(el);
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, composed: true }),
    );
    await settle(el);
    expect(el._optionsOpen).to.be.false;
  });

  it("is accessible folded and open", async () => {
    const el = await designerAt(380);
    await expect(el).shadowDom.to.be.accessible();
    press(el.shadowRoot.querySelector(".controls > .options-btn"));
    await settle(el);
    await expect(el).shadowDom.to.be.accessible();
  });
});
