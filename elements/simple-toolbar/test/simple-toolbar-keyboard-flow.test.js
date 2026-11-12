/**
 * Keyboard flow: the arrow keys, Home and End in a simple-toolbar only move
 * to items that can take focus. Disabled items are skipped (wrapping around
 * the ends), with no item to move to focus stays where it is, and the roving
 * tabindex (the toolbar's single Tab stop) never sits on a disabled button.
 * Real key presses only, except where no toolbar item can hold focus.
 * Follow-up to https://github.com/haxtheweb/issues/issues/3307
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../simple-toolbar.js";
import "../lib/simple-toolbar-button.js";
import {
  press,
  settle,
  deepActiveElement,
  describeEl,
  expectFocusOn,
} from "../../../scripts/test-setup/keyboard-flow.js";

const inner = (btn) => btn.shadowRoot.querySelector("#button");

// a toolbar of buttons labelled by `labels`; the ones in `disabled` start
// disabled
async function setup(labels, disabled = []) {
  const wrapper = await fixture(html`
    <div>
      <button id="before">before</button>
      <simple-toolbar>
        ${labels.map(
          (label) =>
            html`<simple-toolbar-button
              label="${label}"
              ?disabled="${disabled.includes(label)}"
            ></simple-toolbar-button>`,
        )}
      </simple-toolbar>
      <button id="after">after</button>
    </div>
  `);
  const toolbar = wrapper.querySelector("simple-toolbar");
  const buttons = [...wrapper.querySelectorAll("simple-toolbar-button")];
  await toolbar.updateComplete;
  await Promise.all(buttons.map((b) => b.updateComplete));
  const byLabel = {};
  buttons.forEach((b) => (byLabel[b.label] = b));
  return {
    wrapper,
    toolbar,
    buttons,
    byLabel,
    before: wrapper.querySelector("#before"),
    after: wrapper.querySelector("#after"),
  };
}

// labels of the buttons whose inner control is a Tab stop
async function tabStops(buttons) {
  await Promise.all(buttons.map((b) => b.updateComplete));
  return buttons
    .filter((b) => inner(b).getAttribute("tabindex") === "0")
    .map((b) => b.label);
}

async function pressAndExpect(key, btn) {
  await press(key);
  await settle(30);
  expectFocusOn(expect, inner(btn), `${key} moves to ${btn.label}`);
}

describe("simple-toolbar keyboard flow with disabled buttons", () => {
  it("arrow keys skip disabled buttons", async () => {
    const { buttons, byLabel, before } = await setup(
      ["One", "Two", "Three", "Four"],
      ["Two", "Three"],
    );
    before.focus();
    await press("Tab");
    expectFocusOn(expect, inner(byLabel.One), "Tab into the toolbar");
    await pressAndExpect("ArrowRight", byLabel.Four);
    expect(await tabStops(buttons)).to.deep.equal(["Four"]);
    await pressAndExpect("ArrowLeft", byLabel.One);
    expect(await tabStops(buttons)).to.deep.equal(["One"]);
    await pressAndExpect("ArrowDown", byLabel.Four);
    await pressAndExpect("ArrowUp", byLabel.One);
  });

  it("Home and End skip a disabled first or last button", async () => {
    const { buttons, byLabel, before } = await setup(
      ["One", "Two", "Three", "Four"],
      ["One", "Four"],
    );
    before.focus();
    await press("Tab");
    expectFocusOn(expect, inner(byLabel.Two), "Tab into the toolbar");
    await pressAndExpect("End", byLabel.Three);
    expect(await tabStops(buttons)).to.deep.equal(["Three"]);
    await pressAndExpect("Home", byLabel.Two);
    expect(await tabStops(buttons)).to.deep.equal(["Two"]);
  });

  it("arrow keys wrap around the ends, past disabled buttons", async () => {
    const { buttons, byLabel, before } = await setup(
      ["One", "Two", "Three", "Four"],
      ["One", "Four"],
    );
    before.focus();
    await press("Tab");
    await pressAndExpect("ArrowRight", byLabel.Three);
    // Four is disabled and One is disabled: the next one is Two
    await pressAndExpect("ArrowRight", byLabel.Two);
    // and back the other way, past One and Four
    await pressAndExpect("ArrowLeft", byLabel.Three);
    expect(await tabStops(buttons)).to.deep.equal(["Three"]);
  });

  it("with no other enabled button, arrow keys leave focus where it is", async () => {
    const { buttons, byLabel, before, after } = await setup(
      ["One", "Two", "Three"],
      ["Two", "Three"],
    );
    before.focus();
    await press("Tab");
    for (const key of [
      "ArrowRight",
      "ArrowLeft",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ]) {
      await press(key);
      await settle(30);
      expectFocusOn(expect, inner(byLabel.One), `${key} stays on One`);
      expect(await tabStops(buttons), key).to.deep.equal(["One"]);
    }
    await press("Tab");
    expectFocusOn(expect, after, "Tab still leaves the toolbar");
  });

  it("the Tab stop is never a disabled first button", async () => {
    const { buttons, byLabel, before, after } = await setup(
      ["One", "Two", "Three"],
      ["One"],
    );
    expect(await tabStops(buttons)).to.deep.equal(["Two"]);
    before.focus();
    await press("Tab");
    expectFocusOn(expect, inner(byLabel.Two), "Tab into the toolbar");
    await press("Tab");
    expectFocusOn(expect, after, "Tab out of the toolbar");
  });

  it("the Tab stop moves off a button when it is disabled", async () => {
    const { buttons, byLabel } = await setup(["One", "Two", "Three"]);
    expect(await tabStops(buttons)).to.deep.equal(["One"]);
    byLabel.One.disabled = true;
    expect(await tabStops(buttons)).to.deep.equal(["Two"]);
  });

  it("with every button disabled, arrow keys move nothing", async () => {
    const { toolbar, buttons, before, after } = await setup(
      ["One", "Two", "Three"],
      ["One", "Two", "Three"],
    );
    // nothing in the toolbar can take focus, so Tab passes over it
    before.focus();
    await press("Tab");
    expectFocusOn(expect, after, "Tab passes over the toolbar");
    // no item can hold focus, so the keys go straight to the toolbar
    const current = toolbar.currentItem;
    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
      const e = new KeyboardEvent("keydown", {
        key,
        keyCode: { ArrowRight: 39, ArrowLeft: 37, Home: 36, End: 35 }[key],
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      buttons[1].dispatchEvent(e);
      await settle(30);
      const active = deepActiveElement();
      expect(active === after, `${key}: ${describeEl(active)}`).to.equal(true);
      expect(toolbar.currentItem, `${key} keeps the current item`).to.equal(
        current,
      );
    }
  });
});
