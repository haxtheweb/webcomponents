define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js","./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"],function(_exports,_polymerLegacy,_a11yBehaviors,_materializecssStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrndesignSidenote=void 0;function _templateObject_7a4556f06a8511e9bc814d8b5a4a12d7(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        --container-bg-color: lightgray;\n        --container-text-color: black;\n        --container-padding: 16px;\n        --container-outset: 0;\n        @apply --host-styles;\n      }\n\n      #container {\n        display: block;\n        background: var(--container-bg-color);\n        color: var(--container-text-color);\n        padding: var(--container-padding);\n        margin-left: -var(--container-outset);\n        @apply --container-styles;\n      }\n\n      #header {\n        display: flex;\n        align-items: center;\n        @apply --container-header;\n      }\n\n      #icon {\n        margin-right: 8px;\n        @apply --icon-styles;\n      }\n\n      #label {\n        font-size: 20.8px;\n        margin: 12.8px 0;\n        flex: 1 1 auto;\n        @apply --label-styles;\n      }\n    </style>\n    <div id=\"container\">\n      <div id=\"header\">\n        <iron-icon id=\"icon\" icon=\"[[icon]]\" hidden$=\"[[!icon]]\"></iron-icon>\n        <div id=\"label\" hidden$=\"[[!label]]\">[[label]]</div>\n      </div>\n      <slot></slot>\n    </div>\n  "],["\n    <style>\n      :host {\n        display: block;\n        --container-bg-color: lightgray;\n        --container-text-color: black;\n        --container-padding: 16px;\n        --container-outset: 0;\n        @apply --host-styles;\n      }\n\n      #container {\n        display: block;\n        background: var(--container-bg-color);\n        color: var(--container-text-color);\n        padding: var(--container-padding);\n        margin-left: -var(--container-outset);\n        @apply --container-styles;\n      }\n\n      #header {\n        display: flex;\n        align-items: center;\n        @apply --container-header;\n      }\n\n      #icon {\n        margin-right: 8px;\n        @apply --icon-styles;\n      }\n\n      #label {\n        font-size: 20.8px;\n        margin: 12.8px 0;\n        flex: 1 1 auto;\n        @apply --label-styles;\n      }\n    </style>\n    <div id=\"container\">\n      <div id=\"header\">\n        <iron-icon id=\"icon\" icon=\"[[icon]]\" hidden\\$=\"[[!icon]]\"></iron-icon>\n        <div id=\"label\" hidden\\$=\"[[!label]]\">[[label]]</div>\n      </div>\n      <slot></slot>\n    </div>\n  "]);_templateObject_7a4556f06a8511e9bc814d8b5a4a12d7=function _templateObject_7a4556f06a8511e9bc814d8b5a4a12d7(){return data};return data}/**
`lrndesign-sidenote`
A basic side note

* @demo demo/index.html
*/var LrndesignSidenote=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_7a4556f06a8511e9bc814d8b5a4a12d7()),is:"lrndesign-sidenote",behaviors:[A11yBehaviors.A11y,MaterializeCSSBehaviors.ColorBehaviors],properties:{/**
     * The display label
     */label:{type:String,value:""},/**
     * The display icon for the element
     */icon:{type:String,value:""},/**
     * Background Color
     */bgColor:{type:String,value:"#f7f7f7"},/**
     * Outset will move the entire element left to make it
     * stand out from the content.
     */outset:{type:Number,value:0},/**
     * Define the unit of measure for the outset variable
     * Examples: 'em', 'px', '%', 'vw'
     */outsetMeasurementType:{type:String,value:"em"}},/**
   * Create global overrides for each property defined in a component
   *
   * Example: this will override the default value for bgColor for all
   *          lrndesign-sidenote elements on the page.
   *
   *  _.set(window, 'lrndesignSidenote.bgColor', 'blue');
   */created:function created(){for(var prop in this.properties){var prefix=this.is;// convert prefix to camel case
prefix=prefix.replace("-"," ").replace(/(?:^\w|[A-Z]|\b\w)/g,function(letter,index){return 0==index?letter.toLowerCase():letter.toUpperCase()}).replace(/\s+/g,"");// find out if a property override is set on the window object
if("undefined"!==typeof window[prefix]){if("undefined"!==typeof window[prefix][prop]){this.properties[prop].value=window[prefix][prop]}}}},observers:["__updateStyles(bgColor, outset, outsetMeasurementType)"],__updateStyles:function __updateStyles(bgColor,outset,outsetMeasurementType){var bgColorHex=this._colorTransformFromClass(bgColor)||bgColor;this.updateStyles({"--container-text-color":this.getTextContrastColor(bgColorHex),"--container-bg-color":bgColorHex,"--container-outset":"".concat(+outset).concat(outsetMeasurementType)})}});_exports.LrndesignSidenote=LrndesignSidenote});