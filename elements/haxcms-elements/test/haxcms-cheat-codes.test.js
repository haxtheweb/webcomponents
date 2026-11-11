import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import {
  addCheatCodeMethods,
  defineCheatCodes,
} from "../lib/core/haxcms-cheat-codes.js";

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

  it("cheats are developer-only, ultra low and the activation command is last", () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability();
    defineCheatCodes(el, sdi);
    const cheats = sdi.allItems.filter(
      (i) => typeof i.path === "string" && i.path.indexOf(">cheat/") === 0,
    );
    expect(cheats.length).to.be.greaterThan(10);
    cheats.forEach((c) => {
      expect(c.context).to.deep.equal([">"]);
      expect(c.priority).to.be.at.least(900000);
    });
    expect(sdi.allItems.find((i) => i.title === "ETERNALDARKNESS")).to.equal(
      undefined,
    );
    // developer list order: activation last of all developer commands
    sdi.value = "";
    sdi.commandContext = ">";
    const dev = sdi.filterItems(sdi.allItems, [">"]);
    expect(dev[dev.length - 1].path).to.equal(">developer/cheat-codes");
    // never in the everyday (global) list
    sdi.commandContext = "*";
    const everyday = sdi.filterItems(sdi.allItems, ["*", "CMS", "HAX"]);
    expect(everyday.some((i) => i.path.indexOf(">cheat/") === 0)).to.equal(
      false,
    );
  });

  it("an exact title match does not stick a cheat to the top", () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability();
    defineCheatCodes(el, sdi);
    sdi.commandContext = ">";
    sdi.value = "ddr";
    sdi.filterItems(sdi.allItems, [">"]);
    const ddr = sdi.allItems.find((i) => i.title === "DDR");
    expect(ddr.priority).to.be.at.least(900000);
    sdi.value = "";
  });
});
