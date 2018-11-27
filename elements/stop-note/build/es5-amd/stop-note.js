define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./lib/stop-icon.js"
], function(
  _polymerLegacy,
  _materializecssStyles,
  _HAXWiring,
  _schemaBehaviors,
  _ironIcon,
  _stopIcon
) {
  "use strict";
  function _templateObject_eabcb2c0f1e511e8afc9f5ccb33ab22a() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        width: auto;\n        --background-color: #f7f7f7;\n        --accent-color: #d32f2f;\n        margin-bottom: 20px;\n      }\n\n      iron-icon {\n        height: 100px;\n        width: 100px;\n      }\n\n      :host([icon="stopnoteicons:stop-icon"]) {\n        --accent-color: #d8261c;\n      }\n\n      :host([icon="stopnoteicons:warning-icon"]) {\n        --accent-color: #ffeb3b;\n      }\n\n      :host([icon="stopnoteicons:confirm-icon"]) {\n        --accent-color: #81c784;\n      }\n\n      :host([icon="stopnoteicons:book-icon"]) {\n        --accent-color: #21a3db;\n      }\n\n      .container {\n        display: flex;\n        width: auto;\n      }\n\n      .message_wrap {\n        border-right: 7px solid var(--accent-color);\n        padding: 10px 25px;\n        flex: 1 1 auto;\n        background-color: var(--background-color);\n      }\n\n      .main_message {\n        font-size: 32px;\n        margin-top: 10px;\n      }\n\n      .secondary_message {\n        margin-top: 5px;\n        font-size: 19.2px;\n        float: left;\n      }\n\n      .link a {\n        margin-top: 5px;\n        font-size: 19.2px;\n        float: left;\n        clear: left;\n        text-decoration: none;\n        color: #2196f3;\n      }\n\n      .link a:hover {\n        color: #1976d2;\n      }\n\n      .svg {\n        display: flex;\n        justify-content: center;\n      }\n\n      .svg_wrap {\n        background-color: var(--accent-color);\n        padding: 5px;\n        width: auto;\n      }\n    </style>\n\n    <div class="container">\n      <div class="svg_wrap">\n        <div class="svg">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </div>\n      </div>\n      <div class="message_wrap">\n        <div class="main_message">[[title]]</div>\n        <div class="secondary_message">\n          <slot name="message"></slot>\n        </div>\n        <template is="dom-if" if="[[url]]">\n          <div class="link">\n            <a href="[[url]]" target$="[[_urlTarget(url)]]">More Information &gt;</a>\n          </div>\n        </template>\n      </div>\n  </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        width: auto;\n        --background-color: #f7f7f7;\n        --accent-color: #d32f2f;\n        margin-bottom: 20px;\n      }\n\n      iron-icon {\n        height: 100px;\n        width: 100px;\n      }\n\n      :host([icon="stopnoteicons:stop-icon"]) {\n        --accent-color: #d8261c;\n      }\n\n      :host([icon="stopnoteicons:warning-icon"]) {\n        --accent-color: #ffeb3b;\n      }\n\n      :host([icon="stopnoteicons:confirm-icon"]) {\n        --accent-color: #81c784;\n      }\n\n      :host([icon="stopnoteicons:book-icon"]) {\n        --accent-color: #21a3db;\n      }\n\n      .container {\n        display: flex;\n        width: auto;\n      }\n\n      .message_wrap {\n        border-right: 7px solid var(--accent-color);\n        padding: 10px 25px;\n        flex: 1 1 auto;\n        background-color: var(--background-color);\n      }\n\n      .main_message {\n        font-size: 32px;\n        margin-top: 10px;\n      }\n\n      .secondary_message {\n        margin-top: 5px;\n        font-size: 19.2px;\n        float: left;\n      }\n\n      .link a {\n        margin-top: 5px;\n        font-size: 19.2px;\n        float: left;\n        clear: left;\n        text-decoration: none;\n        color: #2196f3;\n      }\n\n      .link a:hover {\n        color: #1976d2;\n      }\n\n      .svg {\n        display: flex;\n        justify-content: center;\n      }\n\n      .svg_wrap {\n        background-color: var(--accent-color);\n        padding: 5px;\n        width: auto;\n      }\n    </style>\n\n    <div class="container">\n      <div class="svg_wrap">\n        <div class="svg">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </div>\n      </div>\n      <div class="message_wrap">\n        <div class="main_message">[[title]]</div>\n        <div class="secondary_message">\n          <slot name="message"></slot>\n        </div>\n        <template is="dom-if" if="[[url]]">\n          <div class="link">\n            <a href="[[url]]" target\\$="[[_urlTarget(url)]]">More Information &gt;</a>\n          </div>\n        </template>\n      </div>\n  </div>\n'
      ]
    );
    _templateObject_eabcb2c0f1e511e8afc9f5ccb33ab22a = function _templateObject_eabcb2c0f1e511e8afc9f5ccb33ab22a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_eabcb2c0f1e511e8afc9f5ccb33ab22a()
    ),
    is: "stop-note",
    behaviors: [
      HAXBehaviors.PropertiesBehaviors,
      MaterializeCSSBehaviors.ColorBehaviors,
      SchemaBehaviors.Schema
    ],
    observers: ["_iconChanged(icon)"],
    properties: {
      title: { type: String, value: "Title", reflectToAttribute: !0 },
      url: { type: String, value: null, reflectToAttribute: !0 },
      icon: {
        type: String,
        value: "stopnoteicons:stop-icon",
        reflectToAttribute: !0
      }
    },
    _iconChanged: function _iconChanged(icon) {
      this.updateStyles();
    },
    _urlTarget: function _urlTarget(url) {
      if (url) {
        var external = this._outsideLink(url);
        if (external) {
          return "_blank";
        }
      }
      return !1;
    },
    _outsideLink: function _outsideLink(url) {
      if (0 != url.indexOf("http")) return !1;
      var loc = location.href,
        path = location.pathname,
        root = loc.substring(0, loc.indexOf(path));
      return 0 != url.indexOf(root);
    },
    attached: function attached() {
      var props = {
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Stop Note",
          description: "A message to alert readers to specific directions.",
          icon: "icons:report",
          color: "orange",
          groups: ["Video", "Media"],
          handles: [{ type: "text", title: "label" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              description: "Enter title for stop-note.",
              inputMethod: "textfield",
              required: !0
            },
            {
              property: "url",
              title: "URL",
              description: "Enter an external url.",
              inputMethod: "textfield",
              required: !0
            }
          ],
          configure: [
            {
              property: "title",
              title: "Title",
              description: "Enter title for stop-note.",
              inputMethod: "textfield",
              required: !0
            },
            {
              property: "url",
              title: "URL",
              description: "Enter an external url.",
              inputMethod: "textfield",
              required: !0
            },
            {
              slot: "message",
              title: "Message",
              description: "Enter a message for stop-note.",
              inputMethod: "code-editor",
              required: !0
            },
            {
              property: "icon",
              title: "Action Icon",
              description: "Icon used for stop-note",
              inputMethod: "iconpicker",
              options: [
                "stopnoteicons:stop-icon",
                "stopnoteicons:warning-icon",
                "stopnoteicons:confirm-icon",
                "stopnoteicons:book-icon"
              ]
            }
          ],
          advanced: []
        }
      };
      this.setHaxProperties(props);
    }
  });
});
