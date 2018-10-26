import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { AppLocalizeBehavior } from "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js";
import "@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-file">
	
	
	
	

	<template>
		<style is="custom-style" include="iron-flex iron-flex-alignment">
			paper-input {
				padding: 2px;
				--paper-input-container-label: {
					white-space: normal;
					position: static;
					font-size: 22px;
					color: #212121;
				}
			}

			:host {
				display: inline-block;
			}

			.enabled {
				border: 1px dashed #555;
				@apply(--file-upload-upload-border-enabled);
			}

			.hover {
				opacity: .7;
				border: 1px dashed #111;
				@apply(--file-upload-upload-border-hover);
			}

			#UploadBorder {
				vertical-align: middle;
				color: #555;
				padding: 20px;
				max-height: 300px;
				overflow-y: auto;
				display: inline-block;
				@apply(--file-upload-upload-border);
			}

			#dropArea {
				text-align: center;
				@apply(--file-upload-drop-area);
			}

			paper-button#button {
				margin-bottom: 20px;
				@apply(--file-upload-button);
			}

			.file {
				padding: 10px 0px;
				@apply(--file-upload-file);
			}

			.commands {
				float: right;
				@apply(--file-upload-commands);
			}

			.commands iron-icon:not([icon="check-circle"]) {
				cursor: pointer;
				opacity: .9;
				@apply(--file-upload-commands-faded);
			}

			.commands iron-icon:hover {
				opacity: 1;
				@apply(--file-upload-commands-hovered);
			}

			[hidden] {
				display: none;
			}

			.error {
				color: #f40303;
				font-size: 11px;
				margin-top: 2px;
				@apply(--file-upload-error);
			}

			.progress-bar {
				margin-top: 2px;
			}

			paper-progress {
				--paper-progress-active-color: #03a9f4;
			}

			paper-progress[error] {
				--paper-progress-active-color: #f40303;
			}
		</style>

		<div class="layout horizontal nowrap">
			<div>
				<paper-button id="button" on-click="_fileClick" alt="{{paperButtonAlt}}" raised="">
					<iron-icon icon="editor:attach-file"></iron-icon>{{paperButtonTitle}}</paper-button>
				<div id="UploadBorder">
					<div id="dropArea" hidden\$="{{!_shownDropText}}">{{dropText}}</div>
					<template is="dom-repeat" items="{{files}}">
						<div class="file">
							<div class="name"><span>{{item.name}}</span>
								<div class="commands">
									<iron-icon icon="autorenew" title="{{retryText}}" on-click="_retryUpload" hidden\$="{{!item.error}}"></iron-icon>
									<iron-icon icon="cancel" title="{{removeText}}" on-click="_cancelUpload" hidden\$="{{item.complete}}"></iron-icon>
									<iron-icon icon="check-circle" title="{{successText}}" hidden\$="{{!item.complete}}"></iron-icon>
								</div>
							</div>
							<div class="error" hidden\$="{{!item.error}}">{{errorText}}</div>
						</div>
					</template>
				</div>
			</div>
			<input type="file" id="fileInput" on-change="_fileChange" hidden="" multiple="{{multi}}" accept="{{accept}}">
		</div>


	</template>

	

</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "eco-json-schema-file",
  behaviors: [AppLocalizeBehavior],
  properties: {
    language: { value: "en", notify: !0 },
    resources: {
      value: function() {
        return {};
      },
      notify: !0
    },
    schema: { type: Object, observer: "_schemaChanged" },
    value: {
      type: Object,
      notify: !0,
      value: function() {
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
      value: function() {
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
  clear: function() {
    this.set("files", []);
    this.$.fileInput.value = "";
    this._showDropText();
  },
  ready: function() {
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
  setupDrop: function() {
    var uploadBorder = this.$.UploadBorder;
    this.toggleClass("enabled", !0, uploadBorder);
    this.ondragover = function(e) {
      e.stopPropagation();
      this.toggleClass("hover", !0, uploadBorder);
      var effect = e.dataTransfer && e.dataTransfer.dropEffect,
        effectAllowed = e.dataTransfer && e.dataTransfer.effectAllowed;
      if ("none" === effect && "none" !== effectAllowed) {
        e.dataTransfer.dropEffect = "move" === effectAllowed ? "move" : "copy";
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
          mimeType = "" !== file.type ? file.type.match(/^[^\/]*\//)[0] : null,
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
  _fileClick: function() {
    var elem = this.$.fileInput;
    if (elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", !0, !1);
      elem.dispatchEvent(evt);
    }
  },
  _fileChange: function(e) {
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
  cancel: function(file) {
    if (file) {
      if (file.xhr) {
        file.xhr.abort();
      }
      this.splice("files", this.files.indexOf(file), 1);
      this._showDropText();
    }
  },
  _cancelUpload: function(e) {
    this.cancel(e.model.__data__.item);
  },
  _retryUpload: function(e) {
    e.model.set("item.error", !1);
    e.model.set("item.progress", 0);
    var self = this;
    async.microTask.run(() => {
      self.uploadFile(e.model.__data__.item);
    });
  },
  _showDropText: function() {
    this.set("_shownDropText", !this.files.length && this.droppable);
  },
  uploadFile: function(file) {
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
  _valueChanged: function() {
    console.log("this.value: " + JSON.stringify(this.value));
  },
  _schemaChanged: function() {
    this.schema;
  },
  _isSchemaValue: function(type) {
    return this._isSchemaFile(type);
  },
  _isSchemaFile: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("file");
    } else {
      return "file" === type;
    }
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("boolean");
    } else {
      return "boolean" === type;
    }
  },
  _isSchemaNumber: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("number") || -1 !== type.indexOf("integer");
    } else {
      return "number" === type || "integer" === type;
    }
  },
  _isSchemaString: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("string");
    } else {
      return "string" === type;
    }
  },
  _isSchemaObject: function(type) {
    return "object" === type;
  },
  _isSchemaArray: function(type) {
    return "array" === type;
  },
  stringify: function(s) {
    return JSON.stringify(s);
  }
});
