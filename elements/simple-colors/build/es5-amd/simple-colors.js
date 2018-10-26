define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/simple-colors-utility.js"
], function() {
  "use strict";
  window.simpleColorsBehaviors = window.simpleColorsBehaviors || {};
  window.simpleColorsBehaviors = {
    properties: {
      accentColor: { type: String, value: null, reflectToAttribute: !0 },
      dark: { type: Boolean, value: !1, reflectToAttribute: !0 },
      __hexCodes: { type: Object, value: null },
      __lightTheme: { type: Object, computed: "_getLightTheme(__hexCodes)" },
      __darkTheme: { type: Object, computed: "_getDarkTheme(__hexCodes)" }
    },
    observers: ["setTheme(accentColor,dark,__hexCodes)"],
    created: function created() {
      window.SimpleColorsUtility.requestAvailability();
      this.__wcagaa = {
        greys: { small: [5, 5, 4, 4, 1], large: [5, 5, 5, 4, 2] },
        colors: { small: [4, 3, 3, 1, 0], large: [5, 4, 3, 2, 1] }
      };
    },
    ready: function ready() {
      this.__hexCodes = window.SimpleColorsUtility.hexCodes;
    },
    setTheme: function setTheme(accentColor, dark, hexCodes) {
      if (null !== hexCodes && "" !== hexCodes) {
        if (null !== accentColor && "" !== accentColor) {
          var prop = accentColor.replace(/-([a-z])/g, function(g) {
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
    _setProps: function _setProps(prefix, colors) {
      prefix = prefix
        .replace("-grey", "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();
      for (var customStyle = {}, i = 0; i < colors.length; i++) {
        var half = colors.length / 2,
          suffix =
            i < half
              ? "-foreground" + (i + 1)
              : "-background" + (colors.length - i);
        if (null !== customStyle && null !== customStyle[prefix + suffix]) {
          customStyle[prefix + suffix] = colors[i];
        }
      }
      this.updateStyles(customStyle);
    },
    _setThemeProps: function _setThemeProps(themePrefix, theme) {
      for (var property in theme) {
        if (theme.hasOwnProperty(property)) {
          this._setProps(themePrefix + property, theme[property]);
        }
      }
    },
    _getLightTheme: function _getLightTheme(hexCodes) {
      this._setThemeProps("--simple-colors-", hexCodes);
      this._setThemeProps("--simple-colors-light-theme-", hexCodes);
      return hexCodes;
    },
    _getDarkTheme: function _getDarkTheme(hexCodes) {
      var dark = {};
      for (var property in hexCodes) {
        if (hexCodes.hasOwnProperty(property)) {
          dark[property] = hexCodes[property].slice().reverse();
        }
      }
      this._setThemeProps("--simple-colors-dark-theme-", dark);
      return dark;
    },
    getContrasts: function getContrasts(
      theme,
      isColor,
      isForeground,
      level,
      isSmallText
    ) {
      isSmallText = isSmallText !== void 0 ? isSmallText : !0;
      var results = [],
        data = isColor ? this.__wcagaa.colors : this.__wcagaa.greys,
        levels = data.small[level - 1];
      if (!isSmallText) levels = data.large[level - 1];
      for (var i = 0; i < levels; i++) {
        var suffix = isForeground ? "-background" : "-foreground",
          index =
            (isForeground && "light" === theme) ||
            (!isForeground && "dark" === theme)
              ? i + 1
              : levels - (i - 1);
        if (!isColor) {
          for (var property in this.__hexCodes) {
            if ("colorLevels" !== property) {
              var _color =
                "grey" === property
                  ? ""
                  : "-" +
                    property.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
              results.push({
                variable:
                  "--simple-colors-" +
                  theme +
                  "-theme" +
                  _color +
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
});
