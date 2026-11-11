/**
 * Keyboard flow: the editing area itself (hax-body). Real key presses only;
 * see scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 *
 * - Tab belongs to the editor (indent) only while focus is in the editable
 *   content; with focus anywhere else it moves focus as usual, and
 *   Escape, then Tab leaves the editing area.
 * - Tabbing into the editing area shows a focus ring; a pointer does not.
 * - Page outline rows for blocks with no HAX schema ("HTML block") go to
 *   their block.
 */
import { fixture, expect, html } from "@open-wc/testing";
import { setViewport, sendMouse, sendKeys } from "@web/test-runner-commands";
import { HAXStore } from "../lib/hax-store.js";
import "../lib/hax-tray.js";
import "../hax-body.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  hasVisibleFocusIndicator,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

async function shiftTab(ms = 150) {
  await sendKeys({ down: "Shift" });
  await sendKeys({ press: "Tab" });
  await sendKeys({ up: "Shift" });
  await settle(ms);
}

// the blocks and their text: what the author wrote, without the attributes
// HAX adds and removes while a block is active
const blocks = (body) =>
  [...body.children].map(
    (c) =>
      `${c.tagName.toLowerCase()}:${c.textContent.replace(/\s+/g, " ").trim()}`,
  );

// put the caret at `offset` in the first text node of `el`
function caretIn(el, offset = 1) {
  const walker = globalThis.document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode();
  const range = globalThis.document.createRange();
  range.setStart(text, Math.min(offset, text.length));
  range.collapse(true);
  const sel = globalThis.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// a point inside `el` that the pointer would really hit (nothing on top)
function hitPoint(el) {
  const r = el.getBoundingClientRect();
  for (const fx of [0.5, 0.75, 0.9, 0.25]) {
    const x = Math.round(r.left + r.width * fx);
    const y = Math.round(r.top + r.height / 2);
    const hit = globalThis.document.elementFromPoint(x, y);
    if (hit && (hit === el || el.contains(hit))) return [x, y];
  }
  return null;
}

describe("keyboard flow: the hax-body editing area", function () {
  this.timeout(30000);
  let wrapper;
  let tray;
  let body;
  let before;
  let after;
  let keys;
  const seeKey = (e) =>
    keys.push({ key: e.key, prevented: e.defaultPrevented });

  beforeEach(async () => {
    await setViewport({ width: 1280, height: 1000 });
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <hax-tray></hax-tray>
        <hax-body
          ><h2>Heading one</h2>
          <p>First paragraph</p>
          <ul>
            <li>Item one</li>
            <li>Item two</li>
          </ul>
          <div>Plain div</div>
          <p>Second paragraph</p></hax-body
        >
        <button id="after">after</button>
      </div>`,
    );
    tray = wrapper.querySelector("hax-tray");
    body = wrapper.querySelector("hax-body");
    before = wrapper.querySelector("#before");
    after = wrapper.querySelector("#after");
    await waitFor(() => HAXStore.haxTray === tray, 3000);
    HAXStore.editMode = true;
    await waitFor(() => tray.editMode && body.editMode, 2000);
    // the tray slides in (0.6s transform) as edit mode starts: wait until it
    // rests, or the first Tab can land on a button still off screen
    await waitFor(() => {
      const panel = tray.shadowRoot.querySelector(".wrapper");
      return panel && globalThis.getComputedStyle(panel).transform === "none";
    }, 2000);
    await settle(200);
    // registered after hax-body's own window listener: sees a key only when
    // hax-body let it through, and whether anyone prevented its default
    keys = [];
    globalThis.addEventListener("keydown", seeKey);
  });

  afterEach(async () => {
    globalThis.removeEventListener("keydown", seeKey);
    HAXStore.editMode = false;
    await settle(50);
  });

  // a text block is active and holds the selection, as after typing in it
  async function activateText(el) {
    HAXStore.activeNode = el;
    await settle(100);
    caretIn(el);
  }

  const passedThrough = (key) =>
    keys.filter((k) => k.key === key && !k.prevented).length;

  describe("Tab with focus outside the editing area", () => {
    it("Tab from a button before the tray moves focus on, not into the text block", async () => {
      const p = body.querySelector("p");
      await activateText(p);
      const was = blocks(body);
      before.focus();
      await press("Tab", 150);
      const el = expectGoodFocusStop(expect, "Tab from #before");
      expect(
        composedContains(tray, el),
        `Tab lands in the tray, was on ${describeEl(el)}`,
      ).to.equal(true);
      expect(passedThrough("Tab"), "the browser handled Tab").to.equal(1);
      expect(blocks(body), "the text block is untouched").to.deep.equal(was);
    });

    it("Shift+Tab from a button after the editor is not taken for outdent", async () => {
      const li = body.querySelector("li");
      await activateText(li);
      const was = blocks(body);
      after.focus();
      await shiftTab();
      expect(passedThrough("Tab"), "the browser handled Shift+Tab").to.equal(1);
      expect(deepActiveElement() === after, "focus left #after").to.equal(
        false,
      );
      expect(blocks(body), "the list is untouched").to.deep.equal(was);
    });
  });

  describe("Tab with focus inside the editing area", () => {
    it("Tab in a list item still indents it", async () => {
      const second = body.querySelectorAll("li")[1];
      body.focus();
      await activateText(second);
      await press("Tab", 200);
      expect(passedThrough("Tab"), "hax-body took Tab").to.equal(0);
      expect(
        composedContains(body, deepActiveElement()) ||
          deepActiveElement() === body,
        "focus stays in the editing area",
      ).to.equal(true);
    });

    it("Escape, then Tab leaves the editing area (and Escape, then Shift+Tab)", async () => {
      const li = body.querySelector("li");
      body.focus();
      await activateText(li);
      const was = blocks(body);
      await press("Escape", 50);
      await press("Tab", 150);
      expect(
        passedThrough("Tab"),
        "Escape, then Tab is the browser's",
      ).to.equal(1);
      // the next stop is the active block's own tools (hax-body's context
      // menus, after the content), then the rest of the page
      const out = deepActiveElement();
      expect(
        out !== body && !body.contains(out),
        `Tab left the editable content, was on ${describeEl(out)}`,
      ).to.equal(true);
      expectGoodFocusStop(expect, "after Escape, then Tab");
      expect(blocks(body), "nothing was indented").to.deep.equal(was);
      // back in, and out the other way
      body.focus();
      caretIn(li);
      keys.length = 0;
      await press("Escape", 50);
      await shiftTab();
      expect(passedThrough("Tab"), "Escape, then Shift+Tab").to.equal(1);
      const el = deepActiveElement();
      expect(
        el !== body && !composedContains(body, el),
        `Shift+Tab left the editing area, was on ${describeEl(el)}`,
      ).to.equal(true);
      expect(blocks(body), "nothing was outdented").to.deep.equal(was);
    });

    it("any other key after Escape gives Tab back to the editor", async () => {
      const second = body.querySelectorAll("li")[1];
      body.focus();
      await activateText(second);
      await press("Escape", 50);
      await press("ArrowRight", 50);
      await press("Tab", 200);
      expect(passedThrough("Tab"), "hax-body took Tab").to.equal(0);
    });
  });

  describe("focus ring on the editing area", () => {
    it("Tab into the editing area shows a focus ring", async () => {
      globalThis.getSelection().removeAllRanges();
      before.focus();
      // forward through the tray to the editing area
      for (let i = 0; i < 80 && deepActiveElement() !== body; i++) {
        await press("Tab", 40);
        if (deepActiveElement() === after) break;
      }
      expect(
        deepActiveElement() === body,
        `Tab from #before reaches hax-body, was on ${describeEl(deepActiveElement())}`,
      ).to.equal(true);
      expectGoodFocusStop(expect, "hax-body");
      const cs = globalThis.getComputedStyle(body);
      expect(cs.outlineStyle).to.equal("solid");
      expect(parseFloat(cs.outlineWidth)).to.be.at.least(2);
      // leaving takes the ring away
      await press("Tab", 100);
      expect(globalThis.getComputedStyle(body).outlineStyle).to.equal("none");
    });

    it("a pointer focusing the editing area shows no ring", async () => {
      const p = body.querySelectorAll("p")[1];
      const point = hitPoint(p);
      expect(point, "the paragraph can be clicked").to.not.equal(null);
      await sendMouse({ type: "click", position: point });
      await settle(200);
      expect(
        deepActiveElement() === body,
        `the click focused hax-body, was ${describeEl(deepActiveElement())}`,
      ).to.equal(true);
      expect(hasVisibleFocusIndicator(body)).to.equal(false);
      expect(body.hasAttribute("data-hax-keyboard-focus")).to.equal(false);
    });

    it("no ring and no extra attribute outside edit mode", async () => {
      HAXStore.editMode = false;
      await waitFor(() => !body.editMode, 2000);
      await settle(100);
      after.focus();
      await shiftTab(100);
      expect(deepActiveElement() === body).to.equal(false);
      expect(body.hasAttribute("data-hax-keyboard-focus")).to.equal(false);
      expect(globalThis.getComputedStyle(body).outlineStyle).to.equal("none");
    });
  });

  describe("page outline", () => {
    async function openOutline() {
      tray.trayDetail = "content-map";
      tray.collapsed = false;
      await tray.updateComplete;
      const map = tray.shadowRoot.querySelector("hax-map");
      await waitFor(() => map.elementList.some((r) => r.tag === "div"), 3000);
      await map.updateComplete;
      return map;
    }

    it("an HTML block row goes to its block on click and on Enter", async () => {
      const div = body.querySelector("div");
      const map = await openOutline();
      const index = map.elementList.findIndex((r) => r.node === div);
      const row = map.elementList[index];
      expect(row.name, "a block with no HAX schema").to.equal("HTML block");
      const li = map.shadowRoot.querySelector(`li[data-index="${index}"]`);
      let scrolled = 0;
      const scroll = div.scrollIntoViewIfNeeded;
      div.scrollIntoViewIfNeeded = function (...args) {
        scrolled++;
        return scroll.apply(this, args);
      };
      try {
        HAXStore.activeNode = body.querySelector("h2");
        await settle(100);
        li.click();
        await settle(200);
        expect(HAXStore.activeNode === div, "click selects it").to.equal(true);
        expect(scrolled, "click scrolls to it").to.equal(1);
        HAXStore.activeNode = body.querySelector("h2");
        await settle(100);
        li.focus();
        await press("Enter", 200);
        expect(HAXStore.activeNode === div, "Enter selects it").to.equal(true);
        expect(scrolled, "Enter scrolls to it").to.equal(2);
      } finally {
        delete div.scrollIntoViewIfNeeded;
      }
    });
  });
});
