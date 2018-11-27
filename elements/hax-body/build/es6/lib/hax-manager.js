import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-styles/paper-styles.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/iron-pages/iron-pages.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@vaadin/vaadin-upload/vaadin-upload.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./hax-preview.js";
import "./hax-app-browser.js";
import "./hax-gizmo-browser.js";
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: block;
        --hax-manager-steps-color: #FFFFFF;
        --hax-manager-ink-color: #FFFFFF;
        --hax-accent: var(--simple-colors-light-green-background1);
        color: #FFFFFF;
      }
      #dialog {
        color: #FFFFFF;
        z-index: 10000;
        padding: 56px 0;
        margin-top: 64px;
        --app-drawer-width: 400px;
        --app-drawer-content-container: {
          background-color: rgba(0, 0, 0, 0.7);
        };
      }
      #closedialog {
        float: right;
        top: 135px;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-light-green-background1, green);
        background-color: transparent;
        width: 40px;
        height: 40px;
        min-width: unset;
      }
      :host([active-page="0"]) #dialog {
        --app-drawer-width: 400px;
      }
      :host([active-page="1"]) #dialog {
        --app-drawer-width: 800px;
      }
      :host([active-page="2"]) #dialog {
        --app-drawer-width: 800px;
      }
      :host([active-step]) #dialog {
        --app-drawer-width: 1000px;
      }
      :host([searching]) #dialog {
        --app-drawer-width: 1000px;
      }
      .title {
        text-align: center;
        padding: 16px;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 32px;
        font-weight: bold;
        font-family: sans-serif;
        text-transform: uppercase;
        color: var(--simple-colors-light-green-background1);
      }
      #activepage {
      }
      #preview {
        height: 100%;
      }
      vaadin-upload {
        --primary-color: var(--hax-accent);
        --primary-font-color: #FFFFFF;
        --dark-primary-color: #FFFFFF;
        --light-primary-color: var(--hax-accent);
        --error-color: darkred;
        color: #FFFFFF;
        display: block;
        padding: 32px !important;
        --vaadin-upload-button-add-wrapper: {
          border: 2px solid #FFFFFF;
          background-color: var(--hax-accent);
          color: #FFFFFF;
          display: block;
        };
        --vaadin-upload-buttons-primary: {
          display: block;
          width: 100%;
          flex: unset;
          -webkit-flex: unset;
        };
        --vaadin-upload-button-add: {
          color: #000000;
          display: block;
          flex: unset;
          -webkit-flex: unset;
          text-align: center;
        };
        --vaadin-upload-drop-label: {
          color: #FFFFFF;
          display: block;
          padding: 16px;
        };
        --vaadin-upload-drop-label-dragover: {
          color: #FFFFFF;
        };
        --vaadin-upload-file-list: {
          padding: 16px;
          margin: 0;
          color: #FFFFFF;
        };
        --vaadin-upload-file: {
          color: #FFFFFF;
        };
      }
      vaadin-upload[dragover] {
        border-color: #396;
      }
      vaadin-upload-file {
        --disabled-text-color: #222222;
      }
      .add-area-content-wrapper {
        padding: 0 16px;
      }
      .add-url-are,
      .add-upload-area {
        margin: 16px 0;
      }
      .url-description {
        font-size: 18px;
        color: #FFFFFF;
        line-height: 22px;
        font-family: sans-serif;
        letter-spacing: 1px;
      }
      #steppages {
        height: 100%;
      }
      #newassetconfigure {
        width: 100%;
        margin: 0;
        padding: 16px;
        background-color: var(--simple-colors-light-green-background1);
        color: #000000;
      }
      paper-input {
        color: #FFFFFF;
        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);
        --secondary-text-color: #FFFFFF;
        --primary-text-color: #FFFFFF;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF;
        --paper-input-container-focus-color: var(--simple-colors-light-green-background1);
      }
      @media screen and (max-width: 550px) {
        .hide-on-mobile {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          left: -9999px;
        }
        .page-area.hax-manager {
          padding: 6px;
        }
      }
    </style>
  </custom-style>
    <app-drawer id="dialog" opened="{{opened}}" disable-swipe="">
      <div class="dialog-contents" id="dialogcontent" style="height: 100%; overflow: auto;">
        <iron-pages id="steppages" selected="{{activeStep}}" fallback-selection="select" role="main">
          <div data-value="select">
            <iron-pages id="activepage" selected="{{activePage}}" fallback-selection="link">
              <div class="page-area add-area">
                <h3 class="title">[[addTitle]]</h3>
                <div class="add-area-content-wrapper">
                  <div class="add-url-area">
                    <paper-input id="url" label="URL" type="url" auto-validate=""></paper-input>
                  <div class="url-description">A full URL with https:// referencing a link that already exists on the web.</div>
                  </div>
                  <div class="add-upload-area">
                    <vaadin-upload form-data-name="file-upload" id="fileupload" hidden\$="[[!canSupportUploads]]"></vaadin-upload>
                  </div>
                  <paper-button id="newassetconfigure" raised="">Configure item</paper-button>
                </div>
              </div>
              <div class="page-area">
                <hax-app-browser id="appbrowser">
                  <slot></slot>
                </hax-app-browser>
              </div>
              <div class="page-area">
                <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
              </div>
            </iron-pages>
          </div>
          <div style="height:100%;">
            <hax-preview id="preview" element="{{activeHaxElement}}"></hax-preview>
          </div>
        </iron-pages>
        <paper-button id="closedialog" on-tap="cancel">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </div>
    </app-drawer>
`,
  is: "hax-manager",
  behaviors: [simpleColorsBehaviors],
  properties: {
    opened: {
      type: Boolean,
      value: !1,
      reflectToAttribute: !0,
      observer: "_openedChanged"
    },
    editExistingNode: { type: Boolean, value: !1 },
    editTitle: {
      type: String,
      computed: "_computeEditTitle(editExistingNode)"
    },
    addTitle: { type: String, value: "Add content" },
    activeStep: {
      type: Boolean,
      reflectToAttribute: !0,
      value: !1,
      observer: "_activeStepChanged"
    },
    searching: { type: Boolean, reflectToAttribute: !0, value: !1 },
    activePage: {
      type: String,
      reflectToAttribute: !0,
      value: 0,
      observer: "_activePageChanged"
    },
    canSupportUploads: { type: Boolean, value: !1 },
    activeHaxElement: { type: Object, observer: "_activeHaxElementChanged" },
    appList: { type: Array, value: [] },
    __allowUpload: { type: Boolean, value: !1 },
    appendJwt: { type: String, value: null },
    appendUploadEndPoint: { type: String, value: null }
  },
  created: function() {
    this.__attached = !1;
  },
  attached: function() {
    if (!this.__attached) {
      this.__attached = !0;
      document.body.appendChild(this);
    } else {
      this.fire("hax-register-manager", this);
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.addEventListener(
        "hax-app-picker-selection",
        this._haxAppPickerSelection.bind(this)
      );
      document.body.addEventListener(
        "place-holder-file-drop",
        this._placeHolderFileDrop.bind(this)
      );
      this.$.dialog.addEventListener(
        "iron-overlay-canceled",
        this.close.bind(this)
      );
      this.$.dialog.addEventListener(
        "iron-overlay-closed",
        this.close.bind(this)
      );
      this.$.closedialog.addEventListener("tap", this.close.bind(this));
      this.$.newassetconfigure.addEventListener(
        "tap",
        this.newAssetConfigure.bind(this)
      );
      this.$.fileupload.addEventListener(
        "upload-before",
        this._fileAboutToUpload.bind(this)
      );
      this.$.fileupload.addEventListener(
        "upload-response",
        this._fileUploadResponse.bind(this)
      );
    }
  },
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.removeEventListener(
      "hax-app-picker-selection",
      this._haxAppPickerSelection.bind(this)
    );
    document.body.removeEventListener(
      "place-holder-file-drop",
      this._placeHolderFileDrop.bind(this)
    );
    this.$.dialog.removeEventListener(
      "iron-overlay-canceled",
      this.close.bind(this)
    );
    this.$.dialog.removeEventListener(
      "iron-overlay-closed",
      this.close.bind(this)
    );
    this.$.closedialog.removeEventListener("tap", this.close.bind(this));
    this.$.newassetconfigure.removeEventListener(
      "tap",
      this.newAssetConfigure.bind(this)
    );
    this.$.fileupload.removeEventListener(
      "upload-before",
      this._fileAboutToUpload.bind(this)
    );
    this.$.fileupload.removeEventListener(
      "upload-response",
      this._fileUploadResponse.bind(this)
    );
  },
  togglePanelSize: function(e) {
    this.$.dialog.classList.toggle("grow");
    this.updateStyles();
    window.dispatchEvent(new Event("resize"));
  },
  _computeEditTitle: function(updateExisting) {
    if (typeof this.activeHaxElement !== typeof void 0 && updateExisting) {
      return "Update";
    } else {
      return "Insert";
    }
  },
  _placeHolderFileDrop: function(e) {
    this.resetManager();
    this.open();
    window.HaxStore.instance.activePlaceHolder = e.detail.placeHolderElement;
    this.$.fileupload._onDrop(e.detail);
  },
  _fileAboutToUpload: function(e) {
    if (!this.__allowUpload) {
      e.preventDefault();
      e.stopPropagation();
      let values = { source: e.detail.file.name, type: e.detail.file.type };
      var type = window.HaxStore.guessGizmoType(values);
      let targets = window.HaxStore.getHaxAppStoreTargets(type);
      if (0 != targets.length) {
        window.HaxStore.instance.haxAppPicker.presentOptions(
          targets,
          type,
          "Where would you like to upload this " + type + "?",
          "app"
        );
      } else {
        window.HaxStore.toast(
          "Sorry, you don't have a storage location that can handle " +
            type +
            " uploads!",
          5e3
        );
      }
    } else {
      this.__allowUpload = !1;
    }
  },
  _haxAppPickerSelection: function(e) {
    let connection = e.detail.connection;
    this.__appUsed = e.detail;
    this.$.fileupload.method = connection.operations.add.method;
    let requestEndPoint = connection.protocol + "://" + connection.url;
    if ("/" != requestEndPoint.substr(requestEndPoint.length - 1)) {
      requestEndPoint += "/";
    }
    if (typeof connection.operations.add.endPoint !== typeof void 0) {
      requestEndPoint += connection.operations.add.endPoint;
    }
    if (null != this.appendUploadEndPoint) {
      requestEndPoint += "?" + this.appendUploadEndPoint;
    }
    if (null != this.appendJwt) {
      requestEndPoint +=
        "&" + this.appendJwt + "=" + localStorage.getItem(this.appendJwt);
    }
    this.$.fileupload.headers = connection.headers;
    this.$.fileupload.target = requestEndPoint;
    this.__allowUpload = !0;
    this.$.fileupload.uploadFiles();
  },
  _fileUploadResponse: function(e) {
    let response = JSON.parse(e.detail.xhr.response),
      map = this.__appUsed.connection.operations.add.resultMap,
      data = {},
      item = {};
    if (typeof this._resolveObjectPath(map.item, response) !== typeof void 0) {
      data = this._resolveObjectPath(map.item, response);
    }
    item.type = map.defaultGizmoType;
    for (var prop in map.gizmo) {
      item[prop] = this._resolveObjectPath(map.gizmo[prop], data);
    }
    if (
      typeof item.url === typeof void 0 &&
      typeof item.source !== typeof void 0
    ) {
      item.url = item.source;
    }
    if (typeof map.gizmo.type !== typeof void 0) {
      item.type = this._resolveObjectPath(map.gizmo.type, data);
    }
    this.$.url.value = item.url;
    this.newAssetConfigure();
  },
  _activePageChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      this.searching = !1;
      this.updateStyles();
      if (1 === newValue) {
        this.$.appbrowser.resetBrowser();
      } else if (2 === newValue) {
        this.$.gizmobrowser.resetBrowser();
      }
    }
  },
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },
  _activeHaxElementChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0) {
      this.$.preview.advancedForm = !1;
      if (typeof newValue.tag === typeof void 0) {
        this.resetManager();
      } else {
        this.$.fileupload.set("files", []);
        this.$.dialog.scrollTop = 0;
        this.selectStep("configure");
      }
    }
  },
  insertHaxElement: function(e) {
    let previewNode = this.$.preview.previewNode,
      element = window.HaxStore.nodeToHaxElement(previewNode);
    element.replace = this.editExistingNode;
    if (typeof this.activeHaxElement.__type !== typeof void 0) {
      element.__type = this.activeHaxElement.__type;
    }
    element.replacement = previewNode;
    this.fire("hax-insert-content", element);
    let toast = "New element added!";
    if (this.editExistingNode) {
      toast = "Element updated!";
    }
    window.HaxStore.toast(toast, 2e3);
    this.close();
  },
  resetManager: function(activePage = 0) {
    this.selectStep("select");
    this.activePage = activePage;
    document.body.style.overflow = null;
    this.appList = window.HaxStore.instance.appList;
    this.searching = !1;
    window.HaxStore.write("activeApp", null, this);
    window.dispatchEvent(new Event("resize"));
    this.editExistingNode = !1;
    this.$.url.value = "";
    this.$.fileupload.headers = "";
    this.$.fileupload.method = "";
    this.$.fileupload.target = "";
    this.__allowUpload = !1;
  },
  cancel: function(e) {
    this.close();
  },
  _openedChanged: function(newValue, oldValue) {
    if (oldValue && !newValue) {
      document.body.style.overflow = null;
    } else if (newValue && !oldValue) {
      document.body.style.overflow = "hidden";
    }
  },
  close: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget;
    if (
      typeof e === typeof void 0 ||
      local === this.$.dialog ||
      local === this.$.closedialog
    ) {
      window.HaxStore.write("activeHaxElement", {}, this);
      this.opened = !1;
      this.resetManager();
    }
  },
  open: function(e) {
    this.opened = !0;
  },
  newAssetConfigure: function() {
    let values = { source: this.$.url.value };
    var type = window.HaxStore.guessGizmoType(values);
    let haxElements = window.HaxStore.guessGizmo(type, values);
    if (0 < haxElements.length) {
      if (1 === haxElements.length) {
        if (typeof haxElements[0].tag !== typeof void 0) {
          window.HaxStore.write("activeHaxElement", haxElements[0], this);
        }
      } else {
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          type,
          "Pick how to present the " + type,
          "gizmo"
        );
      }
    } else {
      window.HaxStore.toast(
        "Sorry, HAX doesn't know how to handle that type of link yet."
      );
    }
  },
  toggleDialog: function(toggle = !0) {
    if (this.opened && toggle) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },
  selectStep: function(step) {
    if ("configure" == step) {
      this.activeStep = !0;
    } else {
      this.activeStep = !1;
    }
  },
  _activeStepChanged: function(newValue, oldValue) {
    if (newValue || !newValue) {
      this.updateStyles();
      window.dispatchEvent(new Event("resize"));
    }
  },
  _resolveObjectPath: function(path, obj) {
    return path.split(".").reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
});
