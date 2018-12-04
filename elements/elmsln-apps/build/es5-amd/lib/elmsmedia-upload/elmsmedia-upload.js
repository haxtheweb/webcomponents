define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@vaadin/vaadin-upload/vaadin-upload.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "../../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../../node_modules/@polymer/paper-item/paper-item.js",
  "../../node_modules/@polymer/paper-checkbox/paper-checkbox.js",
  "../../node_modules/@polymer/paper-input/paper-input.js"
], function(
  _exports,
  _polymerLegacy,
  _paperButton,
  _vaadinUpload,
  _materializecssStyles,
  _paperDialog,
  _appToolbar,
  _paperDropdownMenu,
  _paperListbox,
  _paperItem,
  _paperCheckbox,
  _paperInput
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ElmsMediaUpload = void 0;
  function _templateObject_5df957e0f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <custom-style>\n      <style is="custom-style" include="materializecss-styles">\n        :host {\n          display: block;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 1rem;\n        }\n        vaadin-upload.thick-border {\n          --primary-color: #396;\n          --dark-primary-color: #063;\n          --light-primary-color: #6c9;\n          --error-color: darkred;\n          border: 2px solid #ccc;\n          padding: 14px;\n          background: #eee;\n          border-radius: 0;\n        }\n        vaadin-upload.thick-border[dragover] {\n          border-color: #396;\n        }\n      </style>\n    </custom-style>\n    <vaadin-upload\n      target$="{{uploadPath}}"\n      method="POST"\n      form-data-name="file-upload"\n      timeout="0"\n      accept="video/mp4,image/*,audio/*,application/pdf,application/zip"\n    ></vaadin-upload>\n    <paper-dialog\n      id="dialog"\n      entry-animation="scale-up-animation"\n      exit-animation="fade-out-animation"\n      with-backdrop=""\n    >\n      <app-toolbar>\n        <paper-dropdown-menu label="Display style">\n          <paper-listbox slot="dropdown-content" class="dropdown-content">\n            <paper-item value="image">Image</paper-item>\n            <paper-item value="image__circle">Circle</paper-item>\n          </paper-listbox>\n        </paper-dropdown-menu>\n        <paper-checkbox class="styled" checked="{{hasLightbox}}">\n          Lightbox <span class="subtitle"> Users can click to expand </span>\n        </paper-checkbox>\n        <paper-button raised="" class="green">Save</paper-button>\n      </app-toolbar>\n      <h2 id="title">{{uploadTitle}}</h2>\n      <paper-input\n        label="Title"\n        placeholder="Title"\n        value="{{uploadTitle}}"\n      ></paper-input>\n      <div id="content"></div>\n    </paper-dialog>\n  '
      ],
      [
        '\n    <custom-style>\n      <style is="custom-style" include="materializecss-styles">\n        :host {\n          display: block;\n        }\n        paper-button {\n          padding: 0;\n          margin: 0;\n          min-width: 1rem;\n        }\n        vaadin-upload.thick-border {\n          --primary-color: #396;\n          --dark-primary-color: #063;\n          --light-primary-color: #6c9;\n          --error-color: darkred;\n          border: 2px solid #ccc;\n          padding: 14px;\n          background: #eee;\n          border-radius: 0;\n        }\n        vaadin-upload.thick-border[dragover] {\n          border-color: #396;\n        }\n      </style>\n    </custom-style>\n    <vaadin-upload\n      target\\$="{{uploadPath}}"\n      method="POST"\n      form-data-name="file-upload"\n      timeout="0"\n      accept="video/mp4,image/*,audio/*,application/pdf,application/zip"\n    ></vaadin-upload>\n    <paper-dialog\n      id="dialog"\n      entry-animation="scale-up-animation"\n      exit-animation="fade-out-animation"\n      with-backdrop=""\n    >\n      <app-toolbar>\n        <paper-dropdown-menu label="Display style">\n          <paper-listbox slot="dropdown-content" class="dropdown-content">\n            <paper-item value="image">Image</paper-item>\n            <paper-item value="image__circle">Circle</paper-item>\n          </paper-listbox>\n        </paper-dropdown-menu>\n        <paper-checkbox class="styled" checked="{{hasLightbox}}">\n          Lightbox <span class="subtitle"> Users can click to expand </span>\n        </paper-checkbox>\n        <paper-button raised="" class="green">Save</paper-button>\n      </app-toolbar>\n      <h2 id="title">{{uploadTitle}}</h2>\n      <paper-input\n        label="Title"\n        placeholder="Title"\n        value="{{uploadTitle}}"\n      ></paper-input>\n      <div id="content"></div>\n    </paper-dialog>\n  '
      ]
    );
    _templateObject_5df957e0f77011e8b89b0519890f95da = function _templateObject_5df957e0f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  var ElmsMediaUpload = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5df957e0f77011e8b89b0519890f95da()
    ),
    is: "elmsmedia-upload",
    listeners: { "upload-success": "_uploadSuccess" },
    properties: {
      uploadPath: { type: String, reflectToAttribute: !0, notify: !0 },
      uploadTitle: { type: String, reflectToAttribute: !0, notify: !0 },
      hasLightbox: { type: Boolean, reflectToAttribute: !0, notify: !0 }
    },
    _uploadSuccess: function _uploadSuccess(event) {
      var response = JSON.parse(event.detail.xhr.response);
      this.uploadTitle = response.data.node.title;
      this.$.content.innerHTML = response.data.node.nid;
      this.$.dialog.open();
    }
  });
  _exports.ElmsMediaUpload = ElmsMediaUpload;
});
