/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `lazy-import-discover`
 * `Break peoples' brains on simplifying webcomponent integrations`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */class LazyImportDiscover extends HTMLElement{/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"lazy-import-discover"}/**
   * life cycle
   */constructor(delayRender=!1){super();// set tag for later use
this.tag=LazyImportDiscover.tag}get base(){return this.getAttribute("base")}set base(value){if(null!=value&&this.__ready){this.setAttribute("base",value)}}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){this.__ready=!0;var dyn="";if(null==this.base){this.base="../node_modules"}document.querySelectorAll(":not(:defined)").forEach((el,index)=>{let t=el.tagName.toLowerCase(),path=`@lrnwebcomponents/${t}/${t}.js`;if(null!=el.getAttribute("data-wc-def")){path=el.getAttribute("data-wc-def")}if("style"!==t){dyn+=`import('${this.base}/${path}');\n`}});let s=document.createElement("script");s.type="module";s.innerText=dyn;document.head.appendChild(s)}static get observedAttributes(){return["base"]}attributeChangedCallback(attr,oldValue,newValue){if("base"===attr&&newValue){console.log("base changed")}}}window.customElements.define(LazyImportDiscover.tag,LazyImportDiscover);export{LazyImportDiscover};// self append. this is beyond trippy but the window loading will actually self invoke
window.addEventListener("DOMContentLoaded",event=>{var el=document.createElement(LazyImportDiscover.tag);if(window.LazyImportBase){el.setAttribute("base",window.LazyImportBase)}document.body.appendChild(el)});