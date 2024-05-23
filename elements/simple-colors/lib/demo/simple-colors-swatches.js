/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles

/**
 * `simple-colors-swatches`
 * `A tool to document of all the colors in simple-colors`
 *
### Styling

`<simple-colors-swatches>` provides the following custom properties and mixins
for styling. See demo of "all of the colors" (`demo/colors.html`) for color variable styling.

Custom property | Description | Default
----------------|-------------|----------
`--simple-colors-swatch-contrast` | Modal title bar text color. | unset
`--simple-colors-swatch-color` | Modal title bar background color. | unset
 * 
 * @extends SimpleColors

 * @demo ./demo/colors.html demo
 * @see "../../simple-colors.js"
 * @see "../simple-colors-picker.js"
 */
class simpleColorsSwatches extends SimpleColors {
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
      `,
    ];
  }
  // render function
  render() {
    return html`
      <div>
        <p>Click on the swatches above to learn more.</p>
        <div class="rows">
          ${Object.keys(this.colors).map((color) => {
            return html`
              <div class="row">
                ${this.colors.grey.map((shade, index) => {
                  return html`
                    <button
                      id="${this._getId(color, index)}"
                      controls="swatchinfo"
                      style="background-color: ${this.colors[color][index]};"
                      title="${this._getTitle(color, index)}"
                      @click="${(e) => this._handleClick(color, index)}"
                    >
                      <div>${this._getTitle(color, index)}</div>
                    </button>
                  `;
                })}
              </div>
            `;
          })}
        </div>
        <simple-modal-template id="modal" title="${this.swatchName}">
          <p slot="content">
            <simple-colors-swatch-info
              swatch-id="${this.swatchId}"
              swatch-name="${this.swatchName}"
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
        attribute: "swatch-id",
        type: String,
      },
      /**
       * The swatch name (`color-shade`)
       */
      swatchName: {
        attribute: "swatch-name",
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-colors-swatches";
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "swatchId" &&
        this.shadowRoot.querySelector("#modal") &&
        this.shadowRoot.querySelector("#modal").openModal
      )
        this.shadowRoot
          .querySelector("#modal")
          .openModal(this.shadowRoot.querySelector("#" + this.swatchId));
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  constructor() {
    super();
    this.swatchId = "grey_0";
    this.swatchName = "grey-1";
    import("./simple-colors-swatch-info.js");
    import("@haxtheweb/simple-modal/lib/simple-modal-template.js");
  }

  /**
   * gets color's title
   * @param {string} color name of color
   * @param {string} index color shade's index
   * @return {string} color's title
   */
  _getTitle(color, index) {
    return `${color}-${this._getShade(index)}`;
  }

  /**
   * gets color's unique id
   * @param {string} color name of color
   * @param {string} index color shade's index
   * @return {string} color's unique id
   */
  _getId(color, index) {
    return `${color}_${index}`;
  }

  /**
   * gets the shade number for a hex code at a given index
   * @param {string} index color shade's index
   * @return {number} shade number
   */
  _getShade(index) {
    return parseInt(index) + 1;
  }

  /**
   * when a button is tapped, change sset swatchName and swatchId
   * @param {string} color name of color
   * @param {string} index color shade's index
   */
  _handleClick(color, index) {
    this.swatchId = this._getId(color, index);
    this.swatchName = this._getTitle(color, index);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { simpleColorsSwatches };

customElements.define(simpleColorsSwatches.tag, simpleColorsSwatches);
