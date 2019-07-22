/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@lrnwebcomponents/social-media-icons/social-media-icons.js";/**
 * `social-share-link`
 * `a link to share content on social`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SocialShareLink extends PolymerElement{// render function
static get template(){return html`
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
:host a.icon-only iron-icon {
  margin-right: 0;
} 
</style>
<a href$="[[__href]]" disabled$="[[!__href]]" class$="[[mode]]" rel="noopener noreferrer" target="_blank">
  <iron-icon aria-hidden="true" icon$="[[__icon]]" hidden$="[[!__showIcon]]"></iron-icon>
  <span class="linktext">[[__linkText]]</span>
</a>`}// properties available to the custom element for data binding
static get properties(){let props={/**
   * display link as a button
   */buttonStyle:{name:"buttonStyle",type:Boolean,value:!1,reflectToAttribute:!0},/**
   * optional image to attach to the share
   * (Pinterest only)
   */image:{name:"image",type:String,value:""},/**
   * the message to attach to the social share
   * (not used in Facebook)
   */message:{name:"message",type:String,value:""},/**
   * optional display mode for the link,"text-only" or "icon-only";
   * default is to dislay both an icon and text
   */mode:{name:"mode",type:String,value:null},/**
   * the link text; if null, the text will be "Share on (type of social)"
   */text:{name:"text",type:String,value:null},/**
   * the type of social; currently supports
   * Facebook, LinkedIn, Pinterest, and Twitter (default)
   */type:{name:"type",type:String,value:"Twitter"},/**
   * the url to share
   */url:{name:"url",type:String,value:null},/**
   * the href for the link
   */__href:{name:"__href",type:String,computed:"_getHref(image,message,type,url)"},/**
   * the icon name for the link
   */__icon:{name:"icon",type:String,computed:"_getIcon(type)"},/**
   * the link text specified, or the default link text
   */__linkText:{name:"__linkText",type:String,computed:"_getLinkText(text,type)"}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"social-share-link"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer title for changes
/**
   * returns the href
   *
   * @param {string} optional image url (Pinterest only)
   * @param {string} the message (not for Facebook)
   * @param {string} the type of link (Twitter by default)
   * @param {string} the url
   * @returns {string} the link
   */_getHref(image,message,type,url){let link;switch(type){case"Facebook":link=null!==url?"https://www.facebook.com/sharer/sharer.php?u="+url:!1;break;case"LinkedIn":link=(null!==url?"&url="+url:"")+(null!==message?"&summary="+message:"");link=null!==link?"https://www.linkedin.com/shareArticle?mini=true"+link:!1;break;case"Pinterest":link=(null!==url?"&url="+url:"")+(null!==message?"&description="+message:"")+(null!==image?"&media="+image:"");link=null!==link?"http://pinterest.com/pin/create/button/?"+link.substring(1):!1;break;case"Twitter":link=null!==message?"status="+message+" "+url:url;link=null!==link?"https://twitter.com/home?"+link:!1;break;}return encodeURI(link)}/**
   * gets the link text or a default
   *
   * @param {string} the link text
   * @param {string} the link type
   * @returns {string} the link text or a default "Share via (type)"
   */_getLinkText(text,type){return null!==text?text:"Share via "+type}/**
   * returns the icon name
   *
   * @param {string} the link type
   * @returns {string} the icon name
   */_getIcon(type){return"social-media:"+type.toLowerCase()}}window.customElements.define(SocialShareLink.tag,SocialShareLink);export{SocialShareLink};