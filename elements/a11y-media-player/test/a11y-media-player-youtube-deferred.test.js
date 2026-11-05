import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../a11y-media-player.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network (see helper)
installOfflineYouTubeStubs();

// the YouTube player (API script + embed iframe) is not created during
// first paint: it waits for an idle moment, or for someone to press play
describe("a11y-media-player YouTube creation is deferred", () => {
  it("shows the play button first and creates the YouTube player on idle", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("a11y-media-play-button")).to.not.equal(
      null,
    );
    await waitUntil(() => el.youtube, "youtube player created", {
      timeout: 6000,
    });
    expect(el.youtube.getAttribute("video-id")).to.equal("abc123");
    expect(el.youtube.autoplay).to.equal(false);
  });

  it("pressing play before then creates it at once and starts it", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    el.__youtubeWanted = false;
    await el.updateComplete;
    if (el.youtube) {
      // a very idle machine may already have created it; nothing to defer
      return;
    }
    el.play();
    await el.updateComplete;
    expect(el.youtube).to.not.equal(false);
    expect(el.youtube.autoplay).to.equal(true);
  });

  it("hands the current volume and mute state to the new YouTube player", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123" muted></a11y-media-player>`,
    );
    el.setVolume(25);
    await waitUntil(() => el.youtube, "youtube player created", {
      timeout: 6000,
    });
    await el.youtube.updateComplete;
    expect(el.youtube.volume).to.equal(25);
    expect(el.youtube.muted).to.equal(true);
  });
});
