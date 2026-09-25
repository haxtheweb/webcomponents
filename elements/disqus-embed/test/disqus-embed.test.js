import { fixture, expect, html } from "@open-wc/testing";
import "../disqus-embed.js";

describe("disqus-embed", () => {
  it("instantiates", async () => {
    const el = await fixture(html`<disqus-embed></disqus-embed>`);
    expect(el).to.exist;
    if (el._timeout) clearTimeout(el._timeout);
  });
});
