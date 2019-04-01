/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-input/paper-input.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";
import "@lrnwebcomponents/magazine-cover/magazine-cover.js";
import "@lrnwebcomponents/sites-listing/sites-listing.js";
/**
 * `haxcms-site-listing`
 * `A listing of all sites being managed by this instance.`
 */
class HAXCMSSiteListing extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-listing";
  }
  // render function
  static get template() {
    return html`
      <style include="simple-colors">
        app-toolbar {
          background-color: rgba(255, 0, 116, 1);
          color: #ffffff;
        }
        paper-icon-button {
          --paper-icon-button-ink-color: #ffffff;
        }
        paper-icon-button + [main-title] {
          margin-left: 24px;
        }
        app-header {
          color: #ffffff;
          @apply --layout-fixed-top;
          --app-header-background-rear-layer: {
            background-color: rgba(255, 0, 116, 1);
          }
        }
        app-drawer {
          --app-drawer-scrim-background: rgba(0, 0, 0, 0.6);
          --app-drawer-content-container: {
            background-color: rgba(255, 0, 116, 0.8);
            overflow: scroll;
            color: #ffffff;
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        sites-listing {
          display: block;
          margin: 100px 16px 0px 16px;
        }
        paper-dialog {
          width: 60%;
          min-height: 50%;
          top: 10%;
          border-radius: 16px;
        }
        paper-input {
          --paper-input-container-focus-color: #3a0063;
        }
        #closedrawer {
          float: left;
          margin: 12px -20px 0 8px;
        }
        #add {
          float: right;
          margin: 12px 8px 0 -20px;
        }
        #newsitecolor {
          padding: 4px;
          margin: 0;
          display: inline-flex;
          vertical-align: middle;
        }
        #newsitecolor > * {
          display: inline-flex;
          align-self: center;
          margin-right: 8px;
          --simple-colors-picker-preview-size: 20px;
        }
        eco-json-schema-object {
          --eco-json-schema-object-form : {
            -ms-flex: unset;
            -webkit-flex: unset;
            flex: unset;
            -webkit-flex-basis: unset;
            flex-basis: unset;
          }
        }
        #configform {
        --eco-json-schema-object-form: {
          display: block !important;
        }
      </style>
      <jwt-login
        id="jwt"
        url="[[__loginPath]]"
        logout-url="[[__logoutPath]]"
        jwt="{{jwt}}"
      ></jwt-login>
      <iron-ajax
        id="createrequest"
        method="POST"
        body="[[createParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__createNewSitePath]]"
        handle-as="json"
        on-response="handleCreateResponse"
      ></iron-ajax>
      <iron-ajax
        id="downloadrequest"
        method="POST"
        body="[[downloadParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__downloadSitePath]]"
        handle-as="json"
        on-response="handleDownloadResponse"
      ></iron-ajax>
      <iron-ajax
        id="getconfigrequest"
        method="POST"
        body="[[configParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__getConfigPath]]"
        handle-as="json"
        on-response="handleConfigResponse"
      ></iron-ajax>
      <iron-ajax
        id="setconfigrequest"
        method="POST"
        body="[[setConfigParams]]"
        headers='{"Authorization": "Bearer [[jwt]]"}'
        content-type="application/json"
        url="[[__setConfigPath]]"
        handle-as="json"
        on-response="handleSetConfigResponse"
      ></iron-ajax>
      <sites-listing
        id="siteslisting"
        sites-response="{{__sitesResponse}}"
        sites="{{__sites}}"
        data-source="[[_dataSource]]"
        edit-mode="[[editMode]]"
      ></sites-listing>
      <app-header reveals>
        <app-toolbar>
          <paper-icon-button
            icon="menu"
            on-tap="drawerToggle"
          ></paper-icon-button>
          <div main-title>[[title]]</div>
          <paper-icon-button
            on-tap="_settingsTap"
            id="settings"
            icon="icons:settings"
            hidden$="[[!loggedIn]]"
          ></paper-icon-button>
          <paper-tooltip
            for="settings"
            position="bottom"
            offset="12"
            animation-delay="200"
            >Settings</paper-tooltip
          >
          <paper-icon-button
            on-tap="_loginUserRoutine"
            id="login"
            icon="[[__loginIcon]]"
          ></paper-icon-button>
          <paper-tooltip
            for="login"
            position="bottom"
            offset="12"
            animation-delay="200"
            >[[__loginText]]</paper-tooltip
          >
        </app-toolbar>
      </app-header>
      <app-drawer id="drawer" swipe-open>
        <paper-icon-button
          id="closedrawer"
          icon="icons:close"
          on-tap="drawerToggle"
        ></paper-icon-button>
        <paper-tooltip
          for="closedrawer"
          position="bottom"
          offset="12"
          animation-delay="200"
          >Close</paper-tooltip
        >
        <paper-icon-button
          on-tap="_addTap"
          id="add"
          icon="icons:add"
        ></paper-icon-button>
        <paper-tooltip
          for="add"
          position="bottom"
          offset="12"
          animation-delay="200"
          >Add site</paper-tooltip
        >
        <h3
          style="margin: 18px; padding: 6px; border-bottom: 1px solid #ffffff; text-align: center; font-weight: normal;"
        >
          Site list
        </h3>
        <map-menu
          id="mapmenu"
          items="{{outline}}"
          data="[[__sites]]"
          selected="{{activeItemID}}"
        ></map-menu>
      </app-drawer>
      <paper-dialog id="newdialog" with-backdrop>
        <h3>Create new site</h3>
        <paper-dialog-scrollable>
          <paper-input
            id="newsitetitle"
            label="Title"
            required
            autofocus
            value="{{siteTitle}}"
          ></paper-input>
          <paper-input
            id="newsitedescription"
            label="Description"
          ></paper-input>
          <paper-input
            id="newsiteimage"
            label="Image"
            value="[[activeItem.metadata.image]]"
          ></paper-input>
          <label for="newsitecolor">Select a color:</label>
          <simple-colors-picker id="newsitecolor"></simple-colors-picker>
          <simple-picker id="newsitetheme" label="Theme"></simple-picker>
          <label for="newsiteicon">Select an icon:</label>
          <simple-icon-picker
            id="newsiteicon"
            hide-option-labels
            value="[[activeItem.metadata.icon]]"
          ></simple-icon-picker>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button on-tap="_createSite" dialog-confirm id="create" raised
            >Let's go!</paper-button
          >
          <paper-button dialog-dismiss>cancel</paper-button>
        </div>
      </paper-dialog>
      <paper-dialog id="itemdialog" with-backdrop>
        <paper-dialog-scrollable>
          <magazine-cover
            image="[[activeItem.metadata.image]]"
            header="[[activeItem.title]]"
            subheader="[[activeItem.description]]"
            action="Access site"
            icon="[[activeItem.metadata.icon]]"
            event-data="[[activeItem]]"
            event-name="haxcms-load-site"
          >
          </magazine-cover>
        </paper-dialog-scrollable>
        <div class="buttons">
          <iron-icon
            icon="editor:format-color-fill"
            style$="color:[[activeItem.metadata.hexCode]]"
          ></iron-icon
          >[[activeItem.metadata.hexCode]]
          <iron-icon icon="av:web"></iron-icon>Theme:
          [[activeItem.metadata.theme.name]]
          <paper-icon-button
            id="editsite"
            icon="icons:settings"
            style="color:black"
          ></paper-icon-button>
          <paper-tooltip
            for="edit"
            position="bottom"
            offset="12"
            animation-delay="200"
            >change details</paper-tooltip
          >
          <paper-icon-button
            id="archivesite"
            icon="icons:archive"
            dialog-dismiss
            style="color:grey"
          ></paper-icon-button>
          <paper-tooltip
            for="archivesite"
            position="top"
            offset="12"
            animation-delay="200"
            >archive site</paper-tooltip
          >
          <paper-icon-button
            on-tap="_downloadSite"
            id="download"
            icon="icons:file-download"
            style="color:black"
          ></paper-icon-button>
          <paper-tooltip
            for="download"
            position="top"
            offset="12"
            animation-delay="200"
            >Download zip</paper-tooltip
          >
        </div>
      </paper-dialog>
      <paper-dialog id="settingsdialog" with-backdrop>
        <h3>Edit HAXCMS configuration</h3>
        <paper-dialog-scrollable>
          <eco-json-schema-object id="settingsform"></eco-json-schema-object>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button
            on-tap="_saveConfig"
            dialog-confirm
            id="saveconfig"
            raised
            >Save</paper-button
          >
          <paper-button dialog-dismiss>cancel</paper-button>
        </div>
      </paper-dialog>
    `;
  }
  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String,
        value: "Site list"
      },
      /**
       * Site title
       */
      siteTitle: {
        type: String
      },
      /**
       * Sites response change
       */
      __sitesResponse: {
        type: String,
        observer: "__sitesResponseChanged"
      },
      /**
       * Base path of where this is located.
       */
      basePath: {
        type: String
      },
      /**
       * Data Source to power the loading of sites in JSON Outline Schema format.
       */
      dataSource: {
        type: String,
        observer: "_dataSourceChanged"
      },
      /**
       * JSON Web token
       */
      jwt: {
        type: String,
        observer: "_jwtChanged"
      },
      /**
       * Request params for creating a new site
       */
      createParams: {
        type: Object,
        value: {}
      },
      /**
       * Request params for downloading a new site
       */
      downloadParams: {
        type: Object,
        value: {}
      },
      /**
       * Request params for loading config
       */
      configParams: {
        type: Object,
        value: {}
      },
      /**
       * Request params for loading config
       */
      setConfigParams: {
        type: Object,
        value: {}
      },
      /**
       * Active item that's being reviewed / has bubbled up.
       */
      activeItem: {
        type: Object,
        notify: true,
        observer: "_activeItemChanged"
      },
      /**
       * Logged in state
       */
      loggedIn: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        observer: "_loginStateChanged"
      },
      /**
       * Edit mode
       */
      editMode: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        value: false,
        observer: "_editModeChanged"
      }
    };
  }
  /**
   * Toggle drawer open
   */
  drawerToggle(e) {
    this.$.drawer.toggle();
  }
  /**
   * Site response has changed.
   */
  __sitesResponseChanged(newValue) {
    if (newValue) {
      this.title = newValue.title;
      setTimeout(() => {
        if (this.jwt) {
          this.$.siteslisting.$.list.querySelector(
            '[data-site-id="item-new"]'
          ).hidden = false;
          this.$.mapmenu.$.builder.shadowRoot.querySelector(
            "#item-new"
          ).hidden = false;
          this.$.add.hidden = false;
        } else {
          this.$.siteslisting.$.list.querySelector(
            '[data-site-id="item-new"]'
          ).hidden = true;
          this.$.mapmenu.$.builder.shadowRoot.querySelector(
            "#item-new"
          ).hidden = true;
          this.$.add.hidden = true;
        }
      }, 100);
    }
  }
  _dataSourceChanged(newValue) {
    if (newValue) {
      this._dataSource = newValue + "?" + Math.floor(Date.now() / 1000);
    }
  }
  /**
   * Request a user login if we need one or log out
   */
  _loginStateChange(e) {
    if (e.detail) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
  /**
   * Request a user login if we need one or log out
   */
  _editModeChanged(newValue) {
    if (newValue) {
      this.__editIcon = "icons:check";
    } else {
      this.__editIcon = "icons:create";
    }
  }
  /**
   * Login state changed
   */
  _loginStateChanged(newValue) {
    if (newValue) {
      this.__loginText = "Log out";
      this.__loginIcon = "icons:account-circle";
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: "Welcome, log in successful!",
          duration: 4000
        }
      });
      this.dispatchEvent(evt);
      this.$.add.hidden = false;
      this.$.siteslisting.$.list.querySelector(
        '[data-site-id="item-new"]'
      ).hidden = false;
      this.$.mapmenu.$.builder.shadowRoot.querySelector(
        "#item-new"
      ).hidden = false;
    } else {
      this.__loginText = "Log in";
      this.__loginIcon = "icons:power-settings-new";
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: "You logged out",
          duration: 4000
        }
      });
      this.dispatchEvent(evt);
      this.$.add.hidden = true;
      this.$.siteslisting.$.list.querySelector(
        '[data-site-id="item-new"]'
      ).hidden = true;
      this.$.mapmenu.$.builder.shadowRoot.querySelector(
        "#item-new"
      ).hidden = true;
    }
  }
  /**
   * Request a user login if we need one or log out
   */
  _jwtChanged(newValue) {
    if (newValue) {
      this.__loginText = "Log out";
      this.__loginIcon = "icons:account-circle";
    } else {
      this.__loginText = "Log in";
      this.__loginIcon = "icons:power-settings-new";
    }
  }
  /**
   * Request a user login if we need one or log out
   */
  _loginUserRoutine(e) {
    this.$.jwt.toggleLogin();
  }
  /**
   * Use events for real value in theme.
   */
  _themeChanged(e) {
    // while not the actual spec for our theme metadata, this is the primary key
    // so the backend can update it correctly on response
    if (e.detail.value) {
      this.set("activeItem.metadata.theme", e.detail.value);
      this.notifyPath("activeItem.metadata.theme");
    }
  }
  /**
   * Use events for real value in color area.
   */
  _colorChanged(e) {
    this.set("activeItem.metadata.cssVariable", e.detail.value);
    this.notifyPath("activeItem.metadata.cssVariable");
    this.set(
      "activeItem.metadata.hexCode",
      SimpleColors.colors[
        e.detail.value
          .replace("--simple-colors-default-theme-", "")
          .replace("-7", "")
      ][6]
    );
    this.notifyPath("activeItem.metadata.hexCode");
  }
  /**
   * Add button clicked, trick DOM into clicking the add new site item.
   */
  _addTap(e) {
    let itemNew = this.$.siteslisting.$.list.querySelector(
      '[data-site-id="item-new"]'
    );
    if (itemNew) {
      itemNew.click();
    }
  }
  /**
   * Toggle edit state
   */
  _editTap(e) {
    this.editMode = !this.editMode;
  }
  /**
   * _settingsTap
   */
  _settingsTap(e) {
    this._loadConfig();
    this.$.settingsdialog.opened = true;
  }
  /**
   * User clicked on the flyout menu, set that item to active.
   */
  _mapMenuSelection(e) {
    // run through available sites and find the matching ID
    let findSite = this.__sites.filter(site => {
      if (site.id !== e.detail) {
        return false;
      }
      return true;
    });
    // if we found one, make it the top level item
    if (findSite.length > 0) {
      this.set("activeItem", {});
      this.set("activeItem", findSite.pop());
      this.notifyPath("activeItem.*");
    }
  }
  /**
   * Selected item has changed
   */
  _activeItemChanged(newValue, oldvalue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof newValue.id !== typeof undefined
    ) {
      // for new items we need the new item form
      if (newValue.id === "item-new") {
        this.$.newdialog.opened = true;
        this.$.itemdialog.opened = false;
      } else {
        this.$.newdialog.opened = false;
        this.$.itemdialog.opened = true;
      }
    }
    // it's possible to have NO item in scope, ensure everything closes :)
    else if (
      typeof newValue !== typeof undefined &&
      typeof newValue.id !== typeof undefined
    ) {
      this.$.newdialog.opened = false;
      this.$.itemdialog.opened = false;
      this.$.drawer.opened = false;
    }
  }
  /**
   * Attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__loginPath = window.appSettings.login;
    this.__logoutPath = window.appSettings.logout;
    let themeOptions = [];
    let firstTheme = null;
    for (var theme in window.appSettings.themes) {
      let item = [
        {
          alt: window.appSettings.themes[theme].name,
          value: theme
        }
      ];
      themeOptions.push(item);
      if (!firstTheme) {
        firstTheme = theme;
      }
    }
    this.$.newsitetheme.options = themeOptions;
    if (!this.$.newsitetheme.value) {
      this.$.newsitetheme.value = firstTheme;
    }
    this.__setConfigPath = window.appSettings.setConfigPath;
    this.__getConfigPath = window.appSettings.getConfigPath;
    this.__createNewSitePath = window.appSettings.createNewSitePath;
    this.__downloadSitePath = window.appSettings.downloadSitePath;
    // @todo support state routing for loadActiveSite
    document.body.addEventListener(
      "sites-listing-item-selected",
      this._itemSelected.bind(this)
    );
    document.body.addEventListener(
      "haxcms-load-site",
      this.loadActiveSite.bind(this)
    );
    this.$.mapmenu.addEventListener(
      "selected",
      this._mapMenuSelection.bind(this)
    );
    this.$.newsitetheme.addEventListener(
      "change",
      this._themeChanged.bind(this)
    );
    this.$.newsitecolor.addEventListener(
      "change",
      this._colorChanged.bind(this)
    );
    this.$.jwt.addEventListener(
      "jwt-logged-in",
      this._loginStateChange.bind(this)
    );
    this.$.siteslisting.addEventListener(
      "item-overlay-option-selected",
      this._itemOptionSelected.bind(this)
    );
    this.$.siteslisting.addEventListener(
      "item-overlay-op-changed",
      this._itemOpChanged.bind(this)
    );
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    // @todo support state routing for loadActiveSite
    document.body.removeEventListener(
      "sites-listing-item-selected",
      this._itemSelected.bind(this)
    );
    document.body.removeEventListener(
      "haxcms-load-site",
      this.loadActiveSite.bind(this)
    );
    this.$.mapmenu.removeEventListener(
      "selected",
      this._mapMenuSelection.bind(this)
    );
    this.$.newsitetheme.removeEventListener(
      "change",
      this._themeChanged.bind(this)
    );
    this.$.newsitecolor.removeEventListener(
      "change",
      this._colorChanged.bind(this)
    );
    this.$.jwt.removeEventListener(
      "jwt-logged-in",
      this._loginStateChange.bind(this)
    );
    this.$.siteslisting.removeEventListener(
      "item-overlay-option-selected",
      this._itemOptionSelected.bind(this)
    );
    this.$.siteslisting.removeEventListener(
      "item-overlay-op-changed",
      this._itemOpChanged.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * created life cycle
   */
  constructor() {
    super();
    setPassiveTouchGestures(true);
    window.JSONOutlineSchema.requestAvailability();
    window.SimpleModal.requestAvailability();
    window.SimpleToast.requestAvailability();
    window.HAXCMS = {};
  }
  /**
   * Ready life cycle
   */
  ready() {
    super.ready();
    // set jwt from local storage bin
    this.jwt = localStorage.getItem("jwt");
  }
  /**
   * Simple method of loading whatever's been dictated as active.
   */
  loadActiveSite(e) {
    let findSite = this.__sites.filter(site => {
      if (site.id !== e.detail.id) {
        return false;
      }
      return true;
    });
    let item = findSite.pop();
    // if location isn't there, push out to it
    if (item.location) {
      window.open(item.location);
    } else {
      window.open("/_sites/" + item.metadata.siteName + "/index.html");
    }
  }
  /**
   * New button clicked, open modal
   */
  _itemSelected(e) {
    this.set("activeItem", {});
    this.set("activeItem", e.detail);
    this.notifyPath("activeItem.*");
  }
  /**
   * Create a new site button was clicked
   */
  _createSite(e) {
    // ship off a new call
    this.set("createParams.siteName", this.$.newsitetitle.value);
    this.notifyPath("createParams.siteName");
    this.set("createParams.description", this.$.newsitedescription.value);
    this.notifyPath("createParams.description");
    // need to pull this from the active item bc of data binding silly
    this.set("createParams.theme", this.activeItem.metadata.theme);
    this.notifyPath("createParams.theme");
    this.set("createParams.hexCode", this.activeItem.metadata.hexCode);
    this.notifyPath("createParams.hexCode");
    this.set("createParams.cssVariable", this.activeItem.metadata.cssVariable);
    this.notifyPath("createParams.cssVariable");
    this.set("createParams.image", this.$.newsiteimage.value);
    this.notifyPath("createParams.image");
    this.set("createParams.icon", this.$.newsiteicon.icon);
    this.notifyPath("createParams.icon");
    // pass along the jwt for user "session" purposes
    this.set("createParams.jwt", this.jwt);
    this.notifyPath("createParams.jwt");
    this.$.newsitetitle.value = "";
    this.$.newsitedescription.value = null;
    this.$.createrequest.generateRequest();
  }
  /**
   * Download a new site button was clicked
   */
  _downloadSite(e) {
    // ship off a new call
    this.set("downloadParams.siteName", this.activeItem.metadata.siteName);
    this.notifyPath("downloadParams.siteName");
    // pass along the jwt for user "session" purposes
    this.set("downloadParams.jwt", this.jwt);
    this.notifyPath("downloadParams.jwt");
    this.$.downloadrequest.generateRequest();
  }
  /**
   * Load configuration
   */
  _loadConfig() {
    // pass along the jwt for user "session" purposes
    this.set("configParams.jwt", this.jwt);
    this.notifyPath("configParams.jwt");
    this.set("configParams.token", this.createParams.token);
    this.notifyPath("configParams.token");

    this.$.getconfigrequest.generateRequest();
  }
  /**
   * Save configuration
   */
  _saveConfig(e) {
    window.HAXCMS.config.values = this.$.settingsform.value;
    // pass along the jwt for user "session" purposes
    this.set("setConfigParams.values", {});
    this.set("setConfigParams.values", window.HAXCMS.config.values);
    this.notifyPath("setConfigParams.values.*");
    this.set("setConfigParams.jwt", this.jwt);
    this.notifyPath("setConfigParams.jwt");
    this.set("setConfigParams.token", this.createParams.token);
    this.notifyPath("setConfigParams.token");

    this.$.setconfigrequest.generateRequest();
  }
  /**
   * Create a new site button was clicked
   */
  handleCreateResponse(e) {
    // update the listing data
    this._dataSource = this.dataSource + "?" + Math.floor(Date.now() / 1000);
    this.dispatchEvent(
      new CustomEvent("sites-listing-refresh-data", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.detail.response
      })
    );
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: e.detail.response.title + " created successfully!",
        duration: 4000
      }
    });
    this.dispatchEvent(evt);
  }
  handleConfigResponse(e) {
    window.HAXCMS.config = e.detail.response;
    this.$.settingsform.set("schema", window.HAXCMS.config.schema);
    this.$.settingsform.set("value", window.HAXCMS.config.values);
  }
  handleSetConfigResponse(e) {
    this.$.settingsdialog.opened = false;
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "HAXCMS configuration updated!",
        duration: 4000
      }
    });
    this.dispatchEvent(evt);
  }
  /**
   * Download a site
   */
  handleDownloadResponse(e) {
    // fire incase anyone cares
    this.dispatchEvent(
      new CustomEvent("download-site-listing", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.detail.response
      })
    );
    var element = document.createElement("a");
    element.setAttribute("href", e.detail.response.link);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: this.activeItem.title + " downloaded successfully!",
        duration: 4000
      }
    });
    this.dispatchEvent(evt);
  }
  /**
   * Option selected in an operation in context
   */
  _itemOptionSelected(e) {
    var element = e.detail.element;
    switch (e.detail.operation) {
      case "remove":
        if (e.detail.option === "option1") {
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              text: "Deleting this",
              duration: 4000
            }
          });
          this.dispatchEvent(evt);
          // @todo send call out the door to delete callback
        }
        break;
      case "duplicate":
        if (e.detail.option === "option1") {
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              text: "Duplicating this",
              duration: 4000
            }
          });
          this.dispatchEvent(evt);
          // @todo send call out the door to duplicate callback
        }
        break;
      case "move":
        if (e.detail.option === "option1") {
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              text: "Move this item left",
              duration: 4000
            }
          });
          this.dispatchEvent(evt);
        } else {
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              text: "Move this item right",
              duration: 4000
            }
          });
          this.dispatchEvent(evt);
        }
        // @todo send call out the door to commit the move callback
        break;
    }
  }
  /**
   * Selected operation changed; we use this for edit mode detection
   */
  _itemOpChanged(e) {
    var element = e.detail.element;
    if (e.detail.operation === "edit") {
      let findSite = this.__sites.filter(site => {
        if (site.id !== element.getAttribute("data-site-id")) {
          return false;
        }
        return true;
      });
      // if we found one, make it the top level item
      if (findSite.length > 0) {
        this.set("activeItem", {});
        this.set("activeItem", findSite.pop());
        this.notifyPath("activeItem.*");
        // simulate clicking on the edit button that's in this tab
        this.$.edit.click();
      }
    }
  }
}
window.customElements.define(HAXCMSSiteListing.tag, HAXCMSSiteListing);
export { HAXCMSSiteListing };
