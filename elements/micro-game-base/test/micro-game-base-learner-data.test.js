import { html, fixture, expect } from "@open-wc/testing";
import { MicroGameBase } from "../micro-game-base.js";
import {
  XAPI_VERBS,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

class LearnerDataGame extends MicroGameBase {
  static get tag() {
    return "micro-game-learner-data";
  }
  render() {
    return html`<div data-game-stage tabindex="0"></div>`;
  }
}
customElements.define(LearnerDataGame.tag, LearnerDataGame);

describe("MicroGameBase learner data", () => {
  it("progress events keep their fields and carry a statement", async () => {
    const el = await fixture(
      html`<micro-game-learner-data
        id="g1"
        game-title="Waves"
      ></micro-game-learner-data>`,
    );
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.emitProgress("answered", {
      objectDetail: "Pitch",
      resultSuccess: true,
      resultResponse: "frequency",
      resultScore: 1,
      attempt: 2,
    });
    el.gameComplete({ ms: 1500, confetti: false });
    const [answered, completed] = seen;
    expect(answered.activityDisplay).to.equal("answered");
    expect(answered.objectDetail).to.equal("Pitch");
    const s = answered.statement;
    expect(s.verb.id).to.equal(XAPI_VERBS.answered);
    expect(s.object.id.endsWith("#g1")).to.equal(true);
    expect(Object.values(s.object.definition.description)[0]).to.equal("Pitch");
    expect(s.result).to.include({ success: true, response: "frequency" });
    expect(s.result.extensions[XAPI_EXTENSIONS.attempts]).to.equal(2);
    expect(completed.statement.verb.id).to.equal(XAPI_VERBS.completed);
    expect(completed.statement.result.completion).to.equal(true);
    expect(completed.statement.result.duration).to.equal("PT1.5S");
  });
});
