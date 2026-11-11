import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-collapse.js";
import "../lib/a11y-collapse-group.js";

describe("a11y-collapse DDD block row", () => {
  it("keeps the expand / collapse property defaults and shows them through this.t", async () => {
    const el = await fixture(
      html`<a11y-collapse heading="Q"><div>A</div></a11y-collapse>`,
    );
    expect(el.label).to.equal("expand");
    expect(el.tooltip).to.equal("expand");
    // a translation of the fallback words is what renders
    el.t = { ...el.t, expand: "Ausklappen", collapse: "Einklappen" };
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("simple-icon-button-lite#expand");
    expect(btn.label).to.equal("Ausklappen");
    expect(
      el.shadowRoot.querySelector("simple-tooltip").textContent.trim(),
    ).to.equal("Ausklappen");
    el.expanded = true;
    await el.updateComplete;
    await Promise.resolve();
    await el.updateComplete;
    expect(el.label).to.equal("collapse");
    expect(btn.label).to.equal("Einklappen");
  });

  it("shows authored labels and tooltips as written", async () => {
    const el = await fixture(html`
      <a11y-collapse
        heading="Q"
        label="toggle info"
        tooltip="more info"
        label-expanded="hide info"
        tooltip-expanded="less info"
        ><div>A</div></a11y-collapse
      >
    `);
    el.t = { ...el.t, expand: "Ausklappen", collapse: "Einklappen" };
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("#expand");
    expect(btn.label).to.equal("toggle info");
    expect(
      el.shadowRoot.querySelector("simple-tooltip").textContent.trim(),
    ).to.equal("more info");
    el.expanded = true;
    await el.updateComplete;
    expect(btn.label).to.equal("hide info");
  });

  it("renders the heading property as a zero-margin block title in a 48px row", async () => {
    const el = await fixture(
      html`<a11y-collapse heading="Question"><div>A</div></a11y-collapse>`,
    );
    const heading = el.shadowRoot.querySelector('p[part="heading"]');
    expect(heading).to.exist;
    const cs = getComputedStyle(heading);
    expect(cs.marginTop).to.equal("0px");
    expect(cs.marginBottom).to.equal("0px");
    const row = el.shadowRoot.querySelector("#heading");
    expect(row.getBoundingClientRect().height).to.be.at.least(48);
    const toggle = el.shadowRoot.querySelector("#expand");
    expect(toggle.getBoundingClientRect().width).to.equal(40);
    expect(getComputedStyle(el).borderTopWidth).to.equal("1px");
    expect(getComputedStyle(el).borderTopLeftRadius).to.not.equal("0px");
  });

  it("keeps slotted heading margins out of the row height", async () => {
    const el = await fixture(html`
      <a11y-collapse
        ><p slot="heading" style="margin: 24px 0">Slotted</p>
        <div>A</div></a11y-collapse
      >
    `);
    const row = el.shadowRoot.querySelector("#heading");
    expect(row.getBoundingClientRect().height).to.be.below(60);
  });

  it("lets --a11y-collapse-* properties override the DDD defaults", async () => {
    const el = await fixture(html`
      <a11y-collapse
        heading="Q"
        style="--a11y-collapse-border: 2px solid; --a11y-collapse-border-color: red; --a11y-collapse-border-radius: 0; --a11y-collapse-heading-min-height: 0;"
        ><div>A</div></a11y-collapse
      >
    `);
    const cs = getComputedStyle(el);
    expect(cs.borderTopWidth).to.equal("2px");
    expect(cs.borderTopColor).to.equal("rgb(255, 0, 0)");
    expect(cs.borderTopLeftRadius).to.equal("0px");
  });

  it("shares one frame in a group: only the outer corners are rounded", async () => {
    const group = await fixture(html`
      <a11y-collapse-group>
        <a11y-collapse heading="One"><div>1</div></a11y-collapse>
        <a11y-collapse heading="Two"><div>2</div></a11y-collapse>
        <a11y-collapse heading="Three"><div>3</div></a11y-collapse>
      </a11y-collapse-group>
    `);
    const [first, middle, last] = group.querySelectorAll("a11y-collapse");
    await last.updateComplete;
    const r = (el) => getComputedStyle(el);
    expect(r(first).borderTopLeftRadius).to.not.equal("0px");
    expect(r(first).borderBottomLeftRadius).to.equal("0px");
    expect(r(middle).borderTopLeftRadius).to.equal("0px");
    expect(r(middle).borderBottomLeftRadius).to.equal("0px");
    expect(r(middle).borderTopStyle).to.equal("none");
    expect(r(last).borderBottomLeftRadius).to.not.equal("0px");
    expect(r(first).marginBottom).to.equal("0px");
  });

  it("is accessible collapsed, expanded and disabled", async () => {
    const el = await fixture(
      html`<a11y-collapse heading="Q" disabled><div>A</div></a11y-collapse>`,
    );
    await expect(el).shadowDom.to.be.accessible();
    el.disabled = false;
    el.expanded = true;
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });

  it("places the tooltip above the toggle with the DDD tooltip colours", async () => {
    for (const markup of [
      html`<a11y-collapse heading="Q"><div>A</div></a11y-collapse>`,
      html`<a11y-collapse heading="Q" heading-button
        ><div>A</div></a11y-collapse
      >`,
    ]) {
      const el = await fixture(markup);
      const tip = el.shadowRoot.querySelector("simple-tooltip");
      expect(tip.getAttribute("for")).to.equal("expand");
      expect(tip.position).to.equal("top");
      const box = tip.shadowRoot.querySelector("#tooltip");
      // coaly label with white text, whatever the page sets on body
      expect(getComputedStyle(box).backgroundColor).to.equal("rgb(38, 38, 38)");
      expect(getComputedStyle(box).color).to.equal("rgb(255, 255, 255)");
    }
  });

  it("heading-button shows the tooltip while the row is hovered or focused", async () => {
    const el = await fixture(
      html`<a11y-collapse heading="Q" heading-button
        ><div>A</div></a11y-collapse
      >`,
    );
    const tip = el.shadowRoot.querySelector("simple-tooltip");
    const row = el.shadowRoot.querySelector("button");
    expect(tip.manualMode).to.be.true;
    row.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip._showing).to.be.true;
    row.dispatchEvent(new MouseEvent("mouseleave"));
    expect(tip._showing).to.be.false;
    row.dispatchEvent(new FocusEvent("focus"));
    expect(tip._showing).to.be.true;
    row.dispatchEvent(new FocusEvent("blur"));
    expect(tip._showing).to.be.false;
  });

  it("follows the DDD bg treatment colour instead of the page light / dark pair", async () => {
    const el = await fixture(html`
      <a11y-collapse
        heading="Q"
        heading-button
        expanded
        data-design-treatment="bg"
        data-primary="5"
        style="color: rgb(0, 0, 0); --ddd-theme-primary: rgb(162, 170, 173);"
        ><div>A</div></a11y-collapse
      >
    `);
    const row = el.shadowRoot.querySelector("#heading");
    const toggle = el.shadowRoot.querySelector("#expand");
    expect(getComputedStyle(row).color).to.equal("rgb(0, 0, 0)");
    // open toggle: filled with the contrast colour, icon in the fill colour
    expect(getComputedStyle(toggle).backgroundColor).to.equal("rgb(0, 0, 0)");
    expect(getComputedStyle(toggle).color).to.equal("rgb(162, 170, 173)");
    // the heading row has no fill of its own
    expect(getComputedStyle(row).backgroundColor).to.equal("rgba(0, 0, 0, 0)");
  });
});
