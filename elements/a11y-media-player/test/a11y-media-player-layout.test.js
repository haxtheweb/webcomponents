import { fixture, expect, html, waitUntil } from "@open-wc/testing";

import { A11Y_MEDIA_LAYOUT_PREFERENCE } from "../a11y-media-player.js";
import { shortCueTime } from "../lib/a11y-media-transcript-cue.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network (see helper)
installOfflineYouTubeStubs();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clearPreference = () => {
  try {
    globalThis.localStorage.removeItem(A11Y_MEDIA_LAYOUT_PREFERENCE);
  } catch {
    // storage blocked: nothing to clear
  }
};

/**
 * A player with two real cues (no .vtt fetch) at a desktop width
 */
async function playerWithCues(template) {
  const el = await fixture(
    template ||
      html`<a11y-media-player media-title="Lecture"
        ><video></video
      ></a11y-media-player>`,
  );
  await el.updateComplete;
  const media = el.querySelector("video");
  media.play = () => Promise.resolve();
  media.pause = () => {};
  el.__preloadedDuration = 100;
  const track = media.addTextTrack("subtitles", "English", "en");
  track.addCue(new VTTCue(4, 9, "Hello world"));
  track.addCue(new VTTCue(80, 85, "Second cue"));
  await waitUntil(
    () => el.cues.length === 2,
    "player never collected the track cues",
    { interval: 20, timeout: 5000 },
  );
  // a fixture without <track> elements has no default captions track yet
  el.captionsTrack = media.textTracks[0];
  el.selectTranscriptByKey(0);
  el.responsiveSize = "md";
  await el.updateComplete;
  return el;
}

const headerActions = (el) =>
  Array.from(
    el.shadowRoot.querySelectorAll(".ddd-block-actions .ddd-block-action"),
  );
const visibleLabels = (buttons) =>
  buttons.filter((b) => !b.hidden).map((b) => b.getAttribute("aria-label"));

describe("a11y-media-player block header", () => {
  let el;
  beforeEach(async () => {
    clearPreference();
    el = await playerWithCues();
  });
  afterEach(() => clearPreference());

  it("shows the DDD block header with the type label, title and chip", () => {
    const header = el.shadowRoot.querySelector(".ddd-block-header");
    expect(header).to.exist;
    expect(header.getAttribute("part")).to.contain("media-header");
    expect(
      el.shadowRoot.querySelector(".ddd-block-label").textContent.trim(),
    ).to.equal("Video · interactive");
    expect(
      el.shadowRoot.querySelector(".ddd-block-title").textContent.trim(),
    ).to.equal("Lecture");
    expect(
      el.shadowRoot
        .querySelector(".ddd-block-chip simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("av:play-arrow");
  });

  it("orders the header actions left to right with the existing labels", () => {
    const buttons = headerActions(el);
    expect(buttons.map((b) => b.getAttribute("aria-label"))).to.deep.equal([
      "Closed Captions",
      "Transcript",
      "Download Transcript",
      "Print Transcript",
      "Audio Description",
      "Copy Media Link",
      "Settings",
      "Fullscreen",
    ]);
    expect(buttons.map((b) => b.dataset.action)).to.deep.equal([
      "captions",
      "transcript",
      "download",
      "print",
      "audio-description",
      "copy-link",
      "settings",
      "fullscreen",
    ]);
    // every action is a real button with a visible tooltip title
    buttons.forEach((b) => {
      expect(b.tagName).to.equal("BUTTON");
      expect(b.getAttribute("title")).to.equal(b.getAttribute("aria-label"));
    });
    // at a desktop width all but (maybe) Fullscreen are shown; audio
    // description and the media link only when they apply
    expect(visibleLabels(buttons).slice(0, 5)).to.deep.equal([
      "Closed Captions",
      "Transcript",
      "Download Transcript",
      "Print Transcript",
      "Settings",
    ]);
  });

  it("audio description, copy media link and Open on YouTube are header actions before Settings", async () => {
    el.audioDescriptionSource = "data:audio/mp3,";
    el.linkable = true;
    el.youtubeId = "abc123";
    await el.updateComplete;
    const labels = visibleLabels(headerActions(el));
    expect(labels).to.include.ordered.members([
      "Closed Captions",
      "Transcript",
      "Download Transcript",
      "Print Transcript",
      "Audio Description",
      "Copy Media Link",
      "Open on YouTube",
      "Settings",
    ]);
    // nothing is left in the bottom right corner of the control bar
    expect(el.shadowRoot.querySelector("#controls-right")).to.equal(null);
    expect(
      el.shadowRoot.querySelector('#controls [icon="mdi-social:youtube"]'),
    ).to.equal(null);
    expect(el.shadowRoot.querySelector('#controls [icon="link"]')).to.equal(
      null,
    );
    expect(
      el.shadowRoot.querySelector(
        '#controls [icon="av:audio-descriptive-track"]',
      ),
    ).to.equal(null);
    // the actions still do what they did
    const opened = [];
    el.goToYoutube = () => opened.push("youtube");
    el._handleCopyLink = () => opened.push("link");
    el.shadowRoot.querySelector("#header-youtube").click();
    el.shadowRoot.querySelector("#header-copy-link").click();
    expect(opened).to.deep.equal(["youtube", "link"]);
    const ad = el.shadowRoot.querySelector("#header-audio-description");
    expect(ad.getAttribute("aria-pressed")).to.equal("false");
    el.togglePlay = () => {};
    ad.click();
    await el.updateComplete;
    expect(el.audioDescriptionEnabled).to.equal(true);
    expect(ad.getAttribute("aria-pressed")).to.equal("true");
    // learning mode and hide-youtube-link still hide them
    el.hideYoutubeLink = true;
    el.learningMode = true;
    await el.updateComplete;
    expect(visibleLabels(headerActions(el))).to.not.include("Open on YouTube");
    expect(visibleLabels(headerActions(el))).to.not.include("Copy Media Link");
  });

  it("header toggles report their state", async () => {
    const cc = el.shadowRoot.querySelector("#header-cc");
    const transcript = el.shadowRoot.querySelector("#header-transcript");
    const settings = el.shadowRoot.querySelector("#settings-button");
    expect(cc.getAttribute("aria-pressed")).to.equal("false");
    expect(transcript.getAttribute("aria-pressed")).to.equal("true");
    expect(settings.getAttribute("aria-expanded")).to.equal("false");
    expect(settings.getAttribute("aria-controls")).to.equal("settings");
    cc.click();
    await el.updateComplete;
    expect(el.cc).to.equal(true);
    expect(cc.getAttribute("aria-pressed")).to.equal("true");
    transcript.click();
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
    expect(transcript.getAttribute("aria-pressed")).to.equal("false");
    transcript.click();
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(false);
  });

  it("Settings opens the tray under the header", async () => {
    const settings = el.shadowRoot.querySelector("#settings-button");
    const tray = el.shadowRoot.querySelector("#settings");
    expect(tray.hidden).to.equal(true);
    settings.click();
    await el.updateComplete;
    expect(el.__settingsOpen).to.equal(true);
    expect(tray.hidden).to.equal(false);
    expect(settings.getAttribute("aria-expanded")).to.equal("true");
    // the tray follows the header, before the media
    const header = el.shadowRoot.querySelector(".ddd-block-header");
    expect(header.nextElementSibling).to.equal(tray);
    settings.click();
    await el.updateComplete;
    expect(tray.hidden).to.equal(true);
  });

  it("download and print actions call the existing methods", async () => {
    const fired = [];
    el.download = () => fired.push("download");
    el.print = () => fired.push("print");
    el.shadowRoot.querySelector("#header-download").click();
    el.shadowRoot.querySelector("#header-print").click();
    expect(fired).to.deep.equal(["download", "print"]);
  });

  it("learning mode hides transcript, download and print actions", async () => {
    el.learningMode = true;
    await el.updateComplete;
    expect(visibleLabels(headerActions(el))).to.not.include("Transcript");
    expect(visibleLabels(headerActions(el))).to.not.include(
      "Download Transcript",
    );
    expect(visibleLabels(headerActions(el))).to.not.include("Print Transcript");
    expect(visibleLabels(headerActions(el))).to.include("Settings");
  });

  it("disable-print-button hides download and print", async () => {
    el.disablePrintButton = true;
    await el.updateComplete;
    const labels = visibleLabels(headerActions(el));
    expect(labels).to.not.include("Download Transcript");
    expect(labels).to.not.include("Print Transcript");
  });

  it("the control bar keeps play, backward, forward and mute in every desktop layout", async () => {
    const icons = () =>
      Array.from(
        el.shadowRoot.querySelectorAll("#controls-left a11y-media-button"),
      )
        .filter((b) => !b.hidden && getComputedStyle(b).display !== "none")
        .map((b) => b.getAttribute("label"));
    expect(el.hasAttribute("full-flex")).to.equal(true);
    expect(icons()).to.include.members(["Play", "Backward", "Forward", "Mute"]);
    el._setTranscriptLayout("below");
    await el.updateComplete;
    expect(icons()).to.include.members(["Play", "Backward", "Forward", "Mute"]);
    // the seek slider sits above the buttons
    const slider = el.shadowRoot.querySelector("#slider");
    expect(slider.nextElementSibling.id).to.equal("controls");
    expect(slider.getAttribute("label")).to.equal("Seek Slider");
  });

  it("passes the a11y audit with the header and tray open", async () => {
    el.toggleSettings(true);
    await el.updateComplete;
    // skip-link: the existing "Skip to the transcript." link points into
    // the shadow root, which axe cannot follow (unchanged by this layout)
    await expect(el).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});

describe("a11y-media-player settings tray", () => {
  let el;
  beforeEach(async () => {
    clearPreference();
    el = await playerWithCues();
    el.toggleSettings(true);
    await el.updateComplete;
  });
  afterEach(() => clearPreference());

  const group = (cls) => el.shadowRoot.querySelector(`#settings .${cls}`);
  const pills = (cls) =>
    Array.from(group(cls).querySelectorAll("button.seg")).map((b) =>
      b.textContent.trim(),
    );

  it("holds today's settings plus Layout", () => {
    expect(group("tray-layout").hidden).to.equal(false);
    expect(
      group("tray-layout").querySelector(".tray-label").textContent.trim(),
    ).to.equal("Layout");
    expect(pills("tray-layout")).to.deep.equal([
      "Side",
      "Below",
      "Left",
      "Right",
    ]);
    expect(pills("tray-transcript")).to.deep.equal(["Off", "English"]);
    expect(
      group("tray-transcript").querySelector(".tray-label").textContent.trim(),
    ).to.equal("Transcript");
    expect(pills("tray-captions")).to.deep.equal(["Off", "English"]);
    expect(
      group("tray-captions").querySelector(".tray-label").textContent.trim(),
    ).to.equal("Closed Captions");
    expect(
      group("tray-speed").querySelector(".tray-label").textContent.trim(),
    ).to.equal("Speed %");
    const speed = el.shadowRoot.querySelector("#speed");
    expect(speed.getAttribute("min")).to.equal("0.5");
    expect(speed.getAttribute("max")).to.equal("2.5");
    expect(speed.getAttribute("step")).to.equal("0.25");
    expect(
      group("tray-speed").querySelector(".speed-value").textContent.trim(),
    ).to.equal("100%");
    expect(pills("tray-toggles")).to.deep.equal([
      "Scroll Transcript",
      "Loop Playback",
    ]);
  });

  it("track pickers select tracks and Off", async () => {
    const captions = group("tray-captions").querySelectorAll("button.seg");
    expect(captions[0].getAttribute("aria-pressed")).to.equal("true");
    captions[1].click();
    await el.updateComplete;
    expect(el.cc).to.equal(true);
    expect(captions[1].getAttribute("aria-pressed")).to.equal("true");
    captions[0].click();
    await el.updateComplete;
    expect(el.cc).to.equal(false);
    const transcript = group("tray-transcript").querySelectorAll("button.seg");
    expect(transcript[1].getAttribute("aria-pressed")).to.equal("true");
    transcript[0].click();
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
    transcript[1].click();
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(false);
  });

  it("speed and loop update the player", async () => {
    el._handleSpeedChanged({ composedPath: () => [{ value: 1.5 }] });
    await el.updateComplete;
    expect(el.playbackRate).to.equal(1.5);
    expect(
      group("tray-speed").querySelector(".speed-value").textContent.trim(),
    ).to.equal("150%");
    const loop = el.shadowRoot.querySelector("#loop");
    expect(loop.getAttribute("aria-pressed")).to.equal("false");
    loop.click();
    await el.updateComplete;
    expect(el.loop).to.equal(true);
    expect(loop.getAttribute("aria-pressed")).to.equal("true");
  });

  it("Escape closes the tray and returns focus to Settings", async () => {
    const loop = el.shadowRoot.querySelector("#loop");
    loop.focus();
    loop.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;
    expect(el.__settingsOpen).to.equal(false);
    expect(el.shadowRoot.activeElement).to.equal(
      el.shadowRoot.querySelector("#settings-button"),
    );
  });
});

describe("a11y-media-player transcript layout preference", () => {
  beforeEach(() => clearPreference());
  afterEach(() => {
    clearPreference();
    delete globalThis.UserScaffold;
  });

  it("defaults to the side layout, or below with stacked-layout", async () => {
    const el = await playerWithCues();
    expect(el.transcriptLayout).to.equal("side");
    expect(el.transcriptSide).to.equal("right");
    expect(el.hasAttribute("full-flex")).to.equal(true);
    el.stackedLayout = true;
    await el.updateComplete;
    expect(el.transcriptLayout).to.equal("below");
    expect(el.hasAttribute("full-flex")).to.equal(false);
  });

  it("the viewer's choice is applied and remembered in this browser", async () => {
    const el = await playerWithCues();
    el.toggleSettings(true);
    await el.updateComplete;
    el.shadowRoot
      .querySelector('[data-action="layout"][data-value="below"]')
      .click();
    await el.updateComplete;
    expect(el.transcriptLayout).to.equal("below");
    expect(el.hasAttribute("full-flex")).to.equal(false);
    expect(
      el.shadowRoot.querySelector("#body").getAttribute("data-layout"),
    ).to.equal("below");
    expect(
      JSON.parse(globalThis.localStorage.getItem(A11Y_MEDIA_LAYOUT_PREFERENCE)),
    ).to.deep.equal({ layout: "below", side: "right" });
    // a player made later reads it back
    const next = await playerWithCues();
    expect(next.transcriptLayout).to.equal("below");
    expect(next.hasAttribute("full-flex")).to.equal(false);
  });

  it("left / right place the transcript beside the media", async () => {
    const el = await playerWithCues();
    el._setTranscriptLayout("side", "left");
    await el.updateComplete;
    expect(el.hasAttribute("full-flex")).to.equal(true);
    expect(
      el.shadowRoot.querySelector("#body").getAttribute("data-side"),
    ).to.equal("left");
    const transcript = el.shadowRoot.querySelector("#transcript-section");
    const media = el.shadowRoot.querySelector("#player-section");
    expect(transcript.getBoundingClientRect().left).to.be.below(
      media.getBoundingClientRect().left,
    );
    expect(
      JSON.parse(globalThis.localStorage.getItem(A11Y_MEDIA_LAYOUT_PREFERENCE)),
    ).to.deep.equal({ layout: "side", side: "left" });
  });

  it("other players on the page follow the change", async () => {
    const a = await playerWithCues();
    const b = await playerWithCues();
    a._setTranscriptLayout("below");
    await b.updateComplete;
    expect(b.transcriptLayout).to.equal("below");
  });

  it("uses the learner profile (user-scaffold) when the page has one", async () => {
    const prefs = {};
    globalThis.UserScaffold = {
      instance: {
        readPreference: (key, fallback) =>
          key in prefs ? prefs[key] : fallback,
        writePreference: (key, value) => {
          prefs[key] = value;
        },
      },
    };
    prefs[A11Y_MEDIA_LAYOUT_PREFERENCE] = { layout: "side", side: "left" };
    const el = await playerWithCues();
    expect(el.transcriptLayout).to.equal("side");
    expect(el.transcriptSide).to.equal("left");
    el._setTranscriptLayout("below");
    expect(prefs[A11Y_MEDIA_LAYOUT_PREFERENCE]).to.deep.equal({
      layout: "below",
      side: "left",
    });
  });

  it("ignores broken stored values", async () => {
    globalThis.localStorage.setItem(A11Y_MEDIA_LAYOUT_PREFERENCE, "{oops");
    const el = await playerWithCues();
    expect(el.transcriptLayout).to.equal("side");
  });

  it("picking a layout shows a hidden transcript", async () => {
    const el = await playerWithCues();
    el.toggleTranscript(false);
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
    el._setTranscriptLayout("below");
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(false);
  });

  it("the Hide transcript button in the search row hides it", async () => {
    const el = await playerWithCues();
    const hide = el.shadowRoot.querySelector("#hide-transcript-button");
    expect(hide.getAttribute("aria-label")).to.equal("Hide transcript");
    hide.click();
    await el.updateComplete;
    expect(el.hideTranscript).to.equal(true);
    expect(
      el.shadowRoot
        .querySelector("#header-transcript")
        .getAttribute("aria-pressed"),
    ).to.equal("false");
    expect(el.hasAttribute("full-flex")).to.equal(false);
  });
});

describe("a11y-media-player at small widths", () => {
  let el;
  beforeEach(async () => {
    clearPreference();
    el = await playerWithCues();
    el.responsiveSize = "xs";
    await el.updateComplete;
  });
  afterEach(() => clearPreference());

  it("keeps only Settings and Fullscreen in the header", () => {
    const labels = visibleLabels(headerActions(el));
    expect(labels).to.not.include("Closed Captions");
    expect(labels).to.not.include("Transcript");
    expect(labels).to.not.include("Download Transcript");
    expect(labels).to.not.include("Print Transcript");
    expect(labels[0]).to.equal("Settings");
  });

  it("moves Closed Captions, Transcript, Download and Print into the tray", async () => {
    el.toggleSettings(true);
    await el.updateComplete;
    const actions = el.shadowRoot.querySelector("#settings .tray-actions");
    expect(actions.hidden).to.equal(false);
    expect(
      actions.previousElementSibling,
      "the moved actions open the tray",
    ).to.equal(null);
    const buttons = Array.from(actions.querySelectorAll("button.seg")).filter(
      (b) => !b.hidden,
    );
    expect(buttons.map((b) => b.textContent.trim())).to.deep.equal([
      "Closed Captions",
      "Transcript",
      "Download Transcript",
      "Print Transcript",
    ]);
    // the other header actions move there too when they apply
    el.audioDescriptionSource = "data:audio/mp3,";
    el.linkable = true;
    el.youtubeId = "abc123";
    await el.updateComplete;
    expect(
      Array.from(actions.querySelectorAll("button.seg"))
        .filter((b) => !b.hidden)
        .map((b) => b.textContent.trim()),
    ).to.deep.equal([
      "Closed Captions",
      "Transcript",
      "Download Transcript",
      "Print Transcript",
      "Audio Description",
      "Copy Media Link",
      "Open on YouTube",
    ]);
    expect(visibleLabels(headerActions(el))[0]).to.equal("Settings");
    buttons[0].click();
    await el.updateComplete;
    expect(el.cc).to.equal(true);
  });

  it("always puts the transcript below and hides the Layout choice", async () => {
    el._setTranscriptLayout("side", "left");
    await el.updateComplete;
    expect(el.transcriptLayout).to.equal("side");
    expect(el.hasAttribute("full-flex")).to.equal(false);
    expect(
      el.shadowRoot.querySelector("#body").getAttribute("data-layout"),
    ).to.equal("below");
    expect(
      el.shadowRoot.querySelector("#settings .tray-layout").hidden,
    ).to.equal(true);
  });

  it("the tray actions are hidden again at desktop width", async () => {
    el.responsiveSize = "lg";
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector("#settings .tray-actions").hidden,
    ).to.equal(true);
    expect(visibleLabels(headerActions(el))).to.include("Closed Captions");
  });
});

describe("transcript cue start times", () => {
  it("formats the start time in short form", () => {
    expect(shortCueTime(0)).to.equal("0s");
    expect(shortCueTime(4)).to.equal("4s");
    expect(shortCueTime(4.9)).to.equal("4s");
    expect(shortCueTime(60)).to.equal("1m");
    expect(shortCueTime(80)).to.equal("1m 20s");
    expect(shortCueTime(3600)).to.equal("1h");
    expect(shortCueTime(3720)).to.equal("1h 2m");
    expect(shortCueTime(3723)).to.equal("1h 2m 3s");
    expect(shortCueTime("00:00")).to.equal("0s");
    expect(shortCueTime("00:04")).to.equal("4s");
    expect(shortCueTime("01:20")).to.equal("1m 20s");
    expect(shortCueTime("01:02:03")).to.equal("1h 2m 3s");
    expect(shortCueTime("")).to.equal("");
    expect(shortCueTime(undefined)).to.equal("");
    expect(shortCueTime(-5)).to.equal("0s");
  });

  it("cues show only their start, above the text, and hide-timestamps hides it", async () => {
    clearPreference();
    const el = await playerWithCues();
    const cues = el.shadowRoot.querySelectorAll("a11y-media-transcript-cue");
    expect(cues.length).to.equal(2);
    // start / end stay on the cue as before
    expect(cues[0].getAttribute("start")).to.equal("00:04");
    expect(cues[0].getAttribute("end")).to.equal("00:09");
    const time = cues[0].shadowRoot.querySelector("#time");
    const text = cues[0].shadowRoot.querySelector("#text");
    expect(time.textContent.trim()).to.equal("4s");
    expect(
      cues[1].shadowRoot.querySelector("#time").textContent.trim(),
    ).to.equal("1m 20s");
    // time line above the text, text takes the full width
    expect(time.getBoundingClientRect().bottom).to.be.at.most(
      text.getBoundingClientRect().top + 1,
    );
    expect(Math.round(text.getBoundingClientRect().width)).to.be.at.least(
      Math.round(
        cues[0].getBoundingClientRect().width -
          parseFloat(getComputedStyle(cues[0]).paddingLeft) -
          parseFloat(getComputedStyle(cues[0]).paddingRight) -
          parseFloat(getComputedStyle(cues[0]).borderLeftWidth) -
          1,
      ),
    );
    el.hideTimestamps = true;
    await el.updateComplete;
    await cues[0].updateComplete;
    expect(cues[0].hasAttribute("hide-timestamps")).to.equal(true);
    expect(getComputedStyle(time).display).to.equal("none");
  });
});

describe("a11y-media-player accent", () => {
  afterEach(() => clearPreference());

  const color = (node, prop) => getComputedStyle(node)[prop];
  const parts = async (el) => {
    await el.updateComplete;
    await sleep(20);
    const sr = el.shadowRoot;
    return {
      chip: color(sr.querySelector(".ddd-block-chip"), "backgroundColor"),
      seek: getComputedStyle(sr.querySelector("#slider"))
        .getPropertyValue("--simple-range-input-color")
        .trim(),
      seekResolved: (() => {
        const probe = globalThis.document.createElement("span");
        probe.style.color = "var(--simple-range-input-color)";
        sr.querySelector("#slider").shadowRoot.appendChild(probe);
        const c = getComputedStyle(probe).color;
        probe.remove();
        return c;
      })(),
      action: color(sr.querySelector("#settings-button"), "color"),
      bar: color(
        sr
          .querySelector("#controls a11y-media-button")
          .shadowRoot.querySelector("#button"),
        "color",
      ),
      bodyBorder: color(
        sr.querySelector(".ddd-block-header"),
        "borderBottomColor",
      ),
    };
  };

  it("accent-color reaches only the header chip and the seek slider", async () => {
    const plain = await fixture(
      html`<a11y-media-player><video></video></a11y-media-player>`,
    );
    const red = await fixture(
      html`<a11y-media-player accent-color="red"
        ><video></video
      ></a11y-media-player>`,
    );
    const p = await parts(plain);
    const r = await parts(red);
    // chip and seek take the accent
    expect(r.chip).to.not.equal(p.chip);
    expect(r.seekResolved).to.equal(r.chip);
    expect(p.seekResolved).to.equal(p.chip);
    // buttons and borders stay neutral
    expect(r.action).to.equal(p.action);
    expect(r.bar).to.equal(p.bar);
    expect(r.bodyBorder).to.equal(p.bodyBorder);
    expect(r.action).to.not.equal(r.chip);
    expect(r.bar).to.not.equal(r.chip);
  });

  it("the theme palette (--ddd-theme-primary) colors the chip and seek, accent-color wins over it", async () => {
    const wrap = await fixture(
      html`<div style="--ddd-theme-primary: rgb(1, 2, 3)">
        <a11y-media-player><video></video></a11y-media-player>
        <a11y-media-player accent-color="red"
          ><video></video
        ></a11y-media-player>
      </div>`,
    );
    const [palette, local] = wrap.querySelectorAll("a11y-media-player");
    const p = await parts(palette);
    const l = await parts(local);
    expect(p.chip).to.equal("rgb(1, 2, 3)");
    expect(p.seekResolved).to.equal("rgb(1, 2, 3)");
    expect(l.chip).to.not.equal("rgb(1, 2, 3)");
    expect(p.action).to.not.equal("rgb(1, 2, 3)");
  });

  it("the default grey accent-color falls back to the DDD default", async () => {
    const grey = await fixture(
      html`<a11y-media-player accent-color="grey"
        ><video></video
      ></a11y-media-player>`,
    );
    const plain = await fixture(
      html`<a11y-media-player><video></video></a11y-media-player>`,
    );
    expect((await parts(grey)).chip).to.equal((await parts(plain)).chip);
  });
});
