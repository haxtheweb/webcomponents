/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import "./lib/h-a-x-dependencies.js";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import { editableTableDisplayStyles } from "@haxtheweb/editable-table/lib/editable-table-behaviors.js";

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
    ${editableTableDisplayStyles
      .map((s) => s.cssText.replace(/:host/g, "hax-body table"))
      .join(" ")}

    :host,h-a-x {
      display: block;
    }

    :host([hidden]),h-a-x([hidden]) {
      display: none;
    }

    :host img, h-a-x img {
      max-width: 100%;
      max-width: -moz-available;
      max-width: -webkit-fill-available;
      max-width: fill-available;
    }

    hax-body[edit-mode] page-break[data-hax-active],
    hax-body[edit-mode] [data-hax-active][contenteditable] {
      outline-offset: 8px;
      outline: var(--hax-body-active-outline, 2px solid var(--hax-ui-color-focus, #000)) !important;
      caret-color: var(--hax-ui-caret-color, auto);
    }

  :host([edit-mode])
    #bodycontainer
    ::slotted([contenteditable][data-hax-ray][data-hax-active]:empty:not([data-instructional-action]))::before {
    content: "Type / to add blocks";
    opacity: 0.4;
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
    this.windowControllers = new AbortController();
    this.windowControllersLoaded = new AbortController();
    this.windowControllersReady = new AbortController();
    this.__rendered = false;
    // set tag for later use
    this.tag = HAX.tag;
    this.template = globalThis.document.createElement("template");
    this.attachShadow({ mode: "open" });
    // see if we have any adoptable stylesheets
    if (globalThis.document.adoptedStyleSheets) {
      globalThis.document.adoptedStyleSheets.map((sheet) => {
        if (sheet.hax) {
          this.shadowRoot.adoptedStyleSheets.push(sheet);
        }
      });
    }
    // if we shouldn't delay rendering
    if (!delayRender) {
      this.render();
    }
    // setup events, only run them once and remove
    globalThis.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      once: true,
      passive: true,
      signal: this.windowControllersReady.signal,
    });

    globalThis.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    // map events from tray
    globalThis.addEventListener("hax-cancel", this.cancelEvent.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("hax-save", this.saveEvent.bind(this), {
      signal: this.windowControllers.signal,
    });
  }
  cancelEvent(e) {
    this.importSlotToHaxBody();
  }
  async saveEvent(e) {
    const body = await HAXStore.activeHaxBody.haxToContent();
    this.innerHTML = body;
    this.dispatchEvent(
      new CustomEvent("hax-save-body-value", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: body,
        },
      }),
    );
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // this ensures it's only applied once
    if (!this.__HAXApplied && !globalThis.__HAXApplied) {
      globalThis.__HAXApplied = this.__HAXApplied = this.applyHAX();
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
        if (this.hideToolbar === "hide-toolbar") {
          this.hideToolbar = true;
        }
        HAXStore.haxTray.hideToolbar = this.hideToolbar;
        HAXStore.haxTray.offsetMargin = this.offsetMargin;
        HAXStore.elementAlign = this.elementAlign;
      }, 0);
      this.windowControllersReady.abort();
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
      this.windowControllersLoaded.abort();
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
    let store = globalThis.HaxStore.requestAvailability();
    // now everyone else
    let tray = globalThis.document.createElement("hax-tray");
    tray.hidePanelOps = this.hidePanelOps;
    tray.hideToolbar = this.hideToolbar;
    this.elementAlign = localStorageGet("hax-tray-elementAlign");
    if (
      !this.elementAlign ||
      this.elementAlign == null ||
      this.elementAlign == ""
    ) {
      this.elementAlign = "left";
    }
    store.elementAlign = this.elementAlign;
    globalThis.document.body.appendChild(tray);
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-app-picker"),
    );
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-autoloader"),
    );
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-cancel-dialog"),
    );
    return true;
  }
  disconnectedCallback() {
    this.windowControllers.abort();
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
      HAXStore.elementAlign = newValue;
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
  get hideToolbar() {
    return this.getAttribute("hide-toolbar");
  }
  set hideToolbar(newValue) {
    if (newValue) {
      this.setAttribute("hide-toolbar", "hide-toolbar");
      if (this.__rendered) {
        // bind to the hax store global on change
        HAXStore.haxTray.hideToolbar = newValue;
      }
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
customElements.define("h-a-x", HAX);
export { HAX };
