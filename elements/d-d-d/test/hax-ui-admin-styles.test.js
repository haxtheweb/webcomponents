import { fixture, expect, html } from "@open-wc/testing";
import { LitElement, css } from "lit";
import { HaxIconsetManifest } from "@haxtheweb/hax-iconset/lib/hax-iconset-manifest.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
  HaxUiAdminControls,
  HaxUiAdminSimpleFields,
  HaxUiAdminScheme,
  HaxUiAdminStyles,
  HaxUiAdminProposed,
  HaxUiAdminIcons,
} from "../lib/HaxUiAdminStyles.js";

class HaxUiAdminStylesProbe extends LitElement {
  static get styles() {
    return [
      ...HaxUiAdminStyles,
      css`
        :host {
          display: block;
          color-scheme: light;
        }
        .sunken {
          background-color: ${HaxUiAdminProposed.sunken};
        }
      `,
    ];
  }
  render() {
    return html`
      <button class="hax-ui-btn" id="secondary">Cancel</button>
      <button class="hax-ui-btn primary" id="primary">Save</button>
      <button class="hax-ui-icon-btn" id="icon" aria-label="Close"></button>
      <input class="hax-ui-input" id="field" aria-label="Title" />
      <input class="hax-ui-input compact" id="compact" aria-label="Search" />
      <button
        class="hax-ui-switch"
        id="switch-on"
        role="switch"
        aria-checked="true"
        aria-label="Blog"
      ></button>
      <div class="sunken" id="sunken"></div>
    `;
  }
}
globalThis.customElements.define(
  "hax-ui-admin-styles-probe",
  HaxUiAdminStylesProbe,
);

describe("HaxUiAdminStyles: the one HAX UI admin layer", () => {
  let el;
  const box = (id) => el.shadowRoot.querySelector(`#${id}`);
  const style = (id) => globalThis.getComputedStyle(box(id));

  beforeEach(async () => {
    el = await fixture(
      html`<hax-ui-admin-styles-probe></hax-ui-admin-styles-probe>`,
    );
  });

  it("exports every style array, and HaxUiAdminStyles holds them all", () => {
    [
      HaxUiAdminTokens,
      HaxUiAdminPrimitives,
      HaxUiAdminControls,
      HaxUiAdminSimpleFields,
      HaxUiAdminScheme,
    ].forEach((part) => {
      expect(Array.isArray(part)).to.equal(true);
      part.forEach((sheet) => expect(HaxUiAdminStyles).to.include(sheet));
    });
  });

  it("buttons and toolbar controls are 32px; field inputs are 40px", () => {
    expect(style("secondary").height).to.equal("32px");
    expect(style("primary").height).to.equal("32px");
    expect(style("icon").width).to.equal("32px");
    expect(style("icon").height).to.equal("32px");
    expect(style("field").height).to.equal("40px");
    expect(style("compact").height).to.equal("32px");
  });

  it("primary and sunken come from the proposed values, written once", () => {
    // nittanyNavy and limestoneMaxLight, the light values
    expect(style("primary").backgroundColor).to.equal("rgb(0, 30, 68)");
    expect(style("sunken").backgroundColor).to.equal("rgb(242, 242, 244)");
  });

  it("a checked switch uses the accent", () => {
    // --hax-ui-accent-strong in light is DDD link #005fa9
    expect(style("switch-on").backgroundColor).to.equal("rgb(0, 95, 169)");
  });

  it("names every admin icon from the hax:admin-* family, and each exists", () => {
    const hax = HaxIconsetManifest.find((set) => set.name === "hax");
    expect(hax).to.exist;
    Object.values(HaxUiAdminIcons).forEach((name) => {
      expect(name.indexOf("hax:admin-")).to.equal(0);
      expect(hax.icons).to.include(name.replace("hax:", ""));
    });
  });

  it("freezes the shared maps so no element can change them for others", () => {
    expect(Object.isFrozen(HaxUiAdminIcons)).to.equal(true);
    expect(Object.isFrozen(HaxUiAdminProposed)).to.equal(true);
  });
});
