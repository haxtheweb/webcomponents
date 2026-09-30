import { fixture, expect, html } from "@open-wc/testing";
import { SortingOption } from "../lib/sorting-option.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const fakeTarget = (id) => ({
  getAttribute: (name) => (name === "id" ? id : null),
});

// a sync "view transition" stand-in so the wrapped paths run deterministically
const fakeViewTransition = (cb) => {
  cb();
  return { ready: { catch: () => {} } };
};

async function buildBoard() {
  const parent = globalThis.document.createElement("div");
  const options = [];
  for (const label of ["Alpha", "Beta", "Gamma"]) {
    const option = globalThis.document.createElement("sorting-option");
    option.textContent = label;
    parent.appendChild(option);
    options.push(option);
  }
  globalThis.document.body.appendChild(parent);
  await Promise.all(options.map((option) => option.updateComplete));
  return { parent: parent, options: options };
}

const labels = (parent) =>
  Array.from(parent.children).map((child) => child.textContent);

describe("sorting-option (lib/sorting-option.js)", () => {
  it("exposes the expected static tag", () => {
    expect(SortingOption.tag).to.equal("sorting-option");
  });

  it("defaults to enabled, not dragging, and draggable", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    expect(el.dragging).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.hasAttribute("draggable")).to.equal(true);
    expect(el.getAttribute("draggable")).to.equal("true");
  });

  it("drops draggable while disabled and restores it after", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("draggable")).to.equal(false);
    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute("draggable")).to.equal("true");
  });

  it("renders arrows with titles and an empty feedback icon", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    const up = el.shadowRoot.querySelector("#upArrow");
    const down = el.shadowRoot.querySelector("#downArrow");
    expect(up).to.exist;
    expect(down).to.exist;
    expect(up.getAttribute("title")).to.equal(
      "Select to move option up in order",
    );
    expect(down.getAttribute("title")).to.equal(
      "Select to move option down in order",
    );
    expect(el.shadowRoot.querySelector("simple-icon-lite")).to.equal(null);
    expect(el.shadowRoot.querySelectorAll(".icon").length).to.equal(1);
  });

  it("renders check and clear feedback icons for correctness", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    el.correct = true;
    await el.updateComplete;
    let icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.getAttribute("icon")).to.equal("check");
    expect(icon.getAttribute("title")).to.equal(
      "Answer is in correct order",
    );
    el.correct = null;
    el.incorrect = true;
    await el.updateComplete;
    icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.getAttribute("icon")).to.equal("clear");
    expect(icon.getAttribute("title")).to.equal(
      "Answer is in incorrect order",
    );
  });

  it("tracks the press position and clears correctness flags", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    el.correct = true;
    el.incorrect = true;
    el.dispatchEvent(new MouseEvent("mousedown", { clientY: 100, bubbles: true }));
    expect(el.currentPosition).to.equal(100);
    expect(el.correct).to.equal(null);
    expect(el.incorrect).to.equal(null);
  });

  it("ignores presses while disabled", async () => {
    const el = await fixture(
      html`<sorting-option>Step</sorting-option>`,
    );
    el.disabled = true;
    await el.updateComplete;
    el.correct = true;
    el.dispatchEvent(new MouseEvent("mousedown", { clientY: 100, bubbles: true }));
    expect(el.currentPosition).to.equal(undefined);
    expect(el.correct).to.equal(true);
  });

  it("drag events reorder the board upward and downward", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      const options = board.options;
      // Beta (index 1) pressed at 300, dragged to 220 -> moves up
      options[1].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      options[1].dispatchEvent(new MouseEvent("drag", { clientY: 220 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
      expect(options[1].dragging).to.equal(true);
      // Alpha (now index 1) pressed at 100, dragged to 300 -> moves down
      options[0].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 100, bubbles: true }),
      );
      options[0].dispatchEvent(new MouseEvent("drag", { clientY: 300 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Gamma|Alpha");
      // dragend / mouseup clear the dragging flag
      options[0].dispatchEvent(new MouseEvent("dragend"));
      expect(options[0].dragging).to.equal(false);
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("keeps position on a zero clientY drag and no-ops at the edges", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      const options = board.options;
      // a zero clientY is treated as the drag stopping: no move
      options[1].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      options[1].dispatchEvent(new MouseEvent("drag", { clientY: 0 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Alpha|Beta|Gamma");
      // Alpha at index 0 cannot move further up
      options[0].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      options[0].dispatchEvent(new MouseEvent("drag", { clientY: 100 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Alpha|Beta|Gamma");
      // Gamma at the end cannot move further down
      options[2].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 100, bubbles: true }),
      );
      options[2].dispatchEvent(new MouseEvent("drag", { clientY: 300 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Alpha|Beta|Gamma");
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("uses a larger swap buffer when images are slotted", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      const options = board.options;
      // 64px buffer: 220 + 64 < 300 -> plain options swap up
      options[1].dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      options[1].dispatchEvent(new MouseEvent("drag", { clientY: 220 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
      // same distance with an image slotted needs the 92px buffer and stays
      const withImage = globalThis.document.createElement("sorting-option");
      withImage.innerHTML =
        '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="x" />';
      parent.appendChild(withImage);
      await withImage.updateComplete;
      withImage.dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      withImage.dispatchEvent(new MouseEvent("drag", { clientY: 220 }));
      await flush();
      // the image option stays last: 220 + 92 is not under 300
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma|");
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("arrowSortCallback swaps down and up and moves focus", async () => {
    const board = await buildBoard();
    const parent = board.parent;
    const options = board.options;
    // down: Alpha swaps with Beta
    options[0].arrowSortCallback(fakeTarget("downArrow"));
    await flush();
    expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
    // up: Gamma swaps with Alpha
    options[2].arrowSortCallback(fakeTarget("upArrow"));
    await flush();
    expect(labels(parent).join("|")).to.equal("Beta|Gamma|Alpha");
    // focus lands on the arrow button of the moved option; walk the shadow
    // chain because document.activeElement stops at the first shadow host
    let active = globalThis.document.activeElement;
    expect(active.tagName).to.equal("SORTING-OPTION");
    active = active.shadowRoot.activeElement;
    expect(active.getAttribute("id")).to.equal("upArrow");
    active = active.shadowRoot.activeElement;
    expect(active.tagName).to.equal("BUTTON");
  });

  it("BUG(sorting-option.js:163): moving an option down loses keyboard focus", async () => {
    // the downArrow branch focuses the simple-icon-button-lite HOST (a no-op
    // without delegatesFocus) while the upArrow branch focuses the inner
    // button (lib/sorting-option.js:171-174); after a down move the keyboard
    // user is dropped on <body>
    const board = await buildBoard();
    const parent = board.parent;
    const options = board.options;
    // normalize focus so leftovers from earlier fixtures do not mask it
    const current = globalThis.document.activeElement;
    if (current && typeof current.blur === "function") {
      current.blur();
    }
    expect(globalThis.document.activeElement.tagName === "BODY").to.equal(
      true,
    );
    options[0].arrowSortCallback(fakeTarget("downArrow"));
    await flush();
    expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
    expect(globalThis.document.activeElement.tagName === "BODY").to.equal(
      true,
    );
  });

  it("arrowSortCallback is a no-op while disabled", async () => {
    const board = await buildBoard();
    const parent = board.parent;
    const options = board.options;
    options[0].disabled = true;
    await options[0].updateComplete;
    options[0].arrowSortCallback(fakeTarget("downArrow"));
    await flush();
    expect(labels(parent).join("|")).to.equal("Alpha|Beta|Gamma");
  });

  it("arrowSortCallback flashes the moved option background", async () => {
    const board = await buildBoard();
    const options = board.options;
    options[0].arrowSortCallback(fakeTarget("downArrow"));
    expect(options[0].style.backgroundColor).to.include(
      "--ddd-theme-default-linkLight",
    );
    await flush(550);
    expect(options[0].style.backgroundColor).to.equal("");
  });

  it("arrowSort runs through a view transition wrapper", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = fakeViewTransition;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      board.options[0].arrowSort({ target: fakeTarget("downArrow") });
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("arrowSort falls back to the direct callback without transitions", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      board.options[0].arrowSort({ target: fakeTarget("downArrow") });
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("dragStart runs through a view transition wrapper", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = fakeViewTransition;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      const option = board.options[1];
      option.dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      option.dispatchEvent(new MouseEvent("drag", { clientY: 220 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Beta|Alpha|Gamma");
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("dragStart is a no-op while disabled", async () => {
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      const board = await buildBoard();
      const parent = board.parent;
      const option = board.options[1];
      option.disabled = true;
      await option.updateComplete;
      option.dispatchEvent(
        new MouseEvent("mousedown", { clientY: 300, bubbles: true }),
      );
      option.dispatchEvent(new MouseEvent("drag", { clientY: 220 }));
      await flush();
      expect(labels(parent).join("|")).to.equal("Alpha|Beta|Gamma");
      expect(option.dragging).to.equal(false);
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<sorting-option>Order me</sorting-option>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
