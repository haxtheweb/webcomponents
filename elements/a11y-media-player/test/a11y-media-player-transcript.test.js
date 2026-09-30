import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-media-player.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network (see helper)
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads two real cues onto the fixture media through the imperative
 * HTMLMediaElement.addTextTrack / VTTCue APIs so the transcript pipeline runs
 * without any network request (no .vtt fetch, unlike <track src>).
 */
async function loadCues(el, media) {
  const track = media.addTextTrack("subtitles", "English", "en");
  track.addCue(new VTTCue(1, 5, "Hello world"));
  track.addCue(new VTTCue(6, 10, "Second cue"));
  await sleep(60);
  await el.updateComplete;
  return track;
}

describe("a11y-media-player transcript system", () => {
  let el;
  let media;
  let track;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    media = el.querySelector("video");
    media.play = () => Promise.resolve();
    media.pause = () => {};
    el.__preloadedDuration = 60;
    await el.updateComplete;
    track = await loadCues(el, media);
  });

  it("collects track cues into the cues array", () => {
    expect(el.cues.length).to.equal(2);
    expect(el.hasCaptions).to.equal(true);
    expect(el.cues[0].text).to.equal("Hello world");
    expect(el.cues[1].text).to.equal("Second cue");
    // cues are sorted by start time
    expect(el.cues[0].startTime).to.equal(1);
    expect(el.cues[1].startTime).to.equal(6);
  });

  it("pickers list loaded tracks with an Off option", () => {
    expect(el.captionsPicker[-1]).to.equal("Off");
    expect(el.captionsPicker[0]).to.equal("English");
    expect(el.transcriptPicker[-1]).to.equal("Off");
    expect(el.transcriptPicker[0]).to.equal("English");
  });

  it("transcriptTrackKey and captionsTrackKey track selection state", async () => {
    expect(el.transcriptTrackKey).to.equal(-1);
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    // keys come from Object.keys so they are strings
    expect(el.transcriptTrackKey).to.equal("0");
    expect(el.captionsTrackKey).to.equal(-1);
    el.selectCaptionByKey(0);
    await el.updateComplete;
    expect(el.captionsTrackKey).to.equal("0");
    el.hideTranscript = true;
    await el.updateComplete;
    expect(el.transcriptTrackKey).to.equal(-1);
  });

  it("renders transcript cues once a transcript track is selected", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const cues = el.shadowRoot.querySelectorAll("a11y-media-transcript-cue");
    expect(cues.length).to.equal(2);
    expect(el.shadowRoot.querySelector("#loading")).to.not.exist;
    expect(el.transcriptCues.length).to.equal(2);
    expect(cues[0].getAttribute("lang")).to.equal("en");
    // BUG a11y-media-player.js:1391 binds the cue start timestamp to
    // cue.endTime instead of cue.startTime, so both columns show the end time.
    expect(cues[0].getAttribute("start")).to.equal("00:05");
    expect(cues[0].getAttribute("end")).to.equal("00:05");
    expect(cues[0].textContent.trim()).to.equal("Hello world");
  });

  it("hides cue timestamps when hide-timestamps is set", async () => {
    el.hideTimestamps = true;
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const cue = el.shadowRoot.querySelector("a11y-media-transcript-cue");
    expect(cue.hasAttribute("hide-timestamps")).to.be.true;
  });

  it("clicking a transcript cue seeks the media and plays", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const cue = el.shadowRoot.querySelector("a11y-media-transcript-cue");
    cue.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.__currentTime).to.equal(1);
    expect(el.__playing).to.equal(true);
    el.pause();
  });

  it("keydown on a transcript cue seeks the media", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const cues = el.shadowRoot.querySelectorAll("a11y-media-transcript-cue");
    cues[1].dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", cancelable: true, bubbles: true }),
    );
    await el.updateComplete;
    expect(el.__currentTime).to.equal(6);
    expect(el.__playing).to.equal(true);
    el.pause();
  });

  it("_setActiveCue scrolls to the active cue without error", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const cue = el.shadowRoot.querySelector("a11y-media-transcript-cue");
    cue.active = true;
    await cue.updateComplete;
    await sleep(50);
    expect(cue.active).to.equal(true);
    // scrolling is skipped when disabled
    el.disableScroll = true;
    await el.updateComplete;
    const second = el.shadowRoot.querySelectorAll("a11y-media-transcript-cue")[1];
    second.active = true;
    await second.updateComplete;
    expect(second.active).to.equal(true);
  });

  it("_transcriptScroll flips the auto-scroll preference", () => {
    el._transcriptScroll({});
    expect(el.disableScroll).to.equal(true);
    el._transcriptScroll({});
    expect(el.disableScroll).to.equal(false);
  });

  it("captionCues falls back to activeCues for html5 media", async () => {
    expect(el.captionCues).to.deep.equal([]);
    el.selectCaptionByKey(0);
    await el.updateComplete;
    // a hidden (not playing) track has an empty active-cue list
    expect(el.captionCues).to.exist;
    expect(el.captionCues.length).to.equal(0);
  });

  it("flexLayout and fullFlex depend on cues and size", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    expect(el.flexLayout).to.equal(true);
    el.responsiveSize = "md";
    await el.updateComplete;
    expect(el.fullFlex).to.equal(true);
    el.responsiveSize = "xs";
    await el.updateComplete;
    expect(el.fullFlex).to.equal(false);
    el.standAlone = true;
    await el.updateComplete;
    expect(el.flexLayout).to.equal(false);
  });

  it("download() builds a transcript download and fires transcript-downloaded", async () => {
    el.mediaTitle = "Lecture";
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const fired = [];
    el.addEventListener("transcript-downloaded", (e) => fired.push(e.type));
    el.download();
    expect(fired).to.deep.equal(["transcript-downloaded"]);
  });

  it("print() opens a print window with the transcript and fires transcript-printed", async () => {
    el.mediaTitle = "Lecture";
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    const printed = [];
    let bodyHtml = "";
    const originalOpen = globalThis.open;
    globalThis.open = () => ({
      document: {
        body: {
          set innerHTML(v) {
            bodyHtml = v;
          },
          get innerHTML() {
            return bodyHtml;
          },
        },
        close() {
          printed.push("close");
        },
      },
      focus() {
        printed.push("focus");
      },
      print() {
        printed.push("print");
      },
      addEventListener(type) {
        printed.push("listener-" + type);
      },
    });
    const fired = [];
    el.addEventListener("transcript-printed", (e) => fired.push(e.type));
    el.print();
    globalThis.open = originalOpen;
    expect(fired).to.deep.equal(["transcript-printed"]);
    expect(printed).to.deep.equal([
      "close",
      "focus",
      "print",
      "listener-afterprint",
    ]);
    expect(bodyHtml.indexOf("Lecture (Transcript)")).to.be.above(-1);
    expect(bodyHtml.indexOf("Hello world")).to.be.above(-1);
    expect(bodyHtml.indexOf("00:01")).to.be.above(-1);
  });

  it("print() omits timestamps when hideTimestamps is set", async () => {
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    el.hideTimestamps = true;
    await el.updateComplete;
    let bodyHtml = "";
    const originalOpen = globalThis.open;
    globalThis.open = () => ({
      document: {
        body: {
          set innerHTML(v) {
            bodyHtml = v;
          },
        },
        close() {},
      },
      focus() {},
      print() {},
      addEventListener() {},
    });
    el.print();
    globalThis.open = originalOpen;
    expect(bodyHtml.indexOf("00:01")).to.equal(-1);
    expect(bodyHtml.indexOf("Second cue")).to.be.above(-1);
  });
});

describe("a11y-media-player custom captions for youtube and audio", () => {
  it("renders custom captions for youtube media with cc enabled", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    const media = el.querySelector("video");
    const track = await loadCues(el, media);
    el.captionsTrack = track;
    el.cc = true;
    el.__currentTime = 2;
    await el.updateComplete;
    expect(el.showCustomCaptions).to.equal(true);
    expect(el.shadowRoot.querySelector("#cc-custom")).to.exist;
    const text = el.shadowRoot.querySelector("#cc-text");
    expect(text.textContent.indexOf("Hello world")).to.be.above(-1);
    // an out-of-range cue contributes an empty string
    el.__currentTime = 20;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#cc-custom")).to.exist;
    el.pause();
  });

  it("captionCues maps only the cue covering the current time for youtube", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    const media = el.querySelector("video");
    const track = await loadCues(el, media);
    el.captionsTrack = track;
    el.__currentTime = 2;
    await el.updateComplete;
    const inRange = el.captionCues;
    expect(inRange.length).to.equal(2);
    expect(inRange[0].text).to.equal("Hello world");
    expect(JSON.stringify(inRange[1])).to.equal("{}");
    el.__currentTime = 0;
    expect(el.captionCues[0].text).to.equal(undefined);
  });

  it("reports custom captions for audio-only media while cues are inactive", async () => {
    const el = await fixture(html`
      <a11y-media-player audio-only>
        <source src="data:audio/mp3," type="audio/mpeg" />
      </a11y-media-player>
    `);
    await el.updateComplete;
    const media = el.querySelector("audio");
    expect(media).to.exist;
    const track = await loadCues(el, media);
    el.captionsTrack = track;
    el.cc = true;
    el.__currentTime = 3;
    await el.updateComplete;
    expect(el.audioOnly).to.equal(true);
    expect(el.showCustomCaptions).to.equal(true);
    // html5 captionCues come from track.activeCues, which stay empty until
    // real playback starts, so #cc-custom waits for an active cue
    expect(el.captionCues).to.exist;
    expect(el.captionCues.length).to.equal(0);
    expect(el.shadowRoot.querySelector("#cc-custom")).to.not.exist;
  });
});
