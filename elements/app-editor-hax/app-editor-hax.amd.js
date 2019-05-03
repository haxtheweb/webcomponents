define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-store.js","./node_modules/@lrnwebcomponents/hax-body/hax-body.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-autoloader.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-manager.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-panel.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-app-picker.js","./node_modules/@lrnwebcomponents/hax-body/lib/hax-export-dialog.js"],function(_exports,_polymerLegacy,_haxStore,_haxBody,_haxAutoloader,_haxManager,_haxPanel,_haxAppPicker,_haxExportDialog){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AppEditorHax=void 0;function _templateObject_9c46b3906a8311e9afb215fc399b21be(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store\n      skip-exit-trap=\"\"\n      hidden=\"\"\n      app-store=\"[[appStoreConnection]]\"\n    ></hax-store>\n    <hax-autoloader hidden=\"\"></hax-autoloader>\n    <hax-panel\n      id=\"panel\"\n      hide-panel-ops=\"\"\n      hide-export-button=\"\"\n      hide-preferences-button$=\"[[hidePreferencesButton]]\"\n      align=\"right\"\n    ></hax-panel>\n    <hax-body id=\"body\"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n  "],["\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store\n      skip-exit-trap=\"\"\n      hidden=\"\"\n      app-store=\"[[appStoreConnection]]\"\n    ></hax-store>\n    <hax-autoloader hidden=\"\"></hax-autoloader>\n    <hax-panel\n      id=\"panel\"\n      hide-panel-ops=\"\"\n      hide-export-button=\"\"\n      hide-preferences-button\\$=\"[[hidePreferencesButton]]\"\n      align=\"right\"\n    ></hax-panel>\n    <hax-body id=\"body\"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n  "]);_templateObject_9c46b3906a8311e9afb215fc399b21be=function _templateObject_9c46b3906a8311e9afb215fc399b21be(){return data};return data}/**
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

*/var AppEditorHax=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_9c46b3906a8311e9afb215fc399b21be()),is:"app-editor-hax",properties:{/**
     * Establish the app store connection to pull in our JSON
     */appStoreConnection:{type:Object},/**
     * Ability to hide the preferences button
     */hidePreferencesButton:{value:!1,type:Boolean}},/**
   * Basic save event to make targetting easier.
   */save:function save(){// convert the body area to content
var content=window.HaxStore.instance.activeHaxBody.haxToContent();// fire event so apps can react correctly
this.fire("app-editor-hax-save",content)},/**
   * Basic import capability abstraction of hax body's import capabilities
   */import:function _import(html){// import the HTML blob to get going
window.HaxStore.instance.activeHaxBody.importContent(html);// fire event just letting things know this happened
this.fire("app-editor-hax-import",!0)}});_exports.AppEditorHax=AppEditorHax});