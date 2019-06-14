define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/h-a-x/h-a-x.js"],function(_exports,_polymerElement,_renderStatus,_hAX){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AppEditorHax=void 0;function _templateObject_773fec6081c111e9976a1bbaaec4c3ec(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          font-size: 16px;\n          box-sizing: content-box;\n        }\n      </style>\n      <h-a-x app-store$=\"[[appStoreConnection]]\"></h-a-x>\n    "]);_templateObject_773fec6081c111e9976a1bbaaec4c3ec=function _templateObject_773fec6081c111e9976a1bbaaec4c3ec(){return data};return data}/**
`app-editor-hax`
stand alone editor intended for use in a larger application
as the editor. It is like cms-hax in that it's prepackaged
the way HAX will be integrated but the connotation is that there
is no edit state and that it is always editing effectively.

* @demo demo/index.html

@microcopy - the mental model for this element
 - app - an application desktop or mobile that's deployed this
 - editor - in this case HAX is the editor / authoring tool
 - hax - just to make sure we're aware that it's actually HAX based

*/var AppEditorHax=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(AppEditorHax,_PolymerElement);function AppEditorHax(){babelHelpers.classCallCheck(this,AppEditorHax);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(AppEditorHax).apply(this,arguments))}babelHelpers.createClass(AppEditorHax,[{key:"save",/**
   * Basic save event to make targetting easier.
   */value:function save(){// convert the body area to content
var content=window.HaxStore.instance.activeHaxBody.haxToContent();// fire event so apps can react correctly
this.dispatchEvent(new CustomEvent("app-editor-hax-save",{bubbles:!0,cancelable:!0,composed:!0,detail:content}))}/**
   * Basic import capability abstraction of hax body's import capabilities
   */},{key:"import",value:function _import(html){// import the HTML blob to get going
window.HaxStore.instance.activeHaxBody.importContent(html);// fire event just letting things know this happened
this.dispatchEvent(new CustomEvent("app-editor-hax-import",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}))}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_773fec6081c111e9976a1bbaaec4c3ec())}},{key:"tag",get:function get(){return"app-editor-hax"}},{key:"properties",get:function get(){return{/**
       * Establish the app store connection to pull in our JSON
       */appStoreConnection:{type:Object}}}}]);return AppEditorHax}(_polymerElement.PolymerElement);_exports.AppEditorHax=AppEditorHax;window.customElements.define(AppEditorHax.tag,AppEditorHax)});