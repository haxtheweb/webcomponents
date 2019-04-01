import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "./haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-fab/paper-fab.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "./haxcms-outline-editor-dialog.js";
import "./haxcms-manifest-editor-dialog.js";

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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: fixed;
          right: 0;
          bottom: 0;
          opacity: 0.9;
          transition: 0.6s all ease-in-out;
          background-color: var(--haxcms-color, white);
          padding: 0px 8px;
          border-top-left-radius: 10px;
          border-left: 2px solid black;
          border-top: 2px solid black;
          min-width: 154px;
          width: 72px;
          line-height: 54px;
          height: 54px;
          z-index: 10000;
          visibility: visible;
        }
        :host([edit-mode]) {
          min-width: 154px;
        }
        :host *[hidden] {
          display: none;
        }
        paper-fab {
          display: inline-flex;
          width: 48px;
          height: 48px;
          vertical-align: middle;
          line-height: 48px;
          background-color: black;
          color: var(--haxcms-color, white);
          transition: 0.3s all ease-in-out;
          padding: 8px;
          margin: 0;
          position: relative;
          @apply --shadow-elevation-8dp;
        }
        :host([painting]) {
          opacity: 0;
          visibility: hidden;
        }
        paper-icon-button {
          padding: 8px;
          width: 48px;
          min-width: 48px;
          height: 48px;
          border-radius: 50%;
          margin: 3px 3px 0 3px;
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
          width: 60px;
          z-index: 1001;
          border-radius: 0;
          margin: 0;
          padding: 0;
          color: white;
          background-color: var(--paper-blue-500, blue) !important;
          position: absolute;
          height: 54px;
        }
        .wrapper {
          width: 0px;
          height: 54px;
          line-height: 54px;
          color: black;
          display: inline-flex;
          transition: 0.3s all ease-in-out;
          overflow: hidden;
          padding: 0;
          margin: 0;
          vertical-align: top;
        }
        :host([menu-mode]) .wrapper {
          width: 250px;
        }
        @media screen and (max-width: 600px) {
          :host([menu-mode]) .wrapper {
            width: 200px;
          }
          .active-title {
            display: none;
          }
        }
        :host([menu-mode]) {
          opacity: 1;
          width: unset;
        }
        :host([edit-mode][menu-mode]) #editbutton {
          width: 100% !important;
        }
        :host(:hover),
        :host(:active),
        :host(:focus) {
          opacity: 1;
        }
        .active-title {
          font-size: 11px;
          font-weight: bold;
          width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 54px;
          padding: 0 8px;
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
        id="menubutton"
        icon="icons:menu"
        on-tap="_menuButtonTap"
        title="Expand menu"
      ></paper-fab>
      <paper-fab
        id="cancelbutton"
        icon="icons:cancel"
        on-tap="_cancelButtonTap"
        hidden$="[[!editMode]]"
        title="Cancel editing"
      ></paper-fab>
      <paper-fab
        id="editbutton"
        icon="[[__editIcon]]"
        on-tap="_editButtonTap"
        title$="[[__editText]]"
      ></paper-fab>
      <paper-fab
        id="editdetails"
        icon="icons:fingerprint"
        on-tap="_editDetailsButtonTap"
        title="Edit page details"
      ></paper-fab>
      <paper-fab
        id="deletebutton"
        icon="icons:delete"
        on-tap="_deleteButtonTap"
        title="Delete current page"
      ></paper-fab>
      <div class="wrapper">
        <div class="active-title">[[activeTitle]]</div>
        <paper-icon-button
          id="addbutton"
          icon="icons:add"
          on-tap="_addButtonTap"
          title="Add new page"
        ></paper-icon-button>
        <paper-icon-button
          id="outlinebutton"
          icon="icons:list"
          on-tap="_outlineButtonTap"
          title="Edit site outline"
        ></paper-icon-button>
        <paper-icon-button
          id="manifestbutton"
          icon="icons:settings"
          on-tap="_manifestButtonTap"
          title="Edit site settings"
        ></paper-icon-button>
      </div>
      <paper-tooltip for="menubutton" position="top" offset="14"
        >Menu</paper-tooltip
      >
      <paper-tooltip for="cancelbutton" position="top" offset="14"
        >Cancel</paper-tooltip
      >
      <paper-tooltip for="editbutton" position="top" offset="14"
        >[[__editText]]</paper-tooltip
      >
      <paper-tooltip for="editdetails" position="top" offset="14"
        >Details</paper-tooltip
      >
      <paper-tooltip for="deletebutton" position="top" offset="14"
        >Delete</paper-tooltip
      >
      <paper-tooltip for="addbutton" position="top" offset="14"
        >Add</paper-tooltip
      >
      <paper-tooltip for="outlinebutton" position="top" offset="14"
        >Outline</paper-tooltip
      >
      <paper-tooltip for="manifestbutton" position="top" offset="14"
        >Site details</paper-tooltip
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
       * if the menu is open or not
       */
      menuMode: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
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
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    afterNextRender(this, function() {
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
  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
    this.editMode = !this.editMode;
    window.cmsSiteEditor.instance.haxCmsSiteEditorElement.editMode = this.editMode;
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
  /**
   * toggle menu state
   */
  _menuButtonTap(e) {
    this.menuMode = !this.menuMode;
  }
  _cancelButtonTap(e) {
    this.editMode = false;
    window.cmsSiteEditor.instance.haxCmsSiteEditorElement.editMode = false;
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
    b1.raised = true;
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
        clone: false
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
    b1.raised = true;
    b1.appendChild(document.createTextNode("Confirm"));
    b1.style.color = "white";
    b1.style.backgroundColor = "#ee0000";
    b1.addEventListener("tap", this._deleteActive.bind(this));
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
        clone: false
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
        clone: false
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e) {
    if (!this.__manifestEditor) {
      this.__manifestEditor = document.createElement(
        "haxcms-manifest-editor-dialog"
      );
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: store.routerManifest.title + ": site details",
        elements: { content: this.__manifestEditor },
        invokedBy: this.$.manifestbutton,
        clone: false
      }
    });
    window.dispatchEvent(evt);
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
      this.dispatchEvent(
        new CustomEvent("haxcms-edit-mode-changed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: newValue
        })
      );
      window.HaxStore.write("editMode", newValue, this);
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
