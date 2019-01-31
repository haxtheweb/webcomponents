import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/h-a-x/h-a-x.js";let HaxBookmarklet=Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 16px;
      }
    </style>
    <h-a-x app-store$='[[appStoreConnection]]'>
      <slot></slot>
    </h-a-x>
  `,is:"hax-bookmarklet",properties:{appStoreConnection:{type:Object,value:{url:"appstore.json"}}}});export{HaxBookmarklet};