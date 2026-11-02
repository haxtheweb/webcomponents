import { LitElement, html, css } from "lit";
import { SimpleFieldsBaseStyles } from "./simple-fields-ui.js";
import {
  encapScript,
  neutralizeStrayScripts,
  wipeSlot,
} from "@haxtheweb/utils/utils.js";

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
    // sanity check to ditch scripts
    let html = encapScript(newValue);
    let frag = globalThis.document.createRange().createContextualFragment(html);
    // encapScript is a string pass; drop any script it let through before the
    // fragment is connected (scripts from createContextualFragment would run)
    neutralizeStrayScripts(frag);
    // self apend to flow into slot and show up
    this.appendChild(frag);
  }
}

globalThis.customElements.define(
  SimpleFieldsHtmlBlock.tag,
  SimpleFieldsHtmlBlock,
);
export { SimpleFieldsHtmlBlock };
