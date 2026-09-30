import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-media-player.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network (see helper)
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A light fake media element used to drive seek() through the seekable and
 * the throwing-currentTime branches without any real media decoding.
 */
class FakeMedia {
  constructor(opts) {
    this.duration = 50;
    this.seekable = { length: 1 };
    // textTracks is required: render reads transcriptTrackKey/_getTrackId
    // which calls Object.keys(this.loadedTracks.textTracks)
    this.textTracks = [];
    this.playbackRateCalls = [];
    this.currentTimeCalls = [];
    this.throws = opts && opts.throws;
  }
  seek(time) {
    this.seeked = this.seeked || [];
    this.seeked.push(time);
  }
  get currentTime() {
    return 0;
  }
  set currentTime(v) {
    if (this.throws) throw new Error("cannot seek");
    this.currentTimeCalls.push(v);
  }
}

describe("a11y-media-player playback methods", () => {
  let el;
  let media;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
    media = el.querySelector("video");
    // stub real media playback APIs instead of relying on real decoding
    media.play = () => Promise.resolve();
    media.pause = () => {};
  });

  it("play() sets playing state and fires play events", async () => {
    const fired = [];
    el.addEventListener("play", (e) => fired.push(e.type));
    el.addEventListener("a11y-player-playing", (e) => fired.push(e.type));
    el.play();
    await el.updateComplete;
    expect(fired).to.deep.equal(["play", "a11y-player-playing"]);
    expect(el.__playing).to.equal(true);
  });

  it("pause() clears playing state and fires pause", async () => {
    el.play();
    await el.updateComplete;
    const fired = [];
    el.addEventListener("pause", (e) => fired.push(e.type));
    el.pause();
    await el.updateComplete;
    expect(fired).to.deep.equal(["pause"]);
    expect(el.__playing).to.equal(false);
  });

  it("togglePlay() flips between play and pause", async () => {
    el.togglePlay();
    await el.updateComplete;
    expect(el.__playing).to.equal(true);
    el.togglePlay();
    await el.updateComplete;
    expect(el.__playing).to.equal(false);
  });

  it("stop() pauses, seeks to 0 and fires stop", async () => {
    el.__currentTime = 30;
    const fired = [];
    el.addEventListener("stop", (e) => fired.push(e.type));
    el.stop();
    await el.updateComplete;
    expect(fired).to.deep.equal(["stop"]);
    expect(el.__playing).to.equal(false);
    expect(el.__currentTime).to.equal(0);
  });

  it("restart() seeks to 0, plays and fires restart", async () => {
    const fired = [];
    el.addEventListener("restart", (e) => fired.push(e.type));
    el.restart();
    await el.updateComplete;
    expect(fired).to.deep.equal(["restart"]);
    expect(el.__playing).to.equal(true);
    expect(el.__currentTime).to.equal(0);
    el.pause();
  });

  it("rewind() and forward() move by duration/20 by default", async () => {
    el.__preloadedDuration = 100;
    el.__currentTime = 50;
    const fired = [];
    el.addEventListener("backward", (e) => fired.push(e.type));
    el.addEventListener("forward", (e) => fired.push(e.type));
    el.rewind();
    await el.updateComplete;
    expect(fired).to.deep.equal(["backward"]);
    expect(el.__currentTime).to.equal(45);
    el.forward();
    await el.updateComplete;
    expect(fired).to.deep.equal(["backward", "forward"]);
    expect(el.__currentTime).to.equal(50);
    el.rewind(20);
    await el.updateComplete;
    expect(el.__currentTime).to.equal(30);
    el.forward(5);
    await el.updateComplete;
    expect(el.__currentTime).to.equal(35);
  });

  it("seek() is a no-op without media", async () => {
    el.youtubeId = "abc123";
    // media resolves to the (not yet rendered) youtube child: falsy
    el.seek(10);
    expect(el.__currentTime).to.equal(0);
    await el.updateComplete;
    await sleep(100);
  });

  it("seek() clamps to the duration and ignores NaN", async () => {
    el.__preloadedDuration = 100;
    el.__currentTime = 50;
    el.seek(150);
    await el.updateComplete;
    expect(el.__currentTime).to.equal(100);
    el.seek(-20);
    await el.updateComplete;
    expect(el.__currentTime).to.equal(0);
    const before = el.__currentTime;
    el.seek(NaN);
    await el.updateComplete;
    expect(el.__currentTime).to.equal(before);
  });

  it("seek() prefers media.seek when a seekable range exists", async () => {
    el.__loadedTracks = new FakeMedia();
    await el.updateComplete;
    const fired = [];
    el.addEventListener("seek", (e) => fired.push(e.type));
    el.seek(10);
    await el.updateComplete;
    expect(fired).to.deep.equal(["seek"]);
    expect(el.__loadedTracks.seeked).to.deep.equal([10]);
    expect(el.__currentTime).to.equal(10);
  });

  it("seek() falls back to currentTime without a seekable range", async () => {
    const fake = new FakeMedia();
    fake.seekable = { length: 0 };
    fake.seek = undefined;
    el.__loadedTracks = fake;
    await el.updateComplete;
    el.seek(12);
    await el.updateComplete;
    expect(fake.currentTimeCalls).to.deep.equal([12]);
    expect(el.__currentTime).to.equal(12);
  });

  it("seek() gives up quietly when currentTime assignment throws", async () => {
    const fake = new FakeMedia({ throws: true });
    // no seekable range and no seek fn: seek() falls back to currentTime,
    // which this fake throws on
    fake.seekable = { length: 0 };
    fake.seek = undefined;
    el.__loadedTracks = fake;
    await el.updateComplete;
    const fired = [];
    el.addEventListener("seek", (e) => fired.push(e.type));
    el.seek(12);
    await el.updateComplete;
    expect(fired).to.deep.equal([]);
    expect(el.__currentTime).to.equal(0);
    expect(el.__seeking).to.equal(false);
  });

  it("setVolume() clamps into the 0-100 range on the stubbed player", async () => {
    // volume clamping is verified on a youtube fixture: its fake player
    // accepts any value, unlike a real HTMLMediaElement
    const yt = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await yt.updateComplete;
    yt.setVolume(150);
    await yt.updateComplete;
    expect(yt.volume).to.equal(100);
    yt.setVolume(-5);
    await yt.updateComplete;
    expect(yt.volume).to.equal(0);
    yt.setVolume(30);
    await yt.updateComplete;
    expect(yt.volume).to.equal(30);
    expect(yt.youtube.__yt.volumeVal).to.equal(30);
    // BUG a11y-media-player.js:3122 sets media.volume = value / 100 from the
    // RAW value instead of the clamped this.volume, so out-of-range values
    // throw an IndexSizeError on real media elements
    expect(() => el.setVolume(150)).to.throw();
  });

  it("setPlaybackRate() defaults null to 1 and syncs media", async () => {
    el.setPlaybackRate(null);
    await el.updateComplete;
    expect(media.playbackRate).to.equal(1);
    el.setPlaybackRate(2);
    await el.updateComplete;
    expect(media.playbackRate).to.equal(2);
  });

  it("_handleMuteChanged() syncs media.muted and fires mute-changed", async () => {
    const fired = [];
    el.addEventListener("mute-changed", (e) => fired.push(e.type));
    el.muted = true;
    await el.updateComplete;
    expect(fired).to.deep.equal(["mute-changed"]);
    expect(media.muted).to.equal(true);
  });

  it("toggleMute() flips the muted flag", async () => {
    el.toggleMute();
    await el.updateComplete;
    expect(el.muted).to.equal(true);
    el.toggleMute();
    await el.updateComplete;
    expect(el.muted).to.equal(false);
    el.toggleMute(true);
    await el.updateComplete;
    expect(el.muted).to.equal(true);
  });

  it("toggleLoop() syncs media loop", async () => {
    el.toggleLoop(true);
    await el.updateComplete;
    expect(el.loop).to.equal(true);
    expect(media.loop).to.equal(true);
    el.toggleLoop();
    await el.updateComplete;
    expect(el.loop).to.equal(false);
    expect(media.loop).to.equal(false);
  });
});

describe("a11y-media-player control bar interactions", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
    const media = el.querySelector("video");
    media.play = () => Promise.resolve();
    media.pause = () => {};
    el.__preloadedDuration = 100;
    el.__currentTime = 10;
    await el.updateComplete;
  });

  const clickInnerButton = (selector) => {
    const btn = el.shadowRoot.querySelector(selector);
    expect(btn, `missing control: ${selector}`).to.exist;
    // composed lets the native click cross the button's shadow boundary to
    // the @click listener bound on the host
    btn.shadowRoot
      .querySelector("#button")
      .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
  };

  it("clicking the play/pause control toggles playback", async () => {
    clickInnerButton('a11y-media-button[icon="av:play-arrow"]');
    await el.updateComplete;
    expect(el.__playing).to.equal(true);
    clickInnerButton('a11y-media-button[icon="av:pause"]');
    await el.updateComplete;
    expect(el.__playing).to.equal(false);
  });

  it("clicking rewind and forward controls seeks", async () => {
    const fired = [];
    el.addEventListener("backward", (e) => fired.push(e.type));
    el.addEventListener("forward", (e) => fired.push(e.type));
    clickInnerButton('a11y-media-button[icon="av:fast-rewind"]');
    await el.updateComplete;
    expect(fired).to.deep.equal(["backward"]);
    expect(el.__currentTime).to.equal(5);
    clickInnerButton('a11y-media-button[icon="av:fast-forward"]');
    await el.updateComplete;
    expect(fired).to.deep.equal(["backward", "forward"]);
    expect(el.__currentTime).to.equal(10);
  });

  it("clicking restart seeks to 0 and plays", async () => {
    clickInnerButton('a11y-media-button[icon="av:replay"]');
    await el.updateComplete;
    expect(el.__currentTime).to.equal(0);
    expect(el.__playing).to.equal(true);
    el.pause();
  });

  it("clicking the mute control toggles mute", async () => {
    clickInnerButton('a11y-media-button[icon="av:volume-up"]');
    await el.updateComplete;
    expect(el.muted).to.equal(true);
    clickInnerButton('a11y-media-button[icon="av:volume-off"]');
    await el.updateComplete;
    expect(el.muted).to.equal(false);
  });

  it("clicking the overlay play button toggles playback", async () => {
    clickInnerButton("#playbutton");
    await el.updateComplete;
    expect(el.__playing).to.equal(true);
    clickInnerButton("#playbutton");
    await el.updateComplete;
    expect(el.__playing).to.equal(false);
  });

  it("focus and blur on the volume group track slider visibility", async () => {
    const group = el.shadowRoot.querySelector("#volume-and-mute");
    group.dispatchEvent(new FocusEvent("focus"));
    expect(el.__volumeSlider).to.equal(true);
    group.dispatchEvent(new FocusEvent("blur"));
    expect(el.__volumeSlider).to.equal(false);
  });

  it("clicking the transcript scroll control flips disableScroll", async () => {
    const scroll = el.shadowRoot.querySelector("#scroll");
    scroll.shadowRoot
      .querySelector("#button")
      .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.disableScroll).to.equal(true);
    scroll.shadowRoot
      .querySelector("#button")
      .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.disableScroll).to.equal(false);
  });
});

describe("a11y-media-player seek handlers and slider", () => {
  let el;
  let media;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
    media = el.querySelector("video");
    media.play = () => Promise.resolve();
    media.pause = () => {};
    // a known duration keeps seeks from clamping to 0
    el.__preloadedDuration = 100;
    await el.updateComplete;
  });

  it("_handleSliderDragging pauses while playing and resumes on pointerup", async () => {
    el.__sliderEl = {
      disabled: false,
      dragging: true,
      addEventListener() {},
      removeEventListener() {},
    };
    el.play();
    await el.updateComplete;
    el._handleSliderDragging({});
    expect(el.__playing).to.equal(false);
    expect(el.__resumeOnRelease).to.equal(true);
    globalThis.dispatchEvent(new Event("pointerup"));
    await el.updateComplete;
    expect(el.__playing).to.equal(true);
    expect(el.__resumeOnRelease).to.equal(false);
    el.pause();
  });

  it("_handleSliderDragging ignores disabled or idle sliders", () => {
    el.__sliderEl = {
      disabled: true,
      dragging: true,
      addEventListener() {},
      removeEventListener() {},
    };
    el._handleSliderDragging({});
    expect(el.__playing).to.equal(false);
    el.__sliderEl = {
      disabled: false,
      dragging: false,
      addEventListener() {},
      removeEventListener() {},
    };
    el._handleSliderDragging({});
    expect(el.__playing).to.equal(false);
  });

  it("_handleSliderChanged seeks only on a genuine user commit", async () => {
    el.__currentTime = 5;
    el._handleSliderChanged({});
    expect(el.__currentTime).to.equal(5);
    el._handleSliderChanged({ detail: { value: 5 } });
    expect(el.__currentTime).to.equal(5);
    el._handleSliderChanged({ detail: { value: 20 } });
    await el.updateComplete;
    expect(el.__currentTime).to.equal(20);
  });

  it("_handleTimeUpdate ignores media time while a seek settles", async () => {
    el.__loadedTracks = new FakeMedia();
    el.__currentTime = 7;
    el.__seeking = true;
    el._handleTimeUpdate();
    await sleep(80);
    expect(el.__currentTime).to.equal(7);
    el.__seeking = false;
  });

  it("_handleTimeUpdate adopts media time at paint cadence", async () => {
    const fake = new FakeMedia();
    Object.defineProperty(fake, "currentTime", { get: () => 10 });
    el.__loadedTracks = fake;
    await el.updateComplete;
    el._handleTimeUpdate();
    await sleep(80);
    expect(el.__currentTime).to.equal(10);
  });

  it("_handleMediaEnded resets when not looping and restarts when looping", async () => {
    el.__currentTime = 90;
    el._handleMediaEnded();
    await el.updateComplete;
    expect(el.__playing).to.equal(false);
    expect(el.__currentTime).to.equal(0);
    el.loop = true;
    await el.updateComplete;
    el._handleMediaEnded();
    await el.updateComplete;
    expect(el.__playing).to.equal(true);
    expect(el.__currentTime).to.equal(0);
    el.pause();
  });

  it("_handleMediaLoaded seeks to the anchor timecode when targeted", async () => {
    const original = globalThis.AnchorBehaviors;
    globalThis.AnchorBehaviors = {
      getTarget: (target) => target,
      params: { t: "10s" },
    };
    // called directly: dispatching a real loadedmetadata event would also
    // fire the constructor listener that resets __preloadedDuration to the
    // sourceless video's NaN duration, collapsing the seek range to 0
    el._handleMediaLoaded();
    await el.updateComplete;
    expect(el.__currentTime).to.equal(10);
    globalThis.AnchorBehaviors = original;
  });

  it("_handleSearchAdded stores the search element", () => {
    el._handleSearchAdded({ detail: { id: "search1" } });
    expect(el.search.id).to.equal("search1");
  });

  it("_handleSpeedChanged sets playback rate from the event target", async () => {
    const fired = [];
    const handler = (e) => fired.push(e.type);
    globalThis.addEventListener("playback-rate-changed", handler);
    el._handleSpeedChanged({ composedPath: () => [{ value: 1.5 }] });
    await el.updateComplete;
    globalThis.removeEventListener("playback-rate-changed", handler);
    expect(fired).to.deep.equal(["playback-rate-changed"]);
    expect(media.playbackRate).to.equal(1.5);
  });

  it("_handleVolumeChanged sets volume from the event target", async () => {
    el._handleVolumeChanged({ composedPath: () => [{ value: 30 }] });
    await el.updateComplete;
    expect(el.volume).to.equal(30);
    expect(media.volume).to.be.closeTo(0.3, 0.001);
  });
});

describe("a11y-media-player cue seek handlers", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    await sleep(100);
    // a real duration keeps seek() from clamping to 0
    el.youtube.__yt.durationVal = 100;
  });

  it("_handleCueSeek seeks and starts playback for video", async () => {
    const fake = el.youtube.__yt;
    el._handleCueSeek({ startTime: 12 });
    await el.updateComplete;
    await sleep(60);
    expect(fake.time).to.equal(12);
    expect(fake.seekAllowed).to.equal(true);
    expect(el.__playing).to.equal(true);
    el.pause();
  });

  it("_handleCueSeek is a no-op in stand-alone mode", async () => {
    el.standAlone = true;
    await el.updateComplete;
    const fake = el.youtube.__yt;
    el._handleCueSeek({ startTime: 12 });
    await el.updateComplete;
    expect(fake.time).to.equal(0);
  });

  it("_handleCueKeydown activates on Enter and Space only", async () => {
    const prevented = [];
    const mkEvent = (key) => ({
      key,
      preventDefault() {
        prevented.push(key);
      },
    });
    el._handleCueKeydown(mkEvent("Enter"), { startTime: 3 });
    await el.updateComplete;
    expect(prevented).to.deep.equal(["Enter"]);
    expect(el.youtube.__yt.time).to.equal(3);
    el._handleCueKeydown(mkEvent(" "), { startTime: 4 });
    expect(prevented).to.deep.equal(["Enter", " "]);
    expect(el.youtube.__yt.time).to.equal(4);
    el._handleCueKeydown(mkEvent("ArrowLeft"), { startTime: 9 });
    expect(el.youtube.__yt.time).to.equal(4);
    el.pause();
  });
});

describe("a11y-media-player track selection", () => {
  let el;
  let fakeTracks;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
    fakeTracks = [
      { label: "English", language: "en", mode: "disabled", default: false },
      { label: "Spanish", language: "es", mode: "disabled", default: true },
    ];
  });

  it("selectCaptionByKey picks a track and enables cc", async () => {
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    el.selectCaptionByKey(0);
    await el.updateComplete;
    expect(el.captionsTrack === fakeTracks[0]).to.be.true;
    expect(el.cc).to.equal(true);
    expect(fakeTracks[0].mode).to.equal("showing");
    expect(fakeTracks[1].mode).to.equal("hidden");
    // the option comes from Object.keys, so it is the string key
    expect(el.__captionsOption).to.equal("0");
    el.selectCaptionByKey(-1);
    await el.updateComplete;
    expect(el.cc).to.equal(false);
    expect(fakeTracks[0].mode).to.equal("hidden");
    expect(el.__captionsOption).to.equal(-1);
  });

  it("selectCaptionByKeyEvent forwards the detail value", async () => {
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    el.selectCaptionByKeyEvent({ detail: { value: "1" } });
    await el.updateComplete;
    expect(el.captionsTrack === fakeTracks[1]).to.be.true;
  });

  it("toggleCC toggles and fires cc-toggle on the window", async () => {
    // captions state only holds with loaded tracks to show
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    const fired = [];
    const handler = (e) => fired.push(e.type);
    globalThis.addEventListener("cc-toggle", handler);
    el.toggleCC();
    await el.updateComplete;
    globalThis.removeEventListener("cc-toggle", handler);
    expect(fired).to.deep.equal(["cc-toggle"]);
    expect(el.cc).to.equal(true);
    el.toggleCC(false);
    await el.updateComplete;
    expect(el.cc).to.equal(false);
  });

  it("selectTranscriptByKey picks a track and toggles hideTranscript", async () => {
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    el.selectTranscriptByKey(0);
    await el.updateComplete;
    expect(el.transcriptTrack === fakeTracks[0]).to.be.true;
    expect(el.hideTranscript).to.equal(false);
    el.selectTranscriptByKey(-1);
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
  });

  it("selectTranscriptByKeyEvent only acts when player and settings are ready", async () => {
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    el.__playerReady = true;
    el.__settingsOpen = true;
    el.selectTranscriptByKeyEvent({ detail: { value: "1" } });
    await el.updateComplete;
    expect(el.transcriptTrack === fakeTracks[1]).to.be.true;
    // without settings open the event is ignored
    el.__settingsOpen = false;
    el.selectTranscriptByKeyEvent({ detail: { value: "0" } });
    await el.updateComplete;
    expect(el.transcriptTrack === fakeTracks[1]).to.be.true;
  });

  it("selectTranscript uses an explicit track directly", async () => {
    const track = { label: "French", language: "fr" };
    el.selectTranscript(track);
    await el.updateComplete;
    expect(el.transcriptTrack === track).to.be.true;
  });

  it("selectTranscript without a track resolves the default track on array textTracks", async () => {
    // with a plain array of track-like objects the default track is found
    const spanish = { label: "Spanish", language: "es", default: true, track: fakeTracks[1] };
    el.__loadedTracks = { textTracks: [fakeTracks[0], spanish] };
    await el.updateComplete;
    el.selectTranscript();
    await el.updateComplete;
    expect(el.transcriptTrack === fakeTracks[1]).to.be.true;
  });

  it("BUG: _getTrack crashes on a real TextTrackList (no Array.filter)", async () => {
    // BUG a11y-media-player.js:3076 calls this.loadedTracks.textTracks.filter(...)
    // but TextTrackList has no Array methods (filter/forEach), so selecting the
    // default track on a real <video>/<audio> throws a TypeError.
    const media = el.querySelector("video");
    expect(media.textTracks.filter).to.equal(undefined);
    expect(() => el._getTrack()).to.throw(TypeError);
  });

  it("toggleTranscript shows the transcript and auto-selects track 0", async () => {
    el.hideTranscript = true;
    await el.updateComplete;
    el.__loadedTracks = { textTracks: fakeTracks };
    await el.updateComplete;
    const fired = [];
    el.addEventListener("transcript-toggle", (e) => fired.push(e.type));
    el.toggleTranscript(true);
    await el.updateComplete;
    expect(fired).to.deep.equal(["transcript-toggle"]);
    expect(el.hideTranscript).to.equal(false);
    expect(el.transcriptTrack === fakeTracks[0]).to.be.true;
    el.toggleTranscript(false);
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
  });
});

describe("a11y-media-player settings and sticky", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
  });

  it("toggleSettings opens and closes the settings menu", async () => {
    const fired = [];
    el.addEventListener("settings-toggled", (e) => fired.push(e.type));
    el.toggleSettings();
    await el.updateComplete;
    expect(fired).to.deep.equal(["settings-toggled"]);
    expect(el.__settingsOpen).to.equal(true);
    el.toggleSettings(false);
    await el.updateComplete;
    expect(el.__settingsOpen).to.equal(false);
  });

  it("closes the settings menu on Escape", async () => {
    el.toggleSettings(true);
    await el.updateComplete;
    globalThis.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", cancelable: true }),
    );
    await el.updateComplete;
    expect(el.__settingsOpen).to.equal(false);
  });

  it("closes the settings menu when clicking outside", async () => {
    el.toggleSettings(true);
    await el.updateComplete;
    globalThis.document.body.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }),
    );
    await el.updateComplete;
    expect(el.__settingsOpen).to.equal(false);
  });

  it("toggleSticky flips sticky mode once per change", async () => {
    const fired = [];
    el.addEventListener("player-sticky", (e) => fired.push(e.type));
    el.toggleSticky(true);
    await el.updateComplete;
    expect(fired).to.deep.equal(["player-sticky"]);
    expect(el.sticky).to.equal(true);
    // same-mode call is a no-op
    el.toggleSticky(true);
    await el.updateComplete;
    expect(fired).to.deep.equal(["player-sticky"]);
    el.toggleSticky(false);
    await el.updateComplete;
    expect(el.sticky).to.equal(false);
  });

  it("toggleFullscreen requests fullscreen on the player section", async () => {
    const requested = [];
    Object.defineProperty(el, "fullscreenTarget", {
      value: { requestFullscreen: () => requested.push("requested") },
      configurable: true,
    });
    const fired = [];
    const handler = (e) => fired.push(e.type);
    globalThis.addEventListener("fullscreen-toggle", handler);
    el.toggleFullscreen(true);
    await el.updateComplete;
    globalThis.removeEventListener("fullscreen-toggle", handler);
    expect(fired).to.deep.equal(["fullscreen-toggle"]);
    expect(requested).to.deep.equal(["requested"]);
    delete el.fullscreenTarget;
  });

  it("fullscreenButton reflects enablement state", async () => {
    const expected =
      el.fullscreenEnabled && !el.disableFullscreen && !el.audioNoThumb;
    expect(el.fullscreenButton).to.equal(expected);
    el.disableFullscreen = true;
    await el.updateComplete;
    expect(el.fullscreenButton).to.equal(false);
  });
});

describe("a11y-media-player audio description controls", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
    const media = el.querySelector("video");
    media.play = () => Promise.resolve();
    media.pause = () => {};
    el.audioDescriptionSource = "data:audio/mp3,";
    await el.updateComplete;
  });

  it("renders the audio description button only with a source", async () => {
    const button = el.shadowRoot.querySelector(
      'a11y-media-button[icon="av:audio-descriptive-track"]',
    );
    expect(button).to.exist;
    expect(button.hasAttribute("hidden")).to.equal(false);
    el.audioDescriptionSource = "";
    await el.updateComplete;
    expect(el.audioDescriptionSource).to.equal("");
    // the button is never removed: an empty source only hides and disables it
    expect(button.hasAttribute("hidden")).to.equal(true);
    expect(button.disabled).to.equal(true);
  });

  it("_toggleAudioDescription flips the enabled flag and fires the event", async () => {
    const fired = [];
    el.addEventListener("audio-description-toggle", (e) => fired.push(e.type));
    el._toggleAudioDescription({ detail: { value: true } });
    await el.updateComplete;
    expect(fired).to.deep.equal(["audio-description-toggle"]);
    expect(el.audioDescriptionEnabled).to.equal(true);
  });

  it("_handleAudioDescriptionButtonClick starts playback when enabling", async () => {
    el._handleAudioDescriptionButtonClick();
    await el.updateComplete;
    expect(el.audioDescriptionEnabled).to.equal(true);
    expect(el.__playing).to.equal(true);
    // disabling does not force playback state
    el.pause();
    await el.updateComplete;
    el._handleAudioDescriptionButtonClick();
    await el.updateComplete;
    expect(el.audioDescriptionEnabled).to.equal(false);
    expect(el.__playing).to.equal(false);
  });
});

describe("a11y-media-player link handling", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<a11y-media-player
        linkable
        id="shareme"
        youtube-id="abc123"
      ></a11y-media-player>`,
    );
    await el.updateComplete;
    await sleep(100);
    el.__currentTime = 20;
    await el.updateComplete;
  });

  it("goToYoutube opens the video on youtube", () => {
    const opened = [];
    const originalOpen = globalThis.open;
    globalThis.open = (url) => {
      opened.push(url);
      return null;
    };
    el.goToYoutube();
    globalThis.open = originalOpen;
    expect(opened).to.deep.equal(["https://www.youtube.com/watch?v=abc123"]);
  });

  it("_handleCopyLink pauses and shows a toast with the share link", () => {
    const toasts = [];
    const originalToast = globalThis.SimpleToast;
    globalThis.SimpleToast = {
      requestAvailability: () => ({
        showSimpleToast: (d) => toasts.push(d),
      }),
    };
    el.play();
    const fired = [];
    el.addEventListener("pause", (e) => fired.push(e.type));
    el._handleCopyLink();
    globalThis.SimpleToast = originalToast;
    expect(fired).to.deep.equal(["pause"]);
    expect(el.__playing).to.equal(false);
    expect(toasts.length).to.equal(1);
    expect(toasts[0].detail.text.indexOf("Copied to clipboard: ")).to.equal(0);
    expect(toasts[0].detail.text.indexOf("?id=shareme&t=20")).to.be.above(-1);
  });

  it("_handleCloseLink is a safe no-op without a link toast", () => {
    expect(() => el._handleCloseLink()).to.not.throw();
  });
});

describe("a11y-media-player sources and iframe detection", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<a11y-media-player><video></video></a11y-media-player>`);
    await el.updateComplete;
    await sleep(50);
  });

  it("_updateMediaSource rebuilds source children only on real changes", async () => {
    const media = el.querySelector("video");
    el.sources = [{ src: "data:video/mp4," }];
    await el.updateComplete;
    expect(media.querySelectorAll("source").length).to.equal(1);
    expect(media.querySelector("source").getAttribute("src")).to.equal(
      "data:video/mp4,",
    );
    // identical sources short-circuit (no duplicate children)
    el.sources = [{ src: "data:video/mp4," }];
    await el.updateComplete;
    expect(media.querySelectorAll("source").length).to.equal(1);
    // changed sources rebuild the list
    el.sources = [
      { src: "data:video/mp4,", type: "video/mp4" },
      { src: "data:video/webm,", type: "video/webm" },
    ];
    await el.updateComplete;
    expect(media.querySelectorAll("source").length).to.equal(2);
    expect(media.getAttribute("src")).to.equal(null);
  });

  it("source-only changes re-run media source sync", async () => {
    const media = el.querySelector("video");
    el.source = "data:video/mp4,";
    await el.updateComplete;
    // source alone does not add a child (sources drives children)
    expect(media.querySelectorAll("source").length).to.equal(0);
  });

  it("detects a youtube iframe child and adopts its video id", async () => {
    const frame = globalThis.document.createElement("iframe");
    // relative url: resolves against the local test server, never leaves it
    frame.setAttribute("src", "youtube.com/embed/abc123");
    el.appendChild(frame);
    await el.updateComplete;
    expect(el.querySelector("video")).to.exist;
    el.youtubeId = null;
    // re-running getloadedTracks converts the iframe into a youtube id
    el.getloadedTracks();
    await el.updateComplete;
    await sleep(100);
    expect(el.youtubeId).to.equal("abc123");
    expect(el.isYoutube).to.equal(true);
    expect(el.shadowRoot.querySelector("a11y-media-youtube")).to.exist;
    el.pause();
  });

  it("BUG: a non-youtube iframe crashes getloadedTracks", () => {
    // BUG a11y-media-player.js:2978 reads iframeSrc.src on a *string*
    // (iframeSrc.src.match(/youtu.be/)) instead of iframeSrc.match(...),
    // so any non-YouTube iframe child throws a TypeError while scanning.
    const frame = globalThis.document.createElement("iframe");
    frame.setAttribute("src", "other.example/page");
    el.appendChild(frame);
    expect(() => el.getloadedTracks()).to.throw(TypeError);
    frame.remove();
  });

  it("disconnecting the player cleans up timers and listeners", async () => {
    el.__timeUpdateRaf = globalThis.requestAnimationFrame(() => {});
    el.__seekingFallback = setTimeout(() => {}, 1000);
    el.__sliderEl = { gone: true };
    el.remove();
    await sleep(50);
    expect(el.__timeUpdateRaf).to.equal(null);
    expect(el.__seekingFallback).to.equal(null);
    expect(el.__sliderEl).to.equal(null);
  });
});
