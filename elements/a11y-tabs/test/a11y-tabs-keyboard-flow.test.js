/**
 * Keyboard flow: a11y-tabs. One tab stop for the tab list (roving
 * tabindex), Left/Right arrows move between tabs and wrap, Enter/Space
 * activates, Tab moves on into the active panel. See
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-tabs.js";
import "../lib/a11y-tab.js";
import {
  press,
  settle,
  deepActiveElement,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

// every a11y-tab ends with an "End of tab. Back to tabs" skip link inside a
// visually hidden span that is shown while the link has focus
const isEndOfTabLink = (el) =>
  el.tagName === "A" &&
  el.getRootNode().host &&
  el.getRootNode().host.tagName === "A11Y-TAB";

describe("keyboard flow: a11y-tabs", () => {
  let wrapper;
  let tabs;
  let after;

  const tabId = () => {
    const el = deepActiveElement();
    return el && el.getAttribute("role") === "tab" ? el.id : null;
  };

  beforeEach(async () => {
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <a11y-tabs>
          <a11y-tab id="t1" label="One"
            ><a id="in-1" href="#t1">Panel one link</a></a11y-tab
          >
          <a11y-tab id="t2" label="Two"
            ><a id="in-2" href="#t2">Panel two link</a></a11y-tab
          >
          <a11y-tab id="t3" label="Three"
            ><a id="in-3" href="#t3">Panel three link</a></a11y-tab
          >
        </a11y-tabs>
        <button id="after">after</button>
      </div>`,
    );
    tabs = wrapper.querySelector("a11y-tabs");
    after = wrapper.querySelector("#after");
    await tabs.updateComplete;
    await settle(150);
    await tabs.updateComplete;
    wrapper.querySelector("#before").focus();
  });

  it("the tab list is a single tab stop and Tab continues into the active panel", async () => {
    expect(positiveTabindexIn(tabs)).to.deep.equal([]);
    await press("Tab");
    expectGoodFocusStop(expect, "tab list");
    expect(tabId()).to.equal("t1-button");
    await press("Tab");
    const next = expectGoodFocusStop(expect, "after tab list");
    expect(
      next.id,
      `Tab goes to the active panel, was ${describeEl(next)}`,
    ).to.equal("in-1");
    await press("Tab");
    const link = expectGoodFocusStop(expect, "end-of-tab link");
    expect(isEndOfTabLink(link), "end-of-tab link follows the panel").to.equal(
      true,
    );
    await press("Tab");
    expectFocusOn(expect, after, "hidden panels are skipped");
  });

  it("arrow keys move focus between tabs and wrap; Enter activates", async () => {
    await press("Tab");
    await press("ArrowRight");
    expectGoodFocusStop(expect, "ArrowRight");
    expect(tabId()).to.equal("t2-button");
    await press("ArrowRight");
    expect(tabId()).to.equal("t3-button");
    await press("ArrowRight");
    expect(tabId(), "wraps to the first tab").to.equal("t1-button");
    await press("ArrowLeft");
    expect(tabId(), "wraps to the last tab").to.equal("t3-button");
    await press("Enter", 100);
    expect(tabs.activeTab).to.equal("t3");
    await press("Tab");
    expect(
      deepActiveElement().id,
      "Tab enters the newly active panel",
    ).to.equal("in-3");
  });

  it("Space activates the focused tab", async () => {
    await press("Tab");
    await press("ArrowRight");
    await press(" ", 100);
    expect(tabs.activeTab).to.equal("t2");
  });

  it("the end-of-tab link is visible when it has focus", async () => {
    await press("Tab");
    await press("Tab");
    await press("Tab");
    const el = deepActiveElement();
    expect(el.tagName).to.equal("A");
    expectGoodFocusStop(expect, "end-of-tab link");
  });
});
