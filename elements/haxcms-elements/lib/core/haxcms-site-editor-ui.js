import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "./haxcms-site-store.js";
import { varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-fab/paper-fab.js";
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
class HAXCMSSiteEditorUI extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-editor-ui";
  }
  constructor() {
    super();
    this.__disposer = [];
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: fixed;
          left: 0;
          top: 56px;
          opacity: 0.8;
          transition: 0.8s left linear, 0.3s opacity ease-in-out,
            0.3s visibility ease-in-out;
          background-color: #37474f;
          z-index: 10000;
          border-right: 2px solid black;
          border-top: 2px solid black;
          border-bottom: 2px solid black;
          visibility: visible;
        }
        :host([edit-mode]) {
          z-index: 9999;
        }
        :host([dashboard-opened]) {
          left: 50vw;
        }
        /**
         * Dashboard open trumps all contextual settings
         */
        :host([dashboard-opened]) #editbutton,
        :host([dashboard-opened]) #editdetails,
        :host([dashboard-opened]) #deletebutton,
        :host([dashboard-opened]) #addbutton,
        :host([dashboard-opened]) #outlinebutton {
          display: none !important;
        }
        :host *[hidden] {
          display: none;
        }
        paper-fab:not(:defined),
        paper-tooltip:not(:defined),
        paper-icon-button:not(:defined) {
          display: none !important;
        }
        paper-fab {
          display: block;
          width: 48px;
          height: 48px;
          line-height: 20px;
          background-color: black;
          color: var(--haxcms-color, rgba(255, 0, 116, 1));
          transition: 0.3s all ease-in-out;
          padding: 12px;
          margin: 0;
          position: relative;
          @apply --shadow-elevation-8dp;
        }
        :host([painting]) {
          opacity: 0;
          visibility: hidden;
        }
        paper-icon-button {
          display: block;
          padding: 8px;
          width: 48px;
          min-width: 48px;
          height: 48px;
          border-radius: 50%;
          margin: 0px;
          background-color: black;
          color: var(--haxcms-color, rgba(255, 0, 116, 1));
          transition: 0.3s all ease-in-out;
          @apply --shadow-elevation-8dp;
        }
        paper-fab:hover,
        paper-fab:focus,
        paper-fab:active,
        paper-icon-button:hover,
        paper-icon-button:focus,
        paper-icon-button:active {
          background-color: black;
          color: white;
        }
        #editbutton,
        #editdetails,
        #deletebutton {
          visibility: hidden;
          opacity: 0;
        }
        :host([page-allowed]) #editbutton,
        :host([page-allowed]) #editdetails,
        :host([page-allowed]) #deletebutton {
          visibility: visible;
          opacity: 1;
        }
        :host([edit-mode]) #editbutton {
          border-radius: 0;
          color: white;
          background-color: var(--paper-blue-500, blue) !important;
        }
        :host([edit-mode]) #manifestbutton,
        :host([edit-mode]) #editdetails,
        :host([edit-mode]) #deletebutton,
        :host([edit-mode]) #addbutton,
        :host([edit-mode]) #outlinebutton {
          display: none !important;
        }

        :host(:hover),
        :host(:active),
        :host(:focus) {
          opacity: 1;
        }
        paper-tooltip {
          --paper-tooltip-background: #000000;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: #ffffff;
          --paper-tooltip-delay-in: 0;
          --paper-tooltip: {
            border-radius: 0;
          }
        }
      </style>
      <paper-fab
        id="editbutton"
        icon="[[__editIcon]]"
        on-click="_editButtonTap"
        title$="[[__editText]]"
      ></paper-fab>
      <paper-fab
        id="cancelbutton"
        icon="icons:cancel"
        on-click="_cancelButtonTap"
        hidden$="[[!editMode]]"
        title="Cancel editing"
      ></paper-fab>
      <paper-fab
        id="editdetails"
        icon="icons:fingerprint"
        on-click="_editDetailsButtonTap"
        title="Edit page details"
      ></paper-fab>
      <paper-icon-button
        id="addbutton"
        icon="icons:add"
        on-click="_addButtonTap"
        title="Add new page"
      ></paper-icon-button>
      <paper-fab
        id="deletebutton"
        icon="icons:delete"
        on-click="_deleteButtonTap"
        title="Delete current page"
      ></paper-fab>
      <paper-icon-button
        id="outlinebutton"
        icon="icons:list"
        on-click="_outlineButtonTap"
        title="Edit site outline"
      ></paper-icon-button>
      <paper-icon-button
        id="manifestbutton"
        icon="[[icon]]"
        on-click="_manifestButtonTap"
        title="[[__settingsText]]"
      ></paper-icon-button>
      <paper-tooltip for="cancelbutton" position="right" offset="14"
        >Cancel</paper-tooltip
      >
      <paper-tooltip for="editbutton" position="right" offset="14"
        >[[__editText]]</paper-tooltip
      >
      <paper-tooltip for="editdetails" position="right" offset="14"
        >Details</paper-tooltip
      >
      <paper-tooltip for="deletebutton" position="right" offset="14"
        >Delete</paper-tooltip
      >
      <paper-tooltip for="addbutton" position="right" offset="14"
        >Add</paper-tooltip
      >
      <paper-tooltip for="outlinebutton" position="right" offset="14"
        >Outline</paper-tooltip
      >
      <paper-tooltip for="manifestbutton" position="right" offset="14"
        >[[__settingsText]]</paper-tooltip
      >
    `;
  }
  static get properties() {
    return {
      /**
       * small visual lock that events break on initial paint
       */
      painting: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      /**
       * page allowed
       */
      pageAllowed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * if the page is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_editModeChanged",
        value: false,
        notify: true
      },
      /**
       * Manifest editing state
       */
      manifestEditMode: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_manifestEditModeChanged",
        value: false,
        notify: true
      },
      activeTitle: {
        type: String
      },
      manifest: {
        type: Object
      },
      icon: {
        type: String
      },
      dashboardOpened: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_dashboardOpenedChanged"
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      import("@lrnwebcomponents/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js");
      // this ensures that an initial paint won't get a cached copy of the site.json file
      // this is more than possible given that it will register to most backends
      // as a static file rather than dynamic end point as it is in this instance (sorta)
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true
        })
      );
      autorun(reaction => {
        this.editMode = toJS(store.editMode);
        this.__disposer.push(reaction);
      });
      autorun(reaction => {
        this.manifest = toJS(store.manifest);
        this.icon = varGet(
          this.manifest,
          "manifest.metadata.theme.variables.icon",
          "icons:settings"
        );
        this.__disposer.push(reaction);
      });
      autorun(reaction => {
        this.dashboardOpened = toJS(store.dashboardOpened);
        this.__disposer.push(reaction);
      });
      autorun(reaction => {
        const activeItem = toJS(store.activeItem);
        if (activeItem && activeItem.id) {
          this.activeTitle = activeItem.title;
          this.pageAllowed = true;
        } else {
          this.pageAllowed = false;
        }
        this.__disposer.push(reaction);
      });
    });
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  _dashboardOpenedChanged(newValue, oldValue) {
    if (newValue) {
      this.__settingsText = "Close";
      this.icon = "icons:cancel";
    } else if (!newValue && oldValue) {
      this.__settingsText = "Site settings";
      this.icon = varGet(
        this.manifest,
        "manifest.metadata.theme.variables.icon",
        "icons:settings"
      );
    }
  }
  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
    this.editMode = !this.editMode;
    // save button shifted to edit
    if (!this.editMode) {
      this.dispatchEvent(
        new CustomEvent("haxcms-save-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: store.activeItem
        })
      );
    }
  }
  _editDetailsButtonTap(e) {
    var normalizedEvent = dom(e);
    const evt = new CustomEvent("haxcms-load-node-fields", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: normalizedEvent.localTarget
    });
    window.dispatchEvent(evt);
  }
  _cancelButtonTap(e) {
    this.editMode = false;
    this.dispatchEvent(
      new CustomEvent("hax-cancel", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.detail
      })
    );
  }
  /**
   * Add button hit
   * @todo simplify this to just what's needed; no crazy options
   */
  _addButtonTap(e) {
    this.__newForm = document.createElement("eco-json-schema-object");
    let outline = window.JSONOutlineSchema.requestAvailability();
    // get a prototype schema for an item
    this.__newForm.schema = outline.getItemSchema("item");
    // drop these for now cause we just care about title
    delete this.__newForm.schema.properties.id;
    delete this.__newForm.schema.properties.description;
    delete this.__newForm.schema.properties.order;
    delete this.__newForm.schema.properties.parent;
    delete this.__newForm.schema.properties.metadata;
    delete this.__newForm.schema.properties.indent;
    this.__newForm.schema.properties.title.value = "";
    let b1 = document.createElement("paper-button");
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:add";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Create page"));
    b1.style.color = "white";
    b1.style.backgroundColor = "#2196f3";
    b1.addEventListener("click", this._createNewItem.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Add a new page",
        elements: { content: this.__newForm, buttons: b },
        invokedBy: this.$.addbutton,
        clone: false,
        modal: true
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * create new item
   */
  _createNewItem(e) {
    const evt = new CustomEvent("haxcms-create-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        values: this.__newForm.value
      }
    });
    this.dispatchEvent(evt);
  }
  /**
   * Fire item
   */
  _updateItem(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var values;
    if (!local.__form) {
      values = local.parentNode.__form.value;
    } else {
      values = local.__form.value;
    }
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: values
      })
    );
    // fire event to close the modal
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {}
      })
    );
  }
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap(e) {
    let c = document.createElement("span");
    c.innerHTML = `"${
      store.activeItem.title
    }" will be removed from the outline but its content stays on the file system.`;
    let b1 = document.createElement("paper-button");
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:delete";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Confirm"));
    b1.style.color = "white";
    b1.style.backgroundColor = "#ee0000";
    b1.addEventListener("click", this._deleteActive.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Are you sure you want to delete this page?",
        elements: { content: c, buttons: b },
        invokedBy: this.$.deletebutton,
        clone: false,
        modal: true
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * delete active item
   */
  _deleteActive(e) {
    const evt = new CustomEvent("haxcms-delete-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        item: store.activeItem
      }
    });
    this.dispatchEvent(evt);
  }
  /**
   * toggle state on button tap
   */
  _outlineButtonTap(e) {
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Edit site outline",
        elements: {
          content: document.createElement("haxcms-outline-editor-dialog")
        },
        invokedBy: this.$.outlinebutton,
        clone: false,
        modal: true
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e) {
    window.dispatchEvent(
      new CustomEvent("haxcms-load-site-fields", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.target
      })
    );
  }
  /**
   * Edit state has changed.
   */
  _editModeChanged(newValue, oldValue) {
    if (newValue) {
      // enable it some how
      this.__editIcon = "icons:save";
      this.__editText = "Save";
    } else {
      // disable it some how
      this.__editIcon = "editor:mode-edit";
      this.__editText = "Edit";
    }
    if (typeof oldValue !== typeof undefined) {
      store.editMode = newValue;
    }
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-outline-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue
      })
    );
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-manifest-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue
      })
    );
  }
}
window.customElements.define(HAXCMSSiteEditorUI.tag, HAXCMSSiteEditorUI);
export { HAXCMSSiteEditorUI };
