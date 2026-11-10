/**
 * Keyboard flow: a11y-collapse / a11y-collapse-group (accordion). Tab to a
 * heading, Enter/Space toggles it, content inside an open panel is reachable
 * and content inside a closed panel never takes focus. See
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-collapse.js";
import "../lib/a11y-collapse-group.js";
import {
  press,
  settle,
  deepActiveElement,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

describe("keyboard flow: a11y-collapse accordion", () => {
  let wrapper;
  let group;
  let first;
  let second;
  let before;
  let after;

  beforeEach(async () => {
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <a11y-collapse-group>
          <a11y-collapse heading-button id="one">
            <span slot="heading">First section</span>
            <div slot="content">
              <a id="link-one" href="#one">Inside one</a>
            </div>
          </a11y-collapse>
          <a11y-collapse heading-button id="two">
            <span slot="heading">Second section</span>
            <div slot="content">
              <a id="link-two" href="#two">Inside two</a>
            </div>
          </a11y-collapse>
        </a11y-collapse-group>
        <button id="after">after</button>
      </div>`,
    );
    group = wrapper.querySelector("a11y-collapse-group");
    first = wrapper.querySelector("#one");
    second = wrapper.querySelector("#two");
    before = wrapper.querySelector("#before");
    after = wrapper.querySelector("#after");
    await first.updateComplete;
    await second.updateComplete;
    await settle(100);
    before.focus();
  });

  async function tabUntil(check, max = 10) {
    for (let i = 0; i < max; i++) {
      await press("Tab");
      const el = expectGoodFocusStop(expect, `accordion Tab ${i + 1}`);
      if (check(el)) return el;
      if (el === after) break;
    }
    return null;
  }

  it("closed panels keep their content out of the tab order", async () => {
    expect(positiveTabindexIn(group)).to.deep.equal([]);
    const stops = [];
    let guard = 0;
    while (deepActiveElement() !== after && guard++ < 10) {
      await press("Tab");
      stops.push(expectGoodFocusStop(expect, `closed Tab ${guard}`));
    }
    const ids = stops.map((el) => el.id);
    expect(ids, "closed content is skipped").to.not.include("link-one");
    expect(ids).to.not.include("link-two");
    // one heading button per section, then out
    expect(stops.length).to.equal(3);
  });

  it("Enter expands a section, its content is reachable, Space collapses it", async () => {
    const heading = await tabUntil(
      (el) => el.getRootNode().host === first && el.tagName === "BUTTON",
    );
    expect(heading, "first heading button reachable").to.exist;
    expect(heading.getAttribute("aria-expanded")).to.equal("false");
    await press("Enter", 100);
    expect(first.expanded, "Enter expands").to.equal(true);
    expect(heading.getAttribute("aria-expanded")).to.equal("true");
    await press("Tab");
    const inside = expectGoodFocusStop(expect, "open content");
    expect(
      inside.id,
      `next stop is the open content, was ${describeEl(inside)}`,
    ).to.equal("link-one");
    await press("Shift+Tab");
    expectFocusOn(expect, heading);
    await press(" ", 100);
    expect(first.expanded, "Space collapses").to.equal(false);
    await press("Tab");
    const next = expectGoodFocusStop(expect, "after collapse");
    expect(next.id, "collapsed content is skipped again").to.not.equal(
      "link-one",
    );
  });
});
