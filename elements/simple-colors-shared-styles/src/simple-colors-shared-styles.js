/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `simple-colors-shared-styles`
 * @element simple-colors-shared-styles
 * a shared set of styles for `simple-colors`
 *
 *

 * @demo ./demo/index.html
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

window.SimpleColorsSharedStyles = {};
window.SimpleColorsSharedStyles.instance = null;

class SimpleColorsSharedStyles extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  constructor() {
    super();
    this.colors = {
      grey: [
        "#ffffff",
        "#eeeeee",
        "#dddddd",
        "#cccccc",
        "#bbbbbb",
        "#999999",
        "#666666",
        "#444444",
        "#333333",
        "#222222",
        "#111111",
        "#000000",
      ],
      red: [
        "#ffdddd",
        "#ffaeae",
        "#ff8f8f",
        "#ff7474",
        "#fd5151",
        "#ff2222",
        "#ee0000",
        "#ac0000",
        "#850000",
        "#670000",
        "#520000",
        "#3f0000",
      ],
      pink: [
        "#ffe6f1",
        "#ffa5cf",
        "#ff87c0",
        "#ff73b5",
        "#fd60aa",
        "#ff3996",
        "#da004e",
        "#b80042",
        "#980036",
        "#78002b",
        "#5a0020",
        "#440019",
      ],
      purple: [
        "#fce6ff",
        "#f4affd",
        "#f394ff",
        "#f07cff",
        "#ed61ff",
        "#e200ff",
        "#a500ba",
        "#8a009b",
        "#6c0079",
        "#490052",
        "#33003a",
        "#200025",
      ],
      "deep-purple": [
        "#f3e4ff",
        "#ddacff",
        "#c97eff",
        "#bb63f9",
        "#b44aff",
        "#a931ff",
        "#7e00d8",
        "#5d009f",
        "#4c0081",
        "#3a0063",
        "#2a0049",
        "#1d0033",
      ],
      indigo: [
        "#e5ddff",
        "#c3b2ff",
        "#af97ff",
        "#9e82ff",
        "#9373ff",
        "#835fff",
        "#3a00ff",
        "#2801b0",
        "#20008c",
        "#160063",
        "#100049",
        "#0a0030",
      ],
      blue: [
        "#e2ecff",
        "#acc9ff",
        "#95baff",
        "#74a5ff",
        "#5892fd",
        "#4083ff",
        "#0059ff",
        "#0041bb",
        "#003494",
        "#002569",
        "#001947",
        "#001333",
      ],
      "light-blue": [
        "#ddefff",
        "#a1d1ff",
        "#92c9ff",
        "#65b3ff",
        "#58adff",
        "#41a1ff",
        "#007ffc",
        "#0066ca",
        "#0055a8",
        "#003f7d",
        "#002850",
        "#001b36",
      ],
      cyan: [
        "#ddf8ff",
        "#9beaff",
        "#77e2ff",
        "#33d4ff",
        "#1ccfff",
        "#00c9ff",
        "#009dc7",
        "#007999",
        "#005970",
        "#003f50",
        "#002c38",
        "#001a20",
      ],
      teal: [
        "#d9fff0",
        "#98ffd7",
        "#79ffcb",
        "#56ffbd",
        "#29ffac",
        "#00ff9c",
        "#009d75",
        "#007658",
        "#004e3a",
        "#003829",
        "#002a20",
        "#001b14",
      ],
      green: [
        "#e1ffeb",
        "#acffc9",
        "#79ffa7",
        "#49ff88",
        "#24ff70",
        "#00f961",
        "#008c37",
        "#00762e",
        "#005a23",
        "#003d18",
        "#002a11",
        "#001d0c",
      ],
      "light-green": [
        "#ebffdb",
        "#c7ff9b",
        "#b1ff75",
        "#a1fd5a",
        "#8efd38",
        "#6fff00",
        "#429d00",
        "#357f00",
        "#296100",
        "#1b3f00",
        "#143000",
        "#0d2000",
      ],
      lime: [
        "#f1ffd2",
        "#dfff9b",
        "#d4ff77",
        "#caff58",
        "#bdff2d",
        "#aeff00",
        "#649900",
        "#4d7600",
        "#3b5a00",
        "#293f00",
        "#223400",
        "#182400",
      ],
      yellow: [
        "#ffffd5",
        "#ffffac",
        "#ffff90",
        "#ffff7c",
        "#ffff3a",
        "#f6f600",
        "#929100",
        "#787700",
        "#585700",
        "#454400",
        "#303000",
        "#242400",
      ],
      amber: [
        "#fff2d4",
        "#ffdf92",
        "#ffd677",
        "#ffcf5e",
        "#ffc235",
        "#ffc500",
        "#b28900",
        "#876800",
        "#614b00",
        "#413200",
        "#302500",
        "#221a00",
      ],
      orange: [
        "#ffebd7",
        "#ffca92",
        "#ffbd75",
        "#ffb05c",
        "#ff9e36",
        "#ff9625",
        "#e56a00",
        "#ae5100",
        "#833d00",
        "#612d00",
        "#3d1c00",
        "#2c1400",
      ],
      "deep-orange": [
        "#ffe7e0",
        "#ffb299",
        "#ffa588",
        "#ff8a64",
        "#ff7649",
        "#ff6c3c",
        "#f53100",
        "#b92500",
        "#8a1c00",
        "#561100",
        "#3a0c00",
        "#240700",
      ],
      brown: [
        "#f0e2de",
        "#e5b8aa",
        "#c59485",
        "#b68373",
        "#ac7868",
        "#a47060",
        "#85574a",
        "#724539",
        "#5b3328",
        "#3b1e15",
        "#2c140e",
        "#200e09",
      ],
      "blue-grey": [
        "#e7eff1",
        "#b1c5ce",
        "#9badb6",
        "#8d9fa7",
        "#7a8f98",
        "#718892",
        "#56707c",
        "#40535b",
        "#2f3e45",
        "#1e282c",
        "#182023",
        "#0f1518",
      ],
    };
    this.contrasts = {
      greyColor: {
        aaLarge: [
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 8, max: 12 },
          { min: 10, max: 12 },
          { min: 1, max: 3 },
          { min: 1, max: 5 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
        ],
        aa: [
          //if bold text < 14pt, or text < 18pt
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 8, max: 12 },
          { min: 8, max: 12 },
          { min: 11, max: 12 },
          { min: 1, max: 2 },
          { min: 1, max: 7 },
          { min: 1, max: 7 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
        ],
      },
      colorColor: {
        //if neither the color nor its contrast are grey
        aaLarge: [
          { min: 7, max: 12 },
          { min: 7, max: 12 },
          { min: 8, max: 12 },
          { min: 9, max: 12 },
          { min: 10, max: 12 },
          { min: 11, max: 12 },
          { min: 1, max: 2 },
          { min: 1, max: 3 },
          { min: 1, max: 4 },
          { min: 1, max: 5 },
          { min: 1, max: 6 },
          { min: 1, max: 6 },
        ],
        aa: [
          { min: 8, max: 12 },
          { min: 8, max: 12 },
          { min: 9, max: 12 },
          { min: 9, max: 12 },
          { min: 11, max: 12 },
          { min: 12, max: 12 },
          { min: 1, max: 1 },
          { min: 1, max: 2 },
          { min: 1, max: 4 },
          { min: 1, max: 4 },
          { min: 1, max: 5 },
          { min: 1, max: 5 },
        ],
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-colors-shared-styles";
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
      shade: shade,
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
      index = parseInt(colorShade),
      range = this.contrasts[hasGrey][aa][index];
    return Array(range.max - range.min + 1)
      .fill()
      .map((_, idx) => range.min + idx);
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
    Object.keys(this.colors).forEach((color) => {
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
}
window.customElements.define(
  SimpleColorsSharedStyles.tag,
  SimpleColorsSharedStyles
);
export { SimpleColorsSharedStyles };
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.SimpleColorsSharedStyles.requestAvailability = () => {
  if (window.SimpleColorsSharedStyles.instance == null) {
    window.SimpleColorsSharedStyles.instance = document.createElement(
      "simple-colors-shared-styles"
    );
    window.SimpleColorsSharedStyles.colors =
      window.SimpleColorsSharedStyles.instance.colors;
    window.SimpleColorsSharedStyles.contrasts =
      window.SimpleColorsSharedStyles.instance.contrasts;
    window.SimpleColorsSharedStyles.stylesheet = document.createElement(
      "style"
    );
    window.SimpleColorsSharedStyles.stylesheet.innerHTML = `${SimpleColorsSharedStyles.styles[0].cssText}`;
    document.head.appendChild(window.SimpleColorsSharedStyles.stylesheet);
  }
  return window.SimpleColorsSharedStyles.instance;
};

export const SimpleColorsSharedStylesGlobal = window.SimpleColorsSharedStyles.requestAvailability();
