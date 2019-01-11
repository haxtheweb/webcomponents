import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-fab/paper-fab.js";
import "./haxcms-outline-editor-dialog.js";
import "./haxcms-manifest-editor-dialog.js";
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        position: fixed;
        right: 0;
        bottom: 0;
      }
      paper-fab {
        display: inline-flex;
        margin: 0px;
        padding: 0px;
        width: 40px;
        height: 40px;
        z-index: 1000;
        background-color: var(--haxcms-color, #ff4081);
        transition: all 0.6s linear;
      }
      #editbutton,
      #deletebutton {
        visibility: hidden;
        opacity: 0;
      }
      :host([page-allowed]) #editbutton,
      :host([page-allowed]) #deletebutton {
        visibility: visible;
        opacity: 1;
      }
      :host([edit-mode]) #editbutton {
        width: 100%;
        z-index: 1001;
        border-radius: 0;
        height: 64px;
        margin: 0;
        padding: 8px;
        background-color: var(--paper-blue-500) !important;
        position: absolute;
      }
      .wrapper {
        width: 0px;
        height: 40px;
        opacity: 0.2;
        background-color: pink;
        color: black;
        transition: all 0.6s linear;
        display: inline-flex;
      }
      :host([menu-mode]) .wrapper {
        opacity: 0.6;
        width: auto;
      }
      :host([menu-mode]) .wrapper:hover,
      :host([menu-mode]) .wrapper:active,
      :host([menu-mode]) .wrapper:focus {
        opacity: 1;
      }
      .main-title {
        font-size: 10px;
        width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 40px;
      }
    </style>
    <paper-fab
      id="menubutton"
      icon="icons:menu"
      on-tap="_menuButtonTap"
    ></paper-fab>
    <paper-tooltip for="menubutton" position="top" offset="14"
      >toggle menu</paper-tooltip
    >
    <paper-fab
      id="editbutton"
      icon="[[__editIcon]]"
      on-tap="_editButtonTap"
    ></paper-fab>
    <paper-tooltip for="editbutton" position="top" offset="14"
      >[[__editText]]</paper-tooltip
    >
    <div class="wrapper">
      <paper-icon-button
        id="deletebutton"
        icon="icons:delete"
        on-tap="_deleteButtonTap"
      ></paper-icon-button>
      <paper-tooltip for="deletebutton" position="top" offset="14"
        >delete</paper-tooltip
      >
      <div class="main-title">[[activeItem.title]]</div>
      <paper-icon-button
        id="addbutton"
        icon="icons:add"
        on-tap="_addButtonTap"
      ></paper-icon-button>
      <paper-tooltip for="addbutton" position="top" offset="14"
        >add page</paper-tooltip
      >
      <paper-icon-button
        id="outlinebutton"
        icon="icons:list"
        on-tap="_outlineButtonTap"
      ></paper-icon-button>
      <paper-tooltip for="outlinebutton" position="top" offset="14"
        >site outline</paper-tooltip
      >
      <paper-icon-button
        id="manifestbutton"
        icon="icons:settings"
        on-tap="_manifestButtonTap"
      ></paper-icon-button>
      <paper-tooltip for="manifestbutton" position="top" offset="14"
        >site details</paper-tooltip
      >
    </div>
  `,
  is: "haxcms-site-editor-ui",
  properties: {
    /**
     * Active item of the page being worked on, JSON outline schema item format
     */
    activeItem: {
      type: Object,
      value: {},
      observer: "_activeItemChanged"
    },
    /**
     * Outline of items in json outline schema format
     */
    manifest: {
      type: Object,
      notify: true
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
  },
  /**
   * toggle menu state
   */
  _menuButtonTap: function(e) {
    this.menuMode = !this.menuMode;
  },

  /**
   * Add button hit
   */
  _addButtonTap: function(e) {
    this.__newForm = document.createElement("eco-json-schema-object");
    let outline = window.JSONOutlineSchema.requestAvailability();
    // get a prototype schema for an item
    this.__newForm.schema = outline.getItemSchema("item");
    // get values but assume what was passed in is the parent relationship
    this.__newForm.value = outline.getItemValues(null, this.activeItem);
    let b1 = document.createElement("paper-button");
    b1.raised = true;
    b1.appendChild(document.createTextNode("Create"));
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
    c.set("manifest", this.manifest);
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
    let c = document.createElement("haxcms-manifest-editor-dialog");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: false,
      detail: {
        title: "Edit site settings",
        elements: { content: c },
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
      this.__editText = "edit page";
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
