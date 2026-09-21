import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-media-player.js";

describe("a11y-media-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<a11y-media-player
        accent-color="red"
        youtube-id="BKorP55Aqvg"
      ></a11y-media-player>`,
    );
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-media-player");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-media-player>
          <video>
            <source src="test-video.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="test-captions.vtt"
              srclang="en"
              label="English"
            />
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle audioOnly property", async () => {
        expect(testElement.audioOnly).to.equal(false);

        testElement.audioOnly = true;
        await testElement.updateComplete;
        expect(testElement.audioOnly).to.equal(true);
        expect(testElement.hasAttribute("audio-only")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });
});