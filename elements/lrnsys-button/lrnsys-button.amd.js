define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"],function(_exports,_require,_polymerElement,_simpleColors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysButton=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_e7be4c406d6a11e9824ec5b14855ce94(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        @apply --paper-font-common-base;\n        @apply --paper-button;\n        --lrnsys-button-height: 48px;\n      }\n      a {\n        text-decoration: none;\n        display: block;\n        color: #000000;\n        display: flex;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 0.16px;\n        height: inherit;\n        -webkit-justify-content: flex-start;\n        justify-content: flex-start;\n        align-items: center;\n        width: 100%;\n        text-transform: unset;\n        border-radius: unset;\n        display: flex;\n      }\n      paper-button iron-icon {\n        height: var(--lrnsys-button-height);\n        margin: 0 4px;\n      }\n      paper-button iron-icon:first-child {\n        margin: 0 4px 0 0;\n      }\n      paper-button iron-icon:last-child {\n        margin: 0 0 0 4px;\n      }\n      paper-button div.inner {\n        height: var(--lrnsys-button-height);\n        line-height: var(--lrnsys-button-height);\n        display: flex;\n        padding: 0 16px;\n      }\n      paper-button span.label {\n        height: var(--lrnsys-button-height);\n        line-height: var(--lrnsys-button-height);\n      }\n      .no-margin {\n        margin: 0 !important;\n      }\n      .no-right-padding {\n        padding-right: 0 !important;\n      }\n      .no-left-padding {\n        padding-left: 0 !important;\n      }\n    </style>  \n    <a\n      tabindex=\"-1\"\n      id=\"lrnsys-button-link\"\n      href$=\"[[showHref]]\"\n      data-prefetch-hover$=\"[[prefetch]]\"\n      target$=\"[[target]]\"\n    >\n      <paper-button\n        id=\"button\"\n        title=\"[[alt]]\"\n        raised=\"[[raised]]\"\n        style$=\"background-color:[[hexColor]];color:[[textHexColor]];\"\n        class$=\"[[buttonClass]]\"\n        disabled$=\"[[disabled]]\"\n      >\n        <div class$=\"inner [[innerClass]]\">\n          <iron-icon\n            icon=\"[[icon]]\"\n            id=\"icon\"\n            class$=\"[[iconClass]]\"\n            hidden$=\"[[!icon]]\"\n          ></iron-icon>\n          <span class=\"label\" hidden$=\"[[!label]]\"> [[label]] </span>\n          <slot></slot>\n        </div>\n      </paper-button>\n    </a>\n    <paper-tooltip\n      for=\"lrnsys-button-link\"\n      animation-delay=\"0\"\n      hidden$=\"[[!alt]]\"\n      >[[alt]]</paper-tooltip\n    >"],["\n    <style>\n      :host {\n        display: block;\n        @apply --paper-font-common-base;\n        @apply --paper-button;\n        --lrnsys-button-height: 48px;\n      }\n      a {\n        text-decoration: none;\n        display: block;\n        color: #000000;\n        display: flex;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 0.16px;\n        height: inherit;\n        -webkit-justify-content: flex-start;\n        justify-content: flex-start;\n        align-items: center;\n        width: 100%;\n        text-transform: unset;\n        border-radius: unset;\n        display: flex;\n      }\n      paper-button iron-icon {\n        height: var(--lrnsys-button-height);\n        margin: 0 4px;\n      }\n      paper-button iron-icon:first-child {\n        margin: 0 4px 0 0;\n      }\n      paper-button iron-icon:last-child {\n        margin: 0 0 0 4px;\n      }\n      paper-button div.inner {\n        height: var(--lrnsys-button-height);\n        line-height: var(--lrnsys-button-height);\n        display: flex;\n        padding: 0 16px;\n      }\n      paper-button span.label {\n        height: var(--lrnsys-button-height);\n        line-height: var(--lrnsys-button-height);\n      }\n      .no-margin {\n        margin: 0 !important;\n      }\n      .no-right-padding {\n        padding-right: 0 !important;\n      }\n      .no-left-padding {\n        padding-left: 0 !important;\n      }\n    </style>  \n    <a\n      tabindex=\"-1\"\n      id=\"lrnsys-button-link\"\n      href\\$=\"[[showHref]]\"\n      data-prefetch-hover\\$=\"[[prefetch]]\"\n      target\\$=\"[[target]]\"\n    >\n      <paper-button\n        id=\"button\"\n        title=\"[[alt]]\"\n        raised=\"[[raised]]\"\n        style$=\"background-color:[[hexColor]];color:[[textHexColor]];\"\n        class\\$=\"[[buttonClass]]\"\n        disabled\\$=\"[[disabled]]\"\n      >\n        <div class\\$=\"inner [[innerClass]]\">\n          <iron-icon\n            icon=\"[[icon]]\"\n            id=\"icon\"\n            class\\$=\"[[iconClass]]\"\n            hidden\\$=\"[[!icon]]\"\n          ></iron-icon>\n          <span class=\"label\" hidden\\$=\"[[!label]]\"> [[label]] </span>\n          <slot></slot>\n        </div>\n      </paper-button>\n    </a>\n    <paper-tooltip\n      for=\"lrnsys-button-link\"\n      animation-delay=\"0\"\n      hidden\\$=\"[[!alt]]\"\n      >[[alt]]</paper-tooltip\n    >"]);_templateObject_e7be4c406d6a11e9824ec5b14855ce94=function _templateObject_e7be4c406d6a11e9824ec5b14855ce94(){return data};return data}/**
 * `lrnsys-button`
 * `A simple button for use in system`
 * @demo demo/index.html
 */var LrnsysButton=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LrnsysButton,_PolymerElement);function LrnsysButton(){var _this;babelHelpers.classCallCheck(this,LrnsysButton);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrnsysButton).call(this));new Promise(function(res,rej){return _require.default(["@polymer/paper-button/paper-button.js"],res,rej)});new Promise(function(res,rej){return _require.default(["@polymer/iron-icons/iron-icons.js"],res,rej)});new Promise(function(res,rej){return _require.default(["@polymer/paper-tooltip/paper-tooltip.js"],res,rej)});return _this}babelHelpers.createClass(LrnsysButton,[{key:"_getHexColor",value:function _getHexColor(color){var name=color.replace("-text",""),tmp=new _simpleColors.SimpleColors;if(tmp.colors[name]){return tmp.colors[name][6]}return"#000000"}/**
   * attached life cycle
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(LrnsysButton.prototype),"connectedCallback",this).call(this);this.addEventListener("mousedown",this.tapEventOn.bind(this));this.addEventListener("mouseover",this.tapEventOn.bind(this));this.addEventListener("mouseout",this.tapEventOff.bind(this));this.shadowRoot.querySelector("#button").addEventListener("focused-changed",this.focusToggle.bind(this))}/**
   * detached event listener
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("mousedown",this.tapEventOn.bind(this));this.removeEventListener("mouseover",this.tapEventOn.bind(this));this.removeEventListener("mouseout",this.tapEventOff.bind(this));this.shadowRoot.querySelector("#button").removeEventListener("focused-changed",this.focusToggle.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(LrnsysButton.prototype),"disconnectedCallback",this).call(this)}/**
   * Generate the pass down href if it exists. This helps
   * ensure that if a button is disabled it won't do anything
   * even if it has a resource reference.
   */},{key:"_getShowHref",value:function _getShowHref(href,disabled){if(href&&!disabled){return href}}/**
   * Class processing on un-tap / hover
   */},{key:"tapEventOn",value:function tapEventOn(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.shadowRoot.querySelector("#button").classList.add(item);if(-1!=item.indexOf("-")){root.shadowRoot.querySelector("#icon").classList.add(item)}}})}}/**
   * Undo class processing on un-tap / hover
   */},{key:"tapEventOff",value:function tapEventOff(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.shadowRoot.querySelector("#button").classList.remove(item);if(-1!=item.indexOf("-")){root.shadowRoot.querySelector("#icon").classList.remove(item)}}})}}/**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */},{key:"focusToggle",value:function focusToggle(e){var _this2=this;// weird but reality... focus event is the button inside of here
if(babelHelpers.typeof(this.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!this.disabled){// break class into array
var classes=this.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){if(!_this2.focusState){_this2.shadowRoot.querySelector("#button").classList.add(item);if(-1!=item.indexOf("-")){_this2.shadowRoot.querySelector("#icon").classList.add(item)}}else{_this2.shadowRoot.querySelector("#button").classList.remove(item);if(-1!=item.indexOf("-")){_this2.shadowRoot.querySelector("#icon").classList.remove(item)}}}})}this.focusState=!this.focusState}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_e7be4c406d6a11e9824ec5b14855ce94())}},{key:"tag",get:function get(){return"lrnsys-button"}},{key:"properties",get:function get(){return{/**
       * Standard href pass down
       */href:{type:String,value:"#",reflectToAttribute:!0},showHref:{type:String,value:!1,reflectToAttribute:!0,computed:"_getShowHref(href,disabled)"},/**
       * If the button should be visually lifted off the UI.
       */raised:{type:Boolean,reflectToAttribute:!0},/**
       * Label to place in the text area
       */label:{type:String,value:""},/**
       * Support for target to open in new windows.
       */target:{type:String,value:""},/**
       * iron-icon to use (with iconset if needed)
       */icon:{type:String,value:!1},/**
       * Classes to add / subtract based on the item being hovered.
       */hoverClass:{type:String},/**
       * Button class.
       */buttonClass:{type:String},/**
       * Icon class in the event you want it to look different from the text.
       */iconClass:{type:String},/**
       * Inner container classes.
       */innerClass:{type:String},/**
       * Class for the color
       */hexColor:{type:String,computed:"_getHexColor(color)"},/**
       * Color class work to apply
       */color:{type:String,value:"blue",reflectToAttribute:!0},/**
       * Class for the color
       */textHexColor:{type:String,computed:"_getHexColor(textColor)"},/**
       * materializeCSS color class for text
       */textColor:{type:String},/**
       * Allow for prefetch data on hover
       */prefetch:{type:String},/**
       * Alt via tooltip.
       */alt:{type:String},/**
       * Disabled state.
       */disabled:{type:Boolean,value:!1},/**
       * Tracks if focus state is applied
       */focusState:{type:Boolean,value:!1}}}}]);return LrnsysButton}(_polymerElement.PolymerElement);_exports.LrnsysButton=LrnsysButton;window.customElements.define(LrnsysButton.tag,LrnsysButton)});