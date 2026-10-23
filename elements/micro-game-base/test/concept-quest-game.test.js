import { html, fixture, expect } from "@open-wc/testing";
import "../lib/concept-quest-game.js";

const NODES = [
  {
    label: "Accessible",
    text: "Built in from the start.",
    question: "When is the best time to make content accessible?",
    choices:
      "The moment it is created\nRight before it is published\nAfter someone complains\nOnly for public sites",
  },
  {
    label: "Extensible",
    text: "Nothing is monolithic.",
    link: "anyone can add",
  },
];

describe("ConceptQuestGame test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <concept-quest-game .nodes="${NODES}"></concept-quest-game>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("starts an encounter and asks the written question", async () => {
    element._startEncounter(0);
    element._askStart();
    await element.updateComplete;
    expect(element.shadowRoot.querySelectorAll(".choice").length).to.equal(4);
  });

  it("counts tries and takes a heart for a wrong answer", async () => {
    element._startEncounter(0);
    element._askStart();
    await element.updateComplete;
    element._answer(1);
    expect(element._tries[0]).to.equal(1);
    expect(element._hp).to.equal(2);
  });

  it("defeating a concept unlocks its house", async () => {
    element._startEncounter(0);
    element._askStart();
    await element.updateComplete;
    element._answer(0);
    element._defeat(0);
    expect(element._visited.has(0)).to.equal(true);
  });

  it("builds a question when none is written", async () => {
    element.nodes = [
      { label: "A", text: "a", link: "alpha" },
      { label: "B", text: "b", link: "beta" },
    ];
    await element.updateComplete;
    expect(element._qa(0).choices[0]).to.equal("alpha");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
