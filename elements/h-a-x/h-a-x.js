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
    <style>
    :host,h-a-x {
      display: block;
      font-size: var(--haxcms-base-styles-body-font-size);
      font-family: var(--haxcms-base-styles-body-font-family);
      line-height: var(--haxcms-base-styles-body-line-height);
      letter-spacing: var(--haxcms-base-styles-body-letter-spacing);
    }

    :host([hidden]),h-a-x([hidden]) {
      display: none;
    }

    :host hax-body, h-a-x hax-body {
      font-size: var(--haxcms-base-styles-body-font-size);
      font-family: var(--haxcms-base-styles-body-font-family);
      line-height: var(--haxcms-base-styles-body-line-height);
      letter-spacing: var(--haxcms-base-styles-body-letter-spacing);
    }

    :host img, h-a-x img {
      max-width: 100%;
      max-width: -moz-available;
      max-width: -webkit-fill-available;
      max-width: fill-available;
    }

    :host h1, h-a-x h1 {
      font-size: var(--hax-base-styles-h1-font-size);
      line-height: var(--hax-base-styles-h1-line-height);
    }

    :host h2, h-a-x h2 {
      font-size: var(--hax-base-styles-h2-font-size);
    }

    :host h3, h-a-x h3 {
      font-size: var(--hax-base-styles-h3-font-size);
    }

    :host h4, h-a-x h4 {
      font-size: var(--hax-base-styles-h4-font-size);
    }

    :host h5, h-a-x h5 {
      font-size: var(--hax-base-styles-h5-font-size);  
    }

    :host h6, h-a-x h6 {
      font-size: var(--hax-base-styles-h6-font-size);
    }

    :host p, h-a-x p {
      min-height: var(--hax-base-styles-p-min-height);
      font-size: var(--hax-base-styles-p-font-size);
      line-height: var(--hax-base-styles-p-line-height);
      letter-spacing: var(--hax-base-styles-p-letter-spacing);
    }

    :host a,
    :host a:-webkit-any-link,
    h-a-x a,
    h-a-x a:-webkit-any-link    {
      font-size: var(--hax-base-styles-a-font-size,var(--hax-base-styles-p-font-size));
    }

    :host ol,
    :host ul
    :host ol li,
    :host ul li,
    h-a-x ol,
    h-a-x ul
    h-a-x ol li,
    h-a-x ul li {
      line-height: var(--hax-base-styles-list-line-height,var(--hax-base-styles-p-line-height));
      font-size: var(--hax-base-styles-list-font-size,var(--hax-base-styles-p-font-size));
    }

    :host ul ul,
    :host ul ol,
    :host ol ul,
    :host ol ol,
    h-a-x ul ul,
    h-a-x ul ol,
    h-a-x ol ul,
    h-a-x ol ol {
      padding-bottom: unset;
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
  saveEvent(e) {
    this.innerHTML = HAXStore.activeHaxBody.haxToContent();
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
