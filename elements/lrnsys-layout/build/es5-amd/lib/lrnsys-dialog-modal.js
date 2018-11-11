define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/neon-animation/neon-animations.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./lrnsys-dialog-toolbar.js",
  "./lrnsys-button-inner.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_abaf4280e5f811e884a53f65fca41bf9() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: inline-block;\n        z-index: 1000;\n      }\n\n      paper-dialog {\n        position: fixed;\n        top: 5%;\n        right: 5%;\n        bottom: 5%;\n        left: 5%;\n        overflow: auto;\n        border-radius: 3px;\n        color: var(--lrnsys-dialog-color, black);\n        background-color: var(--lrnsys-dialog-background-color, white);\n      }\n      paper-dialog-scrollable {\n        margin-top:0;\n        @apply --layout-flex;\n      }\n\n      paper-dialog>*:first-child {\n        margin-top: 0;\n      }\n\n      .dialog-header {\n        width: 100%;\n        padding: 0;\n        margin: 0;\n      }\n      .dialog-heading {\n        padding: 0;\n        margin: 0;\n      }\n      .dialog-header-slot ::slotted(*) {\n        margin: 0;\n        padding: 0 15px;\n        line-height: 200%;\n      }\n    </style>\n    <paper-dialog modal="[[modal]]" id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="" opened$="[[opened]]">\n      <div class$="[[headingClass]] dialog-header">\n        <div class$="[[headingClass]] dialog-heading" hidden$="[[!header]]">[[header]]</div>\n        <span class="dialog-header-slot"><slot name="header"></slot></span>\n      </div>\n      <paper-dialog-scrollable class="dialog-contents" id="dialogcontent">\n        <slot></slot>\n      </paper-dialog-scrollable>\n      <lrnsys-dialog-toolbar on-button-clicked="_toolbarButtonClickedHandler">\n        <slot slot="primary" name="toolbar-primary"></slot>\n        <slot slot="secondary" name="toolbar-secondary"></slot>\n      </lrnsys-dialog-toolbar>\n    </paper-dialog>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: inline-block;\n        z-index: 1000;\n      }\n\n      paper-dialog {\n        position: fixed;\n        top: 5%;\n        right: 5%;\n        bottom: 5%;\n        left: 5%;\n        overflow: auto;\n        border-radius: 3px;\n        color: var(--lrnsys-dialog-color, black);\n        background-color: var(--lrnsys-dialog-background-color, white);\n      }\n      paper-dialog-scrollable {\n        margin-top:0;\n        @apply --layout-flex;\n      }\n\n      paper-dialog>*:first-child {\n        margin-top: 0;\n      }\n\n      .dialog-header {\n        width: 100%;\n        padding: 0;\n        margin: 0;\n      }\n      .dialog-heading {\n        padding: 0;\n        margin: 0;\n      }\n      .dialog-header-slot ::slotted(*) {\n        margin: 0;\n        padding: 0 15px;\n        line-height: 200%;\n      }\n    </style>\n    <paper-dialog modal="[[modal]]" id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="" opened\\$="[[opened]]">\n      <div class$="[[headingClass]] dialog-header">\n        <div class$="[[headingClass]] dialog-heading" hidden$="[[!header]]">[[header]]</div>\n        <span class="dialog-header-slot"><slot name="header"></slot></span>\n      </div>\n      <paper-dialog-scrollable class="dialog-contents" id="dialogcontent">\n        <slot></slot>\n      </paper-dialog-scrollable>\n      <lrnsys-dialog-toolbar on-button-clicked="_toolbarButtonClickedHandler">\n        <slot slot="primary" name="toolbar-primary"></slot>\n        <slot slot="secondary" name="toolbar-secondary"></slot>\n      </lrnsys-dialog-toolbar>\n    </paper-dialog>\n'
      ]
    );
    _templateObject_abaf4280e5f811e884a53f65fca41bf9 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_abaf4280e5f811e884a53f65fca41bf9()
    ),
    is: "lrnsys-dialog-modal",
    listeners: {
      "iron-overlay-closed": "_modalClosed",
      "iron-overlay-opened": "_resizeContent",
      "iron-overlay-canceled": "_changeOpen"
    },
    properties: {
      header: { type: String, value: !1 },
      modal: { type: Boolean, value: !1 },
      opened: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 },
      headingClass: { type: String, value: "white-text black" },
      bodyAppend: { type: Boolean, value: !0 },
      _bodyAppended: { type: Boolean, value: !1 },
      dynamicImages: { type: Boolean, value: !1 }
    },
    toggleDialog: function toggleDialog() {
      if (this.dynamicImages) {
        for (
          var images = this.$.dialogcontent.getElementsByTagName("IRON-IMAGE"),
            i = 0;
          i < images.length;
          i++
        ) {
          images[i].preventLoad = !1;
        }
      }
      this.$.dialog.toggle();
    },
    _toolbarButtonClickedHandler: function _toolbarButtonClickedHandler(e) {
      if ("close" === e.detail.id) {
        this.$.dialog.cancel();
      }
      this.fire("toolbar-button-clicked", e.detail);
    },
    _modalClosed: function _modalClosed(e) {
      this._changeOpen(e);
      this.fire("lrnsys-dialog-modal-closed", this);
    },
    _resizeContent: function _resizeContent(e) {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", !0, !1, window, 0);
      window.dispatchEvent(evt);
      this._changeOpen(e);
    },
    attached: function attached() {
      if (this.bodyAppend && !this._bodyAppended) {
        this._bodyAppended = !0;
        document.body.appendChild(this);
      }
      var toolbar = this.shadowRoot.querySelector("lrnsys-dialog-toolbar");
      this.$.dialog.addEventListener("mouseover", function() {
        toolbar.setAttribute("secondary-visible", !0);
      });
      this.$.dialog.addEventListener("mouseout", function() {
        toolbar.removeAttribute("secondary-visible");
      });
    },
    detached: function detached() {
      var toolbar = this.shadowRoot.querySelector("lrnsys-dialog-toolbar");
      this.$.dialog.removeEventListener("mouseover", function() {
        toolbar.setAttribute("secondary-visible", !0);
      });
      this.$.dialog.removeEventListener("mouseout", function() {
        toolbar.removeAttribute("secondary-visible");
      });
    },
    _changeOpen: function _changeOpen(e) {
      e.stopPropagation();
      if (e.srcElement === this.$.dialog) {
        this.opened = "iron-overlay-opened" === e.type;
        this.fire("lrnsys-dialog-modal-changed", this);
      }
    }
  });
});
