import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";

/**
 * `hax-tray`
 * `The tray / dashboard area which allows for customization of all major settings`
 * @customElement hax-tray
 */
class HaxTray extends winEventsElement(LitElement) {
  /**
   * Convention we use
   */
  static get tag() {
    return 'hax-tray';
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
      "hax-active-hover-name": "_activeNameChange",
    };
    this.activeOperationName = "";
    this.canUndo = true;
    this.canRedo = true;
    this.elementAlign = "right";
    this.__setup = false;
    // @todo tie into mobx store
    this.activeItem = null;
    setTimeout(() => {
      import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");
      import("./hax-tray-button.js");
      import("./hax-tray-upload.js");
      this.addEventListener(
        "hax-tray-button-click",
        this._processTrayEvent.bind(this)
      );
      // @todo stage collapse and remove these as we can
      import("./hax-gizmo-browser.js");
      import("./hax-app-browser.js");
      import("./hax-blox-browser.js");
      import("./hax-stax-browser.js");
    }, 0);
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
      if (e.detail.property === "globalPreferences" || e.detail.property === "activeNode") {
        this[e.detail.property] = {};
      }
      this[e.detail.property] = e.detail.value;
    }
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        
        :host .wrapper {
          color: var(--hax-color-text, black);
          z-index: 1000000;
          position: fixed;
          top: 0;
          bottom: 0;
          background-color: white;
          font-size: 20px;
          width: 30vw;
          border-left: 2px solid var(--hax-color-text, black);
          transition: .2s right linear, .2s opacity linear, .2s visibility linear;
          opacity: 0;
          visibility: hidden;
          right: -60vw;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          right: 0;
        }
        a11y-collapse,
        a11y-collapse-group,
        hax-app-browser,
        hax-gizmo-browser {
          transition: .3s all linear;
          opacity: 1;
          visibility: visible;
        }
        a11y-collapse:not(:defined),
        a11y-collapse-group:not(:defined),
        hax-app-browser:not(:defined),
        hax-gizmo-browser:not(:defined) {
          opacity: 0;
          visibility: hidden;
        }
        a11y-collapse-group {
          font-size: 14px;
          margin: 0;
        }
        a11y-collapse {
          overflow: auto;
          --a11y-collapse-padding-top: 4px;
          --a11y-collapse-padding-right: 8px;
          --a11y-collapse-padding-bottom: 4px;
          --a11y-collapse-padding-left: 8px;
        }
        a11y-collapse[expanded] {
          min-height: 300px;
          max-height: 70vh;
        }
        iron-icon {
          margin-right: 8px;
        }
        .quick-buttons {
          display: flex;
          background-color: black;
          justify-content: space-between;
        }
        .quick-buttons .ops {
          display: flex;
          justify-content: flex-start;
        }
        .quick-buttons .quick {
          display: flex;
          justify-content: flex-end;
        }
        p[slot="heading"] {
          margin: 8px 0;
          padding: 0;
        }
        :host([element-align="right"]) #button {
          right: 0;
        }
        :host([element-align="left"]) #button {
          left: 0;
        }

        #button {
          position: fixed;
          top: 0;
          visibility: visible;
          z-index: 10000;
          transition: all 0.3s ease;
          margin: 0;
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
        .active-op-name {
          display: inline-flex;
          vertical-align: text-bottom;
          padding: 8px;
          font-size: 11px;
          overflow: hidden;
          text-align: center;
          color: white;
        }
        @media screen and (max-width: 600px) {
          :host([edit-mode]) .hide-small {
            display: none;
          }
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
     ${this.hidePanelOps ? `` : html`
     <hax-tray-button
        .data-opened="${this.editMode}"
        @click="${this._clickEditButton}"
        icon="create"
        id="button"
        accent-color="black"
        label="${this.__tipText}"
      ></hax-tray-button>
      `}
    <div class="wrapper">
      <div class="quick-buttons">
        <div class="ops">
          <hax-tray-button
            mini
            ?hidden="${this.hidePanelOps}"
            @click="${this._clickSaveButton}"
            icon="save"
            id="haxsavebutton"
            label="${this.__tipText}"
            accent-color="green"
            event-name="save"
            voice-command="save content"
          ></hax-tray-button>
          <hax-tray-button
            mini
            ?hidden="${this.hidePanelOps}"
            icon="cancel"
            id="haxcancelbutton"
            label="Cancel"
            event-name="cancel"
            accent-color="red"
            voice-command="cancel"
          ></hax-tray-button>
          <div class="active-op-name">${this.activeOperationName}</div>
        </div>
        <div class="quick">
        <hax-tray-button
          mini
          icon="hax:paragraph"
          label="Insert paragraph"
          event-name="insert-tag"
          event-data="p"
          voice-command="insert (text)(paragraph)"
          class="hide-small"
        ></hax-tray-button>
        <hax-tray-button
          mini
          icon="hax:hr"
          label="Insert horizontal line"
          event-name="divider"
          voice-command="insert horizontal line"
          class="hide-small"
        ></hax-tray-button>
        <hax-tray-button
          mini
          ?hidden="${this.hideExportButton}"
          event-name="open-export-dialog"
          icon="code"
          label="View page source"
          voice-command="view (page) source"
        ></hax-tray-button>
        <slot></slot>
        <hax-tray-button
          mini
          icon="icons:undo"
          ?disabled="${!this.canUndo}"
          label="Undo previous action"
          event-name="undo"
          voice-command="undo"
          class="hide-small"
        ></hax-tray-button>
        <hax-tray-button
          mini
          icon="icons:redo"
          ?disabled="${!this.canRedo}"
          label="Redo previous action"
          event-name="redo"
          voice-command="redo"
          class="hide-small"
        ></hax-tray-button>
        <hax-tray-button
          mini
          ?hidden="${this.hidePreferencesButton}"
          event-name="open-preferences-dialog"
          icon="settings"
          label="Editor preferences"
          voice-command="open (editor) preferences"
        ></hax-tray-button>
        </div>
      </div>
      <a11y-collapse-group>
        <a11y-collapse accordion ?disabled="${!this.hasSettings}">
          <p slot="heading"><iron-icon icon="icons:settings"></iron-icon> ${this.activeTagName} Settings</p>
          <div slot="content"></div>
        </a11y-collapse>
        <a11y-collapse accordion>
          <p slot="heading"><iron-icon icon="icons:add"></iron-icon> Add Content</p>
          <div slot="content">
            <hax-tray-upload></hax-tray-upload>
            <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
          </div>
        </a11y-collapse>
        <a11y-collapse accordion>
          <p slot="heading"><iron-icon icon="icons:search"></iron-icon> Search</p>
          <div slot="content">
            <hax-app-browser id="appbrowser">
              <slot></slot>
            </hax-app-browser>
          </div>
        </a11y-collapse>
        <a11y-collapse accordion>
          <p slot="heading"><iron-icon icon="hax:templates"></iron-icon>Templates</p>
          <div slot="content">
          
          </div>
        </a11y-collapse>
      </a11y-collapse-group>
    </div>
    `;
  }
  /**
   * Process event for simple content inserts.
   */
  _processTrayEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "insert-tag":
        let gizmo = {
          tag: detail.value,
        };
        // most likely empty values but just to be safe
        let element = window.HaxStore.haxElementPrototype(gizmo);
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: element
          })
        );
      break;
      case "open-preferences-dialog":
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxPreferences,
          this
        );
        break;
      case "open-export-dialog":
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxExport,
          this
        );
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
      case "hax-manager-open":
        window.HaxStore.write("activeHaxElement", {}, this);
        window.HaxStore.instance.haxManager.resetManager(
          parseInt(detail.value)
        );
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxManager,
          this
        );
        break;
      case "undo":
        document.execCommand("undo");
        break;
      case "redo":
        document.execCommand("redo");
        break;
        case "cancel":
          window.HaxStore.write("editMode", false, this);
          this.dispatchEvent(
            new CustomEvent("hax-cancel", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: detail
            })
          );
          break;
      default:
        // we sit on this, something else will have to handle it
        break;
    }
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {...super.properties,
      __tipText: {
        type: String,
      },
      /**
       * Alignment of the initial edit button
       */
      elementAlign: {
        type: String,
        reflect: true,
        attribute: "element-align"
      },
      /**
       * active item name, useful to show users what they are working with
       */
      activeOperationName: {
        type: String
      },
       /**
       * Light variant for save button
       */
      light: {
        type: Boolean,
        reflect: true,
      },
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo"
      },
      hasSettings: {
        type: Boolean,
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo"
      },
      /**
       * If we're "dirty" meaning stackPosition and savePosition out of sync
       */
      isDirty: {
        type: Boolean,
        attribute: "is-dirty"
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
      },
      /**
       * Global active node so we know if we need to disable contextual settings
       */
      activeNode: {
        type: Object,
      },
      /**
       * Tag name / what to display based on active element
       */
      activeTagName: {
        type: String,
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
    };
  }
  /**
   * LitElement ready life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.__setup) {
      this.__setup = true;
      // fire an event that this is a core piece of the system
      this.dispatchEvent(
        new CustomEvent("hax-register-core-piece", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            piece: "haxTray",
            object: this
          }
        })
      );
      /**
       * @todo HACK. actually fix this when refactoring these elements
       */
      setTimeout(() => {
        this.shadowRoot.querySelector("#appbrowser").resetBrowser();
        this.shadowRoot.querySelector("#gizmobrowser").resetBrowser();          
      }, 2000);
    }
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
      }
      if (propName == "activeNode") {
        if (this.activeNode && this.activeNode.tagName) {
          this.hasSettings = true;
          if (this.activeNode.getAttribute("data-hax-ray") != null) {
            this.activeTagName = this.activeNode.getAttribute("data-hax-ray");
          }
          else {
            this.activeTagName = this.activeNode.tagName;
          }
        }
        else {
          this.hasSettings = false;
        }
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesChanged(this[propName], oldValue);
      }
    });
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
   * active operation name changed
   */
  _activeNameChange(e) {
    this.activeOperationName = e.detail;
  }

  /**
   * Edit clicked, activate
   */
  _clickEditButton(e) {
    window.HaxStore.write("editMode", true, this);
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
    window.HaxStore.write("editMode", false, this);
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
}

window.customElements.define(HaxTray.tag, HaxTray);
export { HaxTray };