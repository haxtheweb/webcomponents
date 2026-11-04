import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../self-check.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

describe("self-check xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b1",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends one conformant experienced statement the first time the answer is revealed", async () => {
    const el = await fixture(
      html`<self-check title="Sharks">
        <span slot="question">How large can a great white grow?</span>
        About 6 meters.
      </self-check>`,
    );
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    await el.openAnswer();
    await el.openAnswer();
    await el.openAnswer();
    expect(events.length).to.equal(1);
    const s = events[0].statement;
    expect(s.verb.id).to.equal("http://adlnet.gov/expapi/verbs/experienced");
    expect(s.result.completion).to.equal(true);
    expect(Object.values(s.object.definition.name)[0]).to.include(
      "great white",
    );
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });

  it("declares a vocabulary that counts toward completion", () => {
    const v = customElements.get("self-check").xapiVocabulary;
    expect(v.countsTowardCompletion).to.equal(true);
  });
});
