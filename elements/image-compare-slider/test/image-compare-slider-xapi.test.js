import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../image-compare-slider.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

describe("image-compare-slider xAPI", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b4",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  it("sends one conformant interacted statement when the slider is first moved", async () => {
    const el = await fixture(
      html`<image-compare-slider
        title="Matterhorn"
        top-src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        bottom-src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        top-alt="cloudy"
        bottom-alt="clear"
      ></image-compare-slider>`,
    );
    el.elementVisible = true;
    await el.updateComplete;
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    const compare = el.shadowRoot.querySelector("a11y-compare-image");
    compare.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
    compare.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
    expect(events.length).to.equal(1);
    const s = events[0].statement;
    expect(s.verb.id).to.equal("http://adlnet.gov/expapi/verbs/interacted");
    const r = await executeServerCommand("xapi-validate", s);
    expect(r.errors).to.deep.equal([]);
  });
});
