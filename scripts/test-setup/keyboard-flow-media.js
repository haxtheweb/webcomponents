/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Shared keyboard flow for the authorable media players (video-player,
 * audio-player), which both render a11y-media-player. A keyboard-only
 * learner must be able to play/pause, seek, turn on captions, open the
 * transcript and jump to a cue, reach fullscreen, and open/close settings,
 * with a visible focus ring at every stop and nothing hidden in the tab
 * order. Used from elements/<player>/test/*-keyboard-flow.test.js.
 */
/* global describe, it, beforeEach, afterEach -- mocha globals from web-test-runner */
import { expect } from "@open-wc/testing";

import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "./keyboard-flow.js";

/**
 * `tracks` value for a player: a local two-cue caption file (no network).
 */
export const keyboardFlowTracks = JSON.stringify([
  {
    src: new globalThis.URL("./keyboard-flow-captions.vtt", import.meta.url)
      .href,
    srclang: "en",
    label: "English",
    kind: "subtitles",
  },
]);

/**
 * Focus stops that fail today on the default branch (see the it.skip test
 * for each). Remove the entry when the bug is fixed.
 */
const KNOWN_BUGS = [
  {
    // a11y-media-player.js renders <a id="transcript-desc" class="sr-only"
    // href="#bottom"> before the transcript: it is in the tab order but the
    // .sr-only rule (left:-9999px; width/height 0) has no :focus override,
    // so focus disappears off screen when a sighted keyboard user reaches it
    match: (el) =>
      el.id === "transcript-desc" &&
      el.getRootNode().host &&
      el.getRootNode().host.tagName === "A11Y-MEDIA-PLAYER",
    reason: "transcript skip link is focusable but invisible",
  },
];

/**
 * Accessible name of a focus stop: aria-label, then aria-labelledby (looked
 * up in the stop's own root, e.g. the range input inside
 * simple-range-input), then its text.
 */
const label = (el) => {
  if (!el || !el.getAttribute) return "";
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  const ids = (el.getAttribute("aria-labelledby") || "").split(/\s+/);
  const root = el.getRootNode ? el.getRootNode() : null;
  const named = ids
    .map((id) =>
      id && root && root.getElementById ? root.getElementById(id) : null,
    )
    .filter((node) => node)
    .map((node) => (node.textContent || "").trim())
    .join(" ")
    .trim();
  return named || (el.textContent || "").trim();
};

/**
 * Tab forward until the focused control's accessible label matches, checking
 * the focus invariants on every stop on the way. Fails if `stopAt` is
 * reached first.
 */
async function tabTo(wanted, stopAt, max = 25) {
  for (let i = 0; i < max; i++) {
    await press("Tab");
    const el = expectGoodFocusStop(
      expect,
      `Tab toward "${wanted}" (${i + 1})`,
      {
        knownBugs: KNOWN_BUGS,
      },
    );
    if (wanted.test(label(el))) return el;
    if (stopAt && el === stopAt) break;
  }
  throw new Error(
    `no focusable control labelled ${wanted} before ${describeEl(stopAt)}`,
  );
}

/**
 * Register the media keyboard-flow suite.
 * @param {string} name element name for the describe block
 * @param {function} makeFixture async () => { wrapper, host, before, after }
 *   where `host` is the player element and before/after are buttons around it
 */
export function describeMediaKeyboardFlow(name, makeFixture) {
  describe(`keyboard flow: ${name} media controls`, function () {
    this.timeout(15000);
    let fx;
    let amp;
    let media;

    beforeEach(async () => {
      fx = await makeFixture();
      await waitFor(
        () => fx.host.shadowRoot.querySelector("a11y-media-player"),
        3000,
      );
      amp = fx.host.shadowRoot.querySelector("a11y-media-player");
      await amp.updateComplete;
      await waitFor(() => amp.media, 3000);
      media = amp.media;
      // never make sound in CI; keyboard activation is still a real gesture
      media.muted = true;
      await waitFor(() => amp.duration > 0, 4000);
      // captions come from the local keyboard-flow-captions.vtt track
      await waitFor(() => amp.cues && amp.cues.length === 2, 5000);
      await amp.updateComplete;
      await settle(100);
      fx.before.focus();
    });

    afterEach(async () => {
      if (media && !media.paused) media.pause();
      if (amp && amp.__settingsOpen) amp.toggleSettings(false);
      await settle(30);
    });

    it("has a logical tab order: no positive tabindex, every stop visible and ringed", async () => {
      expect(positiveTabindexIn(fx.host)).to.deep.equal([]);
      let guard = 0;
      while (deepActiveElement() !== fx.after && guard++ < 30) {
        await press("Tab");
        expectGoodFocusStop(expect, `${name} Tab ${guard}`, {
          knownBugs: KNOWN_BUGS,
        });
      }
      expectFocusOn(expect, fx.after, "Tab leaves the player");
    });

    it("Play/Pause toggles playback with Enter and Space", async () => {
      const play = await tabTo(/^play$/i, fx.after);
      await press("Enter", 150);
      await waitFor(() => amp.__playing, 2000);
      expect(amp.__playing, "Enter on Play starts playback").to.equal(true);
      // the same control (now Pause) keeps focus
      expect(
        composedContains(play.getRootNode().host, deepActiveElement()),
      ).to.equal(true);
      await press(" ", 150);
      await waitFor(() => !amp.__playing, 2000);
      expect(amp.__playing, "Space on Pause stops playback").to.equal(false);
    });

    it("tab order follows the layout: header actions, seek slider, Play, Backward, Forward, Mute, then the transcript", async () => {
      // Backward is disabled (so not a stop) at 0:00: move off the start
      amp.seek(Math.min(0.3, amp.duration / 4));
      await amp.updateComplete;
      await settle(100);
      fx.before.focus();
      // collect the accessible name of every stop through the player
      const names = [];
      let guard = 0;
      while (deepActiveElement() !== fx.after && guard++ < 40) {
        await press("Tab");
        const el = expectGoodFocusStop(expect, `${name} order ${guard}`, {
          knownBugs: KNOWN_BUGS,
        });
        names.push(label(el));
      }
      const at = (re) => names.findIndex((n) => re.test(n));
      const order = [
        /^closed captions$/i,
        /^transcript$/i,
        /^settings$/i,
        /^seek slider$/i,
        /^play$/i,
        /^backward$/i,
        /^forward$/i,
        /^mute$/i,
        /search the transcript/i,
        /^hide transcript$/i,
        /first cue/i,
        /second cue/i,
      ];
      const found = order.map((re) => at(re));
      order.forEach((re, i) =>
        expect(
          found[i],
          `${re} is in the tab order (${names.join(" | ")})`,
        ).to.be.at.least(0),
      );
      for (let i = 1; i < found.length; i++) {
        expect(
          found[i],
          `${order[i]} comes after ${order[i - 1]} (${names.join(" | ")})`,
        ).to.be.greaterThan(found[i - 1]);
      }
    });

    it("the seek slider moves the playhead with arrow keys", async () => {
      // the seek slider follows the header actions, above Play
      const slider = await tabTo(/^seek slider$/i, fx.after);
      expect(slider.tagName).to.equal("INPUT");
      expect(slider.type).to.equal("range");
      const start = amp.currentTime || 0;
      await press("ArrowRight", 150);
      await waitFor(() => (amp.currentTime || 0) > start, 1500);
      expect(amp.currentTime, "ArrowRight seeks forward").to.be.greaterThan(
        start,
      );
    });

    it("captions toggle and the transcript opens; a transcript cue seeks with Enter", async () => {
      await tabTo(/caption/i, fx.after);
      const ccBefore = !!amp.cc;
      await press("Enter", 100);
      expect(!!amp.cc, "Enter on Captions toggles them").to.equal(!ccBefore);
      expect(amp.standAlone, "a player with tracks has a transcript").to.equal(
        false,
      );
      // the Transcript button toggles the transcript panel
      await tabTo(/transcript/i, fx.after);
      const wasHidden = !!amp.hideTranscript;
      await press("Enter", 150);
      expect(!!amp.hideTranscript, "Enter toggles the transcript").to.equal(
        !wasHidden,
      );
      if (amp.hideTranscript) {
        await press("Enter", 150);
      }
      expect(amp.hideTranscript, "transcript is open").to.equal(false);
      // the transcript cues are buttons in the tab order
      await tabTo(/second cue/i, fx.after, 40);
      await press("Enter", 150);
      await waitFor(() => amp.currentTime >= 0.8, 1500);
      expect(amp.currentTime, "Enter on a cue seeks to it").to.be.at.least(0.8);
    });

    it("the fullscreen control is focusable and labelled", async function () {
      if (!amp.fullscreenButton) {
        // audio without a thumbnail has no fullscreen control by design
        this.skip();
      }
      const fs = await tabTo(/full ?screen/i, fx.after);
      expect(fs.disabled).to.not.equal(true);
    });

    it("Settings opens with Enter, Escape closes it and focus stays on the button", async () => {
      await tabTo(/settings/i, fx.after);
      await press("Enter", 100);
      expect(amp.__settingsOpen, "Enter opens settings").to.equal(true);
      await press("Escape", 100);
      expect(amp.__settingsOpen, "Escape closes settings").to.equal(false);
      expect(label(deepActiveElement())).to.match(/settings/i);
    });

    it.skip("KNOWN BUG: the transcript skip link becomes visible when it has focus", async () => {
      const link = amp.shadowRoot.querySelector("#transcript-desc");
      link.focus();
      expectFocusOn(expect, link);
      expectGoodFocusStop(expect, "transcript skip link");
    });
  });
}
