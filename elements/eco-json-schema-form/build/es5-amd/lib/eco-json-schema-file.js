define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js"
], function(
  _polymerLegacy,
  async,
  _ironFlexLayoutClasses,
  _appLocalizeBehavior
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_d6e5ad90ecf111e88a0b4725ebfbecff() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n  <style is="custom-style" include="iron-flex iron-flex-alignment">\n\t\t\tpaper-input {\n\t\t\t\tpadding: 2px;\n\t\t\t\t--paper-input-container-label: {\n\t\t\t\t\twhite-space: normal;\n\t\t\t\t\tposition: static;\n\t\t\t\t\tfont-size: 22px;\n\t\t\t\t\tcolor: #212121;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t:host {\n\t\t\t\tdisplay: inline-block;\n\t\t\t}\n\n\t\t\t.enabled {\n\t\t\t\tborder: 1px dashed #555;\n\t\t\t\t@apply --file-upload-upload-border-enabled;\n\t\t\t}\n\n\t\t\t.hover {\n\t\t\t\topacity: .7;\n\t\t\t\tborder: 1px dashed #111;\n\t\t\t\t@apply --file-upload-upload-border-hover;\n\t\t\t}\n\n\t\t\t#UploadBorder {\n\t\t\t\tvertical-align: middle;\n\t\t\t\tcolor: #555;\n\t\t\t\tpadding: 20px;\n\t\t\t\tmax-height: 300px;\n\t\t\t\toverflow-y: auto;\n\t\t\t\tdisplay: inline-block;\n\t\t\t\t@apply --file-upload-upload-border;\n\t\t\t}\n\n\t\t\t#dropArea {\n\t\t\t\ttext-align: center;\n\t\t\t\t@apply --file-upload-drop-area;\n\t\t\t}\n\n\t\t\tpaper-button#button {\n\t\t\t\tmargin-bottom: 20px;\n\t\t\t\t@apply --file-upload-button;\n\t\t\t}\n\n\t\t\t.file {\n\t\t\t\tpadding: 10px 0px;\n\t\t\t\t@apply --file-upload-file;\n\t\t\t}\n\n\t\t\t.commands {\n\t\t\t\tfloat: right;\n\t\t\t\t@apply --file-upload-commands;\n\t\t\t}\n\n\t\t\t.commands iron-icon:not([icon="check-circle"]) {\n\t\t\t\tcursor: pointer;\n\t\t\t\topacity: .9;\n\t\t\t\t@apply --file-upload-commands-faded;\n\t\t\t}\n\n\t\t\t.commands iron-icon:hover {\n\t\t\t\topacity: 1;\n\t\t\t\t@apply --file-upload-commands-hovered;\n\t\t\t}\n\n\t\t\t[hidden] {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tcolor: #f40303;\n\t\t\t\tfont-size: 11px;\n\t\t\t\tmargin-top: 2px;\n\t\t\t\t@apply --file-upload-error;\n\t\t\t}\n\n\t\t\t.progress-bar {\n\t\t\t\tmargin-top: 2px;\n\t\t\t}\n\n\t\t\tpaper-progress {\n\t\t\t\t--paper-progress-active-color: #03a9f4;\n\t\t\t}\n\n\t\t\tpaper-progress[error] {\n\t\t\t\t--paper-progress-active-color: #f40303;\n\t\t\t}\n\t\t</style>\n\n\t\t<div class="layout horizontal nowrap">\n\t\t\t<div>\n\t\t\t\t<paper-button id="button" on-click="_fileClick" alt="{{paperButtonAlt}}" raised="">\n\t\t\t\t\t<iron-icon icon="editor:attach-file"></iron-icon>{{paperButtonTitle}}</paper-button>\n\t\t\t\t<div id="UploadBorder">\n\t\t\t\t\t<div id="dropArea" hidden$="{{!_shownDropText}}">{{dropText}}</div>\n\t\t\t\t\t<template is="dom-repeat" items="{{files}}">\n\t\t\t\t\t\t<div class="file">\n\t\t\t\t\t\t\t<div class="name"><span>{{item.name}}</span>\n\t\t\t\t\t\t\t\t<div class="commands">\n\t\t\t\t\t\t\t\t\t<iron-icon icon="autorenew" title="{{retryText}}" on-click="_retryUpload" hidden$="{{!item.error}}"></iron-icon>\n\t\t\t\t\t\t\t\t\t<iron-icon icon="cancel" title="{{removeText}}" on-click="_cancelUpload" hidden$="{{item.complete}}"></iron-icon>\n\t\t\t\t\t\t\t\t\t<iron-icon icon="check-circle" title="{{successText}}" hidden$="{{!item.complete}}"></iron-icon>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="error" hidden$="{{!item.error}}">{{errorText}}</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</template>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input type="file" id="fileInput" on-change="_fileChange" hidden="" multiple="{{multi}}" accept="{{accept}}">\n    </div>\n'
      ],
      [
        '\n  <style is="custom-style" include="iron-flex iron-flex-alignment">\n\t\t\tpaper-input {\n\t\t\t\tpadding: 2px;\n\t\t\t\t--paper-input-container-label: {\n\t\t\t\t\twhite-space: normal;\n\t\t\t\t\tposition: static;\n\t\t\t\t\tfont-size: 22px;\n\t\t\t\t\tcolor: #212121;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t:host {\n\t\t\t\tdisplay: inline-block;\n\t\t\t}\n\n\t\t\t.enabled {\n\t\t\t\tborder: 1px dashed #555;\n\t\t\t\t@apply --file-upload-upload-border-enabled;\n\t\t\t}\n\n\t\t\t.hover {\n\t\t\t\topacity: .7;\n\t\t\t\tborder: 1px dashed #111;\n\t\t\t\t@apply --file-upload-upload-border-hover;\n\t\t\t}\n\n\t\t\t#UploadBorder {\n\t\t\t\tvertical-align: middle;\n\t\t\t\tcolor: #555;\n\t\t\t\tpadding: 20px;\n\t\t\t\tmax-height: 300px;\n\t\t\t\toverflow-y: auto;\n\t\t\t\tdisplay: inline-block;\n\t\t\t\t@apply --file-upload-upload-border;\n\t\t\t}\n\n\t\t\t#dropArea {\n\t\t\t\ttext-align: center;\n\t\t\t\t@apply --file-upload-drop-area;\n\t\t\t}\n\n\t\t\tpaper-button#button {\n\t\t\t\tmargin-bottom: 20px;\n\t\t\t\t@apply --file-upload-button;\n\t\t\t}\n\n\t\t\t.file {\n\t\t\t\tpadding: 10px 0px;\n\t\t\t\t@apply --file-upload-file;\n\t\t\t}\n\n\t\t\t.commands {\n\t\t\t\tfloat: right;\n\t\t\t\t@apply --file-upload-commands;\n\t\t\t}\n\n\t\t\t.commands iron-icon:not([icon="check-circle"]) {\n\t\t\t\tcursor: pointer;\n\t\t\t\topacity: .9;\n\t\t\t\t@apply --file-upload-commands-faded;\n\t\t\t}\n\n\t\t\t.commands iron-icon:hover {\n\t\t\t\topacity: 1;\n\t\t\t\t@apply --file-upload-commands-hovered;\n\t\t\t}\n\n\t\t\t[hidden] {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tcolor: #f40303;\n\t\t\t\tfont-size: 11px;\n\t\t\t\tmargin-top: 2px;\n\t\t\t\t@apply --file-upload-error;\n\t\t\t}\n\n\t\t\t.progress-bar {\n\t\t\t\tmargin-top: 2px;\n\t\t\t}\n\n\t\t\tpaper-progress {\n\t\t\t\t--paper-progress-active-color: #03a9f4;\n\t\t\t}\n\n\t\t\tpaper-progress[error] {\n\t\t\t\t--paper-progress-active-color: #f40303;\n\t\t\t}\n\t\t</style>\n\n\t\t<div class="layout horizontal nowrap">\n\t\t\t<div>\n\t\t\t\t<paper-button id="button" on-click="_fileClick" alt="{{paperButtonAlt}}" raised="">\n\t\t\t\t\t<iron-icon icon="editor:attach-file"></iron-icon>{{paperButtonTitle}}</paper-button>\n\t\t\t\t<div id="UploadBorder">\n\t\t\t\t\t<div id="dropArea" hidden\\$="{{!_shownDropText}}">{{dropText}}</div>\n\t\t\t\t\t<template is="dom-repeat" items="{{files}}">\n\t\t\t\t\t\t<div class="file">\n\t\t\t\t\t\t\t<div class="name"><span>{{item.name}}</span>\n\t\t\t\t\t\t\t\t<div class="commands">\n\t\t\t\t\t\t\t\t\t<iron-icon icon="autorenew" title="{{retryText}}" on-click="_retryUpload" hidden\\$="{{!item.error}}"></iron-icon>\n\t\t\t\t\t\t\t\t\t<iron-icon icon="cancel" title="{{removeText}}" on-click="_cancelUpload" hidden\\$="{{item.complete}}"></iron-icon>\n\t\t\t\t\t\t\t\t\t<iron-icon icon="check-circle" title="{{successText}}" hidden\\$="{{!item.complete}}"></iron-icon>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="error" hidden\\$="{{!item.error}}">{{errorText}}</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</template>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input type="file" id="fileInput" on-change="_fileChange" hidden="" multiple="{{multi}}" accept="{{accept}}">\n    </div>\n'
      ]
    );
    _templateObject_d6e5ad90ecf111e88a0b4725ebfbecff = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-file",
    _template: (0, _polymerLegacy.html)(
      _templateObject_d6e5ad90ecf111e88a0b4725ebfbecff()
    ),
    behaviors: [_appLocalizeBehavior.AppLocalizeBehavior],
    properties: {
      language: { value: "en", notify: !0 },
      resources: {
        value: function value() {
          return {};
        },
        notify: !0
      },
      schema: { type: Object, observer: "_schemaChanged" },
      value: {
        type: Object,
        notify: !0,
        value: function value() {
          return {};
        },
        observer: "_valueChanged"
      },
      target: { type: String, value: "" },
      accept: { type: String, value: "" },
      droppable: { type: Boolean, value: !1 },
      dropText: { type: String, value: "Drop Files Here" },
      multi: { type: Boolean, value: !0 },
      files: {
        type: Array,
        notify: !0,
        value: function value() {
          return [];
        }
      },
      raised: { type: Boolean, value: !0 },
      noink: { type: Boolean, value: !1 },
      headers: { type: Object, value: {} },
      retryText: { type: String, value: "Retry Upload" },
      removeText: { type: String, value: "Remove" },
      successText: { type: String, value: "Success" },
      errorText: { type: String, value: "Error uploading file..." },
      _shownDropText: { type: Boolean, value: !1 },
      additional: { type: Object, value: {} },
      fileDataName: { type: String, value: "file" },
      paperButtonAlt: { type: String, value: "" },
      paperButtonTitle: { type: String, value: "" }
    },
    clear: function clear() {
      this.set("files", []);
      this.$.fileInput.value = "";
      this._showDropText();
    },
    ready: function ready() {
      if (this.raised) {
        this.toggleAttribute("raised", !0, this.$.button);
      }
      if (this.noink) {
        this.toggleAttribute("noink", !0, this.$.button);
      }
      if (this.droppable) {
        this._showDropText();
        this.setupDrop();
      }
    },
    setupDrop: function setupDrop() {
      var uploadBorder = this.$.UploadBorder;
      this.toggleClass("enabled", !0, uploadBorder);
      this.ondragover = function(e) {
        e.stopPropagation();
        this.toggleClass("hover", !0, uploadBorder);
        var effect = e.dataTransfer && e.dataTransfer.dropEffect,
          effectAllowed = e.dataTransfer && e.dataTransfer.effectAllowed;
        if ("none" === effect && "none" !== effectAllowed) {
          e.dataTransfer.dropEffect =
            "move" === effectAllowed ? "move" : "copy";
        }
        return !1;
      };
      this.ondragleave = function() {
        this.toggleClass("hover", !1, uploadBorder);
        return !1;
      };
      this.ondrop = function(event) {
        this.toggleClass("hover", !1, uploadBorder);
        event.preventDefault();
        if (!this.multi && 0 !== this.files.length) {
          return;
        }
        for (
          var length = event.dataTransfer.files.length, i = 0;
          i < length;
          i++
        ) {
          var file = event.dataTransfer.files[i],
            mimeType =
              "" !== file.type ? file.type.match(/^[^\/]*\//)[0] : null,
            fileType = file.name.match(/\.[^\.]*$/)[0];
          if (
            "" !== this.accept &&
            !(
              -1 < this.accept.indexOf(mimeType) ||
              -1 < this.accept.indexOf(fileType)
            )
          ) {
            continue;
          }
          file.progress = 0;
          file.error = !1;
          file.complete = !1;
          this.push("files", file);
          this.uploadFile(file);
        }
      };
    },
    _fileClick: function _fileClick() {
      var elem = this.$.fileInput;
      if (elem && document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", !0, !1);
        elem.dispatchEvent(evt);
      }
    },
    _fileChange: function _fileChange(e) {
      for (var length = e.target.files.length, i = 0, file; i < length; i++) {
        file = e.target.files[i];
        file.progress = 0;
        file.error = !1;
        file.complete = !1;
        this.push("files", file);
        if (!this.multi && 0 !== this.files.length) {
          this.set("files", []);
          this.set("value", {});
        }
        this.uploadFile(file);
      }
    },
    cancel: function cancel(file) {
      if (file) {
        if (file.xhr) {
          file.xhr.abort();
        }
        this.splice("files", this.files.indexOf(file), 1);
        this._showDropText();
      }
    },
    _cancelUpload: function _cancelUpload(e) {
      this.cancel(e.model.__data__.item);
    },
    _retryUpload: function _retryUpload(e) {
      e.model.set("item.error", !1);
      e.model.set("item.progress", 0);
      var self = this;
      async.microTask.run(function() {
        self.uploadFile(e.model.__data__.item);
      });
    },
    _showDropText: function _showDropText() {
      this.set("_shownDropText", !this.files.length && this.droppable);
    },
    uploadFile: function uploadFile(file) {
      if (!file) {
        return;
      }
      this.fire("before-upload");
      this._showDropText();
      var prefix = "files." + this.files.indexOf(file),
        self = this,
        reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          var r = reader.result;
          self.set(
            "value." +
              self.attributes.name.value +
              "." +
              self.files.indexOf(file),
            r
          );
        },
        !1
      );
      if (!self.value.hasOwnProperty(self.attributes.name.value)) {
        this.set("value." + self.attributes.name.value, {});
      }
      reader.readAsDataURL(file);
    },
    _valueChanged: function _valueChanged() {
      console.log("this.value: " + JSON.stringify(this.value));
    },
    _schemaChanged: function _schemaChanged() {
      this.schema;
    },
    _isSchemaValue: function _isSchemaValue(type) {
      return this._isSchemaFile(type);
    },
    _isSchemaFile: function _isSchemaFile(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("file");
      } else {
        return "file" === type;
      }
    },
    _isSchemaBoolean: function _isSchemaBoolean(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("boolean");
      } else {
        return "boolean" === type;
      }
    },
    _isSchemaNumber: function _isSchemaNumber(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("number") || -1 !== type.indexOf("integer");
      } else {
        return "number" === type || "integer" === type;
      }
    },
    _isSchemaString: function _isSchemaString(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("string");
      } else {
        return "string" === type;
      }
    },
    _isSchemaObject: function _isSchemaObject(type) {
      return "object" === type;
    },
    _isSchemaArray: function _isSchemaArray(type) {
      return "array" === type;
    },
    stringify: function stringify(s) {
      return JSON.stringify(s);
    }
  });
});
