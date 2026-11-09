// Entering edit mode used to repeat work per block (haxtheweb/issues#3263):
// a whenDefined + requestAnimationFrame wait per custom element, a toJS()
// copy of the whole gizmo list per node, and the editable pass + the
// editModeChanged hooks running twice when edit mode turned on during an
// import. These pin the batched behaviour without changing what ends up
// editable.
import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import { HAXStore } from "../lib/hax-store.js";

const settle = async (ms = 50) => {
  await new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));
};

function contentReady(body) {
  return new Promise((resolve) => {
    body.addEventListener("hax-body-content-ready", resolve, { once: true });
  });
}

describe("hax-body edit-mode entry does each thing once", () => {
  let savedGizmos;
  before(() => {
    if (!HAXStore.validGridTagList.includes("grid-plate")) {
      HAXStore.validGridTagList.push("grid-plate");
    }
  });
  beforeEach(() => {
    savedGizmos = HAXStore.gizmoList;
  });
  afterEach(() => {
    HAXStore.gizmoList = savedGizmos;
  });

  it("waits one shared frame for many custom elements, not one each", async () => {
    const body = await fixture(html`<hax-body></hax-body>`);
    let content = "";
    for (let i = 0; i < 20; i++) {
      content +=
        '<grid-plate layout="1-1"><p slot="col-1">' + i + "</p></grid-plate>";
    }
    content += "<p>plain</p>";
    const ready = contentReady(body);
    body.importContent(content);
    await ready;
    await settle();
    const realRAF = globalThis.requestAnimationFrame;
    let frames = 0;
    globalThis.requestAnimationFrame = (cb) => {
      frames++;
      return realRAF(cb);
    };
    try {
      await body._applyContentEditable(true);
    } finally {
      globalThis.requestAnimationFrame = realRAF;
    }
    // 20 grid-plates plus their 20 grid children used to cost 40 frames
    expect(frames).to.be.below(4);
    const plates = body.querySelectorAll("grid-plate");
    expect(plates.length).to.equal(20);
    plates.forEach((plate) => {
      expect(plate.hasAttribute("data-hax-ray")).to.equal(true);
      expect(plate.querySelector("p").getAttribute("contenteditable")).to.equal(
        "true",
      );
    });
    expect(
      body.querySelector(":scope > p").getAttribute("contenteditable"),
    ).to.equal("true");
    // and turning it off still reaches every node
    await body._applyContentEditable(false);
    expect(
      body.querySelector(":scope > p").hasAttribute("contenteditable"),
    ).to.equal(false);
    expect(
      plates[0].querySelector("p").hasAttribute("contenteditable"),
    ).to.equal(false);
  });

  it("labels nodes from the live gizmo list, first match wins", async () => {
    const body = await fixture(html`<hax-body></hax-body>`);
    HAXStore.gizmoList = [
      null,
      { tag: "p", title: "Paragraph" },
      { tag: "p", title: "Second paragraph gizmo" },
      { tag: "grid-plate", title: "Grid layout" },
    ];
    const p = document.createElement("p");
    body.appendChild(p);
    body.__applyNodeEditableState(p, true);
    expect(p.getAttribute("data-hax-ray")).to.equal("Paragraph");
    // unknown tags fall back to the tag name, as before
    const h = document.createElement("h3");
    body.appendChild(h);
    body.__applyNodeEditableState(h, true);
    expect(h.getAttribute("data-hax-ray")).to.equal("h3");
    // titles are read fresh, so a translated title shows up on the next pass
    HAXStore.gizmoList[1].title = "Absatz";
    body.__applyNodeEditableState(p, true);
    expect(p.getAttribute("data-hax-ray")).to.equal("Absatz");
  });

  it("runs the editModeChanged hooks once per block when entering during an import", async () => {
    const body = await fixture(html`<hax-body></hax-body>`);
    await settle();
    const realRunHook = HAXStore.runHook;
    const hooked = new Map();
    HAXStore.runHook = function (node, op, args) {
      if (op === "editModeChanged" && args && args[0] === true) {
        hooked.set(node, (hooked.get(node) || 0) + 1);
      }
      return realRunHook.apply(this, arguments);
    };
    try {
      const ready = contentReady(body);
      // what the site editor does: import, and edit mode flips alongside
      body.importContent(
        '<p>one</p><grid-plate layout="1-1"><p slot="col-1">two</p></grid-plate><p>three</p>',
      );
      body.editMode = true;
      await ready;
      await settle(150);
    } finally {
      HAXStore.runHook = realRunHook;
    }
    const kids = [...body.children].filter(
      (el) => el.tagName !== "P" || el.textContent !== "",
    );
    expect(kids.length).to.be.at.least(3);
    kids.slice(0, 3).forEach((kid) => {
      expect(hooked.get(kid)).to.equal(1);
    });
    expect(body.querySelector("p").getAttribute("contenteditable")).to.equal(
      "true",
    );
    expect(
      body.querySelector("grid-plate").hasAttribute("data-hax-ray"),
    ).to.equal(true);
    body.editMode = false;
    await settle();
    expect(body.querySelector("p").hasAttribute("contenteditable")).to.equal(
      false,
    );
  });

  it("still runs the hooks on entry when nothing is importing", async () => {
    const body = await fixture(html`<hax-body></hax-body>`);
    const ready = contentReady(body);
    body.importContent("<p>already here</p>");
    await ready;
    await settle();
    const realRunHook = HAXStore.runHook;
    let calls = 0;
    HAXStore.runHook = function (node, op) {
      if (op === "editModeChanged") {
        calls++;
      }
      return realRunHook.apply(this, arguments);
    };
    try {
      body.editMode = true;
      await settle(100);
    } finally {
      HAXStore.runHook = realRunHook;
    }
    expect(calls).to.be.at.least(1);
    expect(body.querySelector("p").hasAttribute("data-hax-ray")).to.equal(true);
    body.editMode = false;
    await settle();
  });
});
