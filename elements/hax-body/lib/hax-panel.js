import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./simple-colors-picker.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-panel-item.js";
import "./hax-preferences-dialog.js";
import "./hax-stax-picker.js";
import "./hax-blox-picker.js";
/**
`hax-panel`
A LRN element that provides a panel / pallet of options to choose from.
This is intended to be placed in a larger system for creating content quickly
as the events being bubbled up include HTML nodes to inject into something

* @demo demo/index.html

@microcopy - the mental model for this element
 - panel - the flyout from left or right side that has elements that can be placed
 - element - buttons on the panel which when pressed will trigger an event

*/
Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: block;
        position: absolute;
        z-index: 1000000;
      }
      app-drawer {
        z-index: 100001;
        height: 64px;
        left: 0;
        top: 0;
        touch-action: auto;
        visibility: hidden;
        opacity: 0;
        display: flex;
        --app-drawer-width: 100%;
        --app-drawer-content-container: {
          --app-drawer-content-container_-_height: 64px;
          --app-drawer-content-container_-_padding: 0;
          width: 100%;
          left: 0;
          right: 0;
          background-color: #2e2e2e;
          padding: unset;
          display: flex;
          touch-action: auto;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          white-space: nowrap;
        }
      }
      :host([align="right"]) app-drawer {
        right: 0;
        left: unset;
      }
      :host([edit-mode]) app-drawer {
        visibility: visible;
        transition: 0.6s ease opacity;
        opacity: 0.9;
        right: 0;
        left: 0;
        top: 0;
      }
      app-drawer[opened]:hover {
        opacity: 1;
      }
      #button {
        position: fixed;
        top: 0;
        left: 0;
        visibility: visible;
        z-index: 10000;
        margin-left: 0;
        transition: all 0;
        opacity: 0.9;
        border-radius: 50%;
      }
      :host([edit-mode]) #button {
        visibility: hidden;
        opacity: 0;
        transition: all 0.8s ease;
      }
      #button:hover {
        opacity: 1;
      }
      :host([align="right"]) #button {
        right: 0;
        left: unset;
      }
      @media screen and (max-width: 550px) {
        app-drawer {
          height: 40px;
        }
      }
    </style>
    <div hidden$="[[hidePanelOps]]">
      <hax-panel-item
        light="[[light]]"
        data-opened$="[[editMode]]"
        on-tap="_clickEditButton"
        icon="create"
        id="button"
        edged="[[align]]"
        label="[[__tipText]]"
      ></hax-panel-item>
    </div>
    <app-drawer
      id="drawer"
      opened="{{editMode}}"
      disable-swipe
      persistent
      transition-duration="800"
      align="[[align]]"
    >
      <hax-panel-item
        hidden$="[[hidePanelOps]]"
        on-tap="_clickSaveButton"
        icon="save"
        id="haxsavebutton"
        label="[[__tipText]]"
        event-name="save"
        voice-command="save content"
      ></hax-panel-item>
      <hax-panel-item
        icon="image:add-to-photos"
        icon-class="amber-text"
        label="Add"
        event-name="hax-manager-open"
        value="0"
      ></hax-panel-item>
      <hax-panel-item
        icon="search"
        icon-class="amber-text"
        label="Find"
        event-name="hax-manager-open"
        value="1"
      ></hax-panel-item>
      <hax-panel-item
        icon="hardware:toys"
        icon-class="amber-text"
        label="Make"
        event-name="hax-manager-open"
        value="2"
      ></hax-panel-item>
      <hax-panel-item
        icon="view-quilt"
        icon-class="amber-text"
        label="Layouts"
        event-name="hax-blox-picker-open"
        voice-command="insert block"
      ></hax-panel-item>
      <hax-panel-item
        icon="view-agenda"
        icon-class="amber-text"
        label="Templates"
        event-name="hax-stax-picker-open"
        voice-command="insert stack"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:text-fields"
        icon-class="light-blue-text"
        label="Text"
        event-name="text"
        voice-command="insert text"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:title"
        icon-class="light-blue-text"
        label="Heading"
        event-name="header"
        voice-command="insert heading"
      ></hax-panel-item>
      <hax-panel-item
        icon="image:transform"
        icon-class="light-blue-text"
        label="Placeholder"
        event-name="placeholder"
        voice-command="insert placeholder"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:space-bar"
        icon-class="light-blue-text text-darken-1"
        label="Divider"
        event-name="divider"
        voice-command="insert divider"
      ></hax-panel-item>
      <slot></slot>
      <hax-panel-item
        hidden$="[[hidePreferencesButton]]"
        on-tap="_preferencesDialog"
        icon="settings"
        label="Preferences"
      ></hax-panel-item>
      <hax-panel-item
        hidden$="[[hideExportButton]]"
        on-tap="_htmlExportDialog"
        icon="code"
        label="Export"
      ></hax-panel-item>
      <hax-panel-item
        hidden$="[[hidePanelOps]]"
        icon="cancel"
        id="haxcancelbutton"
        label="Cancel"
        event-name="cancel"
        voice-command="cancel hax"
      ></hax-panel-item>
    </app-drawer>
    <hax-stax-picker></hax-stax-picker>
    <hax-blox-picker></hax-blox-picker>
    <hax-preferences-dialog></hax-preferences-dialog>
  `,

  is: "hax-panel",

  listeners: {
    "hax-item-selected": "_processItemEvent"
  },

  observers: ["_globalPreferencesChanged(globalPreferences.*)"],

  properties: {
    /**
     * Light variant for save button
     */
    light: {
      type: Boolean
    },
    /**
     * Display to the right corner instead of the left (default)
     */
    align: {
      type: String,
      reflectToAttribute: true,
      value: "left"
    },
    /**
     * State of the panel
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_editModeChanged"
    },
    /**
     * Showing export area.
     */
    hideExportButton: {
      type: Boolean,
      value: false
    },
    /**
     * Show developer mode
     */
    haxDeveloperMode: {
      type: Boolean,
      value: false
    },
    /**
     * Showing preferences area.
     */
    hidePreferencesButton: {
      type: Boolean,
      value: false
    },
    /**
     * Showing button area at all a well as internal
     * state managing buttons like cancel and save
     */
    hidePanelOps: {
      type: Boolean,
      value: false
    },
    /**
     * Global preferences for HAX overall
     */
    globalPreferences: {
      type: Object
    }
  },

  /**
   * Created life cycle.
   */
  ready: function() {
    document.body.appendChild(this);
  },

  /**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */
  attached: function() {
    this.fire("hax-register-panel", this);
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-panel-operation",
      this._processItemEvent.bind(this)
    );
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.removeEventListener(
      "hax-panel-operation",
      this._processItemEvent.bind(this)
    );
  },

  /**
   * Global preference changed.
   */
  _globalPreferencesChanged: function(value) {
    if (typeof value !== typeof undefined) {
      if (
        value.value != null &&
        typeof value.value.haxShowExportButton !== typeof undefined
      ) {
        this.hideExportButton = !value.value.haxShowExportButton;
      }
      if (
        value.value != null &&
        typeof value.value.haxDeveloperMode !== typeof undefined
      ) {
        this.haxDeveloperMode = value.value.haxDeveloperMode;
      }
    }
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Process event for simple content inserts.
   */
  _processItemEvent: function(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "open-panel":
        this._clickButton();
        break;
      case "cancel":
        this.toggle();
        this.fire("hax-cancel", detail);
        break;
      case "text":
        detail.tag = "p";
        detail.content = "";
        this.fire("hax-insert-content", detail);
        break;
      case "divider":
        detail.tag = "hr";
        detail.content = "";
        detail.properties = {
          style: "width:100%;"
        };
        this.fire("hax-insert-content", detail);
        break;
      case "header":
        detail.tag = "h2";
        detail.content = "Header";
        this.fire("hax-insert-content", detail);
        break;
      case "placeholder":
        detail.tag = "place-holder";
        detail.content = "";
        detail.properties = {
          style: "width:50%;"
        };
        this.fire("hax-insert-content", detail);
        break;
      case "image":
        detail.tag = "img";
        detail.content = "";
        detail.properties = {
          src:
            pathFromUrl(import.meta.url) +
            window.HaxStore.instance.defaults.image.src,
          alt: window.HaxStore.instance.defaults.image.alt,
          style: "width:100%;"
        };
        this.fire("hax-insert-content", detail);
        break;
      case "iframe":
        detail.tag = "iframe";
        detail.content = "";
        detail.properties = {
          src: window.HaxStore.instance.defaults.iframe.src,
          height: "400px",
          width: "100%",
          style: "width:100%;"
        };
        this.fire("hax-insert-content", detail);
        break;
      case "blockquote":
        detail.tag = "blockquote";
        detail.content = "";
        this.fire("hax-insert-content", detail);
        break;
      case "hax-manager-open":
        window.HaxStore.write("activeHaxElement", {}, this);
        window.HaxStore.instance.haxManager.resetManager(
          parseInt(detail.value)
        );
        window.HaxStore.instance.haxManager.toggleDialog(false);
        break;
      case "hax-stax-picker-open":
        window.HaxStore.instance.haxStaxPicker.toggleDialog();
        break;
      case "hax-blox-picker-open":
        window.HaxStore.instance.haxBloxPicker.toggleDialog();
        break;
      case "undo":
        document.execCommand("undo");
        break;
      case "redo":
        document.execCommand("redo");
        break;
      default:
        // we sit on this, something else will have to handle it
        break;
    }
  },

  /**
   * _editModeChanged
   */
  _editModeChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue) {
      this.__tipText = "Save";
      this.$.button.icon = "save";
    } else {
      this.__tipText = "Edit";
      this.$.button.icon = "create";
    }
  },

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickEditButton: function(e) {
    this.toggle();
  },

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickSaveButton: function(e) {
    this.toggle();
    this.fire("hax-save", e.detail);
  },

  /**
   * HTML Export trigger.
   */
  _htmlExportDialog: function(e) {
    window.HaxStore.instance.haxExport.toggleDialog();
  },

  /**
   * Preferences trigger.
   */
  _preferencesDialog: function(e) {
    window.HaxStore.instance.haxPreferences.toggleDialog();
  },

  /**
   * Toggle the panel.
   */
  toggle: function(e) {
    window.HaxStore.write("editMode", !this.editMode, this);
    this.$.drawer.opened = this.editMode;
    if (!this.$.drawer.opened) {
      window.HaxStore.instance.closeAllDrawers();
    }
  }
});
