import { fixture, expect, html, waitUntil } from "@open-wc/testing";

import "../video-player.js";
import { installOfflineYouTubeStubs } from "../../a11y-media-player/test/offline-stubs.js";

// keep every youtube / thumbnail request off the real network
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// tracks as data: URLs so cues load without a network request
const vtt = (text) =>
  "data:text/vtt;charset=utf-8," +
  encodeURIComponent(
    `WEBVTT\n\n00:00:01.000 --> 00:00:04.000\n${text} one\n\n00:00:05.000 --> 00:00:09.000\n${text} two\n`,
  );
const GIF = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
const GIF2 =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

// every setting video-player offers in the HAX editor (configure, advanced,
// developer); a test below proves each one is covered here
const COVERED = [
  "source",
  "mediaTitle",
  "thumbnailSrc",
  "tracks",
  "startTime",
  "endTime",
  "learningMode",
  "hideYoutubeLink",
  "linkable",
  "hideTimestamps",
  "hideTranscript",
  "audioDescriptionSource",
  "crossorigin",
  "allowBackgroundPlay",
  "darkTranscript",
  "disableInteractive",
  "lang",
  "accentColor",
];

/**
 * A rendered video-player and its inner a11y-media-player
 */
async function rendered(template) {
  const el = await fixture(template);
  el.elementVisible = true;
  await el.updateComplete;
  await sleep(50);
  const inner = () => el.shadowRoot.querySelector("a11y-media-player");
  await waitUntil(() => inner(), "player never rendered");
  await inner().updateComplete;
  return { el, inner };
}

const camelToDash = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Apply a HAX settings form value the way hax-tray does
 * (__valueChangedEvent): a direct property set only for own properties and
 * arrays / objects, otherwise the dashed attribute, with true written as
 * attr="attr" and false / "" removing it. Then let both elements render.
 */
async function edit(el, inner, prop, value) {
  const own =
    Object.prototype.hasOwnProperty.call(el, prop) ||
    (el.properties &&
      Object.prototype.hasOwnProperty.call(el.properties, prop)) ||
    (value != null &&
      (value.constructor === Array || value.constructor === Object));
  if (own) {
    el[prop] = value;
  } else if (value === true) {
    el.setAttribute(camelToDash(prop), camelToDash(prop));
  } else if (value === false || value === "" || value === null) {
    el.removeAttribute(camelToDash(prop));
  } else {
    el.setAttribute(camelToDash(prop), value);
  }
  await el.updateComplete;
  const player = inner();
  if (player) {
    await player.updateComplete;
    await player.updateComplete;
  }
}

const cueTexts = (player) =>
  Array.from(
    player.shadowRoot.querySelectorAll("a11y-media-transcript-cue"),
  ).map((c) => c.textContent.trim());

const SOURCES = {
  html5: "https://example.com/v.mp4",
  youtube: "https://www.youtube.com/watch?v=LrS7dqokTLE",
};

Object.keys(SOURCES).forEach((kind) => {
  const SRC = SOURCES[kind];
  const youtube = kind === "youtube";
  describe(`video-player HAX settings take effect right away (${kind} source)`, () => {
    it("covers every HAX-editable property", () => {
      const settings =
        globalThis.customElements.get("video-player").haxProperties.settings;
      const props = []
        .concat(settings.configure, settings.advanced, settings.developer)
        .map((s) => s.property)
        .filter((p) => p);
      props.forEach((p) => expect(COVERED, p).to.include(p));
    });

    it("mediaTitle updates the header title", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}" media-title="First"></video-player>`,
      );
      await edit(el, inner, "mediaTitle", "Second");
      expect(
        inner().shadowRoot.querySelector(".ddd-block-title").textContent.trim(),
      ).to.equal("Second");
      expect(
        el.shadowRoot.querySelector(".ddd-block").getAttribute("aria-label"),
      ).to.contain("Second");
    });

    // the seek slider's fill / pin color, resolved inside the slider
    const seekColor = (player) => {
      const slider = player.shadowRoot.querySelector("#slider");
      const probe = globalThis.document.createElement("span");
      probe.style.color = "var(--simple-range-input-color)";
      slider.shadowRoot.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    };
    const chipColor = (player) =>
      getComputedStyle(player.shadowRoot.querySelector(".ddd-block-chip"))
        .backgroundColor;
    // deep purple from DDDAccentStyles (wonderPurple, athertonViolet dark)
    const purple = () => {
      const probe = globalThis.document.createElement("span");
      probe.style.color =
        "light-dark(var(--ddd-theme-default-wonderPurple), var(--ddd-theme-default-athertonViolet))";
      globalThis.document.body.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    };

    it("accentColor (deep purple) recolors the chip and the seek bar", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      const before = chipColor(inner());
      await edit(el, inner, "accentColor", "deep-purple");
      expect(inner().getAttribute("accent-color")).to.equal("deep-purple");
      expect(chipColor(inner())).to.not.equal(before);
      expect(chipColor(inner())).to.equal(purple());
      expect(seekColor(inner())).to.equal(purple());
    });

    it("accentColor wins over a theme's --video-player-accent-color", async () => {
      const wrap = await fixture(
        html`<div style="--video-player-accent-color: rgb(233, 131, 0)">
          <video-player source="${SRC}"></video-player>
        </div>`,
      );
      const el = wrap.querySelector("video-player");
      el.elementVisible = true;
      await el.updateComplete;
      await sleep(50);
      const inner = () => el.shadowRoot.querySelector("a11y-media-player");
      await waitUntil(() => inner(), "player never rendered");
      await inner().updateComplete;
      // the theme color is the palette level: chip and seek take it
      expect(chipColor(inner())).to.equal("rgb(233, 131, 0)");
      expect(seekColor(inner())).to.equal("rgb(233, 131, 0)");
      await edit(el, inner, "accentColor", "deep-purple");
      expect(chipColor(inner())).to.equal(purple());
      expect(seekColor(inner())).to.equal(purple());
      // the header buttons stay neutral
      const action = getComputedStyle(
        inner().shadowRoot.querySelector("#settings-button"),
      ).color;
      expect(action).to.not.equal(purple());
      expect(action).to.not.equal("rgb(233, 131, 0)");
    });

    it("thumbnailSrc updates the poster", async () => {
      const { el, inner } = await rendered(
        html`<video-player
          source="${SRC}"
          thumbnail-src="${GIF}"
        ></video-player>`,
      );
      const shown = () =>
        youtube
          ? inner().shadowRoot.querySelector("#player").style.backgroundImage
          : inner().querySelector("video").getAttribute("poster");
      expect(shown()).to.contain(GIF);
      await edit(el, inner, "thumbnailSrc", GIF2);
      expect(shown()).to.contain(GIF2);
      expect(
        inner()
          .shadowRoot.querySelector("#print-thumbnail")
          .getAttribute("src"),
      ).to.equal(GIF2);
    });

    it("source switches the media", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      if (!youtube) {
        await edit(el, inner, "source", "https://example.com/b.mp4");
        expect(
          inner().querySelector("video source").getAttribute("src"),
        ).to.contain("b.mp4");
      }
      await edit(el, inner, "source", "https://www.youtube.com/watch?v=abc123");
      await waitUntil(
        () => inner() && inner().youtubeId === "abc123",
        "youtube source never reached the player",
      );
      await edit(el, inner, "source", "https://www.youtube.com/watch?v=xyz789");
      expect(inner().youtubeId).to.equal("xyz789");
      if (youtube) {
        // and back to a file
        await edit(el, inner, "source", "https://example.com/c.mp4");
        await waitUntil(
          () => inner() && !inner().youtubeId,
          "the file source never replaced YouTube",
          { timeout: 3000 },
        );
      }
    });

    it("tracks load the new transcript and captions", async () => {
      const { el, inner } = await rendered(
        html`<video-player
          source="${SRC}"
          .tracks=${[{ src: vtt("Alpha"), label: "English", srclang: "en" }]}
        ></video-player>`,
      );
      await waitUntil(
        () => cueTexts(inner()).includes("Alpha one"),
        "first track never loaded",
      );
      await edit(el, inner, "tracks", [
        { src: vtt("Beta"), label: "Deutsch", srclang: "de" },
      ]);
      await waitUntil(
        () => cueTexts(inner()).join("|") === "Beta one|Beta two",
        "the new track never replaced the old one",
        { timeout: 4000 },
      );
      expect(inner().captionsPicker).to.deep.include({ 0: "Deutsch" });
    });

    it("tracks added to a player that had none show the transcript", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      expect(inner().standAlone).to.equal(true);
      await edit(el, inner, "tracks", [
        { src: vtt("Gamma"), label: "English", srclang: "en" },
      ]);
      await waitUntil(
        () => cueTexts(inner()).includes("Gamma one"),
        "added track never loaded",
        { timeout: 4000 },
      );
      expect(inner().standAlone).to.equal(false);
    });

    it("hideTranscript shows the transcript with its cues when turned off", async () => {
      const { el, inner } = await rendered(
        html`<video-player
          source="${SRC}"
          hide-transcript
          .tracks=${[{ src: vtt("Delta"), label: "English", srclang: "en" }]}
        ></video-player>`,
      );
      await waitUntil(() => inner().cues.length === 2, "cues never loaded");
      await inner().updateComplete;
      const section = () =>
        inner().shadowRoot.querySelector("#transcript-section");
      expect(section().hidden).to.equal(true);
      await edit(el, inner, "hideTranscript", false);
      expect(section().hidden).to.equal(false);
      expect(cueTexts(inner())).to.deep.equal(["Delta one", "Delta two"]);
      await edit(el, inner, "hideTranscript", true);
      expect(section().hidden).to.equal(true);
    });

    it("hideTimestamps, darkTranscript and disableInteractive update the transcript", async () => {
      const { el, inner } = await rendered(
        html`<video-player
          source="${SRC}"
          .tracks=${[{ src: vtt("Echo"), label: "English", srclang: "en" }]}
        ></video-player>`,
      );
      await waitUntil(() => cueTexts(inner()).length === 2, "no cues");
      const cue = () =>
        inner().shadowRoot.querySelector("a11y-media-transcript-cue");
      await edit(el, inner, "hideTimestamps", true);
      expect(cue().hasAttribute("hide-timestamps")).to.equal(true);
      await edit(el, inner, "hideTimestamps", false);
      expect(cue().hasAttribute("hide-timestamps")).to.equal(false);
      await edit(el, inner, "darkTranscript", true);
      expect(inner().hasAttribute("dark-transcript")).to.equal(true);
      await edit(el, inner, "disableInteractive", true);
      expect(cue().hasAttribute("disabled")).to.equal(true);
      expect(cue().getAttribute("tabindex")).to.equal("-1");
    });

    it("learningMode locks seeking and the transcript when switched", async () => {
      const { el, inner } = await rendered(
        html`<video-player
          source="${SRC}"
          .tracks=${[{ src: vtt("Fox"), label: "English", srclang: "en" }]}
        ></video-player>`,
      );
      await edit(el, inner, "learningMode", true);
      expect(inner().disableSeek).to.equal(true);
      expect(inner().hideTranscript).to.equal(true);
      const bar = Array.from(
        inner().shadowRoot.querySelectorAll("#controls-left a11y-media-button"),
      )
        .filter((b) => !b.hidden)
        .map((b) => b.getAttribute("label"));
      expect(bar).to.not.include("Backward");
      expect(bar).to.not.include("Forward");
      expect(inner().shadowRoot.querySelector("#slider").disabled).to.equal(
        true,
      );
      await edit(el, inner, "learningMode", false);
      expect(inner().disableSeek).to.equal(false);
    });

    it("learningMode authored from the start locks seeking too", async () => {
      const start = await rendered(
        html`<video-player source="${SRC}" learning-mode></video-player>`,
      );
      expect(start.inner().disableSeek).to.equal(true);
      expect(start.inner().hideTranscript).to.equal(true);
    });

    it("linkable and hideYoutubeLink show and hide their header actions", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      const action = (id) => inner().shadowRoot.querySelector(id);
      expect(action("#header-copy-link").hidden).to.equal(true);
      await edit(el, inner, "linkable", true);
      expect(action("#header-copy-link").hidden).to.equal(false);
      if (youtube) {
        expect(action("#header-youtube").hidden).to.equal(false);
        await edit(el, inner, "hideYoutubeLink", true);
        expect(action("#header-youtube").hidden).to.equal(true);
      } else {
        // Open on YouTube only exists for YouTube media
        expect(action("#header-youtube")).to.equal(null);
      }
    });

    it("the owner's combination: learning mode, no YouTube button, share link, deep purple", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}" media-title="HAX"></video-player>`,
      );
      await edit(el, inner, "learningMode", true);
      await edit(el, inner, "hideYoutubeLink", true);
      await edit(el, inner, "linkable", true);
      await edit(el, inner, "hideTimestamps", false);
      await edit(el, inner, "hideTranscript", false);
      await edit(el, inner, "accentColor", "deep-purple");
      const player = inner();
      const labels = Array.from(
        player.shadowRoot.querySelectorAll(
          ".ddd-block-actions .ddd-block-action",
        ),
      )
        .filter((b) => !b.hidden)
        .map((b) => b.getAttribute("aria-label"));
      expect(labels).to.include("Copy Media Link");
      expect(labels).to.not.include("Open on YouTube");
      expect(chipColor(player)).to.equal(purple());
      expect(seekColor(player)).to.equal(purple());
      const bar = Array.from(
        player.shadowRoot.querySelectorAll("#controls-left a11y-media-button"),
      )
        .filter((b) => !b.hidden)
        .map((b) => b.getAttribute("label"));
      expect(bar).to.not.include("Backward");
      expect(bar).to.not.include("Forward");
    });

    it("audioDescriptionSource shows the audio description action", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      const ad = () =>
        inner().shadowRoot.querySelector("#header-audio-description");
      expect(ad().hidden).to.equal(true);
      await edit(
        el,
        inner,
        "audioDescriptionSource",
        "https://example.com/a.mp3",
      );
      expect(ad().hidden).to.equal(false);
    });

    it("lang and crossorigin reach the player and its media", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      await edit(el, inner, "lang", "es");
      expect(inner().getAttribute("lang")).to.equal("es");
      await edit(el, inner, "crossorigin", "use-credentials");
      expect(
        inner().querySelector("video").getAttribute("crossorigin"),
      ).to.equal("use-credentials");
    });

    it("allowBackgroundPlay turns the tab-switch pause off and on", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}"></video-player>`,
      );
      expect(el.__setVisChange).to.equal(true);
      await edit(el, inner, "allowBackgroundPlay", true);
      expect(el.__setVisChange).to.equal(false);
      await edit(el, inner, "allowBackgroundPlay", false);
      expect(el.__setVisChange).to.equal(true);
    });

    it("startTime and endTime apply to the next play", async () => {
      const { el, inner } = await rendered(
        html`<video-player source="${SRC}" start-time="5"></video-player>`,
      );
      const seeks = [];
      el.seek = (t) => seeks.push(Number(t));
      el.endTimeTest = () => seeks.push("end");
      el.playEvent({ detail: { __playing: true } });
      expect(seeks).to.deep.equal([5, "end"]);
      el.playEvent({ detail: { __playing: false } });
      await edit(el, inner, "startTime", 12);
      await edit(el, inner, "endTime", 20);
      el.playEvent({ detail: { __playing: true } });
      expect(seeks).to.deep.equal([5, "end", 12, "end"]);
    });
  });
});

describe("audio-player style track setting takes effect right away", () => {
  it("track (single caption file) loads the new transcript", async () => {
    const { el, inner } = await rendered(
      html`<video-player
        source="https://example.com/v.mp4"
        track="${vtt("Hotel")}"
      ></video-player>`,
    );
    await waitUntil(
      () => cueTexts(inner()).includes("Hotel one"),
      "first track never loaded",
    );
    await edit(el, inner, "track", vtt("India"));
    await waitUntil(
      () => cueTexts(inner()).join("|") === "India one|India two",
      "the new track never replaced the old one",
      { timeout: 4000 },
    );
  });
});

describe("video-player learner data across re-renders", () => {
  // a fake clock on the inner media so playback can be stepped
  async function clocked(duration) {
    const { el, inner } = await rendered(
      html`<video-player
        source="https://example.com/v.mp4"
        media-title="Clip"
      ></video-player>`,
    );
    const player = inner();
    const media = player.querySelector("video");
    let now = 0;
    Object.defineProperty(media, "currentTime", {
      configurable: true,
      get: () => now,
      set: (v) => {
        now = v;
      },
    });
    Object.defineProperty(media, "duration", {
      configurable: true,
      get: () => duration,
    });
    media.play = () => Promise.resolve();
    media.pause = () => {};
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    const watch = (from, to) => {
      for (let t = from; t <= to + 0.0001; t += 0.25) {
        now = Math.round(t * 100) / 100;
        player._trackWatched();
      }
    };
    player.__playing = true;
    return { el, inner, player, seen, watch };
  }

  it("pausing, playing and HAX edits do not forget what was watched", async () => {
    const { el, inner, player, seen, watch } = await clocked(40);
    watch(0, 20);
    const watched = player.__watched.size;
    // play / pause reflect on video-player and re-render it, which passes
    // a fresh sources array to the player
    el.playing = false;
    await el.updateComplete;
    await player.updateComplete;
    el.playing = true;
    await edit(el, inner, "mediaTitle", "Clip, edited");
    expect(player.__watched.size).to.equal(watched);
    watch(20, 40);
    player._handleMediaEnded();
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "progressed",
      "completed",
    ]);
  });

  it("a new source is a new activity", async () => {
    const { el, inner, player, watch } = await clocked(40);
    watch(0, 10);
    expect(player.__watched.size).to.be.above(0);
    await edit(el, inner, "source", "https://example.com/other.mp4");
    expect(inner().__watched.size).to.equal(0);
  });
});

describe("video-player text alignment", () => {
  it("the HAX settings form does not offer text alignment", () => {
    const props = globalThis.customElements.get("video-player").haxProperties;
    expect(props.designSystem.textAlign).to.equal(false);
    expect(props.designSystem.card).to.equal(true);
    const audio = globalThis.customElements.get("audio-player");
    if (audio) {
      expect(audio.haxProperties.designSystem.textAlign).to.equal(false);
    }
  });

  it("content saved with data-text-align still renders the player as before", async () => {
    const { el, inner } = await rendered(
      html`<video-player
        data-text-align="center"
        source="https://example.com/v.mp4"
        media-title="Centered"
      ></video-player>`,
    );
    // the attribute is kept (it saves back unchanged) and the player chrome
    // keeps its start-aligned layout
    expect(el.getAttribute("data-text-align")).to.equal("center");
    expect(getComputedStyle(inner()).textAlign).to.equal("start");
    expect(
      inner().shadowRoot.querySelector(".ddd-block-title").textContent.trim(),
    ).to.equal("Centered");
  });
});
