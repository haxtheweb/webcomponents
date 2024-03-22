/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
import "./lib/h-a-x-dependencies.js";
import { localStorageGet } from "@lrnwebcomponents/utils/utils.js";
import { editableTableDisplayStyles } from "@lrnwebcomponents/editable-table/lib/editable-table-behaviors.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
import {
  learningComponentColors,
  iconFromPageType,
} from "@lrnwebcomponents/course-design/lib/learning-component.js";

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
    let decorationStyles = ["red", "blue", "green", "orange", "purple"].map(
      (item) =>
        `
        [data-style-decoration~="highlight"] {
          color: var(--haxcms-style-element-color, white) !important;
          background-color: var(--haxcms-style-element-background-color, black) !important;
          font-weight: 400;
          word-wrap: break-word;
          padding: 4px 8px;
          text-transform: uppercase;
          text-decoration: none;
        }
        [data-style-decoration~="${item}"] {
          --haxcms-style-element-background-color: var(--simple-colors-default-theme-${item}-7, ${item});
        }
        `,
    );
    let instructionalStyles = Object.keys(learningComponentColors).map(
      (item) => {
        let color = learningComponentColors[item];
        return `
        h1[data-instructional-action="${item}"],
        h2[data-instructional-action="${item}"],
        h3[data-instructional-action="${item}"],
        h4[data-instructional-action="${item}"],
        h5[data-instructional-action="${item}"],
        h6[data-instructional-action="${item}"] {
          --hax-action-color: var(--simple-colors-default-theme-${color}-8, ${color});
          --hax-action-line-color: var(--simple-colors-default-theme-${color}-8, ${color});
          --hax-action-accent-color: #eeeeee;
          --hax-action-border: var(--simple-colors-default-theme-${color}-8, ${color}) solid 3px;
        }
        h1[data-instructional-action="${item}"]::after,
        h2[data-instructional-action="${item}"]::after,
        h3[data-instructional-action="${item}"]::after,
        h4[data-instructional-action="${item}"]::after,
        h5[data-instructional-action="${item}"]::after,
        h6[data-instructional-action="${item}"]::after {
          -webkit-mask-image: url("${SimpleIconsetStore.getIcon(
            iconFromPageType(item),
          )}");
        }
        
        hr[data-instructional-action="${item}"] {
          --hax-action-color: var(--simple-colors-default-theme-${color}-8, ${color});
          --hax-action-line-color: var(--simple-colors-default-theme-${color}-8, ${color});
          --hax-action-accent-color: #eeeeee;
          --hax-action-border: var(--simple-colors-default-theme-${color}-8, ${color}) solid 3px;
        }
        
        hr[data-instructional-action="${item}"]::after {
          -webkit-mask-image: url("${SimpleIconsetStore.getIcon(
            iconFromPageType(item),
          )}");
        }
        `;
      },
    );
    return `
    <style>
    ${decorationStyles.join("\n")}
    ${instructionalStyles.join("\n")}
    ${editableTableDisplayStyles
      .map((s) => s.cssText.replace(/:host/g, "hax-body table"))
      .join(" ")}
    [data-style-decoration] {
      --mark-red-bg: #fbe4e4;
      --mark-pink-bg: #f4dfeb;
      --mark-blue-bg: #ddebf1;
      --mark-purple-bg: #eae4f2;
      --mark-teal-bg: #ddedea;
      --mark-yellow-bg: #fbf3db;
      --mark-orange-bg: #faebdd;
      --mark-brown-bg: #e9e5e3;
      --mark-gray-bg: #ebeced;
    }
    [data-style-block-decoration] {
      --mark-red-bg-callout: hsla(0,74%,94%,.3);
      --mark-pink-bg-callout: rgba(244,223,235,.3);
      --mark-blue-bg-callout: rgba(221,235,241,.3);
      --mark-purple-bg-callout: rgba(234,228,242,.3);
      --mark-teal-bg-callout: rgba(221,237,234,.3);
      --mark-yellow-bg-callout: hsla(45,80%,92%,.3);
      --mark-orange-bg-callout: hsla(29,74%,92%,.3);
      --mark-brown-bg-callout: hsla(20,12%,90%,.3);
      --mark-gray-bg-callout: hsla(210,5%,93%,.3);
      padding: 16px 16px 16px 12px;
      border-radius: 3px;
      align-items: center;
      box-sizing: border-box;
      margin: 0.75em 0;
      border: 2px solid rgba(55,53,47,.09);
    }
    [data-style-block-decoration="callout-red"]{
      background-color: var(--mark-red-bg-callout);
    }
    
    [data-style-block-decoration="callout-pink"]{
        background-color: var(--mark-pink-bg-callout);
    }
    
    [data-style-block-decoration="callout-blue"]{
        background-color: var(--mark-blue-bg-callout);
    }
    
    [data-style-block-decoration="callout-purple"]{
        background-color: var(--mark-purple-bg-callout);
    }
    
    [data-style-block-decoration="callout-teal"]{
        background-color: var(--mark-teal-bg-callout);
    }
    
    [data-style-block-decoration="callout-yellow"]{
        background-color: var(--mark-yellow-bg-callout);
    }
    
    [data-style-block-decoration="callout-orange"]{
        background-color: var(--mark-orange-bg-callout);
    }
    
    [data-style-block-decoration="callout-brown"]{
        background-color: var(--mark-brown-bg-callout);
    }
    [data-style-block-decoration="callout-gray"]{
        background-color: var(--mark-gray-bg-callout);
    }
    [data-style-decoration="mark-blue"],[data-style-decoration="mark-brown"],[data-style-decoration="mark-gray"],[data-style-decoration="mark-orange"],[data-style-decoration="mark-pink"],[data-style-decoration="mark-purple"],[data-style-decoration="mark-red"],[data-style-decoration="mark-teal"],[data-style-decoration="mark-yellow"] {
      --bg-color: transparent;  
      padding: 0 .5rem;
      margin: 0 -.5rem 0 -.25rem;
      border-radius: .5rem;
      border-bottom-left-radius: .125rem;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
      background-color: transparent;
      background-image: linear-gradient(119deg,var(--bg-color),#fff697 10.5%,#fdf59d 85.29%,var(--bg-color));
    }

    [data-style-decoration="mark-pink"],[data-style-decoration="mark-purple"] {
        background-image: linear-gradient(119deg,var(--bg-color),#f5b8d1 10.5%,#f9bcd3 85.29%,var(--bg-color))
    }

    [data-style-decoration="mark-blue"],[data-style-decoration="mark-gray"] {
        background-image: linear-gradient(119deg,var(--bg-color),#adedfc 10.5%,#adebfd 85.29%,var(--bg-color));
    }

    [data-style-decoration="mark-orange"],[data-style-decoration="mark-red"] {
        background-image: linear-gradient(119deg,var(--bg-color),#f5c4ff 10.5%,#e7a8fc 85.29%,var(--bg-color))
    }

    [data-style-decoration="mark-teal"] {
        background-image: linear-gradient(119deg,var(--bg-color),#d4eabc 10.5%,#d2eabc 85.29%,var(--bg-color))
    }

    [data-style-decoration="mark-brown"] {
        background-image: linear-gradient(119deg,var(--bg-color),#96b8ec 10.5%,#a6c3f0 85.29%,var(--bg-color))
    }
    [data-style-decoration="mark-red"] {
        background-color: var(--mark-red-bg)
    }

    [data-style-decoration="mark-pink"] {
        background-color: var(--mark-pink-bg)
    }

    [data-style-decoration="mark-blue"] {
        background-color: var(--mark-blue-bg)
    }

    [data-style-decoration="mark-purple"] {
        background-color: var(--mark-purple-bg)
    }

    [data-style-decoration="mark-teal"] {
        background-color: var(--mark-teal-bg)
    }

    [data-style-decoration="mark-yellow"] {
        background-color: var(--mark-yellow-bg)
    }

    [data-style-decoration="mark-orange"] {
        background-color: var(--mark-orange-bg)
    }

    [data-style-decoration="mark-brown"] {
        background-color: var(--mark-brown-bg)
    }

    [data-style-decoration="mark-gray"] {
        background-color: var(--mark-gray-bg)
    }
    hr[data-instructional-action] {
      border: none;
      border-top: 2px dashed var(--hax-action-line-color, blue);
      overflow: visible;
      text-align: center;
      height: 4px;
      padding: 0px;
      background-color: white;
    }
    
    hr[data-instructional-action]::before {
      background-color: var(--hax-action-accent-color, #aaa);
      height: 50px;
      width: 50px;
      margin: 0 auto;
      background-position: center;
      content: '';
      display: block;
      top: -28px;
      position: relative;
      z-index: 1;
      border: var(--hax-action-border ,2px solid blue);
      border-radius: 50%;
    }
  
    hr[data-instructional-action]::after {
      content: '';
      position: relative;
      z-index: 2;
      background-color: var(--hax-action-color, blue);
      mask-repeat: no-repeat;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-size: contain;
      padding: 18px;
      top: -64px;
    }
        h1[data-instructional-action],
        h2[data-instructional-action],
        h3[data-instructional-action],
        h4[data-instructional-action],
        h5[data-instructional-action],
        h6[data-instructional-action] {
          padding-left: 72px;
          line-height: 50px;
          min-height: 64px;
          position: relative;
        }

        h1[data-instructional-action]::before,
        h2[data-instructional-action]::before,
        h3[data-instructional-action]::before,
        h4[data-instructional-action]::before,
        h5[data-instructional-action]::before,    
        h6[data-instructional-action]::before {
          background-color: var(--hax-action-accent-color, #aaa);
          background-position: center;
          content: '';
          display: block;
          position: absolute;
          z-index: 1;
          border: var(--hax-action-border , 3px solid black);
          border-radius: 50%;
          left: 0px;
          margin: 5px;
          height: 40px;
          width: 40px;
        }        

        h1[data-instructional-action]::after,
        h2[data-instructional-action]::after,
        h3[data-instructional-action]::after,
        h4[data-instructional-action]::after,
        h5[data-instructional-action]::after,    
        h6[data-instructional-action]::after {
          content: '';
          position: relative;
          z-index: 2;
          background-color: var(--hax-action-color, blue);
          mask-repeat: no-repeat;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-size: contain;
          padding: 12px;
          margin: 15px;
          position: absolute;
          left: 0px;
        }

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
    this.template = document.createElement("template");
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
    window.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      once: true,
      passive: true,
      signal: this.windowControllersReady.signal,
    });

    window.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    // map events from tray
    window.addEventListener("hax-cancel", this.cancelEvent.bind(this), {
      signal: this.windowControllers.signal,
    });
    window.addEventListener("hax-save", this.saveEvent.bind(this), {
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
    let store = window.HaxStore.requestAvailability();
    // now everyone else
    let tray = document.createElement("hax-tray");
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
    document.body.appendChild(tray);
    document.body.appendChild(document.createElement("hax-app-picker"));
    document.body.appendChild(document.createElement("hax-autoloader"));
    document.body.appendChild(document.createElement("hax-cancel-dialog"));
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
