/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/hax-body/lib/hax-store.js";
import "@lrnwebcomponents/hax-body/lib/hax-panel.js";
import "@lrnwebcomponents/hax-body/lib/hax-manager.js";
import "@lrnwebcomponents/hax-body/lib/hax-autoloader.js";
import "@lrnwebcomponents/hax-body/hax-body.js";
import "@lrnwebcomponents/hax-body/lib/hax-app-picker.js";
import "@lrnwebcomponents/hax-body/lib/hax-app.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/hax-body/lib/hax-preferences-dialog.js";
import "@lrnwebcomponents/hax-body/lib/hax-stax-picker.js";
import "@lrnwebcomponents/hax-body/lib/hax-blox-picker.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-image/iron-image.js";
import "@lrnwebcomponents/hax-body/lib/hax-export-dialog.js";
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
  // render function
  get html() {
    return `
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<hax-body>
    <slot></slot>
</hax-body>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      appStore: {
        name: "appStore",
        type: "String",
        value: ""
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "h-a-x";
  }
  /**
   * life cycle
   */
  constructor(delayRender = true) {
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
    // optional queue for future use
    this._queue = [];
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });
    // if we shouldn't delay rendering OR the store is already ready...
    if (!delayRender || window.HaxStore.ready) {
      this.render();
    }
    window.addEventListener("hax-store-ready", this.render.bind(this));
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    // this ensures it's only applied once
    if (!this.__HAXApplied && !window.__HAXApplied) {
      window.__HAXApplied = this.__HAXApplied = this.applyHAX();
    }

    if (this._queue.length) {
      this._processQueue();
    }
  }

  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to);
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
  }

  _queueAction(action) {
    this._queue.push(action);
  }

  _processQueue() {
    this._queue.forEach(action => {
      this[`_${action.type}`](action.data);
    });

    this._queue = [];
  }

  _setProperty({ name, value }) {
    this[name] = value;
  }

  render() {
    if (!this.__rendered) {
      window.HaxStore.instance.appStore = JSON.parse(
        this.getAttribute("app-store")
      );
      this.__rendered = true;
      this.shadowRoot.innerHTML = null;
      this.template.innerHTML = this.html;
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      // import into the active body if there's content
      if (this.shadowRoot.querySelector("slot")) {
        this._importBodyContent();
      }
    }
  }
  /**
   * Import slotted content as body for haxActiveBody but ONLY
   * after we've got the appstore loaded so we know tags will validate
   */
  _importBodyContent() {
    // obtain the nodes that have been assigned to the slot of our element
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
    window.removeEventListener("hax-store-ready", this.render.bind(this));
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
