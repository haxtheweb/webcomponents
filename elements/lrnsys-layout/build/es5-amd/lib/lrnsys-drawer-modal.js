define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@polymer/app-layout/app-layout.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./lrnsys-button-inner.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_0d925a90e70811e8b65bc19d0dd5f1da() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        z-index: 1000;\n      }\n      app-drawer {\n        --app-drawer-width: var(--lrnsys-drawer-width);\n        --app-drawer-content-container: {\n          padding: 0;\n          overflow-y: scroll;\n          position: fixed;\n          color: var(--lrnsys-drawer-color);\n          background-color: var(--lrnsys-drawer-background-color);\n        }\n      }\n      .drawer-header {\n        width: 100%;\n        padding: 0;\n        margin: 0 0 8px 0;\n        text-align: left;\n        @apply --lrnsys-drawer-header;\n      }\n      .drawer-header-slot {\n      }\n      .drawer-heading {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      .drawer-content {\n        padding: 0 15px;\n        text-align: left;\n      }\n\n      #close {\n        position: absolute;\n        right: 8px;\n        top: 8px;\n        padding: 0 0 0 4px;\n        margin: 0;\n        min-width: .16px;\n        text-transform: none;\n      }\n      .drawer-header-slot ::slotted(*) {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n    </style>\n    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">\n      <div class="drawer-contents">\n        <div class="drawer-header">\n          <div class$="[[headingClass]] drawer-header-slot">\n            <slot name="header"></slot>\n          </div>\n          <h3 class$="[[headingClass]] drawer-heading" hidden$="[[!header]]">[[header]]</h3>\n        </div>\n        <div class="drawer-content">\n          <slot></slot>\n        </div>\n      </div>\n      <paper-icon-button raised="" icon="close" on-tap="closeDrawer" id="close" aria-label="close dialog" class$="[[headingClass]]"></paper-icon-button>\n      <paper-tooltip for="close" animation-delay="500">Close dialog</paper-tooltip>\n    </app-drawer>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        z-index: 1000;\n      }\n      app-drawer {\n        --app-drawer-width: var(--lrnsys-drawer-width);\n        --app-drawer-content-container: {\n          padding: 0;\n          overflow-y: scroll;\n          position: fixed;\n          color: var(--lrnsys-drawer-color);\n          background-color: var(--lrnsys-drawer-background-color);\n        }\n      }\n      .drawer-header {\n        width: 100%;\n        padding: 0;\n        margin: 0 0 8px 0;\n        text-align: left;\n        @apply --lrnsys-drawer-header;\n      }\n      .drawer-header-slot {\n      }\n      .drawer-heading {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      .drawer-content {\n        padding: 0 15px;\n        text-align: left;\n      }\n\n      #close {\n        position: absolute;\n        right: 8px;\n        top: 8px;\n        padding: 0 0 0 4px;\n        margin: 0;\n        min-width: .16px;\n        text-transform: none;\n      }\n      .drawer-header-slot ::slotted(*) {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n    </style>\n    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">\n      <div class="drawer-contents">\n        <div class="drawer-header">\n          <div class\\$="[[headingClass]] drawer-header-slot">\n            <slot name="header"></slot>\n          </div>\n          <h3 class\\$="[[headingClass]] drawer-heading" hidden\\$="[[!header]]">[[header]]</h3>\n        </div>\n        <div class="drawer-content">\n          <slot></slot>\n        </div>\n      </div>\n      <paper-icon-button raised="" icon="close" on-tap="closeDrawer" id="close" aria-label="close dialog" class\\$="[[headingClass]]"></paper-icon-button>\n      <paper-tooltip for="close" animation-delay="500">Close dialog</paper-tooltip>\n    </app-drawer>\n'
      ]
    );
    _templateObject_0d925a90e70811e8b65bc19d0dd5f1da = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_0d925a90e70811e8b65bc19d0dd5f1da()
    ),
    is: "lrnsys-drawer-modal",
    properties: {
      opened: { type: Boolean, value: !1 },
      align: { type: String, value: "left" },
      header: { type: String, value: !1 },
      disabled: { type: Boolean, value: !1 },
      headingClass: { type: String, value: "white-text black" },
      bodyAppend: { type: Boolean, value: !0 },
      _bodyAppended: { type: Boolean, value: !1 }
    },
    open: function open() {
      this.$.flyoutcontent.open();
      this.$.close.focus();
    },
    close: function close() {
      this.$.flyoutcontent.close();
    },
    attached: function attached() {
      if (this.bodyAppend && !this._bodyAppended) {
        this._bodyAppended = !0;
        document.body.appendChild(this);
      }
      this.$.flyoutcontent.addEventListener(
        "opened-changed",
        this._drawerClosed.bind(this)
      );
    },
    detached: function detached() {
      this.$.flyoutcontent.removeEventListener(
        "opened-changed",
        this._drawerClosed.bind(this)
      );
    },
    _drawerClosed: function _drawerClosed() {
      if (!this.$.flyoutcontent.opened) {
        this.fire("lrnsys-drawer-modal-closed", this);
      }
    },
    closeDrawer: function closeDrawer() {
      this.$.flyoutcontent.close();
    }
  });
});
