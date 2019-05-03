define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"],function(_exports,_require,_polymerElement,_simpleColors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrndesignAvatar=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_9d381f606d6b11e9885d9ff723d383d7(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-avatar\n      label=\"[[label]]\"\n      src=\"[[src]]\"\n      two-chars=\"[[twoChars]]\"\n      style$=\"background-color:[[hexColor]];\"\n      jdenticon=\"[[jdenticon]]\"\n    ></paper-avatar>"]);_templateObject_9d381f606d6b11e9885d9ff723d383d7=function _templateObject_9d381f606d6b11e9885d9ff723d383d7(){return data};return data}/**
 * `lrndesign-avatar`
 * `Visualize a user account eitehr with an image, a label, or as abstract art.`
 * @demo demo/index.html
 */var LrndesignAvatar=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LrndesignAvatar,_PolymerElement);function LrndesignAvatar(){var _this;babelHelpers.classCallCheck(this,LrndesignAvatar);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrndesignAvatar).call(this));new Promise(function(res,rej){return _require.default(["@lrnwebcomponents/paper-avatar/paper-avatar.js"],res,rej)});return _this}babelHelpers.createClass(LrndesignAvatar,[{key:"_getHexColor",value:function _getHexColor(color){var name=color.replace("-text",""),tmp=new _simpleColors.SimpleColors;if(tmp.colors[name]){return tmp.colors[name][6]}return"#000000"}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_9d381f606d6b11e9885d9ff723d383d7())}},{key:"tag",get:function get(){return"lrndesign-avatar"}},{key:"properties",get:function get(){return{/**
       * text to use for avatar
       */label:{type:String,value:"lrndesign-avatar"},/**
       * link to an image, optional
       */src:{type:String},/**
       * Mode for presenting 1st two letters
       */twoChars:{type:Boolean,value:!1},/**
       * Class for the color
       */hexColor:{type:String,computed:"_getHexColor(color)"},/**
       * Color class work to apply
       */color:{type:String,value:"blue",reflectToAttribute:!0},/**
       * Form abstract art from hash of label
       */jdenticon:{type:Boolean,value:!1}}}}]);return LrndesignAvatar}(_polymerElement.PolymerElement);_exports.LrndesignAvatar=LrndesignAvatar;window.customElements.define(LrndesignAvatar.tag,LrndesignAvatar)});