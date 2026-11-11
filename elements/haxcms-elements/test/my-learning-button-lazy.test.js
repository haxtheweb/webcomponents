import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
// Only the button: this file checks that the panel's code is not part of
// the button's eager download and arrives the first time a learner opens it.
// (my-learning-button.test.js imports the panel itself, so it cannot.)
import "../lib/ui-components/progress/my-learning-button.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const until = async (check, ms = 4000) => {
  const end = Date.now() + ms;
  while (!check()) {
    if (Date.now() > end) {
      throw new Error("timed out");
    }
    await flush(20);
  }
};
const deepActive = () => {
  let a = document.activeElement;
  while (a && a.shadowRoot && a.shadowRoot.activeElement) {
    a = a.shadowRoot.activeElement;
  }
  return a;
};
const MANIFEST = {
  id: "ml-lazy-site",
  title: "Orientation",
  metadata: { platform: {}, theme: { variables: {} }, site: { settings: {} } },
  items: [
    {
      id: "p1",
      title: "Introduction",
      slug: "p1",
      location: "pages/p1/index.html",
      parent: null,
      indent: 0,
      order: 0,
      metadata: {},
    },
  ],
};

describe("My learning button loads its panel on first use", () => {
  let saved;
  before(async () => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
      memory: UserScaffoldInstance._memoryAdapter,
      statements: UserScaffoldInstance._statementAdapter,
    };
    UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
    UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
    store.editMode = false;
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    LearnerProgress.start();
    store.activeId = "p1";
    await flush();
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    UserScaffoldInstance.setMemoryAdapter(saved.memory);
    UserScaffoldInstance.setStatementAdapter(saved.statements);
  });

  it("renders the button without loading the panel", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    expect(el.hasAttribute("hidden")).to.equal(false);
    expect(el.shadowRoot.querySelector("my-learning-panel")).to.exist;
    expect(globalThis.customElements.get("my-learning-panel")).to.equal(
      undefined,
    );
  });

  it("first click loads the panel, then opens it with focus inside", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    const b = el.shadowRoot.querySelector("#button");
    const panel = el.shadowRoot.querySelector("my-learning-panel");
    expect(globalThis.customElements.get("my-learning-panel")).to.equal(
      undefined,
    );
    b.focus();
    b.click();
    // never shown as an empty, undefined popover
    expect(panel.matches(":popover-open")).to.equal(false);
    await until(() => panel.matches(":popover-open"));
    expect(globalThis.customElements.get("my-learning-panel")).to.exist;
    expect(panel.matches(":defined")).to.equal(true);
    expect(b.getAttribute("aria-expanded")).to.equal("true");
    await until(
      () =>
        panel.contains(deepActive()) || panel.shadowRoot.contains(deepActive()),
    );
    // Escape closes and returns focus to the button, as before
    panel.hidePopover();
    await flush(60);
    expect(panel.matches(":popover-open")).to.equal(false);
    expect(el.shadowRoot.activeElement).to.equal(b);
  });

  it("once loaded, open() opens right away", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    const panel = el.shadowRoot.querySelector("my-learning-panel");
    el.open("site");
    expect(panel.matches(":popover-open")).to.equal(true);
    await panel.updateComplete;
    expect(panel.tab).to.equal("site");
    panel.hidePopover();
  });
});
