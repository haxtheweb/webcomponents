import { fixture, expect, html } from "@open-wc/testing";
import "../flash-card.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

describe("flash-card learner data", () => {
  it("a checked card sends user-engagement with a statement", async () => {
    const el = await fixture(
      html`<flash-card id="fc1">
        <div slot="front">What is 2 + 2?</div>
        <div slot="back">four</div>
      </flash-card>`,
    );
    await el.updateComplete;
    const box = el.shadowRoot.querySelector("flash-card-answer-box");
    await box.updateComplete;
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    box.userAnswer = "five";
    box.checkUserAnswer();
    await box.updateComplete;
    await el.updateComplete;
    expect(seen.length).to.equal(1);
    expect(seen[0].activityDisplay).to.equal("answered");
    expect(seen[0].resultSuccess).to.equal(false);
    const s = seen[0].statement;
    expect(s.verb.id).to.equal(XAPI_VERBS.answered);
    expect(s.object.id.endsWith("#fc1")).to.equal(true);
    expect(s.result.response).to.equal("five");
    expect(s.object.definition.interactionType).to.equal("fill-in");
  });
});
