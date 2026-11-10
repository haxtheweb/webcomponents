/**
 * Keyboard flow: video-player controls (shared media flow in
 * scripts/test-setup/keyboard-flow-media.js). Uses a local media file so no
 * test waits on the network.
 */
import { fixture, html } from "@open-wc/testing";
import "../video-player.js";
import {
  describeMediaKeyboardFlow,
  keyboardFlowTracks,
} from "../../../scripts/test-setup/keyboard-flow-media.js";

const localMedia = new URL(
  "../../app-hax/lib/assets/sounds/success.mp3",
  import.meta.url,
).href;

describeMediaKeyboardFlow("video-player", async () => {
  const wrapper = await fixture(
    html`<div>
      <button id="before">before</button>
      <video-player
        source="${localMedia}"
        media-title="Keyboard flow"
        tracks="${keyboardFlowTracks}"
        linkable
      ></video-player>
      <button id="after">after</button>
    </div>`,
  );
  return {
    wrapper,
    host: wrapper.querySelector("video-player"),
    before: wrapper.querySelector("#before"),
    after: wrapper.querySelector("#after"),
  };
});
