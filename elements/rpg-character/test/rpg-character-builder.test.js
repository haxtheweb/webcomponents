import { fixture, expect, html } from "@open-wc/testing";
import "../lib/rpg-character-builder.js";
import {
  decodeCharacter,
  encodeCharacter,
  traitsFromSeed,
} from "../rpg-character.js";

const settled = async (el) => {
  await el.updateComplete;
  await el.updateComplete;
};

const select = (el, slot) =>
  el.shadowRoot.querySelector(`select[data-slot="${slot}"]`);

describe("rpg-character-builder", () => {
  it("starts from the seed's look and previews it", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const character = decodeCharacter(el.code);
    expect(character).to.not.be.null;
    expect(character.skin).to.equal(0);
    const preview = el.shadowRoot.querySelector("rpg-character");
    expect(preview.getAttribute("code")).to.equal(el.code);
  });

  it("changing a choice updates the code and fires value-changed", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    let fired = null;
    el.addEventListener("value-changed", (e) => {
      fired = e.detail.value;
    });
    const hat = select(el, "hat");
    hat.value = "wizard";
    hat.dispatchEvent(new Event("change"));
    await settled(el);
    expect(decodeCharacter(el.code).hat).to.equal("wizard");
    expect(fired).to.equal(el.code);
    const skin = select(el, "skin");
    skin.value = "6";
    skin.dispatchEvent(new Event("change"));
    await settled(el);
    expect(decodeCharacter(el.code).skin).to.equal(6);
  });

  it("loading a code sets every control", async () => {
    const code = encodeCharacter({
      skin: 4,
      preset: "santa",
      pet: "owl",
      pose: "cheer",
      seasonal: true,
      flagText: "GO",
    });
    const el = await fixture(
      html`<rpg-character-builder code="${code}"></rpg-character-builder>`,
    );
    await settled(el);
    expect(select(el, "preset").value).to.equal("santa");
    expect(select(el, "pet").value).to.equal("owl");
    expect(select(el, "pose").value).to.equal("cheer");
    expect(select(el, "skin").value).to.equal("4");
    expect(el.shadowRoot.querySelector('input[data-slot="seasonal"]').checked)
      .to.be.true;
    expect(
      el.shadowRoot.querySelector('input[data-slot="flagText"]').value,
    ).to.equal("GO");
  });

  it("a new name changes the look but keeps style and gear", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const pet = select(el, "pet");
    pet.value = "dog";
    pet.dispatchEvent(new Event("change"));
    await settled(el);
    const name = el.shadowRoot.querySelector("#seed");
    name.value = "zpg";
    name.dispatchEvent(new Event("input"));
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
    const field = el.shadowRoot.querySelector("#code");
    field.value = "nope";
    field.dispatchEvent(new Event("change"));
    await settled(el);
    expect(el.status).to.equal(el.t.invalidCode);
    const good = encodeCharacter({ hat: "chef" });
    field.value = good;
    field.dispatchEvent(new Event("change"));
    await settled(el);
    expect(el.code).to.equal(good);
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

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("steps a numbered look choice with previous and next", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const start = decodeCharacter(el.code).skin;
    const next = el.shadowRoot
      .querySelector('[data-step="skin"]')
      .parentElement.querySelector(".step:last-of-type");
    next.click();
    await settled(el);
    expect(decodeCharacter(el.code).skin).to.not.equal(start);
    el.shadowRoot.querySelector('[data-step="skin"]').click();
    await settled(el);
    expect(decodeCharacter(el.code).skin).to.equal(start);
    // stepping wraps around
    const skin = select(el, "skin");
    skin.value = "0";
    skin.dispatchEvent(new Event("change"));
    await settled(el);
    el.shadowRoot.querySelector('[data-step="skin"]').click();
    await settled(el);
    expect(decodeCharacter(el.code).skin).to.be.greaterThan(0);
  });

  it("labels every control and uses switches for extras", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const root = el.shadowRoot;
    root.querySelectorAll("select, input").forEach((control) => {
      expect(root.querySelector(`label[for="${control.id}"]`), control.id).to
        .exist;
    });
    const fire = root.querySelector('input[data-slot="fire"]');
    expect(fire.getAttribute("role")).to.equal("switch");
    expect(root.querySelector(".ftr")).to.equal(null);
  });

  it("stages changes behind Save and Cancel in a dialog", async () => {
    const el = await fixture(
      html`<rpg-character-builder
        seed="btopro"
        actions
        save-label="Save character"
      ></rpg-character-builder>`,
    );
    await settled(el);
    const root = el.shadowRoot;
    const save = root.querySelector(".ftr .save");
    expect(save.textContent.trim()).to.equal("Save character");
    expect(save.disabled).to.be.true;
    expect(root.querySelector(".ftr .st").textContent).to.contain(
      "No unsaved changes",
    );
    const hat = select(el, "hat");
    hat.value = "wizard";
    hat.dispatchEvent(new Event("change"));
    await settled(el);
    expect(el.dirty).to.be.true;
    expect(save.disabled).to.be.false;
    expect(root.querySelector(".ftr .st").textContent).to.contain(
      "Unsaved changes",
    );
    let saved = null;
    let cancelled = 0;
    el.addEventListener("rpg-character-builder-save", (e) => {
      saved = e.detail.code;
    });
    el.addEventListener("rpg-character-builder-cancel", () => cancelled++);
    save.click();
    expect(saved).to.equal(el.code);
    root.querySelector(".ftr .cancel").click();
    expect(cancelled).to.equal(1);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("marks a bad code as an error", async () => {
    const el = await fixture(
      html`<rpg-character-builder seed="btopro"></rpg-character-builder>`,
    );
    await settled(el);
    const field = el.shadowRoot.querySelector("#code");
    field.value = "nope";
    field.dispatchEvent(new Event("change"));
    await settled(el);
    const status = el.shadowRoot.querySelector("#code-status");
    expect(status.classList.contains("error")).to.be.true;
    expect(status.textContent).to.contain("not a character code");
  });
});
