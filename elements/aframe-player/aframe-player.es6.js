/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";/**
 * `aframe-player`
 * `A wrapper to do data binding into aframe`
 *
 * @demo demo/index.html
 */class AframePlayer extends SchemaBehaviors(PolymerElement){static get template(){return html`
      <style>
        :host {
          display: block;
          position: relative;
        }
        .a-hidden {
          display: hidden;
        }
      </style>
      <a-scene
        id="scene"
        class="embedded"
        embedded
        arjs$="[[ar]]"
        style$="height:[[height]];width:[[width]];"
      >
        <a-sky color\$="[[skyColor]]"></a-sky>
        <a-marker-camera preset="hiro"></a-marker-camera>
      </a-scene>
    `}static get tag(){return"aframe-player"}static get properties(){let props={/**
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
       */position:{type:Object,computed:"_computePosition(x, y, z, width, height)",observer:"_positionChanged"}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * highjack shadowDom
   */_attachDom(dom){this.appendChild(dom)}disconnectedCallback(){window.removeEventListener("es-bridge-aframePlayer-loaded",this._aframeLoaded.bind(this));super.disconnectedCallback()}constructor(){super();afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(AframePlayer.haxProperties,AframePlayer.tag,this)})}static get haxProperties(){return{canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"3D player",description:"A 3D file / augmented reality player.",icon:"av:play-circle-filled",color:"amber",groups:["3D","Augmented reality"],handles:[{type:"3d",source:"source"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"height",title:"height",description:"height of the object",inputMethod:"textfield",type:"bar",icon:"image:photo-size-select-small",required:!0},{property:"width",title:"Width",description:"Width of the object",inputMethod:"textfield",type:"bar",icon:"image:straighten",required:!0}],configure:[{property:"source",title:"Source",description:"The URL for this AR file.",inputMethod:"textfield",type:"bar",icon:"link",required:!0},{property:"x",title:"X",description:"X position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"y",title:"Y",description:"Y position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"z",title:"Z",description:"Z position of the element in AR.",inputMethod:"textfield",type:"bar",icon:"communication:location-on",required:!0},{property:"skyColor",title:"Sky color",description:"Select the color of the sky in the scene.",inputMethod:"colorpicker",type:"bar",icon:"editor:format-color-fill"}],advanced:[]}}}/**
   * Attached.
   */connectedCallback(){super.connectedCallback();let location="https://aframe.io/releases/0.9.2/aframe.min.js";if("object"===typeof TWEEN)this._aframeLoaded.bind(this);window.addEventListener("es-bridge-aframePlayer-loaded",this._aframeLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("aframePlayer",location)}_aframeLoaded(el){// ensure that this doesn't put full screen styles on the page!
this.$.scene.removeFullScreenStyles();this.__entity=document.createElement("a-entity");this.__entity.setAttribute("gltf-model","url("+this.source+")");this._positionChanged();this.$.scene.appendChild(this.__entity)}/**
   * Generate position object based on format a-frame expects.
   */_computePosition(x,y,z,width,height){return{x:x,y:y,z:z}}/**
   * When position is updated, inject this into a-frame tag.
   */_positionChanged(position){if(this.__entity!==void 0)this.__entity.setAttribute("position",position)}}window.customElements.define(AframePlayer.tag,AframePlayer);export{AframePlayer};