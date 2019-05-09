/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @demo demo/filters.html Filters
 */
class FilteredImage extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "filtered-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(FilteredImage.haxProperties, FilteredImage.tag, this);
    this._matrixChanged();
    this._srcChanged();
  }
  _heightChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    svg.setAttribute("height", this.height);
    image.setAttribute("height", this.height);
  }
  _widthChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    svg.setAttribute("width", this.width);
    image.setAttribute("width", this.width);
  }
  _getViewBox(height, width) {
    return `0 0 ${width} ${height}`;
  }
  _srcChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    image.setAttribute("href", this.src);
    image.setAttribute("xlink:href", this.src);
  }
  _matrixChanged() {
    let svg = this.$.svg,
      matrix = svg.querySelector("#matrix");
    matrix.setAttribute("values", this.matrix);
  }
  _getID(src, matrix) {
    let id = "svg" + Math.random();
    return id.replace(/0./g, "-");
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(FilteredImage.tag, FilteredImage);
export { FilteredImage };
