/**
 * simple-toolbar-button tab stops: inside a simple-toolbar the buttons use a
 * roving tabindex (only the current item is in the tab order, arrow keys
 * move between them); a button no toolbar manages is an ordinary tab stop.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../simple-toolbar.js";
import "../lib/simple-toolbar-button.js";
import {
  press,
  settle,
  deepActiveElement,
} from "../../../scripts/test-setup/keyboard-flow.js";

const inner = (btn) => btn.shadowRoot.querySelector("#button");

describe("simple-toolbar-button tab stops", () => {
  it("is in the tab order when no toolbar manages it", async () => {
    const wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <simple-toolbar-button label="Alone"></simple-toolbar-button>
        <button id="after">after</button>
      </div>`,
    );
    const btn = wrapper.querySelector("simple-toolbar-button");
    await btn.updateComplete;
    expect(inner(btn).getAttribute("tabindex")).to.equal("0");
    wrapper.querySelector("#before").focus();
    await press("Tab");
    expect(deepActiveElement() === inner(btn), "Tab reaches it").to.equal(true);
  });

  it("uses a roving tabindex inside a simple-toolbar", async () => {
    const wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <simple-toolbar>
          <simple-toolbar-button id="one" label="One"></simple-toolbar-button>
          <simple-toolbar-button id="two" label="Two"></simple-toolbar-button>
          <simple-toolbar-button
            id="three"
            label="Three"
          ></simple-toolbar-button>
        </simple-toolbar>
        <button id="after">after</button>
      </div>`,
    );
    const toolbar = wrapper.querySelector("simple-toolbar");
    const [one, two, three] = wrapper.querySelectorAll("simple-toolbar-button");
    await toolbar.updateComplete;
    await Promise.all([one, two, three].map((b) => b.updateComplete));
    expect(
      [one, two, three].map((b) => inner(b).getAttribute("tabindex")),
    ).to.deep.equal(["0", "-1", "-1"]);
    wrapper.querySelector("#before").focus();
    await press("Tab");
    expect(deepActiveElement() === inner(one)).to.equal(true);
    await press("ArrowRight");
    await settle(30);
    expect(deepActiveElement() === inner(two), "ArrowRight moves").to.equal(
      true,
    );
    await Promise.all([one, two, three].map((b) => b.updateComplete));
    expect(
      [one, two, three].map((b) => inner(b).getAttribute("tabindex")),
    ).to.deep.equal(["-1", "0", "-1"]);
    await press("Tab");
    expect(
      deepActiveElement() === wrapper.querySelector("#after"),
      "Tab leaves the toolbar in one stop",
    ).to.equal(true);
  });

  it("becomes a tab stop again when moved out of a toolbar", async () => {
    const wrapper = await fixture(
      html`<div>
        <simple-toolbar>
          <simple-toolbar-button id="one" label="One"></simple-toolbar-button>
          <simple-toolbar-button id="two" label="Two"></simple-toolbar-button>
        </simple-toolbar>
      </div>`,
    );
    const two = wrapper.querySelector("#two");
    await wrapper.querySelector("simple-toolbar").updateComplete;
    await two.updateComplete;
    expect(inner(two).getAttribute("tabindex")).to.equal("-1");
    wrapper.appendChild(two);
    await two.updateComplete;
    expect(inner(two).getAttribute("tabindex")).to.equal("0");
  });
});
