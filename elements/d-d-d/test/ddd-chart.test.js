import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import * as DDDModule from "../d-d-d.js";
import { DDDChartPalette, DDDChartStyles } from "../lib/DDDChart.js";

class DDDChartTester extends LitElement {
  static get styles() {
    return [DDDChartStyles];
  }
  render() {
    return html`<span>x</span>`;
  }
}
globalThis.customElements.define("ddd-chart-tester", DDDChartTester);

describe("DDDChart", () => {
  it("is a standalone module that adds nothing to the d-d-d exports", () => {
    expect(DDDModule.DDDChartStyles).to.equal(undefined);
    expect(DDDModule.DDDChartPalette).to.equal(undefined);
  });

  it("names eight light / dark pairs of DDD colours", () => {
    expect(DDDChartPalette).to.be.an("array").with.length(8);
    DDDChartPalette.forEach((pair) => {
      expect(pair).to.be.an("array").with.length(2);
      expect(pair[0]).to.be.a("string").and.not.equal("");
      expect(pair[1]).to.be.a("string").and.not.equal("");
    });
    expect(DDDChartPalette[0]).to.deep.equal(["beaverBlue", "pughBlue"]);
  });

  it("sets the series, grid and label custom properties on the host", async () => {
    // the DDD colour tokens come from DDDStyles on a real page; give the
    // fixture its own so the light-dark() values compute
    const names = new Set(["limestoneLight", "slateGray"]);
    DDDChartPalette.forEach((pair) => pair.forEach((n) => names.add(n)));
    const el = await fixture(html`<ddd-chart-tester></ddd-chart-tester>`);
    names.forEach((n) =>
      el.style.setProperty(`--ddd-theme-default-${n}`, "rgb(1, 2, 3)"),
    );
    const cs = getComputedStyle(el);
    for (let i = 1; i <= 8; i++) {
      expect(
        cs.getPropertyValue(`--ddd-chart-${i}`).trim(),
        `--ddd-chart-${i}`,
      ).to.contain("light-dark(");
    }
    expect(cs.getPropertyValue("--ddd-chart-grid").trim()).to.not.equal("");
    expect(cs.getPropertyValue("--ddd-chart-label").trim()).to.not.equal("");
  });

  it("resolves to different colours in light and dark", async () => {
    const el = await fixture(
      html`<div>
        <ddd-chart-tester
          id="l"
          style="color-scheme: light; --ddd-theme-default-beaverBlue: rgb(30, 64, 124); --ddd-theme-default-pughBlue: rgb(150, 190, 230)"
        ></ddd-chart-tester>
        <ddd-chart-tester
          id="d"
          style="color-scheme: dark; --ddd-theme-default-beaverBlue: rgb(30, 64, 124); --ddd-theme-default-pughBlue: rgb(150, 190, 230)"
        ></ddd-chart-tester>
      </div>`,
    );
    const probe = (host) => {
      const s = globalThis.document.createElement("span");
      s.style.color = "var(--ddd-chart-1)";
      host.shadowRoot.appendChild(s);
      return getComputedStyle(s).color;
    };
    expect(probe(el.querySelector("#l"))).to.equal("rgb(30, 64, 124)");
    expect(probe(el.querySelector("#d"))).to.equal("rgb(150, 190, 230)");
  });
});
