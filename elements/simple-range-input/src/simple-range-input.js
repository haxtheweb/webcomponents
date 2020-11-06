/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `simple-range-input`
 * `simple styling on a range input`
 *
 * @demo demo/index.html
 * @element simple-range-input
 */
class SimpleRangeInput extends SimpleColors {
  // Template return function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --simple-range-input-bg: var(
            --simple-colors-default-theme-accent-2,
            black
          );
          --simple-range-input-color: var(
            --simple-colors-default-theme-accent-8,
            grey
          );
          --simple-range-input-track-height: 10px;
        }
        :host([disabled]) {
          pointer-events: none;
        }
        input[type="range"] {
          -webkit-appearance: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: var(--simple-range-input-track-height);
          cursor: pointer;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          background: var(--simple-range-input-bg);
          border-radius: 2px;
          border: 0px solid #000101;
        }
        input[type="range"]::-webkit-slider-thumb {
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          border: 0px solid #000000;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-range-input-color);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -3.6px;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: var(--simple-range-input-bg);
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: var(--simple-range-input-track-height);
          cursor: pointer;
          animate: 0.2s;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          background: var(--simple-range-input-bg);
          border-radius: 2px;
          border: 0px solid #000101;
        }
        input[type="range"]::-moz-range-thumb {
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          border: 0px solid #000000;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-range-input-color);
          cursor: pointer;
        }
        input[type="range"]::-ms-track {
          width: 100%;
          height: var(--simple-range-input-track-height);
          cursor: pointer;
          animate: 0.2s;
          background: transparent;
          border-color: transparent;
          border-width: 20px 0;
          color: transparent;
        }
        input[type="range"]::-ms-fill-lower {
          background: var(--simple-range-input-bg);
          border: 0px solid #000101;
          border-radius: 2px;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
        }
        input[type="range"]::-ms-fill-upper {
          background: var(--simple-range-input-bg);
          border: 0px solid #000101;
          border-radius: 2px;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
        }
        input[type="range"]::-ms-thumb {
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          border: 0px solid #000000;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--simple-range-input-color);
          cursor: pointer;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: var(--simple-range-input-bg);
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: var(--simple-range-input-bg);
        }
      `,
    ];
  }
  render() {
    return html`<input
      @input="${this._inputChanged}"
      @changed="${this._valueChanged}"
      ?disabled="${this.disabled}"
      type="range"
      .min="${this.min}"
      .step="${this.step}"
      .max="${this.max}"
      .value="${this.value}"
    /> `;
  }
  _inputChanged(e) {
    this.immediateValue = e.target.value;
  }
  _valueChanged(e) {
    this.value = e.target.value;
  }
  firstUpdated() {
    super.firstUpdated();
    // helps ensure a flood of initial stampping input does not occur
    // this is because of a vanilla element + event monitoring to set initials
    setTimeout(() => {
      this.__ready = true;
    }, 0);
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "immediateValue" && this.__ready) {
        if (this.dragging) {
          this.dispatchEvent(
            new CustomEvent("immediate-value-changed", {
              detail: {
                value: this.immediateValue,
              },
            })
          );
        } else {
          this.value = this.immediateValue;
        }
      }
      if (propName === "value" && this.__ready) {
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this.value,
            },
          })
        );
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      immediateValue: { type: Number, attribute: "immediate-value" },
      value: { type: Number, reflect: true },
      min: { type: Number },
      step: { type: Number },
      max: { type: Number },
      disabled: { type: Boolean, reflect: true },
    };
  }
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-range-input";
  }
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.dragging = false;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 0;
    this.immediateValue = 0;
    this.disabled = false;
    this.addEventListener("mousedown", () => {
      this.dragging = true;
    });
    this.addEventListener("mouseup", () => {
      this.dragging = false;
      this.value = this.immediateValue;
    });
  }
}
customElements.define(SimpleRangeInput.tag, SimpleRangeInput);
export { SimpleRangeInput };
