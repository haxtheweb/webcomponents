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
    return "hax-tray";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
      "hax-active-hover-name": "_activeNameChange"
    };
    this.formKey = "configure";
    this.activeValue = {
      settings: {
        configure: {},
        advanced: {}
      }
    };
    this.activeSchema = {};
    this.activeOperationName = "";
    this.canUndo = true;
    this.canRedo = true;
    this.elementAlign = "right";
    this.__setup = false;
    setTimeout(() => {
      import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");
      import("./hax-tray-button.js");
      import("@polymer/iron-icon/iron-icon.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/device-icons.js");
      import("@polymer/iron-icons/hardware-icons.js");
      import("@polymer/iron-icons/communication-icons.js");
      import("@polymer/iron-icons/social-icons.js");
      import("@polymer/iron-icons/av-icons.js");
      import("@polymer/iron-icons/maps-icons.js");
      import("@polymer/iron-icons/places-icons.js");
      import("@lrnwebcomponents/md-extra-icons/md-extra-icons.js");
      import("@lrnwebcomponents/hax-iconset/hax-iconset.js");
      import("./hax-tray-upload.js");
      import("@lrnwebcomponents/simple-fields/simple-fields.js");
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
      if (
        e.detail.property === "globalPreferences" ||
        e.detail.property === "activeNode"
      ) {
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
          transition: 0.2s right linear, 0.2s opacity linear,
            0.2s visibility linear;
          opacity: 0;
          visibility: hidden;
          right: -60vw;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          right: 0;
        }
        hax-tray-button,
        a11y-collapse,
        a11y-collapse-group,
        hax-app-browser,
        hax-gizmo-browser {
          transition: 0.2s all linear;
          opacity: 1;
          visibility: visible;
        }
        hax-tray-button:not(:defined),
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
          cursor: pointer;
          --a11y-collapse-padding-top: 0px;
          --a11y-collapse-padding-right: 0px;
          --a11y-collapse-padding-bottom: 0px;
          --a11y-collapse-padding-left: 0px;
        }
        a11y-collapse.settings-form div[slot="content"] {
          padding: 0;
          margin: 0;
        }
        a11y-collapse[expanded] div[slot="content"] {
          min-height: 300px;
          max-height: 70vh;
          overflow: auto;
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
          padding: 4px 8px;
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
      ${this.hidePanelOps
        ? ``
        : html`
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
          <a11y-collapse
            class="settings-form"
            accordion
            ?disabled="${!this.hasSettings}"
          >
            <p slot="heading">
              <iron-icon icon="icons:settings"></iron-icon> ${this
                .activeTagName}
              Settings
            </p>
            <div slot="content">
              <simple-fields
                id="settingsform"
                @value-changed="${this.__valueChangedEvent}"
              ></simple-fields>
            </div>
          </a11y-collapse>
          <a11y-collapse accordion @click="${this._gizmoBrowserRefresh}">
            <p slot="heading">
              <iron-icon icon="icons:add"></iron-icon> Add Content
            </p>
            <div slot="content">
              <hax-tray-upload></hax-tray-upload>
              <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse accordion @click="${this._appBrowserRefresh}">
            <p slot="heading">
              <iron-icon icon="icons:search"></iron-icon> Search
            </p>
            <div slot="content">
              <hax-app-browser id="appbrowser">
                <slot></slot>
              </hax-app-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse accordion @click="${this._refreshLists}">
            <p slot="heading">
              <iron-icon icon="hax:templates"></iron-icon>Templates & Layouts
            </p>
            <div slot="content">
              <hax-blox-browser id="bloxbrowser"></hax-blox-browser>
              <hax-stax-browser id="staxbrowser"></hax-stax-browser>
            </div>
          </a11y-collapse>
        </a11y-collapse-group>
      </div>
    `;
  }
  /**
   * Handlers to refresh contents on click
   */
  _gizmoBrowserRefresh(e) {
    this.shadowRoot.querySelector("#gizmobrowser").resetBrowser();
  }
  _appBrowserRefresh(e) {
    this.shadowRoot.querySelector("#appbrowser").resetBrowser();
  }
  _refreshLists(e) {
    this.shadowRoot.querySelector("#bloxbrowser").bloxList = [
      ...window.HaxStore.instance.bloxList
    ];
    this.shadowRoot.querySelector("#staxbrowser").staxList = [
      ...window.HaxStore.instance.staxList
    ];
  }
  /**
   * Process event for simple content inserts.
   */
  _processTrayEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "search-selected":
        this.dispatchEvent(
          new CustomEvent("hax-search-source-updated", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail.index
          })
        );
        break;
      case "insert-stax":
        this.dispatchEvent(
          new CustomEvent("hax-insert-content-array", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: e.path[0].stax
          })
        );
        break;
      case "insert-blox":
        let content = "";
        for (var i = 0; i < e.path[0].blox.length; i++) {
          let node = window.HaxStore.haxElementToNode(
            e.path[0].blox[i].tag,
            e.path[0].blox[i].content,
            e.path[0].blox[i].properties
          );
          content += window.HaxStore.nodeToContent(node);
        }
        // generate a hax element
        let blox = {
          tag: "grid-plate",
          properties: {
            layout: e.path[0].layout
          },
          content: content
        };
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: blox
          })
        );
        break;
      case "insert-tag":
        let gizmo = {
          tag: detail.value
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
    return {
      ...super.properties,
      __tipText: {
        type: String
      },
      /**
       * Form values for active node
       */
      activeValue: {
        type: Object
      },
      /**
       * Form schema for active node
       */
      activeSchema: {
        type: Object
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
        reflect: true
      },
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo"
      },
      hasSettings: {
        type: Boolean
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
        type: Object
      },
      /**
       * Tag name / what to display based on active element
       */
      activeTagName: {
        type: String
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
      }
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
          } else {
            this.activeTagName = this.activeNode.tagName;
          }
        } else {
          this.hasSettings = false;
        }
        // process fields
        this.activeHaxElement = window.HaxStore.nodeToHaxElement(
          this.activeNode,
          null
        );
        this.shadowRoot.querySelector("#settingsform").fields = {};
        this.shadowRoot.querySelector("#settingsform").value = {};
        this._setupForm();
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * When the preview node is updated, pull schema associated with it
   */
  _setupForm() {
    let activeNode = this.activeNode;
    // see if we can get schema off of this.
    if (
      activeNode.tagName &&
      window.HaxStore.instance.elementList[activeNode.tagName.toLowerCase()]
    ) {
      let props =
        window.HaxStore.instance.elementList[activeNode.tagName.toLowerCase()];
      let schema = {};
      if (typeof activeNode.getHaxJSONSchemaType === "function") {
        schema = window.HaxStore.instance.getHaxJSONSchema(
          this.formKey,
          props,
          activeNode
        );
      } else {
        schema = window.HaxStore.instance.getHaxJSONSchema(this.formKey, props);
      }
      // generate a human name for this
      if (typeof props.gizmo.title === typeof undefined) {
        this.humanName = activeNode.tagName.replace("-", " ").toLowerCase();
      } else {
        this.humanName = props.gizmo.title;
      }
      // first, allow element properties to dictate defaults
      for (var property in this.activeHaxElement.properties) {
        if (this.activeHaxElement.properties.hasOwnProperty(property)) {
          if (typeof schema.properties[property] !== typeof undefined) {
            schema.properties[
              property
            ].value = this.activeHaxElement.properties[property];
            // support custom element input
            if (
              typeof schema.properties[property].component !==
                typeof undefined &&
              schema.properties[property].component.properties
            ) {
              schema.properties[
                property
              ].component.properties.value = this.activeHaxElement.properties[
                property
              ];
            }
          }
          // ensure this isn't read only
          if (
            this.activeHaxElement.properties[property] != null &&
            !this.activeHaxElement.properties[property].readOnly
          ) {
            // make sure slot is NEVER set in the preview
            // or it'll not show up and we'll get inconsistency with it
            // when in the context of being inserted into hax-body's shadow
            // slot is also a special attribute
            if (property === "slot") {
              // temp prop we use
              property = "data-hax-slot";
              // move it over
              this.activeHaxElement.properties[
                property
              ] = this.activeHaxElement.properties["slot"];
              // delete the slot
              delete this.activeHaxElement.properties["slot"];
              if (this.activeHaxElement.properties[property] != null) {
                activeNode.setAttribute(
                  "data-hax-slot",
                  this.activeHaxElement.properties[property]
                );
              }
            }
            // prefix is a special attribute and must be handled this way
            else if (property === "prefix") {
              activeNode.setAttribute(
                "prefix",
                this.activeHaxElement.properties[property]
              );
            }
            // set is a Polymer convention but help w/ data binding there a lot
            else if (typeof activeNode.set === "function") {
              // just to be safe
              try {
                activeNode.set(
                  property,
                  this.activeHaxElement.properties[property]
                );
              } catch (e) {
                console.warn(e);
              }
            }
            // vanilla / anything else we should just be able to set the prop
            else if (activeNode[property]) {
              try {
                activeNode[property] = this.activeHaxElement.properties[
                  property
                ];
              } catch (e) {
                console.warn(e);
              }
            } else {
              // @todo may need to bind differently for vanilla elements
              try {
                activeNode.setAttribute(
                  property,
                  this.activeHaxElement.properties[property]
                );
              } catch (e) {
                console.warn(e);
              }
            }
          }
          this.activeValue.settings.configure[
            `configure-${property}`
          ] = this.activeHaxElement.properties[property];
        }
      }
      // then, let the node itself dictate defaults if things are not set
      for (var property in activeNode) {
        if (
          activeNode.hasOwnProperty(property) &&
          typeof schema.properties[property] !== typeof undefined &&
          typeof activeNode[property].value !== typeof undefined &&
          activeNode[property].value !== null
        ) {
          this.activeValue.settings.configure[`configure-${property}`] =
            activeNode.properties[property].value;
        }
      }
      // need to specifically walk through slots if there is anything
      // that says it has to come from a slot
      for (var prop in props.settings[this.formKey]) {
        if (
          typeof props.settings[this.formKey][prop].slot !== typeof undefined
        ) {
          const newValueChildren = activeNode.childNodes;
          // walk through the slots looking for the value of it
          for (var i in newValueChildren) {
            // test for element nodes to be safe
            if (
              typeof newValueChildren[i] !== typeof undefined &&
              newValueChildren[i].nodeType === 1 &&
              newValueChildren[i].slot ===
                props.settings[this.formKey][prop].slot
            ) {
              if (typeof newValueChildren[i].innerHTML !== typeof undefined) {
                this.activeValue.settings.configure[
                  `configure-${props.settings[this.formKey][prop].slot}`
                ] = newValueChildren[i].innerHTML;
              }
            }
          }
        }
      }
      // tabs / deep objects require us to preview the value w/ the path correctly
      props.settings.configure.forEach((val, key) => {
        props.settings.configure[key].property = `configure-${
          props.settings.configure[key].property
        }`;
      });
      props.settings.advanced.forEach((val, key) => {
        props.settings.advanced[key].property = `advanced-${
          props.settings.advanced[key].property
        }`;
      });
      // generate a tab based UI
      this.activeSchema = [
        {
          property: "settings",
          inputMethod: "tabs",
          properties: [
            {
              property: "configure",
              title: "Configure",
              description: "Customize this element to your needs",
              properties: props.settings.configure
            },
            {
              property: "advanced",
              title: "Advanced",
              description: "Less common settings",
              properties: props.settings.advanced
            }
          ]
        }
      ];
      this.shadowRoot.querySelector("#settingsform").fields = [
        ...this.activeSchema
      ];
      this.shadowRoot.querySelector("#settingsform").value = {
        ...this.activeValue
      };
    }
  }
  /**
   * Convert an object to an array
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
  /**
   * Notice change in values from below
   */
  __valueChangedEvent(e) {
    //this.activeValue = { ...e.detail.value };
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
