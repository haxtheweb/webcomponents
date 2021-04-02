/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
/**
 * `h-a-x`
 * @element h-a-x
 * `Single tag to transform authoring`
 *
 * @microcopy - language worth noting:
 *  - HAX - Headless Authoring eXperience
 *  - Body - the editable area that can be worked on and gets saved as a string / blob
 *

 * @demo demo/index.html
 */
class HAX extends HTMLElement {
  // render function
  get html() {
    return `
    <style>@import url("https://fonts.googleapis.com/css?family=Lato:400,700,900|Source+Code+Pro:400,700|Lora:400,400i,700,700i|Playfair+Display:700i,900");

    html,
    body {
      margin: 0;
      width: 100%;
      font-family: "Lora";
      font-size: 18px;
      letter-spacing: -0.03px;
      line-height: 1.58;
    }
    
    h1,
    h2,
    p,
    i,
    a,
    .first-letter,
    .authorName a {
      color: rgba(0, 0, 0, 0.84);
      text-rendering: optimizeLegibility;
    }
    
    hax-body h1,
    hax-body h2 {
      font-family: "Playfair Display", serif;
      font-size: 48px;
      text-align: left;
      margin-bottom: 8px;
      letter-spacing: unset;
      line-height: unset;
      margin-top: 0;
    }
    hax-body h1 {
      font-size: 60px;
    }
    
    h3 {
      font-family: "Lato", sans-serif;
      font-size: 30px;
      font-weight: 900;
      padding: 0;
      text-align: left;
      line-height: 34.5px;
      letter-spacing: -0.45px;
    }
    
    h4 {
      font-family: "Lato", sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #555;
    }
    
    h5 {
      font-family: "Lato", sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #777;
    }
    
    h6 {
      font-family: "Lato", sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
    
    p,
    i,
    a {
      margin-top: 21px;
    }
    a {
      text-decoration: underline;
    }
    
    blockquote {
      font-family: "Playfair Display", serif;
      font-size: 30px;
      font-style: italic;
      letter-spacing: -0.36px;
      line-height: 44.4px;
      overflow-wrap: break-word;
      margin: 55px 0 33px 0;
      /* text-align: center; */
      color: rgba(0, 0, 0, 0.68);
      padding: 0 0 0 50px;
    }
    
    figcaption {
      font-family: "Lato", sans-serif;
      font-size: 16px;
      font-weight: 400;
      color: #666;
    }
    
    label {
      font-family: "Lato", sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }
    input, textarea, select {
      border-radius:6px;
      border-style:solid;
      border-width: 2px;
      padding:6px;
      border-color:#333;
    }
    select option {
      border-radius:6px;
      border-style:solid;
      border-width: 2px;
      padding:6px;
      border-color:#333;
    }
    
    
    
    input[type=range] {
      -webkit-appearance: none;
      margin: 18px 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      animate: 0.2s;
      border-radius: 3px;
    }
    input[type=range]::-webkit-slider-thumb {
      border: 2px solid #333333;
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: #ffffff;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -14px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #ccc;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      animate: 0.2s;
      background: #ccc;
      border: 2px solid #333;
    }
    input[type=range]::-moz-range-thumb {
      border: 1px solid #333;
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: #ffffff;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      animate: 0.2s;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #ccc;
      border: 2px solid #333;
    }
    input[type=range]::-ms-fill-upper {
      background: #ccc;
      border-radius: 2px;
    }
    input[type=range]::-ms-thumb {
      border: 1px solid #333;
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: #ffffff;
      cursor: pointer;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #ccc;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #ccc;
    }
    
    
    
    
    ol ol {
      list-style-type: lower-alpha;
      font-size: 16px;
      color: #444;
    }
    ol ol ol {
      list-style-type: lower-roman;
      font-size: 14px;
    }
    
    code {
      font-size: 18px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 2px;
      padding: 3px 5px;
      font-family: 'Source Code Pro', monospace;
    }
    pre {
      font-family: 'Source Code Pro', monospace;
    }
    kbd {
      font-family: 'Source Code Pro', monospace;
      font-weight:700;
    }
    samp {
      font-family: 'Source Code Pro', monospace;
    }  
    </style>

    <hax-body>
        <slot></slot>
    </hax-body>`;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "h-a-x";
  }
  /**
   * HTMLElement
   */
  constructor(delayRender = false) {
    super();
    this.__rendered = false;
    // set tag for later use
    this.tag = HAX.tag;
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });
    // if we shouldn't delay rendering
    if (!delayRender) {
      this.render();
    }
    // setup events, only run them once and remove
    window.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      once: true,
      passive: true,
    });
    window.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      { once: true, passive: true }
    );
    // dynamically import definitions for all needed tags
    import("./lib/h-a-x-dependencies.js");
    // map events from tray
    window.addEventListener("hax-cancel", this.cancelEvent.bind(this));
    window.addEventListener("hax-save", this.saveEvent.bind(this));
  }
  cancelEvent(e) {
    this.importSlotToHaxBody();
  }
  async saveEvent(e) {
    this.innerHTML = await HAXStore.activeHaxBody.haxToContent();
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // this ensures it's only applied once
    if (!this.__HAXApplied && !window.__HAXApplied) {
      window.__HAXApplied = this.__HAXApplied = this.applyHAX();
    }
  }

  /**
   * Store is ready, now we can pass along the app store definition
   * which HAX will react to an load the data it finds.
   */
  storeReady(e) {
    if (e.detail) {
      setTimeout(() => {
        try {
          let appStore = {
            ...JSON.parse(this.getAttribute("app-store")),
          };
          if (typeof appStore === "object") {
            HAXStore.appStore = appStore;
          }
        } catch (e) {
          console.warn(e);
        }
        if (this.hidePanelOps === "hide-panel-ops") {
          this.hidePanelOps = true;
        }
        HAXStore.haxTray.hidePanelOps = this.hidePanelOps;
        HAXStore.haxTray.offsetMargin = this.offsetMargin;
        HAXStore.haxTray.elementAlign = this.elementAlign;
      }, 0);
      window.removeEventListener(
        "hax-store-ready",
        this.storeReady.bind(this),
        { once: true, passive: true }
      );
    }
  }
  // import into the active body if there's content
  // obtain the nodes that have been assigned to the slot of our element
  importSlotToHaxBody() {
    var nodes = [];
    if (this.shadowRoot.querySelector("slot")) {
      nodes = this.shadowRoot.querySelector("slot").assignedNodes();
    } else {
      nodes = this.children;
    }
    let body = "";
    // loop the nodes and if it has an outerHTML attribute, append as string
    for (let i in nodes) {
      if (typeof nodes[i].outerHTML !== typeof undefined) {
        body += nodes[i].outerHTML;
      }
    }
    HAXStore.activeHaxBody.importContent(body);
  }
  /**
   * Appstore has been loaded, NOW we can safely do an import
   */
  appStoreReady(e) {
    if (e.detail) {
      this.importSlotToHaxBody();
      window.removeEventListener(
        "hax-store-app-store-loaded",
        this.appStoreReady.bind(this),
        { once: true, passive: true }
      );
    }
  }
  render() {
    this.__rendered = true;
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  /**
   * Apply tags to the screen to establish HAX
   */
  applyHAX() {
    // store needs to come before anyone else, use it's availability request mechanism
    window.HaxStore.requestAvailability();
    // now everyone else
    let tray = document.createElement("hax-tray");
    tray.hidePanelOps = this.hidePanelOps;
    tray.elementAlign = this.elementAlign;
    document.body.appendChild(tray);
    document.body.appendChild(document.createElement("hax-app-picker"));
    document.body.appendChild(document.createElement("hax-export-dialog"));
    document.body.appendChild(document.createElement("hax-autoloader"));
    return true;
  }
  disconnectedCallback() {
    window.removeEventListener("hax-store-ready", this.storeReady.bind(this), {
      once: true,
      passive: true,
    });
    window.removeEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      { once: true, passive: true }
    );
    window.removeEventListener("hax-cancel", this.cancelEvent.bind(this));
    window.removeEventListener("hax-save", this.saveEvent.bind(this));
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  static get observedAttributes() {
    return ["element-align", "offset-margin", "app-store", "hide-panel-ops"];
  }
  get elementAlign() {
    return this.getAttribute("element-align");
  }
  set elementAlign(newValue) {
    if (this.__rendered) {
      this.setAttribute("element-align", newValue);
      // bind to the hax store global on change
      HAXStore.haxTray.elementAlign = newValue;
    }
  }
  get offsetMargin() {
    return this.getAttribute("offset-margin");
  }
  set offsetMargin(newValue) {
    this.setAttribute("offset-margin", newValue);
    if (this.__rendered) {
      // bind to the hax store global on change
      HAXStore.haxTray.offsetMargin = newValue;
    }
  }
  get hidePanelOps() {
    return this.getAttribute("hide-panel-ops");
  }
  set hidePanelOps(newValue) {
    if (newValue) {
      this.setAttribute("hide-panel-ops", "hide-panel-ops");
      if (this.__rendered) {
        // bind to the hax store global on change
        HAXStore.haxTray.hidePanelOps = newValue;
      }
    }
  }
  get appStore() {
    return this.getAttribute("app-store");
  }
  set appStore(newValue) {
    this.setAttribute("app-store", newValue);
    if (this.__rendered) {
      // bind to the hax store global on change
      HAXStore.appStore = {
        ...JSON.parse(this.getAttribute("app-store")),
      };
    }
  }
  attributeChangedCallback(attr, oldValue, newValue) {}
}
window.customElements.define("h-a-x", HAX);
export { HAX };
