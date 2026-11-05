import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../slide-deck.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

// three slides: One, Two, Three
const MANIFEST = "/elements/slide-deck/test/fixtures/no-pptx.json";

async function deck() {
  const el = await fixture(
    html`<slide-deck source="${MANIFEST}" deck-id="learn"></slide-deck>`,
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

  it("sends at most three statements however the deck is paged", async () => {
    const { seen, goTo } = await deck();
    await goTo(2);
    await goTo(1);
    await goTo(2);
    await goTo(3);
    await goTo(1);
    await goTo(3);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "progressed",
      "completed",
    ]);
    const [start, half, done] = seen.map((d) => d.statement);
    expect(start.verb.id).to.equal(XAPI_VERBS.attempted);
    expect(start.result).to.equal(undefined);
    expect(Object.values(start.object.definition.name)[0]).to.equal(
      "No pptx deck",
    );
    expect(half.result.score).to.include({ raw: 2, max: 3 });
    expect(half.result.completion).to.equal(false);
    expect(done.verb.id).to.equal(XAPI_VERBS.completed);
    expect(done.result.completion).to.equal(true);
    expect(done.result.score).to.include({ raw: 3, max: 3 });
    expect(done.object.id).to.equal(start.object.id);
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
