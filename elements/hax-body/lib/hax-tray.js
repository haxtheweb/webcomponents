import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  winEventsElement,
  camelCaseToDash,
  wipeSlot,
  nodeToHaxElement,
  haxElementToNode,
} from "@lrnwebcomponents/utils/utils.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "./hax-tray-upload.js";
import "./hax-gizmo-browser.js";
import "./hax-app-browser.js";
import "./hax-blox-browser.js";
import "./hax-stax-browser.js";
import "./hax-map.js";
import "./hax-preferences-dialog.js";
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
    this.activeTagName = "Select an element to configure";
    this.activeTagIcon = "icons:settings";
    this.__setup = false;
    this.__tipText = "Edit content";
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
    this.shadowRoot.querySelector("#settingscollapse").expand();
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
      css`
        :host {
          font-family: var(--simple-fields-font-family, sans-serif);
          display: block;
          z-index: 100000000;
          position: absolute;
          transition: 0.2s all ease-in-out;
          --hax-contextual-action-text-color: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-contextual-action-color: var(
            --simple-colors-default-theme-grey-12,
            #009dc7
          );
          --hax-contextual-action-hover-color: var(
            --simple-colors-default-theme-grey-8,
            #009dc7
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
          --a11y-tabs-focus-color: var(
            --hax-contextual-action-hover-color,
            var(--simple-colors-default-theme-grey-8, #009dc7)
          );
        }
        .wrapper {
          color: var(--hax-color-text, black);
          position: fixed;
          top: 0;
          background-color: transparent;
          font-size: 20px;
          width: var(---hax-tray-width, 300px);
          transition: 0.2s all ease-in-out;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          right: 0;
          pointer-events: all;
        }
        #addcollapse {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-purple-8,
            #8a009b
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-purple-8,
            #8a009b
          );
        }
        #settingscollapse {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-green-8,
            #00762e
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-green-8,
            #00762e
          );
          --simple-fields-margin: 4px;
          --simple-fields-font-size: 12px;
        }
        #searchapps {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
        }
        #templateslayouts {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-pink-8,
            #b80042
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-pink-8,
            #b80042
          );
        }
        :host([edit-mode][collapsed]) a11y-collapse-group {
          right: -100vw;
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
        :host([edit-mode][element-align="left"]) #toggle-tray-size {
          --hax-tray-button-rotate: rotate(-180deg);
        }
        /** default is right so lets support left too */
        :host([edit-mode][element-align="left"][collapsed])
          a11y-collapse-group {
          right: unset;
          left: -100vw;
        }
        :host([edit-mode][element-align="left"]) .ops,
        :host([edit-mode][element-align="left"]) .quick,
        :host([edit-mode][element-align="left"]) .quick-buttons {
          flex-direction: row-reverse;
        }
        :host([element-align="left"]) #toggle-element-align {
          --hax-tray-button-rotate: rotate(-90deg) scaleX(-1) !important;
        }
        :host([element-align="right"]) #toggle-element-align {
          --hax-tray-button-rotate: rotate(90deg) !important;
        }
        hax-tray-button,
        a11y-collapse,
        a11y-collapse-group,
        hax-app-browser,
        hax-gizmo-browser {
          transition: 0.2s all ease-in-out;
          visibility: visible;
        }
        hax-tray-button:not(:defined),
        a11y-collapse:not(:defined),
        a11y-collapse-group:not(:defined),
        hax-app-browser:not(:defined),
        hax-gizmo-browser:not(:defined) {
          visibility: hidden;
        }
        *[hidden] {
          display: none;
        }
        :host([element-align="right"]) a11y-collapse-group {
          margin: 0 -350px 0 0;
          right: 0;
        }
        :host([element-align="left"]) a11y-collapse-group {
          margin: 0 0 0 -350px;
          left: 0;
        }
        :host([edit-mode][element-align="left"]) a11y-collapse-group,
        :host([edit-mode][element-align="right"]) a11y-collapse-group {
          position: absolute;
          margin: 0;
          top: 32;
        }
        a11y-collapse-group {
          position: fixed;
          font-size: 16px;
          margin: 0;
          background-color: var(--simple-colors-default-theme-grey-1, #fff);
        }
        a11y-collapse {
          font-size: 12px;
          font-weight: normal;
          --a11y-tabs-content-padding: 0;
          width: calc(var(---hax-tray-width, 300px) - 2px);
          --a11y-collapse-heading-color: var(
            --simple-colors-default-theme-grey-7,
            #666
          );
          --a11y-collapse-heading-background-color: var(
            --simple-colors-default-theme-grey-2,
            #eee
          );
          --a11y-collapse-padding-top: 0px;
          --a11y-collapse-padding-right: 0px;
          --a11y-collapse-padding-bottom: 0px;
          --a11y-collapse-padding-left: 0px;
          --a11y-collapse-border: 1px solid
            var(--simple-colors-default-theme-grey-3, #dddddd);
          --a11y-collapse-border-between: 1px solid
            var(--simple-colors-default-theme-grey-3, #dddddd);
          transition: all 0.5ms ease-in-out;
          border-left: 3px solid
            var(--simple-colors-default-theme-grey-3, #dddddd);
        }
        a11y-collapse:not([expanded]) div[slot="content"] {
          display: none;
        }
        a11y-collapse div[slot="heading"] {
          cursor: pointer;
          font-size: 16px;
        }
        a11y-collapse:hover {
          --a11y-collapse-heading-color: var(
            --hax-tray-panel-accent,
            var(--simple-colors-default-theme-grey-12, #000)
          );
          --a11y-collapse-heading-background-color: var(
            --hax-tray-panel-accent-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }
        a11y-collapse:hover {
          border-left: 3px solid
            var(
              --hax-tray-panel-accent,
              var(--hax-contextual-action-hover-color)
            );
        }
        a11y-collapse[expanded],
        a11y-collapse[expanded]:hover {
          --a11y-collapse-heading-color: var(
            --hax-tray-panel-accent,
            var(--hax-contextual-action-hover-color)
          );
          --a11y-collapse-heading-background-color: var(
            --hax-tray-panel-accent-text,
            var(--simple-colors-default-theme-grey-1)
          );
        }
        a11y-collapse[disabled] {
          --a11y-collapse-heading-color: var(
            --simple-colors-default-theme-grey-7,
            #666
          ) !important;
          --a11y-collapse-heading-background-color: var(
            --simple-colors-default-theme-grey-2,
            #eee
          ) !important;
          cursor: not-allowed;
        }
        a11y-collapse[disabled] div[slot="heading"] {
          cursor: not-allowed !important;
          opacity: 0.6;
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
        simple-icon {
          margin-right: 8px;
        }
        .quick-buttons {
          width: var(---hax-tray-width, 300px);
          display: flex;
          color: var(--simple-colors-default-theme-grey-12, #000);
          background-color: var(--simple-colors-default-theme-grey-4, #bbb);
          justify-content: space-between;
          transition: all 0.5ms ease-in-out;
        }
        .quick-buttons hax-tray-button {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
        }
        #button,
        .quick-buttons #haxsavebutton {
          --hax-quick-button-accent: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-cyan-7,
            #009dc7
          );
          --hax-quick-button-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
        }
        .quick-buttons #haxcancelbutton {
          --hax-quick-button-accent: var(
            --simple-colors-default-theme-red-8,
            #ac0000
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-red-7,
            #ee0000
          );
          --hax-quick-button-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
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
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          .ops,
          .quick,
          .quick-buttons {
            flex-direction: row-reverse;
          }
          .wrapper {
            top: 0;
            left: 0;
            right: 0;
            margin: 0 !important;
          }
          .quick-buttons {
            position: relative;
            z-index: 1;
          }
          #toggle-element-align {
            display: none;
          }
          #toggle-tray-size {
            --hax-tray-button-rotate: rotate(-90deg) !important;
          }
          :host([edit-mode][collapsed]) a11y-collapse-group {
            top: -200vh;
            left: unset !important;
            right: unset !important;
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
      ${this.hidePanelOps
        ? ``
        : html`
            <hax-tray-button
              voice-command="edit page"
              .data-opened="${this.editMode}"
              @click="${this._clickEditButton}"
              icon="create"
              id="button"
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
                    event-name="save"
                    voice-command="save (content)(page)"
                    color-meaning
                  ></hax-tray-button>
                  <hax-tray-button
                    mini
                    icon="cancel"
                    id="haxcancelbutton"
                    label="Cancel"
                    event-name="cancel"
                    voice-command="cancel"
                    color-meaning
                  ></hax-tray-button>
                `}
            <hax-tray-button
              mini
              voice-command="toggle menu"
              id="toggle-tray-size"
              event-name="toggle-tray-size"
              icon="${this.traySizeIcon}"
              label="${this.traySizeText}"
              data-simple-tour-stop
            >
              <div data-stop-title>Menu placement</div>
              <div data-stop-content>Expand or collapse the menu visually.</div>
            </hax-tray-button>
            <hax-tray-button
              mini
              voice-command="toggle alignment"
              id="toggle-element-align"
              event-name="toggle-element-align"
              icon="image:photo-size-select-small"
              label="${this.menuAlignName}"
              data-simple-tour-stop
            >
              <div data-stop-title>Menu alignment</div>
              <div data-stop-content>
                Change which side of the screen the menu is affixed to visually.
              </div>
            </hax-tray-button>
          </div>
          <div class="quick">
            <slot name="tray-buttons-pre"></slot>
            <hax-tray-button
              mini
              id="exportbtn"
              icon="code"
              label="View page source"
              voice-command="view (page) source"
              data-simple-tour-stop
              data-stop-title="label"
            >
              <div data-stop-content>
                Every change you make in HAX is ultimately writing HTML. Know
                HTML? Awesome, pop open the source view and make any changes you
                like. HTML is always behind the scenes ensuring that content is
                portable, well formatted and easy to read.
              </div>
            </hax-tray-button>
            <hax-tray-button
              mini
              event-name="start-tour"
              icon="help"
              label="Take a tour"
              voice-command="start tour"
            ></hax-tray-button>
            <hax-tray-button
              mini
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
                Undo the previous operation in the content, whether typing or
                adding a widget.
              </div>
            </hax-tray-button>
            <hax-tray-button
              mini
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
            <hax-tray-button
              mini
              event-name="open-map"
              icon="maps:map"
              id="mapbtn"
              label="Content map"
              voice-command="open map"
              data-simple-tour-stop
              data-stop-title="label"
            >
              <div data-stop-content>
                This is a simple list of all the block areas of the page that
                are clickable to jump through items quickly as well as review
                some simple overview stats.
              </div>
            </hax-tray-button>
            <simple-popover for="mapbtn" auto hidden>
              <hax-map></hax-map>
            </simple-popover>
            <hax-tray-button
              mini
              ?hidden="${this.hidePreferencesButton}"
              id="prefbtn"
              event-name="open-preferences"
              icon="settings"
              label="Advanced settings"
              voice-command="open preferences"
              data-simple-tour-stop
              data-stop-title="label"
            >
              <div data-stop-content>
                Some advanced options for developers and experimental purposes.
              </div>
            </hax-tray-button>
            <simple-popover for="prefbtn" auto hidden>
              <hax-preferences-dialog></hax-preferences-dialog>
            </simple-popover>
          </div>
        </div>
        <a11y-collapse-group accordion radio>
          <slot name="tray-collapse-pre"></slot>
          <a11y-collapse id="addcollapse" accordion data-simple-tour-stop>
            <div slot="heading" data-stop-title>
              <simple-icon icon="hax:add"></simple-icon> Add Content
            </div>
            <div slot="tour" data-stop-content>
              When you want to add any content to the page from text, to images,
              to anything more advanced; you can always find items to add under
              the Add content menu. Click to expand, then either drag and drop
              items into the page or click and have them placed near whatever
              you are actively working on.
            </div>
            <div slot="content">
              <hax-tray-upload></hax-tray-upload>
              <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse id="settingscollapse" accordion data-simple-tour-stop>
            <div slot="heading" data-stop-title>
              <simple-icon icon="${this.activeTagIcon}"></simple-icon> ${this
                .activeTagName}
            </div>
            <div slot="tour" data-stop-content>
              Settings panel changes contextually based on the item you are
              currently working on. If you select a paragraph in the page, it
              will change to a P tag and show settings specific to that element.
              Same for video-player's, meme's, images, tables; litereally
              anything!
            </div>
            <div slot="content">
              <simple-fields
                id="settingsform"
                disable-responsive
              ></simple-fields>
            </div>
          </a11y-collapse>
          <a11y-collapse id="searchapps" accordion data-simple-tour-stop>
            <div slot="heading" data-stop-title>
              <simple-icon icon="hax:search-clear"></simple-icon> Search
            </div>
            <div slot="tour" data-stop-content>
              Search for media and content anywhere that your copy of HAX has
              access to. Pick what to search, perform the search and then click
              or drag the item into the contnet.
            </div>
            <div slot="content">
              <hax-app-browser id="appbrowser"></hax-app-browser>
            </div>
          </a11y-collapse>
          <a11y-collapse
            id="templateslayouts"
            accordion
            @expand="${this._refreshLists}"
            data-simple-tour-stop
          >
            <div slot="heading" data-stop-title>
              <simple-icon icon="hax:templates"></simple-icon>Templates &
              Layouts
            </div>
            <div slot="tour" data-stop-content>
              Predefined layouts and templated areas. use this to rapidly create
              page content which you can then move around and break apart as
              needed.
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
  _refreshLists(e) {
    this.shadowRoot.querySelector("#bloxbrowser").bloxList = [
      ...HAXStore.bloxList,
    ];
    this.shadowRoot.querySelector("#staxbrowser").staxList = [
      ...HAXStore.staxList,
    ];
  }
  /**
   * Process event for simple content inserts.
   */
  _processTrayEvent(e) {
    let detail = e.detail;
    var target = null;
    if (e.path && e.path[0]) {
      target = e.path[0];
    } else if (e.originalTarget) {
      target = e.originalTarget;
    } else {
      target = e.target;
    }
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "insert-stax":
        this.shadowRoot.querySelector("#settingscollapse").expand();
        this.dispatchEvent(
          new CustomEvent("hax-insert-content-array", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: target.stax,
          })
        );
        break;
      case "insert-blox":
        let content = "";
        for (var i = 0; i < target.blox.length; i++) {
          let node = haxElementToNode({
            tag: target.blox[i].tag,
            content: target.blox[i].content,
            properties: target.blox[i].properties,
          });
          content += HAXStore.nodeToContent(node);
        }
        // generate a hax element
        let blox = {
          tag: "grid-plate",
          properties: {
            layout: target.layout,
          },
          content: content,
        };
        this.shadowRoot.querySelector("#settingscollapse").expand();
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: blox,
          })
        );
        break;
      case "insert-tag":
        let gizmo = {
          tag: detail.value,
        };
        let properties = JSON.parse(target.getAttribute("event-properties"));
        let innerContent = target.getAttribute("event-content");
        if (properties == null) {
          properties = {};
        }
        if (innerContent == null) {
          innerContent = "";
        }
        // most likely empty values but just to be safe
        let element = HAXStore.haxElementPrototype(
          gizmo,
          properties,
          innerContent
        );
        this.shadowRoot.querySelector("#settingscollapse").expand();
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: element,
          })
        );
        break;
      case "open-preferences":
        this.shadowRoot.querySelector(
          "simple-popover[for='prefbtn']"
        ).hidden = !this.shadowRoot.querySelector(
          "simple-popover[for='prefbtn']"
        ).hidden;
        this.shadowRoot
          .querySelector("hax-preferences-dialog")
          .reloadPreferencesForm();
        break;
      case "toggle-element-align":
        this.elementAlign = this.elementAlign === "right" ? "left" : "right";
        break;
      case "toggle-tray-size":
        this.collapsed = !this.collapsed;
        break;
      case "open-map":
        this.shadowRoot.querySelector(
          "simple-popover[for='mapbtn']"
        ).hidden = !this.shadowRoot.querySelector(
          "simple-popover[for='mapbtn']"
        ).hidden;
        this.shadowRoot.querySelector("hax-map").updateHAXMap();
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
        HAXStore.editMode = false;
        this.dispatchEvent(
          new CustomEvent("hax-cancel", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail,
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
        type: String,
      },
      menuAlignName: {
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
      traySizeText: {
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
       * Tag name / what to display based on active element
       */
      activeTagIcon: {
        type: String,
      },
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
            context: this.shadowRoot.querySelector(
              '#addcollapse div[slot="heading"]'
            ),
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
            context: this.shadowRoot.querySelector(
              '#settingscollapse div[slot="heading"]'
            ),
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
            context: this.shadowRoot.querySelector(
              '#searchapps div[slot="heading"]'
            ),
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
            command: ":name: (collapse)(open)(expand)(toggle) templates (menu)",
            context: this.shadowRoot.querySelector(
              '#templateslayouts div[slot="heading"]'
            ),
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
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this._editModeChanged(this[propName]);
      }
      if (propName == "offsetMargin") {
        setTimeout(() => {
          this.shadowRoot.querySelector(
            ".wrapper"
          ).style.margin = this.offsetMargin;
        }, 0);
      }
      // collaped menu state change
      if (propName == "collapsed") {
        if (this[propName]) {
          this.traySizeIcon = "hax:arrow-expand-left";
          this.traySizeText = "Expand";
          // accessibility to disable entering panels that are not visible
          this.shadowRoot
            .querySelector("a11y-collapse-group")
            .setAttribute("aria-disabled", "true");
          this.shadowRoot
            .querySelector("a11y-collapse-group")
            .setAttribute("tabindex", "-1");
          this._editModeChanged(this.editMode);
        } else {
          this.traySizeIcon = "hax:arrow-expand-right";
          this.traySizeText = "Collapse";
          // a11y clean up to match state
          this.shadowRoot
            .querySelector("a11y-collapse-group")
            .removeAttribute("aria-disabled");
          this.shadowRoot
            .querySelector("a11y-collapse-group")
            .removeAttribute("tabindex");
        }
      }
      //
      if (propName == "elementAlign") {
        if (this[propName] == "left") {
          this.menuAlignName = "Right align menu";
        } else {
          this.menuAlignName = "Left align menu";
        }
      }
      // active Gizmo changed
      if (propName == "activeGizmo") {
        if (this.activeGizmo) {
          this.activeTagName = this.activeGizmo.title + " Settings";
          this.activeTagIcon = this.activeGizmo.icon;
          if (
            !oldValue &&
            !this.shadowRoot.querySelector("#settingscollapse").expanded
          ) {
            this.shadowRoot
              .querySelector('#settingscollapse div[slot="heading"]')
              .click();
          }
        } else {
          this.activeTagName = "Select an element";
          this.activeTagIcon = "icons:settings";
          if (!this.shadowRoot.querySelector("#addcollapse").expanded) {
            this.shadowRoot
              .querySelector('#addcollapse div[slot="heading"]')
              .click();
          }
        }
      }
      // active node changed
      if (propName == "activeNode") {
        if (this.activeNode && this.activeNode.tagName) {
          this.shadowRoot.querySelector("#settingscollapse").disabled = false;
          this.refreshActiveNodeForm();
        } else {
          this.activeTagName = "Select an element to configure";
          this.activeTagIcon = "icons:settings";
          this.shadowRoot.querySelector("#settingscollapse").disabled = true;
        }
      }
    });
  }
  /**
   * refresh / rebuild the form based on active item
   */
  refreshActiveNodeForm() {
    this.activeHaxElement = nodeToHaxElement(this.activeNode, null);
    this._setupForm();
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
            // this is a special internal held "property" for layout stuff
            else if (key === "layout" && prop === "__scale") {
              setAhead = true;
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
  }

  /**
   * _editModeChanged
   */
  _editModeChanged(newValue) {
    if (typeof newValue !== typeof undefined && newValue) {
      this.__tipText = "Save content";
      this.shadowRoot.querySelector("#button").icon = "save";
    } else {
      this.__tipText = "Edit content";
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
