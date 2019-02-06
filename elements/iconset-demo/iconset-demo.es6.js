import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{IronMeta}from"./node_modules/@polymer/iron-meta/iron-meta.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/marked-element/marked-element.js";export{IconsetDemo};class IconsetDemo extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  padding: 20px 40px;
}
:host .iconset:not(:first-of-type) {
  border-top: 1px solid #ddd;
}
:host ul {
  list-style-type: none;
  padding: 0;
}
:host li {
  display: inline-block;
  width: 160px;
  margin: 16px 8px;
  text-align: center;
  font-size: 10px;
}
:host iron-icon {
  font-size: 14px;
  color: rgb(97,97,97);
  display: inline-block;
}
:host .iconset:nth-of-type(9n+2) iron-icon {
  color: #BE3300;
}
:host .iconset:nth-of-type(9n+3) iron-icon {
  color: #0000B5;
}
:host .iconset:nth-of-type(9n+4) iron-icon {
  color: #750075;
}
:host .iconset:nth-of-type(9n+5) iron-icon {
  color: #AA5D00;
}
:host .iconset:nth-of-type(9n+6) iron-icon {
  color: #DB0A5B;
}
:host .iconset:nth-of-type(9n+7) iron-icon {
  color: #005500;
}
:host .iconset:nth-of-type(9n+8) iron-icon {
  color: #CF000F;
}
:host .iconset:nth-of-type(9n) iron-icon {
  color: #005f8b;
}</style>
<template is="dom-repeat" items="[[__iconList]]" as="iconset">
  <div class="iconset">
      <p><strong>[[iconset.name]]</strong></p>
      <ul>
          <template is="dom-repeat" items="[[iconset.icons]]" as="icon">
              <li>
              <div id="icon">
                  <iron-icon icon\$="[[icon]]"></iron-icon>
                  <div id="icon-text">[[icon]]</div>
              </div>
              </li>
          </template>
      </ul>
  </div>
</template>`}static get properties(){return{__iconList:{name:"__iconList",type:"Array",value:[]}}}static get tag(){return"iconset-demo"}connectedCallback(){super.connectedCallback();const iconSets=new IronMeta({type:"iconset"});let temp=[];if(typeof iconSets!==typeof void 0&&iconSets.list&&iconSets.list.length){var index=0;iconSets.list.forEach(function(item){let name=item.name;temp.push({name:name,icons:[]});item.getIconNames().forEach(icon=>{temp[index].icons.push(icon)});index++})}this.__iconList=temp}}window.customElements.define(IconsetDemo.tag,IconsetDemo);