/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";/**
 * `elmsln-loading`
 * A spinner to tell the user that something is loading.
 * This is just the spinner though and doesn't provide any text or anything else.
 *
 * @microcopy - language worth noting:
 *  - elmsln - an open source NGDLE to save education
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */class ElmslnLoading extends PolymerElement{static get tag(){return"elmsln-loading"}static get properties(){return{/**
       * materialize class names for color
       */color:{type:String},/**
       * Class for the color
       */hexColor:{type:String,computed:"_getHexColor(color)"},/**
       * tiny, small, medium, large, epic sizing.
       */size:{type:String,reflectToAttribute:!0,value:"medium"}}}static get template(){return html`
      <style include="simple-colors">
        @-moz-keyframes spin {
          100% {
            -moz-transform: rotate(60deg);
            filter: saturate(10) invert(0.9);
          }
        }
        @-webkit-keyframes spin {
          100% {
            -webkit-transform: rotate(60deg);
            filter: saturate(10) invert(0.9);
          }
        }
        @keyframes spin {
          100% {
            -webkit-transform: rotate(60deg);
            transform: rotate(60deg);
          }
        }
        :host iron-icon {
          display: block;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="tiny"]) iron-icon {
          width: 16px;
          height: 16px;
          -webkit-animation: spin 0.75s ease-out infinite;
          -moz-animation: spin 0.75s ease-out infinite;
          animation: spin 0.75s ease-out infinite;
        }
        :host([size="small"]) iron-icon {
          width: 32px;
          height: 32px;
          -webkit-animation: spin 1s ease-out infinite;
          -moz-animation: spin 1s ease-out infinite;
          animation: spin 1s ease-out infinite;
        }
        :host([size="medium"]) iron-icon {
          width: 64px;
          height: 64px;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="large"]) iron-icon {
          width: 80px;
          height: 80px;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="epic"]) iron-icon {
          width: 400px;
          height: 400px;
          -webkit-animation: spin 2s ease-out infinite;
          -moz-animation: spin 2s ease-out infinite;
          animation: spin 2s ease-out infinite;
        }
      </style>
      <iron-icon icon="lrn:network" style$="color:[[hexColor]]"></iron-icon>
    `}_getHexColor(color){let name=color.replace("-text",""),tmp=new SimpleColors;if(tmp.colors[name]){return tmp.colors[name][6]}return"#000000"}}window.customElements.define(ElmslnLoading.tag,ElmslnLoading);export{ElmslnLoading};