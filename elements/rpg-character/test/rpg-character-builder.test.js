import { fixture, expect, html } from "@open-wc/testing";
import { characterFromParams } from "../lib/rpg-character-builder.js";
import {
  decodeCharacter,
  encodeCharacter,
  traitsFromSeed,
} from "../rpg-character.js";

const settled = async (el) => {
  await el.updateComplete;
  await el.updateComplete;
};

const tile = (el, key) =>
  el.shadowRoot.querySelector(`button.tile[data-option="${key}"]`);

// show the tile for an option, paging to it when it is not on the first page
const showTile = async (el, tab, key) => {
  el.tab = tab;
  await settled(el);
  const index = el.tabDef.sections[0].options.findIndex((o) => o.key === key);
  el._offset = Math.floor(index / el._pageSize) * el._pageSize;
  await settled(el);
  return tile(el, key);
};

describe("rpg-character-builder", () => {
  it("starts from the seed's look and previews it", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const character = decodeCharacter(el.code);
    expect(character).to.not.be.null;
    expect(character.skin).to.equal(Number(traitsFromSeed("btopro").skin));
    const preview = el.shadowRoot.querySelector(".stage rpg-character");
    expect(preview.getAttribute("code")).to.equal(el.code);
  });

  it("picking a tile updates the code and fires value-changed", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    let fired = null;
    el.addEventListener("value-changed", (e) => {
      fired = e.detail.value;
    });
    (await showTile(el, "hat", "hat-wizard")).click();
    await settled(el);
    expect(decodeCharacter(el.code).hat).to.equal("wizard");
    expect(fired).to.equal(el.code);
    expect(tile(el, "hat-wizard").getAttribute("aria-pressed")).to.equal(
      "true",
    );
  });

  it("a swatch sets a color", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    el.tab = "body";
    await settled(el);
    el.shadowRoot.querySelector('[data-swatch="skin-6"]').click();
    await settled(el);
    expect(decodeCharacter(el.code).skin).to.equal(6);
  });

  it("flips an effect on and off from the same tile", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    el.tab = "effects";
    await settled(el);
    expect(decodeCharacter(el.code).circle).to.equal(false);
    tile(el, "circle").click();
    await settled(el);
    expect(decodeCharacter(el.code).circle).to.equal(true);
    expect(tile(el, "circle").getAttribute("aria-pressed")).to.equal("true");
    tile(el, "circle").click();
    await settled(el);
    expect(decodeCharacter(el.code).circle).to.equal(false);
    expect(tile(el, "circle").getAttribute("aria-pressed")).to.equal("false");
  });

  it("takes a chosen item off when its tile is clicked again", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    (await showTile(el, "pet", "pet-owl")).click();
    await settled(el);
    expect(decodeCharacter(el.code).pet).to.equal("owl");
    tile(el, "pet-owl").click();
    await settled(el);
    expect(decodeCharacter(el.code).pet).to.equal("none");
  });

  it("pages with simple-pager and shows how many options there are", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    el.tab = "hat";
    await settled(el);
    const total = el.tabDef.sections[0].options.length;
    const size = el._pageSize;
    const pager = el.shadowRoot.querySelector("simple-pager");
    expect(pager.total).to.equal(total);
    expect(pager.limit).to.equal(size);
    expect(pager.offset).to.equal(0);
    expect(el.shadowRoot.querySelectorAll(".tile").length).to.equal(size);
    // the suite pager asks for the next page; the builder moves to it
    pager.dispatchEvent(
      new CustomEvent("page-changed", {
        detail: { limit: size, offset: size },
      }),
    );
    await settled(el);
    await pager.updateComplete;
    expect(pager.offset).to.equal(size);
    const status = pager.shadowRoot.querySelector(".status").textContent;
    expect(status).to.contain(`${size + 1}`);
    expect(status).to.contain(`${total}`);
  });

  it("fits more tiles on a page when there is room", async () => {
    const el = await fixture(
      html`<div style="width:1400px">
        <rpg-character-builder seed="btopro"></rpg-character-builder>
      </div>`,
    );
    const builder = el.querySelector("rpg-character-builder");
    builder.tab = "hat";
    await settled(builder);
    builder._measure();
    await settled(builder);
    const wide = builder._pageSize;
    el.style.width = "760px";
    builder._measure();
    await settled(builder);
    expect(wide).to.be.greaterThan(builder._pageSize);
    expect(builder._columns).to.be.at.least(3);
  });

  it("loading a code shows it chosen", async () => {
    const code = encodeCharacter({
      skin: 4,
      preset: "santa",
      pet: "owl",
      seasonal: true,
    });
    const el = await fixture(
      html`<rpg-character-builder code="${code}"></rpg-character-builder>`,
    );
    el.tab = "effects";
    await settled(el);
    expect(tile(el, "seasonal").getAttribute("aria-pressed")).to.equal("true");
    el.tab = "body";
    await settled(el);
    expect(
      el.shadowRoot
        .querySelector('[data-swatch="skin-4"]')
        .getAttribute("aria-pressed"),
    ).to.equal("true");
  });

  it("a new name changes the look but keeps other choices", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    (await showTile(el, "pet", "pet-dog")).click();
    await settled(el);
    el._seedChanged({ detail: { value: "zpg" } });
    await settled(el);
    const character = decodeCharacter(el.code);
    expect(character.pet).to.equal("dog");
    expect(character.skin).to.equal(Number(traitsFromSeed("zpg").skin));
  });

  it("a typed code loads; an invalid one reports instead", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    el._codeTyped({ detail: { value: "nope" } });
    await settled(el);
    expect(el.status).to.equal(el.t.invalidCode);
    const good = encodeCharacter({ hat: "chef" });
    el._codeTyped({ detail: { value: good } });
    await settled(el);
    expect(el.code).to.equal(good);
  });

  it("undo brings back the code before the last change", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const before = el.code;
    (await showTile(el, "hat", "hat-bunny")).click();
    await settled(el);
    el.undo();
    await settled(el);
    expect(el.code).to.equal(before);
  });

  it("randomize produces a different valid character", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const before = el.code;
    let changed = false;
    for (let i = 0; i < 5 && !changed; i++) {
      el.randomize();
      await settled(el);
      changed = el.code !== before;
    }
    expect(changed).to.be.true;
    expect(decodeCharacter(el.code)).to.not.be.null;
  });

  it("leaves the address alone unless sync-url is set", async () => {
    const start = globalThis.location.href;
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    (await showTile(el, "hat", "hat-bunny")).click();
    await settled(el);
    expect(globalThis.location.href).to.equal(start);
    expect(
      el.shadowRoot.querySelector(".share").textContent.trim(),
    ).to.not.equal("");
  });

  it("with sync-url, keeps the address a link to the character", async () => {
    const start = globalThis.location.href;
    const code = encodeCharacter({ hat: "chef" });
    globalThis.history.replaceState({}, "", `?code=${code}`);
    const el = await fixture(
      html`<rpg-character-builder sync-url></rpg-character-builder>`,
    );
    await settled(el);
    expect(el.code).to.equal(code);
    (await showTile(el, "pet", "pet-owl")).click();
    await settled(el);
    expect(characterFromParams(globalThis.location.search).code).to.equal(
      el.code,
    );
    globalThis.history.replaceState({}, "", start);
  });

  it("reads old rpg-me seed links", () => {
    const fromSeed = characterFromParams("?seed=12345678&hat=bunny&fire=true");
    const character = decodeCharacter(fromSeed.code);
    expect(character.hat).to.equal("bunny");
    expect(character.fire).to.equal(true);
    expect(characterFromParams("")).to.equal(null);
  });

  it("stages changes and saves from the action bar", async () => {
    const el = await fixture(
      html`<rpg-character-builder
        seed="btopro"
        actions
      ></rpg-character-builder>`,
    );
    await settled(el);
    const save = el.shadowRoot.querySelector(".save");
    expect(save.disabled).to.be.true;
    (await showTile(el, "hat", "hat-bunny")).click();
    await settled(el);
    expect(el.dirty).to.be.true;
    let saved = null;
    el.addEventListener("rpg-character-builder-save", (e) => {
      saved = e.detail.code;
    });
    el.shadowRoot.querySelector(".save").click();
    expect(saved).to.equal(el.code);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    await expect(el).shadowDom.to.be.accessible();
    el.tab = "hat";
    await settled(el);
    await expect(el).shadowDom.to.be.accessible();
    el.tab = "effects";
    await settled(el);
    await expect(el).shadowDom.to.be.accessible();
  });
});
