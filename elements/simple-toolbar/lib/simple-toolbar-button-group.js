/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RadioBehaviors } from "@haxtheweb/radio-behaviors/radio-behaviors.js";

/**
 * `simple-toolbar-button-group`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarButtonGroup extends RadioBehaviors(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-toolbar-button-group";
  }

  static get properties() {
    return {
      ...super.properties,
      required: {
        type: Boolean,
        attribute: "required",
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.setAttribute("role", "radiogroup");
    this.classList.add("group");
    this.addEventListener("button-toggled", this._handleToggle);
  }
  connectedCallback() {
    super.connectedCallback();
    this.querySelectorAll(`${this.__query}`).forEach((i) => {
      if (!i.id) i.id = this._generateUUID();
    });
    this.selectItem(this.selection);
    this._updateItemData();
  }
  render() {
    return html`<slot></slot>`;
  }
  /**
   * allows no item to be selected
   * @readonly
   */
  get __allowNull() {
    return !this.required;
  }
  /**
   * query selector for slotted children, can be overridden
   * @readonly
   */
  get __query() {
    return "*[radio]:not([hidden])";
  }
  get __selected() {
    return "toggled";
  }
  _handleToggle(e) {
    this.selectItem(e.detail.isToggled ? e.detail.id : undefined);
  }
}
customElements.define(SimpleToolbarButtonGroup.tag, SimpleToolbarButtonGroup);
export { SimpleToolbarButtonGroup };
