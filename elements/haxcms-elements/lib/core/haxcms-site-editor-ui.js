import { html, css, unsafeCSS } from "lit";
import { store } from "./haxcms-site-store.js";
import {
  HaxStore,
  HAXStore,
} from "@lrnwebcomponents/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import {
  localStorageSet,
  winEventsElement,
} from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { HAXCMSThemeParts } from "./utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@lrnwebcomponents/rpg-character/rpg-character.js";
import "@lrnwebcomponents/app-hax/lib/v1/app-hax-top-bar.js";
import "@lrnwebcomponents/app-hax/lib/v1/app-hax-user-menu.js";
import "@lrnwebcomponents/app-hax/lib/v1/app-hax-user-menu-button.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SuperDaemonInstance } from "@lrnwebcomponents/super-daemon/super-daemon.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "./haxcms-site-insights.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import "./micros/haxcms-button-add.js";
import "./haxcms-darkmode-toggle.js";
import "../ui-components/site/site-remote-content.js";
import "@lrnwebcomponents/page-flag/page-flag.js";
import "wired-elements/lib/wired-button.js";

const ButtonBGLight = new URL(
  "../../../app-hax/lib/assets/images/ButtonBGLM.svg",
  import.meta.url
).href;
const ButtonBGDark = new URL(
  "../../../app-hax/lib/assets/images/ButtonBGDM.svg",
  import.meta.url
).href;
const LogOut = new URL(
  "../../../app-hax/lib/assets/images/Logout.svg",
  import.meta.url
).href;
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
class HAXCMSSiteEditorUI extends HAXCMSThemeParts(
  HAXCMSI18NMixin(winEventsElement(ResponsiveUtilityBehaviors(SimpleColors)))
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host *:not(:defined) {
          display: none;
        }
        :host {
          display: block;
          position: relative;
          height: 48px;
          left: 0;
          top: 0;
          right: 0;
          margin-top: 0;
          opacity: 1;
          transition: all 0.6s ease-in-out;
          background-color: var(--haxcms-system-bg, #eeeeee);
          z-index: 10000;
          visibility: visible;
        }
        :host([edit-mode]) {
          z-index: 9999;
        }
        :host([dashboard-opened]) {
          left: 50vw;
        }
        /**
         * Dashboard open trumps all contextual settings
         */
        :host([dashboard-opened]) #editbutton,
        :host([dashboard-opened]) #editdetails,
        :host([dashboard-opened]) #deletebutton,
        :host([dashboard-opened]) #addbutton,
        :host([dashboard-opened]) #outlinebutton,
        :host([dashboard-opened]) #insightsbutton,
        :host([dashboard-opened]) #addmenubutton,
        :host([dashboard-opened]) #addbuttonchild,
        :host([dashboard-opened]) #duplicatebutton {
          display: none !important;
        }
        :host *[hidden] {
          display: none;
        }
        simple-tooltip:not(:defined) {
          display: none !important;
        }
        :host([painting]) {
          opacity: 0;
          margin-top: -48px;
          visibility: hidden;
        }
        #editbutton {
          visibility: hidden;
          opacity: 0;
        }
        :host([page-allowed]) #editbutton,
        :host([page-allowed]) #editdetails,
        :host([page-allowed]) #deletebutton {
          visibility: visible;
          opacity: 1;
        }
        #addmenubutton:hover,
        #addmenubutton:active,
        #addmenubutton:focus,
        #addmenubutton haxcms-button-add:hover,
        #addmenubutton haxcms-button-add:active,
        #addmenubutton haxcms-button-add:focus,
        #editbutton[icon="icons:save"]:focus,
        #editbutton[icon="icons:save"]:active,
        #editbutton[icon="icons:save"]:hover {
          background-color: var(--simple-colors-default-theme-light-green-1);
        }
        #addmenubutton,
        #addmenubutton haxcms-button-add,
        #editbutton[icon="icons:save"] {
          --simple-toolbar-border-color: var(
            --simple-colors-default-theme-light-green-2
          );
          color: var(--simple-colors-default-theme-green-11);
          background-color: var(--simple-colors-default-theme-grey-1);
        }

        haxcms-button-add {
          background-color: var(--simple-colors-default-theme-grey-1);
        }

        #deletebutton,
        #cancelbutton {
          color: var(--simple-colors-default-theme-red-11);
          --simple-toolbar-border-color: var(
            --simple-colors-default-theme-red-2
          );
          margin-right: 64px;
        }
        #merlin {
          color: var(--simple-colors-default-theme-purple-10);
          --simple-toolbar-border-color: var(
            --simple-colors-default-theme-purple-2
          );
        }
        #merlin:hover,
        #merlin:active,
        #merlin:focus {
          background-color: var(--simple-colors-default-theme-purple-1);
        }
        #deletebutton:hover,
        #deletebutton:active,
        #deletebutton:focus,
        #cancelbutton:hover,
        #cancelbutton:active,
        #cancelbutton:focus {
          background-color: var(--simple-colors-default-theme-red-1);
        }
        simple-toolbar-menu:hover,
        simple-toolbar-menu:active,
        simple-toolbar-menu:focus,
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus,
        haxcms-button-add:hover,
        haxcms-button-add:active,
        haxcms-button-add:focus {
          background-color: var(--hax-ui-background-color-accent);
          color: var(--hax-ui-color);
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus,
        haxcms-button-add:hover,
        haxcms-button-add:active,
        haxcms-button-add:focus {
          --simple-toolbar-border-color: var(--hax-ui-color-accent);
        }
        :host(:hover),
        :host(:active),
        :host(:focus) {
          opacity: 1;
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 200ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
          font-family: "Press Start 2P", sans-serif;
        }
        app-hax-top-bar {
          z-index: 1000;
          right: 0;
          left: 0;
          position: fixed;
        }
        :host([dark-mode]) app-hax-top-bar {
          --bg-color: #222;
          --accent-color: #fff;
        }
        app-hax-top-bar::part(top-bar) {
          grid-template-columns: 5% 85% 10%;
          overflow: visible;
        }
        .haxLogo {
          color: var(--simple-colors-default-theme-accent-11, black);
        }
        :host([dark-mode]) .haxLogo:hover,
        :host([dark-mode]) .haxLogo:focus,
        :host([dark-mode]) .haxLogo:active,
        .haxLogo:hover,
        .haxLogo:focus,
        .haxLogo:active {
          color: var(--haxcms-color);
        }
        .haxLogo simple-icon-lite {
          --simple-icon-height: 40px;
          --simple-icon-width: 40px;
          margin: 4px;
        }
        .soundToggle {
          position: relative;
          display: inline-flex;
          vertical-align: top;
        }

        .soundToggle img {
          width: 24px;
          height: 24px;
        }

        :host([edit-mode]) simple-toolbar simple-toolbar-button,
        :host([edit-mode]) simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-color: var(--hax-ui-color-accent);
          --simple-toolbar-border-color: #dddddddd;
        }

        simple-toolbar simple-toolbar-button,
        simple-toolbar simple-toolbar-menu {
          --simple-toolbar-border-radius: 0;
          background-color: var(--simple-colors-default-theme-grey-1);
        }

        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        simple-toolbar {
          align-items: stretch;
          justify-content: center;
          height: var(--top-bar-height);
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
        }
        simple-toolbar[dark-mode] {
          --simple-toolbar-button-color: #e0e0e0;
          --simple-toolbar-button-hover-color: #fff;
          --simple-toolbar-button-bg: #222;
          --simple-toolbar-button-hover-bg: #000;
        }
        simple-toolbar::part(buttons) {
          flex: 0 1 auto;
        }
        .ops-panel {
          justify-content: space-around;
          display: flex;
          padding: 4px 0px;
        }

        .topbar-character {
          cursor: pointer;
          display: inline-block;
          border: none;
          border-radius: 0px;
          padding: 0 8px;
          margin: 0 0 0 16px;
          background-color: transparent;
          height: 48px;
          max-width: 160px;
          overflow: hidden;
          word-break: break-all;
          transition: all 0.6 ease-in-out;
        }
        .characterbtn-name {
          font-family: "Press Start 2P", sans-serif;
          margin-left: 8px;
          font-size: 12px;
          vertical-align: bottom;
          line-height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 48px;
          word-break: break-all;
        }
        :host([dark-mode]) .topbar-character,
        :host([dark-mode]) .topbar-character {
          color: #e0e0e0;
          background-color: #222;
        }
        .topbar-character rpg-character {
          margin: -4px -14px 0px -10px;
          height: 52px;
          width: 64px;
          display: inline-block;
          transform: scale(0.7);
          transition: all 0.5 ease-in-out;
        }
        .topbar-character:hover rpg-character,
        .topbar-character:focus rpg-character {
          transform: scale(0.9);
        }

        .logout::part(menu-button) {
          background-image: url("${unsafeCSS(LogOut)}");
          background-repeat: no-repeat;
          background-position: center center;
          text-align: center;
          background-size: cover;
          border-top: 0px;
          border-bottom: 0px;
          padding: 10px;
          font-family: "Press Start 2P", sans-serif;
        }
        app-hax-user-menu app-hax-user-menu-button::part(menu-button) {
          font-family: "Press Start 2P", sans-serif;
          font-size: 12px;
        }
        simple-toolbar-menu,
        simple-toolbar-button {
          min-width: 48px;
          margin: 0;
          --simple-toolbar-border-color: #dddddddd;
        }
        :host([responsive-size="xs"]) #deletebutton,
        :host([responsive-size="sm"]) #deletebutton,
        :host([responsive-size="md"]) #deletebutton,
        :host([responsive-size="xs"]) #cancelbutton,
        :host([responsive-size="sm"]) #cancelbutton,
        :host([responsive-size="md"]) #cancelbutton {
          margin-right: 16px;
        }

        @media screen and (max-width: 800px) {
          :host([dashboard-opened]) {
            left: 90vw;
          }
          :host([edit-mode]) {
            bottom: unset;
          }
          app-hax-top-bar::part(top-bar) {
            grid-template-columns: 5% 85% 10%;
          }
          #undo,
          #redo {
            display: none;
          }
          .topbar-character {
            padding: 0;
            margin: 0;
          }
          .characterbtn-name {
            padding: 0;
            margin: 0;
            width: 30px;
            display: inline-flex;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -2px;
            margin-left: -6px;
          }
          simple-toolbar {
            --simple-toolbar-button-padding: 3px 3px;
          }
          .characterbtn-name,
          haxcms-button-add,
          simple-toolbar-menu,
          simple-toolbar-button {
            font-size: 10px;
          }
          simple-toolbar-menu {
            --icon-offset-right: 2px;
            --icon-offset-left: 2px;
          }
          simple-toolbar-menu::part(dropdown-icon) {
            right: 0;
            top: 10px;
          }
          :host([edit-mode]) #deletebutton,
          :host([edit-mode]) #addmenubutton,
          :host([edit-mode]) #editdetails {
            display: none;
          }
        }
        @media (max-width: 600px) {
          simple-toolbar {
            --simple-toolbar-button-padding: 0px;
          }
          .haxLogo simple-icon-lite {
            margin: 0px;
          }
          .characterbtn-name {
            display: none;
          }
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor-ui";
  }
  // ability to link to internal content inside of the 'a' tag
  _internalLinkChanged(e) {
    // look up the UUID
    if (e.detail.value && store.findItem(e.detail.value)) {
      const item = toJS(store.findItem(e.detail.value));
      HAXStore.haxTray.shadowRoot.querySelector(
        "[name='settings.configure.href']"
      ).value = item.slug;
    }
  }
  _expandSettingsPanel(e) {
    this.shadowRoot.querySelector("#content-edit").click();
  }
  constructor() {
    super();
    this.__winEvents = {
      "can-redo-changed": "_redoChanged",
      "can-undo-changed": "_undoChanged",
      "hax-drop-focus-event": "_expandSettingsPanel",
      "hax-store-ready": "haxStoreReady",
      "jwt-logged-in": "_jwtLoggedIn",
    };
    this.rpgHat = "none";
    this.darkMode = false;
    this.__settingsText = "";
    this.__editText = "";
    this.userMenuOpen = false;
    this.soundIcon = "";
    this.__disposer = this.__disposer || [];
    this.t = this.t || {};
    // allow commands to go through at any time
    // hax-store default is only when editor is open to avoid conflicts w/ other UX
    SuperDaemonInstance.allowedCallback = () => {
      return true;
    };
    // nothing message so we can suggest a link to make a suggestion
    SuperDaemonInstance.noResultsSlot = () => {
      return html`Expecting to see results?
        <a
          @click="${(e) => {
            HAXStore._haxStoreContribute(
              "merlin",
              "POP,enhancement",
              SuperDaemonInstance.commandContext +
                " " +
                SuperDaemonInstance.like
            );
          }}"
          >Make a suggestion</a
        >
        for what you thought you would see here!`;
    };
    SuperDaemonInstance.appendContext("CMS");

    if (HAXStore.ready) {
      let s = document.createElement("site-remote-content");
      HAXStore.haxAutoloader.appendChild(s);
      // site-remote-content injects citation element so ensure it's in there too!
      let ce = document.createElement("citation-element");
      HAXStore.haxAutoloader.appendChild(ce);
      // page-flag for author notes
      let flag = document.createElement("page-flag");
      HAXStore.haxAutoloader.appendChild(flag);

      // links need to be given support for internal linkage updates on the form
      if (!HAXStore.primativeHooks.a) {
        HAXStore.primativeHooks.a = {};
      }
      HAXStore.primativeHooks.a.setupActiveElementForm = (props) => {
        const itemManifest = store.getManifestItems(true);
        // default to null parent as the whole site
        var items = [
          {
            text: `-- ${this.t.selectPage} --`,
            value: null,
          },
        ];
        itemManifest.forEach((el) => {
          if (el.id != this.itemId) {
            // calculate -- depth so it looks like a tree
            let itemBuilder = el;
            // walk back through parent tree
            let distance = "- ";
            while (itemBuilder && itemBuilder.parent != null) {
              itemBuilder = itemManifest.find(
                (i) => i.id == itemBuilder.parent
              );
              // double check structure is sound
              if (itemBuilder) {
                distance = "--" + distance;
              }
            }
            items.push({
              text: distance + el.title,
              value: el.id,
            });
          }
        });
        props.settings.configure.splice(1, 0, {
          property: "data-uuid",
          title: "Internal content",
          description: "Link to content internal to this site",
          inputMethod: "select",
          itemsList: items,
        });
        setTimeout(() => {
          HAXStore.haxTray.shadowRoot
            .querySelector("[name='settings.configure.data-uuid']")
            .addEventListener(
              "value-changed",
              this._internalLinkChanged.bind(this)
            );
        }, 100);
      };
    }
    this.t = {
      ...this.t,
      selectPage: "Select page",
      backToSiteList: "Back to site list",
      cancel: "Cancel",
      editDetails: "Page details",
      add: "Add",
      editSettings: "Edit settings",
      source: "Source",
      viewSource: "View source",
      findMedia: "Find media",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      outline: "Outline",
      blocks: "Blocks",
      addBlock: "Add block",
      addPage: "Add page",
      addChildPage: "Add child page",
      clonePage: "Clone page",
      importDocxFile: "Import docx file",
      delete: "Delete page",
      shareSite: "Share site",
      siteSettings: "Site settings",
      close: "Close",
      settings: "Settings",
      editPage: "Edit page",
      edit: "Edit",
      configureBlock: "Configure block",
      configure: "Configure",
      save: "Save",
      saveChanges: "Save changes",
      newJourney: "New Journey",
      accountInfo: "Account Info",
      outlineDesigner: "Outline designer",
      pageOutline: "Page outline",
      more: "More",
      siteActions: "Site actions",
      insights: "Insights dashboard (beta)",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      logOut: "Log out",
      menu: "Menu",
      showMore: "More",
    };
    this.backText = "Site list";
    this.painting = true;
    this.pageAllowed = false;
    this.editMode = false;
    this.__editIcon = "hax:page-edit";
    this.icon = "hax:site-settings";
    this.manifestEditMode = false;
    this.backLink = "../../";
    this.activeTagName = "";
    this.activeNode = null;
    if (window.appSettings && window.appSettings.backLink) {
      this.backLink = window.appSettings.backLink;
    }
    autorun(() => {
      const activeGizmo = toJS(HAXStore.activeGizmo);
      if (activeGizmo && activeGizmo.title) {
        this.activeTagName = activeGizmo.title;
      }
    });
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
    });
    autorun(() => {
      const badDevice = toJS(store.badDevice);
      // good device, we can inject font we use
      if (badDevice === false) {
        const link = document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        );
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        document.head.appendChild(link);
      } else if (badDevice === true) {
        document.body.classList.add("bad-device");
      }
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
      this.dark = this.darkMode;
      if (toJS(store.darkMode)) {
        SuperDaemonInstance.dark = true;
        SuperDaemonInstance.toastInstance.darkMode = true;
        HAXStore.globalPreferences.haxUiTheme = "haxdark";
      } else {
        HAXStore.globalPreferences.haxUiTheme = "hax";
        SuperDaemonInstance.dark = false;
        SuperDaemonInstance.toastInstance.darkMode = false;
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus)
        ? new URL(
            "../../../app-hax/lib/assets/images/FullVolume.svg",
            import.meta.url
          ).href
        : new URL(
            "../../../app-hax/lib/assets/images/Silence.svg",
            import.meta.url
          ).href;
    });
    setTimeout(() => {
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-share-dialog.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-dashboard.js"
      );
    }, 0);
  }
  haxStoreReady(e) {
    // it is safe to add in elements that we want the editor to have every haxcms instance
    if (e.detail) {
      let s = document.createElement("site-remote-content");
      HAXStore.haxAutoloader.appendChild(s);
    }
  }
  soundToggle() {
    const status = !toJS(store.soundStatus);
    store.soundStatus = status;
    localStorageSet("app-hax-soundStatus", status);
    if (!status) {
      store.toast("Sound off.. hey.. HELLO!?!", 2000, { fire: true });
    } else {
      store.toast("Can you hear me now? Good.", 2000, { hat: "random" });
      store.playSound("click");
    }
  }

  closeMenu() {
    this.userMenuOpen = false;
  }

  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    store.playSound("click");
  }
  getIconPosition(size) {
    return !["xl", "lg"].includes(size) ? "top" : "left";
  }
  // render function
  render() {
    return html`
      <app-hax-top-bar part="top-bar" ?edit-mode="${this.editMode}">
        <span slot="left" class="home-btn">
          <a
            href="${this.backLink}"
            class="haxLogo"
            id="backtosites"
            part="hax-logo"
          >
            <simple-icon-lite icon="hax:hax2022"></simple-icon-lite>
          </a>
          <simple-tooltip for="backtosites" position="right"
            >${this.backText}</simple-tooltip
          >
          <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
        </span>
        <simple-toolbar
          slot="center"
          ?dark="${!this.darkMode}"
          icon-position="${this.getIconPosition(this.responsiveSize)}"
          show-text-label
          label="${this.t.showMore}"
        >
          <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
          <simple-toolbar-button
            hidden
            id="editbutton"
            icon="${this.__editIcon}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._editButtonTap}"
            label="${this.__editText}"
            show-text-label
            voice-command="edit (this) page"
          ></simple-toolbar-button>
           <simple-toolbar-button
            icon="icons:undo"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            ?disabled="${!this.canUndo}"
            @click="${this.haxButtonOp}"
            label="${this.t.undo}"
            data-event="undo"
            id="undo"
            ?hidden="${!this.editMode}"
            voice-command="undo"
            show-text-label
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            icon="icons:redo"
            @click="${this.haxButtonOp}"
            ?disabled="${!this.canRedo}"
            ?hidden="${!this.editMode}"
            label="${this.t.redo}"
            data-event="redo"
            id="redo"
            voice-command="redo"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            id="cancelbutton"
            icon="icons:cancel"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            @click="${this._cancelButtonTap}"
            .hidden="${!this.editMode}"
            show-text-label
            tabindex="${this.editMode ? "0" : "-1"}"
            label="${this.t.cancel}"
            voice-command="cancel (editing)"
          ></simple-toolbar-button>

          <simple-toolbar-menu
            id="addmenubutton"
            ?hidden="${this.editMode}"
            icon="hax:add-page"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            label="${this.t.add}.."
            tabindex="${this.editMode ? "-1" : "0"}"
            @dblclick="${this._addPageClick}"
            show-text-label
          >
            <simple-toolbar-menu-item>
              <haxcms-button-add
                hidden
                ?disabled="${this.editMode}"
                show-text-label
                id="addbutton"
                show-text-label
                data-super-daemon-label="${this.t.addPage}"
                data-super-daemon-icon="hax:add-page"
                data-super-daemon-path="CMS/action/create/page"
              >
              </haxcms-button-add>
            </simple-toolbar-menu-item>
            <simple-toolbar-menu-item>
              <haxcms-button-add
                hidden
                ?disabled="${this.editMode}"
                id="addbuttonchild"
                type="child"
                show-text-label
                data-super-daemon-path="CMS/action/create/child"
                data-super-daemon-label="${this.t.addChildPage}"
                data-super-daemon-icon="hax:add-child-page"
              ></haxcms-button-add>
            </simple-toolbar-menu-item>
              <haxcms-button-add
                hidden
                ?disabled="${this.editMode}"
                type="duplicate"
                id="duplicatebutton"
                show-text-label
                data-super-daemon-path="CMS/action/create/duplicate"
                data-super-daemon-label="${this.t.clonePage}"
                data-super-daemon-icon="hax:duplicate"
              ></haxcms-button-add>
            </simple-toolbar-menu-item>
          </simple-toolbar-menu>
          
          <simple-toolbar-button
            ?hidden="${this.editMode}"
            tabindex="${this.editMode ? "-1" : "0"}"
            id="deletebutton"
            hidden
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            icon="icons:delete"
            @click="${this._deleteButtonTap}"
            label="${this.t.delete}"
            show-text-label
            voice-command="delete page"
          ></simple-toolbar-button>


          <simple-toolbar-button
            icon="hax:wizard-hat"
            label="${this.t.merlin}"
            voice-command="${this.t.merlin}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            id="merlin"
            @click="${this.haxButtonOp}"
            data-event="super-daemon"
            show-text-label
           ></simple-toolbar-button>

          <simple-toolbar-button
            data-event="content-edit"
            icon="settings"
            @click="${this.haxButtonOp}"
            id="content-edit"
            label="${this.t.configureBlock}"
            ?hidden="${!this.editMode}"
            ?disabled="${
              !this.activeTagName ||
              this.activeTagName == "" ||
              !this.activeNode ||
              !this.activeNode.tagName
            }"
            voice-command="(modify)(configure)(edit) selected"
            controls="tray-detail"
            tooltip="${this.t.configure} ${this.activeTagName}"
            toggles
            ?toggled="${this.trayDetail === "content-edit"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            data-event="content-add"
            icon="hax:add-brick"
            id="content-add"
            label="${this.t.addBlock}"
            voice-command="select blocks (menu)"
            toggles
            ?toggled="${this.trayDetail === "content-add"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
            @click="${this.haxButtonOp}"
          >
          </simple-toolbar-button>
          <simple-toolbar-button
            ?hidden="${!this.editMode}"
            icon="hax:multimedia"
            label="${this.t.findMedia}"
            voice-command="select media (menu)"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
            data-event="media-program"
            @click="${this.haxButtonOp}"
          >
          </simple-toolbar-button>
          <simple-toolbar-button
           ?hidden="${!this.editMode}"
            data-event="content-map"
            icon="hax:newspaper"
            id="content-map"
            label="${this.t.pageOutline}"
            voice-command="select content outline (menu)"
            toggles
            @click="${this.haxButtonOp}"
            ?toggled="${this.trayDetail === "content-map"}"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
          >
          </simple-toolbar-button>

          <simple-toolbar-button
            id="exportbtn"
            icon="hax:html-code"
            label="${this.t.viewSource}"
            data-event="view-source"
            @click="${this.haxButtonOp}"
            voice-command="view (page) source"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            show-text-label
            ?hidden="${!this.editMode}"
          >
          </simple-toolbar-button>

          <simple-toolbar-menu
            show-text-label
            ?hidden="${this.editMode}"
            icon="hax:home-edit"
            part="morebtn"
            icon-position="${this.getIconPosition(this.responsiveSize)}"
            label="${this.t.siteActions}"
            tabindex="${this.editMode ? "-1" : "0"}"
          >
            <simple-toolbar-menu-item>
              <simple-toolbar-button
              ?hidden="${this.editMode}"
              tabindex="${this.editMode ? "-1" : "0"}"
              id="outlinebutton"
              @click="${this._outlineButtonTap}"
              icon-position="left"
              icon="hax:site-map"
              part="outlinebtn"
              show-text-label
              label="${this.t.outlineDesigner}"
            ></simple-toolbar-button>
            </simple-toolbar-menu-item>
            <simple-toolbar-menu-item>
            <simple-toolbar-button
              ?hidden="${this.editMode}"
              tabindex="${this.editMode ? "-1" : "0"}"
              id="insightsbutton"
              icon="hax:clipboard-pulse"
              part="insightsbtn"
              icon-position="left"
              @click="${this._insightsButtonTap}"
              label="${this.t.insights}"
              show-text-label
              voice-command="insights"
            ></simple-toolbar-button>
            </simple-toolbar-menu-item>

            <simple-toolbar-menu-item>
            <simple-toolbar-button
              ?hidden="${this.editMode}"
              tabindex="${this.editMode ? "-1" : "0"}"
              id="sharebutton"
              @click="${this._shareButtonTap}"
              icon="social:share"
              part="sharebtn"
              show-text-label
              icon-position="left"
              label="${this.t.shareSite}"
            ></simple-toolbar-button>
            </simple-toolbar-menu-item>
            <simple-toolbar-menu-item>
              <haxcms-button-add
                hidden
                ?disabled="${this.editMode}"
                type="docximport"
                id="docximport"
                show-text-label
                data-super-daemon-path="CMS/action/import/docx"
                data-super-daemon-label="${this.t.importDocxFile}"
                data-super-daemon-icon="hax:file-docx"
              ></haxcms-button-add>
            </simple-toolbar-menu-item>
            <simple-toolbar-menu-item>
              <simple-toolbar-button
                @click="${this._manifestButtonTap}"
                icon-position="left"
                icon="${this.icon}"
                part="manifestbtn"
                id="manifestbtn"
                show-text-label
                tabindex="${this.editMode ? "0" : "-1"}"
                label="${this.__settingsText}"
              ></simple-toolbar-button>
            </simple-toolbar-menu-item>
            
          </simple-toolbar-menu>
          <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
        </simple-toolbar>

        <app-hax-user-menu slot="right" id="user-menu" part="app-hax-user-menu"
        ?is-open="${this.userMenuOpen}" @mouseleave="${this.closeMenu}">
          <button
            class="topbar-character"
            slot="menuButton"
            @click="${this.toggleMenu}"
          >
            <rpg-character
              seed="${this.userName}"
              width="68"
              height="68"
              part="rpgcharacter"
              aria-label="${this.t.menu}"
              hat="${this.rpgHat}"
            ></rpg-character>
            <span class="characterbtn-name">${this.userName}</span>
            <slot name="haxcms-site-editor-ui-topbar-character-button"></slot>
          </button>
          <div slot="pre-menu" class="ops-panel">
            <slot name="haxcms-site-editor-ui-pre-menu"></slot>
            <wired-button
              elevation="1"
              class="soundToggle"
              @click="${this.soundToggle}"
            >
              <simple-icon-lite
                src="${this.soundIcon}"
                loading="lazy"
                decoding="async"
              ></simple-icon-lite>
            </wired-button>
            <haxcms-darkmode-toggle></haxcms-darkmode-toggle>
          </div>
          <!-- <app-hax-user-menu-button
          slot="main-menu"
          icon="face"
          label="${this.t.accountInfo}"
        ></app-hax-user-menu-button> -->
          <slot slot="main-menu" name="haxcms-site-editor-ui-main-menu"></slot>
          <app-hax-user-menu-button
            slot="main-menu"
            icon="add"
            label="${this.t.newJourney}"
            part="newjourneybtn"
            @click="${this._addButtonTap}"
          ></app-hax-user-menu-button>
          <slot slot="post-menu" name="haxcms-site-editor-ui-post-menu"></slot>
          <app-hax-user-menu-button
            slot="post-menu"
            part="logoutbtn"
            class="logout"
            label="${this.t.logOut}"
            @click=${this._logout}
          ></app-hax-user-menu-button>
        </app-hax-user-menu>
      </app-hax-top-bar>
    `;
  }

  haxButtonOp(e) {
    let exec = e.target.getAttribute("data-event");
    switch (exec) {
      case "super-daemon":
        store.playSound("click");
        SuperDaemonInstance.open();
        HAXStore.haxTray.collapsed = false;
        break;
      case "media-program":
        store.playSound("click");
        SuperDaemonInstance.runProgram("/", {}, null, null, "", "sources");
        SuperDaemonInstance.open();
        HAXStore.haxTray.collapsed = false;
        break;
      case "content-edit":
      case "content-map":
      case "content-add":
        if (HAXStore.haxTray.trayDetail == exec) {
          HAXStore.haxTray.collapsed = !HAXStore.haxTray.collapsed;
        } else {
          HAXStore.haxTray.collapsed = false;
        }
        HAXStore.haxTray.trayDetail = exec;
        break;
      case "undo":
        HAXStore.activeHaxBody.undo();
        break;
      case "redo":
        HAXStore.activeHaxBody.redo();
        break;
      case "view-source":
        HAXStore.haxTray.trayDetail = exec;
        HAXStore.haxTray.shadowRoot.querySelector("#view-source").openSource();
        HAXStore.haxTray.collapsed = false;
        break;
    }
  }

  _logout() {
    window.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      })
    );
    this.__logoutUserAction = true;
  }
  // only care about logouts
  _jwtLoggedIn(e) {
    if (e.detail === false && this.__logoutUserAction) {
      this.__logoutUserAction = false;
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  _addPageClick(e) {
    // ensure they see thes operations
    if (
      !this.editMode &&
      this.shadowRoot.querySelector(
        "simple-toolbar-menu-item haxcms-button-add:not([hidden])"
      )
    ) {
      this.shadowRoot
        .querySelector(
          "simple-toolbar-menu-item haxcms-button-add:not([hidden])"
        )
        .HAXCMSButtonClick();
    }
  }

  /**
   * update buttons since these are triggered by a mix of
   * differnet backend types we can't leverage the store
   * since a CMS needs to just hardcode these at run time
   * for some environments
   */
  updateAvailableButtons() {
    if (this.shadowRoot) {
      setTimeout(() => {
        // backText
        if (window.appSettings && window.appSettings.backText) {
          this.backText = window.appSettings.backText;
        }
        let ary = [
          {
            varPath: "deleteNodePath",
            selector: "#deletebutton",
          },
          {
            varPath: "saveNodePath",
            selector: "#editbutton",
          },
          {
            varPath: "createNodePath",
            selector: "#addbutton",
          },
          {
            varPath: "createNodePath",
            selector: "#addbuttonchild",
          },
          {
            varPath: "createNodePath",
            selector: "#duplicatebutton",
          },
          {
            varPath: "createNodePath",
            selector: "#docximport",
          },
        ];
        // see which features should be enabled
        ary.forEach((pair) => {
          if (
            window.appSettings &&
            window.appSettings[pair.varPath] &&
            window.appSettings[pair.varPath] != null &&
            window.appSettings[pair.varPath] != "" &&
            window.appSettings[pair.varPath] != "null"
          ) {
            if (pair.dep) {
              if (
                window.appSettings[pair.dep] != null &&
                window.appSettings[pair.dep] != "" &&
                window.appSettings[pair.dep] != "null"
              ) {
                this.shadowRoot
                  .querySelector(pair.selector)
                  .removeAttribute("hidden");
              } else {
                // a dependency didn't meet the requirement
              }
            } else {
              this.shadowRoot
                .querySelector(pair.selector)
                .removeAttribute("hidden");
            }
          }
        });
      }, 100);
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelectorAll("[data-super-daemon-path]")
      .forEach((item) => {
        SuperDaemonInstance.defineOption({
          title: item.getAttribute("data-super-daemon-label"),
          icon: item.getAttribute("data-super-daemon-icon"),
          tags: ["page", "operation", "command", "add", "create"],
          value: {
            target: item,
          },
          context: "CMS",
          eventName: "super-daemon-element-click",
          path: item.getAttribute("data-super-daemon-path"),
        });
      });
    // load up commands for daemon
    SuperDaemonInstance.defineOption({
      title: this.t.saveChanges,
      icon: "icons:save",
      tags: ["CMS", "save", "page", "operation", "command"],
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "HAX",
      eventName: "super-daemon-element-method",
      path: "CMS/action/save",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.insights,
      icon: "hax:clipboard-pulse",
      tags: ["CMS", "insights", "data", "operation"],
      value: {
        target: this,
        method: "_insightsButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/site/insights",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.editPage,
      icon: "hax:page-edit",
      tags: ["CMS", "edit", "page", "operation", "command"],
      value: {
        target: this,
        method: "_editButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/edit",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.siteSettings,
      icon: "hax:site-settings",
      tags: ["CMS", "site", "settings", "operation", "command"],
      value: {
        target: this,
        method: "_manifestButtonTap",
        args: [{ target: this.shadowRoot.querySelector("#manifestbtn") }],
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/site/settings",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.shareSite,
      icon: "social:share",
      tags: ["CMS", "share"],
      value: {
        target: this,
        method: "_shareButtonTap",
      },
      context: ["logged-in", "CMS", "HAX"],
      eventName: "super-daemon-element-method",
      path: "CMS/action/share",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.newJourney,
      icon: "add",
      tags: ["CMS", "create", "new site"],
      value: {
        target: this,
        method: "_addButtonTap",
      },
      context: "CMS",
      eventName: "super-daemon-element-method",
      path: "CMS/action/create-site",
    });
    SuperDaemonInstance.defineOption({
      title: this.t.logOut,
      icon: "add",
      tags: ["CMS", "user", "logout"],
      value: {
        target: this,
        method: "_logout",
      },
      context: ["logged-in", "CMS"],
      eventName: "super-daemon-element-method",
      path: "CMS/user/logout",
    });

    SuperDaemonInstance.defineOption({
      title: "Dark mode toggle",
      icon: "device:brightness-medium",
      tags: ["CMS", "dark mode"],
      value: {
        target: this.shadowRoot.querySelector("haxcms-darkmode-toggle"),
        method: "toggle",
      },
      voice: "(toggle) dark mode",
      context: ["logged-in", "CMS", "HAX"],
      eventName: "super-daemon-element-method",
      path: "CMS/action/darkMode",
    });

    SuperDaemonInstance.defineOption({
      title: "Sound toggle",
      icon: "av:volume-up",
      tags: ["CMS", "sound"],
      value: {
        target: this.shadowRoot.querySelector(".soundToggle"),
      },
      context: ["logged-in", "CMS", "HAX"],
      eventName: "super-daemon-element-click",
      path: "CMS/action/sound",
    });

    SuperDaemonInstance.defineOption({
      title: this.t.outlineDesigner,
      icon: "hax:site-map",
      tags: [
        "CMS",
        "outline",
        "designer",
        "site outline",
        "operation",
        "command",
      ],
      value: {
        target: this.shadowRoot.querySelector("#outlinebutton"),
      },
      context: ["CMS"],
      eventName: "super-daemon-element-click",
      path: "CMS/action/outline",
    });
    // force item to load schema
    SuperDaemonInstance.defineOption({
      title: "Load HAXSchema",
      icon: "hax:hax2022",
      tags: ["Developer", "schema", "load", "demo", "testing"],
      eventName: "super-daemon-run-program",
      path: ">hax/loadElement",
      context: [">"],
      value: {
        name: "Load HAXSchema",
        context: ">",
        program: async (input, values) => {
          const reg = window.WCAutoload.requestAvailability();
          let results = [];
          Object.keys(reg.registry.list).forEach(async (tag) => {
            let icon = "hax:hax2022";
            if (window.customElements.get(tag)) {
              if (
                window.customElements.get(tag).haxProperties &&
                window.customElements.get(tag).haxProperties.gizmo
              ) {
                icon = window.customElements.get(tag).haxProperties.gizmo.icon;
              }
            }
            if (input == "" || tag.includes(input)) {
              let tmp = {};
              tmp[tag] = reg.registry.list[tag];
              results.push({
                title: tag,
                icon: icon,
                tags: ["schema"],
                value: {
                  target: window.HaxStore.instance,
                  method: "_handleDynamicImports",
                  args: [tmp, window.HaxStore.instance.haxAutoloader],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">hax/loadElement/" + tag],
                path: ">hax/loadElement/" + tag,
              });
            }
          });
          return results;
        },
      },
    });
    // change theme program
    SuperDaemonInstance.defineOption({
      title: "Change theme temporarily",
      icon: "image:style",
      tags: ["Developer", "theme"],
      eventName: "super-daemon-run-program",
      path: ">settings/theme",
      context: [">"],
      more: html`<span
        >Change theme just for the current browsing session</span
      >`,
      voice: "change theme (temporarily)",
      value: {
        name: "Change theme",
        context: ">",
        program: async (input, values) => {
          let results = [];
          [
            "clean-one",
            "clean-two",
            "learn-two-theme",
            "bootstrap-theme",
            "outline-player",
            "haxor-slevin",
          ].forEach(async (name) => {
            if (input == "" || name.includes(input)) {
              results.push({
                title: name.replace("-theme", "").replace("-", " "),
                icon: "image:style",
                tags: ["theme"],
                value: {
                  target: window.HAXCMS,
                  method: "setTheme",
                  args: [name],
                },
                eventName: "super-daemon-element-method",
                context: [">", ">settings/theme/" + name],
                path: ">settings/theme/" + name,
              });
            }
          });
          return results;
        },
      },
    });
    // force item to load schema
    SuperDaemonInstance.defineOption({
      title: "Go to site",
      icon: "hax:hax2022",
      tags: ["Developer", "change", "sites", "administration"],
      eventName: "super-daemon-run-program",
      path: "/hax/changeSite",
      context: ["/"],
      value: {
        name: "Go to site",
        context: "/",
        program: async (input, values) => {
          let results = [];
          // will work in a production haxiam environment to allow hopping between spaces
          await fetch("./../../system/api/listSites")
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              return [];
            })
            .then((manifest) => {
              if (manifest.data && manifest.data.items.length > 0) {
                manifest.data.items.forEach(async (site) => {
                  if (
                    input == "" ||
                    (site.metadata.site &&
                      site.metadata.site.name &&
                      site.metadata.site.name.includes(input) &&
                      store.manifest.metadata.site.name !=
                        site.metadata.site.name)
                  ) {
                    results.push({
                      title: site.title,
                      icon: site.metadata.theme.variables.icon,
                      tags: ["site", site.description],
                      value: {
                        target: this,
                        method: "goToLocation",
                        args: [site.slug],
                      },
                      eventName: "super-daemon-element-method",
                      context: [
                        "/",
                        "/hax/changeSite/" + site.metadata.site.name,
                      ],
                      path: "/hax/changeSite/" + site.metadata.site.name,
                    });
                  }
                });
              }
            });
          return results;
        },
      },
    });
    this.updateAvailableButtons();
    // load user data
    this.dispatchEvent(
      new CustomEvent("haxcms-load-user-data", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      })
    );
  }

  goToLocation(location) {
    window.location = location;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "userMenuOpen" && oldValue !== undefined) {
        if (this.userMenuOpen) {
          this.rpgHat = "edit";
        } else {
          this.rpgHat = "none";
        }
      }
      if (propName === "responsiveSize") {
        if (["xs", "sm", "md"].includes(this[propName])) {
          if (this.editMode) {
            this.__editText = this.t.save;
          } else {
            this.__editText = this.t.edit;
          }
          this.t.saveChanges = "Save";
          this.t.configureBlock = "Configure";
          this.t.addBlock = "Block";
          this.t.findMedia = "Media";
          this.t.pageOutline = "Outline";
          this.t.viewSource = "Source";
        } else {
          if (this.editMode) {
            this.__editText = this.t.saveChanges;
          } else {
            this.__editText = this.t.editPage;
          }
          this.t.configureBlock = "Configure block";
          this.t.addBlock = "Add block";
          this.t.findMedia = "Find media";
          this.t.pageOutline = "Page outline";
          this.t.viewSource = "View source";
        }
      }
      if (propName == "editMode") {
        if (this.editMode) {
          this.rpgHat = "construction";
        } else {
          this.rpgHat = "none";
        }
        SuperDaemonInstance.close();
        // observer
        this._editModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            detail: this[propName],
          })
        );
      }
      if (propName == "manifestEditMode") {
        // observer
        this._manifestEditModeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName],
          })
        );
      }
      if (propName == "dashboardOpened" || propName == "t") {
        // observer
        this._dashboardOpenedChanged(this.dashboardOpened);
      }
    });
  }
  _redoChanged(e) {
    this.canRedo = e.detail.value;
  }
  _undoChanged(e) {
    this.canUndo = e.detail.value;
  }
  static get properties() {
    return {
      ...super.properties,
      userName: {
        type: String,
        attribute: "user-name",
      },
      activeNode: {
        type: Object,
      },
      activeTagName: {
        type: String,
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
      rpgHat: { type: String },
      userPicture: {
        type: String,
        attribute: "user-picture",
      },
      userMenuOpen: {
        type: Boolean,
      },
      soundIcon: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: "dark-mode" },
      backLink: {
        type: String,
      },
      backText: {
        type: String,
      },
      __editIcon: {
        type: String,
      },
      __editText: {
        type: String,
      },
      __settingsText: {
        type: String,
      },
      /**
       * small visual lock that events break on initial paint
       */
      painting: {
        type: Boolean,
        reflect: true,
      },
      /**
       * page allowed
       */
      pageAllowed: {
        type: Boolean,
        attribute: "page-allowed",
        reflect: true,
      },
      /**
       * if the page is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Manifest editing state
       */
      manifestEditMode: {
        type: Boolean,
        attribute: "manifest-edit-mode",
        reflect: true,
      },
      activeTitle: {
        type: String,
        attribute: "active-title",
      },
      manifest: {
        type: Object,
      },
      icon: {
        type: String,
      },
      dashboardOpened: {
        type: Boolean,
        reflect: true,
        attribute: "dashboard-opened",
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();

    autorun((reaction) => {
      if (store.userData) {
        this.userName = toJS(store.userData.userName);
        this.userPicture = toJS(store.userData.userPicture);
        // update buttons to match since we got a state response
        this.updateAvailableButtons();
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.icon = "hax:site-settings";
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.dashboardOpened = toJS(store.dashboardOpened);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      // update buttons to match since we got a state response
      this.updateAvailableButtons();
      if (activeItem && activeItem.id) {
        this.activeTitle = activeItem.title;
        this.pageAllowed = true;
      } else {
        this.pageAllowed = false;
      }
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  _dashboardOpenedChanged(newValue) {
    if (newValue) {
      this.__settingsText = this.t.close;
      this.icon = "icons:cancel";
    } else if (!newValue) {
      this.__settingsText = this.t.editSettings;
      this.icon = "hax:site-settings";
    }
  }
  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
    store.playSound("click");
    this.editMode = !this.editMode;
    // save button shifted to edit
    if (!this.editMode) {
      this.dispatchEvent(
        new CustomEvent("haxcms-save-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: store.activeItem,
        })
      );
    }
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
  }
  _insightsButtonTap(e) {
    store.playSound("click");
    const c = document.createElement("haxcms-site-insights");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.insights,
        styles: {
          "--simple-modal-titlebar-background": "orange",
          "--simple-modal-titlebar-color": "black",
          "--simple-modal-width": "94vw",
          "--simple-modal-min-width": "300px",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "94vh",
          "--simple-modal-min-height": "300px",
          "--simple-modal-titlebar-height": "80px",
        },
        elements: { content: c },
        invokedBy: this.shadowRoot.querySelector("#insightsbutton"),
        clone: false,
        modal: false,
      },
    });
    window.dispatchEvent(evt);
  }
  _cancelButtonTap(e) {
    this.editMode = false;
    store.playSound("error");
    this.dispatchEvent(
      new CustomEvent("hax-cancel", {
        bubbles: true,
        composed: true,
        cancelable: false,
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
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap(e) {
    store.playSound("click");
    let c = document.createElement("span");
    c.innerHTML = `"${store.activeItem.title}" will be removed from the outline but its content stays on the file system.`;
    let b1 = document.createElement("button");
    b1.appendChild(document.createTextNode("Confirm"));
    b1.classList.add("hax-modal-btn");
    b1.addEventListener("click", this._deleteActive.bind(this));
    let b2 = document.createElement("button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.addEventListener("click", () => store.playSound("error"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    b2.classList.add("hax-modal-btn");
    b2.classList.add("cancel");
    let b = document.createElement("span");
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Are you sure you want to delete this page?",
        styles: {
          "--simple-modal-titlebar-background": "orange",
          "--simple-modal-titlebar-color": "black",
          "--simple-modal-width": "25vw",
          "--simple-modal-min-width": "300px",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "15vh",
          "--simple-modal-min-height": "300px",
          "--simple-modal-titlebar-height": "80px",
        },
        elements: { content: c, buttons: b },
        invokedBy: this.shadowRoot.querySelector("#deletebutton"),
        clone: false,
        modal: true,
      },
    });
    window.dispatchEvent(evt);
  }
  /**
   * delete active item
   */
  _deleteActive(e) {
    store.playSound("click");
    const evt = new CustomEvent("haxcms-delete-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        item: store.activeItem,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * toggle share button
   */
  _shareButtonTap(e) {
    store.playSound("click");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.shareSite,
        styles: {
          "--simple-modal-titlebar-background": "orange",
          "--simple-modal-titlebar-color": "black",
          "--simple-modal-width": "55vw",
          "--simple-modal-min-width": "300px",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "50vh",
          "--simple-modal-min-height": "300px",
          "--simple-modal-titlebar-height": "80px",
        },
        elements: {
          content: document.createElement("haxcms-share-dialog"),
        },
        invokedBy: this.shadowRoot.querySelector("#sharebutton"),
        clone: false,
        modal: false,
      },
    });
    window.dispatchEvent(evt);
  }
  /**
   * toggle state on button tap
   */
  _outlineButtonTap(e) {
    store.playSound("click");
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.outlineDesigner,
        styles: {
          "--simple-modal-titlebar-background": "orange",
          "--simple-modal-titlebar-color": "black",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-titlebar-height": "80px",
          "--simple-modal-width": "85vw",
          "--simple-modal-max-width": "85vw",
          "--simple-modal-height": "90vh",
          "--simple-modal-max-height": "90vh",
        },
        elements: {
          content: document.createElement("haxcms-outline-editor-dialog"),
        },
        invokedBy: this.shadowRoot.querySelector("#outlinebutton"),
        clone: false,
        modal: true,
      },
    });
    window.dispatchEvent(evt);
  }
  _addButtonTap() {
    store.playSound("click");
    setTimeout(() => {
      window.location = this.backLink + "createSite-step-1";
    }, 100);
  }
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e) {
    store.playSound("click");
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
    window.dispatchEvent(
      new CustomEvent("haxcms-load-site-dashboard", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.target,
      })
    );
  }
  /**
   * Edit state has changed.
   */
  _editModeChanged(newValue, oldValue) {
    if (newValue) {
      this.__editIcon = "icons:save";
      this.__editText = this.t.saveChanges;
      SuperDaemonInstance.appendContext("HAX");
      SuperDaemonInstance.removeContext("CMS");
    } else {
      this.__editIcon = "hax:page-edit";
      this.__editText = this.t.editPage;
      SuperDaemonInstance.appendContext("CMS");
      SuperDaemonInstance.removeContext("HAX");
    }
    if (typeof oldValue !== typeof undefined) {
      store.editMode = newValue;
      // force tray status to be the opposite of the editMode
      // to open when editing and close when not
      if (newValue) {
        HAXStore.haxTray.collapsed = false;
      }
    }
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-outline-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      })
    );
  }
  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged(newValue, oldValue) {
    this.dispatchEvent(
      new CustomEvent("haxcms-manifest-edit-mode-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: newValue,
      })
    );
  }
}
customElements.define(HAXCMSSiteEditorUI.tag, HAXCMSSiteEditorUI);
export { HAXCMSSiteEditorUI };
