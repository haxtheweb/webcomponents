import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../mark-the-words.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));
const text = (c) => Object.values(c.description)[0];

describe("mark-the-words xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000005",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("is a choice interaction over the distinct words", async () => {
    const el = await fixture(
      html`<mark-the-words
        question="Mark the fruit"
        statement="Apples and Pears and Rocks"
      >
        <input correct value="Apples" />
        <input correct value="Pears" />
      </mark-the-words>`,
    );
    await flush();
    await el.updateComplete;
    ["Apples", "Rocks"].forEach((w) => {
      el.wordList.find((x) => x.text === w).selected = true;
    });
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    el.checkAnswer();
    await flush(120);
    expect(events.length).to.equal(1);
    const def = events[0].statement.object.definition;
    expect(def.interactionType).to.equal("choice");
    // "and" twice in the passage is one choice
    expect(def.choices.map(text)).to.deep.equal([
      "Apples",
      "and",
      "Pears",
      "Rocks",
    ]);
    const [apples, , pears, rocks] = def.choices.map((c) => c.id);
    expect(def.correctResponsesPattern).to.deep.equal([`${apples}[,]${pears}`]);
    expect(events[0].statement.result.response).to.equal(
      `${apples}[,]${rocks}`,
    );
    const r = await executeServerCommand("xapi-validate", events[0].statement);
    expect(r.errors).to.deep.equal([]);
  });

  it("leaves the pattern out when a correct word is ambiguous", async () => {
    const el = await fixture(
      html`<mark-the-words question="Q" statement="The cat and the dog">
        <input correct value="the" />
      </mark-the-words>`,
    );
    await flush();
    await el.updateComplete;
    const def = el.xapiDefinition();
    expect(def.choices.length).to.equal(5);
    expect(def.correctResponsesPattern).to.equal(undefined);
  });
});
