import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import "../lib/ui-components/progress/my-learning-button.js";
import {
  MyLearningLauncher,
  learnerItemKind,
  LEARNER_ITEM_ICONS,
} from "../lib/ui-components/progress/my-learning-panel.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import {
  activityKey,
  buildStatement,
  pageUrl,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import "@haxtheweb/multiple-choice/multiple-choice.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const page = (id, order, title, parent = null, metadata = {}) => ({
  id,
  title,
  slug: id,
  location: `pages/${id}/index.html`,
  parent,
  indent: parent ? 1 : 0,
  order,
  metadata,
});
const MANIFEST = {
  id: "ml-site",
  title: "Orientation",
  metadata: { platform: {}, theme: { variables: {} }, site: { settings: {} } },
  items: [
    page("p1", 0, "Introduction"),
    page("p2", 1, "Lesson 1", null, { icon: "icons:star" }),
    page("u1", 2, "Unit 1"),
    page("u1a", 0, "Lesson 2", "u1"),
    page("u1b", 1, "Lesson 3", "u1"),
    page("hid", 3, "Hidden", null, { hideInMenu: true }),
  ],
};

// what a question element sends after a check
function answer(el, objectKey, success, done) {
  el.dispatchEvent(
    new CustomEvent("user-engagement", {
      bubbles: true,
      composed: true,
      detail: {
        activityDisplay: "answered",
        objectName: objectKey,
        resultSuccess: success,
        statement: buildStatement({
          verb: "answered",
          object: {
            id: `${pageUrl()}#${objectKey}`,
            interactionType: "choice",
          },
          result: { success, completion: done, response: "x" },
          context: {
            extensions: { [XAPI_EXTENSIONS.element]: "multiple-choice" },
          },
        }),
      },
    }),
  );
}
function readPage(id) {
  LearnerProgress._reportReading("completed", 1, {
    id,
    url: new URL(id, document.baseURI).href,
    title: id,
    started: Date.now(),
  });
}
function readPart(id, share) {
  LearnerProgress._reportReading("progressed", share, {
    id,
    url: new URL(id, document.baseURI).href,
    title: id,
    started: Date.now(),
  });
}
async function goTo(id) {
  store.activeId = id;
  await flush();
}
// matchMedia that answers prefers-reduced-motion with on
function reduceMotion(on) {
  const real = globalThis.matchMedia;
  globalThis.matchMedia = (q) =>
    String(q).indexOf("prefers-reduced-motion") !== -1
      ? {
          matches: on,
          media: q,
          addEventListener() {},
          removeEventListener() {},
        }
      : real.call(globalThis, q);
  return () => {
    globalThis.matchMedia = real;
  };
}
const panelOf = (btn) => btn.shadowRoot.querySelector("my-learning-panel");
const deepActive = () => {
  let a = document.activeElement;
  while (a && a.shadowRoot && a.shadowRoot.activeElement) {
    a = a.shadowRoot.activeElement;
  }
  return a;
};

describe("My learning button and panel", () => {
  let saved;
  let host;
  before(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
      memory: UserScaffoldInstance._memoryAdapter,
      statements: UserScaffoldInstance._statementAdapter,
      launcher: MyLearningLauncher.open,
    };
  });
  beforeEach(async () => {
    UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
    UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
    store.editMode = false;
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    LearnerProgress.start();
    host = await fixture(
      html`<div id="content">
        <multiple-choice question="Where does each unit begin?">
          <input data-correct="true" value="With a short video" />
          <input value="With the unit exam" />
        </multiple-choice>
        <p style="height: 40px">Text</p>
        <multiple-choice question="Which unit is last?">
          <input data-correct="true" value="Unit 3" />
          <input value="Unit 1" />
        </multiple-choice>
      </div>`,
    );
    await goTo("p1");
    LearnerProgress.scanPage(host);
  });
  afterEach(() => {
    MyLearningLauncher.open = saved.launcher;
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    UserScaffoldInstance.setMemoryAdapter(saved.memory);
    UserScaffoldInstance.setStatementAdapter(saved.statements);
  });

  it("shows this page's percent with its label, name and hover text", async () => {
    readPart("p1", 0.5);
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    await el.updateComplete;
    const pp = LearnerProgress.pageProgress("p1");
    const pct = Math.round(pp.percent * 100);
    expect(pct).to.be.greaterThan(0);
    expect(el.hasAttribute("hidden")).to.equal(false);
    expect(el.percent).to.equal(pp.percent);
    const b = el.shadowRoot.querySelector("#button");
    expect(el.shadowRoot.querySelector(".label").textContent).to.equal(
      "My learning",
    );
    expect(el.shadowRoot.querySelector(".pct").textContent).to.equal(`${pct}%`);
    expect(b.getAttribute("aria-label")).to.equal(
      `My learning ${pct}% complete`,
    );
    expect(b.getAttribute("title")).to.equal(`My learning ${pct}% complete`);
    expect(b.getAttribute("aria-haspopup")).to.equal("dialog");
    expect(b.getAttribute("aria-expanded")).to.equal("false");
    const ring = b.querySelector(".ddd-ring");
    expect(ring.getAttribute("data-shown")).to.equal(String(pct));
    expect(
      ring.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("editor:insert-chart");
    // live: it follows the learner
    answer(host, "q-live", true, true);
    await flush(60);
    await el.updateComplete;
    expect(el.percent).to.equal(LearnerProgress.pageProgress("p1").percent);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("is hidden while editing", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    expect(el.hasAttribute("hidden")).to.equal(false);
    store.editMode = true;
    await flush(60);
    expect(el.hasAttribute("hidden")).to.equal(true);
    expect(getComputedStyle(el).display).to.equal("none");
    store.editMode = false;
    await flush(60);
    expect(el.hasAttribute("hidden")).to.equal(false);
  });

  it("opens the panel as a dialog, focuses its tab and Escape returns focus", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    const b = el.shadowRoot.querySelector("#button");
    b.focus();
    b.click();
    await flush(80);
    const panel = panelOf(el);
    expect(panel.matches(":popover-open")).to.equal(true);
    expect(b.getAttribute("aria-expanded")).to.equal("true");
    expect(
      panel.shadowRoot
        .querySelector('[role="dialog"]')
        .getAttribute("aria-labelledby"),
    ).to.equal("heading");
    expect(deepActive().id).to.equal("tab-page");
    deepActive().dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );
    await flush(80);
    expect(panel.matches(":popover-open")).to.equal(false);
    expect(b.getAttribute("aria-expanded")).to.equal("false");
    expect(deepActive()).to.equal(b);
    // the Close button too
    el.open();
    await flush(80);
    panel.shadowRoot.querySelector("#close").click();
    await flush(80);
    expect(panel.matches(":popover-open")).to.equal(false);
    expect(deepActive()).to.equal(b);
  });

  it("panel tabs: arrow keys, Home and End with a roving tabindex", async () => {
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    el.open();
    await flush(80);
    const panel = panelOf(el);
    const root = panel.shadowRoot;
    const tabPage = root.querySelector("#tab-page");
    const tabSite = root.querySelector("#tab-site");
    expect(root.querySelector('[role="tablist"]')).to.exist;
    expect(tabPage.getAttribute("aria-controls")).to.equal("pane-page");
    const key = (target, k) =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true }),
      );
    key(tabPage, "ArrowRight");
    await flush(40);
    expect(panel.tab).to.equal("site");
    expect(tabSite.getAttribute("aria-selected")).to.equal("true");
    expect(tabSite.getAttribute("tabindex")).to.equal("0");
    expect(tabPage.getAttribute("aria-selected")).to.equal("false");
    expect(tabPage.getAttribute("tabindex")).to.equal("-1");
    expect(root.querySelector("#pane-site").hidden).to.equal(false);
    expect(root.querySelector("#pane-page").hidden).to.equal(true);
    expect(root.activeElement).to.equal(tabSite);
    key(tabSite, "ArrowRight");
    await flush(40);
    expect(panel.tab).to.equal("page");
    expect(root.activeElement).to.equal(tabPage);
    key(tabPage, "End");
    await flush(40);
    expect(panel.tab).to.equal("site");
    key(tabSite, "Home");
    await flush(40);
    expect(panel.tab).to.equal("page");
    key(tabPage, "ArrowLeft");
    await flush(40);
    expect(panel.tab).to.equal("site");
    await expect(panel).shadowDom.to.be.accessible();
  });

  it("This page: one row per item; not done rows go to the item, done rows show a check", async () => {
    readPage("p1");
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    el.open();
    await flush(80);
    const root = panelOf(el).shadowRoot;
    const pp = LearnerProgress.pageProgress("p1");
    expect(root.querySelector("#pane-page .lp-summary").textContent).to.include(
      `${Math.round(pp.percent * 100)}% · ${pp.itemsDone} of ${pp.itemsTotal} done`,
    );
    const rows = root.querySelectorAll("#pane-page .lp-list > li");
    expect(rows.length).to.equal(3);
    // reading is done: a check, no button
    expect(rows[0].getAttribute("data-kind")).to.equal("reading");
    expect(rows[0].getAttribute("data-state")).to.equal("done");
    expect(rows[0].querySelector("button")).to.equal(null);
    expect(rows[0].querySelector(".lp-status").textContent).to.equal("Read");
    expect(
      rows[0].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    // the quizzes: named from the element, buttons with their type icon
    expect(rows[1].getAttribute("data-kind")).to.equal("quiz");
    const go = rows[1].querySelector("button.lp-go");
    expect(go).to.exist;
    expect(go.getAttribute("title")).to.equal(
      "Go to Where does each unit begin?",
    );
    expect(rows[1].querySelector(".lp-kind").textContent).to.equal("Quiz");
    expect(rows[1].querySelector(".lp-name").textContent).to.equal(
      "Where does each unit begin?",
    );
    expect(rows[1].querySelector(".lp-status").textContent).to.equal(
      "Not started",
    );
    expect(
      rows[1].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:help-outline");
    expect(rows[2].querySelector(".lp-name").textContent).to.equal(
      "Which unit is last?",
    );
    expect(rows[1].querySelector(".lp-arrow").getAttribute("icon")).to.equal(
      "icons:arrow-downward",
    );
  });

  it("rows follow the page order, engaged or not, with their status", async () => {
    const second = host.querySelectorAll("multiple-choice")[1];
    // the second quiz answered wrong: engaged first, listed second
    answer(second, encodeURIComponent(activityKey(second)), false, false);
    await flush(60);
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    el.open();
    await flush(80);
    const rows = panelOf(el).shadowRoot.querySelectorAll(
      "#pane-page .lp-list > li",
    );
    expect(
      Array.from(rows).map((r) => r.querySelector(".lp-name").textContent),
    ).to.deep.equal([
      "Introduction",
      "Where does each unit begin?",
      "Which unit is last?",
    ]);
    expect(rows[2].querySelector(".lp-status").textContent).to.equal(
      "Incorrect",
    );
    expect(rows[1].querySelector(".lp-status").textContent).to.equal(
      "Not started",
    );
  });

  it("a row takes the learner to the item: scrolls, focuses its header, outlines it", async () => {
    const restore = reduceMotion(true);
    try {
      const el = await fixture(html`<my-learning-button></my-learning-button>`);
      await flush(60);
      el.open();
      await flush(80);
      const panel = panelOf(el);
      const target = host.querySelectorAll("multiple-choice")[1];
      let scrolled = null;
      target.scrollIntoView = (o) => {
        scrolled = o;
      };
      let closed = null;
      panel.addEventListener("my-learning-panel-close", (e) => {
        closed = e.detail;
      });
      const rows = panel.shadowRoot.querySelectorAll("#pane-page .lp-go");
      // reading first, then the two quizzes
      rows[2].click();
      await flush(80);
      expect(closed).to.deep.equal({ returnFocus: false });
      expect(panel.matches(":popover-open")).to.equal(false);
      // reduced motion: no smooth scrolling
      expect(scrolled).to.deep.equal({ behavior: "auto", block: "center" });
      const header = target.shadowRoot.querySelector(".ddd-block-header");
      expect(target.shadowRoot.activeElement).to.equal(header);
      expect(target.hasAttribute("data-my-learning-jump")).to.equal(true);
      expect(document.getElementById("my-learning-jump-style")).to.exist;
    } finally {
      restore();
    }
  });

  it("All pages: the site ring, pages done and each top level page with its icon", async () => {
    readPage("p1");
    host.innerHTML = "";
    LearnerProgress.scanPage(host);
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    el.open("site");
    await flush(80);
    const root = panelOf(el).shadowRoot;
    const sp = LearnerProgress.siteProgress();
    expect(sp.total).to.equal(5);
    const summary = root.querySelector("#pane-site .lop-summary");
    expect(summary.textContent).to.include(`${sp.done} of 5 pages done`);
    expect(summary.querySelector(".ddd-ring").textContent).to.include(
      `${Math.round(sp.percent * 100)}%`,
    );
    const rows = root.querySelectorAll("#pane-site .lop-list > li");
    // top level, visible: Introduction, Lesson 1, Unit 1
    expect(
      Array.from(rows).map((r) => r.getAttribute("data-id")),
    ).to.deep.equal(["p1", "p2", "u1"]);
    expect(rows[0].querySelector(".lop-pct").textContent).to.equal("100%");
    expect(
      rows[0].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    expect(
      rows[1].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:star");
    expect(
      rows[2].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:folder-open");
    expect(rows[2].querySelector(".lop-meta").textContent).to.equal("3 pages");
    expect(rows[2].querySelector(".lop-pct").textContent).to.equal("0%");
    // rows are links to their page, percent in the name and hover text
    const go = rows[2].querySelector("a.lop-go");
    expect(go.getAttribute("title")).to.equal("Unit 1, 0% complete");
    expect(go.querySelector(".lop-sr").textContent).to.equal(", 0% complete");
  });

  it("Open My learning opens the full dialog for the whole site", async () => {
    const calls = [];
    MyLearningLauncher.open = async (origin, options) => {
      calls.push({ origin, options });
    };
    const el = await fixture(html`<my-learning-button></my-learning-button>`);
    await flush(60);
    el.open();
    await flush(80);
    const panel = panelOf(el);
    expect(panel.shadowRoot.querySelector(".lp-foot p").textContent).to.include(
      "Saved on this device only.",
    );
    panel.shadowRoot.querySelector("#open").click();
    await flush(60);
    expect(calls.length).to.equal(1);
    expect(calls[0].origin).to.equal(el);
    expect(calls[0].options).to.deep.equal({
      title: "My learning",
      scope: "site",
    });
    expect(panel.matches(":popover-open")).to.equal(false);
  });

  it("bursts once when the page reaches 100%, never when it was already done", async () => {
    const restore = reduceMotion(false);
    try {
      host.innerHTML = `<multiple-choice></multiple-choice>`;
      LearnerProgress.scanPage(host);
      const el = await fixture(html`<my-learning-button></my-learning-button>`);
      await flush(60);
      let played = 0;
      const mo = new MutationObserver(() => {
        if (el.shadowRoot.querySelector("[data-ddd-celebrate]")) {
          played++;
        }
      });
      mo.observe(el.shadowRoot, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-ddd-celebrate"],
      });
      // a wrong answer: no burst
      answer(host, "q-one", false, false);
      await flush(80);
      expect(played).to.equal(0);
      answer(host, "q-one", true, true);
      readPage("p1");
      await flush(80);
      await el.updateComplete;
      expect(el.percent).to.equal(1);
      expect(played).to.equal(1);
      const ring = el.shadowRoot.querySelector("#button .ddd-ring");
      expect(ring.getAttribute("data-state")).to.equal("done");
      expect(
        ring
          .querySelector(".ddd-ring-glyph simple-icon-lite")
          .getAttribute("icon"),
      ).to.equal("icons:check");
      expect(
        el.shadowRoot.querySelector("#button").getAttribute("aria-label"),
      ).to.equal("My learning 100%, Complete");
      mo.disconnect();
      // leave and come back: done, no burst
      await goTo("p2");
      await goTo("p1");
      const again = await fixture(
        html`<my-learning-button></my-learning-button>`,
      );
      await flush(80);
      expect(again.percent).to.equal(1);
      expect(again.shadowRoot.querySelector("[data-ddd-celebrate]")).to.equal(
        null,
      );
    } finally {
      restore();
    }
  });

  it("reduced motion: the ring moves in 25% steps and done shows without a burst", async () => {
    const restore = reduceMotion(true);
    try {
      host.innerHTML = `<multiple-choice></multiple-choice>`;
      LearnerProgress.scanPage(host);
      readPart("p1", 0.6);
      const el = await fixture(html`<my-learning-button></my-learning-button>`);
      await flush(60);
      const pct = Math.round(el.percent * 100);
      const ring = el.shadowRoot.querySelector("#button .ddd-ring");
      expect(ring.getAttribute("data-shown")).to.equal(
        String(Math.floor(pct / 25) * 25),
      );
      // the words keep the real percent
      expect(el.shadowRoot.querySelector(".pct").textContent).to.equal(
        `${pct}%`,
      );
      answer(host, "q-one", true, true);
      readPage("p1");
      await flush(80);
      expect(el.percent).to.equal(1);
      expect(el.shadowRoot.querySelector("[data-ddd-celebrate]")).to.equal(
        null,
      );
    } finally {
      restore();
    }
  });

  it("types of items get their own icon and label", () => {
    expect(learnerItemKind({ kind: "reading", tag: "haxcms-page" })).to.equal(
      "reading",
    );
    expect(learnerItemKind({ kind: "activity", tag: "video-player" })).to.equal(
      "video",
    );
    expect(
      learnerItemKind({ kind: "activity", tag: "a11y-collapse" }),
    ).to.equal("collapse");
    expect(
      learnerItemKind({ kind: "activity", tag: "multiple-choice" }),
    ).to.equal("quiz");
    expect(learnerItemKind({ kind: "activity", tag: "" })).to.equal("activity");
    const icons = Object.values(LEARNER_ITEM_ICONS);
    expect(new Set(icons).size).to.equal(icons.length);
    expect(LEARNER_ITEM_ICONS.video).to.equal("av:play-arrow");
    expect(LEARNER_ITEM_ICONS.collapse).to.equal("icons:expand-more");
  });
});
