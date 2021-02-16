/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `color-picker`
 * `Choose a color with a widget, or by entering hex/rgb code`
 * @demo demo/index.html
 * @element color-picker
 */
class ColorPicker extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "color-picker";
  }

  static get styles() {
    return [
      css`
        .color-square {
          background-color: #000000;
          width: var(--color-picker-square-width, 10px);
          height: var(--color-picker-square-height, 10px);
        }
      `,
    ];
  }

  render() {
    return html`
      <input></input>
      <div class="color-square"></div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      colorCode: {
        type: String,
        reflect: true,
      },
    };
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.colorCode = "#000000";
  }

  inputChanged(event) {
    // this.shadowRoot.querySelector(".color-square").style.backgroundColor = event.target.value;
    console.log(event.target.value);
    this.colorCode = event.target.value;
    console.log(this.colorCode);
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    this.shadowRoot
      .querySelector("input")
      .addEventListener("input", this.inputChanged);
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(propName);
      if (propName === "colorCode" && this[propName]) {
        console.log(this.shadowRoot.querySelector(".color-square"));
      }
    });
  }
}
customElements.define(ColorPicker.tag, ColorPicker);
export { ColorPicker };
