/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/polymer/lib/elements/dom-if.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";// This blows up for some reason
// import './lib/media-image-caption.js'
// import './lib/media-image-citation.js'
/**
 * `media-image`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */class MediaImage extends SchemaBehaviors(PolymerElement){constructor(){super();import("./node_modules/@polymer/iron-image/iron-image.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(MediaImage.haxProperties,MediaImage.tag,this)})}static get template(){return html`
      <style>
        :host {
          display: block;
          width: auto;
          margin: auto;
          --box-background-color: #f7f6ef;
        }

        :host([card]) {
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.14);
          padding: 20px;
        }

        :host([box]) {
          background-color: var(--box-background-color);
          padding: 20px;
        }

        :host([round]) iron-image {
          border-radius: 50%;
        }

        @media screen and (min-width: 450px) {
          :host([size="small"]) {
            max-width: 50%;
          }
        }

        @media screen and (min-width: 650px) {
          :host([size="small"]) {
            max-width: 35%;
          }
        }

        @media screen and (min-width: 900px) {
          :host([size="small"]) {
            max-width: 25%;
          }
        }

        iron-image {
          width: 100%;
          --iron-image-width: 100%;
        }

        :host([offset="left"]) {
          float: left;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-left: calc(-2 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="right"]) {
          float: right;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-right: calc(-2 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="wide"]) {
          margin: 0 calc(-1 * var(--media-image-offset-wide-width, 3.5vw));
          max-width: 100vw;
        }

        :host([offset="narrow"]) {
          max-width: var(--media-image-offset-narrow-max-width, 500px);
          margin: auto;
        }
      </style>
      <iron-image
        resource\$="[[schemaResourceID]]-image"
        src\$="[[source]]"
        alt\$="[[alt]]"
      ></iron-image>

      <media-image-citation>
        <slot name="citation">
          [[citation]]
        </slot>
      </media-image-citation>

      <media-image-caption>
        <slot name="caption">
          [[caption]]
        </slot>
      </media-image-caption>
    `}static get tag(){return"media-image"}static get properties(){let props={/**
       * Image source.
       */source:{type:String,value:""},/**
       * Image citation.
       */citation:{type:String,value:""},/**
       * Image caption.
       */caption:{type:String,value:""},/**
       * Image alt.
       */alt:{type:String,value:""},/**
       * The size of the image (small, wide).
       */size:{type:String,value:"wide",reflectToAttribute:!0},/**
       * The shape of the image (round).
       */round:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Applies card styling.
       */card:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Applies box styling.
       */box:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Applies left or right offset
       * - none
       * - left
       * - right
       * - wide
       * - narrow
       */offset:{type:String,value:"none",reflectToAttribute:!0}};if(super.properties){props=Object.assign(props,super.properties)}return props}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Styled image",descrption:"An image gizmo with the ability to provide simple, consistent styling and accessibility options.",icon:"editor:insert-photo",color:"indigo",groups:["Image","Media"],handles:[{type:"image",source:"source",title:"alt",alt:"alt",citation:"citation",caption:"caption"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"source",title:"Source",description:"The URL for the image.",inputMethod:"textfield",icon:"link",required:!0},{property:"alt",title:"Alternative text",description:"Text to describe the image to non-sighted users.",inputMethod:"textfield",icon:"accessibility",required:!1}],configure:[{property:"source",title:"Source",description:"The URL for the image.",inputMethod:"haxupload",icon:"link",required:!0},{property:"alt",title:"Alternative text",description:"Text to describe the image to non-sighted users.",inputMethod:"alt",icon:"accessibility",required:!0},{property:"round",title:"Round image",description:"Crops the image appearance to be circle in shape.",inputMethod:"boolean",icon:"account",required:!1},{property:"card",title:"Card",description:"Apply a drop shadow to give the appearance of being a raised card.",inputMethod:"boolean",icon:"check-box-outline-blank",required:!1},{property:"box",title:"Box",description:"Apply a visual box around the image.",inputMethod:"boolean",icon:"image:crop-square",required:!1},{property:"offset",title:"Offset",description:"Apply a left or right offset to the image.",inputMethod:"select",icon:"image:crop-square",options:{none:"none",left:"left",right:"right",wide:"wide",narrow:"narrow"}},{property:"citation",title:"Citation",description:"Citation for the image.",inputMethod:"textfield",icon:"text-format",required:!1},{property:"caption",title:"Caption",description:"Caption for the image.",inputMethod:"textfield",icon:"text-format",required:!1}]}}}}window.customElements.define(MediaImage.tag,MediaImage);/**
 * `media-image-citation`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */class MediaImageCitation extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
        }

        .citation {
          font-size: 12.8px;
          font-style: italic;
          color: #4c4c4c;
          margin: 15px 0 15px;
        }
      </style>
      <div class="citation"><slot></slot></div>
    `}static get tag(){return"media-image-citation"}}window.customElements.define(MediaImageCitation.tag,MediaImageCitation);/**
 * `media-image-caption`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */class MediaImageCaption extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
        }

        .caption {
          padding-bottom: 25px;
          border-bottom: dashed 2px lightgray;
          margin-bottom: 25px;
          line-height: 1.5;
          font-size: 18px;
        }

        ::slotted(*) {
          margin-top: 0;
        }
        ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      </style>
      <div class="caption" hidden$="[[!__hasContent]]">
        <slot id="slot"></slot>
      </div>
    `}static get tag(){return"media-image-caption"}}window.customElements.define(MediaImageCaption.tag,MediaImageCaption);export{MediaImage};