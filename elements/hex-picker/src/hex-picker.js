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
      value: {
        type: String,
        reflect: true,
        attribute: "value",
      },
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      largeDisplay: {
        type: Boolean,
        reflect: true,
        attribute: "large-display",
      },
    };
  }

  static get styles() {
    return [
      css`
        :host([disabled]) {
          display: none;
        }

        :host {
          display: flex;
          flex-direction: column;
        }

        .input-container {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
        }

        .color-square {
          background-color: #00000000;
          border: 1px dotted black;
          width: var(--color-picker-square-width, 15px);
          height: var(--color-picker-square-height, 15px);
          margin-left: -35px;
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
    this.value = "#00000000";
    this._rValue = 0;
    this._gValue = 0;
    this._bValue = 0;
    this._oValue = 0;
    this.disabled = false;
  }

  render() {
    return html`
      <div class="input-container">
        <input 
          @input="${this._inputChanged}"
          @keydown="${this._validateInput}" 
          .disabled=${this.disabled}>
        </input>
        <div class="color-square"></div>
      </div>
      <div class="slider-container">
        ${this.renderFieldSet("R")}
        ${this.renderFieldSet("G")}
        ${this.renderFieldSet("B")}
        ${this.renderFieldSet("O")}
      </div>
    `;
  }

  _validateInput(event) {
    let char = String.fromCharCode(event.which);
    if (!char.match(/[0-9A-Fa-f\b]/g)) {
      event.preventDefault();
    }
  }

  _padHex(n) {
    return n.length < 2 ? "0" + n : n;
  }

  _computeHex() {
    let rHex = this._rValue.toString(16),
      gHex = this._gValue.toString(16),
      bHex = this._bValue.toString(16),
      oHex = this._oValue.toString(16),
      hexValue =
        "#" +
        this._padHex(rHex) +
        this._padHex(gHex) +
        this._padHex(bHex) +
        this._padHex(oHex);
    return hexValue;
  }

  _inputChanged(event) {
    let hexInput = event.target.value;
    if (!hexInput.startsWith("#")) {
      hexInput = "#" + hexInput;
    }
    this.shadowRoot.querySelector(
      ".color-square"
    ).style.backgroundColor = hexInput;
    this.value = hexInput;
    this._dispatchChange(hexInput);
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
    this.shadowRoot.querySelector("#O").value = rgb.o;
    this.shadowRoot.querySelector("#O_out").value = rgb.o;
  }

  _hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hex
    );
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          o: parseInt(result[4], 16),
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
    } else if (event.target.id === "O") {
      this._oValue = parseInt(event.target.value, 10);
    }

    let computedHex = this._computeHex();
    colorSquare.style.backgroundColor = computedHex;
    inputLabel.value = computedHex;
    this._dispatchChange(computedHex);
  }

  _dispatchChange(value) {
    let customEvent = new CustomEvent("value-changed", {
      bubbles: true,
      cancelable: false,
      composed: false,
      detail: value,
    });
    this.dispatchEvent(customEvent);
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
      if (propName === "value" && this[propName]) {
        this.shadowRoot.querySelector(
          ".color-square"
        ).style.backgroundColor = this.value;
        this.shadowRoot.querySelector("input").value = this.value;
        let rgb = this._hexToRgb(this.value);
        if (rgb !== null) {
          this._updateSliders(rgb);
        }
      }
    });
  }
}
customElements.define(HexPicker.tag, HexPicker);
export { HexPicker };
