/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "./lib/colors.js";
import "./lib/shapes.js";

/**
 * `materializecss-styles`
 * @element materializecss-styles
 * `MaterializeCSSBehaviors.ColorBehaviors` some basic but annoying transforms to go
 * from a color code to the materializeCSS color name or the reverse, to go from
 * a css class name back to a color value. These are especially useful when needing
 * to modify one color code relative to the class value of a parent / related tag.
 *
 * @polymerBehavior MaterializeCSSBehaviors.ColorBehaviors
 * @demo demo/index.html
 */
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="materializecss-styles">
  <template>
    <style include="materializecss-styles-colors"></style>
    <style include="materializecss-styles-shapes"></style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
window.MaterializeCSSBehaviors = window.MaterializeCSSBehaviors || {};
window.MaterializeCSSBehaviors.ColorBehaviors = {
  /**
   * Get the Materialize color classes mapping based on defined parts
   * Example: getColorClasses('text')
   */
  getColorClasses(parta = "", partb = "") {
    var colorClasses = {
      "#ffffff": "white",
      "#000000": "black",
      "#ffebee": "red" + parta + " " + partb + "lighten-5",
      "#ffcdd2": "red" + parta + " " + partb + "lighten-4",
      "#ef9a9a": "red" + parta + " " + partb + "lighten-3",
      "#e57373": "red" + parta + " " + partb + "lighten-2",
      "#ef5350": "red" + parta + " " + partb + "lighten-1",
      "#f44336": "red" + parta,
      "#e53935": "red" + parta + " " + partb + "darken-1",
      "#d32f2f": "red" + parta + " " + partb + "darken-2",
      "#c62828": "red" + parta + " " + partb + "darken-3",
      "#b71c1c": "red" + parta + " " + partb + "darken-4",
      "#ff8a80": "red" + parta + " accent-1",
      "#ff5252": "red" + parta + " accent-2",
      "#ff1744": "red" + parta + " accent-3",
      "#d50000": "red" + parta + " accent-4",
      "#fce4ec": "pink" + parta + " " + partb + "lighten-5",
      "#f8bbd0": "pink" + parta + " " + partb + "lighten-4",
      "#f48fb1": "pink" + parta + " " + partb + "lighten-3",
      "#f06292": "pink" + parta + " " + partb + "lighten-2",
      "#ec407a": "pink" + parta + " " + partb + "lighten-1",
      "#e91e63": "pink" + parta,
      "#d81b60": "pink" + parta + " " + partb + "darken-1",
      "#c2185b": "pink" + parta + " " + partb + "darken-2",
      "#ad1457": "pink" + parta + " " + partb + "darken-3",
      "#880e4f": "pink" + parta + " " + partb + "darken-4",
      "#ff80ab": "pink" + parta + " accent-1",
      "#ff4081": "pink" + parta + " accent-2",
      "#f50057": "pink" + parta + " accent-3",
      "#c51162": "pink" + parta + " accent-4",
      "#f3e5f5": "purple" + parta + " " + partb + "lighten-5",
      "#e1bee7": "purple" + parta + " " + partb + "lighten-4",
      "#ce93d8": "purple" + parta + " " + partb + "lighten-3",
      "#ba68c8": "purple" + parta + " " + partb + "lighten-2",
      "#ab47bc": "purple" + parta + " " + partb + "lighten-1",
      "#9c27b0": "purple" + parta,
      "#8e24aa": "purple" + parta + " " + partb + "darken-1",
      "#7b1fa2": "purple" + parta + " " + partb + "darken-2",
      "#6a1b9a": "purple" + parta + " " + partb + "darken-3",
      "#4a148c": "purple" + parta + " " + partb + "darken-4",
      "#ea80fc": "purple" + parta + " accent-1",
      "#e040fb": "purple" + parta + " accent-2",
      "#d500f9": "purple" + parta + " accent-3",
      "#aa00ff": "purple" + parta + " accent-4",
      "#ede7f6": "deep-purple" + parta + " " + partb + "lighten-5",
      "#d1c4e9": "deep-purple" + parta + " " + partb + "lighten-4",
      "#b39ddb": "deep-purple" + parta + " " + partb + "lighten-3",
      "#9575cd": "deep-purple" + parta + " " + partb + "lighten-2",
      "#7e57c2": "deep-purple" + parta + " " + partb + "lighten-1",
      "#673ab7": "deep-purple" + parta,
      "#5e35b1": "deep-purple" + parta + " " + partb + "darken-1",
      "#512da8": "deep-purple" + parta + " " + partb + "darken-2",
      "#4527a0": "deep-purple" + parta + " " + partb + "darken-3",
      "#311b92": "deep-purple" + parta + " " + partb + "darken-4",
      "#b388ff": "deep-purple" + parta + " accent-1",
      "#7c4dff": "deep-purple" + parta + " accent-2",
      "#651fff": "deep-purple" + parta + " accent-3",
      "#6200ea": "deep-purple" + parta + " accent-4",
      "#e8eaf6": "indigo" + parta + " " + partb + "lighten-5",
      "#c5cae9": "indigo" + parta + " " + partb + "lighten-4",
      "#9fa8da": "indigo" + parta + " " + partb + "lighten-3",
      "#7986cb": "indigo" + parta + " " + partb + "lighten-2",
      "#5c6bc0": "indigo" + parta + " " + partb + "lighten-1",
      "#3f51b5": "indigo" + parta,
      "#3949ab": "indigo" + parta + " " + partb + "darken-1",
      "#303f9f": "indigo" + parta + " " + partb + "darken-2",
      "#283593": "indigo" + parta + " " + partb + "darken-3",
      "#1a237e": "indigo" + parta + " " + partb + "darken-4",
      "#8c9eff": "indigo" + parta + " accent-1",
      "#536dfe": "indigo" + parta + " accent-2",
      "#3d5afe": "indigo" + parta + " accent-3",
      "#304ffe": "indigo" + parta + " accent-4",
      "#e3f2fd": "blue" + parta + " " + partb + "lighten-5",
      "#bbdefb": "blue" + parta + " " + partb + "lighten-4",
      "#90caf9": "blue" + parta + " " + partb + "lighten-3",
      "#64b5f6": "blue" + parta + " " + partb + "lighten-2",
      "#42a5f5": "blue" + parta + " " + partb + "lighten-1",
      "#2196f3": "blue" + parta,
      "#1e88e5": "blue" + parta + " " + partb + "darken-1",
      "#1976d2": "blue" + parta + " " + partb + "darken-2",
      "#1565c0": "blue" + parta + " " + partb + "darken-3",
      "#0d47a1": "blue" + parta + " " + partb + "darken-4",
      "#82b1ff": "blue" + parta + " accent-1",
      "#448aff": "blue" + parta + " accent-2",
      "#2979ff": "blue" + parta + " accent-3",
      "#2962ff": "blue" + parta + " accent-4",
      "#e1f5fe": "light-blue" + parta + " " + partb + "lighten-5",
      "#b3e5fc": "light-blue" + parta + " " + partb + "lighten-4",
      "#81d4fa": "light-blue" + parta + " " + partb + "lighten-3",
      "#4fc3f7": "light-blue" + parta + " " + partb + "lighten-2",
      "#29b6f6": "light-blue" + parta + " " + partb + "lighten-1",
      "#03a9f4": "light-blue" + parta,
      "#039be5": "light-blue" + parta + " " + partb + "darken-1",
      "#0288d1": "light-blue" + parta + " " + partb + "darken-2",
      "#0277bd": "light-blue" + parta + " " + partb + "darken-3",
      "#01579b": "light-blue" + parta + " " + partb + "darken-4",
      "#80d8ff": "light-blue" + parta + " accent-1",
      "#40c4ff": "light-blue" + parta + " accent-2",
      "#00b0ff": "light-blue" + parta + " accent-3",
      "#0091ea": "light-blue" + parta + " accent-4",
      "#e0f7fa": "cyan" + parta + " " + partb + "lighten-5",
      "#b2ebf2": "cyan" + parta + " " + partb + "lighten-4",
      "#80deea": "cyan" + parta + " " + partb + "lighten-3",
      "#4dd0e1": "cyan" + parta + " " + partb + "lighten-2",
      "#26c6da": "cyan" + parta + " " + partb + "lighten-1",
      "#00bcd4": "cyan" + parta,
      "#00acc1": "cyan" + parta + " " + partb + "darken-1",
      "#0097a7": "cyan" + parta + " " + partb + "darken-2",
      "#00838f": "cyan" + parta + " " + partb + "darken-3",
      "#006064": "cyan" + parta + " " + partb + "darken-4",
      "#84ffff": "cyan" + parta + " accent-1",
      "#18ffff": "cyan" + parta + " accent-2",
      "#00e5ff": "cyan" + parta + " accent-3",
      "#00b8d4": "cyan" + parta + " accent-4",
      "#e0f2f1": "teal" + parta + " " + partb + "lighten-5",
      "#b2dfdb": "teal" + parta + " " + partb + "lighten-4",
      "#80cbc4": "teal" + parta + " " + partb + "lighten-3",
      "#4db6ac": "teal" + parta + " " + partb + "lighten-2",
      "#26a69a": "teal" + parta + " " + partb + "lighten-1",
      "#009688": "teal" + parta,
      "#00897b": "teal" + parta + " " + partb + "darken-1",
      "#00796b": "teal" + parta + " " + partb + "darken-2",
      "#00695c": "teal" + parta + " " + partb + "darken-3",
      "#004d40": "teal" + parta + " " + partb + "darken-4",
      "#a7ffeb": "teal" + parta + " accent-1",
      "#64ffda": "teal" + parta + " accent-2",
      "#1de9b6": "teal" + parta + " accent-3",
      "#00bfa5": "teal" + parta + " accent-4",
      "#e8f5e9": "green" + parta + " " + partb + "lighten-5",
      "#c8e6c9": "green" + parta + " " + partb + "lighten-4",
      "#a5d6a7": "green" + parta + " " + partb + "lighten-3",
      "#81c784": "green" + parta + " " + partb + "lighten-2",
      "#66bb6a": "green" + parta + " " + partb + "lighten-1",
      "#4caf50": "green" + parta,
      "#43a047": "green" + parta + " " + partb + "darken-1",
      "#388e3c": "green" + parta + " " + partb + "darken-2",
      "#2e7d32": "green" + parta + " " + partb + "darken-3",
      "#1b5e20": "green" + parta + " " + partb + "darken-4",
      "#b9f6ca": "green" + parta + " accent-1",
      "#69f0ae": "green" + parta + " accent-2",
      "#00e676": "green" + parta + " accent-3",
      "#00c853": "green" + parta + " accent-4",
      "#f1f8e9": "light-green" + parta + " " + partb + "lighten-5",
      "#dcedc8": "light-green" + parta + " " + partb + "lighten-4",
      "#c5e1a5": "light-green" + parta + " " + partb + "lighten-3",
      "#aed581": "light-green" + parta + " " + partb + "lighten-2",
      "#9ccc65": "light-green" + parta + " " + partb + "lighten-1",
      "#8bc34a": "light-green" + parta,
      "#7cb342": "light-green" + parta + " " + partb + "darken-1",
      "#689f38": "light-green" + parta + " " + partb + "darken-2",
      "#558b2f": "light-green" + parta + " " + partb + "darken-3",
      "#33691e": "light-green" + parta + " " + partb + "darken-4",
      "#ccff90": "light-green" + parta + " accent-1",
      "#b2ff59": "light-green" + parta + " accent-2",
      "#76ff03": "light-green" + parta + " accent-3",
      "#64dd17": "light-green" + parta + " accent-4",
      "#f9fbe7": "lime" + parta + " " + partb + "lighten-5",
      "#f0f4c3": "lime" + parta + " " + partb + "lighten-4",
      "#e6ee9c": "lime" + parta + " " + partb + "lighten-3",
      "#dce775": "lime" + parta + " " + partb + "lighten-2",
      "#d4e157": "lime" + parta + " " + partb + "lighten-1",
      "#cddc39": "lime" + parta,
      "#c0ca33": "lime" + parta + " " + partb + "darken-1",
      "#afb42b": "lime" + parta + " " + partb + "darken-2",
      "#9e9d24": "lime" + parta + " " + partb + "darken-3",
      "#827717": "lime" + parta + " " + partb + "darken-4",
      "#f4ff81": "lime" + parta + " accent-1",
      "#eeff41": "lime" + parta + " accent-2",
      "#c6ff00": "lime" + parta + " accent-3",
      "#aeea00": "lime" + parta + " accent-4",
      "#fffde7": "yellow" + parta + " " + partb + "lighten-5",
      "#fff9c4": "yellow" + parta + " " + partb + "lighten-4",
      "#fff59d": "yellow" + parta + " " + partb + "lighten-3",
      "#fff176": "yellow" + parta + " " + partb + "lighten-2",
      "#ffee58": "yellow" + parta + " " + partb + "lighten-1",
      "#ffeb3b": "yellow" + parta,
      "#fdd835": "yellow" + parta + " " + partb + "darken-1",
      "#fbc02d": "yellow" + parta + " " + partb + "darken-2",
      "#f9a825": "yellow" + parta + " " + partb + "darken-3",
      "#f57f17": "yellow" + parta + " " + partb + "darken-4",
      "#ffff8d": "yellow" + parta + " accent-1",
      "#ffff00": "yellow" + parta + " accent-2",
      "#ffea00": "yellow" + parta + " accent-3",
      "#ffd600": "yellow" + parta + " accent-4",
      "#fff8e1": "amber" + parta + " " + partb + "lighten-5",
      "#ffecb3": "amber" + parta + " " + partb + "lighten-4",
      "#ffe082": "amber" + parta + " " + partb + "lighten-3",
      "#ffd54f": "amber" + parta + " " + partb + "lighten-2",
      "#ffca28": "amber" + parta + " " + partb + "lighten-1",
      "#ffc107": "amber" + parta,
      "#ffb300": "amber" + parta + " " + partb + "darken-1",
      "#ffa000": "amber" + parta + " " + partb + "darken-2",
      "#ff8f00": "amber" + parta + " " + partb + "darken-3",
      "#ff6f00": "amber" + parta + " " + partb + "darken-4",
      "#ffe57f": "amber" + parta + " accent-1",
      "#ffd740": "amber" + parta + " accent-2",
      "#ffc400": "amber" + parta + " accent-3",
      "#ffab00": "amber" + parta + " accent-4",
      "#fff3e0": "orange" + parta + " " + partb + "lighten-5",
      "#ffe0b2": "orange" + parta + " " + partb + "lighten-4",
      "#ffcc80": "orange" + parta + " " + partb + "lighten-3",
      "#ffb74d": "orange" + parta + " " + partb + "lighten-2",
      "#ffa726": "orange" + parta + " " + partb + "lighten-1",
      "#ff9800": "orange" + parta,
      "#fb8c00": "orange" + parta + " " + partb + "darken-1",
      "#f57c00": "orange" + parta + " " + partb + "darken-2",
      "#ef6c00": "orange" + parta + " " + partb + "darken-3",
      "#e65100": "orange" + parta + " " + partb + "darken-4",
      "#ffd180": "orange" + parta + " accent-1",
      "#ffab40": "orange" + parta + " accent-2",
      "#ff9100": "orange" + parta + " accent-3",
      "#ff6500": "orange" + parta + " accent-4",
      "#fbe9e7": "deep-orange" + parta + " " + partb + "lighten-5",
      "#ffccbc": "deep-orange" + parta + " " + partb + "lighten-4",
      "#ffab91": "deep-orange" + parta + " " + partb + "lighten-3",
      "#ff8a65": "deep-orange" + parta + " " + partb + "lighten-2",
      "#ff7043": "deep-orange" + parta + " " + partb + "lighten-1",
      "#ff5722": "deep-orange" + parta,
      "#f4511e": "deep-orange" + parta + " " + partb + "darken-1",
      "#e64a19": "deep-orange" + parta + " " + partb + "darken-2",
      "#d84315": "deep-orange" + parta + " " + partb + "darken-3",
      "#bf360c": "deep-orange" + parta + " " + partb + "darken-4",
      "#ff9e80": "deep-orange" + parta + " accent-1",
      "#ff6e40": "deep-orange" + parta + " accent-2",
      "#ff3d00": "deep-orange" + parta + " accent-3",
      "#dd2c00": "deep-orange" + parta + " accent-4",
      "#efebe9": "brown" + parta + " " + partb + "lighten-5",
      "#d7ccc8": "brown" + parta + " " + partb + "lighten-4",
      "#bcaaa4": "brown" + parta + " " + partb + "lighten-3",
      "#a1887f": "brown" + parta + " " + partb + "lighten-2",
      "#8d6e63": "brown" + parta + " " + partb + "lighten-1",
      "#795548": "brown" + parta,
      "#6d4c41": "brown" + parta + " " + partb + "darken-1",
      "#5d4037": "brown" + parta + " " + partb + "darken-2",
      "#4e342e": "brown" + parta + " " + partb + "darken-3",
      "#3e2723": "brown" + parta + " " + partb + "darken-4",
      "#fafafa": "grey" + parta + " " + partb + "lighten-5",
      "#f5f5f5": "grey" + parta + " " + partb + "lighten-4",
      "#eeeeee": "grey" + parta + " " + partb + "lighten-3",
      "#e0e0e0": "grey" + parta + " " + partb + "lighten-2",
      "#bdbdbd": "grey" + parta + " " + partb + "lighten-1",
      "#9e9e9e": "grey" + parta,
      "#757575": "grey" + parta + " " + partb + "darken-1",
      "#616161": "grey" + parta + " " + partb + "darken-2",
      "#424242": "grey" + parta + " " + partb + "darken-3",
      "#212121": "grey" + parta + " " + partb + "darken-4",
      "#eceff1": "blue-grey" + parta + " " + partb + "lighten-5",
      "#cfd8dc": "blue-grey" + parta + " " + partb + "lighten-4",
      "#b0bec5": "blue-grey" + parta + " " + partb + "lighten-3",
      "#90a4ae": "blue-grey" + parta + " " + partb + "lighten-2",
      "#78909c": "blue-grey" + parta + " " + partb + "lighten-1",
      "#607d8b": "blue-grey" + parta,
      "#546e7a": "blue-grey" + parta + " " + partb + "darken-1",
      "#455a64": "blue-grey" + parta + " " + partb + "darken-2",
      "#37474f": "blue-grey" + parta + " " + partb + "darken-3",
      "#263238": "blue-grey" + parta + " " + partb + "darken-4",
    };
    return colorClasses;
  },

  /**
   * Transform a color value into it's associated color class
   */
  _colorTransform(item, parta, partb) {
    const colorClasses = this.getColorClasses(parta, partb);
    if (typeof colorClasses[item] !== "undefined") {
      return colorClasses[item];
    }
    return null;
  },

  /**
   * Transform a color class into its associated color class
   * @param {string} color Color class
   * @return {string} hex value
   */
  _colorTransformFromClass(color) {
    const colorClasses = this.getColorClasses();
    let hexColor = null;
    Object.keys(colorClasses).forEach(function (key) {
      if (colorClasses[key] === color) {
        hexColor = key;
      }
    });
    return hexColor;
  },
};
