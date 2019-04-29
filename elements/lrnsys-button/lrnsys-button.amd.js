define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/paper-tooltip/paper-tooltip.js","./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"],function(_exports,_polymerLegacy,_polymerDom,_paperButton,_ironIcons,_paperTooltip,_colors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysButton=void 0;function _templateObject_5a557c906a8411e9bb28cbba98fe01b7(){var data=babelHelpers.taggedTemplateLiteral(["\n    <custom-style>\n      <style include=\"materializecss-styles-colors\">\n        :host {\n          display: block;\n          @apply --paper-font-common-base;\n          @apply --paper-button;\n          --lrnsys-button-height: 48px;\n        }\n        a {\n          text-decoration: none;\n          display: block;\n          color: #000000;\n          display: flex;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 0.16px;\n          height: inherit;\n          -webkit-justify-content: flex-start;\n          justify-content: flex-start;\n          align-items: center;\n          width: 100%;\n          text-transform: unset;\n          border-radius: unset;\n          display: flex;\n        }\n        paper-button iron-icon {\n          height: var(--lrnsys-button-height);\n          margin: 0 4px;\n        }\n        paper-button iron-icon:first-child {\n          margin: 0 4px 0 0;\n        }\n        paper-button iron-icon:last-child {\n          margin: 0 0 0 4px;\n        }\n        paper-button div.inner {\n          height: var(--lrnsys-button-height);\n          line-height: var(--lrnsys-button-height);\n          display: flex;\n          padding: 0 16px;\n        }\n        paper-button span.label {\n          height: var(--lrnsys-button-height);\n          line-height: var(--lrnsys-button-height);\n        }\n        .no-margin {\n          margin: 0 !important;\n        }\n        .no-right-padding {\n          padding-right: 0 !important;\n        }\n        .no-left-padding {\n          padding-left: 0 !important;\n        }\n      </style>\n    </custom-style>\n    <a\n      tabindex=\"-1\"\n      id=\"lrnsys-button-link\"\n      href$=\"[[showHref]]\"\n      data-prefetch-hover$=\"[[prefetch]]\"\n      target$=\"[[target]]\"\n    >\n      <paper-button\n        id=\"button\"\n        title=\"[[alt]]\"\n        raised=\"[[raised]]\"\n        class$=\"[[buttonClass]] [[color]] [[textColor]]\"\n        disabled$=\"[[disabled]]\"\n      >\n        <div class$=\"inner [[innerClass]]\">\n          <iron-icon\n            icon=\"[[icon]]\"\n            id=\"icon\"\n            class$=\"[[iconClass]]\"\n            hidden$=\"[[!icon]]\"\n          ></iron-icon>\n          <span class=\"label\" hidden$=\"[[!label]]\"> [[label]] </span>\n          <slot></slot>\n        </div>\n      </paper-button>\n    </a>\n    <paper-tooltip\n      for=\"lrnsys-button-link\"\n      animation-delay=\"0\"\n      hidden$=\"[[!alt]]\"\n      >[[alt]]</paper-tooltip\n    >\n  "],["\n    <custom-style>\n      <style include=\"materializecss-styles-colors\">\n        :host {\n          display: block;\n          @apply --paper-font-common-base;\n          @apply --paper-button;\n          --lrnsys-button-height: 48px;\n        }\n        a {\n          text-decoration: none;\n          display: block;\n          color: #000000;\n          display: flex;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 0.16px;\n          height: inherit;\n          -webkit-justify-content: flex-start;\n          justify-content: flex-start;\n          align-items: center;\n          width: 100%;\n          text-transform: unset;\n          border-radius: unset;\n          display: flex;\n        }\n        paper-button iron-icon {\n          height: var(--lrnsys-button-height);\n          margin: 0 4px;\n        }\n        paper-button iron-icon:first-child {\n          margin: 0 4px 0 0;\n        }\n        paper-button iron-icon:last-child {\n          margin: 0 0 0 4px;\n        }\n        paper-button div.inner {\n          height: var(--lrnsys-button-height);\n          line-height: var(--lrnsys-button-height);\n          display: flex;\n          padding: 0 16px;\n        }\n        paper-button span.label {\n          height: var(--lrnsys-button-height);\n          line-height: var(--lrnsys-button-height);\n        }\n        .no-margin {\n          margin: 0 !important;\n        }\n        .no-right-padding {\n          padding-right: 0 !important;\n        }\n        .no-left-padding {\n          padding-left: 0 !important;\n        }\n      </style>\n    </custom-style>\n    <a\n      tabindex=\"-1\"\n      id=\"lrnsys-button-link\"\n      href\\$=\"[[showHref]]\"\n      data-prefetch-hover\\$=\"[[prefetch]]\"\n      target\\$=\"[[target]]\"\n    >\n      <paper-button\n        id=\"button\"\n        title=\"[[alt]]\"\n        raised=\"[[raised]]\"\n        class\\$=\"[[buttonClass]] [[color]] [[textColor]]\"\n        disabled\\$=\"[[disabled]]\"\n      >\n        <div class\\$=\"inner [[innerClass]]\">\n          <iron-icon\n            icon=\"[[icon]]\"\n            id=\"icon\"\n            class\\$=\"[[iconClass]]\"\n            hidden\\$=\"[[!icon]]\"\n          ></iron-icon>\n          <span class=\"label\" hidden\\$=\"[[!label]]\"> [[label]] </span>\n          <slot></slot>\n        </div>\n      </paper-button>\n    </a>\n    <paper-tooltip\n      for=\"lrnsys-button-link\"\n      animation-delay=\"0\"\n      hidden\\$=\"[[!alt]]\"\n      >[[alt]]</paper-tooltip\n    >\n  "]);_templateObject_5a557c906a8411e9bb28cbba98fe01b7=function _templateObject_5a557c906a8411e9bb28cbba98fe01b7(){return data};return data}/**
`lrnsys-button`
`A simple button for use in system`

* @demo demo/index.html
*/var LrnsysButton=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_5a557c906a8411e9bb28cbba98fe01b7()),is:"lrnsys-button",properties:{/**
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
     * materializeCSS color class
     */color:{type:String},/**
     * materializeCSS color class for text
     */textColor:{type:String},/**
     * Allow for prefetch data on hover
     */prefetch:{type:String},/**
     * Alt via tooltip.
     */alt:{type:String},/**
     * Disabled state.
     */disabled:{type:Boolean,value:!1},/**
     * Tracks if focus state is applied
     */focusState:{type:Boolean,value:!1}},/**
   * attached life cycle
   */attached:function attached(){this.addEventListener("mousedown",this.tapEventOn.bind(this));this.addEventListener("mouseover",this.tapEventOn.bind(this));this.addEventListener("mouseout",this.tapEventOff.bind(this));this.$.button.addEventListener("focused-changed",this.focusToggle.bind(this))},/**
   * detached event listener
   */detached:function detached(){this.addEventListener("mousedown",this.tapEventOn.bind(this));this.addEventListener("mouseover",this.tapEventOn.bind(this));this.addEventListener("mouseout",this.tapEventOff.bind(this));this.$.button.addEventListener("focused-changed",this.focusToggle.bind(this))},/**
   * Generate the pass down href if it exists. This helps
   * ensure that if a button is disabled it won't do anything
   * even if it has a resource reference.
   */_getShowHref:function _getShowHref(href,disabled){if(href&&!disabled){return href}},/**
   * Class processing on un-tap / hover
   */tapEventOn:function tapEventOn(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}})}},/**
   * Undo class processing on un-tap / hover
   */tapEventOff:function tapEventOff(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}})}},/**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */focusToggle:function focusToggle(e){var _this=this;// weird but reality... focus event is the button inside of here
if(babelHelpers.typeof(this.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!this.disabled){// break class into array
var classes=this.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){if(!_this.focusState){_this.$.button.classList.add(item);if(-1!=item.indexOf("-")){_this.$.icon.classList.add(item)}}else{_this.$.button.classList.remove(item);if(-1!=item.indexOf("-")){_this.$.icon.classList.remove(item)}}}})}this.focusState=!this.focusState}});_exports.LrnsysButton=LrnsysButton});