/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";

import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 * @demo demo/index.html
 * @demo demo/filters.html Filters
 * @element filtered-image
 */
class FilteredImage extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "filtered-image";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.src = "";
    this.alt = "";
    this.height = "";
    this.width = "";
    this.color = "#ffffff";
    this.strength = 1;
    this.contrast = 0;
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "src") {
        this._srcChanged(this[propName]);
      }
      if (propName == "height") {
        this._heightChanged(this[propName]);
      }
      if (propName == "width") {
        this._widthChanged(this[propName]);
      }
      if (["src", "matrix"].includes(propName)) {
        this.__id = this._getID(this.src, this.matrix);
      }
      if (["color", "contrast", "strength"].includes(propName)) {
        this.__matrix = this._getMatrix(
          this.color,
          this.contrast,
          this.strength
        );
      }
    });
  }
  _heightChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image"),
      rect = svg.querySelector("#rect");
    svg.setAttribute("height", this.height);
    image.setAttribute("height", this.height);
    rect.setAttribute("height", this.height);
  }
  _widthChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image"),
      rect = svg.querySelector("#rect");
    svg.setAttribute("width", this.width);
    image.setAttribute("width", this.width);
    rect.setAttribute("width", this.width);
  }
  _srcChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image");
    image.setAttribute("href", this.src);
    image.setAttribute("xlink:href", this.src);
  }
  _getMatrix(color, contrast, strength) {
    let values = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0]
      ],
      svg = this.shadowRoot.querySelector("#svg"),
      matrix = svg.querySelector("#matrix"),
      rgba = null;
    if (color.startsWith("#") && color.length > 6) {
      if (color.length === 7) color += "ff";
      values[0][0] = parseInt(color.substring(1, 3), 16) / 255;
      values[1][1] = parseInt(color.substring(3, 5), 16) / 255;
      values[2][2] = parseInt(color.substring(5, 7), 16) / 255;
      values[3][3] = parseInt(color.substring(7, 9), 16) / 255;
    } else if (color.startsWith("#")) {
      if (color.length === 4) color += "f";
      values[0][0] =
        parseInt(color.substring(1, 2) + color.substring(1, 2), 16) / 255;
      values[1][1] =
        parseInt(color.substring(2, 3) + color.substring(2, 3), 16) / 255;
      values[2][2] =
        parseInt(color.substring(3, 4) + color.substring(3, 4), 16) / 255;
      values[3][3] =
        parseInt(color.substring(4, 5) + color.substring(4, 5), 16) / 255;
    } else if (color.startsWith("rgb")) {
      let temp = color.replace(/rgba?\(/g, "").replace(/\)/g, "");
      rgba = temp.split(",");
      values[0][0] = parseInt(rgba[0] / 255);
      values[1][1] = parseInt(rgba[1] / 255);
      values[2][2] = parseInt(rgba[2] / 255);
      values[3][3] = values[3][3] || "1";
    }

    if (contrast !== 0) {
      values[0][3] = (values[0][0] * contrast) / 100;
      values[1][3] = (values[1][1] * contrast) / 100;
      values[2][3] = (values[2][2] * contrast) / 100;
    }
    if (strength !== 1) {
      values[0][0] = values[0][0] + (1 - strength) * (1 - values[0][0]);
      values[1][1] = values[1][1] + (1 - strength) * (1 - values[1][1]);
      values[2][2] = values[2][2] + (1 - strength) * (1 - values[2][2]);
    }

    matrix.setAttribute(
      "values",
      JSON.stringify(values).replace(/[,\[\]]/g, " ")
    );
    return values;
  }
  _getID(src, matrix) {
    let id = "svg" + Math.random();
    return id.replace(/0./g, "-");
  }
}
window.customElements.define(FilteredImage.tag, FilteredImage);
export { FilteredImage };
