import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { LitElement, css } from "lit";
import { sendMouse, resetMouse } from "@web/test-runner-commands";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
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
      <button class="hax-ui-btn primary" id="save-off" aria-disabled="true">
        Save
      </button>
      <button
        class="hax-ui-switch"
        id="switch-off"
        role="switch"
        aria-checked="false"
        aria-label="Comments"
      ></button>
      <simple-fields-field
        class="hax-ui-simple-field"
        id="sf"
        label="Title"
        description="Shown in the browser tab"
      ></simple-fields-field>
      <simple-fields class="hax-ui-simple-field compact" id="sf-group">
        <simple-fields-field id="sf-child" label="Filter"></simple-fields-field>
      </simple-fields>
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

  it("an aria-disabled primary button stays muted when hovered", async () => {
    const r = box("save-off").getBoundingClientRect();
    await sendMouse({
      type: "move",
      position: [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)],
    });
    expect(box("save-off").matches(":hover"), "hovered").to.equal(true);
    // let the 150ms background / border transition finish
    await aTimeout(300);
    // surface white, not the nittanyNavy primary fill
    expect(style("save-off").backgroundColor).to.equal("rgb(255, 255, 255)");
    expect(style("save-off").borderColor).to.equal("rgb(162, 170, 173)");
    await resetMouse();
  });

  it("an off switch has a 3:1 track, and the thumb is the panel color", () => {
    // --hax-ui-text-muted (slateGray #314d64), 8.8:1 on white
    expect(style("switch-off").backgroundColor).to.equal("rgb(49, 77, 100)");
    const thumb = globalThis.getComputedStyle(box("switch-off"), "::after");
    expect(thumb.backgroundColor).to.equal("rgb(255, 255, 255)");
  });

  it("a simple-fields field stacks its description under the control", () => {
    expect(style("sf").flexDirection).to.equal("column");
    expect(style("sf").minHeight).to.equal("40px");
  });

  it("on a simple-fields container, only the fields are boxed and .compact reaches them", () => {
    const group = box("sf-group");
    const child = group.querySelector("#sf-child") || box("sf-child");
    expect(globalThis.getComputedStyle(group).borderTopStyle).to.equal("none");
    expect(globalThis.getComputedStyle(child).minHeight).to.equal("32px");
  });

  it("freezes the shared maps so no element can change them for others", () => {
    expect(Object.isFrozen(HaxUiAdminIcons)).to.equal(true);
    expect(Object.isFrozen(HaxUiAdminProposed)).to.equal(true);
  });
});
