define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@polymer/app-layout/app-layout.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "./lrnsys-button-inner.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_fede26e0ecf311e896b1b122e9a8e20a() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        z-index: 1000;\n      }\n      app-drawer {\n        --app-drawer-width: var(--lrnsys-drawer-width);\n        --app-drawer-content-container: {\n          padding: 0;\n          overflow-y: scroll;\n          position: fixed;\n          color: var(--lrnsys-drawer-color);\n          background-color: var(--lrnsys-drawer-background-color);\n        }\n      }\n      .drawer-header {\n        width: 100%;\n        padding: 0;\n        margin: 0 0 8px 0;\n        text-align: left;\n        @apply --lrnsys-drawer-header;\n      }\n      .drawer-header-slot {\n      }\n      .drawer-heading {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      .drawer-content {\n        padding: 0 15px;\n        text-align: left;\n      }\n\n      .drawer-header-slot ::slotted(*) {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      #close {\n        position: absolute;\n        right: 8px;\n        top: 8px;\n        padding: 4px;\n        margin: 0;\n        text-transform: none;\n        float: right;\n        font-size: 12px;\n        color: var(--simple-modal-color, black);\n        background-color: transparent;\n        min-width: unset;\n      }\n      #close iron-icon {\n        display: inline-block;\n        width: 16px;\n        height: 16px;\n        margin-right: 2px;\n      }\n    </style>\n    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">\n      <div class="drawer-contents">\n        <div class="drawer-header">\n          <div class$="[[headingClass]] drawer-header-slot">\n            <slot name="header"></slot>\n          </div>\n          <h3 class$="[[headingClass]] drawer-heading" hidden$="[[!header]]">[[header]]</h3>\n        </div>\n        <div class="drawer-content">\n          <slot></slot>\n        </div>\n        <paper-button id="close" on-tap="closeDrawer"><iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]</paper-button>\n      </div>\n    </app-drawer>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        z-index: 1000;\n      }\n      app-drawer {\n        --app-drawer-width: var(--lrnsys-drawer-width);\n        --app-drawer-content-container: {\n          padding: 0;\n          overflow-y: scroll;\n          position: fixed;\n          color: var(--lrnsys-drawer-color);\n          background-color: var(--lrnsys-drawer-background-color);\n        }\n      }\n      .drawer-header {\n        width: 100%;\n        padding: 0;\n        margin: 0 0 8px 0;\n        text-align: left;\n        @apply --lrnsys-drawer-header;\n      }\n      .drawer-header-slot {\n      }\n      .drawer-heading {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      .drawer-content {\n        padding: 0 15px;\n        text-align: left;\n      }\n\n      .drawer-header-slot ::slotted(*) {\n        font-size: 24px;\n        margin: 0;\n        padding: 0 15px;\n        height: 40px;\n        line-height: 48px;\n      }\n      #close {\n        position: absolute;\n        right: 8px;\n        top: 8px;\n        padding: 4px;\n        margin: 0;\n        text-transform: none;\n        float: right;\n        font-size: 12px;\n        color: var(--simple-modal-color, black);\n        background-color: transparent;\n        min-width: unset;\n      }\n      #close iron-icon {\n        display: inline-block;\n        width: 16px;\n        height: 16px;\n        margin-right: 2px;\n      }\n    </style>\n    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">\n      <div class="drawer-contents">\n        <div class="drawer-header">\n          <div class\\$="[[headingClass]] drawer-header-slot">\n            <slot name="header"></slot>\n          </div>\n          <h3 class\\$="[[headingClass]] drawer-heading" hidden\\$="[[!header]]">[[header]]</h3>\n        </div>\n        <div class="drawer-content">\n          <slot></slot>\n        </div>\n        <paper-button id="close" on-tap="closeDrawer"><iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]</paper-button>\n      </div>\n    </app-drawer>\n'
      ]
    );
    _templateObject_fede26e0ecf311e896b1b122e9a8e20a = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_fede26e0ecf311e896b1b122e9a8e20a()
    ),
    is: "lrnsys-drawer-modal",
    properties: {
      opened: { type: Boolean, value: !1 },
      closeLabel: { type: String, value: "Close" },
      closeIcon: { type: String, value: "cancel" },
      align: { type: String, value: "left" },
      header: { type: String, value: !1 },
      disabled: { type: Boolean, value: !1 },
      headingClass: { type: String, value: "white-text black" }
    },
    open: function open() {
      this.$.flyoutcontent.open();
      this.$.close.focus();
    },
    close: function close() {
      this.$.flyoutcontent.close();
    },
    attached: function attached() {
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
