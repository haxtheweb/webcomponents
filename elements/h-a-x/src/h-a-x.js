/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/hax-body/lib/hax-store.js";
/**
 * `h-a-x`
 * `Single tag to transform authoring`
 *
 * @microcopy - language worth noting:
 *  - HAX - Headless Authoring eXperience
 *  - Body - the editable area that can be worked on and gets saved as a string / blob
 *
 * @customElement
 * @demo demo/index.html
 */
class HAX extends HTMLElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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

    // set tag for later use
    this.tag = HAX.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/HAX-properties.json
    let obj = HAX.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
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
    import("@lrnwebcomponents/h-a-x/lib/h-a-x-dependencies.js");
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
      window.HaxStore.instance.appStore = JSON.parse(
        this.getAttribute("app-store")
      );
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
    if (!this.__rendered) {
      this.__rendered = true;
      this.shadowRoot.innerHTML = null;
      this.template.innerHTML = this.html;
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }
  /**
   * Apply tags to the screen to establish HAX
   */
  applyHAX() {
    // store needs to come before anyone else, use it's availability request mechanism
    window.HaxStore.requestAvailability();
    // now everyone else
    let panel = document.createElement("hax-panel");
    panel.hidePanelOps = this.hidePanelOps;
    document.body.appendChild(panel);
    document.body.appendChild(document.createElement("hax-manager"));
    document.body.appendChild(document.createElement("hax-app-picker"));
    document.body.appendChild(document.createElement("hax-stax-picker"));
    document.body.appendChild(document.createElement("hax-blox-picker"));
    document.body.appendChild(document.createElement("hax-preferences-dialog"));
    document.body.appendChild(document.createElement("hax-export-dialog"));
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
    return ["app-store", "hide-panel-ops"];
  }
  get hidePanelOps() {
    return this.getAttribute("hide-panel-ops");
  }
  set hidePanelOps(newValue) {
    if (newValue) {
      this.setAttribute("hide-panel-ops", "hide-panel-ops");
    }
  }
  get appStore() {
    return this.getAttribute("app-store");
  }
  set appStore(newValue) {
    if (this.__rendered) {
      this.setAttribute("app-store", newValue);
      // bind to the hax store global on change
      window.HaxStore.instance.appStore = JSON.parse(
        this.getAttribute("app-store")
      );
    }
  }
  attributeChangedCallback(attr, oldValue, newValue) {}
}
window.customElements.define("h-a-x", HAX);
export { HAX };
