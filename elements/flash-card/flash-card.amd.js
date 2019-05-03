define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/paper-card/paper-card.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,_polymerLegacy,_paperCard,_HAXWiring,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.FlashCard=void 0;function _templateObject_e5475c706a8311e9b280f78a5df34b44(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n      paper-card {\n        -webkit-perspective: 800;\n        width: 400px;\n        height: 300px;\n        position: relative;\n        padding: 0;\n        margin: 0;\n      }\n      paper-card.flipped {\n        -webkit-transform: rotatex(-180deg);\n      }\n      paper-card.flipped .back {\n        z-index: 3;\n      }\n      paper-card {\n        -webkit-transform-style: preserve-3d;\n        -webkit-transition: 0.5s;\n      }\n      paper-card .face {\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n        cursor: pointer;\n        position: absolute;\n        -webkit-backface-visibility: hidden;\n        z-index: 2;\n        font-family: Georgia;\n        font-size: 48px;\n        text-align: center;\n        line-height: 200px;\n      }\n      paper-card .front {\n        position: absolute;\n        z-index: 1;\n      }\n      paper-card .back {\n        -webkit-transform: rotatex(-180deg);\n      }\n    </style>\n    <paper-card id=\"card\" animated-shadow=\"true\">\n      <div class=\"face front white black-text\">Front</div>\n      <div class=\"face back black white-text\">Back</div>\n    </paper-card>\n  "]);_templateObject_e5475c706a8311e9b280f78a5df34b44=function _templateObject_e5475c706a8311e9b280f78a5df34b44(){return data};return data}/**
`flash-card`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/var FlashCard=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_e5475c706a8311e9b280f78a5df34b44()),is:"flash-card",behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],listeners:{mouseenter:"_flipup",mouseleave:"_flipback"},properties:{/**
     * Title
     */title:{type:String}},/**
   * Attached to the DOM, now fire.
   */attached:function attached(){// Establish hax property binding
var props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Sample gizmo",description:"The user will be able to see this for selection in a UI.",icon:"av:play-circle-filled",color:"grey",groups:["Video","Media"],handles:[{type:"video",url:"source"}],meta:{author:"Your organization on github"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)},/**
   * Flip up
   */_flipup:function _flipup(e){this.$.card.classList.add("flipped")},/**
   * Flip back
   */_flipback:function _flipback(e){this.$.card.classList.remove("flipped")}});_exports.FlashCard=FlashCard});