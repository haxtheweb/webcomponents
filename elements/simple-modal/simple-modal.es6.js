/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-dialog/paper-dialog.js";
// register globally so we can make sure there is only one
window.SimpleModal = window.SimpleModal || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.SimpleModal.requestAvailability = () => {
  if (!window.SimpleModal.instance) {
    window.SimpleModal.instance = document.createElement("simple-modal");
    document.body.appendChild(window.SimpleModal.instance);
  }
  return window.SimpleModal.instance;
};
/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 *
 * @microcopy - language worth noting:
 *  -
 * 
 * CSS Variables: ```
--simple-modal-titlebar-color: #444;
--simple-modal-titlebar-background: #ddd;
--simple-modal-header-color: #222;
--simple-modal-header-background: #ccc;
--simple-modal-content-container-color: #222;
--simple-modal-content-container-background: #fff;
--simple-modal-buttons-color: unset;
--simple-modal-buttons-background: unset;
--simple-modal-button-color: var(--simple-modal-buttons-color);
--simple-modal-button-background: var(--simple-modal-buttons-background-color);
```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/css.html styling simple-modal via CSS
 * @demo demo/details.html styling simple-modal via event details
 * @demo demo/template.html using simple-modal-template
 */
class SimpleModal extends PolymerElement {
  
  // render function
  static get template() {
    return html`
<style>
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

paper-dialog-scrollable:not(:defined) {
  display: none;
}

:host paper-dialog ::slotted(*) {
  font-size: 14px;
  width: 100%;
  @apply --simple-modal-content;
}

#dialog {
  display: flex;
  flex-direction: column;
  margin: 15px auto;
  z-index: 1000;
  height: var(--simple-modal-height, auto);
  width: var(--simple-modal-width, auto);
  min-width: var(--simple-modal-min-width, unset);
  max-width: var(--simple-modal-max-width, unset);
  min-height: var(--simple-modal-min-height, unset);
  max-height: var(--simple-modal-max-height, unset);
  border-radius: 3px;
  @apply --simple-modal-dialog;
}

#titlebar {
  margin-top: 0;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--simple-modal-titlebar-color,#444);
  background-color: var(--simple-modal-titlebar-background,#ddd);
  border-radius: 3px 3px 0 0;
  height: 64px;
  line-height: 64px;
  @apply --simple-modal-top;
}

#headerbar {
  margin: 0;
  padding: 0 16px;
  color: var(--simple-modal-header-color, #222);
  background-color: var(--simple-modal-header-background, #ccc);
  @apply --simple-modal-headerbar;
}

h2 {
  margin-right: 8px;
  padding: 0;
  flex: auto;
  font-size: 18px;
  line-height: 18px;
  @apply --simple-modal-title;
}

#close {
  top: 0;
  padding: 10px 0;
  min-width: unset;
  text-transform: none;
  color: var(--simple-modal-titlebar-color,#444);
  background-color: transparent;
  @apply --simple-modal-close;
}

#close iron-icon {
  width: 16px;
  height: 16px;
  color: var(--simple-modal-titlebar-color,#444);
  @apply --simple-modal-close-icon;
}

#simple-modal-content {
  flex-grow: 1;
  padding: 8px 16px;
  margin: 0;
  color: var(--simple-modal-content-container-color, #222);
  background-color: var(--simple-modal-content-container-background, #fff);
  --paper-dialog-scrollable: {
    padding: 0;
  }
  @apply --simple-modal-content-container;
}
.buttons {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-buttons-color, unset);
  background-color: var(--simple-modal-buttons-background, unset);
  @apply --simple-modal-buttons;
}
.buttons ::slotted(*) {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-button-color,--simple-modal-buttons-color);
  background-color: var(--simple-modal-button-background,--simple-modal-buttons-background);
  @apply --simple-modal-button;
}
        </style>
<paper-dialog id="dialog" 
  always-on-top
  aria-describedby="simple-modal-content"
  aria-label$="[[_getAriaLabel(title)]]"
  aria-labelledby$="[[_getAriaLabelledby(title)]]"
  aria-modal="true"
  entry-animation="scale-up-animation" 
  exit-animation="fade-out-animation" 
  role="dialog"
  opened="{{opened}}" 
  modal="[[modal]]"
  with-backdrop>
  <div id="titlebar">
    <h2 id="simple-modal-title" hidden$="[[!title]]">[[title]]</h2>
    <div></div>
    <paper-button id="close" dialog-dismiss hidden$="[[!opened]]" label="[[closeLabel]]">
      <iron-icon aria-hidden="true" icon="[[closeIcon]]"></iron-icon>
    </paper-button>
  </div>
  <div id="headerbar"><slot name="header"></slot></div>
  <paper-dialog-scrollable id="simple-modal-content">
    <slot name="content"></slot>
  </paper-dialog-scrollable>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>
</paper-dialog>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * heading / label of the modal
   */
  "title": {
    "name": "title",
    "type": String,
    "value": ""
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
    "value": "close"
  },
  /**
   * The element that invoked this. This way we can track our way back accessibly
   */
  "invokedBy": {
    "name": "invokedBy",
    "type": Object
  },
  /**
   * support for modal flag
   */
  "modal": {
    "name": "modal",
    "type": Boolean,
    "value": false
  }
}
;
  }

  constructor() {
    super();
    import("@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/neon-animation/animations/scale-up-animation.js");
    import("@polymer/neon-animation/animations/fade-out-animation.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-modal";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      window.addEventListener("simple-modal-hide", this.close.bind(this));
      window.addEventListener("simple-modal-show", this.showEvent.bind(this));
      this.shadowRoot
        .querySelector("#simple-modal-content")
        .addEventListener(
          "neon-animation-finish",
          this._ironOverlayClosed.bind(this)
        );
    });
  }
  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent(e) {
    // fake a resize event to make contents happy
    microTask.run(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }
  /**
   * show event call to open the modal and display it's content
   *
   */
  showEvent(e) {
    // if we're already opened and we get told to open again....
    // swap out the contents
    if (this.opened) {
      // wipe the slot of our modal
      while (this.firstChild !== null) {
        this.removeChild(this.firstChild);
      }
      setTimeout(() => {
        this.show(
          e.detail.title,
          e.detail.elements,
          e.detail.invokedBy,
          e.detail.id,
          e.detail.modalClass,
          e.detail.styles,
          e.detail.clone,
          e.detail.modal
        );
      }, 100);
    } else {
      this.show(
        e.detail.title,
        e.detail.elements,
        e.detail.invokedBy,
        e.detail.id,
        e.detail.modalClass,
        e.detail.styles,
        e.detail.clone,
        e.detail.modal
      );
    }
  }
  /**
   * Show the modal and display the material
   */
  show(
    title,
    elements,
    invokedBy,
    id = null,
    modalClass = null,
    styles = null,
    clone = false,
    modal = false
  ) {
    this.set("invokedBy", invokedBy);
    this.modal = modal;
    this.title = title;
    let element;
    // append element areas into the appropriate slots
    // ensuring they are set if it wasn't previously
    let slots = ["header", "content", "buttons"];
    if (id) {
      this.setAttribute("id", id);
    } else {
      this.removeAttribute("id");
    }
    this.setAttribute("style", "");
    if (styles) {
      [
        "--simple-modal-width",
        "--simple-modal-height",
        "--simple-modal-min-width",
        "--simple-modal-min-height",
        "--simple-modal-max-width",
        "--simple-modal-max-height",
        "--simple-modal-titlebar-color",
        "--simple-modal-titlebar-background",
        "--simple-modal-header-color",
        "--simple-modal-header-background",
        "--simple-modal-content-container-color",
        "--simple-modal-content-container-background",
        "--simple-modal-buttons-color",
        "--simple-modal-buttons-background",
        "--simple-modal-button-color",
        "--simple-modal-button-background"
      ].forEach(prop => {
        this.style.setProperty(prop, styles[prop] || "unset");
      });
    }
    if (modalClass) {
      this.setAttribute("class", modalClass);
    } else {
      this.removeAttribute("class");
    }
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
    // wipe the slot of our modal
    this.title = "";
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
    if (this.invokedBy) {
      microTask.run(() => {
        setTimeout(() => {
          this.invokedBy.focus();
        }, 500);
      });
    }
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
  // Observer opened for changes
  _openedChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && !newValue) {
      this.animationEnded();
      const evt = new CustomEvent("simple-modal-closed", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: false,
          invokedBy: this.invokedBy
        }
      });
      this.dispatchEvent(evt);
    } else if (newValue) {
      const evt = new CustomEvent("simple-modal-opened", {
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
   * If there is a title, aria-labelledby should point to #simple-modal-title
   */
  _getAriaLabelledby(title) {
    return !title ? null : "simple-modal-title";
  }
  /**
   * If there is no title, supply a generic aria-label
   */
  _getAriaLabel(title) {
    return !title ? "Modal Dialog" : null;
  }
  _ironOverlayClosed(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener("simple-modal-hide", this.close.bind(this));
    window.removeEventListener("simple-modal-show", this.showEvent.bind(this));
    this.shadowRoot
      .querySelector("#simple-modal-content")
      .removeEventListener(
        "neon-animation-finish",
        this._ironOverlayClosed.bind(this)
      );
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleModal.tag, SimpleModal);
export { SimpleModal };
