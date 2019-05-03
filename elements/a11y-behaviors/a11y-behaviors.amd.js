define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yBehaviors=void 0;var A11yBehaviors=function A11yBehaviors(SuperClass){return(/*#__PURE__*/function(_SuperClass){babelHelpers.inherits(_class,_SuperClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(_class).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"getTextContrastColor",/**
     * Get a a11y safe text color based on background color
     * @prop {string} bgColor hexadecimal value for the color
     * @return {string} hexadecimal value for the color
     */value:function getTextContrastColor(bgColor){// verify the value is hex value
var color="",colorBuffer=bgColor.replace("#",""),rgb=parseInt(colorBuffer,16),r=255&rgb>>16,g=255&rgb>>8,b=255&rgb>>0,luma=.2126*r+.7152*g+.0722*b;// strip hash from string
// per ITU-R BT.709
// if the luma is to low switch to white text
if(141>luma){color="#ffffff"}else{color="#000000"}// Set color and background color vars
return color}/**
     * Validate and modify the text contrast to ensure the correct contrast
     */},{key:"computeTextPropContrast",value:function computeTextPropContrast(textprop,bgprop){// verify the value is hex value
if(this[bgprop].includes("#")){var color=this.getTextContrastColor(this[bgprop]);// Set color and background color vars
this.set(textprop,color)}}}]);return _class}(SuperClass))};_exports.A11yBehaviors=A11yBehaviors});