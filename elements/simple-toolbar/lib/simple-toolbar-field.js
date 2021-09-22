/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
/**
 * `simple-toolbar-field`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarField extends SimpleToolbarButtonBehaviors(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-toolbar-field";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        *[part="button"] {
          height: auto;
          width: auto;
          align-self: stretch;
          flex: 1 1 auto;
        }
        *[part="field"] {
          width: 0;
          height: 0;
          flex: 0 0 0px;
          display: flex;
          align-items: center;
          overflow: visible;
        }
        :host([icon-position="top"]) *[part="field"],
        :host([icon-position="bottom"]) *[part="field"] {
          flex-direction: column;
        }
        :host([align-horizontal="left"]) *[part="field"] {
          align-items: flex-start;
        }
        :host([align-horizontal="right"]) *[part="field"] {
          align-items: flex-end;
        }
        ::slotted(*) {
          flex: 0 0 auto;
          width: 0px;
          opacity: 0;
          padding: 0;
          transition: all 0.5s ease-in-out, opacity 0.25s ease-in-out;
        }
        ::slotted(*:focus),
        :host(:hover) ::slotted(*) {
          width: 100px;
          opacity: 1;
          padding: unset;
        }
      `,
    ];
  }

  constructor() {
    super();
  }
  static get properties() {
    return {
      ...super.properties,
    };
  }
  /**
   * template for button, based on whether or not the button toggles
   *
   * @readonly
   */
  get buttonTemplate() {
    return html` <div
        id="button"
        class="simple-toolbar-button"
        ?disabled="${this.disabled}"
        tabindex="0"
        part="button"
      >
        ${this.buttonInnerTemplate}
        <span part="field">
          <slot></slot>
        </span>
      </div>
      ${this.tooltipTemplate}`;
  }
}
window.customElements.define(SimpleToolbarField.tag, SimpleToolbarField);
export { SimpleToolbarField };
