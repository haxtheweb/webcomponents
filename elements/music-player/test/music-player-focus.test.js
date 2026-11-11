import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";

import "../music-player.js";

// The bundled player applied the focus-visible polyfill to every instance,
// adding 14 document listeners that are never removed (so every removed
// player stayed alive). With native :focus-visible it is skipped, and the
// keyboard focus ring must still show.
describe("music-player bundled midi-player focus handling", () => {
  it("does not apply the leaking polyfill and still shows a keyboard focus ring", async () => {
    const wrap = await fixture(
      html`<div>
        <button id="before">before</button>
        <music-player source=""></music-player>
      </div>`,
    );
    const el = wrap.querySelector("music-player");
    await el.updateComplete;
    await waitUntil(
      () => globalThis.customElements.get("midi-player"),
      "midi-player never defined",
      { timeout: 5000 },
    );
    const player = el.shadowRoot.querySelector("midi-player");
    await waitUntil(() => player.domInitialized, "midi-player never connected");
    expect(player.hasAttribute("data-js-focus-visible")).to.equal(false);

    const play = player.shadowRoot.querySelector(".play");
    play.disabled = false;
    wrap.querySelector("#before").focus();
    await sendKeys({ press: "Tab" });
    let active = globalThis.document.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    // tab order reaches the play button through music-player's shadow root
    if (active !== play) {
      play.focus({ focusVisible: true });
    }
    expect(play.matches(":focus-visible")).to.equal(true);
    expect(globalThis.getComputedStyle(play).outlineStyle).to.not.equal("none");
  });
});
