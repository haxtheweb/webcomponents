import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { LitElement } from "lit";
import { store } from "../lib/core/haxcms-site-store.js";
import {
  LessonViewMixin,
  lessonRootId,
  lessonPages,
  demoteHeadings,
  lessonViewStyles,
} from "../lib/core/utils/LessonViewMixin.js";

// Covers the lesson helpers (which pages make a lesson, heading demotion),
// the button's states for readers and logged-in users, stacking a lesson's
// pages into the theme, clearing them on login, and the print hook.

class LessonHost extends LessonViewMixin(LitElement) {
  render() {
    return html`${this.LessonViewButton()}`;
  }
}
if (!globalThis.customElements.get("lesson-view-test-host")) {
  globalThis.customElements.define("lesson-view-test-host", LessonHost);
}

class PrintBase extends LitElement {
  printBranchRootId() {
    return "from-print-mixin";
  }
}
class PrintHost extends LessonViewMixin(PrintBase) {}
if (!globalThis.customElements.get("lesson-view-print-host")) {
  globalThis.customElements.define("lesson-view-print-host", PrintHost);
}

function item(id, parent, order, extra = {}) {
  return {
    id,
    title: extra.title || id,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent: parent ? 1 : 0,
    metadata: Object.assign({ published: true }, extra.metadata || {}),
  };
}

const ITEMS = [
  item("intro", null, 0),
  item("lesson-3", null, 1, { title: "Lesson 3" }),
  item("formal", "lesson-3", 0, { title: "Formal Styles" }),
  item("layout", "lesson-3", 1, { title: "Layout and Elevation" }),
  item("draft", "lesson-3", 2, { metadata: { published: false } }),
  item("redirect", "lesson-3", 3, {
    metadata: { linkUrl: "https://example.com" },
  }),
  item("lesson-4", null, 2),
];

const BODIES = {
  formal: "<h2>Formal Vocabulary</h2><p>Shape and line.</p>",
  layout: "<p>Alignment.</p><h3>Grids</h3>",
};

describe("LessonViewMixin helpers", () => {
  it("finds the lesson for a page inside it and for the lesson page", () => {
    expect(lessonRootId(ITEMS, "formal")).to.equal("lesson-3");
    expect(lessonRootId(ITEMS, "lesson-3")).to.equal("lesson-3");
  });

  it("returns null for a page that is not part of a lesson", () => {
    expect(lessonRootId(ITEMS, "intro")).to.equal(null);
    expect(lessonRootId(ITEMS, "missing")).to.equal(null);
    expect(lessonRootId(null, "formal")).to.equal(null);
  });

  it("lists the lesson in outline order and skips unpublished and link pages", () => {
    const ids = lessonPages(ITEMS, "lesson-3").map((p) => p.id);
    expect(ids).to.deep.equal(["lesson-3", "formal", "layout"]);
  });

  it("never treats a unit as a lesson", () => {
    const course = [
      item("unit-1", null, 0),
      item("lesson-1", "unit-1", 0),
      item("lesson-2", "unit-1", 1),
      item("page-a", "lesson-2", 0),
      item("page-b", "lesson-2", 1),
    ];
    // the unit's children have pages of their own
    expect(lessonRootId(course, "unit-1")).to.equal(null);
    // a lesson with no pages under a unit is not part of a lesson
    expect(lessonRootId(course, "lesson-1")).to.equal(null);
    expect(lessonRootId(course, "lesson-2")).to.equal("lesson-2");
    expect(lessonRootId(course, "page-b")).to.equal("lesson-2");
  });

  it("moves headings down one level and keeps h6", () => {
    const frag = document
      .createRange()
      .createContextualFragment(
        '<h1 id="a">One</h1><h2 class="b">Two</h2><h6>Six</h6>',
      );
    demoteHeadings(frag);
    const tags = Array.from(frag.children).map((el) => el.tagName);
    expect(tags).to.deep.equal(["H2", "H3", "H6"]);
    expect(frag.querySelector("h2").id).to.equal("a");
    expect(frag.querySelector("h3").className).to.equal("b");
  });

  it("writes no styles for an unsafe tag", () => {
    expect(lessonViewStyles("not a tag{}").cssText).to.equal("");
    expect(lessonViewStyles("clean-one").cssText).to.contain(
      "clean-one > hgroup[data-lesson-view-marker]",
    );
  });
});

describe("LessonViewMixin", () => {
  let saved;

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      jwt: store.jwt,
      editMode: store.editMode,
      loadItemContent: store.loadItemContent,
    };
    try {
      globalThis.localStorage.removeItem("haxcms-lesson-view");
    } catch {
      // storage unavailable
    }
    store.jwt = null;
    store.editMode = false;
    store.manifest = {
      id: "lesson-site",
      title: "Lesson site",
      metadata: {
        site: { name: "lesson-site", lang: "en" },
        platform: {},
        theme: { element: "test-theme", variables: {}, regions: {} },
      },
      items: JSON.parse(JSON.stringify(ITEMS)),
    };
    store.activeId = "lesson-3";
    store.loadItemContent = async (id) => BODIES[id] || "";
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.jwt = saved.jwt;
    store.editMode = saved.editMode;
    store.loadItemContent = saved.loadItemContent;
    try {
      globalThis.localStorage.removeItem("haxcms-lesson-view");
    } catch {
      // storage unavailable
    }
  });

  it("offers the whole lesson to a reader", async () => {
    const el = await fixture(
      html`<lesson-view-test-host></lesson-view-test-host>`,
    );
    const btn = el.shadowRoot.querySelector("#lesson-view-btn");
    expect(btn).to.exist;
    expect(btn.getAttribute("aria-disabled")).to.equal("false");
    expect(btn.label).to.equal(el.t.showWholeLesson);
  });

  it("renders nothing on a page outside a lesson", async () => {
    store.activeId = "intro";
    const el = await fixture(
      html`<lesson-view-test-host></lesson-view-test-host>`,
    );
    expect(el.shadowRoot.querySelector("#lesson-view-btn")).to.equal(null);
  });

  it("greys the button out for a logged-in user and ignores clicks", async () => {
    store.jwt = "test-token";
    const el = await fixture(
      html`<lesson-view-test-host></lesson-view-test-host>`,
    );
    const btn = el.shadowRoot.querySelector("#lesson-view-btn");
    expect(btn.getAttribute("aria-disabled")).to.equal("true");
    expect(btn.label).to.equal(el.t.wholeLessonForReaders);
    el.toggleLessonView();
    expect(el.lessonView).to.equal("page");
    expect(el.querySelectorAll("[data-lesson-view]").length).to.equal(0);
  });

  it("stacks the lesson's pages after the lesson page", async () => {
    const el = await fixture(
      html`<lesson-view-test-host
        ><p>Lesson page body</p></lesson-view-test-host
      >`,
    );
    el.toggleLessonView();
    expect(el.lessonView).to.equal("whole");
    await waitUntil(
      () =>
        el.querySelectorAll(":scope > hgroup[data-lesson-view-marker]")
          .length === 2,
      "pages were not stacked",
    );
    const markers = el.querySelectorAll(
      ":scope > hgroup[data-lesson-view-marker]",
    );
    expect(markers[0].querySelector("[data-eyebrow]").textContent).to.equal(
      "Page 2 of 3",
    );
    expect(markers[0].querySelector("h2").textContent).to.equal(
      "Formal Styles",
    );
    // the page's own h2 sits under the page title as an h3
    const formal = el.querySelectorAll(':scope > [data-lesson-view="formal"]');
    expect(formal[1].tagName).to.equal("H3");
    expect(formal[1].textContent).to.equal("Formal Vocabulary");
    // the lesson page's own content stays first and unmarked
    expect(el.firstElementChild.hasAttribute("data-lesson-view")).to.equal(
      false,
    );
    // print follows the lesson
    expect(el.printBranchRootId()).to.equal("lesson-3");
  });

  it("removes the stacked pages as soon as someone logs in", async () => {
    const el = await fixture(
      html`<lesson-view-test-host
        ><p>Lesson page body</p></lesson-view-test-host
      >`,
    );
    el.toggleLessonView();
    await waitUntil(() => el.querySelectorAll("[data-lesson-view]").length > 0);
    store.jwt = "test-token";
    expect(el.querySelectorAll("[data-lesson-view]").length).to.equal(0);
    expect(el.lessonViewActive()).to.equal(false);
    // only the lesson page's own content is left
    expect(el.children.length).to.equal(1);
  });

  it("goes back to one page at a time, on the page being read", async () => {
    const el = await fixture(
      html`<lesson-view-test-host
        ><p>Lesson page body</p></lesson-view-test-host
      >`,
    );
    el.toggleLessonView();
    await waitUntil(() => el.querySelectorAll("[data-lesson-view]").length > 0);
    // keep the test runner's own URL; record where the reader would go
    let wentTo = null;
    el._lessonViewGo = (id) => {
      wentTo = id;
    };
    el._lessonViewReadingIndex = () => 1;
    el.toggleLessonView();
    expect(el.lessonView).to.equal("page");
    expect(el.querySelectorAll("[data-lesson-view]").length).to.equal(0);
    expect(wentTo).to.equal("layout");
  });

  it("moves next and previous between the stacked pages", async () => {
    const el = await fixture(
      html`<lesson-view-test-host
        ><p>Lesson page body</p></lesson-view-test-host
      >`,
    );
    el.toggleLessonView();
    await waitUntil(
      () =>
        el.querySelectorAll(":scope > hgroup[data-lesson-view-marker]")
          .length === 2,
    );
    const scrolledTo = [];
    el._lessonViewScrollTo = (target) => {
      scrolledTo.push(target.getAttribute("data-lesson-view-marker"));
    };
    let leftLesson = false;
    el._lessonViewGoAfterLesson = () => {
      leftLesson = true;
    };
    const click = (type, reading) => {
      el._lessonViewReadingIndex = () => reading;
      const button = document.createElement("site-menu-button");
      button.setAttribute("type", type);
      const event = new MouseEvent("click", {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      Object.defineProperty(event, "composedPath", {
        value: () => [button, el],
      });
      el.__lessonViewNavClick(event);
      return event.defaultPrevented;
    };
    expect(click("next", -1)).to.equal(true);
    expect(click("next", 0)).to.equal(true);
    expect(click("prev", 1)).to.equal(true);
    expect(scrolledTo).to.deep.equal(["formal", "layout", "formal"]);
    // next from the last stacked page leaves the lesson
    expect(click("next", 1)).to.equal(true);
    expect(leftLesson).to.equal(true);
    // previous from the lesson page's own content is the normal previous
    expect(click("prev", -1)).to.equal(false);
  });

  it("leaves Print page to PrintBranchMixin outside whole-lesson view", async () => {
    const el = await fixture(
      html`<lesson-view-print-host></lesson-view-print-host>`,
    );
    expect(el.printBranchRootId()).to.equal("from-print-mixin");
  });
});
