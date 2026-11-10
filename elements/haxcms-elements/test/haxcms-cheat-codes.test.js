import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import { addCheatCodeMethods } from "../lib/core/haxcms-cheat-codes.js";

// cheat codes that change the person's avatar find it inside the top bar's
// user menu toggle, and the page-wide ones toggle cleanly
describe("haxcms cheat codes", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(200);
    addCheatCodeMethods(
      el,
      globalThis.SuperDaemonManager.requestAvailability(),
    );
  });
  afterEach(() => {
    const m = globalThis.document.getElementById("matrix-effect");
    if (m) {
      m.remove();
    }
    globalThis.document.body.style.filter = "";
    delete globalThis.document.body.dataset.cheatTimeTravelFilter;
  });

  it("finds the avatar in the user menu toggle", () => {
    const avatar = el._cheatAvatar();
    expect(avatar).to.exist;
    expect(avatar.character.tagName).to.equal("RPG-CHARACTER");
  });

  it("DKMODE scales the avatar and lets it out of the round button", () => {
    el._executeCheatDKMODE();
    const avatar = el._cheatAvatar();
    expect(avatar.character.style.transform).to.contain("scale");
    expect(avatar.button.style.overflow).to.equal("visible");
  });

  it("SUMMONZOMBIE swaps the avatar to the zombie seed over a saved code", () => {
    const avatar = el._cheatAvatar();
    avatar.character.code = "123";
    el._executeCheatSummonZombie();
    expect(avatar.character.seed).to.equal("zpg");
    expect(!!avatar.character.code).to.equal(false);
  });

  it("TIMETRAVEL toggles on and back to the page's own filter exactly", () => {
    globalThis.document.body.style.filter = "blur(0px)";
    el._executeCheatTimeTravel();
    expect(globalThis.document.body.style.filter).to.contain("sepia(1)");
    el._executeCheatTimeTravel();
    expect(globalThis.document.body.style.filter).to.equal("blur(0px)");
  });

  it("DARKWEB covers the page at once and toggles off", () => {
    el._executeCheatDarkWeb();
    const m = globalThis.document.getElementById("matrix-effect");
    expect(m).to.exist;
    // on the root so a body filter can't tint it, dimming the page
    expect(m.parentNode).to.equal(globalThis.document.documentElement);
    expect(m.style.background).to.contain("rgba");
    el._executeCheatDarkWeb();
    expect(globalThis.document.getElementById("matrix-effect")).to.equal(null);
  });
});
