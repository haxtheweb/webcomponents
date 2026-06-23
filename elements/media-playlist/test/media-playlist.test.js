import { html, fixture, expect } from '@open-wc/testing';
import "../media-playlist.js";

describe("MediaPlaylist test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <media-playlist
        title="title"
      ></media-playlist>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
