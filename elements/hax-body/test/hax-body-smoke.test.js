import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";

describe("hax-body smoke", () => {
  it("instantiates", async () => {
    const el = await fixture(html`<hax-body></hax-body>`);
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal("hax-body");
  });
});
