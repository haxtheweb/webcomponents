import{html,Polymer}from"../node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"../node_modules/@polymer/paper-button/paper-button.js";import"../node_modules/@polymer/iron-icons/iron-icons.js";import"../node_modules/@polymer/iron-icons/editor-icons.js";import"../node_modules/@polymer/iron-icons/device-icons.js";import"../node_modules/@polymer/iron-icons/hardware-icons.js";import"../node_modules/@polymer/iron-icons/communication-icons.js";import"../node_modules/@polymer/iron-icons/social-icons.js";import"../node_modules/@polymer/iron-icons/av-icons.js";import"../node_modules/@polymer/iron-icons/maps-icons.js";import"../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";Polymer({_template:html`
    <style is="custom-style" include="materializecss-styles-colors">
      :host {
        display: inline-flex;
        margin: 0;
        padding: 0;
        --hax-panel-hover: var(--simple-colors-default-theme-light-green-1);
      }
      paper-button {
        color: rgba(0,0,0,0.66);
        margin: 0;
        text-transform: none;
        background-color: #2e2e2e !important;
        color: #eeeeee;
        display: flex;
        padding: 0;
        border-radius: 0;
        border: none;
        height: 64px;
        width: 80px;
        min-width: unset;
      }
      :host([edged="left"]) paper-button {
        border-bottom-right-radius: 16px;
      }
      :host([edged="right"]) paper-button {
        border-bottom-left-radius: 16px;
      }
      paper-button .label {
        font-size: 14px;
        margin: 0;
        max-height: 16px;
        background: transparent;
        vertical-align: unset;
        border-radius: unset;
        height: unset;
        min-width: unset;
        line-height: unset;
        display: unset;
        text-align: unset;
        margin-right: unset;
        display: block;
      }
      paper-button .button-inner {
        padding: 0;
        text-align: center;
        margin: 0 auto;
      }
      paper-button iron-icon {
        height: 32px;
        width: 24px;
        display: inline-flex;
      }
      paper-button:hover .label,
      paper-button:focus .label {
        color: var(--hax-panel-hover);
      }
      paper-button:hover iron-icon,
      paper-button:focus iron-icon {
        color: var(--hax-panel-hover) !important;
      }
      paper-button[disabled] {
        opacity: .5;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
      @media screen and (max-width: 550px) {
        paper-button {
          height: 40px;
          width: 48px;
          overflow: hidden;
        }
        paper-button iron-icon {
          height: 20px;
          width: 20px;
        }
        paper-button .label {
          max-height: 8px;
          font-size: 11px;
        }
      }
      :host([light]) paper-button {
        height: 32px !important;
        border-radius: 6px;
        margin-top: 8px;
        margin-left: 8px;
        border: solid #2196f3 2px;
        background-color:#ffffff !important;
        color: #2196f3;
        text-transform:uppercase;
        font-weight:800;
      }
      :host([light]) paper-button iron-icon {
        display: none;
      }
      :host([light]) paper-button:hover{
        border: solid #1e88e5 2px;
        background-color:#f5f5f5 !important;
      }
    </style>
    <paper-button disabled="[[disabled]]" data-voicecommand\$="[[voiceCommand]]">
      <div class="button-inner">
        <iron-icon icon="[[icon]]" class\$="[[iconClass]]"></iron-icon>
        <div class="label">[[label]]</div>
      </div>
    </paper-button>
`,is:"hax-panel-item",listeners:{tap:"_fireEvent"},properties:{light:{type:Boolean,reflectToAttribute:!0},voiceCommand:{type:String},disabled:{type:Boolean,value:!1},edged:{type:String,value:"",reflectToAttribute:!0},icon:{type:String,value:"editor:text-fields",reflectToAttribute:!0},iconClass:{type:String,value:"white-text",reflectToAttribute:!0},label:{type:String,value:"editor:text-fields",reflectToAttribute:!0},eventName:{type:String,value:"button",reflectToAttribute:!0},value:{type:String,value:"",reflectToAttribute:!0}},_fireEvent:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;this.fire("hax-item-selected",{target:local,value:this.value,eventName:this.eventName})}});