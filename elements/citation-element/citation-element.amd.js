define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,_polymerLegacy,_polymerDom,_HAXWiring,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.CitationElement=void 0;function _templateObject_71ca73906d0811e99fdb8707ce9d0c3c(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        color: var(\"--license-text-color\");\n      }\n      :host([display-method=\"footnote\"]) {\n        visibility: hidden;\n        opacity: 0;\n      }\n      :host([display-method=\"popup\"]) {\n        display: block;\n      }\n      .license-link {\n        font-size: 16px;\n        line-height: 16px;\n        font-style: italic;\n      }\n      .citation-date {\n        font-size: 16px;\n        line-height: 16px;\n        font-style: italic;\n      }\n      .license-link img {\n        height: 16px;\n        min-width: 16px;\n        margin-right: 8px;\n      }\n    </style>\n    <meta\n      about$=\"[[relatedResource]]\"\n      property=\"cc:attributionUrl\"\n      content$=\"[[source]]\"\n    />\n    <meta\n      about$=\"[[relatedResource]]\"\n      property=\"cc:attributionName\"\n      typeof=\"oer:Text\"\n      content$=\"[[title]]\"\n    />\n    <meta\n      rel=\"cc:license\"\n      href$=\"[[licenseLink]]\"\n      content$=\"License: [[licenseName]]\"\n    />\n    <cite\n      ><a target=\"_blank\" href=\"[[source]]\">[[title]]</a> by [[creator]],\n      licensed under\n      <a class=\"license-link\" target=\"_blank\" href=\"[[licenseLink]]\"\n        ><img\n          alt=\"[[licenseName]] graphic\"\n          src=\"[[licenseImage]]\"\n          hidden&=\"[[!licenseImage]]\"\n        />[[licenseName]]</a\n      >. Accessed <span class=\"citation-date\">[[date]]</span>.</cite\n    >\n  "],["\n    <style>\n      :host {\n        display: block;\n        color: var(\"--license-text-color\");\n      }\n      :host([display-method=\"footnote\"]) {\n        visibility: hidden;\n        opacity: 0;\n      }\n      :host([display-method=\"popup\"]) {\n        display: block;\n      }\n      .license-link {\n        font-size: 16px;\n        line-height: 16px;\n        font-style: italic;\n      }\n      .citation-date {\n        font-size: 16px;\n        line-height: 16px;\n        font-style: italic;\n      }\n      .license-link img {\n        height: 16px;\n        min-width: 16px;\n        margin-right: 8px;\n      }\n    </style>\n    <meta\n      about\\$=\"[[relatedResource]]\"\n      property=\"cc:attributionUrl\"\n      content\\$=\"[[source]]\"\n    />\n    <meta\n      about\\$=\"[[relatedResource]]\"\n      property=\"cc:attributionName\"\n      typeof=\"oer:Text\"\n      content\\$=\"[[title]]\"\n    />\n    <meta\n      rel=\"cc:license\"\n      href\\$=\"[[licenseLink]]\"\n      content\\$=\"License: [[licenseName]]\"\n    />\n    <cite\n      ><a target=\"_blank\" href=\"[[source]]\">[[title]]</a> by [[creator]],\n      licensed under\n      <a class=\"license-link\" target=\"_blank\" href=\"[[licenseLink]]\"\n        ><img\n          alt=\"[[licenseName]] graphic\"\n          src=\"[[licenseImage]]\"\n          hidden&=\"[[!licenseImage]]\"\n        />[[licenseName]]</a\n      >. Accessed <span class=\"citation-date\">[[date]]</span>.</cite\n    >\n  "]);_templateObject_71ca73906d0811e99fdb8707ce9d0c3c=function _templateObject_71ca73906d0811e99fdb8707ce9d0c3c(){return data};return data}/**
 `citation-element`
 An element dedicated to presenting and managing a correct citation on the web
 both visually as well as semantically with simple inputs.

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/var CitationElement=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_71ca73906d0811e99fdb8707ce9d0c3c()),is:"citation-element",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{/**
     * Title of the work.
     */title:{type:String},/**
     * License scope
     */scope:{type:String,value:"sibling",observer:"_scopeChanged"},/**
     * How to present the citation on the interface.
     * Can be popup, footnote, or default behavior which is visible
     */displayMethod:{type:String,reflectToAttribute:!0},/**
     * Person or group that owns / created the work.
     */creator:{type:String},/**
     * Original Source of the work in question
     */source:{type:String},/**
     * Date the work was accessed.
     */date:{type:String},/**
     * License name, calculated or supplied by the end user if we don't have them.
     */licenseName:{type:String},/**
     * License link for more details
     */licenseLink:{type:String},/**
     * License short hand. Options cc0,
     */license:{type:String,observer:"_licenseUpdated"},/**
     * About link for semantic meaning
     */_aboutLink:{type:Object,computed:"_generateAboutLink(relatedResource, licenseLink)"},/**
     * License link object for semantic meaning
     */_licenseLink:{type:Object,computed:"_generateLicenseLink(source)"}},/**
   * Generate a license link whenever we have a source
   * @param {href} source
   */_generateLicenseLink:function _generateLicenseLink(source){// remove existing if this is moving around
if(this._licenseLink){document.head.removeChild(this._licenseLink)}var link=document.createElement("link");link.setAttribute("typeof","resource");link.setAttribute("rel","license");link.setAttribute("src",source);document.head.appendChild(link);return link},/**
   * Generate an about link whenever we have a related resource and license link
   * @param {uuid / id} relatedResource
   * @param {href} licenseLink
   */_generateAboutLink:function _generateAboutLink(relatedResource,licenseLink){// remove existing if this is moving around
if(this._aboutLink){document.head.removeChild(this._aboutLink)}var link=document.createElement("link");link.setAttribute("about",relatedResource);link.setAttribute("property","cc:license");link.setAttribute("content",licenseLink);document.head.appendChild(link);return link},/**
   * Notice scope change.
   */_scopeChanged:function _scopeChanged(newValue,oldValue){// make sure we actually have a sibling first
if("sibling"===newValue&&null!==(0,_polymerDom.dom)(this).previousElementSibling){// find the sibling element in the DOM and associate to it's resource ID
// also generate a resource ID if it doesn't have one
if((0,_polymerDom.dom)(this).previousElementSibling.getAttribute("resource")){this.relatedResource=(0,_polymerDom.dom)(this).previousElementSibling.getAttribute("resource")}else{var uuid=this.generateResourceID();this.relatedResource=uuid;(0,_polymerDom.dom)(this).previousElementSibling.setAttribute("resource",uuid)}// set prefix on the main element itself
(0,_polymerDom.dom)(this).previousElementSibling.setAttribute("prefix",this.getAttribute("prefix"))}else if("parent"===newValue){// find the parent and associate to it's resource ID, if it doesn't have one
// then let's make one dynamically
if((0,_polymerDom.dom)(this).parentNode.getAttribute("resource")){this.relatedResource=(0,_polymerDom.dom)(this).parentNode.getAttribute("resource")}else{var _uuid=this.generateResourceID();this.relatedResource=_uuid;(0,_polymerDom.dom)(this).parentNode.setAttribute("resource",_uuid)}// set prefix on the main element itself
(0,_polymerDom.dom)(this).parentNode.setAttribute("prefix",this.getAttribute("prefix"))}},/**
   * Attached to the DOM, now fire.
   */attached:function attached(){// Establish hax property binding
var props={canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Citation",description:"A basic citation element with 3 presentation modes",icon:"editor:title",color:"grey",groups:["Content","Text","Copyright"],handles:[{type:"citation",source:"source",title:"title",author:"creator",license:"license",accessDate:"date"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the work being cited.",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the work being cited.",inputMethod:"textfield",icon:"editor:title"},{property:"source",title:"Source link",description:"The source url for the element this is citing.",inputMethod:"textfield",icon:"link",validationType:"url"},{property:"date",title:"Date accessed",description:"The date this was accessed.",inputMethod:"textfield",icon:"link"},{property:"scope",title:"Scope",description:"Scope of what to cite.",inputMethod:"select",options:{sibling:"Sibling element",parent:"Parent element"},icon:"code"},{property:"license",title:"License",description:"The source url for the element this is citing.",inputMethod:"select",options:this.licenseList("select"),icon:"link"},{property:"creator",title:"Creator",description:"Who made or owns this.",inputMethod:"textfield",icon:"link"}],advanced:[]}};this.setHaxProperties(props)},/**
   * A list of licenses that we support the references for.
   */licenseList:function licenseList(){var mode=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"full",list={by:{name:"Attribution",link:"https://creativecommons.org/licenses/by/4.0/",image:"https://i.creativecommons.org/l/by/4.0/88x31.png"},"by-sa":{name:"Attribution Share a like",link:"https://creativecommons.org/licenses/by-sa/4.0/",image:"https://i.creativecommons.org/l/by-sa/4.0/88x31.png"},"by-nd":{name:"Attribution No derivatives",link:"https://creativecommons.org/licenses/by-nd/4.0/",image:"https://i.creativecommons.org/l/by-nd/4.0/88x31.png"},"by-nc":{name:"Attribution non-commercial",link:"https://creativecommons.org/licenses/by-nc/4.0/",image:"https://i.creativecommons.org/l/by-nc/4.0/88x31.png"},"by-nc-sa":{name:"Attribution non-commercial share a like",link:"https://creativecommons.org/licenses/by-nc-sa/4.0/",image:"https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"},"by-nc-nd":{name:"Attribution Non-commercial No derivatives",link:"https://creativecommons.org/licenses/by-nc-nd/4.0/",image:"https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"}};// support mutating the array into a select list
if("select"==mode){var select={};for(var i in list){select[i]=list[i].name}return select}return list},/**
   * License was updated, time to update license name and link.
   */_licenseUpdated:function _licenseUpdated(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){var list=this.licenseList();if(babelHelpers.typeof(list[newValue])!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){this.licenseName=list[newValue].name;this.licenseLink=list[newValue].link;this.licenseImage=list[newValue].image}}}});_exports.CitationElement=CitationElement});