import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@lrnwebcomponents/social-media-icons/social-media-icons.js";class SocialShareLink extends PolymerElement{static get template(){return html`
<style>:host {
  display: inline;
}
:host([hidden]) {
  display: none;
}
:host a {
  display: inline-flex;
  align-items: center;
  color: var(--social-share-link-color, inherit);
  transition: all 0.5s;
  margin: 5px;
  @apply --social-share-link;
}
:host a:visited {
  color: var(--social-share-visited-link-color, inherit);
  @apply --social-share-visited-link;
}
:host a:focus,
:host a:hover {
  color: var(--social-share-link-hover-color, inherit);
  @apply --social-share-link-hover;
}
:host([disabled]) a,
:host([disabled]) a:focus,
:host([disabled]) a:hover,
:host([disabled]) a:visited {
  color: var(--social-share-disabled-link-color,#ddd);
  @apply --social-share-disabled-link;
}
:host([button-style]) a {
  padding: 5px 10px;
  border-radius: 3px;
  color: var(--social-share-button-color, white);
  background-color: var(--social-share-button-bg, #0066ff);
  text-decoration: none;
  transition: all 0.5s;
  @apply --social-share-button;
}
:host([button-style]) a:visited {
  color: var(--social-share-visited-button-color, white);
  @apply --social-share-visited-button;
}
:host([button-style]) a:focus,
:host([button-style]) a:hover {
  color: var(--social-share-button-hover-color, white);
  background-color: var(--social-share-button-hover-bg, #0044ee);
  @apply --social-share-button-hover;
}
:host([button-style][disabled]) a,
:host([button-style][disabled]) a:focus,
:host([button-style][disabled]) a:hover,
:host([button-style][disabled]) a:visited {
  color: var(--social-share-disabled-button-color,#ddd);
  background-color: var(--social-share-disabled-button-bg, #666);
  @apply --social-share-disabled-button;
}
:host iron-icon {
  margin-right: 5px;
}
:host a.text-only iron-icon {
  display: none;
}
:host a.icon-only .linktext {
  position: absolute;
  left: -999999px;
  top: 0;
  height: 0;
  width: 0;
  overflow: hidden;
}
</style>
<a href$="[[__href]]" disabled$="[[!__href]]" class$="[[mode]]">
  <iron-icon aria-hidden="true" icon$="[[__icon]]" hidden$="[[!__showIcon]]"></iron-icon>
  <span class="linktext">[[__linkText]]</span>
</a>`}static get properties(){return{buttonStyle:{name:"buttonStyle",type:"Boolean",value:!1,reflectToAttribute:!0},image:{name:"image",type:"String",value:""},message:{name:"message",type:"String",value:""},mode:{name:"mode",type:"String",value:null},text:{name:"text",type:"String",value:null},type:{name:"type",type:"String",value:"Twitter"},url:{name:"url",type:"String",value:null},__href:{name:"__href",type:"String",computed:"_getHref(image,message,type,url)"},__icon:{name:"icon",type:"String",computed:"_getIcon(type)"},__linkText:{name:"__linkText",type:"String",computed:"_getLinkText(text,type)"}}}static get tag(){return"social-share-link"}connectedCallback(){super.connectedCallback()}_getHref(image,message,type,url){let link;switch(type){case"Facebook":link=null!==url?"https://www.facebook.com/sharer/sharer.php?u="+url:!1;break;case"LinkedIn":link=(null!==url?"&url="+url:"")+(null!==message?"&summary="+message:"");link=null!==link?"https://www.linkedin.com/shareArticle?mini=true"+link:!1;break;case"Pinterest":link=(null!==url?"&url="+url:"")+(null!==message?"&description="+message:"")+(null!==image?"&media="+image:"");link=null!==link?"http://pinterest.com/pin/create/button/?"+link.substring(1):!1;break;case"Twitter":link=null!==message?"status="+message+" "+url:url;link=null!==link?"https://twitter.com/home?"+link:!1;break;}return encodeURI(link)}_getLinkText(text,type){return null!==text?text:"Share via "+type}_getIcon(type){return"social-media:"+type.toLowerCase()}}window.customElements.define(SocialShareLink.tag,SocialShareLink);export{SocialShareLink};