import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../slide-deck.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

// three slides: One, Two, Three
const MANIFEST = "/elements/slide-deck/test/fixtures/no-pptx.json";
// eight slides: Slide 1 ... Slide 8
const EIGHT = "/elements/slide-deck/test/fixtures/eight-slides.json";
const PROGRESS = "https://haxtheweb.org/xapi/extensions/progress";

async function deck(source = MANIFEST) {
  const el = await fixture(
    html`<slide-deck source="${source}" deck-id="learn"></slide-deck>`,
  );
  await waitUntil(() => el.status === "ready", "deck never loaded", {
    timeout: 5000,
  });
  await el.updateComplete;
  const seen = [];
  el.addEventListener("user-engagement", (e) => seen.push(e.detail));
  const goTo = async (n) => {
    el.goTo(n);
    await el.updateComplete;
  };
  return { el, seen, goTo };
}

describe("slide-deck learner data", () => {
  afterEach(() => {
    globalThis.history.replaceState(
      null,
      "",
      globalThis.location.pathname + globalThis.location.search,
    );
  });

  it("sends nothing for the first slide shown on load", async () => {
    const { seen } = await deck();
    expect(seen.length).to.equal(0);
  });

  it("a deck under four slides sends attempted and completed only", async () => {
    const { seen, goTo } = await deck();
    await goTo(2);
    await goTo(1);
    await goTo(2);
    await goTo(3);
    await goTo(1);
    await goTo(3);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "completed",
    ]);
    const [start, done] = seen.map((d) => d.statement);
    expect(start.verb.id).to.equal(XAPI_VERBS.attempted);
    expect(start.result).to.equal(undefined);
    expect(Object.values(start.object.definition.name)[0]).to.equal(
      "No pptx deck",
    );
    expect(done.verb.id).to.equal(XAPI_VERBS.completed);
    expect(done.result.completion).to.equal(true);
    expect(done.result.score).to.include({ raw: 3, max: 3 });
    expect(done.result.extensions[PROGRESS]).to.equal(1);
    expect(done.object.id).to.equal(start.object.id);
  });

  it("sends each quarter once, in order, however the deck is paged", async () => {
    const { seen, goTo } = await deck(EIGHT);
    // slides 1-2 are the first quarter, 3-4 the second, ...
    await goTo(2);
    await goTo(5);
    await goTo(6);
    // the second quarter (3, 4) was skipped: only the first is sent
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "progressed",
    ]);
    await goTo(3);
    await goTo(4);
    await goTo(2);
    await goTo(7);
    await goTo(8);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "progressed",
      "progressed",
      "progressed",
      "completed",
    ]);
    expect(
      seen.slice(1, 4).map((d) => d.statement.result.extensions[PROGRESS]),
    ).to.deep.equal([0.25, 0.5, 0.75]);
    expect(seen[2].statement.result.score).to.include({ raw: 6, max: 8 });
  });

  it("does not count the grid of thumbnails as going through slides", async () => {
    const { el, seen } = await deck();
    el.toggleMode();
    await el.updateComplete;
    el.slide = 3;
    await el.updateComplete;
    expect(seen.length).to.equal(0);
  });

  it("records nothing while HAX is editing", async () => {
    const { el, seen, goTo } = await deck();
    el.haxeditModeChanged(true);
    await goTo(2);
    await goTo(3);
    expect(seen.length).to.equal(0);
  });
});

describe("slide-deck learner profile (state and resume)", () => {
  // stands in for the HAXcms learner progress bridge
  let record = null;
  let updates = [];
  const onRequest = (e) => {
    e.detail.record = record;
  };
  const onUpdate = (e) => updates.push(e.detail);
  beforeEach(() => {
    record = null;
    updates = [];
    globalThis.addEventListener("learner-progress-request", onRequest);
    globalThis.addEventListener("learner-progress-update", onUpdate);
  });
  afterEach(() => {
    globalThis.removeEventListener("learner-progress-request", onRequest);
    globalThis.removeEventListener("learner-progress-update", onUpdate);
    globalThis.history.replaceState(
      null,
      "",
      globalThis.location.pathname + globalThis.location.search,
    );
  });

  it("saves the slides shown and the one on screen, without a statement", async () => {
    const { el, seen, goTo } = await deck(EIGHT);
    await goTo(2);
    await goTo(3);
    await goTo(2);
    // a slide shown before is not saved again
    expect(updates.length).to.equal(2);
    const last = updates[updates.length - 1];
    expect(last.activityId).to.equal(seen[0].statement.object.id);
    expect(last.tag).to.equal("slide-deck");
    expect(last.state).to.deep.equal({
      covered: [[1, 3]],
      resume: 3,
      progress: 0.38,
    });
    el._saveLearnerState();
    expect(updates[updates.length - 1].state.resume).to.equal(2);
  });

  it("opens the slide the learner stopped on and sends nothing twice", async () => {
    record = {
      verbs: { attempted: 1, progressed: 1 },
      milestones: ["attempted", "progressed@0.25"],
      state: { covered: [[1, 3]], resume: 3 },
    };
    const { el, seen, goTo } = await deck(EIGHT);
    expect(el.slide).to.equal(3);
    await goTo(4);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal(["progressed"]);
    expect(seen[0].statement.result.extensions[PROGRESS]).to.equal(0.5);
  });

  it("a deck finished before sends and saves nothing", async () => {
    record = {
      done: true,
      verbs: { attempted: 1, completed: 1 },
      milestones: ["attempted", "completed"],
      state: { covered: [[1, 8]], resume: 8 },
    };
    const { el, seen, goTo } = await deck(EIGHT);
    expect(el.slide).to.equal(1);
    for (let n = 2; n <= 8; n++) {
      await goTo(n);
    }
    expect(seen.length).to.equal(0);
    expect(updates.length).to.equal(0);
  });
});
