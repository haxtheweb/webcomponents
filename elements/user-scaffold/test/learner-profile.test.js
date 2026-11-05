import { expect } from "@open-wc/testing";
import "../user-scaffold.js";
import {
  IndexedDBStatementAdapter,
  LocalStorageMemoryAdapter,
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "../lib/user-scaffold-storage.js";

const SITE = "site-1";
let n = 0;
// small xAPI statement, the shape user-action's buildStatement makes
const st = (objectId, verb, result = {}, tag = "multiple-choice") => ({
  id: `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`,
  verb: {
    id: `http://adlnet.gov/expapi/verbs/${verb}`,
    display: { "en-US": verb },
  },
  object: {
    id: objectId,
    objectType: "Activity",
    definition: { name: { "en-US": objectId } },
  },
  result,
  context: {
    extensions: { "https://haxtheweb.org/xapi/extensions/element": tag },
  },
  timestamp: new Date(Date.now() + n).toISOString(),
});
const answered = (id, success, attempts = 1, max = 0, done) =>
  st(id, "answered", {
    success,
    completion: done != null ? done : success,
    response: success ? "right" : "wrong",
    score: { raw: success ? 1 : 0, max: 1, min: 0, scaled: success ? 1 : 0 },
    extensions: {
      "https://haxtheweb.org/xapi/extensions/attempts": attempts,
      "https://haxtheweb.org/xapi/extensions/max-attempts": max,
    },
  });

function freshScaffold() {
  const el = globalThis.document.createElement("user-scaffold");
  el.setMemoryAdapter(new MemoryMemoryAdapter());
  el.setStatementAdapter(new MemoryStatementAdapter());
  return el;
}

describe("user-scaffold learner profile", () => {
  let us;
  beforeEach(() => {
    us = freshScaffold();
  });
  afterEach(() => {
    us.disconnectedCallback();
  });

  it("keeps one versioned profile in long-term memory", () => {
    const p = us.readProfile();
    expect(p.v).to.equal(1);
    expect(p).to.have.keys(["v", "preferences", "session", "sites"]);
    us.writePreference("darkMode", true);
    us.recordSession({ login: true });
    const again = us.readProfile();
    expect(again.preferences.darkMode).to.equal(true);
    expect(again.session.visits).to.equal(1);
    expect(again.session.lastLogin).to.be.a("string");
    expect(us._memoryAdapter.load().profile.preferences.darkMode).to.equal(
      true,
    );
  });

  it("moves a record kept under the old fingerprint id once", () => {
    us.recordStatement(SITE, answered("old-fp", true), {
      page: "p1",
      trackable: true,
    });
    // read with the new id: found through the legacy id and moved
    const a = us.readActivity(SITE, "new-res", "old-fp");
    expect(a.status).to.equal("correct");
    expect(a.migratedFrom).to.equal("old-fp");
    expect(us.readActivity(SITE, "old-fp")).to.equal(null);
    expect(us.readSite(SITE).pages.p1.activities).to.deep.equal(["new-res"]);
    // once only: new data under the new id is never replaced by old data
    us.recordStatement(SITE, answered("old-fp-2", false), { page: "p1" });
    us.recordStatement(SITE, answered("new-2", true), { page: "p1" });
    expect(us.readActivity(SITE, "new-2", "old-fp-2").success).to.equal(true);
    expect(us.readActivity(SITE, "old-fp-2").success).to.equal(false);
  });

  it("moves the old record when the first new statement arrives", () => {
    us.recordStatement(SITE, answered("fp", false, 1, 3, false), {
      page: "p2",
      trackable: true,
    });
    us.recordStatement(SITE, answered("res", true, 2, 3), {
      page: "p2",
      trackable: true,
      legacyId: "fp",
      responseText: "Huey, Dewey",
    });
    const a = us.readActivity(SITE, "res");
    expect(a.count).to.equal(2);
    expect(a.attempts).to.equal(2);
    expect(a.responseText).to.equal("Huey, Dewey");
    expect(us.readSite(SITE).pages.p2.activities).to.deep.equal(["res"]);
    expect(us.pageProgress(SITE, "p2").engaged).to.equal(1);
  });

  it("gives each site a pseudonymous actor", () => {
    const a = us.siteActor(SITE, { url: "https://s.test/" });
    expect(a.objectType).to.equal("Agent");
    expect(Object.keys(a.account).sort()).to.deep.equal(["homePage", "name"]);
    expect(a.account.homePage).to.equal("https://s.test/");
    expect(us.siteActor(SITE)).to.deep.equal(a);
  });

  it("records attempts, accuracy and the answer, once per statement", () => {
    const s = answered("q1", false, 1, 3, false);
    us.recordStatement(SITE, s, { page: "p1", trackable: true });
    expect(us.recordStatement(SITE, s, { page: "p1" })).to.equal(null);
    us.recordStatement(SITE, answered("q1", true, 2, 3), {
      page: "p1",
      trackable: true,
    });
    const a = us.readActivity(SITE, "q1");
    expect(a.count).to.equal(2);
    expect(a.attempts).to.equal(2);
    expect(a.maxAttempts).to.equal(3);
    expect(a.status).to.equal("correct");
    expect(a.response).to.equal("right");
    expect(a.done).to.equal(true);
    expect(a.tag).to.equal("multiple-choice");
    const site = us.readSite(SITE);
    expect(site.counts.byElement["multiple-choice"].answered).to.equal(2);
    expect(site.counts.byVerb.answered).to.equal(2);
    expect(site.pages.p1.activities).to.deep.equal(["q1"]);
  });

  it("never records an activity id that would reach Object.prototype", () => {
    for (const bad of ["__proto__", "constructor", "prototype"]) {
      expect(
        us.recordStatement(SITE, answered(bad, true), { page: "p1" }),
      ).to.equal(null);
    }
    expect({}.responseText).to.equal(undefined);
    expect({}.count).to.equal(undefined);
  });

  it("ignores an import for an activity that already has data", () => {
    us.recordStatement(SITE, answered("q1", true), { page: "p1" });
    expect(
      us.recordStatement(SITE, st("q1", "progressed"), {
        page: "p1",
        imported: true,
      }),
    ).to.equal(null);
    expect(
      us.recordStatement(SITE, st("list", "progressed"), {
        page: "p1",
        imported: true,
      }).imported,
    ).to.equal(true);
  });

  it("marks a page done only when every trackable activity on it is done", () => {
    expect(us.pageStatus(SITE, "p1")).to.equal("not-started");
    us.recordPageVisit(SITE, "p1", { title: "One" });
    expect(us.pageStatus(SITE, "p1")).to.equal("visited");
    // not trackable: never holds a page back
    us.recordStatement(SITE, st("seen", "experienced", {}, "user-action"), {
      page: "p1",
      trackable: false,
    });
    expect(us.pageStatus(SITE, "p1")).to.equal("visited");
    us.recordStatement(SITE, answered("q1", true), {
      page: "p1",
      trackable: true,
    });
    us.recordStatement(SITE, answered("q2", false, 1, 0, false), {
      page: "p1",
      trackable: true,
    });
    expect(us.pageStatus(SITE, "p1")).to.equal("in-progress");
    // out of attempts counts as done
    us.recordStatement(SITE, answered("q2", false, 2, 2, true), {
      page: "p1",
      trackable: true,
    });
    expect(us.pageStatus(SITE, "p1")).to.equal("done");
    // two more trackable activities on the page the learner hasn't touched
    us.setPageTrackable(SITE, "p1", 4, { "multiple-choice": 4 });
    expect(us.pageProgress(SITE, "p1")).to.deep.equal({
      status: "in-progress",
      engaged: 2,
      done: 2,
      trackable: 4,
    });
    us.recordStatement(SITE, answered("q3", true), {
      page: "p1",
      trackable: true,
    });
    us.recordStatement(SITE, answered("q4", true), {
      page: "p1",
      trackable: true,
    });
    expect(us.pageStatus(SITE, "p1")).to.equal("done");
    const site = us.siteProgress(SITE, ["p1", "p2", "p3"]);
    expect(site.done).to.equal(1);
    expect(site.total).to.equal(3);
    expect(site.engaged).to.equal(true);
    expect(site.byPage).to.deep.equal({
      p1: "done",
      p2: "not-started",
      p3: "not-started",
    });
  });

  it("clears one site and its statements", async () => {
    us.recordStatement(SITE, answered("q1", true), { page: "p1" });
    us.recordStatement("other", answered("q9", true), { page: "x" });
    expect((await us.statements(SITE)).length).to.equal(1);
    await us.clearSite(SITE);
    expect(us.readSite(SITE)).to.equal(null);
    expect((await us.statements(SITE)).length).to.equal(0);
    expect(us.readSite("other")).to.not.equal(null);
  });

  it("imports legacy preference keys once and leaves them in place", () => {
    const store = new Map([
      ["video-player-ad-https://v.test/a.mp4", "true"],
      ["app-hax-darkMode", "true"],
      ["unrelated", "1"],
    ]);
    const fake = {
      get length() {
        return store.size;
      },
      key: (i) => Array.from(store.keys())[i],
      getItem: (k) => (store.has(k) ? store.get(k) : null),
    };
    expect(us.importLegacyPreferences(fake)).to.equal(true);
    expect(us.readPreference("audioDescription")).to.deep.equal({
      "https://v.test/a.mp4": true,
    });
    expect(us.readPreference("darkMode")).to.equal(true);
    expect(us.importLegacyPreferences(fake)).to.equal(false);
    expect(store.size).to.equal(3);
  });

  it("deleting one long-term key keeps the rest (the profile)", () => {
    const ls = new LocalStorageMemoryAdapter("user-scaffold-test-lt");
    us.setMemoryAdapter(ls);
    us.writePreference("darkMode", false);
    us.writeMemory("ViewOnlyMode", true, "long");
    us.deleteMemory("ViewOnlyMode", "long");
    const saved = ls.load();
    expect(saved.ViewOnlyMode).to.equal(undefined);
    expect(saved.profile.preferences.darkMode).to.equal(false);
    ls.clear();
  });
});

describe("user-scaffold summarize", () => {
  let us;
  const outline = [
    { id: "unit1", parent: null, title: "Unit 1", tags: "waves" },
    { id: "p1", parent: "unit1", title: "Sound", tags: "waves, sound" },
    { id: "p2", parent: "unit1", title: "Light", tags: ["waves"] },
    { id: "unit2", parent: null, title: "Unit 2", tags: "" },
    { id: "p3", parent: "unit2", title: "Review", tags: "" },
  ];
  beforeEach(() => {
    us = freshScaffold();
    us.recordPageVisit(SITE, "p1");
    us.setPageTrackable(SITE, "p1", 3, {});
    us.recordStatement(SITE, answered("q1", true), {
      page: "p1",
      trackable: true,
    });
    us.recordStatement(SITE, answered("q2", false, 1, 0, false), {
      page: "p1",
      trackable: true,
    });
    us.recordStatement(
      SITE,
      st("vid", "completed", { completion: true }, "video-player"),
      {
        page: "p2",
        trackable: true,
      },
    );
    us.recordStatement(SITE, st("p3", "experienced", {}, "haxcms-page"), {
      page: "p3",
      trackable: false,
    });
  });
  afterEach(() => us.disconnectedCallback());

  it("groups by verb and by element over the whole site", () => {
    const v = us.summarize({ site: SITE, outline, groupBy: "verb" });
    expect(v.groups.answered.statements).to.equal(2);
    expect(v.groups.completed.done).to.equal(1);
    expect(v.groups.experienced.statements).to.equal(1);
    expect(v.totals.accuracy).to.equal(0.5);
    const e = us.summarize({ site: SITE, outline, groupBy: "element" });
    expect(e.groups["multiple-choice"].activities).to.equal(2);
    expect(e.groups["video-player"].done).to.equal(1);
  });

  it("groups by page tag and by section, resolved from the outline", () => {
    const t = us.summarize({ site: SITE, outline, groupBy: "tag" });
    expect(t.groups.waves.activities).to.equal(3);
    expect(t.groups.sound.activities).to.equal(2);
    expect(t.groups["(untagged)"].activities).to.equal(1);
    const s = us.summarize({ site: SITE, outline, groupBy: "section" });
    expect(s.groups.unit1.activities).to.equal(3);
    expect(s.groups.unit1.trackable).to.equal(3);
    expect(s.groups.unit2.activities).to.equal(1);
  });

  it("limits to a scope of the outline", () => {
    const page = us.summarize({
      site: SITE,
      outline,
      scope: "page",
      pageId: "p1",
    });
    expect(page.totals.activities).to.equal(2);
    expect(page.totals.answered).to.equal(2);
    expect(page.totals.correct).to.equal(1);
    const branch = us.summarize({
      site: SITE,
      outline,
      scope: "branch",
      pageId: "unit1",
    });
    expect(branch.pages).to.deep.equal(["unit1", "p1", "p2"]);
    expect(branch.totals.activities).to.equal(3);
    const children = us.summarize({
      site: SITE,
      outline,
      scope: "children",
      pageId: "unit2",
    });
    expect(children.totals.activities).to.equal(1);
    const parent = us.summarize({
      site: SITE,
      outline,
      scope: "parent",
      pageId: "p2",
    });
    expect(parent.totals.activities).to.equal(3);
  });

  it("covers explicit pages, sections under a root and activity kinds", () => {
    // q3 wrong first, then right: right in the end, not right first time
    us.recordStatement(SITE, answered("q3", false), {
      page: "p2",
      trackable: true,
    });
    us.recordStatement(SITE, answered("q3", true, 2), {
      page: "p2",
      trackable: true,
    });
    const only = us.summarize({ site: SITE, outline, pages: ["p2"] });
    expect(only.pages).to.deep.equal(["p2"]);
    expect(only.totals.activities).to.equal(2);
    expect(only.totals.answered).to.equal(1);
    expect(only.totals.correct).to.equal(1);
    expect(only.totals.firstTryCorrect).to.equal(0);
    expect(only.totals.firstTryAccuracy).to.equal(0);
    const all = us.summarize({ site: SITE, outline });
    // q1 right first time, q2 wrong, q3 right on the second try
    expect(all.totals.firstTryCorrect).to.equal(1);
    expect(all.totals.firstTryAccuracy).to.equal(0.333);
    expect(all.totals.accuracy).to.equal(0.667);
    expect(all.totals.engaged).to.equal(4);
    expect(all.totals.engagedDone).to.equal(3);
    expect(all.totals.visited).to.equal(1);
    const under = us.summarize({
      site: SITE,
      outline,
      groupBy: "section",
      pages: ["unit1", "p1", "p2"],
      sectionRoot: "unit1",
    });
    expect(Object.keys(under.groups).sort()).to.deep.equal(["p1", "p2"]);
    expect(under.groups.p1.activities).to.equal(2);
    const kinds = us.summarize({
      site: SITE,
      outline,
      groupBy: "activity",
      kindOf: (a) => (a.tag === "video-player" ? "videos" : ""),
    });
    expect(Object.keys(kinds.groups)).to.deep.equal(["videos"]);
    expect(kinds.totals.activities).to.equal(5);
    const byVerb = us.summarize({ site: SITE, outline, groupBy: "activity" });
    expect(byVerb.groups.answered.activities).to.equal(3);
    const tracked = us.summarize({ site: SITE, outline, trackableOnly: true });
    expect(tracked.totals.activities).to.equal(4);
  });

  it("treats any tag or verb as a plain group key", () => {
    const evil = [
      { id: "p9", parent: null, title: "x", tags: "__proto__, constructor" },
    ];
    us.recordStatement(SITE, answered("q9", true), {
      page: "p9",
      trackable: true,
    });
    const t = us.summarize({ site: SITE, outline: evil, groupBy: "tag" });
    expect(
      Object.prototype.hasOwnProperty.call(t.groups, "__proto__"),
    ).to.equal(true);
    expect(t.groups.constructor.activities).to.equal(1);
    expect({}.activities).to.equal(undefined);
    expect({}.pages).to.equal(undefined);
  });
});

describe("user-scaffold across reloads and tabs", () => {
  const KEY = "user-scaffold-test-reload";
  afterEach(() => new LocalStorageMemoryAdapter(KEY).clear());
  const scaffold = () => {
    const el = globalThis.document.createElement("user-scaffold");
    el.setMemoryAdapter(new LocalStorageMemoryAdapter(KEY));
    el.setStatementAdapter(new MemoryStatementAdapter());
    return el;
  };

  it("keeps activities and visits after a reload", () => {
    const a = scaffold();
    a.recordPageVisit(SITE, "p1");
    a.recordStatement(SITE, answered("q1", true), { page: "p1" });
    a.disconnectedCallback();
    // a new page load reads what the last one saved
    const b = scaffold();
    const site = b.readSite(SITE);
    expect(site.pages.p1.visits).to.equal(1);
    expect(site.activities.q1.done).to.equal(true);
    expect(b.pageProgress(SITE, "p1").status).to.equal("done");
    b.disconnectedCallback();
  });

  it("takes another tab's save before writing its own", () => {
    const older = scaffold(); // opened first, loads an empty profile
    const newer = scaffold();
    newer.recordStatement(SITE, answered("q1", true), { page: "p1" });
    // the browser tells the older tab about the newer tab's save
    globalThis.dispatchEvent(
      new StorageEvent("storage", { key: KEY, newValue: "x" }),
    );
    older.recordPageVisit(SITE, "p2");
    const saved = new LocalStorageMemoryAdapter(KEY).load();
    expect(Object.keys(saved.profile.sites[SITE].activities)).to.deep.equal([
      "q1",
    ]);
    expect(saved.profile.sites[SITE].pages.p2.visits).to.equal(1);
    // other keys are ignored
    globalThis.dispatchEvent(new StorageEvent("storage", { key: "other" }));
    expect(older.readSite(SITE).activities.q1.done).to.equal(true);
    older.disconnectedCallback();
    newer.disconnectedCallback();
  });

  it("repairs a site from its statements, once", () => {
    const us = freshScaffold();
    const stored = [
      st("p1", "experienced", {}, "haxcms-page"),
      answered("q1", false),
      answered("q1", true, 2),
      st("p1", "experienced", {}, "haxcms-page"),
    ];
    const opts = {
      pageOf: () => "p1",
      trackableOf: (tag) => tag !== "haxcms-page",
      pageElement: "haxcms-page",
    };
    expect(us.repairSite(SITE, stored, opts)).to.be.greaterThan(0);
    const site = us.readSite(SITE);
    expect(site.activities.q1.count).to.equal(2);
    expect(site.activities.q1.firstTry).to.equal(false);
    expect(site.activities.p1.trackable).to.equal(false);
    expect(site.pages.p1.visits).to.equal(2);
    expect(us.repairSite(SITE, stored, opts)).to.equal(0);
    expect(us.readSite(SITE).activities.q1.count).to.equal(2);
    expect(us.repairSite("", stored, opts)).to.equal(0);
    expect(us.repairSite(SITE, stored, {})).to.equal(0);
    us.disconnectedCallback();
  });
});

describe("user-scaffold clearAll", () => {
  it("forgets the whole profile and every site's statements", async () => {
    const us = freshScaffold();
    us.writePreference("darkMode", true);
    us.writeMemory("otherKey", 5, "long");
    us.recordStatement("s1", answered("q1", true), { page: "a" });
    us.recordStatement("s2", answered("q2", true), { page: "b" });
    await us.statements("s1");
    await us.clearAll();
    expect(us.readSite("s1")).to.equal(null);
    expect(us.readSite("s2")).to.equal(null);
    expect(us.readPreference("darkMode")).to.equal(null);
    expect(await us.statements("s1")).to.deep.equal([]);
    expect(await us.statements("s2")).to.deep.equal([]);
    expect(us.readMemory("otherKey")).to.equal(5);
    us.disconnectedCallback();
  });

  it("clears each known site when the adapter has no clearAll", async () => {
    const us = freshScaffold();
    const cleared = [];
    us.setStatementAdapter({
      add: async () => true,
      list: async () => [],
      clear: async (site) => cleared.push(site),
    });
    us.recordStatement("s1", answered("q1", true), { page: "a" });
    us.recordStatement("s2", answered("q2", true), { page: "b" });
    await us.clearAll();
    expect(cleared.sort()).to.deep.equal(["s1", "s2"]);
    us.disconnectedCallback();
  });
});

describe("IndexedDB statement adapter", () => {
  it("adds, lists per site and clears (real IndexedDB)", async () => {
    const db = new IndexedDBStatementAdapter({
      dbName: `user-scaffold-test-${Date.now()}`,
    });
    const a = answered("q1", true);
    const b = answered("q2", false);
    expect(await db.add("s1", a)).to.equal(true);
    await db.add("s1", a);
    await db.add("s1", b);
    await db.add("s2", answered("q3", true));
    const list = await db.list("s1");
    expect(list.map((s) => s.id)).to.deep.equal([a.id, b.id]);
    await db.clear("s1");
    expect(await db.list("s1")).to.deep.equal([]);
    expect((await db.list("s2")).length).to.equal(1);
    await db.clearAll();
    expect(await db.list("s2")).to.deep.equal([]);
  });

  it("falls back to memory when IndexedDB is missing", async () => {
    const db = new IndexedDBStatementAdapter({ indexedDB: null });
    db.indexedDB = null;
    const a = answered("q1", true);
    await db.add("s1", a);
    expect((await db.list("s1")).length).to.equal(1);
  });
});
