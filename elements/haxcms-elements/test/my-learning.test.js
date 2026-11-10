import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import {
  activityKeyOfId,
  activityKindOf,
  goToActivity,
  mapModel,
  MyLearningNavigation,
  outlineInOrder,
  pageListModel,
  pickConceptSource,
  radarAxes,
  scopePages,
  sitePageUrl,
  statementsFileName,
} from "../lib/ui-components/progress/my-learning.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import {
  activityKey,
  siteUrl,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

const SITE = "ml-site";
const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const item = (id, parent, order, title, tags = "") => ({
  id,
  parent,
  order,
  title,
  slug: id,
  location: `pages/${id}/index.html`,
  indent: 0,
  metadata: { tags },
});
// ch1 (p1, p2 > p2a), ch2 (p3), lab (q1..q4)
const ITEMS = [
  item("ch2", null, 1, "Chapter 2"),
  item("ch1", null, 0, "Chapter 1"),
  item("p2", "ch1", 1, "Energy", "waves"),
  item("p1", "ch1", 0, "Waves 101", "waves, intro"),
  item("p2a", "p2", 0, "Energy deep dive", "waves"),
  item("p3", "ch2", 0, "Sound", "sound"),
  item("hidden", "ch2", 1, "Hidden"),
];
ITEMS[6].metadata.hideInMenu = true;
const MANIFEST = {
  id: SITE,
  title: "Physics 010",
  metadata: {
    platform: {},
    theme: { variables: {} },
    site: { name: "physics-010", settings: {} },
  },
  items: ITEMS,
};
let n = 0;
const stmt = (objectId, verb, result, tag, extra = {}) => ({
  id: `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`,
  verb: {
    id: `http://adlnet.gov/expapi/verbs/${verb}`,
    display: { "en-US": verb },
  },
  object: {
    id: objectId,
    objectType: "Activity",
    definition: {
      name: { "en-US": extra.name || objectId },
      ...(extra.description
        ? { description: { "en-US": extra.description } }
        : {}),
    },
  },
  result,
  context: {
    contextActivities: {
      parent: [
        {
          id: "https://example.com/page",
          definition: { name: { "en-US": extra.page || "Waves 101" } },
        },
      ],
    },
    extensions: { [XAPI_EXTENSIONS.element]: tag },
  },
  timestamp: new Date(Date.now() - 1000 + n).toISOString(),
});
const record = (page, id, verb, result, tag, extra) =>
  UserScaffoldInstance.recordStatement(
    SITE,
    stmt(id, verb, result, tag, extra),
    {
      page,
      tag,
      trackable: tag !== "haxcms-page",
      reading: tag === "haxcms-page",
    },
  );
// the learner scrolled through the page (haxtheweb/issues#3269): a page is
// only done once read
const read = (page) =>
  record(
    page,
    `page-${page}`,
    "completed",
    {
      completion: true,
      extensions: { [XAPI_EXTENSIONS.progress]: 1 },
    },
    "haxcms-page",
  );
const answer = (page, id, success, attempts = 1, tag = "multiple-choice") =>
  record(
    page,
    id,
    "answered",
    {
      success,
      completion: success,
      extensions: { [XAPI_EXTENSIONS.attempts]: attempts },
    },
    tag,
  );
const visit = (page, trackable = 0, byTag = {}) => {
  UserScaffoldInstance.recordPageVisit(SITE, page, {});
  UserScaffoldInstance.setPageTrackable(SITE, page, trackable, byTag);
};

describe("my-learning helpers", () => {
  it("orders the outline and leaves out hidden pages", () => {
    expect(outlineInOrder(ITEMS).map((i) => i.id)).to.deep.equal([
      "ch1",
      "p1",
      "p2",
      "p2a",
      "ch2",
      "p3",
    ]);
  });
  it("resolves each scope relative to a page", () => {
    const ids = (scope, page) => scopePages(ITEMS, scope, page).pages;
    expect(ids("page", "p2")).to.deep.equal(["p2"]);
    // parent: the parent and its direct children
    expect(ids("parent", "p2a")).to.deep.equal(["p2", "p2a"]);
    expect(ids("parent", "p1")).to.deep.equal(["ch1", "p1", "p2"]);
    // branch: the parent and everything under it
    expect(ids("branch", "p1")).to.deep.equal(["ch1", "p1", "p2", "p2a"]);
    expect(scopePages(ITEMS, "branch", "p1").root).to.equal("ch1");
    // a top level page is its own parent
    expect(ids("branch", "ch2")).to.deep.equal(["ch2", "p3"]);
    // children: everything below the page
    expect(ids("children", "ch1")).to.deep.equal(["p1", "p2", "p2a"]);
    expect(ids("site", "p1")).to.deep.equal([
      "ch1",
      "p1",
      "p2",
      "p2a",
      "ch2",
      "p3",
    ]);
    // an unknown page or scope falls back to the site
    expect(scopePages(ITEMS, "branch", "nope").scope).to.equal("site");
    expect(scopePages(ITEMS, "weird", "p1").scope).to.equal("site");
  });
  it("names activity kinds from the vocabulary", () => {
    expect(activityKindOf("haxcms-page")).to.equal("pages");
    expect(activityKindOf("multiple-choice")).to.equal("questions");
    expect(activityKindOf("video-player")).to.equal("videos");
    expect(activityKindOf("audio-player")).to.equal("audio");
    expect(activityKindOf("bullet-check-list")).to.equal("checklists");
    expect(activityKindOf("concept-map-game")).to.equal("games");
    expect(activityKindOf("flash-card")).to.equal("cards");
    expect(activityKindOf("__proto__")).to.equal("other");
  });
  it("makes a safe download file name", () => {
    expect(statementsFileName("Physics 010!")).to.equal(
      "physics-010-xapi-statements.json",
    );
    expect(statementsFileName("../../x")).to.equal("x-xapi-statements.json");
    expect(statementsFileName("")).to.equal("site-xapi-statements.json");
  });
});

describe("my-learning dashboard", () => {
  let saved;
  before(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
      memory: UserScaffoldInstance._memoryAdapter,
      statements: UserScaffoldInstance._statementAdapter,
    };
  });
  beforeEach(async () => {
    UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
    UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
    store.editMode = true; // no automatic page visits while setting up
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
  const make = async (markup) => {
    const el = await fixture(markup);
    await el.refresh();
    await el.updateComplete;
    return el;
  };
  const seed = () => {
    visit("p1", 2, { "multiple-choice": 1, "video-player": 1 });
    visit("p2", 2, { "multiple-choice": 1, "bullet-check-list": 1 });
    visit("p3", 1, { "concept-map-game": 1 });
    record("p1", "page-p1", "experienced", {}, "haxcms-page", {
      name: "Waves 101",
    });
    // p1 and p3 read through (the oldest records of the seed)
    read("p1");
    read("p3");
    answer("p1", "q1", true); // right first time
    record("p1", "v1", "completed", { completion: true }, "video-player", {
      name: "Wave on a slinky",
    });
    answer("p2", "q2", false); // wrong, then right
    answer("p2", "q2", true, 2);
    record(
      "p2",
      "c1",
      "progressed",
      { score: { raw: 1, max: 3 } },
      "bullet-check-list",
      { name: "Before the lab", page: "Energy" },
    );
    record("p3", "g1", "completed", { completion: true }, "concept-map-game");
  };
  const text = (el, sel) =>
    el.shadowRoot.querySelector(sel).textContent.replace(/\s+/g, " ").trim();

  it("shows the empty state before anything is recorded", async () => {
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    expect(text(el, ".empty")).to.equal(
      "Nothing recorded yet. Answer a question or watch a video and it shows up here.",
    );
    expect(el.shadowRoot.querySelector(".tiles")).to.equal(null);
    expect(el.shadowRoot.querySelector("#download").disabled).to.equal(true);
  });

  it("fills the tiles for the whole site", async () => {
    seed();
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const tiles = [...el.shadowRoot.querySelectorAll(".tile")].map((t) =>
      t.textContent.replace(/\s+/g, " ").trim(),
    );
    // p1 (q1 + video) and p3 (game) are done; ch1, p2, p2a, ch2 not
    // pages read 3 of 6, 2 of them done (p1: q1 + video, p3: game)
    expect(tiles[0]).to.contain("Pages read");
    expect(tiles[0]).to.contain("3 / 6");
    expect(tiles[0]).to.contain("2 done");
    // 4 of 5 trackable activities done (checklist in progress)
    expect(tiles[1]).to.contain("4 / 5");
    expect(tiles[1]).to.contain("1 in progress");
    // q1 right first time, q2 not: 50%
    expect(tiles[2]).to.contain("50%");
    expect(tiles[2]).to.contain("2 questions answered");
    expect(tiles[3]).to.contain("3");
  });

  it("limits everything to the branch it sits in", async () => {
    seed();
    store.activeId = "p2";
    const el = await make(html`<my-learning></my-learning>`);
    expect(el.scope).to.equal("branch");
    expect(text(el, ".ddd-block-title")).to.equal("Chapter 1");
    const pages = () =>
      [...el.shadowRoot.querySelectorAll(".pages li")].map((li) =>
        li.getAttribute("data-page"),
      );
    // started pages only: in progress before done
    expect(pages()).to.deep.equal(["p2", "p1"]);
    el.shadowRoot.querySelector("#all-pages").click();
    await el.updateComplete;
    expect(pages()).to.deep.equal(["ch1", "p1", "p2", "p2a"]);
    expect(el._data.tiles.activitiesDone).to.equal(3);
    el.scope = "children";
    store.activeId = "ch2";
    await el.refresh();
    await el.updateComplete;
    expect(el._data.pageRows.map((p) => p.id)).to.deep.equal(["p3"]);
    expect(el._data.tiles.activitiesDone).to.equal(1);
    el.scope = "parent";
    store.activeId = "p2a";
    await el.refresh();
    expect(el._data.pageRows.map((p) => p.id)).to.deep.equal(["p2", "p2a"]);
  });

  it("writes page states as text next to the marks", async () => {
    seed();
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    // not started pages are behind "Show all"
    expect(el.shadowRoot.querySelector('.pages li[data-page="ch1"]')).to.equal(
      null,
    );
    el.shadowRoot.querySelector("#all-pages").click();
    await el.updateComplete;
    const row = (id) =>
      el.shadowRoot
        .querySelector(`.pages li[data-page="${id}"]`)
        .textContent.replace(/\s+/g, " ")
        .trim();
    expect(row("p1")).to.contain("Done · 2 / 2");
    expect(row("p2")).to.contain("In progress · 1 / 2");
    expect(row("ch1")).to.contain("Not started");
  });

  it("groups by tags, sections, activity and element", async () => {
    seed();
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const labels = () => el._data.groups.map((g) => g.label);
    const radios = () =>
      el.shadowRoot.querySelectorAll('input[name="group-by"]');
    const pick = async (v) => {
      [...radios()].find((r) => r.value === v).click();
      await el.updateComplete;
    };
    expect([...radios()].map((r) => r.value)).to.deep.equal([
      "concepts",
      "tags",
      "sections",
      "activity",
      "element",
      "map",
    ]);
    // Concepts by default: this site has tags, so they are the concepts
    expect(radios()[0].checked).to.equal(true);
    expect(el._data.conceptSource).to.equal("tags");
    expect(labels()).to.deep.equal(["intro", "sound", "waves"]);
    await pick("tags");
    // Untagged (ch1, ch2: nothing visited, nothing to do) is left out
    expect(labels()).to.deep.equal(["intro", "sound", "waves"]);
    const waves = el._data.groups.find((g) => g.key === "waves");
    expect(waves.done).to.equal(3);
    expect(waves.total).to.equal(4);
    await pick("sections");
    await el.updateComplete;
    expect(el._data.view).to.equal("sections");
    expect(labels()).to.deep.equal(["Chapter 1", "Chapter 2"]);
    await pick("activity");
    expect(labels()).to.deep.equal([
      "Pages read",
      "Videos watched",
      "Questions answered",
      "Checklists finished",
      "Games completed",
    ]);
    const pagesRead = el._data.groups[0];
    expect([pagesRead.done, pagesRead.total]).to.deep.equal([3, 6]);
    expect(el.chartType).to.equal("bars");
    const bar = el.shadowRoot.querySelector(".bars li");
    expect(bar.textContent.replace(/\s+/g, " ")).to.contain("3 / 6");
    // the chart shows the Activity view itself: no second copy below
    expect(el.shadowRoot.querySelector(".panel.activity")).to.equal(null);
    await pick("element");
    expect(el._data.groups.map((g) => g.key)).to.include("multiple-choice");
    expect(el._data.groups.map((g) => g.key)).to.not.include("haxcms-page");
    // a data table for the bars
    expect(
      el.shadowRoot.querySelectorAll(".chart details table tbody tr").length,
    ).to.equal(el._data.groups.length);
    // and the Activity view under it
    expect(text(el, ".panel.activity h3")).to.equal("Progress by activity");
  });

  it("draws a radar for 3 to 8 groups and bars otherwise", async () => {
    seed();
    const el = await make(
      html`<my-learning scope="site" view="tags"></my-learning>`,
    );
    expect(el.chartType).to.equal("radar");
    const svgEl = el.shadowRoot.querySelector(".radar svg");
    expect(svgEl.dataset.axes).to.equal("3");
    // sound has nothing to answer: the radar shows how much is done
    expect(el._data.metric).to.equal("done");
    expect(text(el, "#chart-title")).to.equal("Progress by tag");
    const names = [...svgEl.querySelectorAll("text.radar-label")].map((t) =>
      t.textContent.trim(),
    );
    expect(names).to.deep.equal(["intro", "sound", "waves"]);
    // the numbers in words, in axis order: no first try without answers
    const key = [...el.shadowRoot.querySelectorAll(".radar-key li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(key).to.deep.equal([
      "intro 100% first try · 100% done",
      "sound 100% done",
      "waves 50% first try · 75% done",
    ]);
    // the learner's shape and the goal ring, named in the legend
    expect(svgEl.querySelector(".radar-score")).to.not.equal(null);
    expect(svgEl.querySelector(".radar-goal")).to.not.equal(null);
    expect(text(el, ".radar-legend")).to.equal("You Goal 85%");
    el.goal = 0;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".radar-goal")).to.equal(null);
    expect(text(el, ".radar-legend")).to.equal("You");
    // two sections: too few for a radar
    el.view = "sections";
    await el.updateComplete;
    await el.refresh();
    await el.updateComplete;
    expect(el.chartType).to.equal("bars");
    expect(el.shadowRoot.querySelector(".radar")).to.equal(null);
    expect(el.shadowRoot.querySelector(".chart .bars")).to.not.equal(null);
  });

  it("puts the radar beside the pages when wide, one column when narrow", async () => {
    seed();
    const columns = (el) =>
      getComputedStyle(el.shadowRoot.querySelector(".row.top"))
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
    const wide = await make(
      html`<my-learning
        scope="site"
        recent
        preferences
        style="width: 1100px"
      ></my-learning>`,
    );
    await flush(80);
    await wide.updateComplete;
    expect(wide.shadowRoot.querySelector(".body").dataset.layout).to.equal(
      "wide",
    );
    const top = wide.shadowRoot.querySelector(".row.top");
    expect(top.classList.contains("pair")).to.equal(true);
    // radar card, then pages; the Activity view; recent beside preferences
    expect([...top.children].map((c) => c.getAttribute("part"))).to.deep.equal([
      "chart",
      "pages",
    ]);
    expect(columns(wide)).to.equal(2);
    const radarWidth = top.children[0].getBoundingClientRect().width;
    expect(radarWidth).to.be.within(260, 320);
    expect(
      [...wide.shadowRoot.querySelector(".body").children]
        .map((c) => c.className.trim())
        .filter((c) => c !== "status"),
    ).to.deep.equal([
      "tiles",
      "panel outline-card",
      "row top pair",
      "panel activity",
      "row bottom pair",
    ]);
    const narrow = await make(
      html`<my-learning scope="site" style="width: 400px"></my-learning>`,
    );
    await flush(80);
    await narrow.updateComplete;
    expect(narrow.shadowRoot.querySelector(".body").dataset.layout).to.equal(
      "narrow",
    );
    expect(columns(narrow)).to.equal(1);
    // the radar still fits its card
    expect(narrow.chartType).to.equal("radar");
    // the map takes the whole row
    narrow.style.width = "1100px";
    await flush(80);
    [...narrow.shadowRoot.querySelectorAll('input[name="group-by"]')]
      .find((r) => r.value === "map")
      .click();
    await narrow.updateComplete;
    expect(narrow.shadowRoot.querySelector(".body").dataset.layout).to.equal(
      "wide",
    );
    expect(
      narrow.shadowRoot.querySelector(".row.top").classList.contains("single"),
    ).to.equal(true);
    expect(columns(narrow)).to.equal(1);
  });

  it("starts in the view it was given", async () => {
    seed();
    const el = await make(
      html`<my-learning scope="site" view="element"></my-learning>`,
    );
    expect(el._data.view).to.equal("element");
    expect(
      el.shadowRoot.querySelector('input[value="element"]').checked,
    ).to.equal(true);
  });

  it("hides panels that are switched off and keeps false in markup", async () => {
    seed();
    const el = await make(
      html`<my-learning
        scope="site"
        tiles="false"
        chart="false"
      ></my-learning>`,
    );
    expect(el.tiles).to.equal(false);
    expect(el.shadowRoot.querySelector(".tiles")).to.equal(null);
    expect(el.shadowRoot.querySelector(".chart")).to.equal(null);
    expect(el.shadowRoot.querySelector(".pages")).to.not.equal(null);
    expect(el.shadowRoot.querySelector(".recent")).to.equal(null);
    el.pages = false;
    await el.updateComplete;
    expect(el.getAttribute("pages")).to.equal("false");
    el.pages = true;
    await el.updateComplete;
    expect(el.hasAttribute("pages")).to.equal(false);
  });

  it("lists recent activity and preferences in plain words", async () => {
    seed();
    UserScaffoldInstance.writePreference("darkMode", true);
    UserScaffoldInstance.writePreference("audioDescription", {
      a: true,
      b: true,
      c: false,
    });
    const el = await make(
      html`<my-learning scope="site" recent preferences></my-learning>`,
    );
    const items = [...el.shadowRoot.querySelectorAll(".recent li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    // 7 plus the two pages read through
    expect(items.length).to.equal(9);
    expect(items.join("|")).to.contain("Finished “page-p3”");
    // newest first
    expect(items[0]).to.contain("Finished “g1”");
    expect(items.join("|")).to.contain(
      "Made progress on “Before the lab” (1 of 3)",
    );
    expect(items.join("|")).to.contain("Answered “q2” — correct");
    expect(items.join("|")).to.contain("attempt 2");
    expect(items.join("|")).to.contain("Watched “Wave on a slinky” to the end");
    expect(items.join("|")).to.contain("Read “Waves 101”");
    const prefs = text(el, ".prefs");
    expect(prefs).to.contain("Dark");
    expect(prefs).to.contain("On (2 videos)");
  });

  it("shows back to back reads of one page once, newest time", async () => {
    visit("p1", 1, { "multiple-choice": 1 });
    const read = (id, page) =>
      record(page, id, "experienced", {}, "haxcms-page", { name: page });
    read("page-p1", "p1");
    read("page-p1", "p1");
    answer("p1", "q1", true);
    read("page-p1", "p1");
    read("page-p1", "p1");
    read("page-p2", "p2");
    const el = await make(
      html`<my-learning scope="site" recent></my-learning>`,
    );
    // stored as sent
    expect(el._statements.length).to.equal(6);
    const shown = el.recentStatements();
    expect(shown.map((s) => s.object.id)).to.deep.equal([
      "page-p2",
      "page-p1",
      "q1",
      "page-p1",
    ]);
    // the newest of the collapsed pair is the one kept
    const p1 = el._statements.filter((s) => s.object.id === "page-p1");
    const newest = p1
      .map((s) => s.timestamp)
      .sort()
      .pop();
    expect(shown[1].timestamp).to.equal(newest);
    const items = [...el.shadowRoot.querySelectorAll(".recent li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(items.length).to.equal(4);
    expect(items[1]).to.contain("Read “p1”");
  });

  describe("repair from stored statements (real-style manifest)", () => {
    // what HAXcms pages look like: slugs under the site base, statements
    // sent from the page URL with or without a trailing slash / index.html
    const base = new URL("./", document.baseURI).href;
    const REAL = {
      id: "b8e14c34-6f48-4f74-aca4-f35428f49855",
      title: "HAXcellence",
      metadata: {
        platform: {},
        theme: { variables: {} },
        site: { name: "haxcellence", settings: {} },
      },
      items: [
        { ...item("item-lab", null, 0, "Lab"), slug: "lab" },
        { ...item("item-lab-q", "item-lab", 0, "Questions"), slug: "lab/q" },
        { ...item("item-lab-v", "item-lab", 1, "Video"), slug: "lab/video" },
      ],
    };
    const KEY = REAL.id;
    let k = 0;
    const real = (pageUrl, objectId, verb, result, tag) => ({
      id: `10000000-0000-4000-8000-${String(++k).padStart(12, "0")}`,
      verb: {
        id: `http://adlnet.gov/expapi/verbs/${verb}`,
        display: { "en-US": verb },
      },
      object: {
        id: objectId,
        definition: { name: { "en-US": objectId } },
      },
      result,
      context: {
        contextActivities: { parent: [{ id: pageUrl }] },
        extensions: { [XAPI_EXTENSIONS.element]: tag },
      },
      timestamp: new Date(Date.UTC(2026, 10, 4, 12, 0, k)).toISOString(),
    });
    const lost = () => [
      real(`${base}lab/q`, `${base}lab/q`, "experienced", {}, "haxcms-page"),
      real(
        `${base}lab/q/`,
        `${base}lab/q#q1`,
        "answered",
        {
          success: false,
          extensions: { [XAPI_EXTENSIONS.attempts]: 1 },
        },
        "multiple-choice",
      ),
      real(
        `${base}lab/q/index.html?x=1`,
        `${base}lab/q#q1`,
        "answered",
        {
          success: true,
          completion: true,
          extensions: { [XAPI_EXTENSIONS.attempts]: 2 },
        },
        "multiple-choice",
      ),
      real(
        `${base}lab/video#t=3`,
        `${base}lab/video#v`,
        "completed",
        {
          completion: true,
        },
        "video-player",
      ),
    ];
    beforeEach(async () => {
      store.manifest = JSON.parse(JSON.stringify(REAL));
      store.activeId = "item-lab-q";
      await flush();
    });

    it("keys the site by manifest id and finds pages by URL", () => {
      expect(LearnerProgress.siteKey).to.equal(KEY);
      const [read, wrong, right, video] = lost();
      expect(LearnerProgress.pageOfStatement(read)).to.equal("item-lab-q");
      expect(LearnerProgress.pageOfStatement(wrong)).to.equal("item-lab-q");
      expect(LearnerProgress.pageOfStatement(right)).to.equal("item-lab-q");
      expect(LearnerProgress.pageOfStatement(video)).to.equal("item-lab-v");
      const other = real("https://elsewhere.example/x", "y", "answered", {});
      expect(LearnerProgress.pageOfStatement(other)).to.equal("");
    });

    it("rebuilds lost activities once, without double counting", async () => {
      // statements stored, profile empty: what a lost profile write leaves
      const stored = lost();
      for (const st of stored) {
        await UserScaffoldInstance.statementAdapter.add(KEY, st);
      }
      expect(UserScaffoldInstance.readSite(KEY)).to.equal(null);
      const el = await make(
        html`<my-learning scope="site" recent></my-learning>`,
      );
      const site = UserScaffoldInstance.readSite(KEY);
      const q = site.activities[`${base}lab/q#q1`];
      expect(q.page).to.equal("item-lab-q");
      expect(q.count).to.equal(2);
      expect(q.firstTry).to.equal(false);
      expect(q.done).to.equal(true);
      expect(site.pages["item-lab-q"].visits).to.equal(1);
      expect(site.activities[`${base}lab/video#v`].page).to.equal("item-lab-v");
      expect(el._data.tiles.activitiesDone).to.equal(2);
      expect(el._data.tiles.firstTry).to.equal(0);
      expect(el.shadowRoot.querySelector(".empty")).to.equal(null);
      // again: nothing changes, nothing is stored twice
      expect(LearnerProgress.repair(stored)).to.equal(0);
      await el.refresh();
      expect(
        UserScaffoldInstance.readSite(KEY).activities[`${base}lab/q#q1`].count,
      ).to.equal(2);
      expect((await UserScaffoldInstance.statements(KEY)).length).to.equal(4);
    });

    it("rebuilds a stale activity from all of its statements", async () => {
      const stored = lost();
      for (const st of stored) {
        await UserScaffoldInstance.statementAdapter.add(KEY, st);
      }
      // the profile caught only the first answer
      UserScaffoldInstance.recordStatement(KEY, stored[1], {
        page: "item-lab-q",
        trackable: true,
      });
      const el = await make(html`<my-learning scope="site"></my-learning>`);
      const q =
        UserScaffoldInstance.readSite(KEY).activities[`${base}lab/q#q1`];
      expect(q.count).to.equal(2);
      expect(q.done).to.equal(true);
      expect(el._data.tiles.activitiesDone).to.equal(2);
    });

    it("counts pages read and visits from statements when only browsing", async () => {
      const reads = [
        real(`${base}lab/q`, `${base}lab/q`, "experienced", {}, "haxcms-page"),
        real(
          `${base}lab/q/`,
          `${base}lab/q/`,
          "experienced",
          {},
          "haxcms-page",
        ),
        real(
          `${base}lab/video`,
          `${base}lab/video`,
          "experienced",
          {},
          "haxcms-page",
        ),
      ];
      for (const st of reads) {
        await UserScaffoldInstance.statementAdapter.add(KEY, st);
      }
      const el = await make(html`<my-learning scope="site"></my-learning>`);
      expect(el.isEmpty(el._data)).to.equal(false);
      expect(el._data.tiles.pagesRead).to.equal(2);
      expect(el._data.tiles.pagesTotal).to.equal(3);
      expect(el._data.tiles.visits).to.equal(3);
      expect(el._data.tiles.firstTry).to.equal(null);
      const tiles = text(el, ".tiles");
      expect(tiles).to.contain("Pages read 2 / 3");
      expect(tiles).to.contain("Visits 3");
      expect(tiles).to.contain("First-try accuracy —");
      expect(el.shadowRoot.querySelector(".chart")).to.not.equal(null);
      expect(el.shadowRoot.querySelector(".pages")).to.not.equal(null);
    });

    it("leaves activities that are up to date alone", () => {
      const stored = lost();
      [stored[1], stored[2]].forEach((st) =>
        UserScaffoldInstance.recordStatement(KEY, st, {
          page: "item-lab-q",
          trackable: true,
        }),
      );
      const before =
        UserScaffoldInstance.readSite(KEY).activities[`${base}lab/q#q1`];
      LearnerProgress.repair(stored);
      const q =
        UserScaffoldInstance.readSite(KEY).activities[`${base}lab/q#q1`];
      expect(q.count).to.equal(2);
      expect(q.first).to.equal(before.first);
      expect(
        UserScaffoldInstance.readSite(KEY).activities[`${base}lab/video#v`]
          .count,
      ).to.equal(1);
    });
  });

  describe("map view", () => {
    const mapNodes = (el) => [...el.shadowRoot.querySelectorAll(".map-node")];
    const byId = (el, id) => mapNodes(el).find((n) => n.dataset.id === id);
    const crumbs = (el) =>
      [...el.shadowRoot.querySelectorAll(".map-path li")].map((li) =>
        li.textContent.trim(),
      );
    const press = (node, key) => {
      const evt = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      node.dispatchEvent(evt);
      return evt;
    };
    // svg nodes have no click(); a click event is what a pointer sends
    const pick = (node) =>
      node.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
    const settle = async (el) => {
      await el.updateComplete;
      await flush();
    };
    const rows = (el) =>
      [...el.shadowRoot.querySelectorAll(".map-wrap ~ details tbody tr")].map(
        (tr) => [...tr.children].map((c) => c.textContent.trim()),
      );

    it("puts you at the centre with your pages done, and the whole outline around you", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      expect(el._data.view).to.equal("map");
      expect(text(el, ".map-center")).to.equal("You 2 of 6 pages done");
      const nodes = mapNodes(el);
      expect(nodes.map((n) => n.dataset.id)).to.deep.equal([
        "ch1",
        "p1",
        "p2",
        "p2a",
        "ch2",
        "p3",
      ]);
      expect(nodes.every((n) => n.getAttribute("role") === "button")).to.equal(
        true,
      );
      expect(byId(el, "p1").dataset.state).to.equal("done");
      expect(byId(el, "p2").dataset.state).to.equal("in-progress");
      expect(byId(el, "p2a").dataset.state).to.equal("not-started");
      expect(byId(el, "ch1").dataset.state).to.equal("in-progress");
      expect(byId(el, "ch1").getAttribute("aria-label")).to.equal(
        "Chapter 1, In progress, 1 of 4 pages done",
      );
      expect(byId(el, "p3").getAttribute("aria-label")).to.equal(
        "Sound, Done, 1 of 1 activities done",
      );
      // each node shows what it is, and done or started as a mark on it
      const icon = (id) =>
        byId(el, id).querySelector("simple-icon-lite").getAttribute("icon");
      expect(icon("ch1")).to.equal("hax:unit");
      expect(icon("p2")).to.equal("hax:lesson");
      expect(icon("p1")).to.equal("lrn:page");
      expect(
        byId(el, "p1").querySelector('.map-badge[data-state="done"]'),
      ).to.not.equal(null);
      expect(
        byId(el, "p2").querySelector('.map-badge[data-state="in-progress"]'),
      ).to.not.equal(null);
      expect(byId(el, "p2a").querySelector(".map-badge")).to.equal(null);
      // beside it: the node with focus, up next and the key
      expect(text(el, ".map-detail .map-title")).to.equal("Chapter 1");
      expect(el.shadowRoot.querySelector(".map-next .up-next")).to.not.equal(
        null,
      );
      expect(text(el, ".map-legend")).to.equal(
        "Done In progress Visited Not started Part of",
      );
      // the Pages card leaves up next to the map
      expect(el.shadowRoot.querySelectorAll(".up-next").length).to.equal(1);
      // one tab stop among the nodes, every node in the table
      expect(nodes.filter((n) => n.tabIndex === 0).length).to.equal(1);
      expect(rows(el).length).to.equal(6);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("uses the page's own icon, else its page type's", async () => {
      seed();
      const manifest = JSON.parse(JSON.stringify(MANIFEST));
      manifest.items.find((i) => i.id === "p1").metadata.icon = "lrn:write";
      manifest.items.find((i) => i.id === "p3").metadata.pageType = "project";
      store.manifest = manifest;
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      const icon = (id) =>
        byId(el, id).querySelector("simple-icon-lite").getAttribute("icon");
      expect(icon("p1")).to.equal("lrn:write");
      expect(icon("p3")).to.equal("hax:bulletin-board");
    });

    it("moves with arrow keys, opens with Enter and steps back with Escape", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      let nodes = mapNodes(el);
      nodes[0].focus();
      press(nodes[0], "ArrowRight");
      expect(el.shadowRoot.activeElement.dataset.id).to.equal("p1");
      press(el.shadowRoot.activeElement, "ArrowLeft");
      press(el.shadowRoot.activeElement, "ArrowLeft");
      expect(el.shadowRoot.activeElement.dataset.id).to.equal("p3");
      press(el.shadowRoot.activeElement, "Home");
      expect(el.shadowRoot.activeElement.dataset.id).to.equal("ch1");
      press(el.shadowRoot.activeElement, "Enter");
      await settle(el);
      expect(text(el, ".map-center-title")).to.equal("Chapter 1");
      expect(mapNodes(el).map((n) => n.dataset.id)).to.deep.equal([
        "p1",
        "p2",
        "p2a",
      ]);
      expect(crumbs(el)).to.deep.equal(["You", "Chapter 1"]);
      expect(
        el.shadowRoot.querySelector('.map-path [aria-current="location"]')
          .textContent,
      ).to.equal("Chapter 1");
      expect(text(el, '.chart [role="status"]')).to.equal("Showing Chapter 1");
      // into a page: its activities
      press(mapNodes(el)[0], "Enter");
      await settle(el);
      nodes = mapNodes(el);
      expect(nodes.map((n) => n.dataset.kind)).to.deep.equal([
        "activity",
        "activity",
      ]);
      expect(
        nodes.map((n) => n.querySelector("title").textContent),
      ).to.deep.equal(["q1", "Wave on a slinky"]);
      expect(text(el, ".map-center")).to.contain("Waves 101");
      expect(text(el, ".map-center")).to.contain("2 of 2 activities done");
      // Escape steps out one level, focus on the page we came from
      const evt = press(el.shadowRoot.activeElement, "Escape");
      expect(evt.defaultPrevented).to.equal(true);
      await settle(el);
      expect(text(el, ".map-center-title")).to.equal("Chapter 1");
      expect(el.shadowRoot.activeElement.dataset.id).to.equal("p1");
      // the breadcrumb steps all the way out
      el.shadowRoot.querySelector(".map-path button").click();
      await settle(el);
      expect(text(el, ".map-center")).to.contain("You");
      // at the top Escape is left for the dialog
      expect(press(mapNodes(el)[0], "Escape").defaultPrevented).to.equal(false);
    });

    it("picks a node with a click and opens it with a second one", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      pick(byId(el, "p2"));
      await settle(el);
      expect(byId(el, "p2").hasAttribute("data-active")).to.equal(true);
      expect(text(el, ".map-detail .map-where")).to.equal("Chapter 1");
      expect(text(el, ".map-detail .map-title")).to.equal("Energy");
      // a picked page lifts its neighbours and dims the rest
      expect(byId(el, "p2a").hasAttribute("data-near")).to.equal(true);
      expect(byId(el, "p3").hasAttribute("data-dimmed")).to.equal(true);
      // a page with pages under it opens to those pages
      pick(byId(el, "p2"));
      await settle(el);
      expect(crumbs(el)).to.deep.equal(["You", "Chapter 1", "Energy"]);
      expect(mapNodes(el).map((n) => n.dataset.id)).to.deep.equal(["p2a"]);
      expect(text(el, ".map-center")).to.contain("0 of 2 pages done");
      // and a page with nothing under it to its activities (none yet)
      press(mapNodes(el)[0], "Enter");
      await settle(el);
      expect(crumbs(el)).to.deep.equal([
        "You",
        "Chapter 1",
        "Energy",
        "Energy deep dive",
      ]);
      expect(text(el, ".map-none")).to.equal("Nothing to do on this page yet.");
    });

    it("draws a big site whole, and zooms and fits", async () => {
      const many = [item("big", null, 0, "Big section")];
      for (let i = 0; i < 200; i++) {
        many.push(item(`b${i}`, "big", i, `Page ${i}`));
      }
      store.manifest = { ...JSON.parse(JSON.stringify(MANIFEST)), items: many };
      store.activeId = "b1";
      visit("b1");
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      expect(mapNodes(el).length).to.equal(201);
      expect(rows(el).length).to.equal(201);
      const svgEl = el.shadowRoot.querySelector(".map-svg");
      const width = () => Number(svgEl.getAttribute("viewBox").split(" ")[2]);
      const fitted = width();
      // the rings spread out so 200 pages keep apart
      expect(fitted).to.be.greaterThan(2 * 460);
      const buttons = [
        ...el.shadowRoot.querySelectorAll(".ddd-viewport-controls button"),
      ];
      expect(buttons.map((b) => b.getAttribute("aria-label"))).to.deep.equal([
        "Zoom in",
        "Zoom out",
        "Fit the whole map",
      ]);
      buttons[0].click();
      expect(width()).to.be.lessThan(fitted);
      buttons[2].click();
      expect(width()).to.equal(fitted);
    });

    it("hangs each page under its own parent, one ring per level", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      const m = el.mapView();
      const ch1 = m.nodes.find((s) => s.id === "ch1");
      expect(ch1.children.map((c) => [c.id, c.parent, c.depth])).to.deep.equal([
        ["p1", "ch1", 1],
        ["p2", "ch1", 1],
        ["p2a", "p2", 2],
      ]);
      // a page with pages under it is a branch: named, counting its pages
      const p2 = byId(el, "p2");
      expect(p2.hasAttribute("data-branch")).to.equal(true);
      expect(p2.hasAttribute("data-named")).to.equal(true);
      expect(p2.getAttribute("aria-label")).to.equal(
        "Energy, In progress, 0 of 2 pages done",
      );
      expect(byId(el, "p1").hasAttribute("data-named")).to.equal(false);
      // each line takes the state of the node it leads to
      const lines = [
        ...el.shadowRoot.querySelectorAll(".map-svg .map-line.outline"),
      ];
      expect(lines.map((t) => t.dataset.state)).to.deep.equal([
        "in-progress",
        "done",
        "in-progress",
        "not-started",
        "in-progress",
        "done",
      ]);
      // drilled into the section the tree keeps its levels
      press(byId(el, "ch1"), "Enter");
      await settle(el);
      expect(mapNodes(el).map((n) => n.dataset.id)).to.deep.equal([
        "p1",
        "p2",
        "p2a",
      ]);
      expect(
        el.shadowRoot.querySelectorAll(".map-svg .map-line.outline").length,
      ).to.equal(3);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("says when nothing on a page is tracked", async () => {
      visit("p1");
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      pick(byId(el, "p1"));
      await settle(el);
      expect(text(el, ".map-detail .map-state")).to.equal("Visited");
      expect(text(el, ".map-detail .map-note")).to.equal(
        "Nothing on this page is tracked, so it shows as visited, not done.",
      );
    });

    it("draws pages an author marked as related, and can hide them", async () => {
      seed();
      const manifest = JSON.parse(JSON.stringify(MANIFEST));
      manifest.items.find((i) => i.id === "p3").metadata.relatedItems =
        "p1, p2a,p3,nope,p1";
      store.manifest = manifest;
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      const related = () => [
        ...el.shadowRoot.querySelectorAll(".map-svg .related"),
      ];
      expect(related().length).to.equal(2);
      expect(text(el, ".map-legend")).to.contain("Related pages");
      // in the table, both ways
      expect(rows(el).find((r) => r[0] === "Sound")[3]).to.equal(
        "Waves 101, Energy deep dive",
      );
      expect(rows(el).find((r) => r[0] === "Waves 101")[3]).to.equal("Sound");
      // pick a related page: its lines stand out, the names are said
      pick(byId(el, "p1"));
      await settle(el);
      expect(
        el.shadowRoot.querySelectorAll(".map-svg .related.hi").length,
      ).to.equal(1);
      expect(text(el, ".map-related")).to.equal("Related to: Sound");
      expect(byId(el, "p3").hasAttribute("data-near")).to.equal(true);
      el.shadowRoot.querySelector(".map-related-toggle input").click();
      await settle(el);
      expect(related().length).to.equal(0);
      expect(text(el, ".map-legend")).to.not.contain("Related pages");
      await expect(el).shadowDom.to.be.accessible();
    });

    it("keeps related pages to ones in scope, once each, never itself", () => {
      const items = JSON.parse(JSON.stringify(ITEMS));
      items.find((i) => i.id === "p1").metadata.relatedItems = [
        "p3",
        " p3 ",
        "p1",
        "hidden",
        "",
      ];
      const m = mapModel({
        items,
        pages: ["ch1", "p1", "p2", "p2a", "ch2", "p3"],
        root: null,
        pageRows: [],
        activitiesByPage: {},
      });
      const p1 = m.nodes[0].children.find((c) => c.id === "p1");
      expect(p1.related).to.deep.equal(["p3"]);
      expect(m.nodes[1].related).to.deep.equal([]);
    });

    it("draws names as text", async () => {
      const evil = '<img src="x" onerror="globalThis.__mlMap=1">';
      visit("p1", 1, {});
      record("p1", "x1", "answered", { success: true }, "multiple-choice", {
        name: evil,
      });
      store.manifest = {
        ...JSON.parse(JSON.stringify(MANIFEST)),
        items: [item("p1", null, 0, evil)],
      };
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      expect(mapNodes(el)[0].querySelector("title").textContent).to.equal(evil);
      press(mapNodes(el)[0], "Enter");
      await settle(el);
      expect(el.shadowRoot.querySelector("img")).to.equal(null);
      expect(globalThis.__mlMap).to.equal(undefined);
      expect(text(el, ".map-center")).to.contain("<img");
      expect(mapNodes(el)[0].querySelector("title").textContent).to.equal(evil);
    });
  });

  it("renders learner and author text as text, never markup", async () => {
    visit("p1", 1, {});
    const evil = '<img src="x" onerror="globalThis.__mlXss=1">';
    record("p1", "x1", "answered", { success: true }, "multiple-choice", {
      name: evil,
      page: evil,
    });
    store.manifest = {
      ...JSON.parse(JSON.stringify(MANIFEST)),
      items: [item("p1", null, 0, evil, evil)],
    };
    store.activeId = "p1";
    const el = await make(
      html`<my-learning scope="site" recent></my-learning>`,
    );
    await flush(80);
    expect(el.shadowRoot.querySelector("img")).to.equal(null);
    expect(globalThis.__mlXss).to.equal(undefined);
    expect(el.shadowRoot.querySelector(".recent").textContent).to.contain(evil);
    expect(el.shadowRoot.querySelector(".pages").textContent).to.contain(evil);
  });

  it("downloads this site's statements as an xAPI JSON array", async () => {
    seed();
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const real = URL.createObjectURL;
    let blob = null;
    URL.createObjectURL = (b) => {
      blob = b;
      return "blob:my-learning-test";
    };
    let name = "";
    try {
      name = await el.downloadData();
    } finally {
      URL.createObjectURL = real;
    }
    expect(name).to.equal("physics-010-xapi-statements.json");
    expect(blob.type).to.equal("application/json");
    const list = JSON.parse(await blob.text());
    expect(Array.isArray(list)).to.equal(true);
    expect(list.length).to.equal(9);
    list.forEach((s) => {
      expect(s.verb.id).to.match(/^http:\/\/adlnet\.gov\/expapi\/verbs\//);
      expect(s.object.id).to.be.a("string");
    });
  });

  it("clears this site after a confirm step and says so", async () => {
    seed();
    UserScaffoldInstance.recordPageVisit("other-site", "x", {});
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const clear = el.shadowRoot.querySelector("#clear");
    expect(clear.getAttribute("aria-expanded")).to.equal("false");
    clear.click();
    await el.updateComplete;
    await flush();
    const panel = el.shadowRoot.querySelector("#confirm");
    expect(panel).to.not.equal(null);
    expect(clear.getAttribute("aria-expanded")).to.equal("true");
    // the first choice is focused and "this site" is picked
    expect(el.shadowRoot.activeElement.value).to.equal("site");
    // Escape cancels without clearing
    panel.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#confirm")).to.equal(null);
    expect(UserScaffoldInstance.readSite(SITE)).to.not.equal(null);
    clear.click();
    await el.updateComplete;
    el.shadowRoot.querySelector("#confirm-clear").click();
    await flush(80);
    await el.updateComplete;
    expect(UserScaffoldInstance.readSite(SITE).activities).to.deep.equal({});
    expect(await UserScaffoldInstance.statements(SITE)).to.deep.equal([]);
    expect(UserScaffoldInstance.readSite("other-site")).to.not.equal(null);
    const status = el.shadowRoot.querySelector('[role="status"]');
    expect(status.getAttribute("aria-live")).to.equal("polite");
    expect(status.textContent.trim()).to.equal(
      "Your learning data for Physics 010 was cleared.",
    );
    // only the page open now is left (its visit is noted again)
    expect(el._data.engaged).to.equal(0);
    expect(el._data.tiles.activitiesDone).to.equal(0);
  });

  it("clears everything on this device when that is chosen", async () => {
    seed();
    UserScaffoldInstance.recordPageVisit("other-site", "x", {});
    globalThis.localStorage.setItem("bullet-check-list:v1:/elsewhere/a", "1");
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    el.shadowRoot.querySelector("#clear").click();
    await el.updateComplete;
    const device = el.shadowRoot.querySelector(
      'input[name="clear-choice"][value="device"]',
    );
    device.click();
    await el.updateComplete;
    const go = el.shadowRoot.querySelector("#confirm-clear");
    expect(go.textContent.trim()).to.equal("Clear everything on this device");
    go.click();
    await flush(80);
    await el.updateComplete;
    expect(UserScaffoldInstance.readSite("other-site")).to.equal(null);
    expect(
      globalThis.localStorage.getItem("bullet-check-list:v1:/elsewhere/a"),
    ).to.equal(null);
    expect(
      el.shadowRoot.querySelector('[role="status"]').textContent.trim(),
    ).to.equal("All learning data on this device was cleared.");
  });

  it("updates live when a statement is recorded", async () => {
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    expect(el.isEmpty(el._data)).to.equal(true);
    UserScaffoldInstance.setPageTrackable(SITE, "p1", 1, {
      "multiple-choice": 1,
    });
    answer("p1", "live-q", true);
    await flush(150);
    await el.updateComplete;
    expect(el.isEmpty(el._data)).to.equal(false);
    expect(el._data.engaged).to.equal(1);
    expect(el._statements.length).to.equal(1);
    expect(el.shadowRoot.querySelector(".tiles")).to.not.equal(null);
  });

  it("is not empty with only page reads: tiles, chart, pages and recent", async () => {
    visit("p1");
    visit("p3");
    record("p1", "page-p1", "experienced", {}, "haxcms-page", {
      name: "Waves 101",
    });
    record("p3", "page-p3", "experienced", {}, "haxcms-page", {
      name: "Sound",
    });
    const el = await make(
      html`<my-learning scope="site" recent></my-learning>`,
    );
    expect(el.shadowRoot.querySelector(".empty")).to.equal(null);
    const tiles = text(el, ".tiles");
    expect(tiles).to.contain("Pages read 2 / 6");
    expect(tiles).to.contain("0 done");
    expect(tiles).to.contain("Visits 2");
    // no questions answered: a dash, not 0%
    expect(tiles).to.contain("First-try accuracy —");
    expect(el.shadowRoot.querySelector(".chart")).to.not.equal(null);
    expect(
      el.shadowRoot.querySelector('.pages li[data-page="p1"]').dataset.status,
    ).to.equal("visited");
    expect(el.shadowRoot.querySelectorAll(".recent li").length).to.equal(2);
  });

  describe("pages on a big site", () => {
    // 10 sections of 14 pages: 150 pages
    const big = () => {
      const items = [];
      for (let s = 0; s < 10; s++) {
        items.push(item(`s${s}`, null, s, `Section ${s}`));
        for (let p = 0; p < 14; p++) {
          items.push(item(`s${s}p${p}`, `s${s}`, p, `Page ${s}.${p}`));
        }
      }
      return items;
    };
    beforeEach(async () => {
      store.manifest = {
        ...JSON.parse(JSON.stringify(MANIFEST)),
        items: big(),
      };
      store.activeId = "s0p0";
      await flush();
      // 3 done, 3 in progress, 6 only visited
      for (let p = 0; p < 3; p++) {
        visit(`s0p${p}`, 1, { "multiple-choice": 1 });
        answer(`s0p${p}`, `${siteUrl()}s0p${p}#q`, true);
        read(`s0p${p}`);
        visit(`s1p${p}`, 2, { "multiple-choice": 2 });
        answer(`s1p${p}`, `${siteUrl()}s1p${p}#q`, true);
      }
      for (let p = 0; p < 6; p++) {
        visit(`s2p${p}`);
      }
    });

    it("lists started pages first, capped, the rest behind Show all", () => {
      const rows = big()
        .filter((i) => i.parent)
        .map((i, n) => ({
          id: i.id,
          n: n + 1,
          title: i.title,
          section: i.parent,
          status:
            i.id.startsWith("s0p") && Number(i.id.slice(3)) < 3
              ? "done"
              : i.id.startsWith("s1p") && Number(i.id.slice(3)) < 3
                ? "in-progress"
                : i.id.startsWith("s2p") && Number(i.id.slice(3)) < 6
                  ? "visited"
                  : "not-started",
          seen: i.id === "s2p4" ? "2026-11-04T10:00:00Z" : "",
        }));
      const m = pageListModel(rows);
      expect(m.total).to.equal(140);
      expect(m.started).to.equal(12);
      expect(m.notStarted).to.equal(128);
      expect(m.more).to.equal(true);
      expect(m.shown.length).to.equal(8);
      expect(m.shown.map((r) => r.status)).to.deep.equal([
        "in-progress",
        "in-progress",
        "in-progress",
        "visited",
        "visited",
        "visited",
        "visited",
        "visited",
      ]);
      // most recently seen first within a state
      expect(m.shown[3].id).to.equal("s2p4");
      expect(m.sections.length).to.equal(10);
      expect(m.sections[0].done).to.equal(3);
      expect(m.sections[0].total).to.equal(14);
      expect(pageListModel(rows, { limit: 3 }).shown.length).to.equal(3);
    });

    it("shows 8 started pages, then every page grouped by section", async () => {
      const el = await make(html`<my-learning scope="site"></my-learning>`);
      const listed = () =>
        [...el.shadowRoot.querySelectorAll(".pages li")].map((li) => ({
          id: li.dataset.page,
          status: li.dataset.status,
        }));
      expect(listed().length).to.equal(8);
      expect(listed().every((r) => r.status !== "not-started")).to.equal(true);
      expect(listed()[0].status).to.equal("in-progress");
      expect(text(el, ".pages-card > .meta")).to.equal(
        "12 of 150 pages started · 138 not started",
      );
      const more = el.shadowRoot.querySelector("#all-pages");
      expect(more.textContent.trim()).to.equal("Show all 150 pages");
      expect(more.getAttribute("aria-expanded")).to.equal("false");
      more.click();
      await el.updateComplete;
      const sections = [...el.shadowRoot.querySelectorAll("details.section")];
      expect(sections.length).to.equal(10);
      expect(listed().length).to.equal(150);
      // a count per section; open where the learner started something
      expect(
        sections[0].querySelector("summary").textContent.replace(/\s+/g, " "),
      ).to.contain("Section 0 3 of 15 pages done");
      expect(sections.map((d) => d.open)).to.deep.equal([
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
      expect(
        sections[5].querySelectorAll('li[data-status="not-started"]').length,
      ).to.equal(15);
      const less = el.shadowRoot.querySelector("#all-pages");
      expect(less.textContent.trim()).to.equal("Show fewer pages");
      expect(less.getAttribute("aria-expanded")).to.equal("true");
      less.click();
      await el.updateComplete;
      expect(listed().length).to.equal(8);
    });
  });

  describe("concepts", () => {
    const useItems = async (items) => {
      store.manifest = { ...JSON.parse(JSON.stringify(MANIFEST)), items };
      store.activeId = items[0].id;
      await flush();
    };
    const concepts = async () => {
      const el = await make(html`<my-learning scope="site"></my-learning>`);
      return {
        el,
        source: el._data.conceptSource,
        labels: el._data.groups.map((g) => g.label),
      };
    };

    it("picks the first source with 3 groups: tags, sections, elements, pages", () => {
      const row = (key, engaged = 1) => ({ key, label: key, engaged });
      const order = (c) => pickConceptSource(c).source;
      const tags = { source: "tags", rows: [row("a"), row("b"), row("c")] };
      const fewTags = {
        source: "tags",
        rows: [row("a"), row("(untagged)", 4), row("(other)", 2)],
      };
      const sections = {
        source: "sections",
        rows: [row("A"), row("B"), row("C")],
      };
      const oneSection = { source: "sections", rows: [row("A")] };
      const elements = {
        source: "elements",
        rows: [row("x"), row("y"), row("z")],
      };
      const pages = { source: "pages", rows: [row("p"), row("q"), row("r")] };
      expect(order([tags, sections, elements, pages])).to.equal("tags");
      expect(order([fewTags, sections, elements, pages])).to.equal("sections");
      expect(order([fewTags, oneSection, elements, pages])).to.equal(
        "elements",
      );
      expect(
        order([fewTags, oneSection, { source: "elements", rows: [] }, pages]),
      ).to.equal("pages");
      // groups nobody worked in do not count
      const idle = {
        source: "tags",
        rows: [row("a"), row("b", 0), row("c", 0)],
      };
      expect(order([idle, sections])).to.equal("sections");
      // not enough anywhere: the richest source for bars, no untagged row
      const none = pickConceptSource([fewTags, oneSection]);
      expect(none.found).to.equal(false);
      expect(none.rows.map((r) => r.key)).to.deep.equal(["a"]);
    });

    it("folds groups past 8 axes and untagged pages into Other", () => {
      const rows = Array.from({ length: 10 }, (_, i) => ({
        key: `t${i}`,
        label: `t${i}`,
        engaged: i,
        done: 1,
        total: 2,
        answered: 1,
        correct: i % 2,
      }));
      rows.push({
        key: "(untagged)",
        label: "Untagged",
        engaged: 9,
        answered: 0,
      });
      const axes = radarAxes(rows, 8, "Other");
      expect(axes.length).to.equal(8);
      // the 7 used most keep their order; the rest add up under Other
      expect(axes.map((a) => a.key)).to.deep.equal([
        "t3",
        "t4",
        "t5",
        "t6",
        "t7",
        "t8",
        "t9",
        "(other)",
      ]);
      const other = axes[7];
      expect(other.label).to.equal("Other");
      expect([other.done, other.total, other.answered]).to.deep.equal([
        3, 6, 3,
      ]);
      expect(other.accuracy).to.equal(0.333);
      expect(radarAxes(rows.slice(0, 4)).length).to.equal(4);
    });

    it("uses page tags when the site has 3 or more", async () => {
      seed();
      const { source, labels, el } = await concepts();
      expect(source).to.equal("tags");
      expect(labels).to.deep.equal(["intro", "sound", "waves"]);
      expect(text(el, ".chart .source")).to.equal("Concepts from page tags");
      expect(el.shadowRoot.querySelector(".radar svg").dataset.axes).to.equal(
        "3",
      );
    });

    it("falls back to outline sections without tags", async () => {
      await useItems([
        item("a", null, 0, "Atoms"),
        item("a1", "a", 0, "Atoms 1"),
        item("b", null, 1, "Bonds"),
        item("b1", "b", 0, "Bonds 1"),
        item("c", null, 2, "Cells"),
        item("c1", "c", 0, "Cells 1"),
      ]);
      ["a1", "b1", "c1"].forEach((p, i) => {
        visit(p, 1, { "multiple-choice": 1 });
        answer(p, `q-${p}`, i !== 1);
      });
      const { source, labels, el } = await concepts();
      expect(source).to.equal("sections");
      expect(labels).to.deep.equal(["Atoms", "Bonds", "Cells"]);
      expect(text(el, "#chart-title")).to.equal("Accuracy by section");
      expect(text(el, ".chart")).to.not.contain("Untagged");
    });

    it("falls back to the concepts games name, then to pages", async () => {
      await useItems([
        item("lab", null, 0, "Lab"),
        item("l1", "lab", 0, "Forces"),
        item("l2", "lab", 1, "Motion"),
        item("l3", "lab", 2, "Energy"),
      ]);
      visit("l1", 1, { "concept-map-game": 1 });
      ["Gravity", "Friction", "Mass"].forEach((c) =>
        record(
          "l1",
          "g-map",
          "experienced",
          { success: true },
          "concept-map-game",
          {
            description: c,
          },
        ),
      );
      record(
        "l1",
        "g-quest",
        "answered",
        { success: false },
        "concept-quest-game",
        {
          description: "Gravity",
        },
      );
      record(
        "l1",
        "g-quest",
        "answered",
        { success: true },
        "concept-quest-game",
        {
          description: "Gravity",
        },
      );
      let got = await concepts();
      expect(got.source).to.equal("elements");
      expect(got.labels).to.deep.equal(["Gravity", "Friction", "Mass"]);
      const gravity = got.el._data.groups[0];
      // found in the map game, missed first in the quest: 2 of 2 done, 0%
      expect([gravity.done, gravity.total, gravity.answered]).to.deep.equal([
        2, 2, 1,
      ]);
      expect(gravity.accuracy).to.equal(0);
      expect(text(got.el, ".chart .source")).to.equal(
        "Concepts named in your activities",
      );
      // no concept data: the pages worked on
      UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
      UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
      ["l1", "l2", "l3"].forEach((p) => {
        visit(p, 1, { "multiple-choice": 1 });
        answer(p, `q-${p}`, true);
      });
      got = await concepts();
      expect(got.source).to.equal("pages");
      expect(got.labels).to.deep.equal(["Forces", "Motion", "Energy"]);
      expect(text(got.el, "#chart-title")).to.equal("Accuracy by page");
    });

    it("never draws a lone Untagged bar", async () => {
      await useItems([
        item("lab", null, 0, "Lab"),
        item("l1", "lab", 0, "Forces"),
      ]);
      visit("l1", 1, { "multiple-choice": 1 });
      answer("l1", "q-l1", true);
      const { el } = await concepts();
      expect(el.chartType).to.equal("bars");
      expect(text(el, ".chart")).to.not.contain("Untagged");
      el.view = "tags";
      await el.updateComplete;
      await el.refresh();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".chart .bars")).to.equal(null);
      expect(text(el, ".chart .note")).to.equal(
        "No page here has tags yet. Try Concepts or Sections.",
      );
    });

    it("keeps at most 8 axes on the radar", async () => {
      const items = [];
      for (let i = 0; i < 10; i++) {
        items.push(item(`t${i}`, null, i, `Topic ${i}`, `tag${i}`));
      }
      await useItems(items);
      items.forEach((it, i) => {
        visit(it.id, 1, { "multiple-choice": 1 });
        answer(it.id, `q-${it.id}`, i % 2 === 0);
      });
      const { el } = await concepts();
      expect(el.shadowRoot.querySelector(".radar svg").dataset.axes).to.equal(
        "8",
      );
      const key = [...el.shadowRoot.querySelectorAll(".radar-key .label")].map(
        (n) => n.textContent.trim(),
      );
      expect(key.length).to.equal(8);
      expect(key[7]).to.equal("Other");
    });
  });

  describe("going places", () => {
    const base = siteUrl();
    let went;
    let saved;
    beforeEach(() => {
      went = [];
      saved = {
        go: MyLearningNavigation.go,
        settle: MyLearningNavigation.settle,
        timeout: MyLearningNavigation.timeout,
      };
      MyLearningNavigation.settle = 0;
      MyLearningNavigation.timeout = 1500;
    });
    afterEach(() => {
      MyLearningNavigation.go = saved.go;
      MyLearningNavigation.settle = saved.settle;
      MyLearningNavigation.timeout = saved.timeout;
      document.querySelectorAll("[data-ml-test]").forEach((n) => n.remove());
    });
    // a stub router: notes the URL, "opens" the page and puts its content in
    const stubRouter = (page, content) => {
      MyLearningNavigation.go = (url) => {
        went.push(url);
        store.activeId = page;
        if (content) {
          document.body.appendChild(content);
        }
        return "router";
      };
    };
    const sameSite = (url) => {
      const u = new URL(url);
      return u.origin === globalThis.location.origin && url.indexOf(base) === 0;
    };

    it("builds same-site page URLs from the manifest only", () => {
      expect(sitePageUrl({ slug: "p1" })).to.equal(`${base}p1`);
      expect(sitePageUrl({ slug: "p1" }, "lab q#1")).to.equal(
        `${base}p1#lab%20q%231`,
      );
      [
        "https://elsewhere.example/p1",
        "//elsewhere.example/p1",
        "javascript:alert(1)",
        "data:text/html,hi",
        "",
      ].forEach((slug) => expect(sitePageUrl({ slug })).to.equal(""));
      expect(sitePageUrl(null)).to.equal("");
      expect(activityKeyOfId(`${base}p1#lab-q%201`)).to.equal("lab-q 1");
      expect(activityKeyOfId("q1")).to.equal("");
      expect(activityKeyOfId(`${base}p1#%E0%A4%A`)).to.equal("");
    });

    it("offers Go to this page and Go to this activity on the map", async () => {
      visit("p2", 2, { "x-ml-quiz": 2 });
      record(
        "p2",
        `${base}p2#lab-done`,
        "answered",
        { success: true, completion: true },
        "x-ml-quiz",
        { name: "Done one" },
      );
      record("p2", `${base}p2#lab-todo`, "attempted", {}, "x-ml-quiz", {
        name: "Still to do",
      });
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      // a picked page offers its page, and each activity not done yet
      const node = [...el.shadowRoot.querySelectorAll(".map-node")].find(
        (n) => n.dataset.id === "p2",
      );
      node.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      const links = [...el.shadowRoot.querySelectorAll(".map-actions a.go")];
      expect(links.map((a) => a.textContent.trim())).to.deep.equal([
        "Go to this activity",
        "Go to “Energy”",
      ]);
      expect(links[1].getAttribute("href")).to.equal(`${base}p2`);
      expect(
        [...el.shadowRoot.querySelectorAll(".map-actions .map-go li")].map(
          (li) => li.dataset.id,
        ),
      ).to.deep.equal([`${base}p2#lab-done`, `${base}p2#lab-todo`]);
      expect(links[0].getAttribute("aria-label")).to.equal(
        "Go to this activity: Still to do",
      );
      links.forEach((a) => expect(sameSite(a.href)).to.equal(true));
      expect(links[0].getAttribute("href")).to.equal(`${base}p2#lab-todo`);
      const activityLink = links[0];
      // following it: the dialog closes, the page opens, the activity shows
      const target = document.createElement("x-ml-quiz");
      target.id = "lab-todo";
      target.setAttribute("data-ml-test", "");
      let scrolled = null;
      target.scrollIntoView = (o) => {
        scrolled = o;
      };
      stubRouter("p2", target);
      el.inDialog = true;
      let hidden = 0;
      const onHide = () => hidden++;
      globalThis.addEventListener("simple-modal-hide", onHide);
      activityLink.click();
      const found = await el.lastNavigation;
      globalThis.removeEventListener("simple-modal-hide", onHide);
      expect(hidden).to.equal(1);
      expect(went).to.deep.equal([`${base}p2#lab-todo`]);
      expect(found).to.equal(target);
      expect(document.activeElement).to.equal(target);
      expect(target.getAttribute("tabindex")).to.equal("-1");
      expect(target.hasAttribute("data-my-learning-target")).to.equal(true);
      expect(scrolled.block).to.equal("center");
      expect(document.getElementById("my-learning-target-style")).to.not.equal(
        null,
      );
    });

    it("finds an activity by its fingerprint key and respects reduced motion", async () => {
      const target = document.createElement("x-ml-quiz");
      target.setAttribute("title", "Which way is down?");
      target.setAttribute("data-ml-test", "");
      document.body.appendChild(target);
      const key = activityKey(target);
      target.remove();
      expect(key.indexOf("x-ml-quiz-")).to.equal(0);
      let scrolled = null;
      target.scrollIntoView = (o) => {
        scrolled = o;
      };
      stubRouter("p3", target);
      const realMatch = globalThis.matchMedia;
      globalThis.matchMedia = (q) => ({ matches: q.indexOf("reduce") !== -1 });
      let found = null;
      try {
        found = await goToActivity({
          pageId: "p3",
          url: sitePageUrl({ slug: "p3" }, key),
          key,
          tag: "x-ml-quiz",
        });
      } finally {
        globalThis.matchMedia = realMatch;
      }
      expect(went[0]).to.equal(`${base}p3#${encodeURIComponent(key)}`);
      expect(found).to.equal(target);
      expect(scrolled.behavior).to.equal("auto");
      expect(document.activeElement).to.equal(target);
      // a tag that is not an element name is never used as a selector
      expect(
        await goToActivity({
          pageId: "p3",
          url: `${base}p3`,
          key: "nope",
          tag: "x],*",
        }),
      ).to.equal(null);
    }).timeout(15000);

    it("lists Up next with Go links, and links page titles", async () => {
      seed();
      record("p3", `${base}p3#lab-g2`, "attempted", {}, "concept-map-game", {
        name: "Second game",
      });
      const el = await make(html`<my-learning scope="site"></my-learning>`);
      const items = [...el.shadowRoot.querySelectorAll(".up-next li")];
      expect(text(el, "#up-next-title")).to.equal("Up next");
      expect(items.map((li) => li.dataset.page)).to.deep.equal(["p2", "p3"]);
      expect(items[0].textContent.replace(/\s+/g, " ")).to.contain(
        "Before the lab",
      );
      const go = items[1].querySelector("a.go");
      expect(go.textContent.trim()).to.equal("Go to this activity");
      expect(go.getAttribute("href")).to.equal(`${base}p3#lab-g2`);
      const title = el.shadowRoot.querySelector(
        '.pages li[data-page="p3"] a.page-link',
      );
      expect(title.getAttribute("href")).to.equal(`${base}p3`);
      // a page link goes there with the router, nothing to focus
      stubRouter("p3");
      title.click();
      expect(await el.lastNavigation).to.equal(null);
      expect(went).to.deep.equal([`${base}p3`]);
      // a new tab is left to the browser
      went = [];
      const evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
      });
      evt.preventDefault();
      go.dispatchEvent(evt);
      expect(went).to.deep.equal([]);
      // pages left to do fill Up next when no activity is waiting
      UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
      UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
      visit("p1", 2, { "multiple-choice": 2 });
      answer("p1", "q1", true);
      await el.refresh();
      await el.updateComplete;
      expect(
        [...el.shadowRoot.querySelectorAll(".up-next li")].map((li) => [
          li.dataset.kind,
          li.dataset.page,
        ]),
      ).to.deep.equal([
        ["page", "p1"],
        ["page", "p2"],
        ["page", "p2a"],
      ]);
    });
  });

  it("writes titles, concepts and section names as text", async () => {
    const evil = '<img src="x" onerror="globalThis.__mlXss2=1">';
    store.manifest = {
      ...JSON.parse(JSON.stringify(MANIFEST)),
      items: [
        item("e", null, 0, evil),
        item("e1", "e", 0, `${evil} 1`),
        item("e2", "e", 1, `${evil} 2`),
        item("e3", "e", 2, `${evil} 3`),
      ],
    };
    store.activeId = "e1";
    await flush();
    ["e1", "e2", "e3"].forEach((p) => {
      visit(p, 2, { "concept-map-game": 2 });
      record(p, `${siteUrl()}${p}#g`, "experienced", {}, "concept-map-game", {
        name: evil,
        description: `${evil}${p}`,
      });
    });
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    expect(el._data.conceptSource).to.equal("elements");
    el.shadowRoot.querySelector("#all-pages").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("img")).to.equal(null);
    expect(globalThis.__mlXss2).to.equal(undefined);
    expect(text(el, ".radar-key")).to.contain(`${evil}e1`);
    expect(text(el, "details.section summary")).to.contain(evil);
    expect(text(el, ".up-next")).to.contain(evil);
    // radar labels are cut, still text
    expect(
      el.shadowRoot.querySelector(".radar svg text").textContent,
    ).to.contain("<img");
  });

  it("passes an accessibility audit", async () => {
    seed();
    const el = await make(
      html`<my-learning
        scope="site"
        recent
        preferences
        view="activity"
      ></my-learning>`,
    );
    await expect(el).shadowDom.to.be.accessible();
    el.view = "concepts";
    await el.updateComplete;
    await el.refresh();
    await el.updateComplete;
    expect(el.chartType).to.equal("radar");
    await expect(el).shadowDom.to.be.accessible();
  });
});
