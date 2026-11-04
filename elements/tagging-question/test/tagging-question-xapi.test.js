import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../tagging-question.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));
const text = (c) => Object.values(c.description)[0];

describe("tagging-question xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000004",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("is a choice interaction: tags as choices, applied tags as ids", async () => {
    const el = await fixture(
      html`<tagging-question question="Pick the ducks">
        <input data-correct="true" value="Duey" />
        <input data-correct="true" value="Daffy" />
        <input value="Moo" />
      </tagging-question>`,
    );
    await flush();
    await el.updateComplete;
    expect(el.xapiInteractionType()).to.equal("choice");
    ["Duey", "Moo"].forEach((label) =>
      el.addTag(el.displayedAnswers.find((a) => a.label === label)),
    );
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    el.checkAnswer();
    await flush(120);
    expect(events.length).to.equal(1);
    const def = events[0].statement.object.definition;
    expect(def.interactionType).to.equal("choice");
    expect(def.choices.map(text)).to.deep.equal(["Duey", "Daffy", "Moo"]);
    const [duey, daffy, moo] = def.choices.map((c) => c.id);
    expect(def.correctResponsesPattern).to.deep.equal([`${duey}[,]${daffy}`]);
    expect(events[0].statement.result.response).to.equal(`${duey}[,]${moo}`);
    const r = await executeServerCommand("xapi-validate", events[0].statement);
    expect(r.errors).to.deep.equal([]);
  });
});
