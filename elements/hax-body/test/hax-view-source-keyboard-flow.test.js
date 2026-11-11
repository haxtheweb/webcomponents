/**
 * Keyboard flow: the View source panel acting on hax-body. Real key presses
 * only; see scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 *
 * - Copy HTML keeps focus on its button and announces the copy.
 * - Opening the panel, Update HTML and Clean formatting keep the content
 *   (text between the blocks included) and throw nothing.
 */
import { fixture, expect, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { HAXStore } from "../lib/hax-store.js";
import "../lib/hax-tray.js";
import "../hax-body.js";
import {
  press,
  settle,
  waitFor,
  composedContains,
  expectGoodFocusStop,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

// the blocks and their text: what the author wrote, without the attributes
// HAX adds and removes while a block is active
const blocks = (body) =>
  [...body.children].map(
    (c) =>
      `${c.tagName.toLowerCase()}:${c.textContent.replace(/\s+/g, " ").trim()}`,
  );
// HTML with the whitespace between tags dropped: importing re-flows it
const flat = (s) => s.replace(/>\s+</g, "><").trim();

describe("keyboard flow: hax-view-source and hax-body content", function () {
  this.timeout(30000);
  let wrapper;
  let tray;
  let body;
  let errors;
  const seeError = (e) => {
    const err = e.reason || e.error || e;
    errors.push(String((err && err.message) || err));
  };

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
    await waitFor(() => HAXStore.haxTray === tray, 3000);
    HAXStore.editMode = true;
    await waitFor(() => tray.editMode && body.editMode, 2000);
    // the tray slides in (0.6s transform) as edit mode starts: wait until it
    // rests before pressing keys in it
    await waitFor(() => {
      const panel = tray.shadowRoot.querySelector(".wrapper");
      return panel && globalThis.getComputedStyle(panel).transform === "none";
    }, 2000);
    await settle(200);
    errors = [];
    globalThis.addEventListener("unhandledrejection", seeError);
    globalThis.addEventListener("error", seeError);
  });

  afterEach(async () => {
    globalThis.removeEventListener("unhandledrejection", seeError);
    globalThis.removeEventListener("error", seeError);
    HAXStore.editMode = false;
    await settle(50);
  });

  describe("view source", () => {
    async function openSource() {
      tray.trayDetail = "view-source";
      tray.collapsed = false;
      await tray.updateComplete;
      const source = tray.shadowRoot.querySelector("hax-view-source");
      await waitFor(
        () =>
          source.shadowRoot &&
          source.shadowRoot.querySelectorAll("hax-tray-button").length > 2,
        3000,
      );
      // the code editor loads lazily and fills a second later
      await settle(1300);
      return source;
    }
    const button = (source, re) =>
      [...source.shadowRoot.querySelectorAll("hax-tray-button")].find((b) =>
        re.test(b.getAttribute("label") || ""),
      );

    it("Copy HTML keeps focus on its button and announces the copy", async () => {
      const source = await openSource();
      const copy = button(source, /copy/i);
      const toasts = [];
      const seeToast = (e) => toasts.push(e.detail && e.detail.text);
      globalThis.addEventListener(HAXStore.toastShowEventName, seeToast);
      try {
        copy.focus();
        await settle(50);
        await press("Enter", 150);
      } finally {
        globalThis.removeEventListener(HAXStore.toastShowEventName, seeToast);
      }
      const el = expectGoodFocusStop(expect, "after Copy HTML");
      expect(
        composedContains(copy, el),
        `focus stays on Copy HTML, was on ${describeEl(el)}`,
      ).to.equal(true);
      expect(toasts, "the copy is announced").to.include(
        source.t.copiedToClipboard,
      );
    });

    // what the source view shows: the code editor needs Monaco, which the
    // test page does not load, so hand it the body's own HTML
    async function showSource(source) {
      const html = await body.haxToContent();
      const editor = source.shadowRoot.querySelector("#textarea");
      Object.defineProperty(editor, "value", {
        configurable: true,
        get: () => html,
      });
      return html;
    }

    for (const [label, re] of [
      ["Update HTML", /update/i],
      ["Clean formatting", /clean/i],
    ]) {
      it(`${label} keeps the content as it was and throws nothing`, async () => {
        const source = await openSource();
        expect(errors, "opening the source view").to.deep.equal([]);
        const was = await showSource(source);
        const wasBlocks = blocks(body);
        const action = button(source, re);
        action.focus();
        await settle(50);
        await press("Enter", 300);
        await waitFor(() => body.children.length === wasBlocks.length, 3000);
        await settle(200);
        expect(errors, label).to.deep.equal([]);
        expect(blocks(body)).to.deep.equal(wasBlocks);
        expect(flat(await body.haxToContent())).to.equal(flat(was));
      });
    }
  });
});
