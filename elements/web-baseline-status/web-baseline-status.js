/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
// upstream widget (web-platform-dx/baseline-status). It registers
// <baseline-status>; this element wraps it so it can be placed and configured
// in HAX. Import the ESM entry (not the .min.js bundle) so lit is not duplicated.
import "baseline-status";

/**
 * `web-baseline-status`
 * Displays the Baseline status (limited / newly available / widely available)
 * of a web platform feature, using the baseline-status widget from
 * web-platform-dx. Feature data is fetched by the widget at runtime from
 * https://api.webstatus.dev.
 *
 * @demo demo/index.html
 * @element web-baseline-status
 */
export class WebBaselineStatus extends DDD {
  static get tag() {
    return "web-baseline-status";
  }

  constructor() {
    super();
    this.featureId = "";
    this._haxstate = false;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      /**
       * ID of the web-features feature, for example anchor-positioning.
       * Free text; IDs are listed at https://webstatus.dev.
       */
      featureId: { type: String, reflect: true, attribute: "feature-id" },
      _haxstate: { type: Boolean, attribute: false },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-2) 0;
        }
        :host([hidden]) {
          display: none;
        }
        baseline-status {
          font-family: var(--ddd-font-navigation);
          max-width: 100%;
        }
        baseline-status.is-editing {
          pointer-events: none;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`<baseline-status
      class="${this._haxstate ? "is-editing" : ""}"
      .featureId="${this.featureId}"
    ></baseline-status>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(el, value) {
    if (value) {
      this._haxstate = value;
    }
    return el;
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
  }
}

globalThis.customElements.define(WebBaselineStatus.tag, WebBaselineStatus);
