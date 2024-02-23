/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "../../simple-colors.js";

/**
 * `simple-colors-swatch-info`
 * `A tool to document of all the colors in simple-colors`
 *
### Styling
See demo of "all of the colors" (`demo/colors.html`) for styling.
 * 
 * @extends SimpleColors

 * @demo ./demo/colors.html demo
 * @see "../../simple-colors.js"
 * @see "../simple-colors-picker.js"
 */
class simpleColorsSwatchInfo extends SimpleColors {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: 15px 0;
        }
        :host([hidden]) {
          display: none;
        }
        :host table {
          width: 100%;
          border: 1px solid black;
          border-radius: 3px;
          border-collapse: collapse;
          margin: 0 0 15px;
        }
        :host table caption {
          font-weight: bold;
          background-color: #222;
          color: white;
        }
        :host table th {
          background-color: #e0e0e0;
        }
        :host table caption,
        :host table th,
        :host table td {
          padding: 5px;
          border: 1px solid black;
          text-align: left;
          line-height: 160%;
        }
        :host table td span {
          padding: 5px;
          white-space: nowrap;
          margin: 5px 0;
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <table
        summary="Each row represents a CSS variable or class with a description of what it does without the dark attribute and with the attribute."
      >
        <caption>
          CSS Variables and Classes for ${this.swatchName}
        </caption>
        <thead>
          <tr>
            <th scope="col">Variable Name</th>
            <th scope="col">Color</th>
            <th scope="col">With <tt>dark</tt> Attribute</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              --simple-colors-default-theme-${this.swatchName}
            </th>
            <td style="${this._getBg(this.swatchId)}">default color</td>
            <td style="${this._getInverseBg(this.swatchId)}">inverted color</td>
          </tr>
          <tr>
            <th scope="row">--simple-colors-fixed-theme-${this.swatchName}</th>
            <td style="${this._getBg(this.swatchId)}">default color</td>
            <td style="${this._getBg(this.swatchId)}">fixed color</td>
          </tr>
        </tbody>
      </table>

      <table
        summary="A list of colors that meet WCAG 2.0 AA contrast requirements. Each contains all the contrasting shades for a given color, based on whether or not the text is regular or large."
      >
        <caption>
          WCAG 2.0 AA Contrast with ${this.swatchName}
        </caption>
        <thead>
          <tr>
            <th scope="col">Color Name</th>
            <th scope="col">Regular Text</th>
            <th scope="col">Large Text*</th>
          </tr>
        </thead>
        <tbody>
          ${this._getOptions(this.colors).map((color) => {
            return html`
              <tr>
                <th scope="row">${color}</th>
                <td>
                  ${this._getAa(this.swatchId, color).map(
                    (contrast) => html`
                      <span
                        class="contrast"
                        style="${this._getContrastBg(color, contrast)}"
                        >${color}-${contrast}</span
                      >
                    `,
                  )}
                </td>
                <td>
                  ${this._getAaLarge(this.swatchId, color).map(
                    (contrast) => html`
                      <span
                        class="contrast"
                        style="${this._getContrastBg(color, contrast)}"
                        >${color}-${contrast}</span
                      >
                    `,
                  )}
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
      <p>
        <small
          >* Large text is defined as bold text at least 14pt or normal text at
          least 18pt</small
        >
      </p>
    `;
  }
  constructor() {
    super();
    this.swatchId = "grey_0";
    this.swatchName = "grey-1";
  }

  /**
   * properties available to the custom element for data binding
   */
  static get properties() {
    return {
      /**
       * The id of the swatch (`color_index`)
       */
      swatchId: {
        attribute: "swatch-id",
        type: String,
        reflect: true,
      },
      /**
       * The swatch name (`color-shade`)
       */
      swatchName: {
        attribute: "swatch-name",
        type: String,
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-colors-swatch-info";
  }

  /**
   * given a particular swatch/shade of color,
   * returns all shades of another color that are WCAG 2.0AA-compliant
   *
   * @param {string} a swatch id (`color_index`)
   * @param {string} another color's name, eg. `pink`
   * @param {boolean} get contrasting shades that work for large text? eg. (bold && >= 14pt) || >= 18pt
   * @returns {array} the array indexes for the contrasting shades
   */
  _getAa(swatchId, color, aaLarge = false) {
    let data = swatchId.split("_"),
      index = parseInt(data[1]);
    return this.getContrastingShades(false, data[0], index, color);
  }

  /**
   * given a particular swatch/shade of color,
   * returns all shades of another color that are
   * large text-WCAG 2.0AA-compliant, eg. (bold && >= 14pt) || >= 18pt
   *
   * @param {string} a swatch id (`color_index`)
   * @param {string} another color's name, eg. `pink`
   * @returns {array} the array indexes for the contrasting shades
   */
  _getAaLarge(swatchId, color) {
    return this._getAa(swatchId, color, true);
  }

  /**
   * gets a style where swatch color is the background-color,
   * eg. `background: var(--simple-colors-default-theme-red-11); color: var(--simple-colors-default-theme-grey-1);`
   *
   * @param {string} a swatch id (`color_index`)
   * @returns {string} the style
   */
  _getBg(swatchId, inverse = false) {
    let colors = this._getColors(swatchId, inverse);
    return "background: " + colors[0] + "; color: " + colors[1] + ";";
  }

  /**
   * gets a style where swatch color is the background-color in dark mode,
   * eg. `background: var(--simple-colors-default-theme-red-2); color: var(--simple-colors-default-theme-grey-12);`
   *
   * @param {string} a swatch id (`color_index`)
   * @returns {string} the style
   */
  _getInverseBg(swatchId) {
    return this._getBg(swatchId, true);
  }

  /**
   * gets the list of color names from the colors object
   *
   * @param {object} the colors object
   * @returns {array} the array of color names
   */
  _getOptions(obj) {
    return Object.keys(obj);
  }

  /**
   * gets a background color based on a color and a shade
   *
   * @param {string} a color name, eg. `red`
   * @param  {number} the shade, eg., `11`
   * @returns {string} the style, eg. `background: var(--simple-colors-default-theme-red-11); color: var(--simple-colors-default-theme-grey-1);`
   */
  _getContrastBg(color, shade) {
    return this._getBg(color + "_" + (parseInt(shade) - 1));
  }

  /**
   * given a swatch id, gets the color variable
   * and a variable for the highest contrasting grey
   *
   * @param {string} swatchId (`color_index`)
   * @param {boolean} inverse the color for dark mode?
   * @returns {array} the color variables ([color, contrasting color])
   */
  _getColors(swatchId, inverse = false) {
    let data = swatchId.split("_"),
      index = inverse ? 11 - parseInt(data[1]) : parseInt(data[1]);
    return [this.colors[data[0]][index], this.colors.grey[index > 5 ? 0 : 11]];
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { simpleColorsSwatchInfo };

customElements.define(simpleColorsSwatchInfo.tag, simpleColorsSwatchInfo);
