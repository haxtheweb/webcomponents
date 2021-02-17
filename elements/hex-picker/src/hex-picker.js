/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `hex-picker`
 * `Choose a color by hex or rgba code`
 * @demo demo/index.html
 * @element hex-picker
 */
class HexPicker extends LitElement {
  static get properties() {
    return {
      ...super.properties,
      hexCode: {
        type: String,
        reflect: true,
        attribute: "hex-code",
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
        }

        .input-container {
          display: inline-flex;
          align-items: center;
        }

        .color-square {
          background-color: #000000;
          width: var(--color-picker-square-width, 15px);
          height: var(--color-picker-square-height, 15px);
        }

        fieldset {
          border: none;
          display: flex;
          align-items: center;
        }

        input {
          padding: 5px;
          margin: 5px;
        }
      `,
    ];
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "hex-picker";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.hexCode = "#000000";
    this._rValue = 0;
    this._gValue = 0;
    this._bValue = 0;
  }

  render() {
    return html`
      <div class="input-container">
        <input @input="${this._inputChanged}"></input>
        <div class="color-square"></div>
      </div>
      <div class="slider-container">
        ${this.renderFieldSet("R")}
        ${this.renderFieldSet("G")}
        ${this.renderFieldSet("B")}
      </div>
    `;
  }

  _padHex(n) {
    return n.length < 2 ? "0" + n : n;
  }

  _computeHex() {
    let rHex = this._rValue.toString(16),
      gHex = this._gValue.toString(16),
      bHex = this._bValue.toString(16),
      hexValue =
        "#" + this._padHex(rHex) + this._padHex(gHex) + this._padHex(bHex);
    return hexValue;
  }

  _inputChanged(event) {
    let hexInput = event.target.value;
    this.shadowRoot.querySelector(
      ".color-square"
    ).style.backgroundColor = hexInput;
    this.hexCode = hexInput;
    let rgb = this._hexToRgb(hexInput);
    if (rgb !== null) {
      this._updateSliders(rgb);
    }
  }

  _updateSliders(rgb) {
    this.shadowRoot.querySelector("#R").value = rgb.r;
    this.shadowRoot.querySelector("#R_out").value = rgb.r;
    this.shadowRoot.querySelector("#G").value = rgb.g;
    this.shadowRoot.querySelector("#G_out").value = rgb.g;
    this.shadowRoot.querySelector("#B").value = rgb.b;
    this.shadowRoot.querySelector("#B_out").value = rgb.b;
  }

  _hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  _fieldSetChange(event) {
    let colorValueLabel = this.shadowRoot.querySelector(
      `#${event.target.id}_out`
    );
    let colorSquare = this.shadowRoot.querySelector(".color-square");
    let inputLabel = this.shadowRoot.querySelector("input");
    colorValueLabel.value = event.target.value;

    if (event.target.id === "R") {
      this._rValue = parseInt(event.target.value, 10);
    } else if (event.target.id === "G") {
      this._gValue = parseInt(event.target.value, 10);
    } else if (event.target.id === "B") {
      this._bValue = parseInt(event.target.value, 10);
    }

    let computedHex = this._computeHex();
    colorSquare.style.backgroundColor = computedHex;
    inputLabel.value = computedHex;
  }

  renderFieldSet(value) {
    return html`
      <fieldset>
        <label for="${value}">${value}</label>
        <input
          @input=${this._fieldSetChange}
          type="range"
          min="0"
          max="255"
          id="${value}"
          step="1"
          value="0"
        />
        <output for="${value}" id="${value}_out">0</output>
      </fieldset>
    `;
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "hexCode" && this[propName]) {
        this.shadowRoot.querySelector(
          ".color-square"
        ).style.backgroundColor = this.hexCode;
        this.shadowRoot.querySelector("input").value = this.hexCode;
        let rgb = this._hexToRgb(this.hexCode);
        if (rgb !== null) {
          this._updateSliders(rgb);
        }
      }
    });
  }
}
customElements.define(HexPicker.tag, HexPicker);
export { HexPicker };
