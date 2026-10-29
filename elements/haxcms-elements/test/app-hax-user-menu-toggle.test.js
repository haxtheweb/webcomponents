import { fixture, expect, html } from "@open-wc/testing";
import "../lib/core/ui/app-hax-user-menu-toggle.js";
import {
  saveAvatarCode,
  loadAvatarCode,
} from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";
import { encodeCharacter } from "@haxtheweb/rpg-character/rpg-character.js";

const settled = async (el) => {
  await el.updateComplete;
  await el.updateComplete;
};
const character = (el) => el.shadowRoot.querySelector("rpg-character");

describe("app-hax-user-menu-toggle avatars", () => {
  afterEach(() => {
    globalThis.localStorage.removeItem("rpg-character-avatar:tester");
    globalThis.localStorage.removeItem("rpg-character-avatar:someoneelse");
  });

  it("uses the username look when nothing is saved", async () => {
    const el = await fixture(
      html`<app-hax-user-menu-toggle seed="tester"></app-hax-user-menu-toggle>`,
    );
    await settled(el);
    expect(character(el).getAttribute("code")).to.equal("");
    expect(character(el).seed).to.equal("tester");
  });

  it("shows a saved avatar and updates live when it changes", async () => {
    const first = encodeCharacter({ preset: "wizard" });
    saveAvatarCode("tester", first);
    const el = await fixture(
      html`<app-hax-user-menu-toggle seed="tester"></app-hax-user-menu-toggle>`,
    );
    await settled(el);
    expect(character(el).getAttribute("code")).to.equal(first);
    const second = encodeCharacter({ preset: "pirate" });
    saveAvatarCode("tester", second);
    await settled(el);
    expect(character(el).getAttribute("code")).to.equal(second);
    // other people's saves are ignored
    saveAvatarCode("someoneelse", encodeCharacter({ preset: "ghost" }));
    await settled(el);
    expect(character(el).getAttribute("code")).to.equal(second);
  });

  it("prefers a backend avatar code over the browser copy", async () => {
    saveAvatarCode("tester", encodeCharacter({ preset: "wizard" }));
    const fromServer = encodeCharacter({ preset: "chef" });
    const el = await fixture(
      html`<app-hax-user-menu-toggle
        seed="tester"
        avatar-code="${fromServer}"
      ></app-hax-user-menu-toggle>`,
    );
    await settled(el);
    expect(character(el).getAttribute("code")).to.equal(fromServer);
  });

  it("ignores unreadable codes", async () => {
    globalThis.localStorage.setItem("rpg-character-avatar:tester", "junk");
    expect(loadAvatarCode("tester")).to.equal("");
    expect(loadAvatarCode("tester", { avatarCode: "junk" })).to.equal("");
  });

  it("the menu hat still shows over a saved avatar", async () => {
    saveAvatarCode("tester", encodeCharacter({ hat: "cowboy" }));
    const el = await fixture(
      html`<app-hax-user-menu-toggle
        seed="tester"
        hat="edit"
      ></app-hax-user-menu-toggle>`,
    );
    await settled(el);
    await settled(character(el));
    const hrefs = Array.from(
      character(el).shadowRoot.querySelectorAll("image"),
    ).map((i) => i.getAttribute("href"));
    expect(hrefs.some((h) => /\/hat\/edit\.svg$/.test(h))).to.be.true;
  });
});
