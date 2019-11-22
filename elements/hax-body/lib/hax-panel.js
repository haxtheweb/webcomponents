import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
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
class HaxPanel extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          position: absolute;
          z-index: 1000000;
        }
        :host *[hidden] {
          display: none;
        }
        iron-icon:not(:defined),
        hax-panel-item:not(:defined),
        app-drawer:not(:defined) {
          display: none;
        }
        app-drawer {
          z-index: 100001;
          height: 40px;
          padding: var(--hax-panel-padding, 8px 16px);
          left: 0;
          top: 0;
          align-items: center;
          touch-action: auto;
          visibility: hidden;
          opacity: 0;
          display: flex;
          --app-drawer-width: 100%;
        }
        hax-panel-item {
          margin: 8px 2px;
        }
        hax-panel-item[right] {
          float: right;
        }
        #haxcancelbutton {
          margin-right: 48px;
        }
        :host([edit-mode]) app-drawer {
          visibility: visible;
          transition: 0.3s ease opacity;
          opacity: 1;
          right: 0;
          left: 0;
          top: 0;
        }

        #button {
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          visibility: visible;
          z-index: 10000;
          transition: all 0.3s ease;
          margin: 0;
          border-top-left-radius: 0;
        }
        :host([edit-mode]) #button {
          visibility: hidden;
          opacity: 0;
        }
        #button:hover {
          opacity: 1;
        }
        :host([align="right"]) #button {
          right: 0;
          left: unset;
          border-top-right-radius: 0;
          border-top-left-radius: unset;
        }
        .active-op-name,
        .editing-mode-active {
          display: none;
        }
        :host([edit-mode]) .active-op-name {
          display: flex;
          top: 0;
          right: 0;
          z-index: 1000000;
          position: fixed;
          font-size: 14px;
          border-bottom: 1px solid black;
          border-left: 1px solid black;
          font-weight: bold;
          padding: 16px 28px 16px 16px;
          line-height: 24px;
          height: 23px;
          min-width: 120px;
          justify-content: space-evenly;
          color: var(--hax-color-menu-heading-bg, black);
          background-color: var(--hax-color-menu-heading-color, #eeeeee);
          vertical-align: middle;
        }
        :host([edit-mode]) .editing-mode-active {
          display: flex;
          font-size: 18px;
          margin-left: 100px;
          padding: 0 8px;
          font-weight: bold;
          color: var(--hax-color-menu-heading-bg, black);
          background-color: var(--hax-color-menu-heading-color, #eeeeee);
        }
        @media screen and (max-width: 600px) {
          :host([edit-mode]) .hide-small {
            display: none;
          }
        }
        @media screen and (max-width: 800px) {
          :host([edit-mode]) #haxcancelbutton {
            margin-right: 2px;
          }
          :host([edit-mode]) .editing-mode-active,
          :host([edit-mode]) .active-op-name {
            display: none;
          }
        }
      `
    ];
  }
  /**
   * HTMLElement specification
   */
  constructor() {
    super();
    this.align = "left";
    this.hideExportButton = false;
    this.haxDeveloperMode = false;
    this.editModeName = "You are editing content";
    this.hidePreferencesButton = false;
    this.hidePanelOps = false;
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/iron-icons/communication-icons.js");
    import("@polymer/iron-icons/social-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@lrnwebcomponents/hax-body/lib/hax-panel-item.js");
    import("@lrnwebcomponents/hax-iconset/hax-iconset.js");
    this.addEventListener(
      "hax-item-selected",
      this._processItemEvent.bind(this)
    );
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxPanel",
          object: this
        }
      })
    );
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-active-hover-name",
      this._activeNameChange.bind(this)
    );
    document.body.addEventListener(
      "hax-panel-operation",
      this._processItemEvent.bind(this)
    );
  }
  render() {
    return html`
      <custom-style>
        <style>
          app-drawer {
            --app-drawer-content-container: {
              align-items: center;
              width: 100%;
              left: 0;
              right: 0;
              background-color: var(--hax-color-bg);
              border-bottom: 1px solid black;
              padding: var(--hax-panel-padding, 0px 16px);
              display: flex;
              touch-action: auto;
              overflow-x: auto;
              overflow: visible !important;
              -webkit-overflow-scrolling: touch;
              white-space: nowrap;
            }
          }
        </style>
      </custom-style>
      <div ?hidden="${this.hidePanelOps}">
        <hax-panel-item
          dark
          large
          .data-opened="${this.editMode}"
          @click="${this._clickEditButton}"
          icon="create"
          id="button"
          label="${this.__tipText}"
        ></hax-panel-item>
      </div>
      <app-drawer
        id="drawer"
        ?opened="${this.editMode}"
        @opened-changed="${this.openedChanged}"
        disable-swipe
        persistent
        transition-duration="300"
      >
        <hax-panel-item
          ?hidden="${this.hidePanelOps}"
          @click="${this._clickSaveButton}"
          icon="save"
          id="haxsavebutton"
          label="${this.__tipText}"
          event-name="save"
          voice-command="save content"
        ></hax-panel-item>
        <hax-panel-item
          ?hidden="${this.hidePanelOps}"
          icon="cancel"
          id="haxcancelbutton"
          label="Cancel"
          event-name="cancel"
          voice-command="cancel"
        ></hax-panel-item>
        <hax-panel-item
          icon="icons:file-upload"
          label="Upload media"
          event-name="hax-manager-open"
          value="0"
          voice-command="(upload)(add) media"
        ></hax-panel-item>
        <hax-panel-item
          icon="search"
          label="Search for media"
          event-name="hax-manager-open"
          value="1"
          voice-command="(search)(find) media"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:add-brick"
          label="Create page element"
          event-name="hax-manager-open"
          voice-command="create (page) (element)(widget)"
          value="2"
        ></hax-panel-item>
        <hax-panel-item
          icon="icons:view-column"
          label="Insert layout"
          event-name="hax-blox-picker-open"
          voice-command="insert (page) layout"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:templates"
          label="Insert template"
          event-name="hax-stax-picker-open"
          voice-command="insert (page) template"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:paragraph"
          label="Insert paragraph"
          event-name="text"
          voice-command="insert (text)(paragraph)"
          class="hide-small"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:h2"
          label="Insert heading"
          event-name="header"
          voice-command="insert (header)(heading)"
          class="hide-small"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:hr"
          label="Insert horizontal line"
          event-name="divider"
          voice-command="insert (divider)(horizontal line)"
          class="hide-small"
        ></hax-panel-item>
        <hax-panel-item
          icon="hax:placeholder"
          label="Insert media placeholder"
          event-name="placeholder"
          voice-command="insert (image) placeholder"
          class="hide-small"
        ></hax-panel-item>
        <hax-panel-item
          ?hidden="${this.hideExportButton}"
          event-name="open-export-dialog"
          icon="code"
          label="View page source"
          voice-command="view (page) source"
        ></hax-panel-item>
        <slot></slot>
        <hax-panel-item
          right
          ?hidden="${this.hidePreferencesButton}"
          event-name="open-preferences-dialog"
          icon="settings"
          label="Editor preferences"
          voice-command="open (editor) preferences"
        ></hax-panel-item>
        <div class="editing-mode-active">${this.editModeName}</div>
      </app-drawer>
      <div class="active-op-name">${this.activeOperationName}</div>
    `;
  }

  static get tag() {
    return "hax-panel";
  }
  openedChanged(e) {
    this.editMode = e.detail.value;
  }
  static get properties() {
    return {
      /**
       * Light variant for save button
       */
      light: {
        type: Boolean
      },
      __tipText: {
        type: String
      },
      /**
       * Display to the right corner instead of the left (default)
       */
      align: {
        type: String,
        reflect: true
      },
      /**
       * State of the panel
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      },
      /**
       * Showing export area.
       */
      hideExportButton: {
        type: Boolean,
        reflect: true,
        attribute: "hide-export-button"
      },
      /**
       * Show developer mode
       */
      haxDeveloperMode: {
        type: Boolean,
        reflect: true,
        attribute: "hax-developer-mode"
      },
      /**
       * active item name, useful to show users what they are working with
       */
      activeOperationName: {
        type: String
      },
      /**
       * Say we are editing content
       */
      editModeName: {
        type: String
      },
      /**
       * Showing preferences area.
       */
      hidePreferencesButton: {
        type: Boolean,
        reflect: true,
        attribute: "hide-preferences-button"
      },
      /**
       * Showing button area at all a well as internal
       * state managing buttons like cancel and save
       */
      hidePanelOps: {
        type: Boolean,
        reflect: true,
        attribute: "hide-panel-ops"
      },
      /**
       * Global preferences for HAX overall
       */
      globalPreferences: {
        type: Object
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesChanged(this[propName], oldValue);
      }
    });
  }

  _activeNameChange(e) {
    this.activeOperationName = e.detail;
  }
  /**
   * Global preference changed.
   */
  _globalPreferencesChanged(newValue) {
    if (newValue && typeof newValue.haxShowExportButton !== typeof undefined) {
      this.hideExportButton = !newValue.haxShowExportButton;
    }
  }

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (e.detail.property === "globalPreferences") {
        this[e.detail.property] = {};
      }
      this[e.detail.property] = e.detail.value;
    }
  }
  /**
   * Process event for simple content inserts.
   */
  _processItemEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "open-panel":
        this._clickButton();
        break;
      case "cancel":
        this.toggle();
        this.dispatchEvent(
          new CustomEvent("hax-cancel", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
        break;
      case "text":
        detail.tag = "p";
        detail.content = "";
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
        break;
      case "open-preferences-dialog":
        window.HaxStore.instance.haxPreferences.toggleDialog();
        break;
      case "open-export-dialog":
        window.HaxStore.instance.haxExport.toggleDialog();
        break;
      case "divider":
        detail.tag = "hr";
        detail.content = "";
        detail.properties = {
          style: "width:100%;"
        };
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
        break;
      case "header":
        detail.tag = "h2";
        detail.content = "Header";
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
        break;
      case "placeholder":
        detail.tag = "place-holder";
        detail.content = "";
        detail.properties = {
          style: "width:50%;"
        };
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
        break;
      case "blockquote":
        detail.tag = "blockquote";
        detail.content = "";
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
          })
        );
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
  }

  /**
   * _editModeChanged
   */
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue) {
      this.__tipText = "Save content";
      this.shadowRoot.querySelector("#button").icon = "save";
    } else {
      this.__tipText = "Edit content";
      this.shadowRoot.querySelector("#button").icon = "create";
    }
  }

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickEditButton(e) {
    this.toggle();
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {}
      })
    );
  }

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickSaveButton(e) {
    this.toggle();
    this.dispatchEvent(
      new CustomEvent("hax-save", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail
      })
    );
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {}
      })
    );
  }

  /**
   * Toggle the panel.
   */
  toggle(e) {
    window.HaxStore.write("editMode", !this.editMode, this);
    this.shadowRoot.querySelector("#drawer").opened = this.editMode;
    if (!this.shadowRoot.querySelector("#drawer").opened) {
      window.HaxStore.instance.closeAllDrawers();
    }
  }
}

window.customElements.define(HaxPanel.tag, HaxPanel);
export { HaxPanel };
