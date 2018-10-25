import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/editor-icons.js";
/**
`haxcms-site-editor-ui`
haxcms editor element buttons that you see

@demo demo/index.html

@microcopy - the mental model for this element

*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      paper-fab {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 16px;
        padding: 2px;
        width: 40px;
        height: 40px;
        visibility: hidden;
        opacity: 0;
        z-index: 1000;
        background-color: var(--haxcms-color, #ff4081);
        transition: all .6s linear;
      }
      :host[page-allowed] #editbutton,
      :host[outline-allowed] #outlinebutton,
      :host[outline-allowed] #manifestbutton {
        visibility: visible;
        opacity: 1;
      }
      #editbutton {
        right: 92px;
      }
      #outlinebutton {
        right: 46px;
      }
      #manifestbutton {
        right: 0px;
      }
      :host[edit-mode] #editbutton {
        width: 100%;
        z-index: 100;
        right: 0;
        bottom: 0;
        border-radius: 0;
        height: 80px;
        margin: 0;
        padding: 8px;
        background-color: var(--paper-blue-500) !important;
      }
    </style>    
    <paper-fab id="editbutton" icon="[[__editIcon]]"></paper-fab>
    <paper-tooltip for="editbutton" position="top" offset="14">[[__editText]]</paper-tooltip>
    <paper-fab id="manifestbutton" icon="icons:settings"></paper-fab>
    <paper-tooltip for="manifestbutton" position="top" offset="14">site details</paper-tooltip>
    <paper-fab id="outlinebutton" icon="icons:list"></paper-fab>
    <paper-tooltip for="outlinebutton" position="top" offset="14">edit outline</paper-tooltip>
`,

  is: "haxcms-site-editor-ui",

  listeners: {
    "editbutton.tap": "_editButtonTap",
    "outlinebutton.tap": "_outlineButtonTap",
    "manifestbutton.tap": "_manifestButtonTap"
  },

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
      type: Object
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
     * outline allowed
     */
    outlineAllowed: {
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
     * Outline editing state
     */
    outlineEditMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_outlineEditModeChanged",
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
    }
  },

  /**
   * active item changed
   */
  _activeItemChanged: function(newValue, oldValue) {
    if (newValue.id) {
      this.pageAllowed = true;
      this.outlineAllowed = false;
    } else {
      this.pageAllowed = false;
      this.outlineAllowed = true;
    }
  },

  /**
   * toggle state on button tap
   */
  _editButtonTap: function(e) {
    this.editMode = !this.editMode;
  },

  /**
   * toggle state on button tap
   */
  _outlineButtonTap: function(e) {
    this.outlineEditMode = !this.outlineEditMode;
  },

  /**
   * toggle state on button tap
   */
  _manifestButtonTap: function(e) {
    this.manifestEditMode = !this.manifestEditMode;
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
