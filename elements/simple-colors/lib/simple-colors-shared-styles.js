/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

export { SimpleColorsManager };
/**
 * `simple-colors-manager`
 * `a shared set of styles for @lrnwebcomponents`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index2.html
 */
class SimpleColorsManager extends PolymerElement {
  static get is() {
    return "simple-colors-manager";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (!SimpleColorsManager.instance) {
      SimpleColorsManager.instance = this;
    }
  }
}
customElements.define(SimpleColorsManager.is, SimpleColorsManager);

const colors = {
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

SimpleColorsManager.instance = null;
SimpleColorsManager.colors = colors;
SimpleColorsManager.wcagContrast = {
  greyOnColor: {
    //if either the color or its contrast will be a grey
    large: [
      //if bold text >= 14pt, text >= 18pt, decorative only, or disabled
      {
        level: 1, //if the color is level 1
        minLevelContrast: 7, //contrasting color should be >= 8 <=TODO
        maxLevelContrast: 12 //contrasting color should be <= 12
      },
      { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 3, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 4, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 5, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 6, minLevelContrast: 10, maxLevelContrast: 12 },
      { level: 7, minLevelContrast: 1, maxLevelContrast: 3 },
      { level: 8, minLevelContrast: 1, maxLevelContrast: 5 },
      { level: 9, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 10, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 11, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 12, minLevelContrast: 1, maxLevelContrast: 6 }
    ],
    small: [
      //if bold text < 14pt, or text < 18pt
      { level: 1, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 3, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 4, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 5, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 6, minLevelContrast: 11, maxLevelContrast: 12 },
      { level: 7, minLevelContrast: 1, maxLevelContrast: 2 },
      { level: 8, minLevelContrast: 1, maxLevelContrast: 7 },
      { level: 9, minLevelContrast: 1, maxLevelContrast: 7 },
      { level: 10, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 11, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 12, minLevelContrast: 1, maxLevelContrast: 6 }
    ]
  },
  colorOnColor: {
    //if neith the color nor its contras are grey
    large: [
      { level: 1, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
      { level: 3, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 4, minLevelContrast: 9, maxLevelContrast: 12 },
      { level: 5, minLevelContrast: 10, maxLevelContrast: 12 },
      { level: 6, minLevelContrast: 11, maxLevelContrast: 12 },
      { level: 7, minLevelContrast: 1, maxLevelContrast: 2 },
      { level: 8, minLevelContrast: 1, maxLevelContrast: 3 },
      { level: 9, minLevelContrast: 1, maxLevelContrast: 4 },
      { level: 10, minLevelContrast: 1, maxLevelContrast: 5 },
      { level: 11, minLevelContrast: 1, maxLevelContrast: 6 },
      { level: 12, minLevelContrast: 1, maxLevelContrast: 6 }
    ],
    small: [
      { level: 1, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 2, minLevelContrast: 8, maxLevelContrast: 12 },
      { level: 3, minLevelContrast: 9, maxLevelContrast: 12 },
      { level: 4, minLevelContrast: 9, maxLevelContrast: 12 },
      { level: 5, minLevelContrast: 11, maxLevelContrast: 12 },
      { level: 6, minLevelContrast: 12, maxLevelContrast: 12 },
      { level: 7, minLevelContrast: 1, maxLevelContrast: 1 },
      { level: 8, minLevelContrast: 1, maxLevelContrast: 2 },
      { level: 9, minLevelContrast: 1, maxLevelContrast: 4 },
      { level: 10, minLevelContrast: 1, maxLevelContrast: 4 },
      { level: 11, minLevelContrast: 1, maxLevelContrast: 5 },
      { level: 12, minLevelContrast: 1, maxLevelContrast: 5 }
    ]
  }
};

SimpleColorsManager.requestAvailability = function(element) {
  document.addEventListener("DOMContentLoaded", function(event) {
    if (!SimpleColorsManager.instance) {
      SimpleColorsManager.instance = document.createElement(
        "simple-colors-manager"
      );
    }
    document.body.appendChild(SimpleColorsManager.instance);
  });
};
/**
 * gets the correct hexCode for a color level,
 * depending on whether or not the list is dark (inverted)
 */
const getHex = function(hexcodes, index, dark) {
  if (dark) {
    return hexcodes[hexcodes.length - index - 1];
  } else {
    return hexcodes[index];
  }
};
/**
 * adds all CSS variables for a given theme (default, dark, or light)
 */
const addThemeVariables = function(theme, dark) {
  let str = [];
  for (name in colors) {
    str.push(addColorLevels(theme, name, colors[name], dark));
  }
  return str.join("");
};
/**
 * adds CSS variables for all levels of contrast for a given theme+color
 * and assigns a hex code to it
 */
const addColorLevels = function(theme, color, hexcodes, dark) {
  let str = [];
  for (let i = 0; i < hexcodes.length; i++) {
    str.push(
      "  --simple-colors-" +
        theme +
        "-theme-" +
        color +
        "-" +
        (i + 1) +
        ": " +
        getHex(hexcodes, i, dark) +
        ";\n"
    );
  }
  return str.join("");
};
/**
 * adds all CSS variables as styles for :host and :host([dark]) selectors
 */
const addCssVariables = function() {
  let greys = colors["grey"],
    str = [];
  str.push(
    addStyle(
      ":host",
      addColorLevels("default", "accent", greys, false) +
        addThemeVariables("default", false)
    )
  );
  str.push(
    addStyle(
      ":host",
      addColorLevels("light", "accent", greys, false) +
        addThemeVariables("light", false)
    )
  );
  str.push(
    addStyle(
      ":host",
      addColorLevels("dark", "accent", greys, true) +
        addThemeVariables("dark", true)
    )
  );
  str.push(
    addStyle(
      ":host([dark])",
      addColorLevels("default", "accent", greys, true) +
        addThemeVariables("default", true)
    )
  );
  return str.join("");
};
/**
 * adds all CSS accent color variables as styles for :host([accent-color]]) selectors
 */
const addAccentVariables = function() {
  let str = [];
  for (let color in colors) {
    str.push(
      addStyle(
        ':host([accent-color="' + color + '"])',
        [
          addColorLevels("default", "accent", colors[color], false),
          addColorLevels("light", "accent", colors[color], false),
          addColorLevels("dark", "accent", colors[color], true)
        ].join("")
      )
    );

    str.push(
      addStyle(
        ':host([dark][accent-color="' + color + '"])',
        [addColorLevels("default", "accent", colors[color], true)].join("")
      )
    );
  }
  return str.join("");
};
/**
 * adds all CSS color classes for a given theme
 */
const addClasses = function() {
  let themes = ["default", "light", "dark"],
    str = [];
  for (let i = 0; i < themes.length; i++) {
    let substr = [];
    for (let j = 0; j < colors["grey"].length; j++) {
      let prefix = "simple-colors-" + themes[i] + "-theme";
      substr.push(addColorClasses(prefix + "-accent-" + (j + 1)));
      for (let color in colors) {
        substr.push(addColorClasses(prefix + "-" + color + "-" + (j + 1)));
      }
    }
    str.push("<style>\n" + substr.join("") + "\n</style>\n");
  }
  return str.join("");
};
/**
 * adds background color, text color, and border color classes
 * for a given level of a theme + color
 */
const addColorClasses = function(cssvar) {
  return [
    "." + cssvar + " { background-color: var(--" + cssvar + "); }\n",
    "." + cssvar + "-text { color: var(--" + cssvar + "); }\n",
    "." + cssvar + "-border-color { border-color: var(--" + cssvar + "); }\n"
  ].join("");
};
const addStyle = function(selector, style) {
  return "<style>\n" + selector + " {\n" + style + "\n}\n</style>\n";
};

/**
 * append and register the shared styles
 */
const styleElement = document.createElement("dom-module"),
  template = document.createElement("template");
template.innerHTML = addCssVariables() + addAccentVariables() + addClasses();
styleElement.appendChild(html`${template}`);
styleElement.register("simple-colors-shared-styles");
