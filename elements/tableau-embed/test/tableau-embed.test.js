import { html, fixture, expect } from "@open-wc/testing";
import "../tableau-embed.js";

describe("TableauEmbed test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <tableau-embed src="https://example.com/view"></tableau-embed>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
