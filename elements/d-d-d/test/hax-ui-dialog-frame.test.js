import { fixture, expect, html } from "@open-wc/testing";
import { LitElement, html as litHtml } from "lit";
import {
  HaxUiDialogTitlebar,
  HaxUiDialogSurface,
  HaxUiDialogFrame,
  HaxUiDialogConfirm,
  HaxUiDialogTitlebarStyles,
  haxUiDialogVars,
} from "../lib/HaxUiDialogFrame.js";
import * as entry from "../lib/HaxUiAdminStyles.js";

class HaxUiDialogFrameProbe extends LitElement {
  static get styles() {
    return [haxUiDialogVars(HaxUiDialogFrame), ...HaxUiDialogTitlebarStyles];
  }
  render() {
    return litHtml`<div class="hax-ui-dialog-titlebar">
      <h2 class="hax-ui-dialog-title">Title</h2>
      <button class="hax-ui-dialog-close" aria-label="Close">x</button>
    </div>`;
  }
}
globalThis.customElements.define(
  "hax-ui-dialog-frame-probe",
  HaxUiDialogFrameProbe,
);

describe("HAX UI dialog frame", () => {
  it("is the titlebar and the surface together", () => {
    expect({ ...HaxUiDialogFrame }).to.deep.equal({
      ...HaxUiDialogTitlebar,
      ...HaxUiDialogSurface,
    });
  });

  it("puts the HAX UI token first with DDD behind it", () => {
    expect(HaxUiDialogFrame["--simple-modal-titlebar-background"]).to.match(
      /^var\(--hax-ui-titlebar, light-dark\(/,
    );
    expect(HaxUiDialogFrame["--simple-modal-titlebar-height"]).to.equal(
      "var(--hax-ui-titlebar-height, 48px)",
    );
    expect(HaxUiDialogFrame["--simple-modal-titlebar-font-size"]).to.equal(
      "16px",
    );
  });

  it("draws the confirm card without the dark bar", () => {
    expect(HaxUiDialogConfirm["--simple-modal-titlebar-height"]).to.equal(
      "auto",
    );
    expect(HaxUiDialogConfirm["--simple-modal-width"]).to.equal("460px");
  });

  it("is re-exported from the HAX UI entry point", () => {
    expect(entry.HaxUiDialogFrame).to.equal(HaxUiDialogFrame);
    expect(entry.HaxUiDialogConfirm).to.equal(HaxUiDialogConfirm);
    expect(entry.haxUiDialogVars).to.equal(haxUiDialogVars);
  });

  it("hands the frame to a simple-modal-template as custom properties", async () => {
    const el = await fixture(
      html`<hax-ui-dialog-frame-probe></hax-ui-dialog-frame-probe>`,
    );
    const cs = getComputedStyle(el);
    expect(
      cs.getPropertyValue("--simple-modal-titlebar-font-size").trim(),
    ).to.equal("16px");
    // computed custom properties come back with var() resolved: no
    // --hax-ui-titlebar-height here, so the frame's 48px fallback
    expect(
      cs.getPropertyValue("--simple-modal-titlebar-height").trim(),
    ).to.equal("48px");
  });

  it("draws a 48px titlebar and a 32px close for a web-dialog", async () => {
    const el = await fixture(
      html`<hax-ui-dialog-frame-probe></hax-ui-dialog-frame-probe>`,
    );
    const bar = el.shadowRoot.querySelector(".hax-ui-dialog-titlebar");
    const title = el.shadowRoot.querySelector(".hax-ui-dialog-title");
    const close = el.shadowRoot.querySelector(".hax-ui-dialog-close");
    expect(getComputedStyle(bar).height).to.equal("48px");
    expect(getComputedStyle(title).fontSize).to.equal("16px");
    expect(getComputedStyle(close).width).to.equal("32px");
    expect(getComputedStyle(close).height).to.equal("32px");
  });
});
