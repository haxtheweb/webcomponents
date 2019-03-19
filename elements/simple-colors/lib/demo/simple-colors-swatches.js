/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "./simple-colors-swatch-info.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";

/**
 * `simple-colors-swatches`
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
class simpleColorsSwatches extends SimpleColors {
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
        :host simple-modal-template {
          --simple-modal-titlebar-color: var(--simple-colors-swatch-contrast);
          --simple-modal-titlebar-background: var(--simple-colors-swatch-color);
        }
        :host .row {
          display: flex;
          align-items: stretch;
        }
        :host button {
          width: calc(8% - 6px);
          height: 80px;
          margin: 3px;
          border: 1px solid black;
          border-radius: 3px;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: stretch;
        }
        :host button div {
          margin: 0;
          padding: 2px;
          font-size: 10px;
          background: black;
          color: white;
          width: calc(100% - 4px);
        }
        :host button:focus,
        :host button:hover {
          opacity: 0.7;
          cursor: pointer;
        }
      </style>
      <div>
        <p>Click on the swatches above to learn more.</p>
        <div class="rows">
          <template is="dom-repeat" items="[[_getOptions(colors)]]" as="color">
            <div class="row">
              <template is="dom-repeat" items="[[colors.grey]]">
                <button
                  id="[[color]]_[[index]]"
                  controls="swatchinfo"
                  style$="background-color: [[_getHex(color,index)]];"
                  title$="[[color]]-[[_getShade(index)]]"
                  on-click="_handleTap"
                >
                  <div>[[color]]-[[_getShade(index)]]</div>
                </button>
              </template>
            </div>
          </template>
        </div>
        <simple-modal-template id="modal" title="[[swatchName]]">
          <p slot="content">
            <simple-colors-swatch-info
              swatch-id$="[[swatchId]]"
              swatch-name$="[[swatchName]]"
            >
            </simple-colors-swatch-info>
          </p>
        </simple-modal-template>
      </div>
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
        value: null
      },
      /**
       * The swatch name (`color-shade`)
       */
      swatchName: {
        name: "swatchName",
        type: "String",
        value: null
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
    return "simple-colors-swatches";
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
   * gets the shade number for a hex code at a given index
   *
   * @param {number} index
   * @returns {number} the shade number
   */
  _getShade(index) {
    return parseInt(index) + 1;
  }

  /**
   * gets the hex code for the shade at a given color and index
   *
   * @param {string} the color name, eg. `red`
   * @param {number} index
   * @returns {number} the hex code
   */
  _getHex(color, index) {
    return this.colors[color][index];
  }

  /**
   * when a button is tapped, open the swatch info modal
   */
  _handleTap(e) {
    this.swatchId = e.path[0].getAttribute("id");
    this.swatchName = e.path[0].getAttribute("title");
    this.$.modal.openModal(e.path[0]);
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
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { simpleColorsSwatches };

window.customElements.define(simpleColorsSwatches.tag, simpleColorsSwatches);
