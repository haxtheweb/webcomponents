import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-language-picker.js";

// the picker loads the shared registry itself (languages.json beside
// LanguageRegistry.js), so these tests also cover that path
async function picker(template) {
  const el = await fixture(
    template || html`<haxcms-language-picker></haxcms-language-picker>`,
  );
  // registry fetch resolves, then the list renders
  for (let i = 0; i < 50 && !el._ready; i++) {
    await aTimeout(20);
  }
  await el.updateComplete;
  return el;
}

const input = (el) => el.shadowRoot.querySelector("input");
const list = (el) => el.shadowRoot.querySelector("[role='listbox']");
const items = (el) => [...el.shadowRoot.querySelectorAll("[role='option']")];
const labels = (el) =>
  items(el).map((li) => li.querySelector("span").textContent.trim());

async function type(el, text) {
  const field = input(el);
  field.focus();
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function press(el, key) {
  input(el).dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
  await el.updateComplete;
}

describe("haxcms-language-picker", () => {
  it("renders a labelled combobox with a collapsed listbox", async () => {
    const el = await picker();
    expect(el.shadowRoot.querySelector("label").textContent.trim()).to.equal(
      "Language",
    );
    expect(input(el).getAttribute("role")).to.equal("combobox");
    expect(input(el).getAttribute("aria-expanded")).to.equal("false");
    expect(list(el).hidden).to.equal(true);
  });

  it("is accessible, closed and open", async () => {
    const el = await picker();
    await expect(el).to.be.accessible();
    input(el).focus();
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });

  it("lists every registry language as 'Name - code' when focused", async () => {
    const el = await picker();
    input(el).focus();
    await el.updateComplete;
    expect(input(el).getAttribute("aria-expanded")).to.equal("true");
    expect(list(el).hidden).to.equal(false);
    const shown = labels(el);
    expect(shown).to.include("Swahili - sw");
    expect(shown).to.include("English - en");
    expect(shown).to.include("English (United Kingdom) - en-GB");
    expect(shown.length).to.be.greaterThan(100);
  });

  it("finds languages by name, native name or code", async () => {
    const el = await picker();
    await type(el, "swa");
    expect(labels(el)[0]).to.equal("Swahili - sw");
    await type(el, "Kiswahili");
    expect(labels(el)).to.deep.equal(["Swahili - sw"]);
    await type(el, "fil");
    expect(labels(el)[0]).to.equal("Filipino - tl");
    await type(el, "espanol");
    expect(labels(el)[0]).to.equal("Spanish - es");
  });

  it("says when nothing matches", async () => {
    const el = await picker();
    await type(el, "zzzzzz");
    expect(items(el).length).to.equal(0);
    expect(el.shadowRoot.querySelector(".empty").textContent.trim()).to.equal(
      "No languages match",
    );
    expect(
      el.shadowRoot.querySelector("[role='status']").textContent.trim(),
    ).to.equal("No languages match");
  });

  it("selects with the keyboard and fires value-changed and change", async () => {
    const el = await picker();
    const events = [];
    el.addEventListener("value-changed", (e) =>
      events.push(["value-changed", e.detail]),
    );
    el.addEventListener("change", (e) => events.push(["change", e.detail]));
    await type(el, "swa");
    await press(el, "Enter");
    expect(el.value).to.equal("sw");
    expect(input(el).value).to.equal("Swahili - sw");
    expect(input(el).getAttribute("aria-expanded")).to.equal("false");
    expect(events.map((e) => e[0])).to.deep.equal(["value-changed", "change"]);
    expect(events[0][1].value).to.equal("sw");
    expect(events[0][1].key).to.equal("sw");
    expect(events[0][1].option.name).to.equal("Swahili");
  });

  it("selects by clicking an option", async () => {
    const el = await picker();
    input(el).focus();
    await el.updateComplete;
    const target = items(el).find((li) =>
      li.textContent.includes("Japanese - ja"),
    );
    target.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    expect(el.value).to.equal("ja");
    expect(input(el).value).to.equal("Japanese - ja");
  });

  it("moves through options with the arrow, Home and End keys", async () => {
    const el = await picker();
    await type(el, "sw"); // Swahili, Swedish: first is active
    const ids = () => input(el).getAttribute("aria-activedescendant");
    const first = ids();
    expect(first).to.match(/-option-0$/);
    await press(el, "ArrowDown");
    expect(ids()).to.match(/-option-1$/);
    await press(el, "ArrowUp");
    expect(ids()).to.equal(first);
    await press(el, "End");
    expect(ids()).to.match(new RegExp(`-option-${items(el).length - 1}$`));
    await press(el, "Home");
    expect(ids()).to.equal(first);
  });

  it("selects the shown label on focus so typing replaces it", async () => {
    const el = await picker(
      html`<haxcms-language-picker value="pt_BR"></haxcms-language-picker>`,
    );
    const field = input(el);
    field.focus();
    await el.updateComplete;
    expect(field.value).to.equal("Portuguese (Brazil) - pt-BR");
    expect(field.selectionStart).to.equal(0);
    expect(field.selectionEnd).to.equal(field.value.length);
    // the full list is offered, not a search for the label text
    expect(items(el).length).to.be.greaterThan(100);
  });

  it("Escape closes without changing the value", async () => {
    const el = await picker(
      html`<haxcms-language-picker value="de"></haxcms-language-picker>`,
    );
    await type(el, "fr");
    await press(el, "Escape");
    expect(el.value).to.equal("de");
    expect(input(el).value).to.equal("German - de");
    expect(list(el).hidden).to.equal(true);
  });

  it("closes on blur", async () => {
    const el = await picker();
    input(el).focus();
    await el.updateComplete;
    input(el).blur();
    await el.updateComplete;
    expect(list(el).hidden).to.equal(true);
  });

  it("normalizes legacy forms of a value to the canonical code", async () => {
    const el = await picker(
      html`<haxcms-language-picker value="zh_CN"></haxcms-language-picker>`,
    );
    expect(el.value).to.equal("zh-CN");
    expect(input(el).value).to.equal("Chinese (Simplified) - zh-CN");
    el.value = "iw";
    await el.updateComplete;
    expect(el.value).to.equal("he");
    el.value = "no";
    await el.updateComplete;
    expect(el.value).to.equal("nb");
  });

  it("shows a stored regional value the list does not offer", async () => {
    const el = await picker(
      html`<haxcms-language-picker value="de-DE"></haxcms-language-picker>`,
    );
    expect(el.value).to.equal("de-DE");
    expect(input(el).value).to.equal("German (Germany) - de-DE");
    input(el).focus();
    await el.updateComplete;
    expect(labels(el)).to.not.include("German (Germany) - de-DE");
  });

  it("include-regions controls which regional variants are listed", async () => {
    const all = await picker(
      html`<haxcms-language-picker
        include-regions="all"
      ></haxcms-language-picker>`,
    );
    input(all).focus();
    await all.updateComplete;
    expect(labels(all)).to.include("German (Germany) - de-DE");
    const none = await picker(
      html`<haxcms-language-picker
        include-regions="none"
      ></haxcms-language-picker>`,
    );
    input(none).focus();
    await none.updateComplete;
    expect(labels(none)).to.not.include("English (United Kingdom) - en-GB");
    expect(labels(none)).to.include("English - en");
  });

  it("popular-first lists the most common languages first", async () => {
    const el = await picker(
      html`<haxcms-language-picker popular-first></haxcms-language-picker>`,
    );
    input(el).focus();
    await el.updateComplete;
    expect(labels(el).slice(0, 3)).to.deep.equal([
      "English - en",
      "Chinese (Simplified) - zh-CN",
      "Hindi - hi",
    ]);
  });

  it("allow-custom offers a well-formed code the registry does not know", async () => {
    const el = await picker(
      html`<haxcms-language-picker allow-custom></haxcms-language-picker>`,
    );
    await type(el, "fr-CA");
    const last = items(el).pop();
    expect(last.textContent).to.contain("Use fr-CA");
    last.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    // kept as typed, not folded into fr
    expect(el.value).to.equal("fr-CA");
    expect(input(el).value).to.equal("fr-CA");
    // a known code is never offered as custom
    await type(el, "sw");
    expect(items(el).some((li) => li.textContent.includes("Use sw"))).to.equal(
      false,
    );
    // and without the flag nothing custom is offered
    const strict = await picker();
    await type(strict, "fr-CA");
    expect(
      items(strict).some((li) => li.textContent.includes("Use ")),
    ).to.equal(false);
  });

  it("accepts an options override", async () => {
    const el = await picker(
      html`<haxcms-language-picker
        .options=${[{ value: "en", label: "English" }, "es"]}
      ></haxcms-language-picker>`,
    );
    input(el).focus();
    await el.updateComplete;
    expect(labels(el)).to.deep.equal(["English", "es"]);
  });

  it("does not open when disabled", async () => {
    const el = await picker(
      html`<haxcms-language-picker disabled></haxcms-language-picker>`,
    );
    expect(input(el).disabled).to.equal(true);
    el._openList();
    await el.updateComplete;
    expect(list(el).hidden).to.equal(true);
  });

  it("uses the description for the accessible description", async () => {
    const el = await picker(
      html`<haxcms-language-picker
        description="Pick one"
      ></haxcms-language-picker>`,
    );
    const id = input(el).getAttribute("aria-describedby");
    expect(el.shadowRoot.getElementById(id).textContent.trim()).to.equal(
      "Pick one",
    );
  });

  it("marks right-to-left native names", async () => {
    const el = await picker(
      html`<haxcms-language-picker></haxcms-language-picker>`,
    );
    await type(el, "arabic");
    const native = items(el)[0].querySelector(".native");
    expect(native.getAttribute("dir")).to.equal("rtl");
    expect(native.getAttribute("lang")).to.equal("ar");
  });
});
