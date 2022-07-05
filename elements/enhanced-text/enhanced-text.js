/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
 import { LitElement, html, css } from "lit";
 import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
 import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
 // enable services for glossary enhancement
 enableServices(['haxcms']);
 MicroFrontendRegistry.add({
   endpoint: "/api/services/text/textVide",
   name: "@enhancedText/textVide",
   title: "text-vide",
   description: "Enhance readability of text based on brain science",
   params: {
     body: "Block of text to enhance"
   }
 });
 MicroFrontendRegistry.add({
   endpoint: "/api/services/text/textWikipedia",
   name: "@enhancedText/textWikipedia",
   title: "Wikipedia terms",
   description: "return a list of matching wikipedia terms in a html blob",
   params: {
     body: "Block of text"
   }
 });
 /**
  * `enhanced-text`
  * `take text and process it with various enhancements`
  * @demo demo/index.html
  * @element enhanced-text
  */
 class EnhancedText extends LitElement {
   /**
    * HTMLElement
    */
   constructor() {
     super();
     this.loading = false;
     this.auto = false;
     this.fixationPoint = 4;
     this.vide = false;
     this.wikipedia = false;
     this.haxcmsGlossary = false;
     this.haxcmsSiteLocation = '';
     this.haxcmsSite = null;
     this.haxcmsMarkAll = false;
   }
   firstUpdated(changedProperties) {
     if (super.firstUpdated) {
       super.firstUpdated(changedProperties);
     }
     // automatic enhancement if set, otherwise manual
     if (this.auto) {
       this.enhance();
     }
   }
 
   // apply terms from whatever came back
   applyTermFromList(data) {
     if (data.status && data.data && data.data.length) {
       import("@lrnwebcomponents/vocab-term/vocab-term.js");
       // loop through and apply terms that were found w/ the vocab-term element
       // get all text nodes internally
       let textNodes = [...this.childNodes] // has childNodes inside, including text ones
       .filter(child => child.nodeType === 3) // get only text nodes
       .filter(child => child.textContent.trim()) // eliminate empty text
       // no text nodes, look for html
       if (textNodes.length === 0) {
         const content = this.innerText;
         this.innerHTML = '';
         content.split(/\s|\.+/).forEach((item) => {
           const tn = document.createTextNode(item);
           this.appendChild(tn);
           this.appendChild(document.createTextNode(' '));
         })
         textNodes = [...this.childNodes] // has childNodes inside, including text ones
         .filter(child => child.nodeType === 3) // get only text nodes
         .filter(child => child.textContent.trim()) // eliminate empty text
       }
       // if we only have 1, leverage it
       if (textNodes.length === 1) {
         const content = textNodes[0].textContent;
         textNodes[0].remove();
         content.split(/\s|\.+/).forEach((item) => {
           const tn = document.createTextNode(item);
           this.appendChild(tn);
           this.appendChild(document.createTextNode(' '));
         })
         textNodes = [...this.childNodes] // has childNodes inside, including text ones
         .filter(child => child.nodeType === 3) // get only text nodes
         .filter(child => child.textContent.trim()) // eliminate empty text
       }
       // loop through data and apply vocab-term wrapper
       for (var i=0; i < data.data.length; i++) {
         let term = data.data[i];
         let found = false;
         // find textnodes that match the term and apply
         for(var j=0; j < textNodes.length; j++) {
           let el = textNodes[j];
           if (el.textContent.toLowerCase() == term.term.toLowerCase() && (!found || this.haxcmsMarkAll)) {
             // find term in contents of page
             // replace in context
             let termEl = document.createElement('vocab-term');
             termEl.term = el.textContent;
             termEl.information = term.definition;
             // support for links from endpoint
             if (term.links && term.links.length > 0) {
               let div = document.createElement('div');
               div.classList.add('links');
               for(var t=0; t < term.links.length; t++) {
                 let a = document.createElement('a');
                 a.href = term.links[t].href;
                 a.innerText = term.links[t].title;
                 div.appendChild(a);
               }
               termEl.appendChild(div);
             }
             el.parentNode.insertBefore(termEl, el);
             termEl.appendChild(el);
             found = true;
           }
         }
       }
     }
   }
 
   // apply enhancement to text. if not in auto user must invoke this.
   async enhance() {
     const body = this.innerHTML;
     this.loading = true;
     if (this.vide) {
       await MicroFrontendRegistry.call('@enhancedText/textVide', {body: body, fixationPoint: this.fixationPoint}, this.enahncedTextResponse.bind(this));
     }
     if (this.haxcmsGlossary && (this.haxcmsSiteLocation || this.haxcmsSite)) {
       if (this.haxcmsSite) {
         await MicroFrontendRegistry.call('@haxcms/termsInPage', {body: body, type: 'site', site: this.haxcmsSite, wikipedia: this.wikipedia}, this.applyTermFromList.bind(this));
       }
       else {
         await MicroFrontendRegistry.call('@haxcms/termsInPage', {body: body, type: 'link', site: this.haxcmsSiteLocation, wikipedia: this.wikipedia}, this.applyTermFromList.bind(this));
       }
     }
     // all above will run in order
     this.loading = false;
   }
 
   static get properties() {
     return {
       wikipedia: {
         type: Boolean,
         reflect: true
       },
       vide: {
         type: Boolean,
         reflect: true
       },
       fixationPoint: {
         type: Number,
         attribute: 'fixation-point'
       },
       haxcmsGlossary: {
         type: Boolean,
         attribute: 'haxcms-glossary',
       },
       haxcmsSiteLocation: {
         type: String,
         attribute: 'haxcms-site-location',
       },
       haxcmsSite: {
         type: Object,
         attribute: 'haxcms-site',
       },
       haxcmsMarkAll: {
         type: Boolean,
         attribute: 'haxcms-mark-all',
       },
       loading: {
         type: Boolean,
         reflect: true
       },
       auto: {
         type: Boolean,
         reflect: true
       },
     }
   }
 
   enahncedTextResponse(data) {
     if (data.status && data.data && data.data.length) {
       this.innerHTML = data.data;
     }
   }
 
   /**
    * LitElement style callback
    */
   static get styles() {
     // support for using in other classes
     let styles = [];
     if (super.styles) {
       styles = super.styles;
     }
     return [
       ...styles,
       css`
         :host {
           display: block;
         }
         div::slotted(bold) {
           font-weight: 800;
         }
         :host([loading]) .loading {
           margin: 8px 0 0 -12px;
           font-size: 2px;
           width: 4px;
           height: 4px;
           border-radius: 50%;
           position: absolute;
           -webkit-animation: load5 1.1s infinite ease;
           animation: load5 1.1s infinite ease;
           -webkit-transform: translateZ(0);
           -ms-transform: translateZ(0);
           transform: translateZ(0);
         }
         @-webkit-keyframes load5 {
           0%,
           100% {
             box-shadow: 0em -2.6em 0em 0em var(--enhanced-text-color, #000000), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
           }
           12.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em var(--enhanced-text-color, #000000), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
           }
           25% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em var(--enhanced-text-color, #000000), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           37.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em var(--enhanced-text-color, #000000), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           50% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em var(--enhanced-text-color, #000000), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           62.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em var(--enhanced-text-color, #000000), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           75% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em var(--enhanced-text-color, #000000), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           87.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em var(--enhanced-text-color, #000000);
           }
         }
         @keyframes load5 {
           0%,
           100% {
             box-shadow: 0em -2.6em 0em 0em var(--enhanced-text-color, #000000), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
           }
           12.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em var(--enhanced-text-color, #000000), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
           }
           25% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em var(--enhanced-text-color, #000000), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           37.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em var(--enhanced-text-color, #000000), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           50% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em var(--enhanced-text-color, #000000), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           62.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em var(--enhanced-text-color, #000000), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           75% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em var(--enhanced-text-color, #000000), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
           }
           87.5% {
             box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em var(--enhanced-text-color, #000000);
           }
         }
 
       `,
     ];
   }
   /**
    * LitElement render callback
    */
   render() {
     return html`
       <div class="loading"></div>
       <slot></slot>
     `;
   }
   /**
    * Convention we use
    */
   static get tag() {
     return "enhanced-text";
   }
 
   static get haxProperties() {
     return {
       gizmo: {
         title: "Enhanced text",
         description: "Add content look up to a blob of text"
       },
       setttings: {
         configure: [
           {
             slot: "",
             title: "Text to process",
             description: "Text that will be enhanced"
           },
           {
             property: "wikipedia",
             type: "boolean",
             title: "Wikipedia articles",
             description: "Enhance found definitions in glossary with possibly related wikipedia article links"
           },
           {
             property: "haxcmsGlossary",
             type: "boolean",
             title: "haxcms: Glossary",
             description: "Automatically link to definitions found on the /glossary page of a haxcms site"
           },
           {
             property: "haxcmsSiteLocation",
             type: "textfield",
             title: "haxcms: site url",
             description: "Link to the HAXcms site to leverage for glossary of terms"
           },
           {
             property: "haxcmsSite",
             type: "textarea",
             title: "haxcms: site",
             description: "JSON blob of the site.json file itself"
           }
         ]
       }
     }
   }
 }
 customElements.define(EnhancedText.tag, EnhancedText);
 export { EnhancedText };
 