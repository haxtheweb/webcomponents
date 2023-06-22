import { fixture, expect, html } from "@open-wc/testing";
import "../spotify-embed.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <spotify-embed
        source="https://open.spotify.com/album/5dRcZuEijcy8xMfSaRjtk8"
        theme="0"
        size="compact"
      ></spotify-embed>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
