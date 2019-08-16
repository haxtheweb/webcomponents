/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles

/**
 * `simple-colors-swatch-info`
 * `A tool to document of all the colors in simple-colors`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/colors.html demo
 * @see "../../simple-colors.js"
 * @see "../simple-colors-picker.js"
 */
class simpleColorsSwatchInfo extends SimpleColors {
  //render function
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
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
      </style>
      <table summary="Each row represents a CSS variable or class with a description of what it does without the dark attribute and with the attribute.">
        <caption>
          CSS Variables and Classes for [[swatchName]]
        </caption>
        <thead>
          <tr>
            <th scope="col">Variable Name</th>
            <th scope="col">Color</th>
            <th scope="col">With <tt>dark</tt> Attribute</th>
          </tr>
        <thead>
        <tbody>
          <tr>
            <th scope="row">
              --simple-colors-default-theme-[[swatchName]]
            </th>
            <td style$="[[bg]]">default color</td>
            <td style$="[[inverseBg]]">inverted color</td>
          </tr>
          <tr>
            <th scope="row">
              --simple-colors-fixed-theme-[[swatchName]]
            </th>
            <td style$="[[bg]]">default color</td>
            <td style$="[[bg]]">fixed color</td>
          </tr>
        </tbody>
      </table>
      
      <table summary="A list of colors that meet WCAG 2.0 AA contrast requirements. Each contains all the contrasting shades for a given color, based on whether or not the text is regular or large.">
        <caption>WCAG 2.0 AA Contrast with [[swatchName]]</caption>
        <thead>
          <tr>
            <th scope="col">Color Name</th>
            <th scope="col">Regular Text</th>
            <th scope="col">Large Text*</th>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[_getOptions(colors)]]" as="color">
            <tr>
              <th scope="row">[[color]]</th>
              <td>
                <template is="dom-repeat" items="[[_getAa(swatchId,color)]]" as="contrast">
                  <span class="contrast" style$="[[_getContrastBg(color,contrast)]]">[[color]]-[[contrast]]</span>
                </template>
              </td>
              <td>
                <template is="dom-repeat" items="[[_getAaLarge(swatchId,color)]]" as="contrast">
                  <span class="contrast" style$="[[_getContrastBg(color,contrast)]]">[[color]]-[[contrast]]</span>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p><small>* Large text is defined as bold text at least 14pt or normal text at least 18pt</small></p>
    `;
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
        name: "swatchId",
        type: "String",
        value: "grey_0",
        reflectToAttribute: true
      },
      /**
       * The swatch name (`color-shade`)
       */
      swatchName: {
        name: "swatchName",
        type: "String",
        value: "grey-1",
        reflectToAttribute: true
      },
      /**
       * A style where swatch color is the background-color
       */
      bg: {
        name: "bg",
        type: "String",
        computed: "_getBg(swatchId)"
      },
      /**
       * A style where swatch color is the background-color in dark mode
       */
      inverseBg: {
        name: "inverseBg",
        type: "String",
        computed: "_getInverseBg(swatchId)"
      },
      /**
       * A style where swatch color is the text color
       */
      text: {
        name: "text",
        type: "String",
        computed: "_getText(swatchId)"
      },
      /**
       * A style where swatch color is the text color in dark mode
       */
      inverseText: {
        name: "inverseText",
        type: "String",
        computed: "_getInverseText(swatchId)"
      }
    };
  }

  /**
   * gets simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-swatch-info";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * life cycle, element is readt
   */
  ready() {
    super.ready();
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
   * gets a style where swatch color is the text color in dark mode,
   * eg. `background: var(--simple-colors-default-theme-grey-12); color: var(--simple-colors-default-theme-red-2);`
   *
   * @param {string} a swatch id (`color_index`)
   * @returns {string} the style
   */
  _getInverseText(swatchId) {
    return this._getText(swatchId, true);
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
   * gets a style where swatch color is the text color,
   * eg. `background: var(--simple-colors-default-theme-grey-1); color: var(--simple-colors-default-theme-red-11);`
   *
   * @param {string} a swatch id (`color_index`)
   * @returns {string} the style
   */
  _getText(swatchId, inverse = false) {
    let colors = this._getColors(swatchId, inverse);
    return "color: " + colors[0] + "; background: " + colors[1] + ";";
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

window.customElements.define(
  simpleColorsSwatchInfo.tag,
  simpleColorsSwatchInfo
);
