/**
 * Keyboard flow: the shared HAX UI dialog (simple-modal, opened through the
 * app-level "simple-modal-show" event the way admin dialogs, hax-tray and
 * Merlin open it). Real key presses only; see
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "web-dialog/index.js";
import "../simple-modal.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

function buildContent() {
  const content = globalThis.document.createElement("div");
  content.innerHTML = `
    <label>Name <input id="kf-name" type="text"></label>
    <button id="kf-middle">Middle</button>`;
  const buttons = globalThis.document.createElement("div");
  buttons.innerHTML = `
    <button id="kf-cancel" dialog-dismiss>Cancel</button>
    <button id="kf-ok" dialog-confirm>OK</button>`;
  return { content, buttons };
}

describe("keyboard flow: simple-modal dialog contract", () => {
  let wrapper;
  let opener;
  let modal;

  beforeEach(async () => {
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <button id="opener">Open settings</button>
        <simple-modal></simple-modal>
      </div>`,
    );
    opener = wrapper.querySelector("#opener");
    modal = wrapper.querySelector("simple-modal");
    await modal.updateComplete;
    // keyboard user activates the opener with Enter
    opener.addEventListener("click", () => {
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          composed: true,
          detail: {
            title: "Keyboard flow dialog",
            elements: buildContent(),
            invokedBy: opener,
            styles: {},
          },
        }),
      );
    });
    opener.focus();
    await press("Tab"); // move to whatever follows, then come back
    await press("Shift+Tab");
    expectFocusOn(expect, opener);
  });

  afterEach(async () => {
    if (modal && modal.opened) {
      modal.close();
      await settle(50);
    }
  });

  async function openWithKeyboard() {
    await press("Enter");
    await waitFor(() => modal.opened);
    // focus moves into the dialog on its own
    await waitFor(() => composedContains(modal, deepActiveElement()), 2000);
  }

  it("Enter on the opener moves focus inside the dialog", async () => {
    await openWithKeyboard();
    expect(modal.opened).to.equal(true);
    const active = deepActiveElement();
    expect(
      composedContains(modal, active),
      `focus should be inside the dialog, was ${describeEl(active)}`,
    ).to.equal(true);
  });

  it("Tab and Shift+Tab stay trapped inside, with a visible ring and no hidden stops", async () => {
    await openWithKeyboard();
    const seen = new Set();
    // more presses than there are stops, so we must wrap at least once
    for (let i = 0; i < 8; i++) {
      await press("Tab");
      const el = expectGoodFocusStop(expect, `Tab ${i + 1}`);
      expect(
        composedContains(modal, el),
        `Tab ${i + 1} escaped the dialog to ${describeEl(el)}`,
      ).to.equal(true);
      seen.add(el);
    }
    for (let i = 0; i < 8; i++) {
      await press("Shift+Tab");
      const el = expectGoodFocusStop(expect, `Shift+Tab ${i + 1}`);
      expect(
        composedContains(modal, el),
        `Shift+Tab ${i + 1} escaped the dialog to ${describeEl(el)}`,
      ).to.equal(true);
    }
    // the content input, both buttons and the action buttons are reachable
    const ids = Array.from(seen).map((el) => el.id);
    ["kf-name", "kf-middle", "kf-cancel", "kf-ok"].forEach((id) =>
      expect(ids, `${id} reachable by Tab`).to.include(id),
    );
    expect(positiveTabindexIn(modal)).to.deep.equal([]);
  });

  it("Escape closes and focus returns to the opener", async () => {
    await openWithKeyboard();
    await press("Tab");
    await press("Escape");
    await waitFor(() => !modal.opened);
    expect(modal.opened).to.equal(false);
    // simple-modal restores focus to invokedBy after its close transition
    await waitFor(() => deepActiveElement() === opener, 2000);
    expectFocusOn(expect, opener);
    expectGoodFocusStop(expect, "after Escape");
  });

  it("activating a dialog-dismiss button with Enter closes and restores focus", async () => {
    await openWithKeyboard();
    let guard = 0;
    while (deepActiveElement().id !== "kf-cancel" && guard++ < 10) {
      await press("Tab");
    }
    expect(deepActiveElement().id).to.equal("kf-cancel");
    await press("Enter");
    await waitFor(() => !modal.opened);
    expect(modal.opened).to.equal(false);
    await waitFor(() => deepActiveElement() === opener, 2000);
    expectFocusOn(expect, opener);
  });

  it("a modal (no-dismiss) dialog ignores Escape but still traps Tab", async () => {
    opener.addEventListener(
      "click",
      () => {
        // re-open as modal: the first click listener already opened it,
        // swap in modal mode the way callers pass `modal: true`
        modal.modal = true;
        modal.open();
      },
      { once: true },
    );
    await openWithKeyboard();
    await press("Escape");
    await settle(100);
    expect(modal.opened).to.equal(true);
    for (let i = 0; i < 6; i++) {
      await press("Tab");
      expect(composedContains(modal, deepActiveElement())).to.equal(true);
    }
  });
});
