define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js","./node_modules/@polymer/iron-image/iron-image.js","./node_modules/@polymer/paper-slider/paper-slider.js"],function(_exports,_polymerLegacy,_HAXWiring,_schemaBehaviors,_ironImage,_paperSlider){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ImageCompareSlider=void 0;function _templateObject_c0da2ac06d0811e985bc9341e0adf88b(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: inline-flex;\n        width: 100%;\n        @apply --image-compare-slider;\n      }\n      :host > div,\n      :host #container,\n      :host #top {\n        width: 100%;\n      }\n      :host #container {\n        background-size: cover;\n        overflow: visible;\n        @apply --image-compare-slider-container;\n      }\n      :host #top {\n        background-size: auto 100%;\n        overflow: hidden;\n      }\n      :host #slider {\n        width: calc(100% + 30px);\n        margin-left: -15px;\n        @apply --image-compare-slider-control;\n      }\n    </style>\n    <div>\n      <h2>[[title]]</h2>\n      <div id=\"container\" style$=\"background-image: url([[bottomSrc]]);\">\n        <div id=\"top\" style$=\"background-image: url([[topSrc]]);\"></div>\n      </div>\n      <paper-slider id=\"slider\" value=\"50\"></paper-slider>\n      <div></div>\n    </div>\n  "]);_templateObject_c0da2ac06d0811e985bc9341e0adf88b=function _templateObject_c0da2ac06d0811e985bc9341e0adf88b(){return data};return data}/**
 * `image-compare-slider`
 * Layers images over each other with a slider interface to compare them
 * @microcopy - the mental model for this element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var ImageCompareSlider=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_c0da2ac06d0811e985bc9341e0adf88b()),is:"image-compare-slider",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],observers:["_setStyles(width,height,sliderPercent)"],properties:{/**
     * Title
     */title:{type:String},/**
     * src for top image
     */topSrc:{type:String,observer:"_updateAspect"},/**
     * mode for the slider: wipe
     */opacity:{type:Boolean,value:!1},/**
     * src for top image
     */bottomSrc:{type:String}},ready:function ready(){var root=this,slider=root.$.slider;root._updateAspect();root._slide();slider.addEventListener("immediate-value-changed",function(e){root._slide()})},/**
   * updates the slider
   */_slide:function _slide(){var root=this,slider=root.$.slider,top=root.$.top;if(!1===this.opacity){top.style.width=slider.immediateValue+"%"}else{top.style.opacity=slider.immediateValue/100}},/**
   * updates the aspect ratio
   */_updateAspect:function _updateAspect(){var root=this,img=document.createElement("img"),el=root.$.top,getAspect=function getAspect(img){el.style.paddingTop=100*img.height/img.width+"%"};root.__aspect="75";img.setAttribute("src",root.topSrc);if(img.height!==void 0&&0<img.height){getAspect(img)}else{img.addEventListener("load",function(){getAspect(img)})}},/**
   * Attached to the DOM, now fire.
   */attached:function attached(){// Establish hax property binding
var props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Image comparison",description:"Simple element to allow one image to swipe over top of the other.",icon:"image:compare",color:"orange",groups:["Image","Media"],handles:[{type:"image",source:"bottomSrc",source2:"topSrc",title:"title"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"opacity",title:"Slider Behavior",description:"Do you want the slider to wipe the top image across the bottom one (default), or to adjust the opacity of the top image?",inputMethod:"select",options:{false:"wipe across",true:"adjust opacity"},icon:"image:compare"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield"},{property:"bottomSrc",title:"Bottom image",description:"The base image to swipe over",inputMethod:"haxupload",validationType:"url"},{property:"topSrc",title:"Top image",description:"The top image that swipes over",inputMethod:"haxupload",validationType:"url"}],advanced:[]}};this.setHaxProperties(props)}});_exports.ImageCompareSlider=ImageCompareSlider});