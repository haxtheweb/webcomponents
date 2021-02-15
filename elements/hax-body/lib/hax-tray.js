import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  winEventsElement,
  camelCaseToDash,
  wipeSlot,
  nodeToHaxElement,
  haxElementToNode,
  normalizeEventPath,
} from "@lrnwebcomponents/utils/utils.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "./hax-tray-upload.js";
import "./hax-gizmo-browser.js";
import "./hax-app-browser.js";
import "./hax-stax-browser.js";
import "./hax-map.js";
import "./hax-preferences-dialog.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu-item.js";
/**
 * `hax-tray`
 * `The tray / dashboard area which allows for customization of all major settings`
 * @element hax-tray
 */
class HaxTray extends SimpleTourFinder(winEventsElement(LitElement)) {
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
    this.tourName = "hax";
    this.__winEvents = {
      "can-redo-changed": "_redoChanged",
      "can-undo-changed": "_undoChanged",
      "hax-drop-focus-event": "_expandSettingsPanel",
    };
    this._initial = true;
    this.activeValue = {
      settings: {
        layout: {
          __position: "hax-align-left",
          __scale: 100,
        },
        configure: {},
        advanced: {},
      },
    };
    this.collapsed = false;
    this.activeTab = "item-0";
    this.activeSchema = [];
    this.canUndo = false;
    this.canRedo = false;
    this.elementAlign = "right";
    this.trayDetail = "content-edit";
    this.activeTagName = "";
    this.traySizeIcon = "hax:arrow-expand-right";
    this.__setup = false;
    this.__tipText = "Edit";
    setTimeout(() => {
      import("./hax-tray-button.js");
      this.addEventListener(
        "hax-tray-button-click",
        this._processTrayEvent.bind(this)
      );
    }, 0);
    autorun(() => {
      this.activeGizmo = toJS(HAXStore.activeGizmo);
    });
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
    });
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
    });
    autorun(() => {
      this.editMode = toJS(HAXStore.editMode);
    });
  }
  _expandSettingsPanel(e) {
    this.shadowRoot.querySelector("#content-edit").click();
  }
  _redoChanged(e) {
    this.canRedo = e.detail.value;
  }
  _undoChanged(e) {
    this.canUndo = e.detail.value;
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      ...(super.styles || []),
      css`
        :host {
          font-family: var(--simple-fields-font-family, sans-serif);
          display: block;
          z-index: 100000000;
          position: absolute;
          transition: 0.2s all ease-in-out;
          height: 100vh;
          overflow: auto;
        }
        .wrapper {
          position: fixed;
          top: 0;
          background-color: var(--hax-toolbar-button-bg, #fff);
          width: var(--hax-tray-width, 300px);
          --simple-fields-margin: var(--hax-tray-margin-sm, 4px);
          --simple-fields-font-size: var(--hax-tray-font-size-sm, 12px);
          --simple-fields-font-size-xs: var(--hax-tray-font-size-xs, 10px);
          --tray-detail-accent-color: #000;
          transition: 0.2s all ease-in-out;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          margin: 0;
          padding: 0;
        }
        #wrapper,
        #wrapper > * {
          overflow-x: hidden;
          overflow-y: auto;
        }
        :host([element-align="left"]) .wrapper {
          left: -1000px;
        }
        :host([element-align="right"]) .wrapper {
          right: -1000px;
        }
        :host([edit-mode][element-align="left"]) .wrapper {
          left: 0;
        }
        :host([edit-mode][element-align="right"]) .wrapper {
          right: 0;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          right: 0;
          pointer-events: all;
        }
        #tray-detail {
          flex: 1 1 auto;
          transition: height 0.6s linear;
          border: 1px solid var(--hax-toolbar-border-color, #ddd);
          border-top: 3px solid var(--tray-detail-accent-color,
            #000
          );
          max-width: calc(var(--hax-tray-width, 300px) - 2 * var(--hax-tray-margin-sm, 4px));
          overflow-y: auto;
          padding: 0 var(--hax-tray-margin-sm, 4px) var(--hax-tray-margin-sm, 4px);
          --simple-fields-accent-color: var(--tray-detail-accent-color, #000);
          transition: 0.2s all ease-in-out;
          max-height: 100vh;
        }
        :host([edit-mode][collapsed]) #tray-detail {
          position: absolute;
          top: -100vh;
          left: unset !important;
          right: unset !important;
        }
        #tray-detail[hidden]{
          height: 0px;
          transition: height 0.6s linear;
        }
        #content-add,
        #tray-detail[selected-detail=content-add] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-purple-8,
            #8a009b
          );
        }
        #content-edit,
        #tray-detail[selected-detail=content-edit] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-pink-8,
            #b80042
          );
        }
        #media-add,
        #tray-detail[selected-detail=media-add] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-indigo-8,
            #2801b0
          );
        }
        #content-map,
        #tray-detail[selected-detail=content-map] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-light-blue-8,
            #007999
          );
        }
        #advanced-settings,
        #tray-detail[selected-detail=advanced-settings] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-teal-8,
            #007658
          );
        }
        #advanced-settings,
        #tray-detail[selected-detail=advanced-settings] {
          --tray-detail-accent-color: var(
            --simple-colors-default-theme-green-8,
            #00762e
          );
        }
        #tray-detail h4,
        #tray-detail h5,
        #tray-detail h6 {
          color: var(--tray-detail-accent-color,
            #000
          );
          margin: calc(2 * var(--hax-tray-margin-sm, 4px)) 0 var(--hax-tray-margin-sm, 4px);
        }
        #content-add,
        #content-edit,
        #media-add,
        #content-map,
        #advanced-settings {
          --simple-toolbar-button-hover-color: var(--tray-detail-accent-color,#000);
          --simple-toolbar-button-hover-border-color: var(--tray-detail-accent-color,#000);
          --simple-toolbar-button-hover-toggled-border-color: var(--tray-detail-accent-color,#000);
          --simple-toolbar-button-toggled-color: var(--tray-detail-accent-color,#000);
          --simple-fields-accent-color: : var(--tray-detail-accent-color,#000);
        }
        hax-toolbar {
          flex: 0 0 auto;
          border: 1px solid var(--hax-toolbar-border-color, #ddd);
          border-bottom: none;
          background-color: var(--hax-toolbar-button-bg, #fff);
          display: flex;
          width: var(--hax-tray-width, 300px);
          transition: all 0.5ms ease-in-out;
        }
        :host([edit-mode][collapsed]) hax-toolbar.tray-detail-ops {
          border-bottom: 1px solid var(--hax-toolbar-border-color, #ddd);
        }
        .group { 
          margin: 0; 
          padding: 0;
          justify-content: space-around;
          border-right: 1px solid var(--hax-toolbar-border-color, #ddd);
          flex: 1 0 auto;
        }
        .group:last-child { 
          flex: 0 0 auto;
        }
        .group > * {
          flex: 1 1 auto;
        }
        .group:last-child > * { 
          flex: 0 0 auto;
        }
        .collapse-menu {
          z-index: 2000;
        }
        hax-toolbar,
        hax-tray-button,
        hax-app-browser,
        hax-gizmo-browser {
          transition: 0.2s all ease-in-out;
          visibility: visible;
        }
        hax-toolbar:not(:defined),
        hax-tray-button:not(:defined),
        hax-app-browser:not(:defined),
        hax-gizmo-browser:not(:defined) {
          visibility: hidden;
        }
        hax-tray-upload {
          flex: 0 0 auto;
        }
        *[hidden] {
          display: none;
        }
        #settingscollapse div[slot="content"] {
          padding: 0;
          margin: 0;
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
          border: 1px solid black;
          box-shadow: 0 5px 5px 1px rgba(0, 0, 0, 0.2);
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
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          .wrapper {
            top: 0;
            left: 0;
            right: 0;
            margin: 0 !important;
          }
          #toggle-element-align {
            display: none;
          }
        }
        @media screen and (max-width: 600px) {
          :host([edit-mode]) .hide-small {
            display: none;
          }
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      ${this.panelOpsTemplate}
      <div class="wrapper" part="hax-tray-wrapper">
        ${this.panelOpsTemplate} ${this.opsToolbarTemplate}
        ${this.trayToolbarTemplate} ${this.trayDetailTemplate}
      </div>
    `;
  }
  get panelOpsTemplate() {
    return this.hidePanelOps
      ? ``
      : html`
          <hax-tray-button
            voice-command="edit page"
            .data-opened="${this.editMode}"
            @click="${this._clickEditButton}"
            icon="create"
            id="button"
            feature
            show-text-label
            label="${this.__tipText}"
          ></hax-tray-button>
        `;
  }
  get opsToolbarTemplate() {
    return html` <hax-toolbar class="quick-buttons collapse-menu">
      <div class="ops group">
        ${this.hidePanelOps
          ? ``
          : html`
              <hax-tray-button
                feature
                @click="${this._clickSaveButton}"
                icon="save"
                id="haxsavebutton"
                label="${this.__tipText}"
                event-name="save"
                voice-command="save (content)(page)"
                tooltip-direction="right"
              ></hax-tray-button>
            </div>
            <div class="group">
              <hax-tray-button
                danger
                icon="close"
                id="haxcancelbutton"
                label="Cancel"
                event-name="cancel"
                voice-command="cancel"
                tooltip-direction="right"
              ></hax-tray-button>
              `}
      </div>
      <div class="group">
        <hax-tray-button
          icon="icons:undo"
          ?disabled="${!this.canUndo}"
          label="Undo previous action"
          event-name="undo"
          voice-command="undo"
          class="hide-small"
          data-simple-tour-stop
          data-stop-title="label"
        >
          <div slot="tour" data-stop-content>
            Undo the previous operation in the content, whether typing or adding
            a widget.
          </div>
        </hax-tray-button>
        <hax-tray-button
          icon="icons:redo"
          ?disabled="${!this.canRedo}"
          label="Redo previous action"
          event-name="redo"
          voice-command="redo"
          class="hide-small"
          data-simple-tour-stop
          data-stop-title="label"
        >
          <div slot="tour" data-stop-content>
            Redo the last action that you hit Undo on.
          </div>
        </hax-tray-button>
      </div>
      <div class="group collapse-menu ">
        <slot name="tray-buttons-pre"></slot>
        <hax-toolbar-menu label="Position" icon="av:web" direction="left">
          <hax-toolbar-menu-item slot="menuitem">
            <hax-tray-button
              role="menuitem"
              voice-command="toggle menu"
              id="toggle-tray-size"
              event-name="toggle-tray-size"
              show-text-label
              icon="${this.collapsed ? "unfold-more" : "unfold-less"}"
              label="${this.collapsed ? "Expand Menu" : "Collapse Menu"}"
              data-simple-tour-stop
            >
              <div data-stop-title>Menu placement</div>
              <div data-stop-content>Expand or collapse the menu visually.</div>
            </hax-tray-button>
          </hax-toolbar-menu-item>
          <hax-toolbar-menu-item slot="menuitem">
            <hax-tray-button
              voice-command="toggle alignment"
              id="toggle-element-align"
              event-name="toggle-element-align"
              show-text-label
              icon="${this.elementAlign == "left"
                ? "arrow-forward"
                : "arrow-back"}"
              label="${this.elementAlign == "left"
                ? "Move Menu Right"
                : "Move Menu Left"}"
              data-simple-tour-stop
            >
              <div data-stop-title>Menu alignment</div>
              <div data-stop-content>
                Change which side of the screen the menu is affixed to visually.
              </div>
            </hax-tray-button>
          </hax-toolbar-menu-item>
        </hax-toolbar-menu>
      </div>
      <div class="group">
        <hax-tray-button
          id="exportbtn"
          icon="code"
          label="View page source"
          voice-command="view (page) source"
          data-simple-tour-stop
          data-stop-title="label"
        >
          <div data-stop-content>
            Every change you make in HAX is ultimately writing HTML. Know HTML?
            Awesome, pop open the source view and make any changes you like.
            HTML is always behind the scenes ensuring that content is portable,
            well formatted and easy to read.
          </div>
        </hax-tray-button>
      </div>
      <div class="group">
        <hax-tray-button
          event-name="start-tour"
          icon="help"
          label="Take a tour"
          voice-command="start tour"
          tooltip-direction="left"
        ></hax-tray-button>
      </div>
    </hax-toolbar>`;
  }
  get trayToolbarTemplate() {
    return html` <hax-toolbar class="quick-buttons tray-detail-ops">
      <div class="group">
        <hax-tray-button
          event-name="content-edit"
          icon="build"
          id="content-edit"
          label="${this.activeTagName}"
          ?disabled="${!this.activeTagName ||
          this.activeTagName == "" ||
          !this.activeNode ||
          !this.activeNode.tagName}"
          voice-command="(modify)(configure)(edit) selected"
          data-simple-tour-stop
          data-stop-title="label"
          controls="tray-detail"
          show-text-label
          tooltip="Modify Selected ${this.activeTagName}"
          toggles
          ?toggled="${this.trayDetail === "content-edit"}"
        >
          <div slot="tour" data-stop-content>
            When you want to add any content to the page from text, to images,
            to anything more advanced; you can always find items to add under
            the Add content menu. Click to expand, then either drag and drop
            items into the page or click and have them placed near whatever you
            are actively working on.
          </div>
        </hax-tray-button>
        <hax-tray-button
          event-name="content-add"
          icon="add-box"
          id="content-add"
          label="Add Content"
          voice-command="add content"
          data-simple-tour-stop
          data-stop-title="label"
          controls="tray-detail"
          toggles
          ?toggled="${this.trayDetail === "content-add"}"
        >
          <div slot="tour" data-stop-content>
            When you want to add any content to the page from text, to images,
            to anything more advanced; you can always find items to add under
            the Add content menu. Click to expand, then either drag and drop
            items into the page or click and have them placed near whatever you
            are actively working on.
          </div>
        </hax-tray-button>
        <hax-tray-button
          event-name="media-add"
          icon="image:add-a-photo"
          id="media-add"
          label="Add Media"
          voice-command="Add Media"
          data-simple-tour-stop
          data-stop-title="label"
          controls="tray-detail"
          toggles
          ?toggled="${this.trayDetail === "media-add"}"
        >
          <div slot="tour" data-stop-content>
            Search for media and content anywhere that your copy of HAX has
            access to. Pick what to search, perform the search and then click or
            drag the item into the contnet.
          </div>
        </hax-tray-button>
      </div>
      <div class="group">
        <hax-tray-button
          event-name="content-map"
          icon="maps:map"
          id="content-map"
          label="Content map"
          voice-command="open map"
          data-simple-tour-stop
          data-stop-title="label"
          controls="tray-detail"
          toggles
          ?toggled="${this.trayDetail === "content-map"}"
        >
          <div data-stop-content>
            This is a simple list of all the block areas of the page that are
            clickable to jump through items quickly as well as review some
            simple overview stats.
          </div>
        </hax-tray-button>
      </div>
      <div class="group">
        <hax-tray-button
          ?hidden="${this.hidePreferencesButton}"
          id="advanced-settings"
          event-name="advanced-settings"
          icon="settings"
          label="Advanced Settings"
          voice-command="open preferences"
          tooltip-direction="left"
          data-simple-tour-stop
          data-stop-title="label"
          controls="tray-detail"
          toggles
          ?toggled="${this.trayDetail === "advanced-settings"}"
        >
          <div data-stop-content>
            Some advanced options for developers and experimental purposes.
          </div>
        </hax-tray-button>
      </div>
    </hax-toolbar>`;
  }
  get trayDetailTemplate() {
    return html` <div
      id="tray-detail"
      aria-live="polite"
      aria-disabled="${this.collapsed ? "true" : "false"}"
      tabindex="${this.collapsed ? "-1" : "0"}"
      selected-detail="${this.trayDetail}"
    >
      <h4>${this.trayLabel || `Modify Selected ${this.activeTagName}`}</h4>
      ${this.advancedSettingsTemplate} ${this.contentMapTemplate}
      ${this.contentEditTemplate} ${this.contentAddTemplate}
      ${this.mediaTemplate}
    </div>`;
  }
  get advancedSettingsTemplate() {
    return html` <hax-preferences-dialog
      id="advanced-settings-tray"
      ?hidden="${this.trayDetail !== "advanced-settings"}"
    ></hax-preferences-dialog>`;
  }
  get contentEditTemplate() {
    return html` <simple-fields
      id="settingsform"
      disable-responsive
      ?hidden="${this.trayDetail !== "content-edit"}"
    ></simple-fields>`;
  }
  get contentAddTemplate() {
    let hidden = this.trayDetail !== "content-add";
    return html` <hax-gizmo-browser
        id="gizmobrowser"
        ?hidden="${hidden}"
      ></hax-gizmo-browser>
      <h5 ?hidden="${hidden}">Templates</h5>
      <hax-stax-browser
        id="staxbrowser"
        ?hidden="${hidden}"
      ></hax-stax-browser>`;
  }
  get contentMapTemplate() {
    return html`<hax-map
      controls="content-map-tray"
      ?hidden="${this.trayDetail !== "content-map"}"
    ></hax-map>`;
  }
  get mediaTemplate() {
    let hidden = this.trayDetail !== "media-add";
    return html` <hax-tray-upload ?hidden="${hidden}"></hax-tray-upload>
      <h5 ?hidden="${hidden}">Media Search</h5>
      <hax-app-browser id="appbrowser" ?hidden="${hidden}"></hax-app-browser>`;
  }
  __simpleFieldsClick(e) {
    try {
      this.activeTab = this.shadowRoot
        .querySelector("#settingsform")
        .shadowRoot.querySelector("simple-fields").activeTab;
    } catch (e) {
      // in case it missed somehow like w/ an incredibly slow repaints
      this.activeTab = "item-0";
    }
  }
  _refreshAddData() {
    this.shadowRoot
      .querySelector("#gizmobrowser")
      .resetList(toJS(HAXStore.gizmoList));
    this.shadowRoot.querySelector("#staxbrowser").staxList = [
      ...toJS(HAXStore.staxList),
    ];
  }
  /**
   * Process event for simple content inserts.
   */
  _processTrayEvent(e) {
    var target = normalizeEventPath(e)[0];
    // support a simple insert event to bubble up or everything else
    switch (e.detail.eventName) {
      case "insert-stax":
        this.dispatchEvent(
          new CustomEvent("hax-insert-content-array", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: target.stax,
          })
        );
        break;
      case "insert-tag":
        let gizmo = {
          tag: e.detail.value,
        };
        let haxElement;
        // get schema for that version of events
        let schema = HAXStore.haxSchemaFromTag(e.detail.value);
        if (
          target.getAttribute("data-demo-schema") &&
          schema &&
          schema.demoSchema &&
          schema.demoSchema
        ) {
          haxElement = schema.demoSchema[0];
        } else {
          // support if anything else is manually defining what to inject
          // or a baseline if we didn't have a demonstration schema supplied
          let properties = JSON.parse(target.getAttribute("event-properties"));
          let innerContent = target.getAttribute("event-content");
          if (properties == null) {
            properties = {};
          }
          if (innerContent == null) {
            innerContent = "";
          }
          // most likely empty values but just to be safe
          haxElement = HAXStore.haxElementPrototype(
            gizmo,
            properties,
            innerContent
          );
        }
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: haxElement,
          })
        );
        break;
      case "advanced-settings":
        this.trayDetail = e.detail.eventName;
        this.collapsed = false;
        break;
      case "toggle-element-align":
        this.elementAlign = this.elementAlign === "right" ? "left" : "right";
        break;
      case "toggle-tray-size":
        this.collapsed = !this.collapsed;
        break;
      case "content-map":
        this.trayDetail = e.detail.eventName;
        this.collapsed = false;
        break;
      case "content-edit":
        this.trayDetail = e.detail.eventName;
        this.collapsed = false;
        break;
      case "content-add":
        this.trayDetail = e.detail.eventName;
        this.collapsed = false;
        break;
      case "media-add":
        this.trayDetail = e.detail.eventName;
        this.collapsed = false;
        break;
      case "start-tour":
        window.SimpleTourManager.requestAvailability().startTour("hax");
        break;
      case "undo":
        HAXStore.activeHaxBody.undo();
        break;
      case "redo":
        HAXStore.activeHaxBody.redo();
        break;
      case "cancel":
        if (
          confirm(
            "Changes have not been saved, Click OK to close HAX or Cancel to continue editing."
          )
        ) {
          HAXStore.editMode = false;
          this.dispatchEvent(
            new CustomEvent("hax-cancel", {
              bubbles: true,
              composed: true,
              cancelable: false,
              detail: e.detail,
            })
          );
        }
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
        type: String,
      },
      offsetMargin: {
        type: String,
        attribute: "offset-margin",
      },
      collapsed: {
        type: Boolean,
        reflect: true,
      },
      traySizeIcon: {
        type: String,
      },
      /**
       * Form values for active node
       */
      activeValue: {
        type: Object,
      },
      /**
       * Form schema for active node
       */
      activeSchema: {
        type: Object,
      },
      /**
       * Alignment of the initial edit button
       */
      elementAlign: {
        type: String,
        reflect: true,
        attribute: "element-align",
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
        attribute: "can-undo",
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo",
      },
      /**
       * Showing preferences area.
       */
      hidePreferencesButton: {
        type: Boolean,
        reflect: true,
        attribute: "hide-preferences-button",
      },
      /**
       * Showing button area at all a well as internal
       * state managing buttons like cancel and save
       */
      hidePanelOps: {
        type: Boolean,
        reflect: true,
        attribute: "hide-panel-ops",
      },
      /**
       * Global preferences for HAX overall
       */
      globalPreferences: {
        type: Object,
      },
      /**
       * Global active node so we know if we need to disable contextual settings
       */
      activeNode: {
        type: Object,
      },
      /**
       * Element name / what to display based on active element
       */
      activeTagName: {
        type: String,
      },
      activeGizmo: {
        type: Object,
      },
      /**
       * State of the panel
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * id of toggled section in tray
       */
      trayDetail: {
        type: String,
      },
      /**
       * heading of toggled section in tray
       */
      trayLabel: {
        type: String,
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
      this.shadowRoot.querySelector(
        "#settingsform"
      ).schematizer = HaxSchematizer;
      this.shadowRoot.querySelector(
        "#settingsform"
      ).elementizer = HaxElementizer;
      setTimeout(() => {
        this.shadowRoot.querySelector(
          ".wrapper"
        ).style.margin = this.offsetMargin;
      }, 1000);
      this.__setup = true;
      this.shadowRoot
        .querySelector("#settingsform")
        .addEventListener("click", this.__simpleFieldsClick.bind(this));
      this.shadowRoot
        .querySelector("#settingsform")
        .addEventListener("value-changed", this.__valueChangedEvent.bind(this));
      // fire an event that this is a core piece of the system
      this.dispatchEvent(
        new CustomEvent("hax-register-core-piece", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            piece: "haxTray",
            object: this,
          },
        })
      );
      this.dispatchEvent(
        new CustomEvent("hax-add-voice-command", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            command:
              ":name: (collapse)(open)(expand)(toggle) add content (menu)",
            context: this.shadowRoot.querySelector("#content-add"),
            callback: "click",
          },
        })
      );
      this.dispatchEvent(
        new CustomEvent("hax-add-voice-command", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            command:
              ":name: (collapse)(open)(expand)(toggle) element settings (menu)",
            context: this.shadowRoot.querySelector("#advanced-settings"),
            callback: "click",
          },
        })
      );
      this.dispatchEvent(
        new CustomEvent("hax-add-voice-command", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            command: ":name: (collapse)(open)(expand)(toggle) search (menu)",
            context: this.shadowRoot.querySelector("#media-add"),
            callback: "click",
          },
        })
      );
    }
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        if (this.editMode) {
          HAXStore.refreshActiveNodeForm();
        }
        this._editModeChanged(this.editMode);
      }
      if (propName == "offsetMargin") {
        setTimeout(() => {
          this.shadowRoot.querySelector(
            ".wrapper"
          ).style.margin = this.offsetMargin;
        }, 0);
      }
      // change tray detail
      if (propName == "trayDetail") this._updateTrayDetail(oldValue);
      // collaped menu state change
      if (propName == "collapsed" && this[propName]) {
        this._editModeChanged(this.editMode);
      }
      // active Gizmo changed
      if (propName == "activeGizmo") {
        if (this.activeGizmo) {
          this.activeTagName = this.activeGizmo.title;
          if (
            (!oldValue || this.trayDetail !== "content-edit") &&
            this.trayDetail !== "content-map"
          ) {
            this.trayDetail = "content-edit";
          }
        } else {
          this.activeTagName = "";
          if (this.trayDetail !== "content-add") {
            this.trayDetail = "content-add";
          }
        }
      }
      // active node changed
      if (propName == "activeNode") {
        if (this.activeNode && this.activeNode.tagName) {
          if (this.editMode) {
            HAXStore.refreshActiveNodeForm();
          }
        } else {
          this.activeTagName = "";
        }
      }
    });
  }
  /**
   * When the preview node is updated, pull schema associated with it
   */
  _setupForm() {
    let activeNode = this.activeNode;
    this._initial = true;
    this.activeValue = {
      settings: {
        layout: {
          __position: "hax-align-left",
          __scale: 100,
        },
        configure: {},
        advanced: {},
      },
    };
    this.shadowRoot.querySelector("#settingsform").fields = [];
    this.shadowRoot.querySelector("#settingsform").value = {};
    // see if we can get schema off of this.
    if (
      activeNode.tagName &&
      HAXStore.elementList[activeNode.tagName.toLowerCase()]
    ) {
      let props = HAXStore.elementList[activeNode.tagName.toLowerCase()];
      // generate a human name for this
      if (typeof props.gizmo.title === typeof undefined) {
        this.humanName = activeNode.tagName.replace("-", " ").toLowerCase();
      } else {
        this.humanName = props.gizmo.title;
      }
      // first, allow element properties to dictate defaults
      for (var property in this.activeHaxElement.properties) {
        props.settings.configure.forEach((el) => {
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
        props.settings.advanced.forEach((el) => {
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
      // now we need to parse through for slotted items
      // build a fake tree, then walk the configuration / advanced settings
      // looking for slot types
      let tmp = document.createElement("div");
      tmp.innerHTML = this.activeHaxElement.content;
      // step through each key
      tmp.childNodes.forEach((el) => {
        // ensure we have a dom node and it isnt empty
        if (el.nodeType === 1 && el.innerHTML !== typeof undefined) {
          // walk props looking for a match
          props.settings.configure.forEach((prop) => {
            // if we have a slot to match in the property AND it matches the attr
            if (prop.slot === el.getAttribute("slot")) {
              this.activeValue.settings.configure[prop.slot] = el.innerHTML;
            }
            // no slot and it didnt match so it has no slot
            else if (
              prop.slot == "" &&
              (el.getAttribute("slot") == null ||
                el.getAttribute("slot") == "null")
            ) {
              this.activeValue.settings.configure[prop.slot] = el.innerHTML;
            }
          });
          // now advanced
          props.settings.advanced.forEach((prop) => {
            if (prop.slot === el.getAttribute("slot")) {
              this.activeValue.settings.advanced[prop.slot] = el.innerHTML;
            }
            // no slot and it didnt match so it has no slot
            else if (
              prop.slot == "" &&
              (el.getAttribute("slot") == null ||
                el.getAttribute("slot") == "null")
            ) {
              this.activeValue.settings.advanced[prop.slot] = el.innerHTML;
            }
          });
        }
      });
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
            "hax-align-right": "Right",
          },
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
          step: props.canScale.step ? props.canScale.step : 12.5,
        });
      }

      // establish tabs container
      this.activeSchema = [
        {
          property: "settings",
          inputMethod: "tabs",
          properties: [],
        },
      ];
      // array of things to forcibly disable
      let disable = [];
      // see if we have any configure settings or disable
      if (props.settings.configure.length > 0) {
        this.activeSchema[0].properties.push({
          property: "configure",
          title: "Configure",
          description: "Configure the element",
          properties: props.settings.configure,
        });
      } else {
        this.activeSchema[0].properties.push({
          property: "configure",
          title: "Configure",
          description: "Configure the element",
          disabled: true,
        });
      }
      // see if we have any layout settings or disable
      if (props.settings.layout.length > 0) {
        this.activeSchema[0].properties.push({
          property: "layout",
          title: "Layout",
          description: "Position the element relative to other items",
          properties: props.settings.layout,
        });
      } else {
        this.activeSchema[0].properties.push({
          property: "layout",
          title: "Layout",
          description: "Position the element relative to other items",
          disabled: true,
        });
      }
      // see if we have any configure settings or disable
      if (props.settings.advanced.length > 0) {
        this.activeSchema[0].properties.push({
          property: "advanced",
          title: "Advanced",
          description: "Advanced element settings",
          properties: props.settings.advanced,
        });
      } else {
        this.activeSchema[0].properties.push({
          property: "advanced",
          title: "Advanced",
          description: "Advanced element settings",
          disabled: true,
        });
      }
      this.__activePropSchema = props;
      this.shadowRoot.querySelector("#settingsform").fields = this.activeSchema;
      this.shadowRoot.querySelector("#settingsform").value = this.activeValue;
    }
  }
  /**
   * Convert an object to an array
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
  _updateTrayDetail(oldValue) {
    if (this.trayDetail == "content-add") {
      this.trayLabel = "Add Content";
      this._refreshAddData();
    } else if (this.trayDetail == "media-add") {
      this.trayLabel = "Add Media";
    } else if (this.trayDetail == "content-map") {
      this.trayLabel = "Content Map";
      this.shadowRoot.querySelector("hax-map").updateHAXMap();
    } else if (this.trayDetail == "advanced-settings") {
      this.trayLabel = "Advanced Settings";
      this.shadowRoot
        .querySelector("hax-preferences-dialog")
        .reloadPreferencesForm();
    } else if (
      this.trayDetail == "content-edit" &&
      (!this.activeTagName ||
        this.activeTagName == "" ||
        !this.activeNode ||
        !this.activeNode.tagName)
    ) {
      this.trayDetail = "content-add";
    } else if (!this.trayDetail || this.trayDetail == "") {
      this.trayDetail = "content-edit";
    } else {
      this.trayLabel = undefined;
    }
  }
  /**
   * Notice change in values from below
   */
  __valueChangedEvent(e) {
    if (this.editMode && e.detail.value && e.detail.value.settings) {
      let settings = e.detail.value.settings;
      let settingsKeys = {
        advanced: "advanced",
        configure: "configure",
        layout: "layout",
      };
      var setAhead;
      for (let key in settingsKeys) {
        for (let prop in settings[key]) {
          setAhead = false;
          if (settings[key][prop] != null && !settings[key][prop].readOnly) {
            // prefix is a special attribute and must be handled this way
            if (prop === "prefix" && settings[key][prop] != "") {
              this.activeNode.setAttribute("prefix", settings[key][prop]);
              setAhead = true;
            }
            // this is a special internal held "property" for layout stuff
            else if (key === "layout" && prop === "__position") {
              setAhead = true;
              if (!this._initial) {
                clearTimeout(this.__contextValueDebounce);
                this.__contextValueDebounce = setTimeout(() => {
                  this.dispatchEvent(
                    new CustomEvent("hax-context-item-selected", {
                      bubbles: true,
                      composed: true,
                      detail: {
                        eventName: settings[key][prop],
                        value: settings[key][prop],
                      },
                    })
                  );
                }, 50);
              }
            }
            // this is a special internal held "property" for layout stuff
            else if (key === "layout" && prop === "__scale") {
              setAhead = true;
              if (!this._initial) {
                clearTimeout(this.__contextSizeDebounce);
                this.__contextSizeDebounce = setTimeout(() => {
                  this.dispatchEvent(
                    new CustomEvent("hax-context-item-selected", {
                      bubbles: true,
                      composed: true,
                      detail: {
                        eventName: "hax-size-change",
                        value: settings[key][prop],
                      },
                    })
                  );
                }, 50);
              }
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
                  if (HAXStore.isTextElement(this.activeNode)) {
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
                } else if (
                  settings[key][prop] === false ||
                  settings[key][prop] === ""
                ) {
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
    setTimeout(() => {
      if (this._initial) {
        this._initial = false;
      }
    }, 51);
  }

  /**
   * _editModeChanged
   */
  _editModeChanged(newValue) {
    if (newValue) {
      this.__tipText = "Save";
      this.shadowRoot.querySelector("#button").icon = "save";
    } else {
      this.__tipText = "Edit";
      this.shadowRoot.querySelector("#button").icon = "create";
    }
  }
  /**
   * Edit clicked, activate
   */
  _clickEditButton(e) {
    HAXStore.editMode = true;
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
  }

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickSaveButton(e) {
    HAXStore.editMode = false;
    this.dispatchEvent(
      new CustomEvent("hax-save", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail,
      })
    );
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
  }
}

window.customElements.define(HaxTray.tag, HaxTray);
export { HaxTray };
