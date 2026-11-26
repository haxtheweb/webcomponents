/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleFieldsBaseStyles } from "./simple-fields-ui.js";
import { wipeSlot } from "@haxtheweb/utils/utils.js";
import { sanitizeHTMLForImport } from "@haxtheweb/utils/lib/sanitize.js";

class SimpleFieldsHtmlBlock extends LitElement {
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
  }
  static get tag() {
    return "simple-fields-html-block";
  }
  static get styles() {
    return [
      ...SimpleFieldsBaseStyles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  render() {
    return html`<div class="html"><slot></slot></div>`;
  }
  static get properties() {
    return {
      value: {
        type: String,
      },
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") this._valueChanged(this.value);
    });
  }
  /**
   * render the markup requested
   */
  _valueChanged(newValue) {
    // clear self
    wipeSlot(this);
    // security (JS-XSS): parsed in an inert document with scripts
    // encapsulated and neutralized, event handlers and unsafe URLs removed
    let frag = sanitizeHTMLForImport(newValue);
    // self apend to flow into slot and show up
    this.appendChild(frag);
  }
}

globalThis.customElements.define(
  SimpleFieldsHtmlBlock.tag,
  SimpleFieldsHtmlBlock,
);
export { SimpleFieldsHtmlBlock };
