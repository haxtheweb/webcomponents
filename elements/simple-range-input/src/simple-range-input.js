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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: var(--simple-range-input-track-height, 10px);
          height: var(--simple-range-input-pin-height, 20px);
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
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          border: var(--simple-range-input-border, 0px solid #000000);
        }
        input[type="range"]::-webkit-slider-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(--simple-colors-default-theme-accent-8, grey)
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) -
                    var(--simple-range-input-pin-height, 20px)
                )
            )
            0;
          -webkit-appearance: none;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          animate: 0.2s;
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          border: var(--simple-range-input-border, 0px solid #000000);
        }
        input[type="range"]::-moz-range-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(--simple-colors-default-theme-accent-8, grey)
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) -
                    var(--simple-range-input-pin-height, 20px)
                )
            )
            0;
        }
        input[type="range"]::-ms-track {
          width: 100%;
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          animate: 0.2s;
          background: transparent;
          border-color: transparent;
          border-width: var(--simple-range-input-pin-height, 20px) 0;
          color: transparent;
        }
        input[type="range"]::-ms-fill-lower {
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
        }
        input[type="range"]::-ms-fill-upper {
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
        }
        input[type="range"]::-ms-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(--simple-colors-default-theme-accent-8, grey)
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) -
                    var(--simple-range-input-pin-height, 20px)
                )
            )
            0;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: var(
            --simple-range-input-bg,
            var(--simple-colors-default-theme-accent-2, black)
          );
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
