/**
 * Keyboard flow: audio-player controls (shared media flow in
 * scripts/test-setup/keyboard-flow-media.js). Uses a local media file so no
 * test waits on the network.
 */
import { fixture, html } from "@open-wc/testing";
import "../audio-player.js";
import {
  describeMediaKeyboardFlow,
  keyboardFlowTracks,
} from "../../../scripts/test-setup/keyboard-flow-media.js";

const localMedia = new URL(
  "../../app-hax/lib/assets/sounds/success.mp3",
  import.meta.url,
).href;

describeMediaKeyboardFlow("audio-player", async () => {
  const wrapper = await fixture(
    html`<div>
      <button id="before">before</button>
      <audio-player
        source="${localMedia}"
        media-title="Keyboard flow"
        tracks="${keyboardFlowTracks}"
      ></audio-player>
      <button id="after">after</button>
    </div>`,
  );
  return {
    wrapper,
    host: wrapper.querySelector("audio-player"),
    before: wrapper.querySelector("#before"),
    after: wrapper.querySelector("#after"),
  };
});
