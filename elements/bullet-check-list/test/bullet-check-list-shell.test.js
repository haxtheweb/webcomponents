import { fixture, expect, html } from "@open-wc/testing";
import "../bullet-check-list.js";

const clear = () => {
  try {
    Object.keys(globalThis.localStorage)
      .filter((k) => k.startsWith("bullet-check-list:"))
      .forEach((k) => globalThis.localStorage.removeItem(k));
  } catch (e) {
    // storage blocked
  }
};

// the quiz question shell: header with an info toggle for directions and a
// footer that shows status on the left
describe("bullet-check-list shell", () => {
  beforeEach(clear);
  afterEach(clear);

  it("toggles directions from the header info button", async () => {
    const el = await fixture(
      html`<bullet-check-list
        title="Steps"
        storage-id="shell-1"
        .items="${[{ label: "One" }, { label: "Two" }]}"
      ></bullet-check-list>`,
    );
    const toggle = el.shadowRoot.querySelector(
      ".ddd-block-header #directions-toggle",
    );
    const directions = el.shadowRoot.querySelector("#directions");
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    expect(directions.hidden).to.be.true;
    toggle.click();
    await el.updateComplete;
    expect(toggle.getAttribute("aria-expanded")).to.equal("true");
    expect(toggle.getAttribute("aria-label")).to.equal(el.t.hideDirections);
    expect(directions.hidden).to.be.false;
    expect(directions.textContent).to.contain(el.t.checklistDirections);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("uses the step directions for an ordered list", async () => {
    const el = await fixture(
      html`<bullet-check-list
        ordered
        storage-id="shell-2"
        .items="${[{ label: "One" }]}"
      ></bullet-check-list>`,
    );
    expect(el.shadowRoot.querySelector("#directions").textContent).to.contain(
      el.t.orderedDirections,
    );
  });

  it("marks the footer complete with an icon and a word once every item is ticked", async () => {
    const el = await fixture(
      html`<bullet-check-list
        storage-id="shell-3"
        .items="${[{ label: "One" }, { label: "Two" }]}"
      ></bullet-check-list>`,
    );
    const block = el.shadowRoot.querySelector(".ddd-block");
    expect(block.hasAttribute("data-complete")).to.be.false;
    expect(el.shadowRoot.querySelector(".status-chip")).to.not.exist;
    el.shadowRoot.querySelectorAll("input").forEach((i) => i.click());
    await el.updateComplete;
    expect(block.hasAttribute("data-complete")).to.be.true;
    expect(el.shadowRoot.querySelector(".status-chip")).to.exist;
    expect(
      el.shadowRoot.querySelector('[role="status"]').textContent.trim(),
    ).to.equal(el.t.complete);
    await expect(el).shadowDom.to.be.accessible();
  });
});
