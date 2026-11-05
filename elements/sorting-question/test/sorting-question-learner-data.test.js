import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../sorting-question.js";
import {
  deviceActor,
  setActorProvider,
  XAPI_VERBS,
} from "@haxtheweb/user-action/lib/xapi.js";

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
    await el.checkAnswer();
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
    // xAPI sequencing: choices hold the text, response and pattern the ids
    const def = d.statement.object.definition;
    const ids = def.choices.map((c) => c.id);
    expect(
      def.choices.map((c) => Object.values(c.description)[0]),
    ).to.deep.equal(["Alpha", "Beta", "Gamma"]);
    expect(def.correctResponsesPattern).to.deep.equal([ids.join("[,]")]);
    expect(d.statement.result.response).to.equal(ids.join("[,]"));
    expect(d.statement.result.score).to.include({ raw: 3, max: 3, scaled: 1 });
    expect(
      d.statement.result.extensions[
        "https://haxtheweb.org/xapi/extensions/attempts"
      ],
    ).to.equal(1);
  });

  it("sends the learner's order as choice ids and conforms to xAPI 1.0.3", async () => {
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000002",
        "https://example.org/",
      ),
    );
    const el = await fixture(
      html`<sorting-question question="Order" .randomize=${false}>
        <input value="One" />
        <input value="Two" />
        <input value="Three" />
      </sorting-question>`,
    );
    await flush();
    await el.updateComplete;
    const ids = el.xapiDefinition().choices.map((c) => c.id);
    // put the options in the order Three, One, Two
    const fieldset = el.shadowRoot.querySelector("fieldset");
    const options = Array.from(el.getOptions());
    fieldset.insertBefore(options[2], options[0]);
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    await el.checkAnswer();
    await flush(200);
    await el.updateComplete;
    setActorProvider(null);
    const s = events[0].statement;
    expect(s.result.response).to.equal([ids[2], ids[0], ids[1]].join("[,]"));
    expect(s.result.success).to.equal(false);
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });
});
