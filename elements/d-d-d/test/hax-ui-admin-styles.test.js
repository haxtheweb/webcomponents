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
          background-color: var(--hax-ui-sunken);
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
      <label class="hax-ui-tool-field" id="tool"
        ><span>Sort by</span
        ><select>
          <option>Title</option>
        </select></label
      >
      <div class="hax-ui-seg fill" id="seg" style="width: 300px">
        <button aria-pressed="true">Table</button
        ><button aria-pressed="false">Cards, longer</button
        ><button aria-pressed="false">List</button>
      </div>
      <button class="hax-ui-chip" id="chip-on" aria-pressed="true">
        Errors <span class="n">3</span>
      </button>
      <button class="hax-ui-chip" id="chip-off" aria-pressed="false">
        Warnings
      </button>
      <div class="hax-ui-tokens" id="tokens">
        <span class="hax-ui-token"
          >jpg<button id="token-x" aria-label="Remove jpg"></button
        ></span>
        <input aria-label="Add a format" />
      </div>
      <span class="hax-ui-input-group" id="group"
        ><input type="number" aria-label="Max upload" value="10" /><span
          class="unit"
          >MB</span
        ></span
      >
      <p class="hax-ui-message" id="note-box">Saving…</p>
      <p class="hax-ui-message" data-tone="danger" id="danger-box">Failed</p>
      <p class="hax-ui-note" id="note">Nothing selected</p>
      <span class="hax-ui-pill" id="pill">Draft</span>
      <span class="hax-ui-pill" data-tone="success" id="pill-success">OK</span>
      <span class="hax-ui-pill" data-tone="ok" id="pill-ok">OK</span>
      <span class="hax-ui-pill" data-tone="warning" id="pill-warning"
        >Check</span
      >
      <span class="hax-ui-pill" data-tone="danger" id="pill-danger"
        >Failed</span
      >
      <span class="hax-ui-pill" data-tone="error" id="pill-error">Failed</span>
      <span class="hax-ui-pill" data-tone="info" id="pill-info">Note</span>
      <span class="hax-ui-pill" data-tone="muted" id="pill-muted">Older</span>
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

  it("primary and sunken come from the promoted tokens", () => {
    // nittanyNavy and limestoneMaxLight, the light values
    expect(style("primary").backgroundColor).to.equal("rgb(0, 30, 68)");
    expect(style("sunken").backgroundColor).to.equal("rgb(242, 242, 244)");
  });

  it("a checked switch uses the accent", () => {
    // --hax-ui-accent-strong in light is DDD link #005fa9
    expect(style("switch-on").backgroundColor).to.equal("rgb(0, 95, 169)");
  });

  it("shared toolbar field, tokens and input group take the HAX UI sizes", () => {
    expect(style("tool").height).to.equal("32px");
    expect(style("tool").borderTopStyle).to.equal("solid");
    expect(style("group").height).to.equal("40px");
    expect(style("tokens").minHeight).to.equal("40px");
    expect(style("token-x").width).to.equal("20px");
    expect(
      globalThis.getComputedStyle(box("group").querySelector(".unit"))
        .borderLeftStyle,
    ).to.equal("solid");
  });

  it("a filled segmented control shares its width equally", () => {
    const widths = [...box("seg").querySelectorAll("button")].map((b) =>
      Math.round(b.getBoundingClientRect().width),
    );
    expect(Math.max(...widths) - Math.min(...widths)).to.be.at.most(1);
  });

  it("a pressed toggle chip takes the accent; an unpressed one is solid", () => {
    expect(style("chip-on").borderTopColor).to.equal("rgb(0, 95, 169)");
    expect(style("chip-off").borderTopStyle).to.equal("solid");
    expect(style("chip-on").fontWeight).to.equal("700");
  });

  it("a message without a tone is a muted box; a toned one keeps its tone", () => {
    expect(style("note-box").backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
    expect(style("note-box").color).to.equal(style("note").color);
    expect(style("danger-box").color).to.not.equal(style("note").color);
    expect(style("note").backgroundColor).to.equal("rgba(0, 0, 0, 0)");
  });

  it("status pills have a warning, info and muted tone, and ok/error aliases", () => {
    const base = style("pill");
    ["pill-success", "pill-warning", "pill-danger", "pill-info"].forEach(
      (id) => {
        expect(style(id).color, id).to.not.equal(base.color);
      },
    );
    expect(style("pill-warning").color).to.not.equal(
      style("pill-danger").color,
    );
    expect(style("pill-warning").backgroundColor).to.not.equal(
      base.backgroundColor,
    );
    expect(style("pill-ok").color).to.equal(style("pill-success").color);
    expect(style("pill-error").color).to.equal(style("pill-danger").color);
    expect(style("pill-muted").backgroundColor).to.equal("rgba(0, 0, 0, 0)");
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

  it("freezes the icon map so no element can change it for others", () => {
    expect(Object.isFrozen(HaxUiAdminIcons)).to.equal(true);
    // section icons have keys too
    expect(HaxUiAdminIcons.structure).to.equal("hax:admin-structure");
    expect(HaxUiAdminIcons.importExport).to.equal("hax:admin-import-export");
  });
});
