import { LitElement, html, css, unsafeCSS } from "lit";
import { store } from "./haxcms-site-store.js";
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { localStorageSet } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "./micros/haxcms-button-add.js";
import "@lrnwebcomponents/rpg-character/rpg-character.js";
import '@lrnwebcomponents/app-hax/lib/v1/app-hax-top-bar.js';
import './haxcms-darkmode-toggle.js';
import 'wired-elements/lib/wired-button.js';

const haxLogo = new URL('../../../app-hax/lib/assets/images/HAXLogo.svg', import.meta.url).href;
const ButtonBGLight = new URL('../../../app-hax/lib/assets/images/ButtonBGLM.svg', import.meta.url).href;
const ButtonBGDark = new URL('../../../app-hax/lib/assets/images/ButtonBGDM.svg', import.meta.url).href;
const LogOut = new URL('../../../app-hax/lib/assets/images/Logout.svg', import.meta.url).href;
/**
 * `haxcms-site-editor-ui`
 * `haxcms editor element buttons that you see`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 */
class HAXCMSSiteEditorUI extends HAXCMSI18NMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host *:not(:defined) {
          display: none;
        }
        :host {
          display: flex;
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          background-color: var(--haxcms-system-bg, #37474f);
          z-index: 10000;
          visibility: visible;
        }
        :host([edit-mode]) {
          z-index: 9999;
        }
        :host([dashboard-opened]) {
          left: 50vw;
        }
        @media screen and (max-width: 800px) {
          :host([dashboard-opened]) {
            left: 90vw;
          }
          :host([edit-mode]) {
            bottom: unset;
          }
        }
        /**
         * Dashboard open trumps all contextual settings
         */
        :host([dashboard-opened]) #editbutton,
        :host([dashboard-opened]) #editdetails,
        :host([dashboard-opened]) #deletebutton,
        :host([dashboard-opened]) #addbutton,
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
          visibility: hidden;
        }
        simple-icon-button {
          vertical-align: text-bottom;
          display: inline-flex;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          border-radius: 50%;
          border: none;
          background-color: black;
          color: white;
          text-align: center;
          line-height: 40px;
          min-width: unset;
          padding: 0;
          margin: 4px 2px;
          width: 40px;
          height: 40px;
          transition: 0.2s all ease-in-out;
          position: relative;
          box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
            0 3px 14px 2px rgba(0, 0, 0, 0.12),
            0 5px 5px -3px rgba(0, 0, 0, 0.4);
        }
        haxcms-button-add {
          display: inline-flex;
          margin: 4px 2px;
          vertical-align: text-bottom;
        }
        .topbar-button:hover,
        .topbar-button:focus,
        .topbar-button:active {
          opacity: .8;
        }
        .topbar-button {
          background-image: url('${unsafeCSS(ButtonBGLight)}');
        }
        :host([dark-mode]) .topbar-button {
          background-image: url('${unsafeCSS(ButtonBGDark)}');
        }
        #cancelbutton {
          background-color: var(--haxcms-system-danger-color);
        }
        #editbutton,
        #editdetails,
        #deletebutton {
          visibility: hidden;
          opacity: 0;
        }
        :host([page-allowed]) #editbutton,
        :host([page-allowed]) #editdetails,
        :host([page-allowed]) #deletebutton {
          visibility: visible;
          opacity: 1;
        }
        :host([edit-mode]) #editbutton {
          color: white;
          background-color: var(--haxcms-system-action-color, blue) !important;
        }
        :host([edit-mode]) #editdetails,
        :host([edit-mode]) #deletebutton,
        :host([edit-mode]) #addbutton,
        :host([edit-mode]) #addbuttonchild,
        :host([edit-mode]) #duplicatebutton {
          display: none !important;
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
        }
        app-hax-top-bar {
          top: 0;
          z-index: 1000;
          right: 0;
          left: 0;
          position: fixed;
        }
        app-hax-top-bar::part(top-bar) {
          grid-template-columns: 20% 60% 20%;
        }
        .haxLogo {
          --simple-icon-height: 40px;
          --simple-icon-width: 40px;
          margin: 4px;
        }

        .space-hack {
          display: inline-flex;
          width: 64px;
          height: 48px;
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

        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        .user-menu {
          display:none;
        }
        .user-menu.open {
          display: block;
          top: 49px;
          right: 0px;
          position: absolute;
          border: 3px solid black;
          background-color: white;
        }
        .user-menu.open button {
          display: block;
          width: 100%;
          margin: 0;
          padding: 8px;
          font-size: 20px;
          font-family: 'Press Start 2P', sans-serif;
          color: black;
          background-color: white;
        }
        .user-menu.open button:hover,
        .user-menu.open button:active,
        .user-menu.open button:focus {
          background-color: black;
          color: white;
        }
        .user-menu .ops-panel {
          justify-content: space-around;
          display: flex;
          padding: 8px 16px;
        }

        :host([dark-mode]) .user-menu.open {
          background-color: black;
          color: white;
          border: 3px solid white;
        }
        :host([dark-mode]) .user-menu.open button {
          background-color: black;
          color: white;
        }

        :host([dark-mode]) .user-menu.open button:hover,
        :host([dark-mode]) .user-menu.open button:active,
        :host([dark-mode]) .user-menu.open button:focus {
          background-color: white;
          color: black;
        }

        .topbar-character {
          cursor: pointer;
          display: inline-block;
          margin: -4px -8px 0 2px;
        }
        .user-menu.open > .logout {
          background-image: url('${unsafeCSS(LogOut)}');
          background-repeat: no-repeat;
          background-position: center;
          text-align: center;
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
  constructor() {
    super();
    this.rpgHat = "none";
    this.darkMode = false;
    this.userMenuOpen = false;
    this.soundIcon = '';
    this.__disposer = this.__disposer || [];
    this.t = this.t || {};
    this.t = {
      ...this.t,
      backToSiteList: "Back to site list",
      cancelEditing: "Cancel editing",
      editDetails: "Edit details",
      addPage: "Add page",
      deletePage: "Delete page",
      editSiteOutline: "Edit site outline",
      closeSiteSettings: "Close site settings",
      editSiteSettings: "Edit site settings",
      savePageContent: "Save page content",
      editPageContent: "Edit page content",
      startNewJourney: "Start New Journey",
      accountInfo: "Account Info",
      logOut: "Log out",
    };
    this.backText = "Back to site list";
    this.painting = true;
    this.pageAllowed = false;
    this.editMode = false;
    this.__editIcon = "hax:page-edit";
    this.icon = "hax:site-settings";
    this.manifestEditMode = false;
    setTimeout(() => {
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-dashboard.js"
      );
      import("@lrnwebcomponents/simple-modal/simple-modal.js");
      import("@lrnwebcomponents/simple-fields/lib/simple-fields-form.js");
    }, 0);
  }

  soundToggle() {
    store.soundStatus = !toJS(store.soundStatus);
    localStorageSet('app-hax-soundStatus', toJS(store.soundStatus));
  }

  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  // render function
  render() {
    return html`
      <app-hax-top-bar>
        <span slot="left">
          <simple-icon-lite src="${haxLogo}" class="haxLogo" @click="${this.redirectToSites}"></simple-icon-lite>
          <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
        </span>
      <span slot="center">
        <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
        <simple-icon-button
          hidden
          ?dark="${!this.darkMode}"
          id="editbutton"
          icon="${this.__editIcon}"
          @click="${this._editButtonTap}"
          label="${this.__editText}"
          voice-command="edit (this) page"
          class="topbar-button"
        ></simple-icon-button>
        <simple-icon-button
          id="cancelbutton"
          ?dark="${!this.darkMode}"
          icon="icons:cancel"
          @click="${this._cancelButtonTap}"
          .hidden="${!this.editMode}"
          label="${this.t.cancelEditing}"
          voice-command="cancel (editing)"
          class="topbar-button"
        ></simple-icon-button>
        <simple-icon-button
          hidden
          ?dark="${!this.darkMode}"
          id="editdetails"
          icon="hax:page-details"
          @click="${this._editDetailsButtonTap}"
          label="${this.t.editDetails}"
          voice-command="edit (page) details"
          class="topbar-button"
        ></simple-icon-button>
        <simple-icon-button
          hidden
          ?dark="${!this.darkMode}"
          id="deletebutton"
          icon="icons:delete"
          @click="${this._deleteButtonTap}"
          label="${this.t.deletePage}"
          voice-command="delete page"
          class="topbar-button"
        ></simple-icon-button>
        <haxcms-button-add
        hidden
        ?dark-mode="${this.darkMode}"
        id="addbutton"></haxcms-button-add>
        <haxcms-button-add
          hidden
          ?dark-mode="${this.darkMode}"
          id="addbuttonchild"
          type="child"
        ></haxcms-button-add>
        <haxcms-button-add
          hidden
          ?dark-mode="${this.darkMode}"
          type="duplicate"
          id="duplicatebutton"
        ></haxcms-button-add>
        <simple-tooltip for="username" position="bottom" offset="14"
          >${this.backText}</simple-tooltip
        >
        <simple-tooltip for="cancelbutton" position="bottom" offset="14"
          >${this.t.cancelEditing}</simple-tooltip
        >
        <simple-tooltip for="editbutton" position="bottom" offset="14"
          >${this.__editText}</simple-tooltip
        >
        <simple-tooltip for="editdetails" position="bottom" offset="14"
          >${this.t.editDetails}</simple-tooltip
        >
        <simple-tooltip for="deletebutton" position="bottom" offset="14"
          >${this.t.deletePage}</simple-tooltip
        >
        <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
      </span>
      <span slot="right">
        <rpg-character
          class="topbar-character"
          seed="${this.userName}"
          width="68"
          height="68"
          aria-label="System menu"
          title="System menu"
          hat="${this.rpgHat}"
          @click="${this.toggleMenu}"
        ></rpg-character>
        <div class="user-menu ${this.userMenuOpen ? 'open' : ''}">
          <div class="ops-panel">
            <wired-button
              elevation="1"
              class="soundToggle"
              @click="${this.soundToggle}"
            >
              <simple-icon-lite src="${this.soundIcon}" loading="lazy" decoding="async"></simple-icon-lite>
            </wired-button>
            <haxcms-darkmode-toggle></haxcms-darkmode-toggle>
          </div>
          <button @click="${this._manifestButtonTap}">
            <simple-icon-lite icon="${this.icon}"></simple-icon-lite>${this.__settingsText}</button>
          <button
          id="outlinebutton"
          @click="${this._outlineButtonTap}"
          ><simple-icon-lite icon="hax:site-map"></simple-icon-lite>${this.t.editSiteOutline}</button>
          <button>
          <simple-icon-lite icon="add"></simple-icon-lite>${this.t.startNewJourney}</button>
          <button>
          <simple-icon-lite icon="face"></simple-icon-lite>${this.t.accountInfo}</button>
          <button class="logout">${this.t.logOut}</button>
        </div>
      </span>
    </app-hax-top-bar>
    `;
  }

  /*
   * Function to redirect back to sites page
   */
  redirectToSites() {
    let redirectUrl = "";
    if (window.appSettings && window.appSettings.backLink) {
      redirectUrl = window.appSettings.backLink;
    } else {
      let webTypeRegex = /^http/;
      let tmp = document.createElement("a");
      tmp.href = window.location.href;
      if (webTypeRegex.test(tmp.href)) {
        redirectUrl = `http://${tmp.host}`;
      } else {
        redirectUrl = `https://${tmp.host}`;
      }
    }
    window.location.replace(redirectUrl);
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
            varPath: "getNodeFieldsPath",
            selector: "#editdetails",
          },
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
    autorun(() => {
      localStorageSet('app-hax-darkMode', toJS(store.darkMode));
      this.darkMode = toJS(store.darkMode);
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
        store.toast("I'm ascared of the dark", 2000, { fire: true});
        HAXStore.globalPreferences.haxUiTheme = 'haxdark';
      } else {
        document.body.classList.remove('dark-mode');
        HAXStore.globalPreferences.haxUiTheme = 'hax';
        store.toast("Sunny day it is", 2000, { hat: 'random'});
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus) ? new URL('../../../app-hax/lib/assets/images/FullVolume.svg',import.meta.url).href : new URL('../../../app-hax/lib/assets/images/Silence.svg',import.meta.url).href;
      if (!toJS(store.soundStatus)) {
        store.toast("Sound off.. hey.. HELLO!?!", 2000, { fire: true});
      }
      else {
        store.toast("Can you hear me now? Good.", 2000,{ hat: 'random'});
      }
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
    this.shadowRoot.querySelectorAll("[voice-command]").forEach((el) => {
      if (el.getAttribute("id") == "editbutton") {
        this.dispatchEvent(
          new CustomEvent("hax-add-voice-command", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
              command: ":name: save (this) page",
              context: el,
              callback: "click",
            },
          })
        );
      }
      this.dispatchEvent(
        new CustomEvent("hax-add-voice-command", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            command: ":name: " + el.getAttribute("voice-command"),
            context: el,
            callback: "click",
          },
        })
      );
    });
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'userMenuOpen' && oldValue !== undefined) {
        if (this.userMenuOpen) {
          this.rpgHat = 'construction';
        }
        else {
          this.rpgHat = 'none';
        }
      }
      if (propName == "editMode") {
        if (this.editMode) {
          this.rpgHat = 'edit';
        }
        else {
          this.rpgHat = 'none';
        }
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
      // make sure edit matches but state doesnt shift
      if (propName === "t") {
        if (this.editMode) {
          this.__editText = this.t.savePageContent;
        } else {
          this.__editText = this.t.editPageContent;
        }
      }
    });
  }
  static get properties() {
    return {
      userName: {
        type: String,
        attribute: "user-name",
      },
      rpgHat: { type: String},
      userPicture: {
        type: String,
        attribute: "user-picture",
      },
      userMenuOpen: {
        type: Boolean,
      },
      soundIcon: { type: String },
      darkMode: { type: Boolean, reflect: true, attribute: 'dark-mode'},
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
      this.__settingsText = this.t.closeSiteSettings;
      this.icon = "icons:cancel";
    } else if (!newValue) {
      this.__settingsText = this.t.editSiteSettings;
      this.icon = "hax:site-settings";
    }
  }
  /**
   * toggle state on button tap
   */
  _editButtonTap(e) {
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
  _editDetailsButtonTap(e) {
    const evt = new CustomEvent("haxcms-load-node-fields", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: e.target,
    });
    window.dispatchEvent(evt);
  }
  _cancelButtonTap(e) {
    this.editMode = false;
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
   * create new item
   */
  _createNewItem(e) {
    const evt = new CustomEvent("haxcms-create-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        values: this.__newForm.value,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * Fire item
   */
  _updateItem(e) {
    var local = e.target;
    var values;
    if (!local.__form) {
      values = local.parentNode.__form.value;
    } else {
      values = local.__form.value;
    }
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: values,
      })
    );
    // fire event to close the modal
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      })
    );
  }
  /**
   * Delete button hit, confirm they want to do this
   */
  _deleteButtonTap(e) {
    let c = document.createElement("span");
    c.innerHTML = `"${store.activeItem.title}" will be removed from the outline but its content stays on the file system.`;
    let b1 = document.createElement("button");
    let icon = document.createElement("simple-icon");
    icon.icon = "icons:delete";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Confirm"));
    b1.style.color = "white";
    b1.style.backgroundColor = "#ee0000";
    b1.addEventListener("click", this._deleteActive.bind(this));
    let b2 = document.createElement("button");
    let icon2 = document.createElement("simple-icon");
    icon2.icon = "icons:cancel";
    b2.appendChild(icon2);
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
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
          "--simple-modal-z-index": "100000000",
          "--simple-modal-min-width": "30vw",
          "--simple-modal-min-height": "30vh",
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
   * toggle state on button tap
   */
  _outlineButtonTap(e) {
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.t.editSiteOutline,
        styles: {
          "--simple-modal-width": "70vw",
          "--simple-modal-max-width": "70vw",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-height": "70vh",
          "--simple-modal-max-height": "70vh",
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
  /**
   * toggle state on button tap
   */
  _manifestButtonTap(e) {
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
      // enable it some how
      this.__editIcon = "icons:save";
      this.__editText = this.t.savePageContent;
    } else {
      // disable it some how
      this.__editIcon = "hax:page-edit";
      this.__editText = this.t.editPageContent;
    }
    if (typeof oldValue !== typeof undefined) {
      store.editMode = newValue;
      // force tray status to be the opposite of the editMode
      // to open when editing and close when not
      HAXStore.haxTray.collapsed = !newValue;
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
window.customElements.define(HAXCMSSiteEditorUI.tag, HAXCMSSiteEditorUI);
export { HAXCMSSiteEditorUI };