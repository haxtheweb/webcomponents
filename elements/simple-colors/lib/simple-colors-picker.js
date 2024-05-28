/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleColorsSuper } from "../simple-colors.js";
import { SimplePickerBehaviors } from "@haxtheweb/simple-picker/simple-picker.js";

/**
 * `simple-colors-picker`
 * a select element for changing `simple-colors` attributes in demos
 *
### Styling
See demo of "all of the colors" (`demo/colors.html`) for styling.
* 
 * @extends SimpleColors
 * @demo ./demo/picker.html demo
 * @see "../simple-colors.js"
 * @see "./demo/simple-colors-picker-demo.js"
 * @element simple-colors-picker
 */
class SimpleColorsPicker extends SimplePickerBehaviors(
  SimpleColorsSuper(LitElement),
) {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
        :host([hidden]) {
          display: none;
        }
        .row {
          width: 100%;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.allowNull = true;
    this.shades = false;
    this.options = this._getOptions(this.colors, this.shades, this.dark);
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "colors")
        this.options = this._getOptions(this.colors, this.shades, this.dark);
      if (propName === "shades") {
        this.options = this._getOptions(this.colors, this.shades, this.dark);
        this.hideOptionLabels = this.shades;
      }
      if (propName === "dark")
        this.options = this._getOptions(this.colors, this.shades, this.dark);
    });
    if (this.__ready !== undefined) this._fireChangeEvent();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Show all shades instead of just main accent-colors
       */
      shades: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-colors-picker";
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__ready = true;
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the options object to convert
   */
  _getOptions(colors, shades, dark) {
    let options = [],
      theme = dark !== false ? "dark" : "default";
    if (shades === false) {
      options = Object.keys(this.colors).map((key) => {
        return [
          {
            alt: key,
            value: key,
          },
        ];
      });
      options.unshift([
        {
          alt: "none",
          value: null,
        },
      ]);
    } else {
      let colorNames = Object.keys(colors);
      for (let i = 0; i < colors[colorNames[0]].length; i++) {
        let shade = Object.keys(colors).map((key) => {
          let name = key + "-" + (i + 1),
            cssvar = "--simple-colors-" + theme + "-theme-" + name;
          return {
            alt: name,
            style: "background-color: var(" + cssvar + ")",
            value: cssvar,
          };
        });
        options.push(shade);
      }
    }
    return options;
  }

  /**
   * Fires with any property change.
   *
   * @event change
   */
  _fireChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this }),
    );
  }
}

export { SimpleColorsPicker };

customElements.define(SimpleColorsPicker.tag, SimpleColorsPicker);
