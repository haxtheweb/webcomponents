define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@lrnwebcomponents/social-media-icons/social-media-icons.js"],function(_exports,_polymerElement,_ironIcons,_socialMediaIcons){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SocialShareLink=void 0;function _templateObject_c830cb406d6b11e990c50fbab07bf458(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline;\n}\n:host([hidden]) {\n  display: none;\n}\n:host a {\n  display: inline-flex;\n  align-items: center;\n  color: var(--social-share-link-color, inherit);\n  transition: all 0.5s;\n  margin: 5px;\n  @apply --social-share-link;\n}\n:host a:visited {\n  color: var(--social-share-visited-link-color, inherit);\n  @apply --social-share-visited-link;\n}\n:host a:focus,\n:host a:hover {\n  color: var(--social-share-link-hover-color, inherit);\n  @apply --social-share-link-hover;\n}\n:host([disabled]) a,\n:host([disabled]) a:focus,\n:host([disabled]) a:hover,\n:host([disabled]) a:visited {\n  color: var(--social-share-disabled-link-color,#ddd);\n  @apply --social-share-disabled-link;\n}\n:host([button-style]) a {\n  padding: 5px 10px;\n  border-radius: 3px;\n  color: var(--social-share-button-color, white);\n  background-color: var(--social-share-button-bg, #0066ff);\n  text-decoration: none;\n  transition: all 0.5s;\n  @apply --social-share-button;\n}\n:host([button-style]) a:visited {\n  color: var(--social-share-visited-button-color, white);\n  @apply --social-share-visited-button;\n}\n:host([button-style]) a:focus,\n:host([button-style]) a:hover {\n  color: var(--social-share-button-hover-color, white);\n  background-color: var(--social-share-button-hover-bg, #0044ee);\n  @apply --social-share-button-hover;\n}\n:host([button-style][disabled]) a,\n:host([button-style][disabled]) a:focus,\n:host([button-style][disabled]) a:hover,\n:host([button-style][disabled]) a:visited {\n  color: var(--social-share-disabled-button-color,#ddd);\n  background-color: var(--social-share-disabled-button-bg, #666);\n  @apply --social-share-disabled-button;\n}\n:host iron-icon {\n  margin-right: 5px;\n}\n:host a.text-only iron-icon {\n  display: none;\n}\n:host a.icon-only .linktext {\n  position: absolute;\n  left: -999999px;\n  top: 0;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n:host a.icon-only iron-icon {\n  margin-right: 0;\n} \n</style>\n<a href$=\"[[__href]]\" disabled$=\"[[!__href]]\" class$=\"[[mode]]\" rel=\"noopener noreferrer\" target=\"_blank\">\n  <iron-icon aria-hidden=\"true\" icon$=\"[[__icon]]\" hidden$=\"[[!__showIcon]]\"></iron-icon>\n  <span class=\"linktext\">[[__linkText]]</span>\n</a>"]);_templateObject_c830cb406d6b11e990c50fbab07bf458=function _templateObject_c830cb406d6b11e990c50fbab07bf458(){return data};return data}/**
 * `social-share-link`
 * `a link to share content on social`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SocialShareLink=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SocialShareLink,_PolymerElement);function SocialShareLink(){babelHelpers.classCallCheck(this,SocialShareLink);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SocialShareLink).apply(this,arguments))}babelHelpers.createClass(SocialShareLink,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SocialShareLink.prototype),"connectedCallback",this).call(this)}/**
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
   */},{key:"_getHref",value:function _getHref(image,message,type,url){var link;switch(type){case"Facebook":link=null!==url?"https://www.facebook.com/sharer/sharer.php?u="+url:!1;break;case"LinkedIn":link=(null!==url?"&url="+url:"")+(null!==message?"&summary="+message:"");link=null!==link?"https://www.linkedin.com/shareArticle?mini=true"+link:!1;break;case"Pinterest":link=(null!==url?"&url="+url:"")+(null!==message?"&description="+message:"")+(null!==image?"&media="+image:"");link=null!==link?"http://pinterest.com/pin/create/button/?"+link.substring(1):!1;break;case"Twitter":link=null!==message?"status="+message+" "+url:url;link=null!==link?"https://twitter.com/home?"+link:!1;break;}return encodeURI(link)}/**
   * gets the link text or a default
   *
   * @param {string} the link text
   * @param {string} the link type
   * @returns {string} the link text or a default "Share via (type)"
   */},{key:"_getLinkText",value:function _getLinkText(text,type){return null!==text?text:"Share via "+type}/**
   * returns the icon name
   *
   * @param {string} the link type
   * @returns {string} the icon name
   */},{key:"_getIcon",value:function _getIcon(type){return"social-media:"+type.toLowerCase()}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_c830cb406d6b11e990c50fbab07bf458())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * display link as a button
   */buttonStyle:{name:"buttonStyle",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * optional image to attach to the share
   * (Pinterest only)
   */image:{name:"image",type:"String",value:""},/**
   * the message to attach to the social share
   * (not used in Facebook)
   */message:{name:"message",type:"String",value:""},/**
   * optional display mode for the link,"text-only" or "icon-only";
   * default is to dislay both an icon and text
   */mode:{name:"mode",type:"String",value:null},/**
   * the link text; if null, the text will be "Share on (type of social)"
   */text:{name:"text",type:"String",value:null},/**
   * the type of social; currently supports
   * Facebook, LinkedIn, Pinterest, and Twitter (default)
   */type:{name:"type",type:"String",value:"Twitter"},/**
   * the url to share
   */url:{name:"url",type:"String",value:null},/**
   * the href for the link
   */__href:{name:"__href",type:"String",computed:"_getHref(image,message,type,url)"},/**
   * the icon name for the link
   */__icon:{name:"icon",type:"String",computed:"_getIcon(type)"},/**
   * the link text specified, or the default link text
   */__linkText:{name:"__linkText",type:"String",computed:"_getLinkText(text,type)"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"social-share-link"}}]);return SocialShareLink}(_polymerElement.PolymerElement);_exports.SocialShareLink=SocialShareLink;window.customElements.define(SocialShareLink.tag,SocialShareLink)});