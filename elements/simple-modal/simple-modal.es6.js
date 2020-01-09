/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-dialog/paper-dialog.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
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
 * @demo ./demo/index.html demo
 * @demo ./demo/css.html styling simple-modal via CSS
 * @demo ./demo/details.html styling simple-modal via event details
 * @demo ./demo/template.html using simple-modal-template
 * @customElement simple-modal
 */
class SimpleModal extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      css`
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
}

#headerbar {
  margin: 0;
  padding: 0 16px;
  color: var(--simple-modal-header-color, #222);
  background-color: var(--simple-modal-header-background, #ccc);
}

h2 {
  margin-right: 8px;
  padding: 0;
  flex: auto;
  font-size: 18px;
  line-height: 18px;
}

#close {
  top: 0;
  padding: 10px 0;
  min-width: unset;
  text-transform: none;
  color: var(--simple-modal-titlebar-color,#444);
  background-color: transparent;
}

#close iron-icon {
  width: 16px;
  height: 16px;
  color: var(--simple-modal-titlebar-color,#444);
}

#simple-modal-content {
  flex-grow: 1;
  padding: 8px 16px;
  margin: 0;
  color: var(--simple-modal-content-container-color, #222);
  background-color: var(--simple-modal-content-container-background, #fff);
}
.buttons {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-buttons-color, unset);
  background-color: var(--simple-modal-buttons-background, unset);
}
.buttons ::slotted(*) {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-button-color,--simple-modal-buttons-color);
  background-color: var(--simple-modal-button-background,--simple-modal-buttons-background);
}
      `
    ];
  }
  // render function
  render() {
    return html`

<custom-style>
  <style>
  :host paper-dialog ::slotted(*) {
    @apply --simple-modal-content;
  }

  #dialog {
    @apply --simple-modal-dialog;
  }

  #titlebar {
    @apply --simple-modal-top;
  }

  #headerbar {
    @apply --simple-modal-headerbar;
  }

  h2 {
    @apply --simple-modal-title;
  }

  #close {
    @apply --simple-modal-close;
  }

  #close iron-icon {
    @apply --simple-modal-close-icon;
  }

  #simple-modal-content {
    --paper-dialog-scrollable: {
      padding: 0;
    }
    @apply --simple-modal-content-container;
  }
  .buttons {
    @apply --simple-modal-buttons;
  }
  .buttons ::slotted(*) {
    @apply --simple-modal-button;
  }
  </style>
</custom-style>
<paper-dialog
  id="dialog"
  always-on-top
  aria-describedby="simple-modal-content"
  aria-label="${this._getAriaLabel(this.title)}"
  aria-labelledby="${this._getAriaLabelledby(this.title)}"
  aria-modal="true"
  role="dialog"
  ?opened="${this.opened}"
  @opened-changed="${this.openedChangedEvent}"
  ?modal="${this.modal}"
  with-backdrop>
  <div id="titlebar">
    <h2 id="simple-modal-title" ?hidden="${!this.title}">${this.title}</h2>
    <div></div>
    <paper-button id="close" dialog-dismiss ?hidden="${!this.opened}" label="${this.closeLabel}">
      <iron-icon aria-hidden="true" icon="${this.closeIcon}"></iron-icon>
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
    "type": String
  },
  /**
   * open state
   */
  "opened": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * Close label
   */
  "closeLabel": {
    "attribute": "close-label",
    "type": String
  },
  /**
   * Close icon
   */
  "closeIcon": {
    "type": String,
    "attribute": "close-icon"
  },
  /**
   * The element that invoked this. This way we can track our way back accessibly
   */
  "invokedBy": {
    "type": Object
  },
  /**
   * support for modal flag
   */
  "modal": {
    "type": Boolean
  }
}
;
  }

  /**
   * convention
   */
  static get tag() {
    return "simple-modal";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.title = "";
    this.opened = false;
    this.closeLabel = "Close";
    this.closeIcon = "close";
    this.modal = false;
    setTimeout(() => {
      import("@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js");
      import("@polymer/paper-button/paper-button.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icon/iron-icon.js");
    }, 0);
  }
  /**
   * LitElement
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this._openedChanged(this[propName]);
      }
    });
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    this.shadowRoot
      .querySelector("#simple-modal-content")
      .addEventListener(
        "neon-animation-finish",
        this._ironOverlayClosed.bind(this)
      );
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      window.addEventListener("simple-modal-hide", this.close.bind(this));
      window.addEventListener("simple-modal-show", this.showEvent.bind(this));
    }, 0);
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    window.removeEventListener("simple-modal-hide", this.close.bind(this));
    window.removeEventListener("simple-modal-show", this.showEvent.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent(e) {
    // fake a resize event to make contents happy
    window.dispatchEvent(new Event("resize"));
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
    this.invokedBy = invokedBy;
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
      setTimeout(() => {
        this.invokedBy.focus();
      }, 500);
    }
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
  openedChangedEvent(e) {
    this.opened = e.detail.value;
  }
  // Observer opened for changes
  _openedChanged(newValue) {
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
}
window.customElements.define(SimpleModal.tag, SimpleModal);
export { SimpleModal };

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
