/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `simple-colors`
 * `a shared set of styles for @lrnwebcomponents`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/how.html getting started
 * @demo demo/colors.html all of the colors
 * @demo demo/picker.html simple-colors-picker
 * @demo demo/extending.html extending simple-colors
 */
class SimpleColors extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  static get tag() {
    return "simple-colors";
  }

  /**
   * returns the maximum contrast to the shade
   *
   * @param {string} the shade
   * @param {number} the shade with maximum contrast
   */
  maxContrastShade(shade) {
    return parseInt(shade) < this.colors["grey"].length / 2 + 1
      ? this.colors["grey"].length
      : 1;
  }

  /**
   * gets the current shade
   *
   * @param {string} the shade
   * @param {number} the inverted shade
   */

  invertShade(shade) {
    return this.colors["grey"].length + 1 - parseInt(shade);
  }

  /**
   * gets the color information of a given CSS variable or class
   *
   * @param {string} the CSS variable (eg. `--simple-colors-fixed-theme-red-3`)
   * @param {object} an object that includes the theme, color, and shade information
   */
  getColorInfo(colorName) {
    let temp1 = colorName
        .replace(/(simple-colors-)?(-text)?(-border)?/g, "")
        .split("-theme-"),
      theme = temp1.length > 0 ? temp1[0] : "default",
      temp2 = temp1.length > 0 ? temp1[1].split("-") : temp1[0].split("-"),
      color =
        temp2.length > 1 ? temp2.slice(1, temp2.length - 1).join("-") : "grey",
      shade = temp2.length > 1 ? temp2[temp2.length - 1] : "1";
    return {
      theme: theme,
      color: color,
      shade: shade
    };
  }

  /**
   * returns a variable based on color name, shade, and fixed theme
   *
   * @param {string} the color name
   * @param {number} the color shade
   * @param {boolean} the color shade
   * @returns {string} the CSS Variable
   */
  makeVariable(color = "grey", shade = 1, theme = "default") {
    return ["--simple-colors", theme, "theme", color, shade].join("-");
  }

  /**
   * for large or small text given a color and its shade,
   * lists all the colors and shades that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {object} all of the WCAG 2.0 AA-compliant colors and shades
   */
  getContrastingColors(colorName, colorShade, isLarge) {
    let result = {};
    Object.keys(this.colors).forEach(color => {
      result[color] = this.getContrastingShades(
        isLarge,
        colorName,
        colorShade,
        color
      );
    });
    return result.color;
  }

  /**
   * for large or small text given a color and its shade,
   * lists all the shades of another color that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {array} all of the WCAG 2.0 AA-compliant shades of the contrasting color
   */
  getContrastingShades(isLarge, colorName, colorShade, contrastName) {
    let hasGrey =
        colorName === "grey" || contrastName === "grey"
          ? "greyColor"
          : "colorColor",
      aa = isLarge ? "aaLarge" : "aa",
      index = parseInt(colorShade) + 1,
      range = this.contrasts[hasGrey][aa][index];
    return Array(range.max - range.min + 1)
      .fill()
      .map((_, idx) => range.min + idx);
  }
  /**
   * determines if two shades are WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {string} contrast shade, e.g. 12
   * @param {boolean} whether or not the contrasting shade is WCAG 2.0 AA-compliant
   */
  isContrastCompliant(
    isLarge,
    colorName,
    colorShade,
    contrastName,
    contrastShade
  ) {
    let hasGrey =
        colorName === "grey" || contrastName === "grey"
          ? "greyColor"
          : "colorColor",
      aa = isLarge ? "aaLarge" : "aa",
      index = parseInt(colorShade) + 1,
      range = this.contrasts[hasGrey][aa][index];
    return contrastShade >= range.min && ontrastShade >= range.max;
  }

  /**
   * gets the current shade based on the index
   *
   * @param {string} the index
   * @param {number} the shade
   */
  indexToShade(index) {
    return parseInt(index) + 1;
  }

  /**
   * gets the current shade based on the index
   *
   * @param {string} the shade
   * @param {number} the index
   */
  shadeToIndex(shade) {
    return parseInt(shade) - 1;
  }

  /**
   * inverts the current index
   *
   * @param {string} the index
   * @param {number} the inverted index
   */
  invertIndex(index) {
    return this.colors["grey"].length - 1 - parseInt(index);
  }

  /**
   * returns the maximum contrast to the index
   *
   * @param {string} the index
   * @param {number} the index with maximum contrast
   */
  maxContrastIndex(index) {
    return parseInt(index) < this.colors["grey"].length / 2
      ? this.colors["grey"].length - 1
      : 0;
  }
}
customElements.define(SimpleColors.tag, SimpleColors);
export { SimpleColors };
