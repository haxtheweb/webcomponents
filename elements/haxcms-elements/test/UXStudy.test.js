import { expect, fixture, html } from "@open-wc/testing";
import {
  UXStudyRecorder,
  UX_STUDY_SCHEMA,
  isInteractive,
  labelFor,
  collectVisibleControls,
  createUXStudyProgram,
} from "../lib/core/utils/UXStudyRecorder.js";
import {
  analyzeUXStudies,
  contrastRatio,
  uxStudyReportMarkdown,
} from "../lib/core/utils/UXStudyAnalyzer.js";

// Covers the Merlin UX study recorder (capture, privacy, resume, indicator)
// and the analyzer's findings on synthetic sessions.

const click = (el, x = 10, y = 10) =>
  el.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      composed: true,
      clientX: x,
      clientY: y,
      detail: 1,
    }),
  );

const session = (participant, events, snapshots = []) => ({
  schema: UX_STUDY_SCHEMA,
  id: `uxs-${participant}`,
  participant: participant,
  startedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
  durationMs: 60000,
  env: { viewport: { w: 1280, h: 800 }, pointer: "fine" },
  events: events,
  snapshots: snapshots,
});

const target = (path, extra = {}) =>
  Object.assign(
    {
      path: path,
      tag: "button",
      label: path,
      interactive: true,
      cursor: "pointer",
      rect: { x: 0, y: 0, w: 40, h: 40 },
    },
    extra,
  );

describe("UXStudyRecorder helpers", () => {
  it("classifies interactive elements", async () => {
    const el = await fixture(
      html`<div>
        <button id="b">Go</button>
        <a id="a1" href="#x">Link</a>
        <a id="a2">Not a link</a>
        <span id="r" role="tab">Tab</span>
        <span id="s">Plain</span>
        <simple-icon-button id="c"></simple-icon-button>
      </div>`,
    );
    expect(isInteractive(el.querySelector("#b"))).to.be.true;
    expect(isInteractive(el.querySelector("#a1"))).to.be.true;
    expect(isInteractive(el.querySelector("#a2"))).to.be.false;
    expect(isInteractive(el.querySelector("#r"))).to.be.true;
    expect(isInteractive(el.querySelector("#s"))).to.be.false;
    expect(isInteractive(el.querySelector("#c"))).to.be.true;
  });

  it("labels controls without reading form values", async () => {
    const el = await fixture(
      html`<div>
        <button id="b" aria-label="Save page">💾</button>
        <input id="i" placeholder="Search" value="secret typed text" />
      </div>`,
    );
    expect(labelFor(el.querySelector("#b"))).to.equal("Save page");
    expect(labelFor(el.querySelector("#i"))).to.equal("Search");
  });

  it("finds visible controls inside shadow roots", async () => {
    const host = await fixture(html`<div id="host"></div>`);
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<button id="inner" style="width:50px;height:30px">In shadow</button>`;
    const controls = collectVisibleControls(globalThis.document);
    const found = controls.find((c) => c.label === "In shadow");
    expect(found).to.exist;
    expect(found.path).to.contain("#shadow");
    expect(found.path).to.contain("button#inner");
  });
});

describe("UXStudyRecorder session", () => {
  let recorder;
  beforeEach(() => {
    globalThis.sessionStorage.clear();
    recorder = new UXStudyRecorder();
  });
  afterEach(() => {
    if (recorder.active) {
      recorder.stop();
    }
    globalThis.sessionStorage.clear();
  });

  it("records clicks through shadow DOM and shows an indicator", async () => {
    const host = await fixture(html`<div></div>`);
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<button id="go" aria-label="Add page"><span>+</span></button>`;
    recorder.start({ participant: "P01", siteName: "Test site" });
    expect(recorder.active).to.be.true;
    expect(globalThis.document.querySelector("haxcms-ux-study-indicator")).to
      .exist;
    click(root.querySelector("span"));
    const c = recorder.session.events.find((e) => e.type === "click");
    expect(c).to.exist;
    // the operable ancestor is recorded, not the inner span
    expect(c.target.label).to.equal("Add page");
    expect(c.target.interactive).to.be.true;
    expect(c.target.path).to.contain("button#go");
    expect(recorder.session.participant).to.equal("P01");
    expect(recorder.session.snapshots.length).to.be.greaterThan(0);
  });

  it("never records typed characters", async () => {
    const el = await fixture(html`<input aria-label="Title" />`);
    recorder.start({});
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", bubbles: true, composed: true }),
    );
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );
    const keys = recorder.session.events.filter((e) => e.type === "key");
    expect(keys.map((k) => k.k)).to.deep.equal(["char", "Escape"]);
    expect(JSON.stringify(recorder.session)).to.not.contain('"s"');
  });

  it("does not record its own indicator", async () => {
    recorder.start({});
    const indicator = globalThis.document.querySelector(
      "haxcms-ux-study-indicator",
    );
    await indicator.updateComplete;
    const before = recorder.session.events.length;
    click(indicator.shadowRoot.querySelector("button"));
    expect(
      recorder.session.events.slice(before).filter((e) => e.type === "click"),
    ).to.have.length(0);
  });

  it("marks tasks and persists to sessionStorage for resume", () => {
    recorder.start({ participant: "P02" });
    recorder.mark("Task: add a page");
    recorder._persist();
    // simulate a full reload: new recorder resumes the stored session
    const id = recorder.session.id;
    recorder._detach();
    recorder.active = false;
    recorder._hideIndicator();
    const resumed = new UXStudyRecorder();
    resumed.start({ resume: true });
    expect(resumed.active).to.be.true;
    expect(resumed.session.id).to.equal(id);
    expect(resumed.session.events.some((e) => e.type === "resume")).to.be.true;
    expect(
      resumed.session.events.some(
        (e) => e.type === "mark" && e.label === "Task: add a page",
      ),
    ).to.be.true;
    resumed.stop();
  });

  it("resume does nothing without a stored session", () => {
    expect(recorder.start({ resume: true })).to.equal(null);
    expect(recorder.active).to.be.false;
  });

  it("stop ends the session, clears storage and removes the indicator", () => {
    recorder.start({});
    const finished = recorder.stop();
    expect(finished.endedAt).to.be.a("string");
    expect(finished.events[finished.events.length - 1].type).to.equal("stop");
    expect(globalThis.sessionStorage.getItem("haxcms-ux-study-session")).to.be
      .null;
    expect(globalThis.document.querySelector("haxcms-ux-study-indicator")).to
      .not.exist;
  });
});

describe("UX study Merlin program", () => {
  afterEach(() => {
    const r = UXStudyRecorder.requestAvailability();
    if (r.active) {
      r.stop();
    }
  });
  it("offers start when idle and mark/stop while recording", async () => {
    const context = { t: {} };
    const program = createUXStudyProgram(context);
    let results = await program("P03", {});
    expect(results).to.have.length(1);
    expect(results[0].value.method).to.equal("startUXStudy");
    expect(results[0].value.args).to.deep.equal(["P03"]);
    UXStudyRecorder.requestAvailability().start({});
    results = await program("", {});
    expect(results.map((r) => r.value.method)).to.deep.equal([
      "markUXStudy",
      "stopUXStudy",
    ]);
  });
});

describe("UXStudyAnalyzer", () => {
  it("computes contrast only for opaque colors", () => {
    expect(contrastRatio("rgb(0, 0, 0)", "rgb(255, 255, 255)")).to.equal(21);
    expect(contrastRatio("rgb(0, 0, 0)", "rgba(0, 0, 0, 0)")).to.equal(null);
  });

  it("finds rage clicks and dead clicks across participants", () => {
    const save = target("x > button#save", { label: "Save" });
    const heading = target("x > h2", {
      tag: "h2",
      label: "Settings",
      interactive: false,
      cursor: "auto",
    });
    const mk = (who) =>
      session(who, [
        { type: "start", t: 0, href: "/" },
        { type: "click", t: 1000, x: 20, y: 20, target: save },
        { type: "click", t: 1200, x: 22, y: 21, target: save },
        { type: "click", t: 1400, x: 21, y: 22, target: save },
        { type: "click", t: 5000, x: 300, y: 300, target: heading },
        { type: "click", t: 9000, x: 301, y: 300, target: heading },
      ]);
    const analysis = analyzeUXStudies([mk("P1"), mk("P2")]);
    const rage = analysis.findings.find((f) => f.category === "frustration");
    expect(rage).to.exist;
    expect(rage.severity).to.equal("high");
    expect(rage.people).to.equal(2);
    const dead = analysis.findings.find((f) => f.category === "affordance");
    expect(dead).to.exist;
    expect(dead.count).to.equal(4);
    expect(analysis.findings[0].id).to.equal("UX-01");
  });

  it("flags late discovery, faded controls and near misses on small targets", () => {
    const tiny = {
      path: "bar > simple-icon-button#outline",
      tag: "simple-icon-button",
      label: "Outline",
      rect: { x: 100, y: 10, w: 18, h: 18 },
      opacity: 0.4,
      color: "rgb(255, 255, 255)",
      background: "rgb(230, 230, 230)",
    };
    const s = session(
      "P1",
      [
        { type: "start", t: 0, href: "/" },
        {
          type: "click",
          t: 2000,
          x: 125,
          y: 15,
          target: target("bar", {
            tag: "div",
            interactive: false,
            cursor: "auto",
          }),
        },
        {
          type: "click",
          t: 45000,
          x: 105,
          y: 15,
          target: target(tiny.path, tiny),
        },
      ],
      [{ t: 0, href: "/", scrollY: 0, controls: [tiny] }],
    );
    const analysis = analyzeUXStudies([s]);
    const cats = analysis.findings.map((f) => f.category);
    expect(cats).to.include("discoverability");
    expect(cats).to.include("visibility");
    const miss = analysis.findings.find((f) => f.category === "target-size");
    expect(miss).to.exist;
    expect(miss.severity).to.equal("high");
  });

  it("splits tasks by marks and writes a markdown report", () => {
    const s = session("P1", [
      { type: "start", t: 0, href: "/" },
      { type: "mark", t: 0, label: "Add a page" },
      { type: "move", t: 100, x: 0, y: 0 },
      { type: "move", t: 200, x: 30, y: 40 },
      { type: "click", t: 3000, x: 30, y: 40, target: target("add") },
      { type: "mark", t: 20000, label: "Change theme" },
      { type: "route", t: 21000, href: "/a" },
      { type: "route", t: 23000, href: "/b" },
      { type: "route", t: 25000, href: "/a" },
    ]);
    const analysis = analyzeUXStudies([s]);
    const add = analysis.tasks.find((t) => t.label === "Add a page");
    expect(add.medianTimeToFirstClickMs).to.equal(3000);
    expect(add.medianPointerTravelPx).to.equal(50);
    expect(analysis.findings.some((f) => f.category === "navigation")).to.be
      .true;
    const md = uxStudyReportMarkdown(analysis);
    expect(md).to.contain("# UX study findings");
    expect(md).to.contain("| Add a page |");
    expect(md).to.contain("not eye tracking");
  });

  it("ignores things that are not sessions", () => {
    const analysis = analyzeUXStudies([null, { foo: 1 }]);
    expect(analysis.participants).to.have.length(0);
    expect(analysis.findings).to.have.length(0);
  });
});
