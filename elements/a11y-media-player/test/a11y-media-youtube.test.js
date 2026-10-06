import { fixture, expect, html } from "@open-wc/testing";

import { A11yMediaYoutube } from "../lib/a11y-media-youtube.js";
import { installOfflineYouTubeStubs, FakeYTPlayer } from "./offline-stubs.js";

// keep every youtube request off the real network (see helper)
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("a11y-media-youtube warm connections", () => {
  it("adds preconnect hints once and never repeats", () => {
    const appended = [];
    const originalAppend = globalThis.document.head.append;
    globalThis.document.head.append = (node) => appended.push(node);
    A11yMediaYoutube.preconnected = false;
    A11yMediaYoutube.warmConnections();
    A11yMediaYoutube.warmConnections();
    globalThis.document.head.append = originalAppend;
    A11yMediaYoutube.preconnected = true;
    expect(appended.length).to.equal(4);
    expect(appended[0].rel).to.equal("preconnect");
    // hints were captured by the stub so no real connection was ever opened
    expect(globalThis.document.querySelectorAll("link[rel=preconnect]").length).to.equal(0);
  });
});

describe("a11y-media-youtube api getter", () => {
  it("reuses an existing iframe API script tag", () => {
    const existing = globalThis.document.createElement("script");
    existing.setAttribute("id", "a11y-media-youtube-api");
    globalThis.document.body.appendChild(existing);
    const el = globalThis.document.createElement("a11y-media-youtube");
    expect(el.api === existing).to.be.true;
    existing.remove();
  });

  it("creates the iframe API script tag without loading it", () => {
    // stub createElement so the generated <script> never receives the real
    // https://www.youtube.com/iframe_api src; nothing is fetched
    const created = [];
    const originalCreate = globalThis.document.createElement;
    globalThis.document.createElement = (tag) => {
      const node = originalCreate.call(globalThis.document, tag);
      if (tag === "script") {
        const originalSet = node.setAttribute.bind(node);
        node.setAttribute = (name, value) => {
          if (name !== "src") originalSet(name, value);
        };
      }
      created.push(tag);
      return node;
    };
    const el = globalThis.document.createElement("a11y-media-youtube");
    const api = el.api;
    globalThis.document.createElement = originalCreate;
    expect(created).to.include("script");
    expect(api.getAttribute("id")).to.equal("a11y-media-youtube-api");
    expect(api.getAttribute("type")).to.equal("text/javascript");
    expect(api.getAttribute("src")).to.equal(null);
    api.remove();
  });
});

describe("a11y-media-youtube lifecycle", () => {
  it("init() queues the instance and builds a player through the manager", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    expect(el.__yt).to.be.instanceOf(FakeYTPlayer);
    expect(el.__video).to.be.instanceOf(FakeYTPlayer);
    expect(globalThis.A11yMediaYoutubeManager.queue.length).to.equal(0);
  });

  it("init() wires onYouTubeIframeAPIReady when the api is not ready", async () => {
    const el = await fixture(html`<a11y-media-youtube></a11y-media-youtube>`);
    await el.updateComplete;
    // an inert tag with the api id keeps the api getter from creating (and
    // loading) the real https://www.youtube.com/iframe_api script
    const inert = globalThis.document.createElement("script");
    inert.setAttribute("id", "a11y-media-youtube-api");
    globalThis.document.body.appendChild(inert);
    const originalApi = globalThis.A11yMediaYoutubeManager.api;
    globalThis.A11yMediaYoutubeManager.api = false;
    let callback = null;
    Object.defineProperty(globalThis, "onYouTubeIframeAPIReady", {
      set(fn) {
        callback = fn;
      },
      get() {
        return callback;
      },
      configurable: true,
    });
    el.init();
    expect(callback).to.be.a("function");
    expect(globalThis.A11yMediaYoutubeManager.api === inert).to.be.true;
    callback();
    expect(globalThis.A11yMediaYoutubeManager.queue.length).to.equal(0);
    globalThis.A11yMediaYoutubeManager.api = originalApi;
    delete globalThis.onYouTubeIframeAPIReady;
    inert.remove();
  });

  it("updated() re-preloads on iframe-only changes keeping the same player", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    const before = el.__yt;
    el.height = "50%";
    el.width = "50%";
    el.id = "ytplayer";
    await el.updateComplete;
    await sleep(30);
    expect(el.__yt === before).to.be.true;
  });

  it("updated() cues a new video once a player exists", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    el.videoId = "xyz789";
    await el.updateComplete;
    expect(el.__video.cued).to.deep.equal({ videoId: "xyz789" });
  });

  it("_preloadVideo skips loading without a videoId", async () => {
    const el = await fixture(html`<a11y-media-youtube></a11y-media-youtube>`);
    await el.updateComplete;
    const result = el._preloadVideo(true);
    expect(result).to.equal(null);
  });

  it("_preloadVideo keeps the existing player reference", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    const result = el._preloadVideo(true);
    expect(result === el.__yt).to.be.true;
  });

  it("_preloadVideo sets an accessible title on the iframe", async () => {
    const el = await fixture(html`<a11y-media-youtube></a11y-media-youtube>`);
    await el.updateComplete;
    el.mediaTitle = "My Video";
    el.videoId = "abc123";
    await el.updateComplete;
    await sleep(60);
    const frame = el.querySelector("iframe");
    expect(frame).to.exist;
    expect(frame.getAttribute("title")).to.equal("YouTube video player: My Video");
    expect(frame.getAttribute("aria-label")).to.equal(
      "YouTube video player: My Video",
    );
  });

  it("_preloadVideo applies the embed referrer policy to the iframe", async () => {
    const el = await fixture(html`<a11y-media-youtube></a11y-media-youtube>`);
    await el.updateComplete;
    el.mediaTitle = "My Video";
    el.videoId = "abc123";
    await el.updateComplete;
    await sleep(60);
    const frame = el.querySelector("iframe");
    expect(frame).to.exist;
    // the referrer YouTube's embed player now requires is always sent;
    // this test env is not cross-origin isolated so no credentialless
    expect(frame.getAttribute("referrerpolicy")).to.equal(
      "strict-origin-when-cross-origin",
    );
    expect(frame.hasAttribute("credentialless")).to.equal(false);
  });

  it("_preloadVideo marks the iframe credentialless when cross-origin isolated", async () => {
    // simulate the COEP/COOP cross-origin isolated page that `hax serve`
    // dev mode produces
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "crossOriginIsolated",
    );
    Object.defineProperty(globalThis, "crossOriginIsolated", {
      value: true,
      configurable: true,
      writable: true,
    });
    try {
      const el = await fixture(
        html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
      );
      await el.updateComplete;
      await sleep(60);
      const frame = el.querySelector("iframe");
      expect(frame).to.exist;
      expect(frame.getAttribute("referrerpolicy")).to.equal(
        "strict-origin-when-cross-origin",
      );
      expect(frame.hasAttribute("credentialless")).to.equal(true);
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, "crossOriginIsolated", descriptor);
      } else {
        delete globalThis.crossOriginIsolated;
      }
    }
  });

  it("disconnecting removes timers and destroys the player", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    el.__ytTimeupdateInterval = setInterval(() => {}, 250);
    el.__playRaf = globalThis.requestAnimationFrame(() => {});
    el.__playTimeout = setTimeout(() => {}, 5000);
    el.remove();
    await sleep(30);
    expect(el.__ytTimeupdateInterval).to.equal(null);
    expect(el.__playRaf).to.equal(null);
    expect(el.__playTimeout).to.equal(null);
    expect(el.__yt.destroyed).to.equal(true);
    expect(el.innerHTML).to.equal("");
  });

  it("_removeIframe warns when the player cannot be destroyed", async () => {
    const el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
    const warnings = [];
    const originalWarn = globalThis.console.warn;
    globalThis.console.warn = (e) => warnings.push(String(e));
    el.__yt.destroy = () => {
      throw new Error("destroy boom");
    };
    el._removeIframe();
    globalThis.console.warn = originalWarn;
    expect(warnings.length).to.equal(1);
    expect(warnings[0].indexOf("destroy boom")).to.be.above(-1);
    // restore a working destroy so fixture cleanup stays quiet
    el.__yt.destroyed = true;
    el.__yt.destroy = () => {
      el.__yt.destroyed = true;
    };
  });
});

describe("a11y-media-youtube playback controls", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<a11y-media-youtube video-id="abc123"></a11y-media-youtube>`,
    );
    await el.updateComplete;
    await sleep(60);
  });

  it("play() defers to the next frame and starts the timeupdate loop", async () => {
    el.play();
    await sleep(60);
    expect(el.__yt.playVideoCalls).to.be.above(0);
    expect(el.__playQueued).to.equal(false);
    expect(el.__ytTimeupdateInterval).to.exist;
    el.pause();
    expect(el.__ytTimeupdateInterval).to.equal(null);
  });

  it("play() falls back to a timeout while the document is hidden", async () => {
    Object.defineProperty(globalThis.document, "hidden", {
      get: () => true,
      configurable: true,
    });
    el.play();
    await sleep(60);
    delete globalThis.document.hidden;
    expect(el.__yt.playVideoCalls).to.be.above(0);
    el.pause();
  });

  it("pause() and seek() delegate to the player", () => {
    el.play();
    el.pause();
    expect(el.__yt.pauseVideoCalls).to.equal(1);
    el.seek(30);
    expect(el.__yt.time).to.equal(30);
    expect(el.__yt.seekAllowed).to.equal(true);
  });

  it("setLoop, setMute, setPlaybackRate and setVolume delegate", async () => {
    el.setLoop(true);
    expect(el.__yt.loopVal).to.equal(true);
    el.setMute(true);
    expect(el.__yt.mutedVal).to.equal(true);
    el.setMute(false);
    expect(el.__yt.mutedVal).to.equal(false);
    el.setPlaybackRate(2);
    expect(el.__yt.playbackRateVal).to.equal(2);
    el.setVolume(0.5);
    expect(el.__yt.volumeVal).to.equal(50);
    // property changes route through updated() to the same controls
    el.muted = true;
    await el.updateComplete;
    expect(el.__yt.mutedVal).to.equal(true);
    el.loop = true;
    await el.updateComplete;
    expect(el.__yt.loopVal).to.equal(true);
    el.playbackRate = 1.5;
    await el.updateComplete;
    expect(el.__yt.playbackRateVal).to.equal(1.5);
    el.volume = 0.2;
    await el.updateComplete;
    expect(el.__yt.volumeVal).to.equal(20);
  });

  it("getters expose player state safely", async () => {
    expect(el.buffered).to.equal(-1);
    el.__yt.bufferedRange = { length: 1, end: (i) => 42 };
    expect(el.buffered).to.equal(42);
    el.__yt.time = 12;
    expect(el.currentTime).to.equal(12);
    expect(el.duration).to.equal(0);
    el.__yt.durationVal = 90;
    expect(el.duration).to.equal(90);
    expect(el.paused).to.equal(true);
    el.__yt.state = 1;
    expect(el.paused).to.equal(false);
    // seekable reflects duration
    expect(el.seekable.length).to.equal(1);
    expect(el.seekable.start(0)).to.equal(0);
    expect(el.seekable.end(0)).to.equal(90);
    el.__yt.durationVal = 0;
    expect(el.seekable.length).to.equal(0);
  });

  it("mediastatechange events bridge player state to the element", async () => {
    const seen = [];
    const handler = (e) => seen.push(e.type);
    el.addEventListener("mediastatechange", handler);
    el.addEventListener("ended", handler);
    const callbacks = el.__yt.listeners["onStateChange"];
    expect(callbacks).to.exist;
    // playing state starts the timeupdate loop
    callbacks.forEach((cb) => cb({ data: 1 }));
    expect(el.__ytTimeupdateInterval).to.exist;
    // buffering state leaves the loop alone
    callbacks.forEach((cb) => cb({ data: 3 }));
    expect(el.__ytTimeupdateInterval).to.exist;
    // pause state stops the loop
    callbacks.forEach((cb) => cb({ data: 2 }));
    expect(el.__ytTimeupdateInterval).to.equal(null);
    // ended state bridges to a standard ended event
    callbacks.forEach((cb) => cb({ data: 0 }));
    expect(seen).to.include("mediastatechange");
    expect(seen).to.include("ended");
    el.removeEventListener("mediastatechange", handler);
    el.removeEventListener("ended", handler);
  });

  it("dispatches loadedmetadata and timeupdate events", () => {
    const seen = [];
    const handler = (e) => seen.push(e.type);
    el.addEventListener("loadedmetadata", handler);
    el.addEventListener("timeupdate", handler);
    el._handleMediaLoaded();
    el._handleTimeupdate();
    expect(seen).to.deep.equal(["loadedmetadata", "timeupdate"]);
    el.removeEventListener("loadedmetadata", handler);
    el.removeEventListener("timeupdate", handler);
  });

  it("_autoMetadata preloads duration by playing muted then restoring", async () => {
    el.__yt.durationVal = 100;
    el.t = 5;
    el._autoMetadata();
    await sleep(80);
    expect(el.__yt.mutedVal).to.equal(false);
    expect(el.__yt.pauseVideoCalls).to.be.above(0);
    expect(el.__yt.time).to.equal(5);
    el.pause();
  });

  it("_autoMetadata respects autoplay by resuming playback", async () => {
    el.__yt.durationVal = 100;
    el.t = 2;
    el.autoplay = true;
    el._autoMetadata();
    await sleep(100);
    expect(el.__yt.playVideoCalls).to.be.above(0);
    el.pause();
  });

  it("_loadVideo cues the current videoId", () => {
    el._loadVideo();
    expect(el.__video.cued).to.deep.equal({ videoId: "abc123" });
    el.videoId = null;
    el._loadVideo();
    // a null videoId leaves the cued value untouched
    expect(el.__video.cued).to.deep.equal({ videoId: "abc123" });
  });

  it("_getSeconds parses clock and h/m/s strings", () => {
    expect(el._getSeconds("10")).to.equal(10);
    expect(el._getSeconds("30s")).to.equal(30);
    expect(el._getSeconds("1h2m3s")).to.equal(3723);
    expect(el._getSeconds("01:02:03.5")).to.equal(3723.5);
    // a no-argument call returns 0 instead of throwing on the number default
    expect(el._getSeconds()).to.equal(0);
  });

  it("renders a slot for the injected iframe", () => {
    expect(el.shadowRoot.querySelector("slot")).to.exist;
  });
});
