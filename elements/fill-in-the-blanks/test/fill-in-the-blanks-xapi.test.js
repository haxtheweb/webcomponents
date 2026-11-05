import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../fill-in-the-blanks.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe("fill-in-the-blanks xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000006",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends each blank as a fill-in item and every accepted combination", async () => {
    const el = await fixture(
      html`<fill-in-the-blanks
        question="Fill it"
        statement="Put [milk~milky] on [cereal] for [breakfast|lunch|tea] ."
      ></fill-in-the-blanks>`,
    );
    await flush();
    await el.updateComplete;
    const inputs = Array.from(
      el.shadowRoot.querySelectorAll("[data-answer-index]"),
    );
    expect(inputs.length).to.equal(3);
    inputs[0].value = " Milky ";
    inputs[1].value = "{cereal} [,] oats";
    inputs[2].value = "breakfast";
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    el.checkAnswer();
    await flush(120);
    expect(events.length).to.equal(1);
    const s = events[0].statement;
    const def = s.object.definition;
    expect(def.interactionType).to.equal("fill-in");
    expect(def.choices).to.equal(undefined);
    expect(def.correctResponsesPattern).to.deep.equal([
      "milk[,]cereal[,]breakfast",
      "milky[,]cereal[,]breakfast",
    ]);
    expect(s.result.response).to.match(
      /^Milky\[,\]\{lang=[^}]+\}\{cereal\} , oats\[,\]breakfast$/,
    );
    expect(s.result.score).to.include({ raw: 2, max: 3 });
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });
});
