/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "../simple-colors-picker.js";

export { simpleColorsDocsTable };
/**
 * `simple-colors-docs-table`
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
class simpleColorsDocsTable extends SimpleColors {
  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          margin: 15px 0;
        }
        :host([hidden]) {
          display: none;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table,
        table caption {
          border: 2px solid #000;
        }
        table caption {
          border-bottom: none;
        }
        :host #controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5px;
          margin: 0;
        }
        :host #controls label {
          margin-right: 5px;
        }
        table td,
        table th,
        table caption {
          padding: 3px;
          text-align: left;
        }
        table td,
        table th {
          font-size: 12px;
          border: 1px solid #000;
        }
      </style>
      <table border-spacing="0">
        <caption>
          <div id="controls">
            <div>--simple-colors-[[theme]]-theme</div>
            <div>
              <label>Pick a Theme: </label>
              <simple-picker id="theme" on-change="_handleThemeChange"></simple-colors-picker>
            </div>
            <div>
              <label>Pick an Accent Color: </label>
              <simple-colors-picker id="color" on-change="_handleColorChange"></simple-colors-picker>
            </div>
          </div>
        </caption>
        <thead>
          <tr>
            <th scope="column">accent</th>
            <template
              is="dom-repeat"
              items="[[_getOptions(colors)]]"
              as="color"
            >
              <th scope="column">[[color]]</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[colors.grey]]" index-as="level">
            <tr>
              <td
                title="--simple-colors-[[theme]]-theme-accent-[[_getLevel(level)]]"
                style="[[_getStyle(theme,'accent',level)]]"
              >
                accent-[[_getLevel(level)]]
              </td>
              <template
                is="dom-repeat"
                items="[[_getOptions(colors)]]"
                as="color"
              >
                <td
                  title="--simple-colors-[[theme]]-theme-[[color]]-[[_getLevel(level)]]"
                  style="[[_getStyle(theme,color,level)]]"
                >
                  [[color]]-[[_getLevel(level)]]
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }

  /**
   * properties available to the custom element for data binding
   */

  static get properties() {
    return {
      /**
       * Theme to demo
       */
      theme: {
        name: "theme",
        type: "String",
        value: "default",
        reflectToAttribute: true,
        observer: false
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
    return "simple-colors-docs-table";
  }

  /**
   * gets the current level based on the index
   */
  _getLevel(i) {
    return i + 1;
  }

  /**
   * gets the current style based on the theme, color, and index
   */
  _getStyle(theme, color, i) {
    let level = this._getLevel(i),
      text = level < 7 ? 12 : 1;
    return (
      "color: var(--simple-colors-" +
      theme +
      "-theme-grey-" +
      text +
      "); background-color: var(--simple-colors-" +
      theme +
      "-theme-" +
      color +
      "-" +
      level +
      ");"
    );
  }

  /**
   * gets the options array based on an object's keys
   */
  _getOptions(obj) {
    return Object.keys(obj);
  }

  /**
   * determines if the element is in nested mode
   */
  _handleThemeChange(e) {
    this.dark = this.$.theme.value;
  }

  /**
   * determines if the element is in nested mode
   */
  _handleColorChange(e) {
    this.accentColor = this.$.color.value;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  ready() {
    super.ready();
    this.$.theme.options = [
      [
        {
          alt: "light",
          style: "color: black; background-color: #fff;",
          value: false
        }
      ],
      [
        {
          alt: "dark",
          style: "color: white; background-color: #444;",
          value: "dark"
        }
      ]
    ];
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(simpleColorsDocsTable.tag, simpleColorsDocsTable);
