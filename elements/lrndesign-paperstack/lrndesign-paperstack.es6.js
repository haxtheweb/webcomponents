/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";import"./node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";/**
 * `lrndesign-paperstack`
 * `Stack of papers visually`
 *
 * @demo demo/index.html
 */let LrndesignPaperstack=Polymer({_template:html`
    <style include="simple-colors">
      :host {
        display: block;
        font-size: 14px;
        --lrndesign-paperstack-bg: var(--simple-colors-default-theme-grey-1);
        --lrndesign-paperstack-faded-bg: var(
          --simple-colors-default-theme-grey-2
        );
        --lrndesign-paperstack-border: var(
          --simple-colors-default-theme-grey-4
        );
        --lrndesign-paperstack-shadow: var(
          --simple-colors-default-theme-grey-12
        );
        --lrndesign-paperstack-accent: var(
          --simple-colors-default-theme-accent-8
        );
        --lrndesign-paperstack-text: var(--simple-colors-default-theme-grey-12);
        --lrndesign-paperstack-heading-font: cursive;
      }
      :host([dark]) {
        --lrndesign-paperstack-bg: var(--simple-colors-default-theme-accent-4);
        --lrndesign-paperstack-faded-bg: var(
          --simple-colors-default-theme-accent-3
        );
        --lrndesign-paperstack-border: var(
          --simple-colors-default-theme-accent-1
        );
        --lrndesign-paperstack-shadow: var(
          --simple-colors-default-theme-grey-1
        );
        --lrndesign-paperstack-accent: var(
          --simple-colors-default-theme-grey-12
        );
        --lrndesign-paperstack-text: var(--simple-colors-default-theme-grey-12);
      }
      .stack {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      .paper {
        min-height: 160px;
        width: 80%;
        padding: 12px 24px;
        position: absolute;
        flex: 1 1 auto;
        left: 0;
        top: 0;
        box-shadow: 0 0 1px var(--lrndesign-paperstack-shadow);
        border: 1px solid var(--lrndesign-paperstack-border);
      }
      .paper:first-of-type {
        left: -0.32px;
        top: 0.32px;
        transform: rotate(-2.5deg);
        background-color: var(--lrndesign-paperstack-faded-bg);
      }
      .paper:nth-of-type(2) {
        right: -0.32px;
        top: 1.6px;
        transform: rotate(1.4deg);
        background-color: var(--lrndesign-paperstack-faded-bg);
      }
      .front {
        flex: 0 0 100%;
        position: relative;
        margin-bottom: 48px;
        background-color: var(--lrndesign-paperstack-bg);
        color: var(--lrndesign-paperstack-text);
      }

      iron-icon {
        width: 90%;
        height: 90%;
        flex: 1 1 auto;
        color: var(--lrndesign-paperstack-bg);
      }
      .heading {
        display: flex;
        align-items: center;
      }
      .icon-container {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--lrndesign-paperstack-accent);
        margin-right: 8px;
        display: flex;
        align-items: center;
      }
      .title {
        font-size: 16px;
        color: var(--lrndesign-paperstack-accent);
        font-family: var(--lrndesign-paperstack-heading-font);
      }
    </style>
    <div class="stack">
      <div class="paper"></div>
      <div class="paper"></div>
      <div class="front paper">
        <div class="heading">
          <div class="icon-container circle">
            <iron-icon icon="[[icon]]"></iron-icon>
          </div>
          <span class="title">[[title]]</span>
        </div>
        <p><slot></slot></p>
      </div>
    </div>
  `,is:"lrndesign-paperstack",behaviors:[HAXBehaviors.PropertiesBehaviors,A11yBehaviors.A11y,SimpleColors],properties:{/**
     * Title
     */title:{type:String,value:"Title"},/**
     * icon
     */icon:{type:String,value:"lrn:assignment"}},/**
   * Attached.
   */attached:function(){// Establish hax properties if they exist
let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Paper stack",description:"A stack of papers",icon:"icons:content-copy",color:"grey",groups:["Video","Media"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"Title of the cards",inputMethod:"textfield",icon:"editor:title"},{property:"accentColor",title:"Accent Color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"}],configure:[{property:"title",title:"Title",description:"Title of the cards",inputMethod:"boolean"},{property:"accentColor",title:"Accent Color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"},{property:"icon",title:"Icon",description:"Icon for the card",inputMethod:"iconpicker"},{slot:"",title:"Contents",description:"card contents",inputMethod:"code-editor"}],advanced:[]}};this.setHaxProperties(props)}});export{LrndesignPaperstack};