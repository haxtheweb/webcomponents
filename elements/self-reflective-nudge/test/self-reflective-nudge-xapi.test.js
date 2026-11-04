import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../self-reflective-nudge.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

describe("self-reflective-nudge xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b3",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends a conformant likert statement with the chosen scale id", async () => {
    const el = await fixture(
      html`<self-reflective-nudge input="mood"></self-reflective-nudge>`,
    );
    await el.updateComplete;
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    const radios = el.shadowRoot.querySelectorAll('input[type="radio"]');
    radios[2].click();
    await el.updateComplete;
    expect(events.length).to.equal(1);
    const s = events[0].statement;
    const def = s.object.definition;
    expect(def.interactionType).to.equal("likert");
    expect(def.scale.length).to.equal(radios.length);
    expect(def.scale.map((c) => c.id)).to.include(s.result.response);
    expect(s.result.completion).to.equal(true);
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });
});
