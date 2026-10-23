import { html, fixture, expect } from "@open-wc/testing";
import "../lib/concept-map-game.js";

const NODES = [
  {
    label: "Accessible",
    link: "for everyone",
    text: "Built in from the start.",
  },
  {
    label: "Extensible",
    link: "anyone can add",
    text: "Nothing is monolithic.",
  },
  { label: "Free and Open", link: "no lock-in", text: "Open docs and APIs." },
  { label: "Efficient", link: "fast and light", text: "Small and quick." },
];

describe("ConceptMapGame test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <concept-map-game .nodes="${NODES}"></concept-map-game>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("has no content of its own when blank", async () => {
    const blank = await fixture(html`<concept-map-game></concept-map-game>`);
    expect(blank.nodes.length).to.equal(0);
    expect(blank.prompt).to.equal("");
    expect(blank.isEmpty).to.equal(true);
    expect(blank.shadowRoot.querySelector(".overlay .btn")).to.equal(null);
    expect(blank.shadowRoot.querySelector(".ov-title").textContent).to.contain(
      "Nothing to play yet",
    );
  });

  it("renders from author supplied nodes", async () => {
    element = await fixture(html`
      <concept-map-game
        .nodes="${[
          { label: "One", text: "First." },
          { label: "Two", text: "Second." },
        ]}"
      ></concept-map-game>
    `);
    expect(element.shadowRoot.querySelectorAll(".node").length).to.equal(2);
  });

  it("emits concept-visited and game-complete", async () => {
    element = await fixture(html`
      <concept-map-game
        .nodes="${[{ label: "Only", text: "The only one." }]}"
      ></concept-map-game>
    `);
    const seen = [];
    element.addEventListener("concept-visited", (e) => seen.push(e.detail));
    let complete = false;
    element.addEventListener("game-complete", () => (complete = true));
    element._visit(0);
    expect(seen.length).to.equal(1);
    expect(seen[0].id).to.equal("only");
    expect(complete).to.equal(true);
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".finish")).to.exist;
  });

  it("shows the quest on the start screen", async () => {
    element = await fixture(html`
      <concept-map-game quest="Go on a journey."></concept-map-game>
    `);
    expect(element.shadowRoot.querySelector(".ov-sub").textContent).to.contain(
      "Go on a journey.",
    );
  });

  it("tells tiles apart when two concepts start with the same letter", async () => {
    expect(element._glyph(1)).to.equal("Ex");
    expect(element._glyph(3)).to.equal("Ef");
  });

  it("walks to the next unfound concept with gameNext", async () => {
    await element.updateComplete;
    element.gameNext();
    expect(element.tapTarget).to.deep.equal(element._pos[0]);
  });

  it("does not allow text selection on the stage", async () => {
    const style = globalThis.getComputedStyle(element.stage);
    expect(style.userSelect).to.equal("none");
  });

  it("draws the character from the seed, or from the signed in user", async () => {
    element.seed = "abc";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector("#player").getAttribute("seed"),
    ).to.equal("abc");
    globalThis.HAXCMS = {
      instance: { store: { userData: { userName: "someone" } } },
    };
    element.seedFromUser = true;
    element.gameStart();
    await element.updateComplete;
    expect(element.playerSeed).to.equal("someone");
    delete globalThis.HAXCMS;
  });

  it("lets a page replace the prompt box on the finish panel", async () => {
    const own = await fixture(
      html`<concept-map-game .nodes="${NODES}"
        ><p slot="finish">next</p></concept-map-game
      >`,
    );
    own._complete();
    await own.updateComplete;
    await own.updateComplete;
    expect(own.shadowRoot.querySelector("#prompt")).to.equal(null);
    const def = await fixture(
      html`<concept-map-game
        .nodes="${NODES}"
        prompt="copy me"
      ></concept-map-game>`,
    );
    def._complete();
    await def.updateComplete;
    expect(def.shadowRoot.querySelector("#prompt")).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
