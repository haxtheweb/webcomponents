import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-fab/paper-fab.js";import"./node_modules/@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js";import"./node_modules/@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";let LrnappFabMenu=Polymer({_template:html`
    <custom-style>
      <style include="materializecss-styles-colors"></style>
      <style>
        .open,
        .overlay {
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
    </custom-style>
    <paper-fab
      icon="[[icon]]"
      class="open blue"
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
    </paper-fab-speed-dial-overlay>
  `,is:"lrnapp-fab-menu",properties:{icon:{type:String,value:"add"},opened:{type:Boolean,notify:!0},disabled:{type:Boolean,value:!1}},open:function(e){if(e){e.preventDefault()}this.opened=!0},close:function(e){if(e){e.preventDefault()}this.opened=!1}});export{LrnappFabMenu};