/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * video-player: 4 local-source players with captions and transcripts side
 * by side, then each player's accent color and dark mode changed. Players
 * only build their media player once on screen, so all 4 are in view and
 * first render waits for that.
 * Sources are local paths so nothing leaves the machine; whether the media
 * loads does not matter for render timing.
 */
import "@haxtheweb/video-player/video-player.js";
import { run, settle, frame } from "./lib/bench.js";

const COUNT = 4;
const SAMPLES = "../elements/video-player/demo/samples/";

run({
  setup() {
    return { host: document.getElementById("host") };
  },
  async firstRender({ host }) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("video-player");
      el.setAttribute("source", SAMPLES + "bench-missing.mp4");
      el.setAttribute("source-type", "local");
      el.setAttribute("track", SAMPLES + "stclair.vtt");
      el.setAttribute("media-title", "Lecture " + i);
      el.setAttribute("accent-color", "blue");
      frag.appendChild(el);
    }
    host.appendChild(frag);
    const players = host.querySelectorAll("video-player");
    const start = performance.now();
    for (;;) {
      await settle(host);
      let ready = 0;
      for (let i = 0; i < players.length; i++) {
        if (players[i].shadowRoot.querySelector("a11y-media-player")) {
          ready++;
        }
      }
      if (ready === players.length) {
        break;
      }
      if (performance.now() - start > 20000) {
        throw new Error("video-player never rendered its media player");
      }
      await frame();
    }
    await settle(host);
  },
  async update({ host }) {
    const players = host.querySelectorAll("video-player");
    for (let i = 0; i < players.length; i++) {
      players[i].accentColor = "orange";
      players[i].dark = true;
    }
    await settle(host);
  },
});
