import { fixture, expect, html, aTimeout, oneEvent } from "@open-wc/testing";
import "../lib/core/haxcms-language-picker.js";

// label-hidden and the sizing custom properties let a host (the site admin
// SEO row) embed the picker; every default must stay the stand-alone look

async function picker(template) {
  const el = await fixture(template);
  for (let i = 0; i < 50 && !el._ready; i++) {
    await aTimeout(20);
  }
  await el.updateComplete;
  return el;
}

const input = (el) => el.shadowRoot.querySelector("input");
const label = (el) => el.shadowRoot.querySelector("label");
const css = (node) => globalThis.getComputedStyle(node);

describe("haxcms-language-picker embedding options", () => {
  it("shows the label by default and keeps the old defaults", async () => {
    const el = await picker(
      html`<haxcms-language-picker label="Language"></haxcms-language-picker>`,
    );
    expect(el.labelHidden).to.equal(false);
    expect(el.hasAttribute("label-hidden")).to.equal(false);
    expect(label(el).classList.contains("visually-hidden")).to.equal(false);
    expect(label(el).getBoundingClientRect().width).to.be.greaterThan(1);
    expect(css(input(el)).minHeight).to.equal("40px");
  });

  it("uses the same default sizes as the explicit DDD tokens", async () => {
    const plain = await picker(
      html`<haxcms-language-picker label="Language"></haxcms-language-picker>`,
    );
    const explicit = await picker(
      html`<haxcms-language-picker
        label="Language"
        style="--haxcms-language-picker-font-size: var(--ddd-font-size-xs); --haxcms-language-picker-radius: var(--ddd-radius-sm); --haxcms-language-picker-border: var(--ddd-border-sm); --haxcms-language-picker-label-size: var(--ddd-font-size-4xs)"
      ></haxcms-language-picker>`,
    );
    const a = css(input(plain));
    const b = css(input(explicit));
    expect(a.fontSize).to.equal(b.fontSize);
    expect(a.borderTopLeftRadius).to.equal(b.borderTopLeftRadius);
    expect(a.borderTopWidth).to.equal(b.borderTopWidth);
    expect(a.borderTopColor).to.equal(b.borderTopColor);
    expect(css(label(plain)).fontSize).to.equal(css(label(explicit)).fontSize);
    // list items keep the DDD list size by default
    input(plain).focus();
    input(explicit).focus();
    await plain.updateComplete;
    explicit.style.setProperty(
      "--haxcms-language-picker-option-font-size",
      "var(--ddd-theme-body-font-size)",
    );
    input(explicit).focus();
    await explicit.updateComplete;
    const li = plain.shadowRoot.querySelector("li");
    expect(li).to.exist;
    expect(css(li).fontSize).to.equal(
      css(explicit.shadowRoot.querySelector("li")).fontSize,
    );
  });

  it("label-hidden hides the label visually but keeps the accessible name", async () => {
    const el = await picker(
      html`<haxcms-language-picker
        label="Language"
        label-hidden
      ></haxcms-language-picker>`,
    );
    expect(el.labelHidden).to.equal(true);
    expect(label(el).classList.contains("visually-hidden")).to.equal(true);
    expect(label(el).hasAttribute("hidden")).to.equal(false);
    expect(label(el).getBoundingClientRect().width).to.be.at.most(1);
    // still the input's label, so it is the accessible name
    expect(label(el).getAttribute("for")).to.equal(input(el).id);
    expect(input(el).labels.length).to.equal(1);
    expect(input(el).labels[0].textContent.trim()).to.equal("Language");
  });

  it("reflects labelHidden set as a property", async () => {
    const el = await picker(
      html`<haxcms-language-picker label="Language"></haxcms-language-picker>`,
    );
    el.labelHidden = true;
    await el.updateComplete;
    expect(el.hasAttribute("label-hidden")).to.equal(true);
    expect(label(el).classList.contains("visually-hidden")).to.equal(true);
    el.labelHidden = false;
    await el.updateComplete;
    expect(el.hasAttribute("label-hidden")).to.equal(false);
    expect(label(el).classList.contains("visually-hidden")).to.equal(false);
  });

  it("sizes the control from the host custom properties", async () => {
    const el = await picker(
      html`<haxcms-language-picker
        label="Language"
        label-hidden
        style="--haxcms-language-picker-font-size: 14px; --haxcms-language-picker-option-font-size: 13px; --haxcms-language-picker-input-height: 36px; --haxcms-language-picker-border: 1px solid; --haxcms-language-picker-border-color: rgb(1, 2, 3); --haxcms-language-picker-radius: 4px"
      ></haxcms-language-picker>`,
    );
    const s = css(input(el));
    expect(s.fontSize).to.equal("14px");
    expect(s.minHeight).to.equal("36px");
    expect(s.borderTopWidth).to.equal("1px");
    expect(s.borderTopColor).to.equal("rgb(1, 2, 3)");
    expect(s.borderTopLeftRadius).to.equal("4px");
    input(el).focus();
    await el.updateComplete;
    const li = el.shadowRoot.querySelector("li");
    expect(li).to.exist;
    expect(css(li).fontSize).to.equal("13px");
  });

  it("still selects and fires value-changed with the label hidden", async () => {
    const el = await picker(
      html`<haxcms-language-picker
        label="Language"
        label-hidden
        value="en"
      ></haxcms-language-picker>`,
    );
    const field = input(el);
    field.focus();
    field.value = "swahili";
    field.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    setTimeout(() =>
      field.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    const e = await oneEvent(el, "value-changed");
    expect(e.detail.value).to.equal("sw");
    expect(el.value).to.equal("sw");
  });
});
