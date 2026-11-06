import { fixture, expect, html } from "@open-wc/testing";
import "../self-check.js";

// the quiz question shell: header with an info toggle for directions and a
// footer that shows status on the left and the action on the right
describe("self-check shell", () => {
  it("toggles directions from the header info button", async () => {
    const el = await fixture(
      html`<self-check title="Sharks"
        ><span slot="question">How big?</span>Very big.</self-check
      >`,
    );
    const toggle = el.shadowRoot.querySelector("#directions-toggle");
    const directions = el.shadowRoot.querySelector("#directions");
    expect(toggle.getAttribute("aria-controls")).to.equal("directions");
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    expect(toggle.getAttribute("aria-label")).to.equal(el.t.showDirections);
    expect(directions.hidden).to.be.true;
    toggle.click();
    await el.updateComplete;
    expect(toggle.getAttribute("aria-expanded")).to.equal("true");
    expect(toggle.getAttribute("aria-label")).to.equal(el.t.hideDirections);
    expect(directions.hidden).to.be.false;
    expect(directions.textContent).to.contain(el.t.selfCheckDirections);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("shows an answer revealed status in the footer, not by colour alone", async () => {
    const el = await fixture(
      html`<self-check title="Sharks"
        ><span slot="question">How big?</span>Very big.</self-check
      >`,
    );
    const status = el.shadowRoot.querySelector("#status");
    expect(status.textContent.trim()).to.equal("");
    el.shadowRoot.querySelector("#checkBtn").click();
    await el.updateComplete;
    expect(status.querySelector(".status-word").textContent.trim()).to.equal(
      el.t.answerRevealed,
    );
    expect(
      status.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    await expect(el).shadowDom.to.be.accessible();
    el.shadowRoot.querySelector("#closeBtn").click();
    await el.updateComplete;
    expect(status.textContent.trim()).to.equal("");
  });

  it("keeps the authored title in the editable header label", async () => {
    const el = await fixture(
      html`<self-check title="Sharks self check"
        ><span slot="question">How big?</span>Very big.</self-check
      >`,
    );
    const title = el.shadowRoot.querySelector("#title");
    expect(title.textContent.trim()).to.equal("Sharks self check");
    expect(el.shadowRoot.querySelector(".ddd-block-header #directions-toggle"))
      .to.exist;
  });
});
