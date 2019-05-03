define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/simple-colors-styles.js"],function(_exports,_polymerElement,_simpleColorsStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleColors=void 0;function _templateObject_92491b106a8511e983c16f9c55444497(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style is=\"custom-style\" include=\"simple-colors\"></style>\n      <slot></slot>\n    "]);_templateObject_92491b106a8511e983c16f9c55444497=function _templateObject_92491b106a8511e983c16f9c55444497(){return data};return data}/**
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
 */var SimpleColors=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleColors,_PolymerElement);function SimpleColors(){babelHelpers.classCallCheck(this,SimpleColors);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleColors).apply(this,arguments))}babelHelpers.createClass(SimpleColors,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleColors.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is ready
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleColors.prototype),"ready",this).call(this)}/**
   * returns the maximum contrast to the shade
   *
   * @param {string} the shade
   * @param {number} the shade with maximum contrast
   */},{key:"maxContrastShade",value:function maxContrastShade(shade){return window.SimpleColorsUtilities.maxContrastShade(shade)}/**
   * gets the current shade
   *
   * @param {string} the shade
   * @param {number} the inverted shade
   */},{key:"invertShade",value:function invertShade(shade){return window.SimpleColorsUtilities.invertShade(shade)}/**
   * gets the color information of a given CSS variable or class
   *
   * @param {string} the CSS variable (eg. `--simple-colors-fixed-theme-red-3`) or a class (eg. `.simple-colors-fixed-theme-red-3-text`)
   * @param {object} an object that includes the theme, color, and shade information
   */},{key:"getColorInfo",value:function getColorInfo(colorName){var temp1=colorName.replace(/(.+simple-colors-)?(-text)?(-border)?/g,"").split("-theme-"),theme=0<temp1.length?temp1[0]:"default",temp2=0<temp1.length?temp1[1].split("-"):temp1[0].split("-"),color=1<temp2.length?temp2.slice(1,temp2.length-1).join("-"):"grey",shade=1<temp2.length?temp2[temp2.length-1]:"1";return{theme:theme,color:color,shade:shade}}/**
   * returns a variable based on color name, shade, and fixed theme
   *
   * @param {string} the color name
   * @param {number} the color shade
   * @param {boolean} the color shade
   * @returns {string} the CSS Variable
   */},{key:"makeVariable",value:function makeVariable(){var color=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"grey",shade=1<arguments.length&&arguments[1]!==void 0?arguments[1]:1,theme=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"default";return window.SimpleColorsUtilities.makeVariable(color="grey",shade=1,theme="default")}/**
   * returns a variable based on color name, shade, and fixed theme
   *
   * @param {string} the color name
   * @param {number} the color shade
   * @param {boolean} the color shade
   * @returns {string} the CSS class
   */},{key:"makeClass",value:function makeClass(){var color=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"grey",shade=1<arguments.length&&arguments[1]!==void 0?arguments[1]:1,theme=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"default",suffix=3<arguments.length&&arguments[3]!==void 0?arguments[3]:"";return window.SimpleColorsUtilities.makeClass(color="grey",shade=1,theme="default",suffix="")}/**
   * for large or small text given a color and its shade,
   * lists all the colors and shades that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {object} all of the WCAG 2.0 AA-compliant colors and shades
   */},{key:"getContrastingColors",value:function getContrastingColors(colorName,colorShade,isLarge){return window.SimpleColorsUtilities.getContrastingColors(colorName,colorShade,isLarge)}/**
   * for large or small text given a color and its shade,
   * lists all the shades of another color that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {array} all of the WCAG 2.0 AA-compliant shades of the contrasting color
   */},{key:"getContrastingShades",value:function getContrastingShades(isLarge,colorName,colorShade,contrastName){return window.SimpleColorsUtilities.getContrastingShades(isLarge,colorName,colorShade,contrastName)}/**
   * determines if two shades are WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {string} contrast shade, e.g. 12
   * @param {boolean} whether or not the contrasting shade is WCAG 2.0 AA-compliant
   */},{key:"isContrastCompliant",value:function isContrastCompliant(isLarge,colorName,colorShade,contrastName,contrastShade){return window.SimpleColorsUtilities.isContrastCompliant(isLarge,colorName,colorShade,contrastName,contrastShade)}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_92491b106a8511e983c16f9c55444497())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
       * a selected accent-color: grey, red, pink, purple, etc.
       */accentColor:{name:"accentColor",type:"String",value:"grey",reflectToAttribute:!0,notify:!0},/**
       * make the default theme dark?
       */dark:{name:"dark",type:"Boolean",value:!1,reflectToAttribute:!0,notify:!0},/**
       * make the default theme dark?
       */colors:{name:"colors",type:"Object",value:window.SimpleColorsUtilities.colors,notify:!0}}}},{key:"tag",get:function get(){return"simple-colors"}}]);return SimpleColors}(_polymerElement.PolymerElement);_exports.SimpleColors=SimpleColors;customElements.define(SimpleColors.tag,SimpleColors)});