/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";/**
 * `lrnapp-fab-menu`
 * `floating action button with menu`
 *
 * @demo demo/index.html
 */class LrnappFabMenu extends PolymerElement{constructor(){super();import("./node_modules/@polymer/paper-fab/paper-fab.js");import("./node_modules/@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js");import("./node_modules/@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js")}static get template(){return html`
      <style include="simple-colors">
        .open,
        .overlay {
          background-color: var(--simple-colors-default-theme-blue-5);
          position: fixed;
          bottom: var(--paper-fab-speed-dial-bottom, 16px);
          right: var(--paper-fab-speed-dial-right, 16px);
        }
        .open {
          --paper-fab-background: var(--paper-fab-speed-dial-background);
          --paper-fab-keyboard-focus-background: var(
            --paper-fab-speed-dial-keyboard-focus-background
          );
        }
        .close {
          --paper-fab-background: var(--paper-grey-500);
          --paper-fab-keyboard-focus-background: var(--paper-grey-500);
          margin-top: 20px;
          display: inline-block;
        }
        .overlay {
          text-align: right;
        }
      </style>
    
    <paper-fab
      icon="[[icon]]"
      class="open"
      on-tap="open"
      hidden$="[[opened]]"
      disabled$="[[disabled]]"
    ></paper-fab>

    <paper-fab-speed-dial-overlay
      class="overlay"
      opened="{{opened}}"
      with-backdrop
    >
      <slot></slot>
      <paper-fab icon="close" class="close" on-tap="close"></paper-fab>
    </paper-fab-speed-dial-overlay>`}static get tag(){return"lrnapp-fab-menu"}static get properties(){return{icon:{type:String,value:"add"},opened:{type:Boolean,notify:!0},disabled:{type:Boolean,value:!1}}}// Public methods
open(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!0}close(e){// Required for mobile Safari to avoid passing the tap event to an element below the FAB
if(e){e.preventDefault()}this.opened=!1}}window.customElements.define(LrnappFabMenu.tag,LrnappFabMenu);export{LrnappFabMenu};