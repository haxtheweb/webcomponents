import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import { HaxTrayBrowserStyles } from "../lib/hax-tray-browser-styles.js";

// The editor tray's Blocks / Templates categories are HAX UI rows: a plain
// chevron, a 32px row, no hover wash and no tooltip. a11y-collapse's look on
// the page (round toggle, rounded frame, tinted hover, tooltip) must not
// show through, whatever the element does for content.
class TrayCollapseRowsHost extends LitElement {
  static get styles() {
    return HaxTrayBrowserStyles;
  }
  render() {
    return html`<a11y-collapse heading-button>
      <span slot="heading">Text</span>
      <div slot="content">blocks</div>
    </a11y-collapse>`;
  }
}
globalThis.customElements.define(
  "tray-collapse-rows-host",
  TrayCollapseRowsHost,
);

describe("tray category rows (a11y-collapse in the editor tray)", () => {
  let collapse;
  beforeEach(async () => {
    const host = await fixture(
      html`<tray-collapse-rows-host
        style="--hax-ui-icon: 16px; --hax-ui-row-height: 32px"
      ></tray-collapse-rows-host>`,
    );
    await host.updateComplete;
    collapse = host.shadowRoot.querySelector("a11y-collapse");
    await collapse.updateComplete;
  });

  it("draws a plain chevron, not the round toggle", async () => {
    const icon = getComputedStyle(collapse.shadowRoot.querySelector("#expand"));
    expect(icon.width).to.equal("16px");
    expect(icon.borderTopStyle).to.equal("none");
    expect(icon.backgroundColor).to.equal("rgba(0, 0, 0, 0)");
    collapse.expanded = true;
    await collapse.updateComplete;
    const open = getComputedStyle(collapse.shadowRoot.querySelector("#expand"));
    expect(open.backgroundColor, "no fill when open").to.equal(
      "rgba(0, 0, 0, 0)",
    );
  });

  it("keeps the row at 32px with square corners and no hover wash", () => {
    const button = collapse.shadowRoot.querySelector("button");
    // the row height, not grown to fit the 40px round toggle
    expect(button.getBoundingClientRect().height).to.be.at.most(32);
    expect(getComputedStyle(button).borderTopLeftRadius).to.equal("0px");
    expect(
      getComputedStyle(collapse)
        .getPropertyValue("--a11y-collapse-heading-hover-background-color")
        .trim(),
    ).to.equal("transparent");
  });

  it("shows no expand / collapse tooltip", () => {
    const tip = collapse.shadowRoot.querySelector("simple-tooltip");
    expect(tip.getAttribute("part")).to.equal("tooltip");
    expect(getComputedStyle(tip).display).to.equal("none");
  });
});
