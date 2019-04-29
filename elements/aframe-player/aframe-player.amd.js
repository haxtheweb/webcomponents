define(["exports","meta","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js"],function(_exports,meta,_polymerLegacy,_resolveUrl,_HAXWiring,_schemaBehaviors,_esGlobalBridge){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AframePlayer=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_7c5758f06a8311e9b3784975b82244bd(){var data=babelHelpers.taggedTemplateLiteral(["\n    <custom-style>\n      <style is=\"custom-style\">\n        :host {\n          display: block;\n          position: relative;\n        }\n        .a-hidden {\n          display: hidden;\n        }\n      </style>\n    </custom-style>\n    <a-scene\n      id=\"scene\"\n      class=\"embedded\"\n      embedded\n      arjs$=\"[[ar]]\"\n      style$=\"height:[[height]];width:[[width]];\"\n    >\n      <a-sky color$=\"[[skyColor]]\"></a-sky>\n      <a-marker-camera preset=\"hiro\"></a-marker-camera>\n    </a-scene>\n  "],["\n    <custom-style>\n      <style is=\"custom-style\">\n        :host {\n          display: block;\n          position: relative;\n        }\n        .a-hidden {\n          display: hidden;\n        }\n      </style>\n    </custom-style>\n    <a-scene\n      id=\"scene\"\n      class=\"embedded\"\n      embedded\n      arjs$=\"[[ar]]\"\n      style$=\"height:[[height]];width:[[width]];\"\n    >\n      <a-sky color\\$=\"[[skyColor]]\"></a-sky>\n      <a-marker-camera preset=\"hiro\"></a-marker-camera>\n    </a-scene>\n  "]);_templateObject_7c5758f06a8311e9b3784975b82244bd=function _templateObject_7c5758f06a8311e9b3784975b82244bd(){return data};return data}/**
 * `aframe-player`
 * `A wrapper to do data binding into aframe`
 *
 * @demo demo/index.html
 */var AframePlayer=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_7c5758f06a8311e9b3784975b82244bd()),is:"aframe-player",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{/**
     * Source to reference for the 3D object
     */source:{type:String,value:""},/**
     * height of the element
     */height:{type:String,value:"480px"},/**
     * width of the element
     */width:{type:String,value:"640px"},/**
     * Color of the sky / background.
     */skyColor:{type:String,value:"#DCDCDC"},/**
     * If this is for augmented reality or not.
     */ar:{type:Boolean,value:!1},/**
     * x position for the AR element.
     */x:{type:String,value:"0"},/**
     * y position for the AR element.
     */y:{type:String,value:"0"},/**
     * z position for the AR element.
     */z:{type:String,value:"0"},/**
     * Generate a position object when coordinates change.
     */position:{type:Object,computed:"_computePosition(x, y, z, width, height)",observer:"_positionChanged"}},/**
   * highjack shadowDom
   */_attachDom:function _attachDom(dom){this.appendChild(dom)},/**
   * Attached.
   */attached:function attached(){var name="aframePlayer",basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/aframe/dist/aframe-master.js");if("object"===("undefined"===typeof TWEEN?"undefined":babelHelpers.typeof(TWEEN)))this._aframeLoaded.bind(this);window.addEventListener("es-bridge-".concat(name,"-loaded"),this._aframeLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location);var props={canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"3D player",description:"A 3D file / augmented reality player.",icon:"av:play-circle-filled",color:"amber",groups:["3D","Augmented reality"],handles:[{type:"3d",source:"source"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"height",title:"height",description:"height of the object",inputMethod:"textfield",type:"bar",icon:"image:photo-size-select-small",required:!0},{property:"width",title:"Width",description:"Width of the object",inputMethod:"textfield",type:"bar",icon:"image:straighten",required:!0}],configure:[{property:"source",title:"Source",description:"The URL for this AR file.",inputMethod:"textfield",type:"bar",icon:"link",required:!0},{property:"x",title:"X",description:"X position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"y",title:"Y",description:"Y position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"z",title:"Z",description:"Z position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"skyColor",title:"Sky color",description:"Select the color of the sky in the scene.",inputMethod:"colorpicker",type:"bar",icon:"editor:format-color-fill"}],advanced:[]}};this.setHaxProperties(props)},_aframeLoaded:function _aframeLoaded(el){// ensure that this doesn't put full screen styles on the page!
this.$.scene.removeFullScreenStyles();this.__entity=document.createElement("a-entity");this.__entity.setAttribute("gltf-model","url("+this.source+")");this._positionChanged();this.$.scene.appendChild(this.__entity)},/**
   * Generate position object based on format a-frame expects.
   */_computePosition:function _computePosition(x,y,z,width,height){return{x:x,y:y,z:z}},/**
   * When position is updated, inject this into a-frame tag.
   */_positionChanged:function _positionChanged(position){if(this.__entity!==void 0)this.__entity.setAttribute("position",position)}});_exports.AframePlayer=AframePlayer});