import { html, fixture, expect } from "@open-wc/testing";
import { MicroGameBase } from "../micro-game-base.js";

class TestGame extends MicroGameBase {
  static get tag() {
    return "micro-game-test";
  }
  render() {
    return html`<div data-game-stage tabindex="0">
      ${this.renderPlayer({ width: 40, height: 50 })} ${this.renderOverlay()}
      ${this.done ? this.renderFinishPanel({ summary: "done" }) : ""}
    </div>`;
  }
}
customElements.define(TestGame.tag, TestGame);

describe("MicroGameBase test", () => {
  it("starts idle and plays on start", async () => {
    const el = await fixture(html`<micro-game-test></micro-game-test>`);
    expect(el.state).to.equal("idle");
    el.gameStart();
    expect(el.state).to.equal("playing");
    el.gamePause();
    expect(el.state).to.equal("paused");
  });

  it("uses the seed for the player character", async () => {
    const el = await fixture(
      html`<micro-game-test seed="abc"></micro-game-test>`,
    );
    expect(
      el.shadowRoot.querySelector("#player").getAttribute("seed"),
    ).to.equal("abc");
  });

  it("uses the signed in user's seed only when asked to", async () => {
    globalThis.HAXCMS = {
      instance: { store: { userData: { userName: "someone" } } },
    };
    const off = await fixture(
      html`<micro-game-test seed="abc"></micro-game-test>`,
    );
    expect(off.playerSeed).to.equal("abc");
    const on = await fixture(
      html`<micro-game-test seed="abc" seed-from-user></micro-game-test>`,
    );
    expect(on.playerSeed).to.equal("someone");
    delete globalThis.HAXCMS;
    const none = await fixture(
      html`<micro-game-test seed="abc" seed-from-user></micro-game-test>`,
    );
    expect(none.playerSeed).to.equal("abc");
  });

  it("emits game-complete and a completed progress event", async () => {
    const el = await fixture(html`<micro-game-test></micro-game-test>`);
    const seen = [];
    el.addEventListener("game-complete", () => seen.push("complete"));
    el.addEventListener("user-engagement", (e) =>
      seen.push(e.detail.activityDisplay),
    );
    el.gameComplete({ ms: 1500, confetti: false });
    expect(seen).to.deep.equal(["complete", "completed"]);
    expect(el.done).to.equal(true);
  });

  it("shows the prompt box unless the finish slot is used", async () => {
    const el = await fixture(
      html`<micro-game-test prompt="copy me"></micro-game-test>`,
    );
    el.gameComplete({ confetti: false });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#prompt").textContent).to.equal(
      "copy me",
    );
    const own = await fixture(
      html`<micro-game-test prompt="copy me"
        ><p slot="finish">mine</p></micro-game-test
      >`,
    );
    own.gameComplete({ confetti: false });
    await own.updateComplete;
    await own.updateComplete;
    expect(own.shadowRoot.querySelector("#prompt")).to.equal(null);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<micro-game-test></micro-game-test>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
