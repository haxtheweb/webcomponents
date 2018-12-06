/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "./simple-colors-demo.js";

export { SimpleColorsDemoVariables };
/**
 * `simple-colors-demo-variables`
 * `an example of how to simple-colors CSS variables work`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "../../simple-colors.js"
 */
class SimpleColorsDemoVariables extends SimpleColors {
  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          padding: 0px;
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        :host #demo {
          padding: 20px;
        }
        :host #button {
          font-size: 110%;
          border-radius: 3px;
          padding: 5px 7px;
          cursor: pointer;
        }
        :host #varselectors {
          color: black !important;
          background-color: #f5f5f5;
          font-family: monospace;
          padding: 15px;
        }
        :host #properties {
          padding: 15px;
        }
        :host .sr-only {
          position: absolute;
          left: -999999px;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
      </style>
      <simple-colors-demo>
        <div id="inner">
          <div id="demo"><button id="button">Button</button></div>
          <div id="varselectors">
            <em>button</em> {
            <div id="properties">
              color: var(<label class="sr-only" for="theme">Text Theme</label
              ><simple-colors-demo-select
                id="theme"
                label="theme"
                value="--simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options="[&quot;--simple-colors-default-theme&quot;,&quot;--simple-colors-dark-theme&quot;,&quot;--simple-colors-light-theme&quot;]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="color">Text Base Color</label
              ><simple-colors-demo-select
                id="color"
                label="accent-color"
                value="grey"
                as-code
                on-accent-color-change="_handleUpdate"
                options$="[[_getOptions(colors)]]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="level">Text Shade Level</label
              ><simple-colors-demo-select
                id="level"
                label="level"
                value="1"
                as-code
                on-level-change="_handleUpdate"
                options="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;,&quot;4&quot;,&quot;5&quot;,&quot;6&quot;,&quot;7&quot;,&quot;8&quot;,&quot;9&quot;,&quot;10&quot;,&quot;11&quot;,&quot;12&quot;]"
              >
              </simple-colors-demo-select
              >); <br />

              background-color: var(<label class="sr-only" for="theme"
                >Background Theme</label
              ><simple-colors-demo-select
                id="bgtheme"
                label="theme"
                value="--simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options="[&quot;--simple-colors-default-theme&quot;,&quot;--simple-colors-dark-theme&quot;,&quot;--simple-colors-light-theme&quot;]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="color">Background Base Color</label
              ><simple-colors-demo-select
                id="bgcolor"
                label="accent-color"
                value="accent"
                as-code
                on-accent-color-change="_handleUpdate"
                options$="[[_getOptions(colors)]]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="level">Background Shade Level</label
              ><simple-colors-demo-select
                id="bglevel"
                label="level"
                value="7"
                as-code
                on-level-change="_handleUpdate"
                options="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;,&quot;4&quot;,&quot;5&quot;,&quot;6&quot;,&quot;7&quot;,&quot;8&quot;,&quot;9&quot;,&quot;10&quot;,&quot;11&quot;,&quot;12&quot;]"
              >
              </simple-colors-demo-select
              >); <br />

              border-color: var(<label class="sr-only" for="theme"
                >Border Theme</label
              ><simple-colors-demo-select
                id="bdtheme"
                label="theme"
                value="--simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options="[&quot;--simple-colors-default-theme&quot;,&quot;--simple-colors-dark-theme&quot;,&quot;--simple-colors-light-theme&quot;]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="color">Border Base Color</label
              ><simple-colors-demo-select
                id="bdcolor"
                label="accent-color"
                value="accent"
                as-code
                on-accent-color-change="_handleUpdate"
                options$="[[_getOptions(colors)]]"
              >
              </simple-colors-demo-select
              >-<label class="sr-only" for="level">Border Shade Level</label
              ><simple-colors-demo-select
                id="bdlevel"
                label="level"
                value="9"
                as-code
                on-level-change="_handleUpdate"
                options="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;,&quot;4&quot;,&quot;5&quot;,&quot;6&quot;,&quot;7&quot;,&quot;8&quot;,&quot;9&quot;,&quot;10&quot;,&quot;11&quot;,&quot;12&quot;]"
              >
              </simple-colors-demo-select
              >);
            </div>
            }
          </div>
        </div>
      </simple-colors-demo>
    `;
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
    return "simple-colors-demo-variables";
  }

  /**
   * gets the options array based on an object's keys
   */
  _getOptions(obj) {
    let opts = Object.keys(obj);
    opts.unshift("accent");
    return opts;
  }

  /**
   * determines if the element is in nested mode
   */
  _handleUpdate() {
    this.$.button.style = [
      "color: var(" +
        [this.$.theme.value, this.$.color.value, this.$.level.value].join("-") +
        ");",
      "background-color: var(" +
        [this.$.bgtheme.value, this.$.bgcolor.value, this.$.bglevel.value].join(
          "-"
        ) +
        ");",
      "border: 3px solid var(" +
        [this.$.bdtheme.value, this.$.bdcolor.value, this.$.bdlevel.value].join(
          "-"
        ) +
        ");"
    ].join("");
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  ready() {
    super.ready();
    this._handleUpdate();
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
window.customElements.define(
  SimpleColorsDemoVariables.tag,
  SimpleColorsDemoVariables
);
