import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/app-layout/app-layout.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
        --lrndesign-drawer-width: 30%;
      }
      app-header {
        z-index: 100;
      }
      app-drawer {
        --app-drawer-width: var(--lrndesign-drawer-width);
        --app-drawer-content-container: {
          padding: 16px;
          overflow-y: scroll;
          margin-top: 112px;
        }
      }
    </style>
    <app-header>
      <app-drawer opened="{{opened}}" align="{{align}}">
        <slot></slot>
      </app-drawer>
    </app-header>
    <paper-icon-button icon="[[icon]]" alt="[[alt]]" id="flyout-drawer"></paper-icon-button>
    <paper-tooltip for="flyout-drawer">[[alt]]</paper-tooltip>
`,is:"lrndesign-drawer",properties:{opened:{type:Boolean,value:!1},icon:{type:String,value:"icon"},align:{type:String,value:"left"},alt:{type:String,value:""}},ready:function(){let root=this,opened=this.opened;this.shadowRoot.querySelector("paper-icon-button").addEventListener("click",function(e){root.opened=!root.opened})}});