define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/simple-colors-styles.js"],function(_exports,_polymerElement,_simpleColorsStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleColors=void 0;function _templateObject_a1b0eb20ab1511e9bea8d794e49a0964(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style></style>\n      <slot></slot>\n    "]);_templateObject_a1b0eb20ab1511e9bea8d794e49a0964=function _templateObject_a1b0eb20ab1511e9bea8d794e49a0964(){return data};return data}/**
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
 */var SimpleColors=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleColors,_PolymerElement);babelHelpers.createClass(SimpleColors,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_a1b0eb20ab1511e9bea8d794e49a0964())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
       * a selected accent-color: grey, red, pink, purple, etc.
       */accentColor:{name:"accentColor",type:"String",value:"grey",reflectToAttribute:!0,notify:!0},/**
       * make the default theme dark?
       */dark:{name:"dark",type:"Boolean",value:!1,reflectToAttribute:!0,notify:!0},/**
       * make the default theme dark?
       */colors:{name:"colors",type:"Object",value:window.SimpleColorsStyles.colors,notify:!0}}}},{key:"tag",get:function get(){return"simple-colors"}}]);function SimpleColors(){var _this;babelHelpers.classCallCheck(this,SimpleColors);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleColors).call(this));_this.__utils=window.SimpleColorsStyles.requestAvailability();return _this}/**
   * life cycle, element is ready
   */babelHelpers.createClass(SimpleColors,[{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleColors.prototype),"ready",this).call(this);this.shadowRoot.insertBefore(new _simpleColorsStyles.SimpleColorsStyles().makeStyleElement(),this.shadowRoot.children[0])}/**
   * returns the maximum contrast to the shade
   *
   * @param {string} the shade
   * @param {number} the shade with maximum contrast
   */},{key:"maxContrastShade",value:function maxContrastShade(shade){return this.__utils.maxContrastShade(shade)}/**
   * gets the current shade
   *
   * @param {string} the shade
   * @param {number} the inverted shade
   */},{key:"invertShade",value:function invertShade(shade){return this.__utils.invertShade(shade)}/**
   * gets the color information of a given CSS variable or class
   *
   * @param {string} the CSS variable (eg. `--simple-colors-fixed-theme-red-3`) or a class (eg. `.simple-colors-fixed-theme-red-3-text`)
   * @param {object} an object that includes the theme, color, and shade information
   */},{key:"getColorInfo",value:function getColorInfo(colorName){return this.__utils.getColorInfo(colorName)}/**
   * returns a variable based on color name, shade, and fixed theme
   *
   * @param {string} the color name
   * @param {number} the color shade
   * @param {boolean} the color shade
   * @returns {string} the CSS Variable
   */},{key:"makeVariable",value:function makeVariable(){var color=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"grey",shade=1<arguments.length&&arguments[1]!==void 0?arguments[1]:1,theme=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"default";return this.__utils.makeVariable(color="grey",shade=1,theme="default")}/**
   * for large or small text given a color and its shade,
   * lists all the colors and shades that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {object} all of the WCAG 2.0 AA-compliant colors and shades
   */},{key:"getContrastingColors",value:function getContrastingColors(colorName,colorShade,isLarge){return this.__utils.getContrastingColors(colorName,colorShade,isLarge)}/**
   * for large or small text given a color and its shade,
   * lists all the shades of another color that would be
   * WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {array} all of the WCAG 2.0 AA-compliant shades of the contrasting color
   */},{key:"getContrastingShades",value:function getContrastingShades(isLarge,colorName,colorShade,contrastName){return this.__utils.getContrastingShades(isLarge,colorName,colorShade,contrastName)}/**
   * determines if two shades are WCAG 2.0 AA-compliant for contrast
   *
   * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
   * @param {string} color name, e.g. "deep-purple"
   * @param {string} color shade, e.g. 3
   * @param {string} contrasting color name, e.g. "grey"
   * @param {string} contrast shade, e.g. 12
   * @param {boolean} whether or not the contrasting shade is WCAG 2.0 AA-compliant
   */},{key:"isContrastCompliant",value:function isContrastCompliant(isLarge,colorName,colorShade,contrastName,contrastShade){return this.__utils.isContrastCompliant(isLarge,colorName,colorShade,contrastName,contrastShade)}}]);return SimpleColors}(_polymerElement.PolymerElement);_exports.SimpleColors=SimpleColors;customElements.define(SimpleColors.tag,SimpleColors)});