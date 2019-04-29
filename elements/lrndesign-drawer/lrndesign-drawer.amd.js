define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/app-layout/app-layout.js","./node_modules/@polymer/paper-icon-button/paper-icon-button.js","./node_modules/@polymer/paper-tooltip/paper-tooltip.js"],function(_exports,_polymerLegacy,_appLayout,_paperIconButton,_paperTooltip){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrndesignDrawer=void 0;function _templateObject_533af1b06a8411e99e8439ef226d5ea3(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        --lrndesign-drawer-width: 30%;\n      }\n      app-header {\n        z-index: 100;\n      }\n      app-drawer {\n        --app-drawer-width: var(--lrndesign-drawer-width);\n        --app-drawer-content-container: {\n          padding: 16px;\n          overflow-y: scroll;\n          margin-top: 112px;\n        }\n      }\n    </style>\n    <app-header>\n      <app-drawer opened=\"{{opened}}\" align=\"{{align}}\">\n        <slot></slot>\n      </app-drawer>\n    </app-header>\n    <paper-icon-button\n      icon=\"[[icon]]\"\n      alt=\"[[alt]]\"\n      id=\"flyout-drawer\"\n    ></paper-icon-button>\n    <paper-tooltip for=\"flyout-drawer\">[[alt]]</paper-tooltip>\n  "]);_templateObject_533af1b06a8411e99e8439ef226d5ea3=function _templateObject_533af1b06a8411e99e8439ef226d5ea3(){return data};return data}/**
`lrndesign-drawer`


* @demo demo/index.html
*/var LrndesignDrawer=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_533af1b06a8411e99e8439ef226d5ea3()),is:"lrndesign-drawer",properties:{/**
     * State for if it is currently open.
     */opened:{type:Boolean,value:!1},/**
     * Icon to present for clicking.
     */icon:{type:String,value:"icon"},/**
     * Side of the screen to align the flyout (right or left)
     */align:{type:String,value:"left"},/**
     * Alt / hover text for this link
     */alt:{type:String,value:""}},/**
   * Initalize the flyout and ensure it's not open to start
   * while adding the click event to it.
   */ready:function ready(){var root=this,opened=this.opened;this.shadowRoot.querySelector("paper-icon-button").addEventListener("click",function(e){root.opened=!root.opened})}});_exports.LrndesignDrawer=LrndesignDrawer});