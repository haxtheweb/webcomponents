import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../matching-question.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));
const text = (c) => Object.values(c.description)[0];

describe("matching-question xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000003",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends source / target components and id pairs (xAPI 1.0.3)", async () => {
    const el = await fixture(
      html`<matching-question question="Who says what?">
        <input data-correct="true" value="Bark" />
        <input value="Dog" />
        <input data-correct="true" value="Meow" />
        <input value="Cat" />
      </matching-question>`,
    );
    await flush();
    await el.updateComplete;
    const find = (label) => el.answers.find((a) => a.label === label);
    const meow = find("Meow").order;
    el.matchAnswers = ["Dog", "Cat"].map((label) => ({
      ...JSON.parse(JSON.stringify(find(label))),
      guess: meow,
    }));
    el.displayedAnswers = el.displayedAnswers.filter((a) => a.target);
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    await el.checkAnswer();
    await flush(120);
    expect(events.length).to.equal(1);
    const d = events[0];
    expect(d).to.include({ activityDisplay: "answered", resultSuccess: false });
    const def = d.statement.object.definition;
    expect(def.interactionType).to.equal("matching");
    expect(def.source.map(text)).to.deep.equal(["Dog", "Cat"]);
    expect(def.target.map(text)).to.deep.equal(["Bark", "Meow"]);
    const [dog, cat] = def.source.map((c) => c.id);
    const [bark, mw] = def.target.map((c) => c.id);
    expect(def.correctResponsesPattern).to.deep.equal([
      `${dog}[.]${bark}[,]${cat}[.]${mw}`,
    ]);
    expect(d.statement.result.response).to.equal(
      `${dog}[.]${mw}[,]${cat}[.]${mw}`,
    );
    const r = await executeServerCommand("xapi-validate", d.statement);
    expect(r.errors).to.deep.equal([]);
  });
});
