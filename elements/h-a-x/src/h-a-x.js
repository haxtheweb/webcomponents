/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/hax-body/lib/hax-store.js";
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
    :host {
      display: block;
      font-size: var(--haxcms-base-styles-body-font-size);
      font-family: var(--haxcms-base-styles-body-font-family);
      line-height: var(--haxcms-base-styles-body-line-height);
      letter-spacing: var(--haxcms-base-styles-body-letter-spacing);
    }

    :host([hidden]) {
      display: none;
    }

    hax-body {
      font-size: var(--haxcms-base-styles-body-font-size);
      font-family: var(--haxcms-base-styles-body-font-family);
      line-height: var(--haxcms-base-styles-body-line-height);
      letter-spacing: var(--haxcms-base-styles-body-letter-spacing);
    }

    img {
      max-width: 100%;
      max-width: -moz-available;
      max-width: -webkit-fill-available;
      max-width: fill-available;
    }

    h1 {
      font-size: var(--hax-base-styles-h1-font-size);
      line-height: var(--hax-base-styles-h1-line-height);
    }

    h2 {
      font-size: var(--hax-base-styles-h2-font-size);
    }

    h3 {
      font-size: var(--hax-base-styles-h3-font-size);
    }

    h4 {
      font-size: var(--hax-base-styles-h4-font-size);
    }

    h5 {
      font-size: var(--hax-base-styles-h5-font-size);  
    }

    h6 {
      font-size: var(--hax-base-styles-h6-font-size);
    }

    p {
      min-height: var(--hax-base-styles-p-min-height);
      font-size: var(--hax-base-styles-p-font-size);
      line-height: var(--hax-base-styles-p-line-height);
      letter-spacing: var(--hax-base-styles-p-letter-spacing);
    }

    a,
    a:-webkit-any-link {
      font-size: var(--hax-base-styles-a-font-size,var(--hax-base-styles-p-font-size));
    }

    ol,
    ul
    ol li,
    ul li {
      line-height: var(--hax-base-styles-list-line-height,var(--hax-base-styles-p-line-height));
      font-size: var(--hax-base-styles-list-font-size,var(--hax-base-styles-p-font-size));
    }

    ul ul,
    ul ol,
    ol ul,
    ol ol {
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
    window.addEventListener("hax-store-ready", this.storeReady.bind(this));
    window.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this)
    );
    // dynamically import definitions for all needed tags
    import("./lib/h-a-x-dependencies.js");
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
            window.HaxStore.instance.appStore = appStore;
          }
        } catch (e) {
          console.warn(e);
        }
        if (this.hidePanelOps === "hide-panel-ops") {
          this.hidePanelOps = true;
        }
        window.HaxStore.instance.haxTray.hidePanelOps = this.hidePanelOps;
        window.HaxStore.instance.haxTray.offsetMargin = this.offsetMargin;
        window.HaxStore.instance.haxTray.elementAlign = this.elementAlign;
      }, 0);
    }
  }
  /**
   * Appstore has been loaded, NOW we can safely do an import
   */
  appStoreReady(e) {
    if (e.detail) {
      // import into the active body if there's content
      // obtain the nodes that have been assigned to the slot of our element
      if (this.shadowRoot.querySelector("slot")) {
        const nodes = this.shadowRoot.querySelector("slot").assignedNodes();
        let body = "";
        // loop the nodes and if it has an outerHTML attribute, append as string
        for (let i in nodes) {
          if (typeof nodes[i].outerHTML !== typeof undefined) {
            body += nodes[i].outerHTML;
          }
        }
        window.HaxStore.instance.activeHaxBody.importContent(body);
      }
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
    document.body.appendChild(document.createElement("hax-preferences-dialog"));
    document.body.appendChild(document.createElement("hax-export-dialog"));
    document.body.appendChild(document.createElement("hax-map"));
    document.body.appendChild(document.createElement("hax-autoloader"));
    return true;
  }
  disconnectedCallback() {
    window.removeEventListener("hax-store-ready", this.storeReady.bind(this));
    window.removeEventListener(
      "hax-store-ready",
      this.appStoreReady.bind(this)
    );
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
      window.HaxStore.instance.haxTray.elementAlign = newValue;
    }
  }
  get offsetMargin() {
    return this.getAttribute("offset-margin");
  }
  set offsetMargin(newValue) {
    this.setAttribute("offset-margin", newValue);
    if (this.__rendered) {
      // bind to the hax store global on change
      window.HaxStore.instance.haxTray.offsetMargin = newValue;
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
        window.HaxStore.instance.haxTray.hidePanelOps = newValue;
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
      window.HaxStore.instance.appStore = {
        ...JSON.parse(this.getAttribute("app-store")),
      };
    }
  }
  attributeChangedCallback(attr, oldValue, newValue) {}
}
window.customElements.define("h-a-x", HAX);
export { HAX };
