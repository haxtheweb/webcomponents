import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import "../lib/ui-components/navigation/site-menu.js";
import "../lib/ui-components/progress/site-page-progress.js";
import "../lib/ui-components/progress/site-progress-clear.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import {
  activityId,
  buildStatement,
  legacyActivityId,
  pageUrl,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import "@haxtheweb/multiple-choice/multiple-choice.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const page = (id, order, title, tags = "") => ({
  id,
  title,
  slug: id,
  location: `pages/${id}/index.html`,
  parent: null,
  indent: 0,
  order,
  metadata: { tags },
});
const MANIFEST = {
  id: "lp-site",
  title: "Physics 010",
  metadata: { platform: {}, theme: { variables: {} }, site: { settings: {} } },
  items: [
    page("p1", 0, "Waves 101", "waves"),
    page("p2", 1, "Energy in waves", "waves"),
    page("p3", 2, "Sound", "sound"),
    page("p4", 3, "Light"),
    page("p5", 4, "Review"),
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
          result: {
            success,
            completion: done,
            response: success ? "Light" : "Sound",
            extensions: { [XAPI_EXTENSIONS.attempts]: 1 },
          },
          context: {
            extensions: { [XAPI_EXTENSIONS.element]: "multiple-choice" },
          },
        }),
      },
    }),
  );
}

async function goTo(id) {
  store.activeId = id;
  await flush();
}

describe("HAXcms learner progress", () => {
  let saved;
  let host;
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
    store.editMode = false;
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    LearnerProgress.start();
    host = await fixture(html`<div id="content"></div>`);
    await goTo("p1");
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    UserScaffoldInstance.setMemoryAdapter(saved.memory);
    UserScaffoldInstance.setStatementAdapter(saved.statements);
  });

  it("records statements into the learner profile with site context", async () => {
    const q = document.createElement("multiple-choice-standin");
    host.appendChild(q);
    answer(q, "q1", true, true);
    // the follow-up state event of the same check is not a second record
    q.dispatchEvent(
      new CustomEvent("question-element-state", {
        bubbles: true,
        composed: true,
        detail: { correct: true, attempts: 1, maxAttempts: 0 },
      }),
    );
    const site = UserScaffoldInstance.readSite("lp-site");
    const act = site.activities[`${pageUrl()}#q1`];
    expect(act.page).to.equal("p1");
    expect(act.count).to.equal(1);
    expect(act.trackable).to.equal(true);
    expect(act.status).to.equal("correct");
    expect(act.response).to.equal("Light");
    expect(site.pages.p1.visits).to.be.greaterThan(0);
    // the page visit itself went out as an experienced statement
    expect(site.counts.byVerb.experienced).to.be.greaterThan(0);
    const s = LearnerProgress.lastStatement;
    expect(s.actor.account.name).to.equal(site.actor.account.name);
    expect(s.actor.mbox).to.equal(undefined);
    expect(
      Object.values(s.context.contextActivities.grouping[0].definition.name)[0],
    ).to.equal("Physics 010");
    expect(
      Object.values(s.context.contextActivities.parent[0].definition.name)[0],
    ).to.equal("Waves 101");
    // read back for a returning question
    const detail = { activityId: `${pageUrl()}#q1`, record: null };
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    expect(detail.record.status).to.equal("correct");
  });

  it("keeps choice ids in the record, plain words beside them, and migrates old keys", async () => {
    host.innerHTML = `<multiple-choice resource="#saved-res" question="Faster in air?"><input data-correct="true" value="Light" /><input value="Sound" /></multiple-choice>`;
    const q = host.firstElementChild;
    await flush();
    await q.updateComplete;
    // an earlier version saved this question under its fingerprint key
    const oldId = legacyActivityId(q);
    expect(oldId).to.not.equal(activityId(q));
    UserScaffoldInstance.recordStatement(
      "lp-site",
      buildStatement({
        verb: "answered",
        object: { id: oldId, interactionType: "choice" },
        result: {
          success: false,
          response: "Sound",
          extensions: { [XAPI_EXTENSIONS.attempts]: 1 },
        },
      }),
      { page: "p1", trackable: true },
    );
    // the question asks on load: the old record is found and moved
    globalThis.dispatchEvent(new CustomEvent("learner-progress-ready"));
    await flush();
    const site = UserScaffoldInstance.readSite("lp-site");
    expect(site.activities[oldId]).to.equal(undefined);
    expect(site.activities[activityId(q)].migratedFrom).to.equal(oldId);
    expect(site.pages.p1.activities).to.include(activityId(q));
    expect(site.pages.p1.activities).to.not.include(oldId);
    // a new answer: ids in response, text resolved for the dashboard
    q.resetAnswer();
    await flush();
    q.displayedAnswers.forEach((a) => {
      a.userGuess = a.label === "Light" ? true : "";
    });
    await q.checkAnswer();
    await flush(80);
    const act = UserScaffoldInstance.readActivity("lp-site", activityId(q));
    expect(act.count).to.equal(2);
    expect(act.response).to.match(/^c-[0-9a-f]{8}$/);
    expect(act.responseText).to.equal("Light");
  });

  it("counts trackable elements on the page and applies the done rule", async () => {
    host.innerHTML = `<multiple-choice></multiple-choice><bullet-check-list></bullet-check-list><user-action></user-action>`;
    const counted = LearnerProgress.scanPage(host);
    expect(counted).to.deep.equal({
      count: 2,
      byTag: { "multiple-choice": 1, "bullet-check-list": 1 },
    });
    answer(host, "q1", false, false);
    expect(LearnerProgress.pageProgress().status).to.equal("in-progress");
    answer(host, "q1", true, true);
    // one of the two trackable elements is done: the page isn't yet
    expect(LearnerProgress.pageProgress()).to.deep.equal({
      status: "in-progress",
      engaged: 1,
      done: 1,
      trackable: 2,
    });
    answer(host, "c1", true, true);
    expect(LearnerProgress.pageProgress()).to.deep.equal({
      status: "done",
      engaged: 2,
      done: 2,
      trackable: 2,
    });
    await goTo("p2");
    const site = LearnerProgress.siteProgress();
    expect(site.done).to.equal(1);
    expect(site.total).to.equal(5);
    expect(site.byPage.p2).to.equal("visited");
    expect(site.byPage.p5).to.equal("not-started");
    const byTag = LearnerProgress.summarize({ groupBy: "tag" });
    expect(byTag.groups.waves.activities).to.be.greaterThan(0);
  });

  it("does not record while editing", async () => {
    store.editMode = true;
    answer(host, "q-edit", true, true);
    store.editMode = false;
    expect(
      UserScaffoldInstance.readActivity("lp-site", `${pageUrl()}#q-edit`),
    ).to.equal(null);
  });

  it("site menu marks pages with spoken text and shows pages done", async () => {
    answer(host, "q1", true, true);
    await goTo("p3");
    answer(host, "q3", false, false);
    await goTo("p4");
    const menu = await fixture(html`<site-menu></site-menu>`);
    await flush(150);
    await menu.updateComplete;
    const summary = menu.shadowRoot.querySelector(".progress-summary");
    expect(summary.textContent.trim()).to.equal("1 of 5 pages done");
    const mm = menu.shadowRoot.querySelector("map-menu");
    await mm.updateComplete;
    const items = {};
    mm.shadowRoot.querySelectorAll("map-menu-item").forEach((i) => {
      items[i.id] = i;
    });
    await Promise.all(Object.values(items).map((i) => i.updateComplete));
    expect(items.p1.getAttribute("progress")).to.equal("done");
    expect(items.p3.getAttribute("progress")).to.equal("in-progress");
    expect(items.p4.getAttribute("progress")).to.equal("visited");
    expect(items.p5.getAttribute("progress")).to.equal("not-started");
    const spoken = (i) =>
      i.shadowRoot
        .querySelector("button")
        .textContent.replace(/\s+/g, " ")
        .trim();
    expect(spoken(items.p1)).to.equal("Waves 101, Done");
    expect(spoken(items.p3)).to.equal("Sound, In progress");
    expect(spoken(items.p4)).to.equal("Light, Visited");
    expect(spoken(items.p5)).to.equal("Review");
    // marks never rely on colour alone and are hidden from the name twice
    const mark = items.p1.shadowRoot.querySelector(".progress-mark");
    expect(mark.getAttribute("aria-hidden")).to.equal("true");
    expect(
      mark.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    // hide-progress turns it all off
    menu.hideProgress = true;
    await menu.updateComplete;
    expect(menu.shadowRoot.querySelector(".progress-summary")).to.equal(null);
  });

  it("site menu shows no marks before any trackable engagement", async () => {
    const menu = await fixture(html`<site-menu></site-menu>`);
    await flush(150);
    await menu.updateComplete;
    expect(menu.shadowRoot.querySelector(".progress-summary")).to.equal(null);
  });

  it("page progress shows activities done with a progressbar", async () => {
    const el = await fixture(html`<site-page-progress></site-page-progress>`);
    await flush();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[role="progressbar"]')).to.equal(null);
    host.innerHTML = `<multiple-choice></multiple-choice><multiple-choice></multiple-choice>`;
    LearnerProgress.scanPage(host);
    answer(host, "q1", true, true);
    await flush();
    await el.updateComplete;
    const bar = el.shadowRoot.querySelector('[role="progressbar"]');
    expect(el.shadowRoot.querySelector(".label").textContent.trim()).to.equal(
      "1 of 2 activities done",
    );
    expect(bar.getAttribute("aria-valuenow")).to.equal("1");
    expect(bar.getAttribute("aria-valuemax")).to.equal("2");
    expect(bar.getAttribute("aria-valuetext")).to.equal(
      "1 of 2 activities done",
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("clear control wipes this site and announces it", async () => {
    globalThis.localStorage.setItem(
      `bullet-check-list:v1:${new URL(document.baseURI).pathname.replace(/[^/]*$/, "")}x:h1`,
      JSON.stringify({ v: 1, checked: ["A"] }),
    );
    host.innerHTML = `<multiple-choice></multiple-choice>`;
    LearnerProgress.scanPage(host);
    answer(host, "q1", true, true);
    const el = await fixture(html`<site-progress-clear></site-progress-clear>`);
    await flush();
    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include(
      "Your progress is saved on this device only.",
    );
    await expect(el).shadowDom.to.be.accessible();
    let cleared = false;
    globalThis.addEventListener(
      "learner-progress-cleared",
      () => {
        cleared = true;
      },
      { once: true },
    );
    el.shadowRoot.querySelector("button").click();
    await flush(80);
    await el.updateComplete;
    expect(cleared).to.equal(true);
    expect(
      UserScaffoldInstance.readActivity("lp-site", `${pageUrl()}#q1`),
    ).to.equal(null);
    expect(
      Object.keys(globalThis.localStorage).filter((k) =>
        k.startsWith("bullet-check-list:v1:"),
      ),
    ).to.deep.equal([]);
    expect(
      el.shadowRoot.querySelector('[role="status"]').textContent.trim(),
    ).to.equal("Your progress on this site was cleared.");
  });

  it("counts activities still waiting in a replace-tag", async () => {
    host.innerHTML = `<replace-tag with="multiple-choice"></replace-tag><replace-tag with="meme-maker"></replace-tag><multiple-choice></multiple-choice>`;
    expect(LearnerProgress.scanPage(host)).to.deep.equal({
      count: 2,
      byTag: { "multiple-choice": 2 },
    });
  });

  it("counts the page as soon as its content is inserted", async () => {
    const savedTheme = store.themeElement;
    store.themeElement = host;
    try {
      host.innerHTML = `<multiple-choice></multiple-choice>`;
      // the site builder announces the page body; the count is there at once,
      // not after the debounce, so the progress bar renders with the content
      globalThis.dispatchEvent(
        new CustomEvent("json-outline-schema-active-body-changed", {
          detail: host.innerHTML,
        }),
      );
      expect(LearnerProgress.pageProgress().trackable).to.equal(1);
    } finally {
      store.themeElement = savedTheme;
    }
  });
});
