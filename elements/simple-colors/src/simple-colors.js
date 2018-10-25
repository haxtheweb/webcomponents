import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/simple-colors-utility.js";
// @polymerBehavior
/**
`simple-colors-behaviors`
A set of theming and accent color behaviors for components.
@microcopy - the mental model for this element
 - 
 - 
*/
window.simpleColorsBehaviors = window.simpleColorsBehaviors || {};
window.simpleColorsBehaviors = {
  properties: {
    /**
     * Accent color on UI. Default is greyscale.
     */

    accentColor: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /**
     * Dark colors for UI? Default is false (light).
     */
    dark: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Stores hex codes for accessible colors.
     */
    __hexCodes: {
      type: Object,
      value: null
    },
    /**
     * Stores light theme values
     */
    __lightTheme: {
      type: Object,
      computed: "_getLightTheme(__hexCodes)"
    },
    /**
     * Stores dark theme values
     */
    __darkTheme: {
      type: Object,
      computed: "_getDarkTheme(__hexCodes)"
    }
  },

  observers: ["setTheme(accentColor,dark,__hexCodes)"],
  /**
   * Set color variables. Set variables for element and for slotted content.
   */
  created: function() {
    Polymer.SimpleColorsUtility.requestAvailability();
    this.__wcagaa = {
      /* a given color's highest level of WCAG 2.00 AA contrasting color by level 
          based on text size and level of color, for example: 
          --simple-colors-foreground5: 
            -background1 in small text, 
            -background1 or -background2 for large text
          --simple-colors-green-foreground4: 
            -background1 in small text, 
            -background1 or -background2 for large text
          --simple-colors-green-foreground5: 
            no colors in small text, 
            -background1 for large text
      */
      greys: { small: [5, 5, 4, 4, 1], large: [5, 5, 5, 4, 2] },
      colors: { small: [4, 3, 3, 1, 0], large: [5, 4, 3, 2, 1] }
    };
  },
  ready: function() {
    this.__hexCodes = Polymer.SimpleColorsUtility.hexCodes;
  },

  setTheme: function(accentColor, dark, hexCodes) {
    if (hexCodes !== null && hexCodes !== "") {
      if (accentColor !== null && accentColor !== "") {
        let prop = accentColor.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase();
        });
        if (this.__lightTheme.hasOwnProperty(prop)) {
          this.__lightTheme.accent = this.__lightTheme[prop].slice();
          this.__darkTheme.accent = this.__darkTheme[prop].slice();
        } else {
          this.__lightTheme.accent = this.__hexCodes.accent.slice();
          this.__darkTheme.accent = this.__hexCodes.accent.slice().reverse();
        }
      }
      this._setThemeProps("--simple-colors-light-theme-", this.__lightTheme);
      this._setThemeProps("--simple-colors-dark-theme-", this.__darkTheme);

      if (dark) {
        this._setThemeProps("--simple-colors-", this.__darkTheme);
      } else {
        this._setThemeProps("--simple-colors-", this.__lightTheme);
      }
    }
  },

  _setProps: function(prefix, colors) {
    prefix = prefix
      .replace("-grey", "")
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
    for (let i = 0; i < colors.length; i++) {
      let half = colors.length / 2,
        suffix =
          i < half
            ? "-foreground" + (i + 1)
            : "-background" + (colors.length - i);
      if (
        this.customStyle !== null &&
        this.customStyle[prefix + suffix] !== null
      )
        this.customStyle[prefix + suffix] = colors[i];
    }
    this.updateStyles();
  },
  _setThemeProps: function(themePrefix, theme) {
    for (var property in theme) {
      if (theme.hasOwnProperty(property)) {
        this._setProps(themePrefix + property, theme[property]);
      }
    }
  },
  _getLightTheme: function(hexCodes) {
    let setThemeProps = function(themePrefix, theme) {
      for (var property in theme) {
        if (theme.hasOwnProperty(property)) {
          this._setProps(themePrefix + property, theme[property]);
        }
      }
    };
    this._setThemeProps("--simple-colors-", hexCodes);
    this._setThemeProps("--simple-colors-light-theme-", hexCodes);
    return hexCodes;
  },
  _getDarkTheme: function(hexCodes) {
    let dark = {};
    for (var property in hexCodes) {
      if (hexCodes.hasOwnProperty(property)) {
        dark[property] = hexCodes[property].slice().reverse();
      }
    }
    this._setThemeProps("--simple-colors-dark-theme-", dark);
    return dark;
  },
  getContrasts: function(theme, isColor, isForeground, level, isSmallText) {
    isSmallText = isSmallText !== undefined ? isSmallText : true;
    /*  Small text requires the highest contrast ratio for WCAG 2.0 AA compliance. 
        Small text is any content that is NOT:
        - bold text that is 14 point or higher,
        - text that is 18 point or higher,
        - a decorative element that has no semantic meaning, such as a border, or
        - a disabled UI element */
    let results = [];
    let data = isColor ? this.__wcagaa.colors : this.__wcagaa.greys,
      levels = data.small[level - 1];
    if (!isSmallText) levels = data.large[level - 1];
    for (let i = 0; i < levels; i++) {
      let suffix = isForeground ? "-background" : "-foreground",
        index =
          (isForeground && theme === "light") ||
          (!isForeground && theme === "dark")
            ? i + 1
            : levels - (i - 1);

      if (!isColor) {
        for (var property in this.__hexCodes) {
          if (property !== "colorLevels") {
            let color =
              property === "grey"
                ? ""
                : "-" +
                  property.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
            results.push({
              variable:
                "--simple-colors-" +
                theme +
                "-theme" +
                color +
                suffix +
                (i + 1),
              hexCode: this.__hexCodes[property][index]
            });
          }
        }
      } else {
        results.push({
          variable:
            "--simple-colors-" + theme + "-theme" + color + suffix + (i + 1),
          hexCode: this.__hexCodes[property][index]
        });
      }
    }
    return results;
  }
};
