import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import {
  HAXCMSReadingProgress,
  checkpointGateMet,
  checkpointInView,
  readShare,
} from "../lib/core/haxcms-reading-progress.js";
import "../lib/ui-components/navigation/site-menu.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import {
  buildStatement,
  XAPI_EXTENSIONS,
  XAPI_VERBS,
  XAPI_VIDEO_PROGRESS,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  XAPI_VOCABULARY,
  XAPI_DECLARED_SILENT,
  XAPI_READING_CHECKPOINT_TAGS,
} from "@haxtheweb/user-action/lib/xapi-vocabulary.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const until = async (test, ms = 3000) => {
  const end = Date.now() + ms;
  while (!test() && Date.now() < end) {
    await flush(25);
  }
  return test();
};
const page = (id, order, title) => ({
  id,
  title,
  slug: id,
  location: `pages/${id}/index.html`,
  parent: null,
  indent: 0,
  order,
  metadata: {},
});
const MANIFEST = {
  id: "rp-site",
  title: "Reading 101",
  metadata: { platform: {}, theme: { variables: {} }, site: { settings: {} } },
  items: [
    page("r1", 0, "Intro"),
    page("r2", 1, "Long read"),
    page("r3", 2, "Mixed"),
  ],
};
const urlOf = (id) => new URL(id, document.baseURI).href;
const vh = () => globalThis.innerHeight;

async function goTo(id) {
  store.activeId = id;
  await flush();
}
// the site builder put a page's content in the theme
function showContent(host, id, body) {
  host.innerHTML = `<page-break break-type="site" item-id="${id}"></page-break>${body}`;
  globalThis.dispatchEvent(
    new CustomEvent("json-outline-schema-active-body-changed", {
      detail: host.innerHTML,
    }),
  );
}
const readingStatements = async (pageId) =>
  (await UserScaffoldInstance.statements("rp-site")).filter(
    (s) =>
      s.object.id === urlOf(pageId) &&
      s.context.extensions[XAPI_EXTENSIONS.element] === "haxcms-page" &&
      s.verb.display["en-US"] !== "experienced",
  );

describe("readShare", () => {
  it("is the share of the region above the bottom of the viewport", () => {
    expect(readShare({ top: 0, bottom: 2000, height: 2000 }, 500)).to.equal(
      0.25,
    );
    expect(readShare({ top: -500, bottom: 1500, height: 2000 }, 500)).to.equal(
      0.5,
    );
    // end on screen (within a few pixels)
    expect(readShare({ top: -1500, bottom: 505, height: 2005 }, 500)).to.equal(
      1,
    );
    // not reached yet, not laid out
    expect(readShare({ top: 600, bottom: 900, height: 300 }, 500)).to.equal(0);
    expect(readShare({ top: 0, bottom: 0, height: 0 }, 500)).to.equal(null);
  });
  it("reads content shorter than the viewport once it is visible", () => {
    expect(readShare({ top: 100, bottom: 300, height: 200 }, 500)).to.equal(1);
    // half of a short region below the fold: not all of it seen yet
    expect(readShare({ top: 400, bottom: 600, height: 200 }, 500)).to.equal(
      0.5,
    );
  });
});

describe("HAXCMSReadingProgress tracker", () => {
  let region;
  let reports;
  let tracker;
  let enabled;
  beforeEach(async () => {
    region = await fixture(
      html`<div style="height: ${vh() * 4}px; margin: 0;"></div>`,
    );
    globalThis.scrollTo(0, 0);
    reports = [];
    enabled = true;
    tracker = new HAXCMSReadingProgress({
      report: (verb, share, p) => reports.push([verb, share, p.id]),
      enabled: () => enabled,
      throttleMs: 0,
      settleMs: 0,
    });
  });
  afterEach(() => {
    tracker.end();
    globalThis.scrollTo(0, 0);
  });
  const scrollToShare = (share) => {
    const top = region.getBoundingClientRect().top + globalThis.scrollY;
    globalThis.scrollTo(0, top + region.offsetHeight * share - vh());
  };

  it("measures nothing until the content is ready", () => {
    tracker.begin({ id: "a" }, region);
    scrollToShare(0.6);
    expect(tracker.measure()).to.equal(0);
    expect(reports).to.deep.equal([]);
  });

  it("coalesces thresholds crossed at once into one progressed", async () => {
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    expect(reports).to.deep.equal([]);
    scrollToShare(0.6);
    await until(() => reports.length > 0);
    expect(reports).to.have.length(1);
    expect(reports[0][0]).to.equal("progressed");
    expect(reports[0][1]).to.be.within(0.55, 0.65);
    // going back up never lowers it or reports again
    globalThis.scrollTo(0, 0);
    tracker.measure();
    expect(tracker.share).to.be.within(0.55, 0.65);
    scrollToShare(0.8);
    tracker.measure();
    expect(reports.map((r) => r[0])).to.deep.equal([
      "progressed",
      "progressed",
    ]);
    scrollToShare(1);
    await until(() => reports.length > 2);
    expect(reports[2]).to.deep.equal(["completed", 1, "a"]);
    // once done, nothing more for this visit (and nothing on leave)
    tracker.measure();
    tracker.end();
    expect(reports).to.have.length(3);
  });

  it("reports how far the learner got when the visit ends part way", () => {
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    scrollToShare(0.4);
    tracker.measure();
    expect(reports).to.have.length(1);
    scrollToShare(0.45);
    tracker.measure();
    expect(reports).to.have.length(1);
    tracker.begin({ id: "b" }, region);
    expect(reports).to.have.length(2);
    expect(reports[1][0]).to.equal("progressed");
    expect(reports[1][2]).to.equal("a");
    expect(reports[1][1]).to.be.within(0.42, 0.48);
  });

  it("flushes part way when the tab goes away and keeps tracking", () => {
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    scrollToShare(0.4);
    tracker.measure();
    scrollToShare(0.45);
    tracker.measure();
    tracker.flush();
    tracker.flush();
    expect(reports.map((r) => r[0])).to.deep.equal([
      "progressed",
      "progressed",
    ]);
    expect(tracker.page.id).to.equal("a");
    // a clear: nothing reported for what was read before it
    tracker.discard();
    expect(reports).to.have.length(2);
    expect(tracker.page).to.equal(null);
  });

  it("waits for content to settle before calling a short page read", async () => {
    region.style.height = `${Math.round(vh() / 3)}px`;
    tracker.settleMs = 150;
    tracker.begin({ id: "short" }, region);
    tracker.ready();
    expect(reports).to.deep.equal([]);
    await until(() => reports.length > 0, 1000);
    expect(reports).to.deep.equal([["completed", 1, "short"]]);
  });

  it("reports nothing while disabled (edit mode)", () => {
    enabled = false;
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    scrollToShare(1);
    tracker.measure();
    tracker.end();
    expect(reports).to.deep.equal([]);
  });

  it("is documented in the xAPI vocabulary", () => {
    const v = XAPI_VOCABULARY["haxcms-page"];
    expect(v.verbs).to.deep.equal(["experienced", "progressed", "completed"]);
    expect(v.result).to.include(`extensions.${XAPI_EXTENSIONS.progress}`);
    // reading counts on every page by itself, not as a scanned element
    expect(v.countsTowardCompletion).to.equal(false);
    expect(LearnerProgress.isTrackable("haxcms-page")).to.equal(false);
  });
});

describe("reading checkpoints", () => {
  let region;
  let marks;
  let reports;
  let remembered;
  let tracker;
  // a long region with five checkpoints spread through it
  beforeEach(async () => {
    region = await fixture(
      html`<div style="height: ${vh() * 5}px; margin: 0; position: relative;">
        ${[0.1, 0.3, 0.5, 0.7, 0.9].map(
          (at) =>
            html`<div
              class="mark"
              style="position: absolute; left: 0; width: 200px; height: 80px; top: ${
                vh() * 5 * at
              }px;"
            ></div>`,
        )}
      </div>`,
    );
    marks = Array.from(region.querySelectorAll(".mark"));
    globalThis.scrollTo(0, 0);
    reports = [];
    remembered = [];
    tracker = new HAXCMSReadingProgress({
      report: (verb, share, p, evidence) =>
        reports.push({ verb, share, evidence }),
      checkpoints: () => marks,
      onCheckpoint: (indexes) => remembered.push(...indexes),
      throttleMs: 0,
      settleMs: 0,
      dwellMs: 40,
    });
  });
  afterEach(() => {
    tracker.end();
    globalThis.scrollTo(0, 0);
  });
  const bottom = () => globalThis.scrollTo(0, document.body.scrollHeight);
  const lookAt = async (mark) => {
    mark.scrollIntoView({ block: "center" });
    tracker.measure();
    await flush(120);
    tracker.measure();
  };

  it("says when a checkpoint is on screen enough, or not laid out", () => {
    const h = 800;
    const box = (top, height, width = 100) => ({
      top,
      bottom: top + height,
      height,
      width,
    });
    expect(checkpointInView(box(100, 80), h)).to.equal(true);
    // half of it on screen is enough, a sliver is not
    expect(checkpointInView(box(h - 40, 80), h)).to.equal(true);
    expect(checkpointInView(box(h - 10, 80), h)).to.equal(false);
    expect(checkpointInView(box(-70, 80), h)).to.equal(false);
    // taller than the screen: a quarter of the screen is enough
    expect(checkpointInView(box(h - 200, 3000), h)).to.equal(true);
    expect(checkpointInView(box(h - 100, 3000), h)).to.equal(false);
    // closed collapse, unselected tab, display none
    expect(checkpointInView(box(100, 0), h)).to.equal(null);
    expect(checkpointInView(box(100, 80, 0), h)).to.equal(null);
  });

  it("asks for 80% of the checkpoints, and nothing of a page without any", () => {
    expect(checkpointGateMet(0, 0)).to.equal(true);
    expect(checkpointGateMet(4, 5)).to.equal(true);
    expect(checkpointGateMet(3, 5)).to.equal(false);
    expect(checkpointGateMet(1, 1)).to.equal(true);
  });

  it("is read at 90% scrolled, not at the last pixel", async () => {
    marks = [];
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    const top = region.getBoundingClientRect().top + globalThis.scrollY;
    globalThis.scrollTo(0, top + region.offsetHeight * 0.92 - vh());
    await until(() => reports.some((r) => r.verb === "completed"));
    const done = reports.find((r) => r.verb === "completed");
    expect(done.share).to.equal(1);
    // no checkpoints on the page: no evidence to carry
    expect(done.evidence).to.equal(null);
  });

  it("does not read a page flung to the bottom past its checkpoints", async () => {
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    bottom();
    await flush(200);
    tracker.measure();
    expect(tracker.completed).to.equal(false);
    // the share reported stops short of read, with what was seen
    tracker.flush();
    const last = reports[reports.length - 1];
    expect(last.verb).to.equal("progressed");
    expect(last.share).to.equal(0.9);
    expect(last.evidence.total).to.equal(5);
    expect(last.evidence.seen).to.be.below(4);
    expect(reports.some((r) => r.verb === "completed")).to.equal(false);
  });

  it("reads the page from anywhere once enough checkpoints were looked at", async () => {
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    bottom();
    await flush(120);
    tracker.measure();
    expect(tracker.completed).to.equal(false);
    // going back up to them is enough: no need to be at the bottom again
    for (const mark of marks.slice(0, 4)) {
      if (!tracker.completed) {
        await lookAt(mark);
      }
    }
    await until(() => tracker.completed);
    const done = reports[reports.length - 1];
    expect(done.verb).to.equal("completed");
    expect(done.share).to.equal(1);
    expect(done.evidence.total).to.equal(5);
    expect(done.evidence.seen).to.be.at.least(4);
    expect(done.evidence.missed.length).to.equal(5 - done.evidence.seen);
    // each one is remembered once, and nothing more is looked at once read
    expect(new Set(remembered).size).to.equal(remembered.length);
    const count = reports.length;
    await lookAt(marks[2]);
    expect(reports.length).to.equal(count);
  });

  it("needs a checkpoint to stay on screen, not to flash by", async () => {
    tracker.dwellMs = 5000;
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    for (const mark of marks) {
      mark.scrollIntoView({ block: "center" });
      tracker.measure();
    }
    expect(tracker.checkpointStatus().seen).to.equal(0);
  });

  it("never requires a checkpoint that is not laid out", async () => {
    // two of five are inside something closed: 3 of 3 is enough
    marks[0].style.display = "none";
    marks[1].style.display = "none";
    tracker.begin({ id: "a" }, region);
    tracker.ready();
    expect(tracker.checkpointStatus().total).to.equal(3);
    for (const mark of marks.slice(2)) {
      await lookAt(mark);
    }
    bottom();
    await until(() => tracker.completed);
    expect(reports[reports.length - 1].evidence).to.deep.equal({
      seen: 3,
      total: 3,
      missed: [],
    });
  });

  it("counts checkpoints seen on an earlier visit", async () => {
    tracker.begin({ id: "a" }, region, { seen: [0, 1, 2, 3] });
    tracker.ready();
    bottom();
    await until(() => tracker.completed);
    const done = reports[reports.length - 1];
    expect(done.verb).to.equal("completed");
    expect(done.evidence.seen).to.be.at.least(4);
  });

  it("is declared by the silent elements, next to their code", () => {
    expect(XAPI_READING_CHECKPOINT_TAGS).to.include.members([
      "accent-card",
      "grid-plate",
      "stop-note",
    ]);
    expect(XAPI_DECLARED_SILENT["page-break"].readingCheckpoint).to.equal(
      false,
    );
    Object.keys(XAPI_DECLARED_SILENT).forEach((tag) => {
      expect(XAPI_DECLARED_SILENT[tag].reason).to.be.a("string").that.is.not
        .empty;
      // silent elements are never in the list of what sends statements
      expect(XAPI_VOCABULARY[tag]).to.equal(undefined);
    });
    expect(XAPI_VOCABULARY["haxcms-page"].result).to.include(
      `extensions.${XAPI_EXTENSIONS.checkpoints}`,
    );
  });
});

describe("HAXcms learner progress: reading and page completion", () => {
  let saved;
  let host;
  before(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
      themeElement: store.themeElement,
      memory: UserScaffoldInstance._memoryAdapter,
      statements: UserScaffoldInstance._statementAdapter,
      settle: LearnerProgress.reading.settleMs,
      throttle: LearnerProgress.reading.throttleMs,
    };
  });
  beforeEach(async () => {
    UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
    UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
    LearnerProgress.reading.settleMs = 0;
    LearnerProgress.reading.throttleMs = 0;
    globalThis.scrollTo(0, 0);
    store.editMode = false;
    store.activeId = null;
    host = await fixture(html`<div id="theme"></div>`);
    store.themeElement = host;
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    LearnerProgress.start();
    await flush();
  });
  afterEach(() => {
    LearnerProgress.reading.end();
    globalThis.scrollTo(0, 0);
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    store.themeElement = saved.themeElement;
    LearnerProgress.reading.settleMs = saved.settle;
    LearnerProgress.reading.throttleMs = saved.throttle;
    UserScaffoldInstance.setMemoryAdapter(saved.memory);
    UserScaffoldInstance.setStatementAdapter(saved.statements);
  });

  it("a page of text alone is done once read, with a valid xAPI statement", async () => {
    await goTo("r1");
    showContent(host, "r1", "<p>Short page of text.</p>");
    await until(() => LearnerProgress.pageProgress().status === "done");
    const p = LearnerProgress.pageProgress();
    expect(p).to.deep.include({
      status: "done",
      engaged: 0,
      done: 0,
      trackable: 0,
      percent: 1,
      itemsDone: 1,
      itemsTotal: 1,
    });
    expect(p.reading).to.deep.equal({
      key: urlOf("r1"),
      kind: "reading",
      tag: "haxcms-page",
      progress: 1,
      done: true,
    });
    const [s] = await readingStatements("r1");
    expect(s.verb).to.deep.equal({
      id: XAPI_VERBS.completed,
      display: { "en-US": "completed" },
    });
    expect(s.version).to.equal("1.0.3");
    expect(s.object).to.deep.include({
      id: urlOf("r1"),
      objectType: "Activity",
    });
    expect(s.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/lesson",
    );
    expect(s.result.completion).to.equal(true);
    expect(s.result.extensions).to.deep.equal({
      [XAPI_EXTENSIONS.progress]: 1,
    });
    expect(s.result.duration).to.match(/^PT[0-9.]+S$/);
    expect(s.context.extensions[XAPI_EXTENSIONS.element]).to.equal(
      "haxcms-page",
    );
    expect(s.actor.account.name).to.be.a("string");
    // the same activity the visit used
    const visit = (await UserScaffoldInstance.statements("rp-site")).find(
      (x) => x.verb.display["en-US"] === "experienced",
    );
    expect(visit.object.id).to.equal(s.object.id);
    const site = LearnerProgress.siteProgress();
    expect(site).to.deep.include({ done: 1, total: 3, engaged: true });
    expect(site.percent).to.equal(0.333);
    // the site menu rings the page open now, done once it was read
    const menu = await fixture(html`<site-menu show-progress></site-menu>`);
    await flush(150);
    await menu.updateComplete;
    expect(menu.shadowRoot.querySelector(".progress-summary")).to.equal(null);
    expect(menu.shadowRoot.querySelector("map-menu").activeProgress).to.equal(
      LearnerProgress.pageProgress().percent,
    );
    // a page already read is not tracked again
    await goTo("r2");
    await goTo("r1");
    expect(LearnerProgress.reading.page).to.equal(null);
  });

  it("a page with checkpoints is one reading record that carries what was seen", async () => {
    const dwell = LearnerProgress.reading.dwellMs;
    LearnerProgress.reading.dwellMs = 40;
    try {
      await goTo("r2");
      showContent(
        host,
        "r2",
        `<p>Intro</p>
        <stop-note title="One" style="display:block;height:80px"></stop-note>
        <div style="height:${vh() * 3}px"></div>
        <stop-note title="Two" style="display:block;height:80px"></stop-note>`,
      );
      await until(() => LearnerProgress.reading.isReady);
      expect(LearnerProgress.readingCheckpoints().length).to.equal(2);
      // flung to the bottom: the first note was never looked at
      globalThis.scrollTo(0, document.body.scrollHeight);
      await flush(200);
      LearnerProgress.reading.measure();
      expect(LearnerProgress.pageProgress().reading.done).to.equal(false);
      // what was seen is kept as state, not as a statement of its own
      const state = UserScaffoldInstance.readActivity("rp-site", urlOf("r2"));
      expect(state.reading).to.equal(true);
      expect(state.state.covered).to.deep.equal([[1, 1]]);
      // back up to the first note: the page is read from where it is
      host.querySelector("stop-note").scrollIntoView({ block: "center" });
      await until(() => LearnerProgress.pageProgress().reading.done);
      expect(LearnerProgress.pageProgress().status).to.equal("done");
      const sent = await readingStatements("r2");
      const done = sent[sent.length - 1];
      expect(done.verb.id).to.equal(XAPI_VERBS.completed);
      expect(done.result.extensions).to.deep.equal({
        [XAPI_EXTENSIONS.progress]: 1,
        [XAPI_EXTENSIONS.checkpoints]: { seen: 2, total: 2, missed: [] },
      });
      // nothing but page statements: the notes sent none
      const all = await UserScaffoldInstance.statements("rp-site");
      expect(all.every((x) => x.object.id === urlOf("r2"))).to.equal(true);
    } finally {
      LearnerProgress.reading.dwellMs = dwell;
    }
  });

  it("reports reading once per page, ever: only past where the learner got", async () => {
    const r3 = { id: "r3", url: urlOf("r3"), title: "R3", started: Date.now() };
    LearnerProgress._reportReading("progressed", 0.5, r3);
    // a later visit that reads the same share again (or less) sends nothing
    LearnerProgress._reportReading("progressed", 0.5, r3);
    LearnerProgress._reportReading("progressed", 0.3, r3);
    expect(await readingStatements("r3")).to.have.length(1);
    LearnerProgress._reportReading("progressed", 0.75, r3);
    LearnerProgress._reportReading("completed", 1, r3);
    LearnerProgress._reportReading("completed", 1, r3);
    expect(
      (await readingStatements("r3")).map((s) => s.verb.display["en-US"]),
    ).to.deep.equal(["progressed", "progressed", "completed"]);
  });

  it("tracks a long page as it is scrolled and files it under that page on leave", async () => {
    await goTo("r2");
    showContent(host, "r2", `<div style="height: ${vh() * 5}px"></div>`);
    await flush(60);
    expect(await readingStatements("r2")).to.have.length(0);
    const top = host.getBoundingClientRect().top + globalThis.scrollY;
    globalThis.scrollTo(0, top + host.offsetHeight * 0.55 - vh());
    await until(() => LearnerProgress.pageProgress().reading.progress > 0);
    let p = LearnerProgress.pageProgress();
    expect(p.status).to.equal("in-progress");
    expect(p.reading.progress).to.be.within(0.5, 0.6);
    globalThis.scrollTo(0, top + host.offsetHeight * 0.7 - vh());
    // the scroll was measured (scroll events can come late under load)
    await until(() => LearnerProgress.reading.share >= 0.65);
    // no threshold crossed: nothing new yet
    expect(await readingStatements("r2")).to.have.length(1);
    // leaving for the next page (whose content is not in yet) files what
    // was read under this one
    await goTo("r3");
    const r2 = await readingStatements("r2");
    expect(r2.map((s) => s.verb.display["en-US"])).to.deep.equal([
      "progressed",
      "progressed",
    ]);
    expect(r2[1].result.extensions[XAPI_EXTENSIONS.progress]).to.be.within(
      0.65,
      0.75,
    );
    expect(r2[1].result.completion).to.equal(false);
    // filed under r2 without renaming it after the page open now
    expect(UserScaffoldInstance.readSite("rp-site").pages.r2.title).to.equal(
      "Long read",
    );
    p = LearnerProgress.pageProgress("r2");
    expect(p.reading.progress).to.be.within(0.65, 0.75);
    expect(p.percent).to.equal(p.reading.progress);
    // r2's content still on screen is never measured as r3
    await flush(60);
    expect(await readingStatements("r3")).to.have.length(0);
    expect(LearnerProgress.pageProgress("r3").reading.progress).to.equal(0);
  });

  it("does not track reading while editing", async () => {
    store.editMode = true;
    await goTo("r1");
    showContent(host, "r1", "<p>Short.</p>");
    await flush(80);
    store.editMode = false;
    expect(await readingStatements("r1")).to.have.length(0);
    expect(LearnerProgress.pageProgress("r1").reading.done).to.equal(false);
  });

  it("averages reading and items, partial media included (83%)", async () => {
    await goTo("r3");
    showContent(
      host,
      "r3",
      "<p>Read me.</p><multiple-choice></multiple-choice><audio-player></audio-player>",
    );
    await until(() => LearnerProgress.pageProgress().reading.done);
    const send = (el, verb, objectKey, tag, result) =>
      el.dispatchEvent(
        new CustomEvent("user-engagement", {
          bubbles: true,
          composed: true,
          detail: {
            statement: buildStatement({
              verb,
              object: { id: `${urlOf("r3")}#${objectKey}` },
              result,
              context: { extensions: { [XAPI_EXTENSIONS.element]: tag } },
            }),
          },
        }),
      );
    let p = LearnerProgress.pageProgress();
    expect(p.percent).to.equal(0.333);
    send(
      host.querySelector("multiple-choice"),
      "answered",
      "q1",
      "multiple-choice",
      {
        success: true,
        completion: true,
      },
    );
    expect(LearnerProgress.pageProgress().percent).to.equal(0.667);
    // the media watched half way: (1 + 1 + 0.5) / 3
    send(
      host.querySelector("audio-player"),
      "progressed",
      "a1",
      "audio-player",
      {
        completion: false,
        extensions: { [XAPI_VIDEO_PROGRESS]: 0.5 },
      },
    );
    p = LearnerProgress.pageProgress();
    expect(p.status).to.equal("in-progress");
    expect(p.percent).to.equal(0.833);
    expect(
      p.items.map((i) => [i.kind, i.tag, i.progress, i.done]),
    ).to.deep.equal([
      ["reading", "haxcms-page", 1, true],
      ["activity", "multiple-choice", 1, true],
      ["activity", "audio-player", 0.5, false],
    ]);
  });

  it("video half watched, page read, one section opened: 83%", async () => {
    await goTo("r3");
    showContent(
      host,
      "r3",
      `<p>Read me.</p><a11y-collapse heading="More"><p>Hidden.</p></a11y-collapse><a11y-collapse heading="Open" expanded><p>Shown.</p></a11y-collapse><audio-player></audio-player>`,
    );
    await until(() => LearnerProgress.pageProgress().reading.done);
    // the section the author left open has nothing to open: not an item
    // (counted again once the elements upgraded)
    expect(
      await until(() => LearnerProgress.pageProgress().trackable === 2),
    ).to.equal(true);
    expect(
      UserScaffoldInstance.readSite("rp-site").pages.r3.trackableByTag,
    ).to.deep.equal({ "a11y-collapse": 1, "audio-player": 1 });
    host.querySelector('a11y-collapse[heading="More"]')._onClick();
    host.querySelector("audio-player").dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        detail: {
          statement: buildStatement({
            verb: "progressed",
            object: { id: `${urlOf("r3")}#a1` },
            result: {
              completion: false,
              extensions: { [XAPI_VIDEO_PROGRESS]: 0.5 },
            },
            context: {
              extensions: { [XAPI_EXTENSIONS.element]: "audio-player" },
            },
          }),
        },
      }),
    );
    const p = LearnerProgress.pageProgress();
    expect(p.percent).to.equal(0.833);
    expect(p.status).to.equal("in-progress");
    expect(p.items.map((i) => [i.tag, i.progress, i.done])).to.deep.equal([
      ["haxcms-page", 1, true],
      ["a11y-collapse", 1, true],
      ["audio-player", 0.5, false],
    ]);
  });

  it("leaves a video-player showing a plain iframe out of the count, once it upgrades", async () => {
    await goTo("r3");
    showContent(
      host,
      "r3",
      `<video-player source="https://vimeo.com/76979871"></video-player><video-player source="files/clip.mp4"></video-player>`,
    );
    // not defined yet: both count until they can say otherwise
    expect(LearnerProgress.pageProgress().trackable).to.equal(2);
    await import("@haxtheweb/video-player/video-player.js");
    const [iframe, local] = host.querySelectorAll("video-player");
    await iframe.updateComplete;
    await local.updateComplete;
    expect(iframe.isA11yMedia).to.equal(false);
    expect(iframe.xapiCountsTowardCompletion()).to.equal(false);
    expect(local.xapiCountsTowardCompletion()).to.equal(true);
    expect(
      await until(() => LearnerProgress.pageProgress().trackable === 1),
    ).to.equal(true);
    expect(LearnerProgress.scanPage()).to.deep.equal({
      count: 1,
      byTag: { "video-player": 1 },
    });
    // a trackable element swapped in later is counted too
    const late = document.createElement("div");
    late.innerHTML = "<multiple-choice></multiple-choice>";
    host.appendChild(late);
    expect(
      await until(() => LearnerProgress.pageProgress().trackable === 2),
    ).to.equal(true);
  });
});
