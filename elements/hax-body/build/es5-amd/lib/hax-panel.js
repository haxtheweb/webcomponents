define([
  "meta",
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js",
  "./hax-panel-item.js",
  "./hax-preferences-dialog.js",
  "./hax-stax-picker.js",
  "./hax-blox-picker.js"
], function(
  meta,
  _polymerLegacy,
  _appDrawer,
  _paperIconButton,
  _ironIcons,
  _simpleColorsPicker,
  _haxPanelItem,
  _haxPreferencesDialog,
  _haxStaxPicker,
  _haxBloxPicker
) {
  "use strict";
  meta = babelHelpers.interopRequireWildcard(meta);
  function _templateObject_978e0800f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        position: absolute;\n        z-index: 1000000;\n      }\n      app-drawer {\n        z-index: 100001;\n        height: 64px;\n        left: 0;\n        top: 0;\n        touch-action: auto;\n        visibility: hidden;\n        opacity: 0;\n        display: flex;\n        --app-drawer-width: 100%;\n        --app-drawer-content-container: {\n        --app-drawer-content-container_-_height: 64px;\n        --app-drawer-content-container_-_padding: 0;\n          width: 100%;\n          left: 0;\n          right: 0;\n          background-color: #2e2e2e;\n          padding: unset;\n          display: flex;\n          touch-action: auto;\n          overflow-x: auto;\n          overflow-y: hidden;\n          -webkit-overflow-scrolling: touch;\n          white-space: nowrap;\n        }\n      }\n      :host([align="right"]) app-drawer {\n        right: 0;\n        left: unset;\n      }\n      :host([edit-mode]) app-drawer {\n        visibility: visible;\n        transition: .6s ease opacity;\n        opacity: .9;\n        right: 0;\n        left: 0;\n        top: 0;\n      }\n      app-drawer[opened]:hover {\n        opacity: 1;\n      }\n      #button {\n        position: fixed;\n        top: 0;\n        left: 0;\n        visibility: visible;\n        z-index: 10000;\n        margin-left: 0;\n        transition: all 0;\n        opacity: .9;\n        border-radius: 50%;\n      }\n      :host([edit-mode]) #button {\n        visibility: hidden;\n        opacity: 0;\n        transition: all .8s ease;\n      }\n      #button:hover {\n        opacity: 1;\n      }\n      :host([align="right"]) #button {\n        right: 0;\n        left: unset;\n      }\n      @media screen and (max-width: 550px) {\n        app-drawer {\n          height: 40px;\n        }\n      }\n    </style>\n    <div hidden$="[[hidePanelOps]]">\n      <hax-panel-item light="[[light]]" data-opened$="[[editMode]]" on-tap="_clickEditButton" icon="create" id="button" edged="[[align]]" label="[[__tipText]]"></hax-panel-item>\n    </div>\n    <app-drawer id="drawer" opened="{{editMode}}" disable-swipe persistent transition-duration="800" align="[[align]]">\n      <hax-panel-item hidden$="[[hidePanelOps]]" on-tap="_clickSaveButton" icon="save" id="haxsavebutton" label="[[__tipText]]" event-name="save" voice-command="save content"></hax-panel-item>\n      <hax-panel-item icon="image:add-to-photos" icon-class="amber-text" label="Add" event-name="hax-manager-open" value="0"></hax-panel-item>\n      <hax-panel-item icon="search" icon-class="amber-text" label="Find" event-name="hax-manager-open" value="1"></hax-panel-item>\n      <hax-panel-item icon="hardware:toys" icon-class="amber-text" label="Make" event-name="hax-manager-open" value="2"></hax-panel-item>\n      <hax-panel-item icon="view-quilt" icon-class="amber-text" label="Layouts" event-name="hax-blox-picker-open" voice-command="insert block"></hax-panel-item>\n      <hax-panel-item icon="view-agenda" icon-class="amber-text" label="Templates" event-name="hax-stax-picker-open" voice-command="insert stack"></hax-panel-item>\n      <hax-panel-item icon="editor:text-fields" icon-class="light-blue-text" label="Text" event-name="text" voice-command="insert text"></hax-panel-item>\n      <hax-panel-item icon="editor:title" icon-class="light-blue-text" label="Heading" event-name="header" voice-command="insert heading"></hax-panel-item>\n      <hax-panel-item icon="image:transform" icon-class="light-blue-text" label="Placeholder" event-name="placeholder" voice-command="insert placeholder"></hax-panel-item>\n      <hax-panel-item icon="editor:space-bar" icon-class="light-blue-text text-darken-1" label="Divider" event-name="divider" voice-command="insert divider"></hax-panel-item>\n      <slot></slot>\n      <hax-panel-item hidden$="[[hidePreferencesButton]]" on-tap="_preferencesDialog" icon="settings" label="Preferences"></hax-panel-item>\n      <hax-panel-item hidden$="[[hideExportButton]]" on-tap="_htmlExportDialog" icon="code" label="Export"></hax-panel-item>\n      <hax-panel-item hidden$="[[hidePanelOps]]" icon="cancel" id="haxcancelbutton" label="Cancel" event-name="cancel" voice-command="cancel hax"></hax-panel-item>\n    </app-drawer>\n    <hax-stax-picker></hax-stax-picker>\n    <hax-blox-picker></hax-blox-picker>\n    <hax-preferences-dialog></hax-preferences-dialog>\n'
    ]);
    _templateObject_978e0800f1e611e8b3a2e3a031c18fd0 = function _templateObject_978e0800f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_978e0800f1e611e8b3a2e3a031c18fd0()
    ),
    is: "hax-panel",
    listeners: { "hax-item-selected": "_processItemEvent" },
    observers: ["_globalPreferencesChanged(globalPreferences.*)"],
    behaviors: [simpleColorsBehaviors],
    properties: {
      light: { type: Boolean },
      align: { type: String, reflectToAttribute: !0, value: "left" },
      editMode: {
        type: Boolean,
        reflectToAttribute: !0,
        observer: "_editModeChanged"
      },
      hideExportButton: { type: Boolean, value: !1 },
      haxDeveloperMode: { type: Boolean, value: !1 },
      hidePreferencesButton: { type: Boolean, value: !1 },
      hidePanelOps: { type: Boolean, value: !1 },
      globalPreferences: { type: Object }
    },
    ready: function ready() {
      document.body.appendChild(this);
    },
    attached: function attached() {
      this.fire("hax-register-panel", this);
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.addEventListener(
        "hax-panel-operation",
        this._processItemEvent.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.removeEventListener(
        "hax-panel-operation",
        this._processItemEvent.bind(this)
      );
    },
    _globalPreferencesChanged: function _globalPreferencesChanged(value) {
      if (
        babelHelpers.typeof(value) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (
          null != value.value &&
          babelHelpers.typeof(value.value.haxShowExportButton) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.hideExportButton = !value.value.haxShowExportButton;
        }
        if (
          null != value.value &&
          babelHelpers.typeof(value.value.haxDeveloperMode) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.haxDeveloperMode = value.value.haxDeveloperMode;
        }
      }
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        e.detail.property
      ) {
        if ("object" === babelHelpers.typeof(e.detail.value)) {
          this.set(e.detail.property, null);
        }
        this.set(e.detail.property, e.detail.value);
      }
    },
    _processItemEvent: function _processItemEvent(e) {
      var detail = e.detail;
      switch (detail.eventName) {
        case "open-panel":
          this._clickButton();
          break;
        case "cancel":
          this.toggle();
          this.fire("hax-cancel", detail);
          break;
        case "text":
          detail.tag = "p";
          detail.content = "";
          this.fire("hax-insert-content", detail);
          break;
        case "divider":
          detail.tag = "hr";
          detail.content = "";
          detail.properties = { style: "width:100%;" };
          this.fire("hax-insert-content", detail);
          break;
        case "header":
          detail.tag = "h2";
          detail.content = "Header";
          this.fire("hax-insert-content", detail);
          break;
        case "placeholder":
          detail.tag = "place-holder";
          detail.content = "";
          detail.properties = { style: "width:50%;" };
          this.fire("hax-insert-content", detail);
          break;
        case "image":
          detail.tag = "img";
          detail.content = "";
          detail.properties = {
            src:
              pathFromUrl(meta.url) +
              window.HaxStore.instance.defaults.image.src,
            alt: window.HaxStore.instance.defaults.image.alt,
            style: "width:100%;"
          };
          this.fire("hax-insert-content", detail);
          break;
        case "iframe":
          detail.tag = "iframe";
          detail.content = "";
          detail.properties = {
            src: window.HaxStore.instance.defaults.iframe.src,
            height: "400px",
            width: "100%",
            style: "width:100%;"
          };
          this.fire("hax-insert-content", detail);
          break;
        case "blockquote":
          detail.tag = "blockquote";
          detail.content = "";
          this.fire("hax-insert-content", detail);
          break;
        case "hax-manager-open":
          window.HaxStore.write("activeHaxElement", {}, this);
          window.HaxStore.instance.haxManager.resetManager(
            parseInt(detail.value)
          );
          window.HaxStore.instance.haxManager.toggleDialog(!1);
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
          break;
      }
    },
    _editModeChanged: function _editModeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        newValue
      ) {
        this.__tipText = "Save";
        this.$.button.icon = "save";
      } else {
        this.__tipText = "Edit";
        this.$.button.icon = "create";
      }
    },
    _clickEditButton: function _clickEditButton(e) {
      this.toggle();
    },
    _clickSaveButton: function _clickSaveButton(e) {
      this.toggle();
      this.fire("hax-save", e.detail);
    },
    _htmlExportDialog: function _htmlExportDialog(e) {
      window.HaxStore.instance.haxExport.toggleDialog();
    },
    _preferencesDialog: function _preferencesDialog(e) {
      window.HaxStore.instance.haxPreferences.toggleDialog();
    },
    toggle: function toggle(e) {
      window.HaxStore.write("editMode", !this.editMode, this);
      this.$.drawer.opened = this.editMode;
      if (!this.$.drawer.opened) {
        window.HaxStore.instance.closeAllDrawers();
      }
    }
  });
});
