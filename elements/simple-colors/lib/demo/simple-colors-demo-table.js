/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "./simple-colors-demo-select.js"; //import the selectors

export { SimpleColorsDemoTable };
/**
 * `simple-colors-demo-table`
 * `a demo of all the colors in simple-colors`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "../../simple-colors.js"
 */
class SimpleColorsDemoTable extends SimpleColors {
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
  table, table caption {
    border: 2px solid #000;
  }
  table caption {
    border-bottom: none;
  }
  table td, table th, table caption {
    padding: 3px;
    text-align: left;
  }
  table td, table th {
    font-size: 12px;
    border: 1px solid #000;
  }
</style>
<table border-spacing="0">
  <caption>
    --simple-colors-[[theme]]-theme when <label>accent-color is
      <simple-colors-demo-select id="accent"
        label="accent-color"
        value$="[[accentColor]]" 
        as-code 
        on-accent-color-change="_handleAccentChange"
        options$=[[_getOptions(colors)]]>
        <span slot="prefix">="</span>
        <span slot="suffix">" </span>
      </simple-colors-demo-select>
    </label>
    <label>and dark is
      <simple-colors-demo-select id="dark"
        label="dark"
        value$="[[dark]]" 
        as-code 
        on-dark-change="_handleDarkChange"
        options='["","dark"]'>
        <span slot="prefix">="</span>
        <span slot="suffix">" </span>
      </simple-colors-demo-select>
    </label>
  </caption>
  <thead>
    <tr>
      <th scope="column">accent</th>
      <template is="dom-repeat" items="[[_getOptions(colors)]]" as="color">
        <th scope="column">[[color]]</th>
      </template>
    </tr>
  </thead>
  <tbody>
    <template is="dom-repeat" items="[[colors.grey]]" index-as="level">
      <tr>
        <td title="--simple-colors-[[theme]]-theme-accent-[[_getLevel(level)]]" style="[[_getStyle(theme,'accent',level)]]">accent-[[_getLevel(level)]]</td>
        <template is="dom-repeat" items="[[_getOptions(colors)]]" as="color">
          <td title="--simple-colors-[[theme]]-theme-[[color]]-[[_getLevel(level)]]" style="[[_getStyle(theme,color,level)]]">[[color]]-[[_getLevel(level)]]</td>
        </template>
      </tr>
    </template>
  </tbody>
</table>`;
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
    return "simple-colors-demo-table";
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
  _handleAccentChange(e) {
    this.accentColor = this.$.accent.value;
  }

  /**
   * determines if the element is in nested mode
   */
  _handleDarkChange(e) {
    this.dark = this.$.dark.value === "dark" ? "dark" : false;
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
window.customElements.define(SimpleColorsDemoTable.tag, SimpleColorsDemoTable);
