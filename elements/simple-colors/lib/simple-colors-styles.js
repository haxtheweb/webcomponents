/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `rich-text-editor-styles`
 * `a shared set of styles for rich-text-editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 * @see lib/rich-text-editor-styles-demo.js
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

window.SimpleColorsUtilities = window.SimpleColorsUtilities || {};
const utils = window.SimpleColorsUtilities;
/**
 * The colors object.
 * Each color contains an array of shades as hex codes from lightest to darkest.
 */
window.SimpleColorsUtilities.colors = {
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
    "#000000"
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
    "#3f0000"
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
    "#440019"
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
    "#200025"
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
    "#1d0033"
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
    "#0a0030"
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
    "#001333"
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
    "#001b36"
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
    "#001a20"
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
    "#001b14"
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
    "#001d0c"
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
    "#0d2000"
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
    "#182400"
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
    "#242400"
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
    "#221a00"
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
    "#2c1400"
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
    "#240700"
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
    "#200e09"
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
    "#0f1518"
  ]
};
/**
 * Object with information on which color combinations are WCAG 2.0AA compliant, eg: ```
  {
    greyColor: {          //if either the color or its contrast will be a grey
      aaLarge: [          //if bold text >= 14pt, text >= 18pt, decorative only, or disabled
        {                 //for the first shade of a color
          min: 7,         //index of the lightest contrasting shade of another color
          max: 12         //index of the darkest contrasting shade of another color
        },
        ...
      ],
      aa: [ ... ]         //if bold text < 14pt, or text < 18pt
    },
    colorColor: { ... }   //if neither the color nor its contrast are grey
  }```
*/
const contrasts = {
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
      { min: 1, max: 6 }
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
      { min: 1, max: 6 }
    ]
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
      { min: 1, max: 6 }
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
      { min: 1, max: 5 }
    ]
  }
};

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
utils.getContrastingShades = (isLarge, colorName, colorShade, contrastName) => {
  let hasGrey =
      colorName === "grey" || contrastName === "grey"
        ? "greyColor"
        : "colorColor",
    aa = isLarge ? "aaLarge" : "aa",
    index = parseInt(colorShade) + 1,
    range = contrasts[hasGrey][aa][index];
  return Array(range.max - range.min + 1)
    .fill()
    .map((_, idx) => range.min + idx);
};

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
utils.getContrastingColors = (colorName, colorShade, isLarge) => {
  let result = {};
  Object.keys(utils.colors).forEach(color => {
    result[color] = utils.getContrastingShades(
      isLarge,
      colorName,
      colorShade,
      color
    );
  });
  return result.color;
};
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
utils.isContrastCompliant = (
  isLarge,
  colorName,
  colorShade,
  contrastName,
  contrastShade
) => {
  let hasGrey =
      colorName === "grey" || contrastName === "grey"
        ? "greyColor"
        : "colorColor",
    aa = isLarge ? "aaLarge" : "aa",
    index = parseInt(colorShade) + 1,
    range = contrasts[hasGrey][aa][index];
  return contrastShade >= range.min && ontrastShade >= range.max;
};

/**
 * gets the current shade based on the index
 *
 * @param {string} the index
 * @param {number} the shade
 */
utils.indexToShade = index => {
  return parseInt(index) + 1;
};

/**
 * gets the current shade based on the index
 *
 * @param {string} the shade
 * @param {number} the index
 */
utils.shadeToIndex = shade => {
  return parseInt(shade) - 1;
};

/**
 * gets the current shade
 *
 * @param {string} the shade
 * @param {number} the inverted shade
 */

utils.invertShade = shade => {
  return utils.colors["grey"].length + 1 - parseInt(shade);
};

/**
 * inverts the current index
 *
 * @param {string} the index
 * @param {number} the inverted index
 */
utils.invertIndex = index => {
  return utils.colors["grey"].length - 1 - parseInt(index);
};

/**
 * returns the maximum contrast to the index
 *
 * @param {string} the index
 * @param {number} the index with maximum contrast
 */
utils.maxContrastIndex = index => {
  return parseInt(index) < utils.colors["grey"].length / 2
    ? utils.colors["grey"].length - 1
    : 0;
};

/**
 * returns the maximum contrast to the shade
 *
 * @param {string} the shade
 * @param {number} the shade with maximum contrast
 */
utils.maxContrastShade = shade => {
  return parseInt(shade) < utils.colors["grey"].length / 2 + 1
    ? utils.colors["grey"].length
    : 1;
};

/**
 * returns a variable based on color name, shade, and fixed theme
 *
 * @param {string} the color name
 * @param {number} the color shade
 * @param {boolean} the color shade
 * @returns {string} the CSS Variable
 */
utils.makeVariable = (color = "grey", shade = 1, theme = "default") => {
  return ["--simple-colors", theme, "theme", color, shade].join("-");
};

/**
 * returns a variable based on color name, shade, and fixed theme
 *
 * @param {string} the color name
 * @param {number} the color shade
 * @param {boolean} the color shade
 * @returns {string} the CSS class
 */
utils.makeClass = (
  color = "grey",
  shade = 1,
  theme = "default",
  suffix = ""
) => {
  return [".simple-colors", theme, "theme", color, shade].join("-") + suffix;
};

/**
 * gets the correct hexCode for a color shade,
 * depending on whether or not the list is dark (inverted)
 */
utils.getHex = (hexcodes, index, dark) => {
  if (dark) {
    return hexcodes[utils.invertIndex(utils.colors, index)];
  } else {
    return hexcodes[index];
  }
};
/**
 * adds all CSS variables for a given theme (default, dark, or light)
 */
utils.addThemeVariables = (theme, dark) => {
  let str = [];
  for (var name in utils.colors) {
    str.push(utils.addColorShades(theme, name, utils.colors[name], dark));
  }
  return str.join("");
};
/**
 * adds CSS variables for all shades of contrast for a given theme+color
 * and assigns a hex code to it
 *
 * @returns {string}
 */
utils.addColorShades = (theme, color, hexcodes, dark) => {
  let str = [];
  for (let i = 0; i < hexcodes.length; i++) {
    let cssvar = utils.makeVariable(color, i + 1, theme),
      hex = dark ? hexcodes[utils.invertIndex(i)] : hexcodes[i];
    str.push(cssvar + ":" + hex + "; ");
  }
  return str.join("");
};
/**
 * adds all CSS variables as styles for :host and :host([dark]) selectors
 *
 * @returns {string}
 */
utils.addCssVariables = () => {
  let str = [],
    greys = utils.colors["grey"];
  str.push(
    utils.addStatement(
      ":host",
      utils.addColorShades("default", "accent", greys, false) +
        utils.addThemeVariables("default", false)
    )
  );
  str.push(
    utils.addStatement(
      ":host",
      utils.addColorShades("fixed", "accent", greys, false) +
        utils.addThemeVariables("fixed", false)
    )
  );

  /**
   * dark and light themes will be deprecated
   * in favor of default and fixed themes
   */
  str.push(
    utils.addStatement(
      ":host",
      utils.addColorShades("light", "accent", greys, false) +
        utils.addThemeVariables("light", false)
    )
  );

  str.push(
    utils.addStatement(
      ":host",
      utils.addColorShades("dark", "accent", greys, true) +
        utils.addThemeVariables("dark", true)
    )
  );
  str.push(
    utils.addStatement(
      ":host([dark])",
      utils.addColorShades("default", "accent", greys, true) +
        utils.addThemeVariables("default", true)
    )
  );
  return utils.addStyle(str.join(""));
};
/**
 * adds all CSS accent color variables as styles for :host([accent-color]]) selectors
 *
 * @returns {object}
 */
utils.addAccentVariables = () => {
  let str = [];
  for (let color in utils.colors) {
    str.push(
      utils.addStatement(
        ':host([accent-color="' + color + '"])',
        [
          utils.addColorShades("default", "accent", utils.colors[color], false),
          utils.addColorShades("fixed", "accent", utils.colors[color], false),
          utils.addColorShades("light", "accent", utils.colors[color], false),
          utils.addColorShades("dark", "accent", utils.colors[color], true)
        ].join("")
      )
    );

    str.push(
      utils.addStatement(
        ':host([dark][accent-color="' + color + '"])',
        [
          utils.addColorShades("default", "accent", utils.colors[color], true)
        ].join("")
      )
    );
  }
  return utils.addStyle(str.join(""));
};
/**
 * adds all CSS color classes for a given theme
 *
 * @returns {object}
 */
utils.addClasses = () => {
  let themes = ["default", "fixed", "light", "dark"],
    str = [];
  for (let i = 0; i < themes.length; i++) {
    for (let j = 0; j < utils.colors["grey"].length; j++) {
      let bg = ":host " + utils.makeClass("accent", j + 1, themes[i]),
        cssvar = utils.makeVariable("accent", j + 1, themes[i]);
      str.push(
        [
          utils.addStatement(bg, "background-color: var(" + cssvar + ");"),
          utils.addStatement(bg + "-text", "color: var(" + cssvar + ");"),
          utils.addStatement(
            bg + "-border",
            "border: 1px solid var(" + cssvar + ");"
          )
        ].join("")
      );
      for (let color in utils.colors) {
        let bg = ":host " + utils.makeClass(color, i + 1, themes[i]),
          cssVar = utils.makeVariable(color, i + 1, themes[i]);
        str.push(
          [
            utils.addStatement(bg, "background-color: var(" + cssvar + ");"),
            utils.addStatement(bg + "-text", "color: var(" + cssvar + ");"),
            utils.addStatement(
              bg + "-border",
              "border: 1px solid var(" + cssvar + ");"
            )
          ].join("")
        );
      }
    }
  }
  return utils.addStyle(str.join(""));
};
utils.addStatement = (selector, style) => {
  return selector + " {\n" + style + "\n}\n";
};
utils.addStyle = content => {
  return "<style>\n" + content + "\n</style>\n";
};
utils.testStyle = str => {
  let temp = document.createElement("template");
  temp.innerHTML = utils.addStyle(str);
  console.log(temp);
};

/**
 * append and register the shared styles
 */
const template = document.createElement("template"),
  styleElement = document.createElement("dom-module");

template.innerHTML =
  utils.addCssVariables() + utils.addAccentVariables() + utils.addClasses();
styleElement.appendChild(template);
styleElement.register("simple-colors");
