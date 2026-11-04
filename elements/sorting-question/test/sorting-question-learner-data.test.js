import { fixture, expect, html } from "@open-wc/testing";
import "../sorting-question.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe("sorting-question learner data", () => {
  it("sends one user-engagement per check, with a sequencing statement", async () => {
    const el = await fixture(
      html`<sorting-question
        id="order"
        question="Order the letters"
        .randomize=${false}
      >
        <input value="Alpha" />
        <input value="Beta" />
        <input value="Gamma" />
      </sorting-question>`,
    );
    await flush();
    await el.updateComplete;
    const events = [];
    const states = [];
    globalThis.addEventListener("user-engagement", (e) =>
      events.push(e.detail),
    );
    globalThis.addEventListener("question-element-state", (e) =>
      states.push(e.detail),
    );
    el.checkAnswer();
    await flush(200);
    await el.updateComplete;
    expect(events.length).to.equal(1);
    expect(states.length).to.equal(1);
    const d = events[0];
    expect(d.activityDisplay).to.equal("answered");
    expect(d.objectName).to.equal("default");
    expect(d.resultSuccess).to.equal(true);
    expect(d.statement.verb.id).to.equal(XAPI_VERBS.answered);
    expect(d.statement.object.definition.interactionType).to.equal(
      "sequencing",
    );
    expect(d.statement.result.response).to.equal("Alpha[,]Beta[,]Gamma");
    expect(d.statement.result.score).to.include({ raw: 3, max: 3, scaled: 1 });
    expect(
      d.statement.result.extensions[
        "https://haxtheweb.org/xapi/extensions/attempts"
      ],
    ).to.equal(1);
  });
});
