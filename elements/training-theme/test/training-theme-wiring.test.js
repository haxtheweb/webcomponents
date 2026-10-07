// store-driven content, click guards, and sub-element wiring tests for
// training-theme (complements training-theme.test.js)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { TrainingTheme } from "../training-theme.js";
import "../lib/training-button.js";
import { TrainingButton } from "../lib/training-button.js";

// poll until fn() is truthy or the timeout elapses; resolves to a boolean so
// assertions never receive a DOM node
async function waitFor(fn, timeout = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (fn()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return !!fn();
}

describe("training-button", () => {
  it("registers with the expected tag name", () => {
    expect(TrainingButton.tag).to.equal("training-button");
  });

  it("renders title, index, status dot, and slug link", async () => {
    const btn = await fixture(
      html`<training-button
        title="Intro"
        slug="intro"
        index="3"
      ></training-button>`,
    );
    await btn.updateComplete;
    const anchor = btn.shadowRoot.querySelector("a.wrapper");
    expect(anchor.getAttribute("href")).to.equal("intro");
    expect(btn.shadowRoot.querySelector("#title").textContent).to.equal(
      "Intro",
    );
    expect(btn.shadowRoot.querySelector(".index").textContent).to.equal("3");
    // the status dot is decorative; state rides on host attributes
    expect(btn.shadowRoot.querySelector(".dot")).to.exist;
    expect(btn.shadowRoot.querySelector(".dot").hasAttribute("aria-hidden")).to
      .be.true;
    await expect(btn).shadowDom.to.be.accessible();
  });

  it("marks the active item as the current page", async () => {
    const btn = await fixture(
      html`<training-button
        title="Active"
        slug="active"
        index="1"
      ></training-button>`,
    );
    await btn.updateComplete;
    expect(
      btn.shadowRoot.querySelector("a.wrapper").getAttribute("aria-current"),
    ).to.equal("false");
    btn.active = true;
    await btn.updateComplete;
    expect(
      btn.shadowRoot.querySelector("a.wrapper").getAttribute("aria-current"),
    ).to.equal("page");
  });

  it("prevents navigation when disabled", async () => {
    const btn = await fixture(
      html`<training-button
        title="Locked"
        slug="locked"
        index="2"
        disabled
      ></training-button>`,
    );
    await btn.updateComplete;
    const evt = new Event("click", { cancelable: true });
    btn.shadowRoot.querySelector("a.wrapper").dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.true;
  });

  it("prevents navigation in edit mode", async () => {
    const btn = await fixture(
      html`<training-button
        title="Editing"
        slug="editing"
        index="1"
      ></training-button>`,
    );
    await btn.updateComplete;
    btn.editMode = true;
    await btn.updateComplete;
    const anchor = btn.shadowRoot.querySelector("a.wrapper");
    const evt = new Event("click", { cancelable: true });
    anchor.dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.true;
    expect(anchor.getAttribute("part")).to.equal("edit-mode-active");
  });

  it("allows navigation when enabled", async () => {
    const btn = await fixture(
      html`<training-button
        title="Open"
        slug="open"
        index="1"
      ></training-button>`,
    );
    await btn.updateComplete;
    const evt = new Event("click", { cancelable: true });
    btn.shadowRoot.querySelector("a.wrapper").dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.false;
  });

  it("reflects active, visited, and disabled attributes", async () => {
    const btn = await fixture(
      html`<training-button title="A" slug="a" index="1"></training-button>`,
    );
    await btn.updateComplete;
    expect(btn.hasAttribute("active")).to.be.false;
    expect(btn.hasAttribute("visited")).to.be.false;
    btn.active = true;
    btn.visited = true;
    btn.disabled = true;
    await btn.updateComplete;
    expect(btn.hasAttribute("active")).to.be.true;
    expect(btn.hasAttribute("visited")).to.be.true;
    expect(btn.hasAttribute("disabled")).to.be.true;
  });
});

describe("training-theme store wiring", () => {
  it("mirrors items, activeId, and maxIndex from the store", async () => {
    const originalManifest = store.manifest;
    const originalActiveId = store.activeId;
    try {
      store.manifest = {
        title: "Training coverage",
        items: [
          { id: "item-1", title: "One", slug: "one" },
          { id: "item-2", title: "Two", slug: "two" },
          { id: "item-3", title: "Three", slug: "three" },
        ],
      };
      store.activeId = "item-2";
      const el = await fixture(html`<training-theme></training-theme>`);
      // constructor autoruns mirror activeId, items, and grow maxIndex to the
      // deepest visited manifest index (1 here, item-2 of 0-based items)
      const mirrored = await waitFor(() => el.maxIndex === 1);
      expect(mirrored).to.be.true;
      expect(el.activeId).to.equal("item-2");
      await el.updateComplete;
      const buttons = el.shadowRoot.querySelectorAll("training-button");
      expect(buttons.length).to.equal(3);
      // the active item's button carries the active attribute
      expect(buttons[1].hasAttribute("active")).to.be.true;
      expect(buttons[0].hasAttribute("active")).to.be.false;
      // items beyond the visited maxIndex are locked out
      expect(buttons[2].hasAttribute("disabled")).to.be.true;
      expect(buttons[0].hasAttribute("disabled")).to.be.false;
      expect(buttons[1].hasAttribute("disabled")).to.be.false;
      // items at or before the deepest visited index count as visited
      expect(buttons[0].hasAttribute("visited")).to.be.true;
      expect(buttons[1].hasAttribute("visited")).to.be.true;
      expect(buttons[2].hasAttribute("visited")).to.be.false;
      // the progress ring reads 2 of 3 pages viewed
      const progress = el.shadowRoot.querySelector(".progress");
      expect(progress.getAttribute("aria-valuenow")).to.equal("2");
      expect(progress.getAttribute("aria-valuemax")).to.equal("3");
      // titles flow from the manifest into the buttons
      expect(
        buttons[0].shadowRoot.querySelector("#title").textContent,
      ).to.equal("One");
    } finally {
      store.manifest = originalManifest;
      store.activeId = originalActiveId;
    }
  });
});

// BUG(training-theme.js:60-65) RESOLVED (round 8): the constructor autorun
// read store.manifest.items without a null guard. With a null manifest
// (before CMS boot / after teardown) the reaction threw
// "TypeError: Cannot read properties of null (reading 'items')", which mobx
// caught, logged, and then disposed the reaction — so the theme permanently
// stopped mirroring items (evidence: the baseline coverage run logged this
// mobx reaction failure twice). The autorun now guards
// store.manifest && store.manifest.items (defaulting to an empty array), so
// the reaction survives null manifests and keeps mirroring a manifest that
// arrives later.
describe("training-theme manifest guard (null manifest handled)", () => {
  it("constructor autorun survives a null manifest and keeps mirroring", async () => {
    const originalManifest = store.manifest;
    const originalActiveId = store.activeId;
    store.manifest = null;
    store.activeId = null;
    const errors = [];
    const originalError = console.error;
    console.error = (...args) => {
      errors.push(args.map(String).join(" "));
    };
    try {
      const el = await fixture(html`<training-theme></training-theme>`);
      await new Promise((resolve) => setTimeout(resolve, 150));
      const sawItemsTypeError = errors.some((entry) => {
        return entry.includes("reading 'items'");
      });
      // documents the fixed behavior; the guard keeps the reaction alive
      expect(sawItemsTypeError).to.be.false;
      expect(el.items.length).to.equal(0);
      // no outline means no progress ring to read
      expect(el.shadowRoot.querySelector(".progress")).to.not.exist;
      // the reaction is no longer disposed: a manifest appearing later is
      // still mirrored into items (previously the disposed reaction never
      // fired again)
      store.manifest = {
        title: "Late manifest",
        items: [{ id: "late-1", title: "Late", slug: "late" }],
      };
      const mirrored = await waitFor(() => el.items.length === 1);
      expect(mirrored).to.be.true;
      expect(el.items[0].title).to.equal("Late");
    } finally {
      console.error = originalError;
      store.manifest = originalManifest;
      store.activeId = originalActiveId;
    }
  });
});
