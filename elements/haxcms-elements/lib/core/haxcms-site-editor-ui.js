import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-fab/paper-fab.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "./haxcms-outline-editor-dialog.js";
import "./haxcms-manifest-editor-dialog.js";
import { store } from "./haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: fixed;
        right: 0;
        bottom: 0;
        opacity: 0.6;
        transition: 0.6s all ease-in-out;
        background-color: var(--haxcms-color, rgba(255, 0, 116, 1));
        padding: 0px 10px;
        border-top-left-radius: 10px;
        border-left: 2px solid black;
        border-top: 2px solid black;
        min-width: 84px;
        width: 90px;
        line-height: 50px;
        height: 50px;
        z-index: 10000;
        visibility: visible;
      }
      :host([edit-mode]) {
        min-width: 126px;
      }
      :host *[hidden] {
        display: none;
      }
      paper-fab {
        display: inline-flex;
        width: 40px;
        height: 40px;
        vertical-align: middle;
        line-height: 40px;
        background-color: black;
        color: var(--haxcms-color, rgba(255, 0, 116, 1));
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
        width: 40px;
        min-width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 5px 2px 0 2px;
        background-color: rgba(0, 0, 0, 0.2);
        transition: 0.3s all ease-in-out;
        @apply --shadow-elevation-8dp;
      }
      paper-icon-button:hover,
      paper-icon-button:focus,
      paper-icon-button:active {
        background-color: rgba(0, 0, 0, 0.4);
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
        width: 50px;
        z-index: 1001;
        border-radius: 0;
        margin: 0;
        padding: 0;
        color: white;
        background-color: var(--paper-blue-500, blue) !important;
        position: absolute;
        height: 50px;
      }
      .wrapper {
        width: 0px;
        height: 50px;
        line-height: 50px;
        color: black;
        display: inline-flex;
        transition: 0.3s all ease-in-out;
        overflow: hidden;
        padding: 0;
        margin: 0;
        vertical-align: top;
      }
      :host([menu-mode]) .wrapper {
        width: 275px;
      }
      :host([menu-mode]) {
        opacity: 0.8;
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
      .main-title {
        font-size: 11px;
        font-weight: bold;
        width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 50px;
        padding: 0 10px;
      }
    </style>
    <paper-fab
      id="menubutton"
      icon="icons:menu"
      on-tap="_menuButtonTap"
      aria-label="Expand menu"
    ></paper-fab>
    <paper-fab
      id="cancelbutton"
      icon="icons:cancel"
      on-tap="_cancelButtonTap"
      hidden$="[[!editMode]]"
      aria-label="Cancel editing"
    ></paper-fab>
    <paper-fab
      id="editbutton"
      icon="[[__editIcon]]"
      on-tap="_editButtonTap"
      aria-label$="[[__editText]]"
    ></paper-fab>
    <paper-fab
      id="editdetails"
      icon="icons:fingerprint"
      on-tap="_editDetailsButtonTap"
      aria-label$="Edit page details"
    ></paper-fab>
    <paper-fab
      id="deletebutton"
      icon="icons:delete"
      on-tap="_deleteButtonTap"
      aria-label="Delete current page"
    ></paper-fab>
    <div class="wrapper">
      <div class="main-title">[[activeItem.title]]</div>
      <paper-icon-button
        id="addbutton"
        icon="icons:add"
        on-tap="_addButtonTap"
        aria-label="Add new page"
      ></paper-icon-button>
      <paper-icon-button
        id="outlinebutton"
        icon="icons:list"
        on-tap="_outlineButtonTap"
        aria-label="Edit site outline"
      ></paper-icon-button>
      <paper-icon-button
        id="manifestbutton"
        icon="icons:settings"
        on-tap="_manifestButtonTap"
        aria-label="Edit site settings"
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
  `,
  is: "haxcms-site-editor-ui",
  properties: {
    /**
     * small visual lock that events break on initial paint
     */
    painting: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    /**
     * Active item of the page being worked on, JSON outline schema item format
     */
    activeItem: {
      type: Object,
      observer: "_activeItemChanged"
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
      value: false
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
    }
  },
  attached: function() {
    afterNextRender(this, function() {
      this.__disposer = autorun(() => {
        this.manifest = toJS(store.routerManifest);
      });
    });
  },
  detached: function() {
    this.__disposer();
  },
  /**
   * active item changed
   */
  _activeItemChanged: function(newValue, oldValue) {
    if (newValue.id) {
      this.pageAllowed = true;
    } else {
      this.pageAllowed = false;
    }
  },

  /**
   * toggle state on button tap
   */
  _editButtonTap: function(e) {
    this.editMode = !this.editMode;
    window.cmsSiteEditor.instance.haxCmsSiteEditorElement.editMode = this.editMode;
    // save button shifted to edit
    if (!this.editMode) {
      this.fire("haxcms-save-page", this.activeItem);
    }
  },
  _editDetailsButtonTap: function(e) {
    this.__newForm = document.createElement("eco-json-schema-object");
    let outline = window.JSONOutlineSchema.requestAvailability();
    // get a prototype schema for an item
    this.__newForm.schema = outline.getItemSchema("item");
    // drop things we don't care about
    delete this.__newForm.schema.properties.id;
    delete this.__newForm.schema.properties.description;
    delete this.__newForm.schema.properties.order;
    delete this.__newForm.schema.properties.parent;
    delete this.__newForm.schema.properties.metadata;
    delete this.__newForm.schema.properties.details;
    delete this.__newForm.schema.properties.indent;
    for (var n in this.activeItem) {
      if (typeof this.__newForm.schema.properties[n] !== "undefined") {
        if (n === "location") {
          this.__newForm.schema.properties[n].value = this.activeItem[n]
            .replace("pages/", "")
            .replace("/index.html", "");
        } else {
          this.__newForm.schema.properties[n].value = this.activeItem[n];
        }
      }
    }
    let b1 = document.createElement("paper-button");
    b1.raised = true;
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:save";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Update page"));
    b1.style.backgroundColor = document.body.style.getPropertyValue(
      "--haxcms-color"
    );
    // store reference to the form
    b1.__form = this.__newForm;
    b1.addEventListener("click", this._updateItem.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: this.activeItem.title + ": edit details",
        elements: { content: this.__newForm, buttons: b },
        invokedBy: this.$.editdetails,
        clone: false
      }
    });
    window.dispatchEvent(evt);
  },
  /**
   * toggle menu state
   */
  _menuButtonTap: function(e) {
    this.menuMode = !this.menuMode;
  },
  _cancelButtonTap: function(e) {
    this.editMode = false;
    window.cmsSiteEditor.instance.haxCmsSiteEditorElement.editMode = false;
    this.fire("hax-cancel", e.detail);
  },
  /**
   * Add button hit
   * @todo simplify this to just what's needed; no crazy options
   */
  _addButtonTap: function(e) {
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
    b1.appendChild(document.createTextNode("Create page"));
    b1.addEventListener("click", this._createNewItem.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: "Add a new page",
        elements: { content: this.__newForm, buttons: b },
        invokedBy: this.$.addbutton,
        clone: false
      }
    });
    window.dispatchEvent(evt);
  },
  /**
   * create new item
   */
  _createNewItem: function(e) {
    const evt = new CustomEvent("haxcms-create-page", {
      bubbles: true,
      cancelable: false,
      detail: {
        values: this.__newForm.value
      }
    });
    this.dispatchEvent(evt);
  },
  /**
   * Fire item
   */
  _updateItem: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var values;
    if (!local.__form) {
      values = local.parentNode.__form.value;
    } else {
      values = local.__form.value;
    }
    values.id = this.activeItem.id;
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-page-details", {
        bubbles: true,
        cancelable: true,
        detail: values
      })
    );
    // fire event to close the modal
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {}
      })
    );
  },
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap: function(e) {
    let c = document.createElement("span");
    c.innerHTML = `"${
      this.activeItem.title
    }" will be removed from the outline but its content stays on the file system.`;
    let b1 = document.createElement("paper-button");
    b1.raised = true;
    b1.appendChild(document.createTextNode("Confirm"));
    b1.addEventListener("tap", this._deleteActive.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: "Are you sure you want to delete this page?",
        elements: { content: c, buttons: b },
        invokedBy: this.$.deletebutton,
        clone: false
      }
    });
    window.dispatchEvent(evt);
  },
  /**
   * delete active item
   */
  _deleteActive: function(e) {
    const evt = new CustomEvent("haxcms-delete-page", {
      bubbles: true,
      cancelable: false,
      detail: {
        item: this.activeItem
      }
    });
    this.dispatchEvent(evt);
  },
  /**
   * toggle state on button tap
   */
  _outlineButtonTap: function(e) {
    let c = document.createElement("haxcms-outline-editor-dialog");
    c.set(
      "manifest",
      window.cmsSiteEditor.instance.haxCmsSiteEditorElement.manifest
    );
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: "Edit site outline",
        elements: { content: c },
        invokedBy: this.$.outlinebutton,
        clone: false
      }
    });
    window.dispatchEvent(evt);
  },

  /**
   * toggle state on button tap
   */
  _manifestButtonTap: function(e) {
    if (!this.__manifestEditor) {
      this.__manifestEditor = document.createElement(
        "haxcms-manifest-editor-dialog"
      );
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: this.manifest.title + ": site details",
        elements: { content: this.__manifestEditor },
        invokedBy: this.$.manifestbutton,
        clone: false
      }
    });
    window.dispatchEvent(evt);
  },
  /**
   * Edit state has changed.
   */
  _editModeChanged: function(newValue, oldValue) {
    if (newValue) {
      // enable it some how
      this.__editIcon = "icons:save";
      this.__editText = "Save";
    } else {
      // disable it some how
      this.__editIcon = "editor:mode-edit";
      this.__editText = "Edit";
    }
    this.fire("haxcms-edit-mode-changed", newValue);
    window.HaxStore.write("editMode", newValue, this);
  },

  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged: function(newValue, oldValue) {
    this.fire("haxcms-outline-edit-mode-changed", newValue);
  },

  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged: function(newValue, oldValue) {
    this.fire("haxcms-manifest-edit-mode-changed", newValue);
  }
});
