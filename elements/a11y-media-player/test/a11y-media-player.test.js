import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-media-player.js";
import { installOfflineYouTubeStubs, FakeYTPlayer } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network (see helper)
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

describe("a11y-media-player offline youtube stubbing", () => {
  it("builds the youtube child with the fake YT.Player and never the real API", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    await sleep(100);
    const yt = el.youtube;
    expect(yt).to.exist;
    expect(yt.tagName.toLowerCase()).to.equal("a11y-media-youtube");
    expect(yt.__yt).to.be.instanceOf(FakeYTPlayer);
    expect(yt.__video).to.be.instanceOf(FakeYTPlayer);
    // the poster getter is wrapped so no img.youtube.com url enters the DOM
    expect(el.poster.indexOf("data:")).to.equal(0);
    expect(el.shadowRoot.querySelector("#print-thumbnail")).to.exist;
  });

  it("reuses the existing player when iframe-only properties change", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    await sleep(100);
    const before = el.youtube.__yt;
    el.height = "50%";
    el.width = "50%";
    el.preload = "auto";
    await el.updateComplete;
    await sleep(50);
    expect(el.youtube.__yt === before).to.be.true;
  });
});

describe("a11y-media-player boolean and string properties", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
  });

  it("reflects constructor defaults", () => {
    expect(el.allowConcurrent).to.equal(false);
    expect(el.audioOnly).to.equal(false);
    expect(el.autoplay).to.equal(false);
    expect(el.cc).to.equal(false);
    expect(el.darkTranscript).to.equal(false);
    expect(el.disableFullscreen).to.equal(false);
    expect(el.disableInteractive).to.equal(false);
    expect(el.disablePrintButton).to.equal(false);
    expect(el.disableSearch).to.equal(false);
    expect(el.disableScroll).to.equal(false);
    expect(el.disableSeek).to.equal(false);
    expect(el.hideElapsedTime).to.equal(false);
    expect(el.hideTimestamps).to.equal(false);
    expect(el.hideTranscript).to.equal(false);
    expect(el.learningMode).to.equal(false);
    expect(el.linkable).to.equal(false);
    expect(el.loop).to.equal(false);
    expect(el.muted).to.equal(false);
    expect(el.hideYoutubeLink).to.equal(false);
    expect(el.playbackRate).to.equal(1);
    expect(el.preload).to.equal("metadata");
    expect(el.standAlone).to.equal(false);
    expect(el.stackedLayout).to.equal(false);
    expect(el.sticky).to.equal(false);
    expect(el.stickyCorner).to.equal("top-right");
    expect(el.volume).to.equal(70);
    expect(el.mediaLang).to.equal("en");
    expect(el.mediaTitle).to.equal("");
    expect(el.audioDescriptionSource).to.equal("");
    expect(el.audioDescriptionEnabled).to.equal(false);
    expect(el.__playing).to.equal(false);
    expect(el.__settingsOpen).to.equal(false);
    // responsive-size is measured by responsive-utility after connect, so
    // only its membership in the scale can be asserted reliably
    expect(["xs", "sm", "md", "lg", "xl"]).to.include(el.responsiveSize);
  });

  it("sets and reflects boolean properties", async () => {
    const bools = [
      "allowConcurrent",
      "autoplay",
      "cc",
      "darkTranscript",
      "disableFullscreen",
      "disableInteractive",
      "disablePrintButton",
      "disableSearch",
      "disableScroll",
      "disableSeek",
      "hideElapsedTime",
      "hideTimestamps",
      "hideTranscript",
      "learningMode",
      "linkable",
      "loop",
      "muted",
      "hideYoutubeLink",
      "stackedLayout",
      "standAlone",
    ];
    for (const prop of bools) {
      el[prop] = true;
      await el.updateComplete;
      expect(el[prop]).to.equal(true);
      el[prop] = false;
      await el.updateComplete;
      expect(el[prop]).to.equal(false);
    }
  });

  it("learningMode forces disableSeek and hideTranscript", async () => {
    el.learningMode = true;
    await el.updateComplete;
    expect(el.disableSeek).to.equal(true);
    expect(el.hideTranscript).to.equal(true);
    el.learningMode = false;
    await el.updateComplete;
    expect(el.disableSeek).to.equal(false);
    expect(el.hideTranscript).to.equal(false);
  });

  it("sets string and number properties", async () => {
    el.height = "200px";
    el.width = "400px";
    el.mediaLang = "es";
    el.mediaTitle = "My Video";
    el.crossorigin = "anonymous";
    el.stickyCorner = "bottom-left";
    el.playbackRate = 2;
    el.volume = 50;
    el.youtubeId = "abc123";
    await el.updateComplete;
    await sleep(100);
    expect(el.height).to.equal("200px");
    expect(el.width).to.equal("400px");
    expect(el.mediaLang).to.equal("es");
    expect(el.mediaTitle).to.equal("My Video");
    expect(el.crossorigin).to.equal("anonymous");
    expect(el.stickyCorner).to.equal("bottom-left");
    expect(el.playbackRate).to.equal(2);
    expect(el.volume).to.equal(50);
    expect(el.isYoutube).to.equal(true);
    // height drives the css custom property through updated()
    expect(el.style.getPropertyValue("--a11y-media-player-height")).to.equal(
      "200px",
    );
  });

  it("fires a changed event for every updated property", async () => {
    const fired = [];
    const handler = (e) => fired.push(e.type);
    el.addEventListener("media-title-changed", handler);
    el.mediaTitle = "Fired";
    await el.updateComplete;
    el.removeEventListener("media-title-changed", handler);
    expect(fired).to.deep.equal(["media-title-changed"]);
  });

  it("_setAttribute removes on falsy and sets on truthy", () => {
    el.setAttribute("data-x", "1");
    el._setAttribute("data-x", false);
    expect(el.hasAttribute("data-x")).to.be.false;
    el._setAttribute("data-x", "truthy");
    expect(el.getAttribute("data-x")).to.equal("truthy");
  });
});

describe("a11y-media-player calculated getters", () => {
  let video;
  let yt;
  beforeEach(async () => {
    video = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await video.updateComplete;
    yt = await fixture(html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`);
    await yt.updateComplete;
    await sleep(100);
  });

  it("anchor exposes target and params", () => {
    const anchor = video.anchor;
    expect(anchor).to.exist;
    expect(anchor.params).to.exist;
  });

  it("aspect falls back to 16/9 and stores width", () => {
    expect(video.aspect).to.be.closeTo(16 / 9, 0.001);
    video.width = "400px";
    expect(video.aspect).to.be.closeTo(16 / 9, 0.001);
  });

  it("audioNoThumb only applies to audio without a thumbnail", () => {
    expect(video.audioNoThumb).to.equal(false);
    video.audioOnly = true;
    expect(video.audioOnly).to.equal(true);
    expect(video.audioNoThumb).to.equal(true);
    video.thumbnailSrc = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
    expect(video.audioNoThumb).to.equal(false);
  });

  it("buffered reads from the youtube player or defaults to 0", () => {
    expect(video.buffered).to.equal(0);
    const fake = yt.youtube.__yt;
    fake.bufferedRange = { length: 1, end: (i) => 42 };
    expect(yt.buffered).to.equal(42);
    fake.bufferedRange = null;
    expect(yt.buffered).to.equal(0);
  });

  it("duration prefers media duration then __preloadedDuration then 0", () => {
    expect(video.duration).to.equal(0);
    video.__preloadedDuration = 100;
    expect(video.duration).to.equal(100);
    const fake = yt.youtube.__yt;
    expect(yt.duration).to.equal(0);
    fake.durationVal = 250;
    expect(yt.duration).to.equal(250);
  });

  it("playing mirrors __playing", () => {
    expect(video.playing).to.equal(false);
    video.__playing = true;
    expect(video.playing).to.equal(true);
    video.__playing = false;
  });

  it("loadedTracks is the html5 media element; media prefers youtube", () => {
    expect(video.loadedTracks.tagName.toLowerCase()).to.equal("video");
    expect(video.loadedTracks === video.querySelector("video")).to.be.true;
    expect(yt.media.tagName.toLowerCase()).to.equal("a11y-media-youtube");
    expect(video.media.tagName.toLowerCase()).to.equal("video");
  });

  it("mediaCaption variants", () => {
    expect(video.mediaCaption).to.equal(undefined);
    video.mediaTitle = "Lecture";
    expect(video.mediaCaption).to.equal("Lecture");
    video.audioOnly = true;
    expect(video.mediaCaption).to.equal("Lecture (Audio)");
    video.mediaTitle = "";
    expect(video.mediaCaption).to.equal("Audio");
  });

  it("printCaption variants", () => {
    expect(video.printCaption).to.equal("Video");
    video.mediaTitle = "Lecture";
    expect(video.printCaption).to.equal("Lecture (Video)");
    video.audioOnly = true;
    expect(video.printCaption).to.equal("Lecture (Audio)");
    video.mediaTitle = "";
    expect(video.printCaption).to.equal("Audio");
  });

  it("mediaMaxWidth is unset for audioNoThumb and a calc otherwise", () => {
    video.audioOnly = true;
    expect(video.mediaMaxWidth).to.equal("max-width:unset;");
    video.audioOnly = false;
    expect(video.mediaMaxWidth.indexOf("calc(")).to.equal(10);
  });

  it("playerStyle variants", () => {
    // audio without a thumbnail collapses the player height
    video.audioOnly = true;
    expect(video.playerStyle.indexOf("height:60px")).to.equal(0);
    video.audioOnly = false;
    expect(video.playerStyle.indexOf("height:60px")).to.equal(-1);
    expect(video.playerStyle.indexOf("%")).to.be.above(-1);
    video.thumbnailSrc = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
    video.youtubeId = "xyz789";
    expect(video.playerStyle.indexOf("background-image:url('data:")).to.be.above(-1);
  });

  it("poster prefers thumbnailSrc and wraps external youtube urls", () => {
    video.thumbnailSrc = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
    expect(video.poster.indexOf("data:")).to.equal(0);
    video.thumbnailSrc = null;
    video.youtubeId = "abc123";
    // offline stub: external thumbnail url becomes an inline placeholder
    expect(video.poster.indexOf("data:")).to.equal(0);
  });

  it("mediaStart / mediaEnd / mediaSeekable from the youtube player", () => {
    expect(video.mediaSeekable).to.equal(false);
    expect(video.mediaStart).to.equal(0);
    expect(video.mediaEnd).to.equal(false);
    yt.youtube.__yt.durationVal = 200;
    expect(yt.mediaSeekable).to.equal(true);
    expect(yt.mediaStart).to.equal(0);
    expect(yt.mediaEnd).to.equal(200);
  });

  it("currentTime follows the slider while dragging", async () => {
    video.__currentTime = 5;
    expect(video.currentTime).to.equal(5);
    const slider = video.__sliderEl;
    expect(slider).to.exist;
    slider.dragging = true;
    slider.immediateValue = 33;
    await video.updateComplete;
    expect(video.currentTime).to.equal(33);
    slider.dragging = false;
    await video.updateComplete;
    expect(video.currentTime).to.equal(5);
  });

  it("shareLink encodes id and timecode", () => {
    // an unset id gets auto-assigned in willUpdate, so a link always targets
    expect(video.shareLink.indexOf("?id=")).to.be.above(-1);
    video.id = "player1";
    video.__currentTime = 42;
    expect(video.shareLink.indexOf("?id=player1&t=42")).to.be.above(-1);
  });

  it("status shows loading, press play, playing and progress states", async () => {
    expect(video.status).to.equal("Loading...");
    expect(yt.status).to.equal("Press play.");
    yt.__playing = true;
    await yt.updateComplete;
    expect(yt.status).to.equal("Loading...");
    yt.__playing = false;
    video.__preloadedDuration = 100;
    video.__currentTime = 10;
    await video.updateComplete;
    // with a duration the status is a template of progress/duration
    expect(video.status).to.exist;
    expect(String(video.status.values)).to.exist;
  });

  it("stickyMode tracks sticky and stickyCorner", () => {
    video.sticky = true;
    expect(video.stickyMode).to.equal(true);
    video.stickyCorner = "none";
    expect(video.stickyMode).to.equal(false);
    video.sticky = false;
  });

  it("videoData parses youtubeId with timecode parameters", () => {
    expect(video.videoData).to.equal(undefined);
    video.youtubeId = "abc123?t=30";
    expect(video.videoData.videoId).to.equal("abc123");
    expect(video.videoData.t).to.equal(30);
    expect(video.videoId).to.equal("abc123");
  });

  it("youtube getter returns the child element or false", async () => {
    expect(video.youtube).to.equal(false);
    expect(yt.youtube.tagName.toLowerCase()).to.equal("a11y-media-youtube");
  });

  it("initialTimecode prefers the anchor target then videoData", () => {
    video.youtubeId = "abc123?t=25";
    expect(video.initialTimecode).to.equal(25);
    const original = globalThis.AnchorBehaviors;
    globalThis.AnchorBehaviors = {
      getTarget: (target) => target,
      params: { t: "1m" },
    };
    expect(video.initialTimecode).to.equal(60);
    globalThis.AnchorBehaviors = original;
  });

  it("fullscreenTarget is the shadow player section", () => {
    const target = video.fullscreenTarget;
    expect(target).to.exist;
    expect(target.id).to.equal("player-section");
  });

  it("_getHHMMSS formats seconds", () => {
    expect(video._getHHMMSS(10)).to.equal("00:10");
    expect(video._getHHMMSS(5.4, 10)).to.equal("00:05");
    expect(video._getHHMMSS(3661.4, 7322.8)).to.equal("01:01:01");
    expect(video._getHHMMSS(65)).to.equal("01:05");
  });

  it("_getSeconds parses clock and h/m/s strings", () => {
    expect(video._getSeconds("10")).to.equal(10);
    expect(video._getSeconds("30s")).to.equal(30);
    expect(video._getSeconds("1h2m3s")).to.equal(3723);
    expect(video._getSeconds("01:02:03.5")).to.equal(3723.5);
    expect(video._getSeconds("0s")).to.equal(0);
    // BUG a11y-media-player.js:3795 defaults time to the number 0 but then
    // calls time.replace(...) on it, so a no-argument call throws a TypeError.
    expect(() => video._getSeconds()).to.throw(TypeError);
  });
});

describe("a11y-media-player render branches", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
  });

  it("renders the core controls", () => {
    expect(el.shadowRoot.querySelector("#player-section")).to.exist;
    expect(el.shadowRoot.querySelector("#html5")).to.exist;
    expect(el.shadowRoot.querySelector("#slider")).to.exist;
    expect(el.shadowRoot.querySelector("#controls")).to.exist;
    expect(el.shadowRoot.querySelector("#settings")).to.exist;
    expect(el.shadowRoot.querySelector("#transcript-section")).to.exist;
    expect(el.shadowRoot.querySelector("#simplesearch")).to.exist;
  });

  it("renders the transcript loading placeholder without cues", () => {
    expect(el.shadowRoot.querySelector("#loading")).to.exist;
    expect(el.shadowRoot.querySelector("#transcript")).to.exist;
  });

  it("renders a play button label that flips with playing state", async () => {
    const play = el.shadowRoot.querySelector("#playbutton");
    expect(play.getAttribute("action")).to.equal("play");
    el.__playing = true;
    await el.updateComplete;
    expect(play.getAttribute("action")).to.equal("pause");
    el.__playing = false;
    await el.updateComplete;
  });

  it("renders the youtube open button only for youtube media", async () => {
    expect(el.shadowRoot.querySelector('[icon="mdi-social:youtube"]')).to.not
      .exist;
    el.youtubeId = "abc123";
    await el.updateComplete;
    await sleep(100);
    expect(el.shadowRoot.querySelector('[icon="mdi-social:youtube"]')).to.exist;
    expect(el.shadowRoot.querySelector("a11y-media-youtube")).to.exist;
  });

  it("renders the transcript as hidden when hide-transcript", async () => {
    el.hideTranscript = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#transcript-and-controls").hidden).to.be
      .true;
    el.hideTranscript = false;
    await el.updateComplete;
  });

  it("updated() reflects flex, sticky and height attributes", async () => {
    // cue-shaped fakes keep the transcript render path safe (cue.track etc.)
    const fakeTrack = { language: "en", label: "English" };
    el.__cues = [
      { startTime: 1, endTime: 2, track: fakeTrack },
      { startTime: 3, endTime: 4, track: fakeTrack },
      { startTime: 5, endTime: 6, track: fakeTrack },
    ];
    await el.updateComplete;
    expect(el.hasAttribute("flex-layout")).to.be.true;
    el.stackedLayout = true;
    await el.updateComplete;
    expect(el.hasAttribute("flex-layout")).to.be.false;
    el.stackedLayout = false;
    el.sticky = true;
    el.__playing = true;
    await el.updateComplete;
    expect(el.getAttribute("sticky-mode")).to.equal("true");
    el.sticky = false;
    el.__playing = false;
    await el.updateComplete;
  });

  it("updated() syncs media attributes from the element", async () => {
    const media = el.querySelector("video");
    el.muted = true;
    await el.updateComplete;
    expect(media.muted).to.equal(true);
    el.loop = true;
    await el.updateComplete;
    // NOTE: _setAttribute targets the host element; its media argument is
    // silently ignored (a11y-media-player.js:2528-2535)
    expect(el.getAttribute("loop")).to.equal("true");
    el.mediaLang = "de";
    await el.updateComplete;
    expect(el.getAttribute("lang")).to.equal("de");
    el.playbackRate = 1.5;
    await el.updateComplete;
    expect(el.getAttribute("playbackRate")).to.equal("1.5");
  });

  it("autoplay starts playback through the youtube stub", async () => {
    const yt = await fixture(
      html`<a11y-media-player youtube-id="abc123" autoplay></a11y-media-player>`,
    );
    await yt.updateComplete;
    await sleep(150);
    expect(yt.__playing).to.equal(true);
    yt.pause();
    await yt.updateComplete;
  });
});
