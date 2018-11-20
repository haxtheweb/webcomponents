/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../simple-colors.js"; //import the shared styles

export { SimpleColorsDemoTable };
/**
 * `simple-colors-demo-table`
 * `a utilty that provides a global set of color classes and variables based on theme and accent color attributes`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "../simple-colors.js"
 * @demo demo/colors.html
 */
class SimpleColorsDemoTable extends SimpleColors {
  //render function
  static get template() {
    let table = this.getTable();
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
${table}`;
  }

  /**
   * properties available to the custom element for data binding
   */

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
   * builds the table for the template
   */
  static getTable() {
    let template = document.createElement("template"),
      table = ['<table border-spacing="0">'],
      colors = [
        "accent",
        "grey",
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey"
      ];
    table.push("<caption><slot>Demo Table</slot></caption><thead><tr>");
    for (let i = 0; i < 12; i++) {
      table.push('<th scope="col">Color Level ' + i + "</th>");
    }
    table.push("</tr></thead><tbody>");
    for (let i = 0; i < colors.length; i++) {
      table.push("<tr>");
      for (let j = 1; j < 13; j++) {
        let k = j > 6 ? 1 : 12,
          color = "color: var(--simple-colors-default-theme-grey-" + k + ");",
          bg =
            " background-color: var(--simple-colors-default-theme-" +
            colors[i] +
            "-" +
            j +
            ");";
        table.push(
          '<td style="' + color + bg + '">' + colors[i] + "-" + j + "</td>"
        );
      }
      table.push("</tr>");
    }
    table.push("</tbody></table>");
    template.innerHTML = table.join("");
    return template;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo-table";
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
