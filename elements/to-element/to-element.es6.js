class ToElement extends HTMLElement{get html(){return`
<style></style>
<slot></slot>`}static get properties(){return{element:{name:"element",type:"Object",value:{}},name:{name:"name",type:"String",value:"new-element"},sourceUrl:{name:"sourceUrl",type:"String",value:""},fileTypes:{type:"Object","value"(){return{CSV:"text/csv",JSON:"text/json",PDF:"application/pdf",TXT:"text/plain"}}}}}static get tag(){return"to-element"}constructor(delayRender=!1){super();this.tag=ToElement.tag;let obj=ToElement.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}this._queue=[];this.template=document.createElement("template");this.attachShadow({mode:"open"});if(!delayRender){this.render()}}connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}}_copyAttribute(name,to){const recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute";for(const node of recipients){node[fname](name,value)}}_queueAction(action){this._queue.push(action)}_processQueue(){this._queue.forEach(action=>{this[`_${action.type}`](action.data)});this._queue=[]}_setProperty({name,value}){this[name]=value}render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}createNewElement(){this._tmp=this.element;let css=this.extractCSS(this._tmp).stylesheet,html=this._tmp.outerHTML;return{html:html,css:css}}generateUUID(){return"item-sss-ss-ss".replace(/s/g,this._uuidPart)}_uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}getDefaultStyling(element,part=null){let tagName=element.tagName;var iframe=document.createElement("iframe");this.shadowRoot.appendChild(iframe);var iframeDocument=iframe.contentDocument,targetElement=iframeDocument.createElement(tagName);iframeDocument.body.appendChild(targetElement);for(var styling=iframe.contentWindow.getComputedStyle(targetElement),clonedStyling={},i=0,len=styling.length,property;i<len;i++){property=styling[i];clonedStyling[i]=property;clonedStyling[property]=styling[property]}this.shadowRoot.removeChild(iframe);return clonedStyling}getStylesWithoutDefaults(element,part=null){for(var allStyling=window.getComputedStyle(element,part),defaultStyling=this.getDefaultStyling(element.tagName),userStyling={},i=0,len=allStyling.length;i<len;i++){var property=allStyling[i],value=allStyling[property],defaultValue=defaultStyling[property];if(value!=defaultValue&&"transform-origin"!==property&&"perspective-origin"!==property){userStyling[property]=value}}return userStyling}flatten(arr){return arr.reduce((flat,toFlatten)=>{return flat.concat(Array.isArray(toFlatten)?this.flatten(toFlatten):toFlatten)},[])}recursiveExtract(element){const id=this.generateUUID(),styles=this.getStylesWithoutDefaults(element);element.setAttribute("id",id);let css="";for(var i in styles){css+=`      ${i}: ${styles[i]};\n`}var children=Array.prototype.slice.call(element.children);return[{id:id,style:css}].concat(children.map(this.recursiveExtract.bind(this)))}extractCSS(element){if(!element){return{elements:[],stylesheet:""}}var raw=this.recursiveExtract(element),flat=this.flatten(raw);return{elements:flat,stylesheet:flat.reduce(function(acc,cur){var style="    #"+cur.id+" {\n"+cur.style+"    }\n";return acc+style},"")}}dashToCamel(str){return str.replace(/-([a-z])/g,function(g){return g[1].toUpperCase()})}contentToFile(html){return`
/**
 * Copyright 2019 {Your compay}
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * \`${this.name}\`
 * \`An auto generated element via to-element\`
 *
 * @microcopy - language worth noting:
 *  - This element was made by someone else and then forked from their site
 *  - The point is not perfection but to rapidly generate boilerplate
 *
 * @originalSite - This code is based on work originally found on
 *   - ${this.sourceUrl}
 * @customElement
 * @polymer
 */
class ${this.dashToCamel(this.name)} extends PolymerElement {
  
  // render function
  static get template() {
    return html\`
    ${html}
    \`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      "title": {
        "name": "title",
        "type": "String",
        "value": "",
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "${this.name}";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  //connectedCallback() { super.connectedCallback(); }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {super.disconnectedCallback();}
}
window.customElements.define(${this.dashToCamel(this.name)}.tag, ${this.dashToCamel(this.name)});
export { ${this.dashToCamel(this.name)} };
    `}downloadNewComponent(element,name){if(element){this.element=element}if(name){this.name=name}let tmp=this.createNewElement(),html=`<style>
${tmp.css}</style>
    ${tmp.html}`,data=this.contentToFile(html);this.downloadFromData(data,"js",this.name)}downloadFromData(data,type,name="download",newTab=!0){const mimeType=this.fileTypes[type.toUpperCase()],blob=new Blob([decodeURIComponent(encodeURI(data))],{type:mimeType}),filename=name+"."+type.toLowerCase();if(window.navigator&&window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,filename)}else{const link=document.createElement("a");link.href=(window.URL||window.webkitURL).createObjectURL(blob);link.download=filename;link.target=newTab?"_blank":"_self";this.shadowRoot.appendChild(link);link.click();this.shadowRoot.removeChild(link)}}downloadFromURI(uri,newTab=!0){window.open(uri,newTab?"_blank":"_self");return!0}}window.customElements.define(ToElement.tag,ToElement);export{ToElement};