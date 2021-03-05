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
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Hex Picker",
        description: "Hexcode color picker",
        icon: "image:colorize",
        color: "grey",
        groups: ["color", "picker"],
        handles: [],
        meta: {
          author: "collinkleest",
          owner: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "value",
            title: "Value",
            description: "Default hex value",
            inputMethod: "textfield",
          },
          {
            property: "disabled",
            title: "Disabled",
            description: "Disable the text field",
            inputMethod: "boolean",
          },
          {
            property: "largeDisplay",
            title: "Large Display",
            description: "Include color in large display",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "hex-picker",
          properties: {
            org: "elmsln",
            repo: "lrnwebcomponents",
          },
          content: "",
        },
      ],
    };
  }

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
        :host {
          --color-picker-width: 200px;
          --color-picker-input-margin: 5px;
          --color-picker-input-padding: 5px;
          display: flex;
          flex-direction: column;
        }

        .input-container {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          width: var(--color-picker-width);
        }

        .color-square {
          background-color: #000000ff;
          border: 1px dotted black;
          width: var(--color-picker-square-width, 15px);
          height: var(--color-picker-square-height, 15px);
          margin-left: -35px;
        }

        .slider-container {
          width: var(--color-picker-width);
        }

        fieldset {
          border: none;
          display: flex;
          align-items: center;
        }

        .text-input {
          margin-top: var(--color-picker-input-margin);
          margin-bottom: var(--color-picker-input-margin);
          padding: var(--color-picker-input-padding);
          width: calc(
            var(--color-picker-width) - 8px - var(--color-picker-input-margin)
          );
        }

        .large-display {
          width: var(--color-picker-width);
          height: var(--color-picker-lg-block-height, 100px);
          background-color: #000000ff;
          border: 1px dotted black;
          border-radius: 2px;
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
    this.value = "#000000FF";
    this._rValue = 0;
    this._gValue = 0;
    this._bValue = 0;
    this._oValue = 255;
    this.disabled = false;
  }

  render() {
    return html`
      ${this.largeDisplay ? html`<div class="large-display"></div>` : ``}
      <div class="input-container">
        <input
          class="text-input"
          maxlength="9" 
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
    if (
      !char.match(/[0-9A-Fa-f\b]/g) &&
      event.which !== 39 &&
      event.which !== 37
    ) {
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
    if (this.largeDisplay) {
      this.shadowRoot.querySelector(
        ".large-display"
      ).style.backgroundColor = hexInput;
    }
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
    if (hex.length === 4) {
      return {
        r: parseInt(hex[1] + "F", 16),
        g: parseInt(hex[2] + "F", 16),
        b: parseInt(hex[3] + "F", 16),
        o: 0,
      };
    } else if (hex.length === 5) {
      return {
        r: parseInt(hex[1] + "F", 16),
        g: parseInt(hex[2] + "F", 16),
        b: parseInt(hex[3] + "F", 16),
        o: parseInt(hex[4] + "F", 16),
      };
    } else if (hex.length === 7) {
      return {
        r: parseInt(hex[1] + hex[2], 16),
        g: parseInt(hex[3] + hex[4], 16),
        b: parseInt(hex[5] + hex[6], 16),
        o: 0,
      };
    } else if (hex.length === 9) {
      return {
        r: parseInt(hex[1] + hex[2], 16),
        g: parseInt(hex[3] + hex[4], 16),
        b: parseInt(hex[5] + hex[6], 16),
        o: parseInt(hex[7] + hex[8], 16),
      };
    } else {
      return {
        r: 0,
        g: 0,
        b: 0,
        o: 0,
      };
    }
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
    if (this.largeDisplay) {
      this.shadowRoot.querySelector(
        ".large-display"
      ).style.backgroundColor = computedHex;
    }
    this._dispatchChange(computedHex);
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: false,
        composed: false,
        detail: this,
      })
    );
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
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value" && this[propName]) {
        this.shadowRoot.querySelector(
          ".color-square"
        ).style.backgroundColor = this.value;
        this.shadowRoot.querySelector("input").value = this.value;
        if (this.largeDisplay) {
          this.shadowRoot.querySelector(
            ".large-display"
          ).style.backgroundColor = this.value;
        }
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
