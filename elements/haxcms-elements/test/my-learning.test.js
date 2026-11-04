import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import {
  activityKindOf,
  outlineInOrder,
  scopePages,
  statementsFileName,
} from "../lib/ui-components/progress/my-learning.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import { XAPI_EXTENSIONS } from "@haxtheweb/user-action/lib/xapi.js";

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
    definition: { name: { "en-US": extra.name || objectId } },
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
    { page, tag, trackable: tag !== "haxcms-page" },
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
    const pages = [...el.shadowRoot.querySelectorAll(".pages li")].map((li) =>
      li.getAttribute("data-page"),
    );
    expect(pages).to.deep.equal(["ch1", "p1", "p2", "p2a"]);
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
    // Untagged (ch1, ch2: nothing visited, nothing to do) is left out
    expect(labels()).to.deep.equal(["intro", "sound", "waves"]);
    const waves = el._data.groups.find((g) => g.key === "waves");
    expect(waves.done).to.equal(3);
    expect(waves.total).to.equal(4);
    const radios = () =>
      el.shadowRoot.querySelectorAll('input[name="group-by"]');
    expect(radios().length).to.equal(5);
    expect(radios()[0].checked).to.equal(true);
    radios()[1].click();
    await el.updateComplete;
    expect(el._data.view).to.equal("sections");
    expect(labels()).to.deep.equal(["Chapter 1", "Chapter 2"]);
    radios()[2].click();
    await el.updateComplete;
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
    radios()[3].click();
    await el.updateComplete;
    expect(el._data.groups.map((g) => g.key)).to.include("multiple-choice");
    expect(el._data.groups.map((g) => g.key)).to.not.include("haxcms-page");
    // a data table for the bars
    expect(
      el.shadowRoot.querySelectorAll("details table tbody tr").length,
    ).to.equal(el._data.groups.length);
  });

  it("draws a radar for 3 to 8 tag groups and bars otherwise", async () => {
    seed();
    const el = await make(
      html`<my-learning scope="site" view="tags"></my-learning>`,
    );
    await customElements.whenDefined("radar-chart");
    await flush();
    await el.updateComplete;
    expect(el.chartType).to.equal("radar");
    const radar = el.shadowRoot.querySelector("radar-chart");
    expect(radar.categories).to.deep.equal(["intro", "sound", "waves"]);
    // waves: 1 of 2 answered right first time, 3 of 4 done
    expect(radar.scores[2]).to.equal(50);
    expect(radar.targetScores[2]).to.equal(75);
    // axis text says which number is which; no first try without answers
    expect(radar.valueLabels).to.deep.equal([
      "100% first try · 100% done",
      "100% done",
      "50% first try · 75% done",
    ]);
    await radar.updateComplete;
    const axisText = [...radar.shadowRoot.querySelectorAll("tspan.pct")].map(
      (n) => n.textContent.trim(),
    );
    expect(axisText).to.deep.equal(radar.valueLabels);
    // two sections: too few for a radar
    el.view = "sections";
    await el.updateComplete;
    await el.refresh();
    await el.updateComplete;
    expect(el.chartType).to.equal("bars");
    expect(el.shadowRoot.querySelector("radar-chart")).to.equal(null);
    expect(el.shadowRoot.querySelector(".bars")).to.not.equal(null);
  });

  it("uses bars on a narrow container", async () => {
    seed();
    const el = await make(
      html`<my-learning scope="site" style="width: 360px"></my-learning>`,
    );
    await flush(80);
    await el.updateComplete;
    expect(el.chartType).to.equal("bars");
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
    expect(items.length).to.equal(7);
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
    const crumbs = (el) =>
      [...el.shadowRoot.querySelectorAll(".map-path li")].map((li) =>
        li.textContent.trim(),
      );
    const press = (node, key) =>
      node.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, composed: true }),
      );

    it("puts you at the centre, sections then their pages around you", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      expect(el._data.view).to.equal("map");
      expect(text(el, ".map-center")).to.equal("You");
      const nodes = mapNodes(el);
      expect(nodes.map((n) => n.dataset.id)).to.deep.equal([
        "ch1",
        "p1",
        "p2",
        "p2a",
        "ch2",
        "p3",
      ]);
      expect(nodes.every((n) => n.tagName === "BUTTON")).to.equal(true);
      const byId = (id) => nodes.find((n) => n.dataset.id === id);
      expect(byId("p1").dataset.state).to.equal("done");
      expect(byId("p2").dataset.state).to.equal("in-progress");
      expect(byId("p2a").dataset.state).to.equal("not-started");
      expect(byId("ch1").dataset.state).to.equal("in-progress");
      expect(byId("ch1").getAttribute("aria-label")).to.equal(
        "Chapter 1, In progress, 1 of 4 pages done",
      );
      expect(byId("p3").getAttribute("aria-label")).to.equal(
        "Sound, Done, 1 of 1 activities done",
      );
      // one tab stop, the legend in words, the table with every node
      expect(nodes.filter((n) => n.tabIndex === 0).length).to.equal(1);
      expect(text(el, ".map-legend")).to.equal(
        "Done In progress Visited Not started",
      );
      expect(
        el.shadowRoot.querySelectorAll(".map ~ details tbody tr").length,
      ).to.equal(6);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("moves with arrow keys, drills in with Enter and out with Escape", async () => {
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
      // Enter on a button is a click: drill into the section
      el.shadowRoot.activeElement.click();
      await el.updateComplete;
      await flush();
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
      mapNodes(el)[0].click();
      await el.updateComplete;
      nodes = mapNodes(el);
      expect(nodes.map((n) => n.dataset.kind)).to.deep.equal([
        "activity",
        "activity",
      ]);
      expect(nodes.map((n) => n.title)).to.deep.equal([
        "q1",
        "Wave on a slinky",
      ]);
      expect(text(el, ".map-center")).to.contain("Waves 101");
      expect(text(el, ".map-center")).to.contain("2 of 2 activities done");
      // Escape steps out one level, focus on the page we came from
      const evt = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      el.shadowRoot.activeElement.dispatchEvent(evt);
      expect(evt.defaultPrevented).to.equal(true);
      await el.updateComplete;
      await flush();
      expect(text(el, ".map-center-title")).to.equal("Chapter 1");
      expect(el.shadowRoot.activeElement.dataset.id).to.equal("p1");
      // the breadcrumb steps all the way out
      el.shadowRoot.querySelector(".map-path button").click();
      await el.updateComplete;
      expect(text(el, ".map-center")).to.equal("You");
      // at the top Escape is left for the dialog
      const top = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      mapNodes(el)[0].dispatchEvent(top);
      expect(top.defaultPrevented).to.equal(false);
    });

    it("drills from a page in the outer ring straight to its activities", async () => {
      seed();
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      mapNodes(el)
        .find((n) => n.dataset.id === "p2")
        .click();
      await el.updateComplete;
      expect(crumbs(el)).to.deep.equal(["You", "Chapter 1", "Energy"]);
      expect(mapNodes(el).length).to.equal(2);
    });

    it("shows sections only on a big site, every page still in the table", async () => {
      const many = [item("big", null, 0, "Big section")];
      for (let i = 0; i < 60; i++) {
        many.push(item(`b${i}`, "big", i, `Page ${i}`));
      }
      store.manifest = { ...JSON.parse(JSON.stringify(MANIFEST)), items: many };
      store.activeId = "b1";
      visit("b1");
      const el = await make(
        html`<my-learning scope="site" view="map"></my-learning>`,
      );
      expect(mapNodes(el).map((n) => n.dataset.id)).to.deep.equal(["big"]);
      expect(mapNodes(el)[0].tabIndex).to.equal(0);
      expect(
        el.shadowRoot.querySelectorAll(".map ~ details tbody tr").length,
      ).to.equal(61);
      mapNodes(el)[0].click();
      await el.updateComplete;
      expect(mapNodes(el).length).to.equal(60);
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
      mapNodes(el)[0].click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("img")).to.equal(null);
      expect(globalThis.__mlMap).to.equal(undefined);
      expect(text(el, ".map-center")).to.contain(evil);
      expect(mapNodes(el)[0].getAttribute("title")).to.equal(evil);
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
    expect(list.length).to.equal(7);
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
  });
});
