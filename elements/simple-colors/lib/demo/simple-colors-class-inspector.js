/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "./simple-colors-demo.js";
/**
 * `simple-colors-class-inspector`
 * `A tool to show how simple-colors CSS classes work`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/classes.html demo
 * @see "../../simple-colors.js"
 * @see "simple-colors-inspector-content.js"
 * @see "simple-colors-inspector-select.js"
 */
class SimpleColorsClassInspector extends SimpleColors {
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
          border-width: 3px;
        }
        :host #classselectors {
          padding: 15px;
          color: black !important;
          background-color: #f5f5f5;
          font-family: monospace;
        }
        :host .cssclass {
          white-space: nowrap;
          margin: 0 7px;
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
          <div id="classselectors">
            <em>&lt;button</em> class="<span class="cssclass"
              ><label class="sr-only" for="theme">Background Theme</label
              ><simple-colors-demo-select
                id="bgtheme"
                label="theme"
                value="simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options='["simple-colors-default-theme","simple-colors-dark-theme","simple-colors-light-theme"]'
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
                options='["1","2","3","4","5","6","7","8","9","10","11","12"]'
              >
              </simple-colors-demo-select
            ></span>

            <span class="cssclass"
              ><label class="sr-only" for="theme">Text Theme</label
              ><simple-colors-demo-select
                id="theme"
                label="theme"
                value="simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options='["simple-colors-default-theme","simple-colors-dark-theme","simple-colors-light-theme"]'
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
                options='["1","2","3","4","5","6","7","8","9","10","11","12"]'
              >
              </simple-colors-demo-select
              >-text</span
            >

            <span class="cssclass"
              ><label class="sr-only" for="theme">Border Theme</label
              ><simple-colors-demo-select
                id="bdtheme"
                label="theme"
                value="simple-colors-default-theme"
                as-code
                on-theme-change="_handleUpdate"
                options='["simple-colors-default-theme","simple-colors-dark-theme","simple-colors-light-theme"]'
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
                options='["1","2","3","4","5","6","7","8","9","10","11","12"]'
              >
              </simple-colors-demo-select
              >-border</span
            >"/>
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
    return "simple-colors-class-inspector";
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
    this.$.button.className = [
      [this.$.theme.value, this.$.color.value, this.$.level.value, "text"].join(
        "-"
      ),
      [this.$.bgtheme.value, this.$.bgcolor.value, this.$.bglevel.value].join(
        "-"
      ),
      [
        this.$.bdtheme.value,
        this.$.bdcolor.value,
        this.$.bdlevel.value,
        "border"
      ].join("-")
    ].join(" ");
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

export { SimpleColorsClassInspector };

window.customElements.define(
  SimpleColorsClassInspector.tag,
  SimpleColorsClassInspector
);
