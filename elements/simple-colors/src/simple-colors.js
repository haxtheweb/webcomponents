/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lib/simple-colors-styles.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
/**
 * `simple-colors`
 * `a shared set of styles for @lrnwebcomponents`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html overview and demo
 * @demo demo/colors.html all of the colors
 * @demo demo/contrasts.html WCAG 2.0 AA Contrasts
 * @demo demo/picker.html simple-colors-picker
 * @demo demo/extending.html extending simple-colors
 * @demo demo/variables.html using simple-colors variables
 * @demo demo/classes.html using simple-colors classes
 */
class SimpleColors extends PolymerElement {
  static get is() {
    return "simple-colors";
  }

  static get properties() {
    return {
      /**
       * a selected accent-color: grey, red, pink, purple, etc.
       */
      accentColor: {
        name: "accentColor",
        type: "String",
        value: "grey",
        reflectToAttribute: true,
        notify: true
      },
      /**
       * make the default theme dark?
       */
      dark: {
        name: "dark",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        notify: true
      },
      /**
       * the colors object, eg.:
       * {
       *    "grey": [ "#ffffff", "#eeeeee", ... "#111111","#000000" ],
       *    "red": [ "#ffdddd", "#ffaeae", ... "#520000", "#3f0000" ],
       *    ...
       * }
       */
      colors: {
        name: "colors",
        type: "Object",
        value: {
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
        },
        reflectToAttribute: false,
        observer: false
      },
      /**
       * object with information on which color combinations are WCAG 2.0AA compliant, eg: {
       *    greyOnColor: { //if either the color or its contrast will be a grey
       *      large: [ //if bold text >= 14pt, text >= 18pt, decorative only, or disabled
       *        {
       *          level: 1, //if the color is level 1
       *          minLevelContrast: 7, //contrasting color should be >= 8 <=TODO
       *          maxLevelContrast: 12 //contrasting color should be <= 12
       *        },
       *        { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
       *        ...
       *      ],
       *      small: [ //if bold text < 14pt, or text < 18pt
       *        { level: 1, minLevelContrast: 7, maxLevelContrast: 12 },
       *        { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
       *        ...
       *      ]
       *    },
       *    colorOnColor: { //if neither the color nor its contrast are grey
       *      large: [
       *        { level: 1, minLevelContrast: 7, maxLevelContrast: 12 },
       *        { level: 2, minLevelContrast: 7, maxLevelContrast: 12 },
       *        ...
       *      ],
       *      small: [
       *        { level: 1, minLevelContrast: 8, maxLevelContrast: 12 },
       *        { level: 2, minLevelContrast: 8, maxLevelContrast: 12 },
       *        ...
       *      ]
       *    }
       *  }
       */
      contrasts: {
        name: "contrasts",
        type: "Object",
        value: {
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
            //if neither the color nor its contrast are grey
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
        },
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors"></style> <slot></slot>
    `;
  }

  static connectedCallback() {
    super.connectedCallback();
    let json =
      pathFromUrl(decodeURIComponent(import.meta.url)) +
      "/lib/simple-colors.json";
    this.appendChild(style);
    fetch(json)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        this.set("colors", json.colors.value);
        this.set("contrasts", json.contrasts.value);
      });
  }

  /**
   * for a given simple-colors variable and WCAG 2.0AA-defined text size (large or small),
   * returns an array with variable names and and hex codes of WCAG 2.0AA-compliant contrasting colors, eg:
   * ```[
   *    { "color": "--simple-colors-light-theme-grey-2", "hex": "#eeeeee" },
   *    { "color": "--simple-colors-light-theme-red-2", "hex": "#ffaeae" },
   *    ...
   * ]```
   *
   * @param {string} the css variable for which contrasting colors are needed, eg. "--simple-colors-light-theme-grey-12"
   * @param {boolean} contrast with WCAG 2.0AA-defined large text (bold >= 14pt or normal >= 18pt)
   * @return {Array}
   */
  getContrasts(variable, large) {
    large = large !== undefined && large !== null ? large : false;
    let contrasts = [],
      details = variable.replace("--", "").split("-"),
      theme = details[2],
      grey = details[4] === "grey";
    for (let color in this.colors) {
      let wcag =
          this.colors[color] === "grey" || grey
            ? this.contrasts.colorOnColor
            : this.contrasts.greyOnColor,
        largeOrSmall = large ? wcag.large : wcag.small,
        colorLevel = largeOrSmall[details[5] - 1],
        min = colorLevel.minLevelContrast - 1,
        max = colorLevel.maxLevelContrast - 1;
      for (let i = min; i <= max; i++) {
        contrasts.push({
          color: "--simple-colors-" + [theme, "theme", color, i + 1].join("-"),
          hex: this.colors[color][i]
        });
      }
    }
    return contrasts;
  }
}
customElements.define(SimpleColors.is, SimpleColors);
export { SimpleColors };
