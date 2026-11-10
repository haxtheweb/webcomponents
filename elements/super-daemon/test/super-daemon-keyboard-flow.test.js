/**
 * Keyboard flow: Merlin (super-daemon). Open with its global shortcut,
 * type to filter, arrow to a result, Enter runs it, Escape closes, and focus
 * goes back to where the user was. Real key presses only; see
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import { SuperDaemonInstance } from "../super-daemon.js";
import {
  press,
  type,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

const EVENT = "kf-merlin-run";
const WORD = "kfqzx";
let defined = false;

function defineOptions() {
  if (defined) return;
  defined = true;
  ["alpha", "bravo", "charlie"].forEach((name) => {
    SuperDaemonInstance.defineOption({
      title: `${WORD} ${name}`,
      icon: "icons:check",
      tags: [WORD, name],
      eventName: EVENT,
      path: `kf/${name}`,
      value: { name },
    });
  });
}

// the chord Merlin listens for on this platform (Alt+Shift on Linux/Windows,
// Meta+Shift on macOS)
function openChord() {
  return `${SuperDaemonInstance.key1 === "Meta" ? "Meta" : SuperDaemonInstance.key1}+${SuperDaemonInstance.key2}`;
}

// the focused node in Chromium's accessibility tree, polled until `check`
// passes (null outside Chromium)
async function waitForAx(check, timeout = 1500) {
  const start = Date.now();
  let ax = await executeServerCommand("ax-focused");
  while (ax !== null && !check(ax) && Date.now() - start < timeout) {
    await settle(50);
    ax = await executeServerCommand("ax-focused");
  }
  return ax;
}

describe("keyboard flow: Merlin (super-daemon)", () => {
  let wrapper;
  let opener;
  let ran;
  const onRun = (e) => ran.push(e.detail);

  beforeEach(async () => {
    defineOptions();
    ran = [];
    globalThis.addEventListener(EVENT, onRun);
    wrapper = await fixture(
      html`<div>
        <button id="opener">Where I was working</button>
      </div>`,
    );
    opener = wrapper.querySelector("#opener");
    opener.focus();
    await SuperDaemonInstance.updateComplete;
  });

  afterEach(async () => {
    globalThis.removeEventListener(EVENT, onRun);
    if (SuperDaemonInstance.opened) {
      SuperDaemonInstance.close();
    }
    await settle(50);
  });

  async function openMerlin() {
    await press(openChord());
    await waitFor(() => SuperDaemonInstance.opened);
    expect(SuperDaemonInstance.opened, "shortcut opens Merlin").to.equal(true);
    // the search input receives focus
    await waitFor(() =>
      composedContains(SuperDaemonInstance, deepActiveElement()),
    );
  }

  it("the shortcut opens Merlin with focus in the search field", async () => {
    await openMerlin();
    const active = deepActiveElement();
    expect(
      composedContains(SuperDaemonInstance, active),
      `focus should be in Merlin, was ${describeEl(active)}`,
    ).to.equal(true);
    expect(active.tagName).to.equal("INPUT");
    expectGoodFocusStop(expect, "Merlin search");
    expect(positiveTabindexIn(SuperDaemonInstance)).to.deep.equal([]);
  });

  it("type, ArrowDown to a result, Enter runs it and closes", async () => {
    await openMerlin();
    await type(WORD, 150);
    const ui = SuperDaemonInstance.shadowRoot.querySelector("super-daemon-ui");
    await waitFor(() => ui.filtered && ui.filtered.length === 3, 2000);
    expect(ui.filtered.length, "typing filters to our 3 results").to.equal(3);
    // let the debounced filter finish so a late re-filter does not reset
    // the highlighted row under the arrow keys
    await settle(300);
    await press("ArrowDown");
    await press("ArrowDown", 80);
    const titles = ui.filtered.map((i) => i.value.name);
    const expected = titles[ui._selectedIndex];
    expect(ui._selectedIndex, "two ArrowDowns highlight row 2").to.equal(1);
    // the focused combobox input points at the highlighted row, which is
    // selected
    const row = ui.shadowRoot.querySelector("#option-1");
    expect(row, "highlighted row rendered").to.exist;
    expect(row.getAttribute("aria-selected")).to.equal("true");
    await waitFor(
      () => deepActiveElement().ariaActiveDescendantElement === row,
      1000,
    );
    expect(
      deepActiveElement().ariaActiveDescendantElement === row,
      "input's active descendant is the highlighted row",
    ).to.equal(true);
    await press("Enter", 80);
    expect(ran.map((d) => d.name)).to.deep.equal([expected]);
    await waitFor(() => !SuperDaemonInstance.opened);
    expect(SuperDaemonInstance.opened).to.equal(false);
  });

  // The element that holds focus is the <input> inside simple-fields-field
  // inside super-daemon-search, and the option-N rows live in
  // super-daemon-ui's shadow root. The input is the combobox and points at
  // the highlighted row by element reference, so assistive technology hears
  // it. Checked against Chromium's accessibility tree, not just attributes.
  it("the focused search input exposes the highlighted result to assistive tech", async () => {
    await openMerlin();
    await type(WORD, 150);
    await settle(300);
    await press("ArrowDown", 150);
    const ui = SuperDaemonInstance.shadowRoot.querySelector("super-daemon-ui");
    const titleAt = (i) => ui.filtered[i].title;
    const ax = await waitForAx((node) => node && node.activeDescendant);
    if (ax === null) return; // no accessibility tree outside Chromium
    expect(ax.role, "the focused node is the combobox").to.equal("combobox");
    expect(ax.expanded, "results are showing").to.equal(true);
    expect(ax.activeDescendant, "a result is active").to.exist;
    expect(ax.activeDescendant.role).to.equal("option");
    expect(ax.activeDescendant.name).to.include(titleAt(ui._selectedIndex));
    expect(ax.activeDescendant.selected).to.equal(true);
    const second = (ui._selectedIndex + 1) % ui.filtered.length;
    await press("ArrowDown", 150);
    expect(ui._selectedIndex, "ArrowDown moves the highlight").to.equal(second);
    const next = await waitForAx(
      (node) =>
        node &&
        node.activeDescendant &&
        node.activeDescendant.name.includes(titleAt(second)),
    );
    expect(next.activeDescendant.name).to.include(titleAt(second));
  });

  it("Escape closes and focus returns to where the user was", async () => {
    await openMerlin();
    await type(WORD, 100);
    await press("Escape", 80);
    await waitFor(() => !SuperDaemonInstance.opened);
    expect(SuperDaemonInstance.opened).to.equal(false);
    await waitFor(() => deepActiveElement() === opener, 1500);
    expectFocusOn(expect, opener, "focus after closing Merlin");
  });

  it("Tab stays inside Merlin while it is open", async () => {
    await openMerlin();
    await type(WORD, 100);
    for (let i = 0; i < 8; i++) {
      await press("Tab");
      const el = expectGoodFocusStop(expect, `Merlin Tab ${i + 1}`);
      expect(
        composedContains(SuperDaemonInstance, el),
        `Tab ${i + 1} escaped Merlin to ${describeEl(el)}`,
      ).to.equal(true);
    }
  });
});
