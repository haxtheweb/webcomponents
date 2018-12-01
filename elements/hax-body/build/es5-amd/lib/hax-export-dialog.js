define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@lrnwebcomponents/dl-behavior/dl-behavior.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(
  _polymerLegacy,
  _appDrawer,
  _ironIcon,
  _ironIcons,
  _paperInput,
  _paperButton,
  _dlBehavior,
  _simpleColors
) {
  "use strict";
  function _templateObject_e1e8df10f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="simple-colors">\n      :host {\n        display: block;\n      }\n      #dialog {\n        z-index: 1000;\n        margin-top: 64px;\n      }\n      .title {\n        margin-top: 32px;\n        text-align: center;\n        padding: 16px;\n        margin: 0;\n        background-color: rgba(0, 0, 0, 0.5);\n        font-size: 32px;\n        font-weight: bold;\n        font-family: sans-serif;\n        text-transform: uppercase;\n        color: var(--simple-colors-default-theme-light-green-1);\n      }\n      .pref-container {\n        text-align: left;\n        padding: 16px;\n      }\n      app-drawer {\n        --app-drawer-content-container: {\n          background-color: rgba(0, 0, 0, 0.7);\n        };\n        --app-drawer-width: 320px;\n      }\n      .buttons paper-button:focus,\n      .buttons paper-button:hover {\n        background-color: var(--simple-colors-default-theme-light-green-1);\n        border-color: var(--simple-colors-default-theme-light-green-1);\n        outline: 2px solid var(--simple-colors-default-theme-light-green-1);\n      }\n      .buttons paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #F8F8F8;\n        display: flex;\n        border-radius: 0px;\n        border-style: solid;\n        border-width: 1px;\n        min-width: unset;\n        font-size: 12px;\n        font-weight: bold;\n      }\n      #closedialog {\n        float: right;\n        top: 135px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-default-theme-light-green-1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      #textarea {\n        margin-bottom: 16px;\n        padding: 10px;\n        width: 90%;\n        font-size: 10px;\n        resize: none;\n        width: 80%;\n        width: -webkit-fill-available;\n        background-color: transparent;\n        color: #EEEEEE;\n        font-family: monospace;\n      }\n    </style>\n    <app-drawer id="dialog" align="right">\n      <h3 class="title">[[title]]</h3>\n      <div style="height: 100%; overflow: auto;" class="pref-container">\n        <textarea id="textarea" rows="20"></textarea>\n        <div class="buttons">\n          <paper-button id="downloadfull" raised="">Download as full file</paper-button>\n          <paper-button id="download" raised="">Download HTML contents only</paper-button>\n          <paper-button id="copy" raised="">Copy to clipboard</paper-button>\n          <paper-button id="import" raised="" hidden$="[[!globalPreferences.haxDeveloperMode]]">Import textarea into HAX</paper-button>\n          <paper-button id="elementexport" raised="" hidden$="[[!globalPreferences.haxDeveloperMode]]">Copy as HAX schema to clipboard</paper-button>\n        </div>\n      </div>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </app-drawer>\n'
      ],
      [
        '\n    <style include="simple-colors">\n      :host {\n        display: block;\n      }\n      #dialog {\n        z-index: 1000;\n        margin-top: 64px;\n      }\n      .title {\n        margin-top: 32px;\n        text-align: center;\n        padding: 16px;\n        margin: 0;\n        background-color: rgba(0, 0, 0, 0.5);\n        font-size: 32px;\n        font-weight: bold;\n        font-family: sans-serif;\n        text-transform: uppercase;\n        color: var(--simple-colors-default-theme-light-green-1);\n      }\n      .pref-container {\n        text-align: left;\n        padding: 16px;\n      }\n      app-drawer {\n        --app-drawer-content-container: {\n          background-color: rgba(0, 0, 0, 0.7);\n        };\n        --app-drawer-width: 320px;\n      }\n      .buttons paper-button:focus,\n      .buttons paper-button:hover {\n        background-color: var(--simple-colors-default-theme-light-green-1);\n        border-color: var(--simple-colors-default-theme-light-green-1);\n        outline: 2px solid var(--simple-colors-default-theme-light-green-1);\n      }\n      .buttons paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #F8F8F8;\n        display: flex;\n        border-radius: 0px;\n        border-style: solid;\n        border-width: 1px;\n        min-width: unset;\n        font-size: 12px;\n        font-weight: bold;\n      }\n      #closedialog {\n        float: right;\n        top: 135px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-default-theme-light-green-1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      #textarea {\n        margin-bottom: 16px;\n        padding: 10px;\n        width: 90%;\n        font-size: 10px;\n        resize: none;\n        width: 80%;\n        width: -webkit-fill-available;\n        background-color: transparent;\n        color: #EEEEEE;\n        font-family: monospace;\n      }\n    </style>\n    <app-drawer id="dialog" align="right">\n      <h3 class="title">[[title]]</h3>\n      <div style="height: 100%; overflow: auto;" class="pref-container">\n        <textarea id="textarea" rows="20"></textarea>\n        <div class="buttons">\n          <paper-button id="downloadfull" raised="">Download as full file</paper-button>\n          <paper-button id="download" raised="">Download HTML contents only</paper-button>\n          <paper-button id="copy" raised="">Copy to clipboard</paper-button>\n          <paper-button id="import" raised="" hidden\\$="[[!globalPreferences.haxDeveloperMode]]">Import textarea into HAX</paper-button>\n          <paper-button id="elementexport" raised="" hidden\\$="[[!globalPreferences.haxDeveloperMode]]">Copy as HAX schema to clipboard</paper-button>\n        </div>\n      </div>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </app-drawer>\n'
      ]
    );
    _templateObject_e1e8df10f51a11e8a8e7334679f4d101 = function _templateObject_e1e8df10f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e1e8df10f51a11e8a8e7334679f4d101()
    ),
    is: "hax-export-dialog",
    behaviors: [mtz.FileDownloadBehaviors],
    properties: {
      title: { type: String, value: "Export" },
      globalPreferences: { type: Object, value: {} }
    },
    created: function created() {
      this.__attached = !1;
    },
    attached: function attached() {
      if (!this.__attached) {
        this.__attached = !0;
        document.body.appendChild(this);
      } else {
        this.fire("hax-register-export", this);
        document.body.addEventListener(
          "hax-store-property-updated",
          this._haxStorePropertyUpdated.bind(this)
        );
        this.$.download.addEventListener("tap", this.download.bind(this));
        this.$.downloadfull.addEventListener(
          "tap",
          this.downloadfull.bind(this)
        );
        this.$.import.addEventListener("tap", this.importContent.bind(this));
        this.$.copy.addEventListener("tap", this.selectBody.bind(this));
        this.$.closedialog.addEventListener("tap", this.close.bind(this));
        this.$.elementexport.addEventListener(
          "tap",
          this.htmlToHaxElements.bind(this)
        );
      }
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      this.$.download.removeEventListener("tap", this.download.bind(this));
      this.$.downloadfull.removeEventListener(
        "tap",
        this.downloadfull.bind(this)
      );
      this.$.import.removeEventListener("tap", this.importContent.bind(this));
      this.$.copy.removeEventListener("tap", this.selectBody.bind(this));
      this.$.closedialog.removeEventListener("tap", this.close.bind(this));
      this.$.elementexport.removeEventListener(
        "tap",
        this.htmlToHaxElements.bind(this)
      );
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
    download: function download(e) {
      var data = this.contentToFile(!1);
      this.downloadFromData(data, "html", "my-new-code");
    },
    downloadfull: function downloadfull(e) {
      var data = this.contentToFile(!0);
      this.downloadFromData(data, "html", "my-new-webpage");
    },
    importContent: function importContent(e) {
      var htmlBody = this.$.textarea.value;
      return window.HaxStore.instance.activeHaxBody.importContent(htmlBody);
    },
    selectBody: function selectBody(e) {
      this.$.textarea.focus();
      this.$.textarea.select();
      document.execCommand("copy");
    },
    htmlToHaxElements: function htmlToHaxElements(e) {
      var elements = window.HaxStore.htmlToHaxElements(this.$.textarea.value),
        str = JSON.stringify(elements, null, 2),
        val = this.$.textarea.value;
      this.$.textarea.value = str;
      this.$.textarea.focus();
      this.$.textarea.select();
      document.execCommand("copy");
      this.$.textarea.value = val;
    },
    contentToFile: function contentToFile(full) {
      var content = "";
      if (full) {
        var elementList = window.HaxStore.instance.elementList,
          url = "https://lrnwebcomponents.github.io/hax-body/components";
        content = '\n      <!doctype html>\n      <html lang="en">\n        <head>\n          <meta charset="utf-8">\n          <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">\n          <title>hax-body demo</title>\n          <script src="'.concat(
          url,
          '/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>\n          <style>\n          body {\n            padding: 32px;\n          }\n          </style>\n      '
        );
        var ignoreList = ["iframe", "a", "img", "hr", "p"];
        for (var index in elementList) {
          if (-1 === ignoreList.indexOf(index)) {
            content +=
              '<script type="module" src="' +
              url +
              "/" +
              index +
              "/" +
              index +
              '.js" />' +
              "\n";
          }
        }
        content += "</head><body>";
        content += window.HaxStore.instance.activeHaxBody.haxToContent();
        content += "</body></html>";
      } else {
        content = window.HaxStore.instance.activeHaxBody.haxToContent();
      }
      return content;
    },
    toggleDialog: function toggleDialog() {
      if (this.$.dialog.opened) {
        this.close();
      } else {
        this.$.textarea.value = this.contentToFile(!1);
        window.HaxStore.instance.closeAllDrawers(this);
      }
    },
    open: function open() {
      this.$.dialog.open();
    },
    close: function close() {
      this.$.dialog.close();
    }
  });
});
