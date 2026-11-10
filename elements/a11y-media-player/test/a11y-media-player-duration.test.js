/**
 * The seek slider's max follows the media duration, whatever order the
 * metadata and the player's renders happen in. `duration` is read from the
 * media; if the player does not render again when the media reports it,
 * the slider keeps a stale max (0 on first load) and ignores arrow keys and
 * clicks until some unrelated update (the intermittent "ArrowRight seeks
 * forward" failure in the media keyboard-flow test). The media reports the
 * duration here with no other reactive change on the player.
 */
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../a11y-media-player.js";

const localMedia = new URL(
  "../../app-hax/lib/assets/sounds/success.mp3",
  import.meta.url,
).href;

const sliderMax = (amp) => {
  const input = amp.shadowRoot
    .querySelector("#slider")
    .shadowRoot.querySelector("input");
  return Number(input.max);
};

describe("a11y-media-player seek slider follows the media duration", () => {
  let amp;
  let media;

  beforeEach(async () => {
    amp = await fixture(
      html`<a11y-media-player
        audio-only
        preload="metadata"
        .crossorigin=${"anonymous"}
        .sources=${[{ src: localMedia, type: "audio/mpeg" }]}
      ></a11y-media-player>`,
    );
    await amp.updateComplete;
    await waitUntil(() => amp.media && amp.duration > 0, "metadata", {
      timeout: 4000,
    });
    media = amp.media;
    await amp.updateComplete;
  });

  it("renders again when the media reports a new duration", async () => {
    // the slider settles on the first real duration
    await waitUntil(() => sliderMax(amp) === amp.duration, "first max", {
      timeout: 2000,
    });
    // the media now reports a different duration (a stream that grew, or
    // metadata that arrived after every other update), with no other
    // reactive change on the player
    Object.defineProperty(media, "duration", {
      configurable: true,
      get: () => 42,
    });
    media.dispatchEvent(new Event("durationchange"));
    await amp.updateComplete;
    expect(sliderMax(amp), "slider max follows durationchange").to.equal(42);
    Object.defineProperty(media, "duration", {
      configurable: true,
      get: () => 84,
    });
    media.dispatchEvent(new Event("loadedmetadata"));
    await amp.updateComplete;
    expect(sliderMax(amp), "slider max follows loadedmetadata").to.equal(84);
  });

  afterEach(() => {
    if (media) delete media.duration;
  });
});
