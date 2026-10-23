import { html, fixture, expect } from "@open-wc/testing";
import "../lib/concept-runner-game.js";

const ITEMS = [
  { label: "Slots", kind: "good", text: "Authors drop content in." },
  { label: "Shadow DOM", kind: "good", text: "Private markup and styles." },
  { label: "Framework A", kind: "bad", text: "Needs its own runtime." },
  { label: "Framework B", kind: "bad", text: "Needs a compiler." },
];

describe("ConceptRunnerGame test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <concept-runner-game .items="${ITEMS}"></concept-runner-game>
    `);
  });

  it("shows a notice instead of a game when blank", async () => {
    const blank = await fixture(
      html`<concept-runner-game></concept-runner-game>`,
    );
    expect(blank.isEmpty).to.equal(true);
    expect(blank.items.length).to.equal(0);
    expect(blank.prompt).to.equal("");
    expect(blank.shadowRoot.querySelector(".overlay .btn")).to.equal(null);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("lays out the good and bad items it was given", async () => {
    const good = element._seq.filter((i) => i.kind === "good").length;
    const bad = element._seq.filter((i) => i.kind === "bad").length;
    expect(good).to.equal(2);
    expect(bad).to.equal(2);
  });

  it("makes the same course for the same seed", async () => {
    const other = await fixture(html`
      <concept-runner-game .items="${ITEMS}"></concept-runner-game>
    `);
    expect(other._seq.map((i) => i.label)).to.deep.equal(
      element._seq.map((i) => i.label),
    );
  });

  it("scores caught and dodged items as right", async () => {
    element._seq[0].state =
      element._seq[0].kind === "good" ? "collected" : "dodged";
    expect(element._score.right).to.equal(1);
  });

  it("emits a completed progress event with a score", async () => {
    let detail;
    element.addEventListener("user-engagement", (e) => {
      if (e.detail.activityDisplay === "completed") detail = e.detail;
    });
    element._finish();
    expect(detail.resultScoreMax).to.equal(4);
    expect(detail.resultCompletion).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
