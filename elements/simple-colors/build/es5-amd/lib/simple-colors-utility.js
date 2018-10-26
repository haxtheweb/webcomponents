define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  window.SimpleColorsUtility = (0, _polymerLegacy.Polymer)({
    is: "simple-colors-utility"
  });
  window.SimpleColorsUtility.instance = null;
  window.SimpleColorsUtility.hexCodes = {
    colorLevels: [
      "foreground1",
      "foreground2",
      "foreground3",
      "foreground4",
      "foreground5",
      "background5",
      "background4",
      "background3",
      "background2",
      "background1"
    ],
    grey: [
      "#000000",
      "#111111",
      "#222222",
      "#444444",
      "#666666",
      "#999999",
      "#bbbbbb",
      "#dddddd",
      "#eeeeee",
      "#ffffff"
    ],
    accent: [
      "#000000",
      "#111111",
      "#222222",
      "#444444",
      "#666666",
      "#999999",
      "#bbbbbb",
      "#dddddd",
      "#eeeeee",
      "#ffffff"
    ],
    red: [
      "#520000",
      "#670000",
      "#850000",
      "#ac0000",
      "#ee0000",
      "#ff2222",
      "#fd5151",
      "#ff7474",
      "#ff8f8f",
      "#ffaeae"
    ],
    pink: [
      "#5a0020",
      "#78002b",
      "#980036",
      "#b80042",
      "#da004e",
      "#ff3996",
      "#fd60aa",
      "#ff73b5",
      "#ff87c0",
      "#ffa5cf"
    ],
    purple: [
      "#33003a",
      "#490052",
      "#6c0079",
      "#8a009b",
      "#a500ba",
      "#e200ff",
      "#ed61ff",
      "#f07cff",
      "#f394ff",
      "#f4affd"
    ],
    deepPurple: [
      "#2a0049",
      "#3a0063",
      "#4c0081",
      "#5d009f",
      "#7e00d8",
      "#a931ff",
      "#b44aff",
      "#bb63f9",
      "#c97eff",
      "#ddacff"
    ],
    indigo: [
      "#100049",
      "#160063",
      "#20008c",
      "#2801b0",
      "#3a00ff",
      "#835fff",
      "#9373ff",
      "#9e82ff",
      "#af97ff",
      "#c3b2ff"
    ],
    blue: [
      "#001947",
      "#002569",
      "#003494",
      "#0041bb",
      "#0059ff",
      "#4083ff",
      "#5892fd",
      "#74a5ff",
      "#95baff",
      "#acc9ff"
    ],
    lightBlue: [
      "#002850",
      "#003f7d",
      "#0055a8",
      "#0066ca",
      "#007ffc",
      "#41a1ff",
      "#58adff",
      "#65b3ff",
      "#92c9ff",
      "#a1d1ff"
    ],
    cyan: [
      "#002c38",
      "#003f50",
      "#005970",
      "#007999",
      "#009dc7",
      "#00c9ff",
      "#1ccfff",
      "#33d4ff",
      "#77e2ff",
      "#9beaff"
    ],
    teal: [
      "#002a20",
      "#003829",
      "#004e3a",
      "#007658",
      "#009d75",
      "#00ff9c",
      "#29ffac",
      "#56ffbd",
      "#79ffcb",
      "#98ffd7"
    ],
    green: [
      "#002a11",
      "#003d18",
      "#005a23",
      "#00762e",
      "#008c37",
      "#00f961",
      "#24ff70",
      "#49ff88",
      "#79ffa7",
      "#acffc9"
    ],
    lightGreen: [
      "#143000",
      "#1b3f00",
      "#296100",
      "#357f00",
      "#429d00",
      "#6fff00",
      "#8efd38",
      "#a1fd5a",
      "#b1ff75",
      "#c7ff9b"
    ],
    lime: [
      "#223400",
      "#293f00",
      "#3b5a00",
      "#4d7600",
      "#649900",
      "#aeff00",
      "#bdff2d",
      "#caff58",
      "#d4ff77",
      "#dfff9b"
    ],
    yellow: [
      "#303000",
      "#454400",
      "#585700",
      "#787700",
      "#929100",
      "#f6f600",
      "#ffff3a",
      "#ffff7c",
      "#ffff90",
      "#ffffac"
    ],
    amber: [
      "#302500",
      "#413200",
      "#614b00",
      "#876800",
      "#b28900",
      "#ffc500",
      "#ffc235",
      "#ffcf5e",
      "#ffd677",
      "#ffdf92"
    ],
    orange: [
      "#3d1c00",
      "#612d00",
      "#833d00",
      "#ae5100",
      "#e56a00",
      "#ff9625",
      "#ff9e36",
      "#ffb05c",
      "#ffbd75",
      "#ffca92"
    ],
    deepOrange: [
      "#3a0c00",
      "#561100",
      "#8a1c00",
      "#b92500",
      "#f53100",
      "#ff6c3c",
      "#ff7649",
      "#ff8a64",
      "#ffa588",
      "#ffb299"
    ],
    brown: [
      "#2c140e",
      "#3b1e15",
      "#5b3328",
      "#724539",
      "#85574a",
      "#a47060",
      "#ac7868",
      "#b68373",
      "#c59485",
      "#e5b8aa"
    ],
    blueGrey: [
      "#182023",
      "#1e282c",
      "#2f3e45",
      "#40535b",
      "#56707c",
      "#718892",
      "#7a8f98",
      "#8d9fa7",
      "#9badb6",
      "#b1c5ce"
    ]
  };
  window.SimpleColorsUtility.addStyles = function() {
    var root = this,
      css = "",
      addTheme = function(selector, prefix, reverse) {
        css += selector + " { ";
        for (var property in root.hexCodes) {
          if (
            "colorLevels" !== property &&
            root.hexCodes.hasOwnProperty(property)
          ) {
            for (
              var val = reverse
                  ? root.hexCodes[property].slice().reverse()
                  : root.hexCodes[property].slice(),
                prop =
                  "grey" !== property
                    ? "--simple-colors" +
                      prefix +
                      "-" +
                      property.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
                    : "--simple-colors" + prefix,
                i = 0,
                suffix;
              10 > i;
              i++
            ) {
              suffix = "-" + root.hexCodes.colorLevels[i];
              css += prop + suffix + ": " + val[i] + ";";
            }
          }
        }
        css += " } \n\n";
        return css;
      },
      addClasses = function() {
        for (var property in root.hexCodes) {
          if (
            "colorLevels" !== property &&
            root.hexCodes.hasOwnProperty(property)
          ) {
            for (
              var val = root.hexCodes[property].slice(),
                _prefix = "simple-colors-",
                prop =
                  "grey" !== property
                    ? property.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
                    : "",
                i = 0,
                suffix;
              10 > i;
              i++
            ) {
              suffix = root.hexCodes.colorLevels[i];
              css += addClass(
                prop,
                _prefix,
                suffix,
                "",
                "background-color",
                val[i]
              );
              css += addClass(prop, _prefix, suffix, "-text", "color", val[i]);
              css += addClass(
                prop,
                _prefix,
                suffix,
                "-border",
                "border-color",
                val[i]
              );
            }
          }
        }
        css += "\n";
        return css;
      },
      addClass = function(prop, prefix, suffix, type, style, hex) {
        var color = "" === prop ? "none" : prop,
          accent = prefix + "accent-" + suffix + type,
          varName =
            "" === prop ? prefix + prop + suffix : prefix + prop + "-" + suffix,
          grey = "" === prop ? "." + accent + ", \n" : "",
          css =
            "accent" === prop
              ? ""
              : "." +
                varName +
                type +
                ", \n" +
                grey +
                '[accent-color="' +
                color +
                '"] .' +
                accent +
                " { \n\t" +
                style +
                ": var(--" +
                varName +
                ", " +
                hex +
                "); \n}\n";
        return css;
      },
      addAccent = function(prefix, color) {
        for (var i = 0; 10 > i; i++) {
          var suffix = 5 > i ? "-foreground" : "-background",
            level = 5 > i ? i + 1 : i - 4,
            val =
              "grey" !== color
                ? prefix + color + suffix + level
                : prefix + suffix + level;
          css += prefix + "-accent" + suffix + level + ": var(" + val + ");";
        }
      },
      head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");
    addTheme("html", "-light-theme", !1);
    addTheme("html", "-dark-theme", !0);
    addTheme('html, *[dark="false"]', "", !1);
    addTheme("*[dark]", "", !0);
    addClasses("");
    for (var property in root.hexCodes) {
      if ("accent" !== property && "colorLevels" !== property) {
        property = property.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        var color = "grey" !== property ? "-" + property : "",
          selector = "grey" !== property ? property : "none";
        css += '*[accent-color="' + selector + '"] { ';
        addAccent("--simple-colors", color);
        addAccent("--simple-colors-light-theme", color);
        addAccent("--simple-colors-dark-theme", color);
        css += " } \n\n";
      }
    }
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  };
  window.SimpleColorsUtility.requestAvailability = function() {
    if (!window.SimpleColorsUtility.instance) {
      window.SimpleColorsUtility.instance = document.createElement(
        "simple-colors"
      );
      window.SimpleColorsUtility.addStyles();
    }
    document.body.appendChild(window.SimpleColorsUtility.instance);
  };
});
