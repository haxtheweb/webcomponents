/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";/**
 * `media-image`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */class MediaImage extends SchemaBehaviors(PolymerElement){constructor(){super();import("./node_modules/@polymer/iron-image/iron-image.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(MediaImage.haxProperties,MediaImage.tag,this)})}static get template(){return html`
      <style>
        :host {
          display: block;
          font-family: "Roboto", sans-serif;
          width: 100%;
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

        .citation {
          font-size: 12.8px;
          font-style: italic;
          color: #4c4c4c;
          margin: 15px 0 15px;
        }

        .caption {
          padding-bottom: 25px;
          border-bottom: dashed 2px lightgray;
          margin-bottom: 25px;
          line-height: 1.5;
          font-size: 18px;
        }

        iron-image {
          width: 100%;
          --iron-image-width: 100%;
        }
      </style>

      <iron-image
        resource\$="[[schemaResourceID]]-image"
        src\$="[[source]]"
        alt\$="[[alt]]"
      ></iron-image>
      <div class="citation">[[citation]]<slot name="citation"></slot></div>
      <div class="caption">[[caption]]<slot name="caption"></slot></div>
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
       */box:{type:Boolean,value:!1,reflectToAttribute:!0}};if(super.properties){props=Object.assign(props,super.properties)}return props}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Styled image",descrption:"An image gizmo with the ability to provide simple, consistent styling and accessibility options.",icon:"editor:insert-photo",color:"indigo",groups:["Image","Media"],handles:[{type:"image",source:"source",title:"alt",alt:"alt",citation:"citation",caption:"caption"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"source",title:"Source",description:"The URL for the image.",inputMethod:"textfield",icon:"link",required:!0},{property:"alt",title:"Alternative text",description:"Text to describe the image to non-sighted users.",inputMethod:"alt",icon:"accessibility",required:!0}],configure:[{property:"source",title:"Source",description:"The URL for the image.",inputMethod:"haxupload",icon:"link",required:!0},{property:"caption",title:"Caption",description:"A caption to describe the image usage",inputMethod:"haxupload",icon:"av:call-to-action"},{property:"alt",title:"Alternative text",description:"Text to describe the image to non-sighted users.",inputMethod:"alt",icon:"accessibility",required:!0},{property:"round",title:"Round image",description:"Crops the image appearance to be circle in shape.",inputMethod:"boolean",icon:"account",required:!1},{property:"card",title:"Card",description:"Apply a drop shadow to give the appearance of being a raised card.",inputMethod:"boolean",icon:"check-box-outline-blank",required:!1},{property:"box",title:"Box",description:"Apply a visual box around the image.",inputMethod:"boolean",icon:"image:crop-square",required:!1}],advanced:[{property:"citation",title:"Citation",description:"Citation for the image.",inputMethod:"textfield",icon:"text-format",required:!1}]}}}}window.customElements.define(MediaImage.tag,MediaImage);export{MediaImage};