import { html, fixture, expect } from "@open-wc/testing";
import "../stat-tile.js";

describe("stat-tile", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <stat-tile
        label="Enrolled"
        value="1284"
        change="6% this term"
        trend="up"
      ></stat-tile>
    `);
  });

  it("shows the label, the value and the change", async () => {
    const root = element.shadowRoot;
    expect(root.querySelector(".label").textContent).to.equal("Enrolled");
    expect(root.querySelector(".change").textContent).to.contain(
      "6% this term",
    );
  });

  it("groups a plain number and leaves other values as written", async () => {
    expect(element.shadowRoot.querySelector(".value").textContent).to.equal(
      new Intl.NumberFormat(document.documentElement.lang || undefined).format(
        1284,
      ),
    );
    element.value = "87%";
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".value").textContent).to.equal(
      "87%",
    );
  });

  it("says the direction in words, not only with an arrow", async () => {
    const change = element.shadowRoot.querySelector(".change");
    expect(change.querySelector("[aria-hidden]").textContent).to.equal("▲");
    expect(change.querySelector(".sr").textContent).to.equal("up");
    element.trend = "down";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector(".change .sr").textContent,
    ).to.equal("down");
  });

  it("draws no change line without a change", async () => {
    element.change = "";
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".change")).to.equal(null);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
