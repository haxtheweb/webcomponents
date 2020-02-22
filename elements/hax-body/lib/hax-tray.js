import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  winEventsElement,
  camelCaseToDash,
  wipeSlot
} from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
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
    };
    this.activeValue = {
      settings: {
        layout: {
          __position: "hax-align-left",
          __scale: 100
        },
        configure: {},
        advanced: {}
      }
    };
    this.canSupportUploads = false;
    this.expanded = true;
    this.activeSchema = [];
    this.canUndo = true;
    this.canRedo = true;
    this.elementAlign = "right";
    this.__setup = false;
    setTimeout(() => {
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
      import("@polymer/paper-slider/paper-slider.js");
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
          z-index: 1000;
          position: fixed;
          top: 0;
          bottom: 0;
          background-color: white;
          font-size: 20px;
          width: var(---hax-tray-width, 300px);
          overflow: hidden;
          border-left: 2px solid var(--hax-color-text, black);
          transition: 0.2s right linear, 0.2s opacity linear,
            0.2s visibility linear;
          opacity: 0;
          visibility: hidden;
          right: calc(-1 * var(---hax-tray-width, 300px));
          pointer-events: none;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          right: calc(-1 * var(---hax-tray-width, 300px) + 120px);
          pointer-events: all;
        }
        :host([edit-mode][expanded]) .wrapper {
          right: 0;
        }
        /** default is right so lets support left too */
        :host([element-align="left"]) .wrapper {
          right: unset;
          left: calc(-1 * var(---hax-tray-width, 300px));
        }
        :host([edit-mode][element-align="left"]) .wrapper {
          right: unset;
          left: calc(-1 * var(---hax-tray-width, 300px) + 120px);
        }
        :host([edit-mode][element-align="left"][expanded]) .wrapper {
          right: unset;
          left: 0;
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
        *[hidden] {
          display: none;
        }
        a11y-collapse-group {
          font-size: 14px;
          margin: 0;
        }
        a11y-collapse {
          font-size: 11px;
          --a11y-tabs-content-padding: 0;
          width: calc(var(---hax-tray-width, 300px) - 2px);
          --a11y-collapse-heading-background-color: var(
            --simple-colors-default-theme-grey-1
          );
          --a11y-collapse-padding-top: 0px;
          --a11y-collapse-padding-right: 0px;
          --a11y-collapse-padding-bottom: 0px;
          --a11y-collapse-padding-left: 0px;
        }
        a11y-collapse div[slot="heading"] {
          cursor: pointer;
          font-size: 16px;
        }
        a11y-collapse:hover {
          --a11y-collapse-heading-background-color: var(
            --simple-colors-default-theme-grey-2
          );
        }
        a11y-collapse[expanded] {
          --a11y-collapse-heading-background-color: var(
            --simple-colors-default-theme-grey-3
          );
        }
        #settingscollapse div[slot="content"] {
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
          width: var(---hax-tray-width, 300px);
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
        div[slot="heading"] {
          margin: 0;
          padding: 10px;
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
          z-index: 1000;
          margin: 0;
        }
        :host([edit-mode]) #button {
          visibility: hidden;
          opacity: 0;
        }
        #button:hover {
          opacity: 1;
        }
        .active-op-name {
          display: inline-flex;
          vertical-align: text-bottom;
          padding: 4px 2px;
          max-width: 60px;
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
            ${this.hidePanelOps
              ? ``
              : html`
                  <hax-tray-button
                    mini
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
                    icon="cancel"
                    id="haxcancelbutton"
                    label="Cancel"
                    event-name="cancel"
                    accent-color="red"
                    voice-command="cancel"
                  ></hax-tray-button>
                  <hax-tray-button
                    mini
                    event-name="toggle-tray-size"
                    icon="${this.traySizeIcon}"
                    label="${this.traySizeText}"
                  ></hax-tray-button>
                `}
          </div>
          <div class="quick">
            <slot name="tray-buttons-pre"></slot>
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
              icon="hax:h2"
              label="Insert header"
              event-name="insert-tag"
              event-data="h2"
              event-content="Header"
              voice-command="insert header"
              class="hide-small"
            ></hax-tray-button>
            <hax-tray-button
              mini
              hidden
              icon="image:image"
              label="Insert image"
              event-name="insert-tag"
              event-properties='{"src":"https://haxtheweb.org/assets/banner.jpg"}'
              event-data="img"
              voice-command="insert image"
              class="hide-small"
            ></hax-tray-button>
            <hax-tray-button
              mini
              icon="hax:hr"
              label="Insert horizontal line"
              event-name="insert-tag"
              event-data="hr"
              event-properties='{"style":"width:75%;"}'
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
            <hax-tray-button
              mini
              icon="icons:undo"
              hidden
              ?disabled="${!this.canUndo}"
              label="Undo previous action"
              event-name="undo"
              voice-command="undo"
              class="hide-small"
            ></hax-tray-button>
            <hax-tray-button
              mini
              icon="icons:redo"
              hidden
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
              label="Advanced settings"
              voice-command="open (editor) preferences"
            ></hax-tray-button>
          </div>
        </div>
        <a11y-collapse-group radio accordion>
          <slot name="tray-collapse-pre"></slot>
          <a11y-collapse
            id="settingscollapse"
            ?disabled="${!this.activeTagName}"
          >
            <div slot="heading">
              <iron-icon icon="icons:settings"></iron-icon> ${this
                .activeTagName}
              Settings
            </div>
            <div slot="content">
              <simple-fields
                id="settingsform"
                @value-changed="${this.__valueChangedEvent}"
              ></simple-fields>
            </div>
          </a11y-collapse>
          <a11y-collapse>
            <div slot="heading" @click="${this._gizmoBrowserRefresh}">
              <iron-icon icon="icons:add"></iron-icon> Add Content
            </div>
            <div slot="content">
              <hax-tray-upload ?can-support-uploads=${this.canSupportUploads}></hax-tray-upload>
              <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse>
            <div slot="heading" @click="${this._appBrowserRefresh}">
              <iron-icon icon="icons:search"></iron-icon> Search
            </div>
            <div slot="content">
              <hax-app-browser id="appbrowser"></hax-app-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse>
            <div slot="heading" @click="${this._refreshLists}">
              <iron-icon icon="hax:templates"></iron-icon>Templates & Layouts
            </div>
            <div slot="content">
              <hax-blox-browser id="bloxbrowser"></hax-blox-browser>
              <hax-stax-browser id="staxbrowser"></hax-stax-browser>
            </div>
          </a11y-collapse>
          <slot name="tray-collapse-post"></slot>
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
        let properties = JSON.parse(e.path[0].getAttribute("event-properties"));
        let innerContent = e.path[0].getAttribute("event-content");
        if (properties == null) {
          properties = {};
        }
        if (innerContent == null) {
          innerContent = "";
        }
        // most likely empty values but just to be safe
        let element = window.HaxStore.haxElementPrototype(
          gizmo,
          properties,
          innerContent
        );
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
      case "toggle-tray-size":
        this.expanded = !this.expanded;
        break;
      case "open-export-dialog":
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxExport,
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
       * If this can support uploads or not based on presense of a backend
       * this property is synced down from the store
       */
      canSupportUploads: {
        type: Boolean,
        attribute: "can-support-uploads"
      },
      offsetMargin: {
        type: String
      },
      expanded: {
        type: Boolean,
        reflect: true
      },
      traySizeIcon: {
        type: String
      },
      traySizeText: {
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
      if (propName == "offsetMargin") {
        this.shadowRoot.querySelector(
          ".wrapper"
        ).style.margin = this.offsetMargin;
      }
      if (propName == "expanded") {
        if (this[propName]) {
          this.traySizeIcon = "hax:hax:arrow-expand-right";
          this.traySizeText = "Collapse";
        } else {
          this.traySizeIcon = "hax:hax:arrow-expand-left";
          this.traySizeText = "Expand";
        }
      }
      if (propName == "activeNode") {
        if (this.activeNode && this.activeNode.tagName) {
          if (this.activeNode.getAttribute("data-hax-ray") != null) {
            this.activeTagName = this.activeNode.getAttribute("data-hax-ray");
          } else {
            this.activeTagName = this.activeNode.tagName;
          }
          if (!this.shadowRoot.querySelector("#settingscollapse").expanded) {
            this.shadowRoot
              .querySelector('#settingscollapse div[slot="heading"]')
              .click();
          }
        }
        // process fields
        this.activeHaxElement = window.HaxStore.nodeToHaxElement(
          this.activeNode,
          null
        );
        this._setupForm();
      }
    });
  }
  /**
   * When the preview node is updated, pull schema associated with it
   */
  _setupForm() {
    let activeNode = this.activeNode;
    this.activeValue = {
      settings: {
        layout: {
          __position: "hax-align-left",
          __scale: 100
        },
        configure: {},
        advanced: {}
      }
    };
    this.shadowRoot.querySelector("#settingsform").fields = {};
    this.shadowRoot.querySelector("#settingsform").value = {};
    // see if we can get schema off of this.
    if (
      activeNode.tagName &&
      window.HaxStore.instance.elementList[activeNode.tagName.toLowerCase()]
    ) {
      let props =
        window.HaxStore.instance.elementList[activeNode.tagName.toLowerCase()];
      // generate a human name for this
      if (typeof props.gizmo.title === typeof undefined) {
        this.humanName = activeNode.tagName.replace("-", " ").toLowerCase();
      } else {
        this.humanName = props.gizmo.title;
      }
      // first, allow element properties to dictate defaults
      for (var property in this.activeHaxElement.properties) {
        props.settings.configure.forEach(el => {
          if (el.property === property) {
            this.activeValue.settings.configure[
              property
            ] = this.activeHaxElement.properties[property];
          }
          if (el.attribute === property) {
            this.activeValue.settings.configure[
              property
            ] = this.activeHaxElement.properties[property];
          }
          if (el.slot === property) {
            this.activeValue.settings.configure[
              property
            ] = this.activeHaxElement.properties[property];
          }
        });
        props.settings.advanced.forEach(el => {
          if (el.property === property) {
            this.activeValue.settings.advanced[
              property
            ] = this.activeHaxElement.properties[property];
          }
          if (el.attribute === property) {
            this.activeValue.settings.advanced[
              property
            ] = this.activeHaxElement.properties[property];
          }
          if (el.slot === property) {
            this.activeValue.settings.advanced[
              property
            ] = this.activeHaxElement.properties[property];
          }
        });
      }
      // then we need to work on the layout piece
      if (activeNode.style.width != "") {
        this.activeValue.settings.layout.__scale = activeNode.style.width.replace(
          "%",
          ""
        );
      } else {
        this.activeValue.settings.layout.__scale = 100;
      }
      if (
        activeNode.style.display == "block" &&
        activeNode.style.margin == "0px auto" &&
        activeNode.style.float == "right"
      ) {
        this.activeValue.settings.layout.__position = "hax-align-right";
      } else if (
        activeNode.style.display == "block" &&
        activeNode.style.margin == "0px auto"
      ) {
        this.activeValue.settings.layout.__position = "hax-align-center";
      } else {
        this.activeValue.settings.layout.__position = "hax-align-left";
      }
      this.activeHaxElement.properties.__scale = this.activeValue.settings.layout.__scale;
      this.activeHaxElement.properties.__position = this.activeValue.settings.layout.__position;
      // tabs / deep objects require us to preview the value w/ the path correctly
      props.settings.configure.forEach((val, key) => {
        if (props.settings.configure[key].attribute) {
          props.settings.configure[key].property =
            props.settings.configure[key].attribute;
        }
        if (props.settings.configure[key].slot) {
          props.settings.configure[key].property =
            props.settings.configure[key].slot;
        }
      });
      props.settings.advanced.forEach((val, key) => {
        if (props.settings.advanced[key].attribute) {
          props.settings.advanced[key].property =
            props.settings.advanced[key].attribute;
        }
        if (props.settings.advanced[key].slot) {
          props.settings.advanced[key].property =
            props.settings.advanced[key].slot;
        }
      });
      props.settings.layout = [];
      // test if this element can be aligned
      if (props.canPosition) {
        props.settings.layout.push({
          property: "__position",
          title: "Alignment",
          description: "Align content relative to other content",
          inputMethod: "select",
          value: this.activeValue.settings.layout.__position,
          options: {
            "hax-align-left": "Left",
            "hax-align-center": "Center",
            "hax-align-right": "Right"
          }
        });
      }
      // test if this element can be scaled
      if (props.canScale) {
        props.settings.layout.push({
          property: "__scale",
          title: "Width",
          description: "Scale and resize content",
          inputMethod: "slider",
          value: this.activeValue.settings.layout.__scale,
          min: props.canScale.min ? props.canScale.min : 12.5,
          max: props.canScale.max ? props.canScale.max : 100,
          step: props.canScale.step ? props.canScale.step : 12.5
        });
      }

      // establish tabs container
      this.activeSchema = [
        {
          property: "settings",
          inputMethod: "tabs",
          properties: []
        }
      ];
      // see if we have any layout settings or disable
      if (props.settings.layout.length > 0) {
        this.activeSchema[0].properties.push({
          property: "layout",
          title: "Layout",
          description: "Position the element relative to other items",
          properties: props.settings.layout
        });
      } else {

      }
      // see if we have any configure settings or disable
      if (props.settings.configure.length > 0) {
        this.activeSchema[0].properties.push({
          property: "configure",
          title: "Configure",
          description: "Configure the element",
          properties: props.settings.configure
        });
      } else {
        this.activeSchema[0].properties.push({
          property: "configure",
          title: "Configure",
          description: "Configure the element",
          disabled: true
        });
      }
      // see if we have any configure settings or disable
      if (props.settings.advanced.length > 0) {
        this.activeSchema[0].properties.push({
          property: "advanced",
          title: "Advanced",
          description: "Advanced element settings",
          properties: props.settings.advanced
        });
      } else {
        this.activeSchema[0].properties.push({
          property: "advanced",
          title: "Advanced",
          description: "Advanced element settings",
          disabled: true
        });
      }
      this.__activePropSchema = props;
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
    if (e.detail.value && e.detail.value.settings) {
      let settings = e.detail.value.settings;
      let settingsKeys = {
        advanced: "advanced",
        configure: "configure",
        layout: "layout"
      };
      var setAhead;
      for (let key in settingsKeys) {
        for (let prop in settings[key]) {
          setAhead = false;
          if (settings[key][prop] != null && !settings[key][prop].readOnly) {
            // prefix is a special attribute and must be handled this way
            if (prop === "prefix") {
              this.activeNode.setAttribute("prefix", settings[key][prop]);
              setAhead = true;
            }
            // this is a special internal held "property" for layout stuff
            else if (key === "layout" && prop === "__position") {
              setAhead = true;
              this.dispatchEvent(
                new CustomEvent("hax-context-item-selected", {
                  bubbles: true,
                  composed: true,
                  detail: {
                    eventName: settings[key][prop],
                    value: settings[key][prop]
                  }
                })
              );
            }
            // this is a special internal held "property" for layout stuff
            else if (key === "layout" && prop === "__scale") {
              setAhead = true;
              this.dispatchEvent(
                new CustomEvent("hax-context-item-selected", {
                  bubbles: true,
                  composed: true,
                  detail: {
                    eventName: "hax-size-change",
                    value: settings[key][prop]
                  }
                })
              );
            }
            // try and set the pop directly if it is a prop already set
            // check on prototype, then in properties object if it has one
            // then by seeing if we have an array / object
            else if (
              this.activeNode.hasOwnProperty(prop) ||
              (this.activeNode.properties &&
                this.activeNode.properties.hasOwnProperty(prop)) ||
              (settings[key][prop] != null &&
                settings[key][prop].constructor === Array) ||
              (settings[key][prop] != null &&
                settings[key][prop].constructor === Object)
            ) {
              try {
                if (settings[key][prop].constructor === Array) {
                  this.activeNode[prop] = [...settings[key][prop]];
                } else if (settings[key][prop].constructor === Object) {
                  this.activeNode[prop] = { ...settings[key][prop] };
                } else {
                  this.activeNode[prop] = settings[key][prop];
                }
                setAhead = true;
              } catch (e) {
                console.warn(e);
                setAhead = false;
              }
            } else {
              // need to specifically walk through slots if there is anything
              // that says it has to come from a slot
              for (var propTmp in this.__activePropSchema.settings[key]) {
                if (
                  this.__activePropSchema.settings[key][propTmp].slot == prop
                ) {
                  let slotTag = "span";
                  if (
                    this.__activePropSchema.settings[key][propTmp].slotWrapper
                  ) {
                    slotTag = this.__activePropSchema.settings[key][propTmp]
                      .slotWrapper;
                  } else if (
                    this.activeNode.tagName.toLowerCase() === "code-editor"
                  ) {
                    slotTag = "template";
                  }
                  var tmpel = document.createElement(slotTag);
                  if (
                    this.__activePropSchema.settings[key][propTmp]
                      .slotAttributes
                  ) {
                    for (var attr in this.__activePropSchema.settings[key][
                      propTmp
                    ].slotAttributes) {
                      tmpel.setAttribute(
                        attr,
                        this.__activePropSchema.settings[key][propTmp]
                          .slotAttributes[attr]
                      );
                    }
                  }
                  // support unnamed slots
                  if (
                    this.__activePropSchema.settings[key][propTmp].slot !== ""
                  ) {
                    tmpel.slot = this.__activePropSchema.settings[key][
                      propTmp
                    ].slot;
                  }
                  tmpel.innerHTML = settings[key][prop];
                  const cloneIt = tmpel.cloneNode(true);
                  setAhead = true;
                  // inject the slotted content but use text nodes if this is a text element
                  if (window.HaxStore.instance.isTextElement(this.activeNode)) {
                    this.activeNode.innerHTML = tmpel.innerHTML;
                  } else {
                    // wipe just the slot in question
                    wipeSlot(
                      this.activeNode,
                      this.__activePropSchema.settings[key][propTmp].slot
                    );
                    this.activeNode.appendChild(cloneIt);
                  }
                }
              }
            }
            // this will get reached often but tough to know if we had a slot
            if (!setAhead) {
              try {
                // silly but this is the spec way to do a boolean
                if (settings[key][prop] === true) {
                  this.activeNode.setAttribute(
                    camelCaseToDash(prop),
                    camelCaseToDash(prop)
                  );
                } else if (settings[key][prop] === false) {
                  this.activeNode.removeAttribute(camelCaseToDash(prop));
                } else {
                  this.activeNode.setAttribute(
                    camelCaseToDash(prop),
                    settings[key][prop]
                  );
                }
              } catch (e) {
                console.warn(e);
                console.warn(prop, settings[key][prop]);
              }
            }
          } else {
            this.activeNode.removeAttribute(camelCaseToDash(prop));
          }
        }
      }
    }
  }

  /**
   * _editModeChanged
   */
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue) {
      this.__tipText = "Save content";
      this.shadowRoot.querySelector("#button").icon = "save";
      this.__marginBody = document.body.style.marginRight;
      if (this.elementAlign == "left") {
        document.body.style.marginLeft = "300px";
      } else {
        document.body.style.marginRight = "300px";
      }
    } else {
      this.__tipText = "Edit content";
      this.shadowRoot.querySelector("#button").icon = "create";
      if (this.elementAlign == "left") {
        document.body.style.marginLeft = this.__marginBody;
      } else {
        document.body.style.marginRight = this.__marginBody;
      }
    }
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
