import { fixture, expect, html, oneEvent, aTimeout } from "@open-wc/testing";
import { sendKeys, setViewport } from "@web/test-runner-commands";
import "../lib/hax-palette-picker.js";
import { getDDDPaletteOptions } from "../lib/DDDPaletteRegistry.js";

// option A: a striped disc and name per palette; wide pickers show the
// chosen palette in full below, narrow ones preview it beside the row
const wide = () =>
  fixture(
    html`<div style="width: 720px">
      <hax-palette-picker
        value="5"
        active-value="5"
        show-status-flags
      ></hax-palette-picker>
    </div>`,
  ).then((host) => host.querySelector("hax-palette-picker"));
const narrow = () =>
  fixture(
    html`<div style="width: 260px; margin-left: 400px">
      <hax-palette-picker value="0" active-value="5"></hax-palette-picker>
    </div>`,
  ).then((host) => host.querySelector("hax-palette-picker"));
// narrow with no room beside it for a preview, as on a phone
const cramped = () =>
  fixture(
    html`<div style="width: 350px; margin-left: 20px">
      <hax-palette-picker value="3" active-value="5"></hax-palette-picker>
    </div>`,
  ).then((host) => host.querySelector("hax-palette-picker"));
const pointer = (type, pointerType) =>
  new PointerEvent(type, { pointerType, bubbles: true, composed: true });
const settle = async (el) => {
  await aTimeout(60);
  await el.updateComplete;
};

describe("hax-palette-picker rows", () => {
  // a test that narrows the viewport can't leave it narrow for the next
  afterEach(() => setViewport({ width: 800, height: 600 }));

  it("draws one row per palette, each with a disc of its seven colours", async () => {
    const el = await wide();
    await settle(el);
    const rows = el.shadowRoot.querySelectorAll(".option");
    expect(rows.length).to.equal(getDDDPaletteOptions().length);
    const disc = rows[0].querySelector(".disc");
    const bg = disc.getAttribute("style");
    for (let i = 1; i <= 7; i++) {
      expect(bg).to.contain(`var(--ddd-palette-color-${i})`);
    }
    // the colours are live: the disc paints the palette's first colour
    const painted = getComputedStyle(disc).backgroundImage;
    expect(painted).to.contain("linear-gradient");
    expect(painted).to.contain("rgb(");
  });

  it("keeps the radio inputs, so form use and arrow keys work as before", async () => {
    const el = await wide();
    await settle(el);
    const inputs = el.shadowRoot.querySelectorAll('input[type="radio"]');
    expect(inputs.length).to.equal(getDDDPaletteOptions().length);
    const checked = [...inputs].find((i) => i.checked);
    expect(checked.value).to.equal("5");
    checked.focus();
    setTimeout(() => sendKeys({ press: "ArrowDown" }));
    const e = await oneEvent(el, "value-changed");
    expect(e.detail.value).to.equal(el.value);
    expect(e.detail.dataPalette).to.equal(el.value);
    expect(Object.keys(e.detail).sort()).to.deep.equal([
      "dataPalette",
      "key",
      "option",
      "value",
    ]);
    expect(el.value).to.not.equal("5");
  });

  it("marks the selected row by its state and Active with a pill beside the name", async () => {
    const el = await wide();
    await settle(el);
    const selected = el.shadowRoot.querySelector(".option.selected");
    expect(selected.getAttribute("data-palette")).to.equal("5");
    const flag = selected.querySelector(".flag.active");
    expect(flag.hidden).to.equal(false);
    const name = selected
      .querySelector(".option-label")
      .getBoundingClientRect();
    const pill = flag.getBoundingClientRect();
    // the pill sits after the name, never over it
    expect(pill.left >= name.right - 1).to.equal(true);
    expect(el.shadowRoot.querySelector(".flag.selected")).to.equal(null);
  });

  it("wide: shows the chosen palette with colours 1 to 7 as hex codes", async () => {
    const el = await wide();
    await settle(el);
    expect(el.hasAttribute("data-narrow")).to.equal(false);
    const specimen = el.shadowRoot.querySelector(".specimen");
    expect(specimen).to.exist;
    expect(specimen.textContent).to.contain("Monotone");
    expect(specimen.textContent).to.contain("Active");
    const codes = [...specimen.querySelectorAll(".codes li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(codes.length).to.equal(7);
    codes.forEach((code) => expect(code).to.match(/#[0-9A-F]{6}$/));
    // Monotone runs black to white
    expect(codes[0]).to.contain("#000000");
    expect(codes[6]).to.contain("#FFFFFF");
  });

  it("narrow: no specimen; hovering a row previews it beside the picker", async () => {
    const el = await narrow();
    await settle(el);
    expect(el.hasAttribute("data-narrow")).to.equal(true);
    expect(el.shadowRoot.querySelector(".specimen")).to.equal(null);
    const row = el.shadowRoot.querySelector('.option[data-palette="5"]');
    row.dispatchEvent(pointer("pointerenter", "mouse"));
    await settle(el);
    const peek = el.shadowRoot.querySelector(".peek");
    expect(peek.hidden).to.equal(false);
    expect(peek.getAttribute("role")).to.equal("tooltip");
    expect(peek.textContent).to.contain("Monotone");
    expect(peek.textContent).to.contain("Active palette");
    expect(peek.querySelectorAll(".codes li").length).to.equal(7);
    // beside the picker, not over it
    const p = peek.getBoundingClientRect();
    const h = el.getBoundingClientRect();
    expect(p.right <= h.left || p.left >= h.right).to.equal(true);
    row.dispatchEvent(pointer("pointerleave", "mouse"));
    await settle(el);
    expect(peek.hidden).to.equal(true);
  });

  it("narrow: a tap never opens the preview (touch has no hover)", async () => {
    const el = await narrow();
    await settle(el);
    const row = el.shadowRoot.querySelector('.option[data-palette="3"]');
    const input = row.querySelector("input");
    row.dispatchEvent(pointer("pointerenter", "touch"));
    row.dispatchEvent(pointer("pointerdown", "touch"));
    input.focus();
    await settle(el);
    expect(el.shadowRoot.querySelector(".peek").hidden).to.equal(true);
    // the keyboard still previews
    input.blur();
    await sendKeys({ press: "Shift" });
    input.focus();
    await settle(el);
    expect(el.shadowRoot.querySelector(".peek").hidden).to.equal(false);
  });

  it("narrow with no room beside it: the chosen palette shows below, never over the rows", async () => {
    await setViewport({ width: 390, height: 844 });
    const el = await cramped();
    await settle(el);
    expect(el.hasAttribute("data-narrow")).to.equal(true);
    expect(el.hasAttribute("data-peek-below")).to.equal(true);
    const specimen = el.shadowRoot.querySelector(".specimen");
    expect(specimen).to.exist;
    expect(specimen.textContent).to.contain("Offbrand Blue");
    expect(specimen.querySelectorAll(".codes li").length).to.equal(7);
    const row = el.shadowRoot.querySelector('.option[data-palette="5"]');
    row.dispatchEvent(pointer("pointerenter", "mouse"));
    row.querySelector("input").focus();
    await settle(el);
    expect(el.shadowRoot.querySelector(".peek").hidden).to.equal(true);
    expect(
      row.querySelector("input").getAttribute("aria-describedby"),
    ).to.equal("");
    await expect(el).to.be.accessible();
  });

  it("narrow: focus opens the preview, described by it; Escape and blur close it", async () => {
    const el = await narrow();
    await settle(el);
    const input = el.shadowRoot.querySelector('input[value="3"]');
    input.focus();
    await settle(el);
    const peek = el.shadowRoot.querySelector(".peek");
    expect(peek.hidden).to.equal(false);
    expect(input.getAttribute("aria-describedby")).to.equal(peek.id);
    expect(peek.textContent).to.contain("Offbrand Blue");
    await sendKeys({ press: "Escape" });
    await settle(el);
    expect(peek.hidden).to.equal(true);
    input.blur();
    input.focus();
    await settle(el);
    expect(peek.hidden).to.equal(false);
    input.blur();
    await settle(el);
    expect(peek.hidden).to.equal(true);
  });

  it("keeps every attribute it had", async () => {
    const host = await fixture(
      html`<div style="width: 720px">
        <hax-palette-picker
          label="Pick one"
          description="For accents"
          value="monotone"
          name="pal"
          fallback-value="3"
          required
          disabled
        ></hax-palette-picker>
      </div>`,
    );
    const el = host.querySelector("hax-palette-picker");
    await settle(el);
    expect(el.value).to.equal("5");
    expect(el.selectedKey).to.equal("monotone");
    expect(el.getAttribute("selected-key")).to.equal("monotone");
    expect(el.shadowRoot.querySelector("legend").textContent).to.contain(
      "Pick one",
    );
    expect(el.shadowRoot.querySelector(".description").textContent).to.contain(
      "For accents",
    );
    const input = el.shadowRoot.querySelector('input[type="radio"]');
    expect(input.name).to.equal("pal");
    expect(input.required).to.equal(true);
    expect(input.disabled).to.equal(true);
  });

  it("is accessible, wide and narrow", async () => {
    const el = await wide();
    await settle(el);
    await expect(el).to.be.accessible();
    const small = await narrow();
    await settle(small);
    await expect(small).to.be.accessible();
  });
});
