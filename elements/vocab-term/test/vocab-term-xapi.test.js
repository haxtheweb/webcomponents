import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../vocab-term.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

describe("vocab-term xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b2",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends one conformant experienced statement when the definition is opened", async () => {
    const el = await fixture(
      html`<vocab-term
        popover-mode
        term="Coffee"
        information="Bean juice made into warm beverage."
      ></vocab-term>`,
    );
    await el.updateComplete;
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    const summary = el.shadowRoot.querySelector("summary");
    summary.click();
    summary.click();
    expect(events.length).to.equal(1);
    const s = events[0].statement;
    expect(s.verb.id).to.equal("http://adlnet.gov/expapi/verbs/experienced");
    expect(Object.values(s.object.definition.name)[0]).to.equal("Coffee");
    // opening a definition never completes anything
    expect(s.result).to.equal(undefined);
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });

  it("sends nothing while HAX is editing", async () => {
    const el = await fixture(
      html`<vocab-term term="Tea" information="Leaves in water."></vocab-term>`,
    );
    await el.updateComplete;
    el._haxstate = true;
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    el.shadowRoot.querySelector("summary").click();
    expect(events.length).to.equal(0);
  });
});
