/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "../simple-colors-picker.js";

/**
 * `simple-colors-picker-demo`
 * `an example of how to extend simple-colors within a custom element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/picker.html demo
 * @see "../../simple-colors.js"
 * @see "../simple-colors-picker.js"
 */
class SimpleColorsPickerDemo extends SimpleColors {
  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          --simple-picker-selected-option-outline: 2px dashed black;
          --simple-picker-active-option-outline: 2px solid black;
        }
        :host([hidden]) {
          display: none;
        }
        :host #controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
        }
        :host #controls label {
          margin-right: 5px;
        }
        :host .slot {
          margin: 15px 0;
        }
      </style>
      <div id="controls">
        <p>
          <label>Pick a Theme: </label>
          <simple-picker id="theme" on-change="_handleThemeChange"></simple-colors-picker>
        </p>
        <p>
          <label>Pick an Accent Color: </label>
          <simple-colors-picker id="color" on-change="_handleColorChange"></simple-colors-picker>
        </p>
      </div>
      <div class="slot"><slot></slot></div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
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
    return "simple-colors-picker-demo";
  }

  /**
   * sets the theme when the `simple-picker` changes
   */
  _handleThemeChange(e) {
    this.dark = this.$.theme.value;
  }

  /**
   * sets the `accent-color` when the `simple-colors-picker` changes
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

export { SimpleColorsPickerDemo };

window.customElements.define(
  SimpleColorsPickerDemo.tag,
  SimpleColorsPickerDemo
);
