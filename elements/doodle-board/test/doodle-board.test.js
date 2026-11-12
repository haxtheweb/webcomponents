import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../doodle-board.js";
import "../lib/doodle-board-canvas.js";
import "../lib/doodle-board-field.js";

describe("doodle-board", () => {
  it("shows an empty state with nothing drawn", async () => {
    const el = await fixture(html`<doodle-board></doodle-board>`);
    expect(el.shadowRoot.querySelector(".empty")).to.exist;
  });

  it("stacks the marks over the background", async () => {
    const el = await fixture(
      html`<doodle-board
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        drawing="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt="Feedback on a sketch"
      ></doodle-board>`,
    );
    expect(el.shadowRoot.querySelectorAll(".picture img").length).to.equal(2);
    expect(
      el.shadowRoot.querySelector(".picture").getAttribute("aria-label"),
    ).to.equal("Feedback on a sketch");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<doodle-board></doodle-board>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("doodle-board-canvas", () => {
  it("offers only pen and eraser for signatures", async () => {
    const el = await fixture(
      html`<doodle-board-canvas mode="signature"></doodle-board-canvas>`,
    );
    await el.updateComplete;
    expect(el.tools).to.deep.equal(["pen", "eraser"]);
    expect(
      el.shadowRoot.querySelectorAll(".hax-ui-seg button").length,
    ).to.equal(2);
  });

  it("is empty until something is drawn, and undo restores", async () => {
    const el = await fixture(html`<doodle-board-canvas></doodle-board-canvas>`);
    await el.updateComplete;
    expect(el.getValue()).to.equal("");
    const ctx = el.shadowRoot.querySelector("canvas.layer").getContext("2d");
    ctx.fillRect(10, 10, 20, 20);
    el._commit();
    expect(el.getValue()).to.match(/^data:image\/png/);
    el.undo();
    expect(el.isEmpty()).to.be.true;
  });

  it("starts boxes and circles translucent", async () => {
    const el = await fixture(html`<doodle-board-canvas></doodle-board-canvas>`);
    el.setTool("box");
    expect(el.opacity).to.equal(40);
    el.setTool("circle");
    expect(el.opacity).to.equal(40);
    el.setTool("pen");
    expect(el.opacity).to.equal(100);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<doodle-board-canvas></doodle-board-canvas>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("doodle-board-field", () => {
  it("fires value-changed without bubbling when removed", async () => {
    const el = await fixture(
      html`<doodle-board-field
        label="Drawing"
        value="data:image/gif;base64,R0lGODlhAQABAAAAACw="
      ></doodle-board-field>`,
    );
    setTimeout(() => el._remove());
    const evt = await oneEvent(el, "value-changed");
    expect(evt.detail.value).to.equal("");
    expect(evt.bubbles).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<doodle-board-field label="Drawing"></doodle-board-field>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
