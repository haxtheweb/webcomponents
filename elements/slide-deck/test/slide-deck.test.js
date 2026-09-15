import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../slide-deck.js";

const MANIFEST = "/elements/slide-deck/demo/deck.json";

describe("SlideDeck test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<slide-deck source="${MANIFEST}" deck-id="test"></slide-deck>`,
    );
    await waitUntil(() => element.status === "ready", "deck never loaded");
    await element.updateComplete;
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("loads the manifest and starts on the first slide", async () => {
    expect(element.slides.length).to.equal(3);
    expect(element.slide).to.equal(1);
  });

  it("moves between slides and clamps at the ends", async () => {
    element.goTo(2);
    expect(element.slide).to.equal(2);
    element.goTo(99);
    expect(element.slide).to.equal(3);
    element.goTo(-5);
    expect(element.slide).to.equal(1);
  });

  it("shows speaker notes in grid mode", async () => {
    element.toggleMode();
    await element.updateComplete;
    expect(element.shadowRoot.querySelectorAll(".card").length).to.equal(3);
  });

  it("keeps the manifest text available when no slide is painted", async () => {
    expect(element.rendered).to.be.false;
    expect(element.shadowRoot.querySelector(".text")).to.exist;
  });

  it("reports an unreadable manifest instead of throwing", async () => {
    const broken = await fixture(
      html`<slide-deck
        source="/elements/slide-deck/demo/missing.json"
      ></slide-deck>`,
    );
    await waitUntil(() => broken.status === "error", "never reported an error");
    expect(broken.shadowRoot.textContent).to.contain(
      broken.t.presentationUnavailable,
    );
  });
});
