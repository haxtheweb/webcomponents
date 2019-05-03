/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";/**
 * `meme-maker`
 * Connects lrndesign-gallery to HAX
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 *  -
 */let MemeMaker=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      * {
        box-sizing: border-box;
      }

      figure {
        position: relative;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 20px;
      }

      img {
        width: 100%;
        height: auto;
      }

      .top-text,
      .bottom-text {
        position: absolute;
        left: 0;
        width: 100%;
        padding: 3% 2%;

        text-align: center;
        text-transform: uppercase;
        font-weight: 900;
        font-family: "Impact", "Arial Black", "sans serif";
        line-height: 1.2;

        font-size: 36px;

        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
          1px 1px 0 #000;
        letter-spacing: 2px;
      }

      .top-text {
        top: 0;
      }
      .bottom-text {
        bottom: 0;
      }

      @media (max-width: 600px) {
        .top-text,
        .bottom-text {
          font-size: 20px;
        }
      }
    </style>
    <figure>
      <img src="[[imageUrl]]" alt="[[alt]]" />
      <figcaption class="top-text">[[topText]]</figcaption>
      <figcaption class="bottom-text">[[bottomText]]</figcaption>
    </figure>
  `,is:"meme-maker",behaviors:[HAXBehaviors.PropertiesBehaviors],properties:{/**
     * Alt data passed down to appropriate tag
     */alt:{type:String},/**
     * url to the meme image
     */imageUrl:{type:String},/**
     * Text on top of the image.
     */topText:{type:String},/**
     * Bottom text for the image.
     */bottomText:{type:String}},/**
   * Attached to the DOM, now fire.
   */attached:function(){// Establish hax property binding
let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Meme",description:"Make a meme out of an image",icon:"editor:title",color:"orange",groups:["Content","Text","Meme","Funny"],handles:[{type:"image",source:"imageUrl",title:"topText",author:"bottomText",alt:"alt"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"topText",title:"Top text",description:"Top text of the meme.",inputMethod:"textfield",icon:"editor:title"},{property:"bottomText",title:"Bottom text",description:"The date this was accessed.",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"imageUrl",title:"Source",description:"The source url for the element this is citing.",inputMethod:"haxupload",icon:"link"},{property:"topText",title:"Top text",description:"Top text of the meme.",inputMethod:"textfield",icon:"editor:title"},{property:"bottomText",title:"Bottom text",description:"The date this was accessed.",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)}});export{MemeMaker};