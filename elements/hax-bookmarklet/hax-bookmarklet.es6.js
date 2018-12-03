import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js";let HaxBookmarklet=Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 16px;
      }
    </style>
    <cms-hax
      open-default
      app-store-connection="[[appStoreConnection]]"
      body-offset-left
    >
      <slot></slot>
    </cms-hax>
  `,is:"hax-bookmarklet",properties:{appStoreConnection:{type:Object,value:{url:"appstore.json"}}}});export{HaxBookmarklet};