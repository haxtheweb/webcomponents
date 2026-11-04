import { fixture, expect, html, oneEvent } from "@open-wc/testing";

import "../lib/simple-icon-select.js";
import { iconFriendlyName } from "../lib/simple-icon-select.js";

const ICONS = [
  "icons:check",
  "icons:clear",
  "icons:search",
  "editor:format-paint",
  "av:volume-off",
];

function rows(el) {
  return [...el.shadowRoot.querySelectorAll('li[role="option"]')];
}
function search(el) {
  return el.shadowRoot.querySelector(".search");
}
function key(target, k) {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true }),
  );
}

describe("simple-icon-select", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-icon-select label="Icon" .icons="${ICONS}"></simple-icon-select>
    `);
  });

  it("passes the a11y audit closed and open", async () => {
    await expect(element).shadowDom.to.be.accessible();
    await element.open();
    await expect(element).shadowDom.to.be.accessible();
  });

  it("builds friendly names", () => {
    expect(iconFriendlyName("editor:format-paint")).to.equal("Format paint");
    expect(iconFriendlyName("check")).to.equal("Check");
    expect(iconFriendlyName(null)).to.equal("");
  });

  it("starts closed and opens in flow with icon + name rows", async () => {
    expect(element.expanded).to.equal(false);
    await element.open();
    const list = rows(element);
    // "No icon" row plus every icon
    expect(list.length).to.equal(ICONS.length + 1);
    const paint = list.find((r) => r.dataset.value === "editor:format-paint");
    expect(paint.querySelector("simple-icon-lite").getAttribute("icon")).to.equal(
      "editor:format-paint",
    );
    expect(paint.querySelector(".name").textContent.trim()).to.equal(
      "Format paint",
    );
    // panel is in document flow, never absolutely positioned (no clipping)
    const panel = element.shadowRoot.querySelector(".panel");
    expect(getComputedStyle(panel).position).to.equal("static");
  });

  it("filters by name or id as you type", async () => {
    await element.open();
    const input = search(element);
    input.value = "paint";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    expect(rows(element).map((r) => r.dataset.value)).to.deep.equal([
      "editor:format-paint",
    ]);
    input.value = "av:";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    expect(rows(element).map((r) => r.dataset.value)).to.deep.equal([
      "av:volume-off",
    ]);
    input.value = "zzzz-nope";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    expect(rows(element).length).to.equal(0);
    expect(
      element.shadowRoot.querySelector('[role="status"]').textContent,
    ).to.contain("zzzz-nope");
  });

  it("selects with the keyboard and fires value-changed", async () => {
    await element.open();
    const input = search(element);
    input.value = "search";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    setTimeout(() => key(input, "Enter"));
    const ev = await oneEvent(element, "value-changed");
    expect(ev.detail.value).to.equal("icons:search");
    expect(element.value).to.equal("icons:search");
    expect(element.getAttribute("value")).to.equal("icons:search");
    await element.updateComplete;
    expect(element.expanded).to.equal(false);
  });

  it("moves the active option with arrows and sets aria-activedescendant", async () => {
    await element.open();
    const input = search(element);
    expect(element.__activeIndex).to.equal(0);
    key(input, "ArrowDown");
    await element.updateComplete;
    expect(element.__activeIndex).to.equal(1);
    expect(input.getAttribute("aria-activedescendant")).to.equal(
      rows(element)[1].id,
    );
    key(input, "End");
    await element.updateComplete;
    expect(element.__activeIndex).to.equal(ICONS.length);
  });

  it("selects by click and allows clearing to no icon", async () => {
    element.value = "icons:check";
    await element.open();
    const none = rows(element)[0];
    expect(none.dataset.value).to.equal("");
    none.click();
    await element.updateComplete;
    expect(element.value).to.equal(null);
  });

  it("omits the no-icon row when allow-null is false", async () => {
    element.allowNull = false;
    await element.open();
    expect(rows(element).length).to.equal(ICONS.length);
  });

  it("Escape clears search first, then closes", async () => {
    await element.open();
    const input = search(element);
    input.value = "pa";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    key(input, "Escape");
    await element.updateComplete;
    expect(element.__search).to.equal("");
    expect(element.expanded).to.equal(true);
    key(input, "Escape");
    await element.updateComplete;
    expect(element.expanded).to.equal(false);
  });

  it("honors include-sets / exclude when using the registered icons", async () => {
    const el = await fixture(html`
      <simple-icon-select
        .includeSets="${["icons"]}"
        .exclude="${["icons:check"]}"
      ></simple-icon-select>
    `);
    await el.open();
    const values = rows(el)
      .map((r) => r.dataset.value)
      .filter((v) => v);
    expect(values.length).to.be.greaterThan(0);
    expect(values.every((v) => v.startsWith("icons:"))).to.equal(true);
    expect(values).to.not.include("icons:check");
  });

  it("pages large icon lists instead of rendering everything at once", async () => {
    const el = await fixture(html`<simple-icon-select></simple-icon-select>`);
    await el.open();
    const total = el._matches.length;
    if (total > 60) {
      expect(rows(el).length).to.be.at.most(61);
      key(search(el), "End");
      await el.updateComplete;
      expect(rows(el).length).to.be.greaterThan(61);
    }
  });
});
