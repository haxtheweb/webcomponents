import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import * as DDDModule from "../d-d-d.js";
import { DDDTableStyles } from "../lib/DDDTable.js";

class DDDTableTester extends LitElement {
  static get properties() {
    return { mods: { type: String } };
  }
  static get styles() {
    return [DDDTableStyles];
  }
  render() {
    return html`<table class="ddd-table ${this.mods || ""}">
      <caption>
        Sales
      </caption>
      <thead>
        <tr>
          <th scope="col">Region</th>
          <th scope="col" class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">North</th>
          <td class="num">1,200</td>
        </tr>
        <tr>
          <th scope="row">South</th>
          <td data-numeric>$3.50</td>
        </tr>
        <tr>
          <th scope="row">West</th>
          <td>n/a</td>
        </tr>
      </tbody>
    </table>`;
  }
}
globalThis.customElements.define("ddd-table-tester", DDDTableTester);

// the DDD colour tokens come from DDDStyles on a real page; give the
// fixture its own so the light-dark() values compute
const tokens =
  "--ddd-theme-default-limestoneMaxLight: rgb(242, 242, 244); --ddd-theme-default-coalyGray: rgb(38, 38, 38); --ddd-theme-default-nittanyNavy: rgb(0, 30, 68); --ddd-theme-default-white: rgb(255, 255, 255); --ddd-theme-default-limestoneLight: rgb(228, 229, 231); --ddd-theme-default-slateGray: rgb(49, 77, 100); --ddd-theme-default-slateMaxLight: rgb(238, 243, 247); --ddd-spacing-1: 4px; --ddd-spacing-2: 8px; --ddd-spacing-3: 12px;";

const q = (el, sel) => el.shadowRoot.querySelector(sel);
const cs = (el, sel) => getComputedStyle(q(el, sel));

describe("DDDTable", () => {
  it("is a standalone module that adds nothing to the d-d-d exports", () => {
    expect(DDDModule.DDDTableStyles).to.equal(undefined);
    expect(DDDTableStyles.cssText).to.contain(".ddd-table");
  });

  it("tints the header row and divides body rows", async () => {
    const el = await fixture(
      html`<ddd-table-tester
        style="color-scheme: light; ${tokens}"
      ></ddd-table-tester>`,
    );
    const head = cs(el, "thead th");
    expect(head.backgroundColor).to.equal("rgb(242, 242, 244)");
    expect(head.color).to.equal("rgb(0, 30, 68)");
    expect(Number(head.fontWeight)).to.be.at.least(700);
    const cell = cs(el, "tbody tr:first-child td");
    expect(cell.borderBottomWidth).to.equal("1px");
    expect(cell.borderBottomColor).to.equal("rgb(228, 229, 231)");
    expect(cell.borderLeftStyle).to.equal("none");
    expect(cell.paddingTop).to.equal("8px");
    expect(cell.paddingLeft).to.equal("12px");
    // no divider under the last row: the frame closes the table
    expect(cs(el, "tbody tr:last-child td").borderBottomStyle).to.equal("none");
  });

  it("switches the header and dividers for dark mode", async () => {
    const el = await fixture(
      html`<ddd-table-tester
        style="color-scheme: dark; ${tokens}"
      ></ddd-table-tester>`,
    );
    const head = cs(el, "thead th");
    expect(head.backgroundColor).to.equal("rgb(38, 38, 38)");
    expect(head.color).to.equal("rgb(255, 255, 255)");
    expect(cs(el, "tbody tr:first-child td").borderBottomColor).to.equal(
      "rgb(49, 77, 100)",
    );
  });

  it("right-aligns numeric cells with tabular digits", async () => {
    const el = await fixture(
      html`<ddd-table-tester style="${tokens}"></ddd-table-tester>`,
    );
    ["td.num", "td[data-numeric]", "th.num"].forEach((sel) => {
      const s = cs(el, sel);
      expect(s.textAlign, sel).to.equal("end");
      expect(s.fontVariantNumeric, sel).to.equal("tabular-nums");
    });
    expect(cs(el, "tbody tr:last-child td").textAlign).to.equal("start");
  });

  it("stripes, borders and condenses through class modifiers", async () => {
    const el = await fixture(
      html`<ddd-table-tester
        mods="striped bordered condensed"
        style="color-scheme: light; ${tokens}"
      ></ddd-table-tester>`,
    );
    expect(cs(el, "tbody tr:nth-child(2) td").backgroundColor).to.equal(
      "rgb(238, 243, 247)",
    );
    expect(cs(el, "tbody tr:nth-child(1) td").backgroundColor).to.equal(
      "rgba(0, 0, 0, 0)",
    );
    const cell = cs(el, "tbody tr:first-child td");
    expect(cell.borderLeftStyle).to.equal("solid");
    expect(cell.borderLeftWidth).to.equal("1px");
    expect(cell.paddingTop).to.equal("4px");
    expect(cell.paddingLeft).to.equal("8px");
  });

  it("accepts the same modifiers as attributes", async () => {
    const el = await fixture(
      html`<ddd-table-tester style="${tokens}"></ddd-table-tester>`,
    );
    const table = q(el, "table");
    table.setAttribute("striped", "");
    table.setAttribute("bordered", "");
    expect(cs(el, "tbody tr:nth-child(2) td").backgroundColor).to.not.equal(
      "rgba(0, 0, 0, 0)",
    );
    expect(cs(el, "tbody tr:first-child td").borderLeftStyle).to.equal("solid");
  });

  it("lets custom properties override the DDD defaults", async () => {
    const el = await fixture(
      html`<ddd-table-tester
        style="${tokens} --ddd-table-header-background: rgb(1, 2, 3); --ddd-table-divider: rgb(4, 5, 6)"
      ></ddd-table-tester>`,
    );
    expect(cs(el, "thead th").backgroundColor).to.equal("rgb(1, 2, 3)");
    expect(cs(el, "tbody tr:first-child td").borderBottomColor).to.equal(
      "rgb(4, 5, 6)",
    );
  });
});
