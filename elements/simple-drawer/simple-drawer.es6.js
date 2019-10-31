/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
// register globally so we can make sure there is only one
window.SimpleDrawer = window.SimpleDrawer || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same drawer
window.SimpleDrawer.requestAvailability = () => {
  if (!window.SimpleDrawer.instance) {
    window.SimpleDrawer.instance = document.createElement("simple-drawer");
    document.body.appendChild(window.SimpleDrawer.instance);
  }
  return window.SimpleDrawer.instance;
};
/**
 * `simple-drawer`
 * `a singleton drawer element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleDrawer extends PolymerElement {
  
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
  z-index: 1000;
}
:host([hidden]) {
  display: none;
}

app-drawer {
  --app-drawer-width: var(--simple-drawer-width, 256px);
  --app-drawer-content-container: {
    padding: 0;
    overflow-y: scroll;
    position: fixed;
    color: var(--simple-drawer-color, #222222);
    background-color: var(--simple-drawer-background-color, #FFFFFF);
  }
}
:host ::slotted(*) {
  font-size: 14px;
  @apply --simple-drawer-content;
}

.content {
  text-align: left;
  padding: 8px 24px;
  @apply --simple-drawer-content-container;
}

.top ::slotted(*) {
  font-size: 24px;
  margin: 0;
  padding: 0 15px;
  height: 40px;
  line-height: 48px;
}

#close {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 4px;
  margin: 0;
  text-transform: none;
  float: right;
  font-size: 12px;
  color: var(--simple-drawer-header-color, #ffffff);
  background-color: transparent;
  min-width: unset;
}

#close iron-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.top {
  font-size: 24px;
  margin: 0 0 8px 0;
  padding: 0 16px;
  height: 64px;
  line-height: 64px;
  display: flex;
  text-align: left;
  justify-content: space-between;
  background-color: var(--simple-drawer-header-background, #20427b);
  color: var(--simple-drawer-header-color, #ffffff);
  @apply --simple-drawer-header;
}

.top h2 {
  flex: auto;
  color: var(--simple-drawer-header-color, #ffffff);
  font-size: 24px;
  padding: 0;
  line-height: 32px;
  margin: 8px;
  @apply --simple-drawer-heading;
}</style>
<style include="simple-colors-shared-styles"></style>
<app-drawer tabindex="0" id="drawer" opened="{{opened}}" align="[[align]]" role="dialog">
  <div class="wrapper">
    <div class="top">
      <h2 hidden$="[[!title]]">[[title]]</h2>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <paper-button id="close" on-click="close">
      <iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]
    </paper-button>
  </div>
</app-drawer>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    let props = {
  /**
   * heading / label of the modal
   */
  "title": {
    "name": "title",
    "type": String,
    "value": ""
  },
  /**
   * alignment of the drawer
   */
  "align": {
    "name": "align",
    "type": String,
    "value": "left"
  },
  /**
   * open state
   */
  "opened": {
    "name": "opened",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true,
    "observer": "_openedChanged"
  },
  /**
   * Close label
   */
  "closeLabel": {
    "name": "closeLabel",
    "type": String,
    "value": "Close"
  },
  /**
   * Close icon
   */
  "closeIcon": {
    "name": "closeIcon",
    "type": String,
    "value": "cancel"
  },
  /**
   * The element that invoked this. This way we can track our way back accessibly
   */
  "invokedBy": {
    "name": "invokedBy",
    "type": Object
  }
}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-drawer";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("simple-drawer-hide", this.close.bind(this));
    window.addEventListener("simple-drawer-show", this.showEvent.bind(this));
  }
  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent(e) {
    // fake a resize event to make contents happy
    async.microTask.run(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }
  /**
   * show event call to open the drawer and display it's content
   */
  showEvent(e) {
    // if we're already opened and we get told to open again....
    // swap out the contents
    if (this.opened) {
      // wipe the slot of our drawer
      while (this.firstChild !== null) {
        this.removeChild(this.firstChild);
      }
      setTimeout(() => {
        this.show(
          e.detail.title,
          e.detail.elements,
          e.detail.invokedBy,
          e.detail.align,
          e.detail.clone
        );
      }, 100);
    } else {
      this.show(
        e.detail.title,
        e.detail.elements,
        e.detail.invokedBy,
        e.detail.align,
        e.detail.size,
        e.detail.clone
      );
    }
  }
  /**
   * Show the drawer and display the material
   */
  show(
    title,
    elements,
    invokedBy,
    align = "left",
    size = "256px",
    clone = false
  ) {
    this.set("invokedBy", invokedBy);
    this.title = title;
    this.align = align;
    this.updateStyles({ "--simple-drawer-width": size });
    let element;
    // append element areas into the appropriate slots
    // ensuring they are set if it wasn't previously
    let slots = ["header", "content"];
    for (var i in slots) {
      if (elements[slots[i]]) {
        if (clone) {
          element = elements[slots[i]].cloneNode(true);
        } else {
          element = elements[slots[i]];
        }
        element.setAttribute("slot", slots[i]);
        this.appendChild(element);
      }
    }
    // minor delay to help the above happen prior to opening
    setTimeout(() => {
      this.opened = true;
      this._resizeContent();
    }, 100);
  }
  /**
   * check state and if we should clean up on close.
   * This keeps the DOM tiddy and allows animation to happen gracefully.
   */
  animationEnded(e) {
    // wipe the slot of our drawer
    this.title = "";
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
    if (this.invokedBy) {
      async.microTask.run(() => {
        setTimeout(() => {
          this.invokedBy.focus();
        }, 500);
      });
    }
  }
  /**
   * Close the drawer and do some clean up
   */
  close() {
    this.shadowRoot.querySelector("#drawer").close();
  }
  // Observer opened for changes
  _openedChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && !newValue) {
      this.animationEnded();
      const evt = new CustomEvent("simple-drawer-closed", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: false,
          invokedBy: this.invokedBy
        }
      });
      this.dispatchEvent(evt);
    } else if (newValue) {
      const evt = new CustomEvent("simple-drawer-opened", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: true,
          invokedBy: this.invokedBy
        }
      });
      this.dispatchEvent(evt);
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("simple-drawer-hide", this.close.bind(this));
    window.removeEventListener("simple-drawer-show", this.showEvent.bind(this));
  }
}
window.customElements.define(SimpleDrawer.tag, SimpleDrawer);
export { SimpleDrawer };
