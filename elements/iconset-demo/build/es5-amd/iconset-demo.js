define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@polymer/marked-element/marked-element.js"
], function(_exports, _polymerElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.IconsetDemo = void 0;
  function _templateObject_c88a4b20ecf111e88a72fd29f13ac06a() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n<style>:host {\n  display: block;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n  margin-bottom: 40px;\n}\n:host .demo-container {\n  padding: 20px 40px;\n}\n:host .demo-container .iconset:not(:first-of-type) {\n  border-top: 1px solid #ddd;\n}\n:host ul {\n  list-style-type: none;\n  padding: 0;\n}\n:host li {\n  display: inline-block;\n  width: 160px;\n  margin: 16px 8px;\n  text-align: center;\n}\n:host iron-icon {\n  font-size: 14px;\n  color: rgb(97,97,97);\n  display: inline-block;\n}\n:host .iconset:nth-of-type(9n+2) iron-icon {\n  color: #BE3300;\n}\n:host .iconset:nth-of-type(9n+3) iron-icon {\n  color: #0000B5;\n}\n:host .iconset:nth-of-type(9n+4) iron-icon {\n  color: #750075;\n}\n:host .iconset:nth-of-type(9n+5) iron-icon {\n  color: #AA5D00;\n}\n:host .iconset:nth-of-type(9n+6) iron-icon {\n  color: #DB0A5B;\n}\n:host .iconset:nth-of-type(9n+7) iron-icon {\n  color: #005500;\n}\n:host .iconset:nth-of-type(9n+8) iron-icon {\n  color: #CF000F;\n}\n:host .iconset:nth-of-type(9n) iron-icon {\n  color: #005f8b;\n}\n:host #icon-text {\n  margin-top: 8px;\n  font-size: 10px;\n  color: black;\n  text-align: center;\n}\n:host .code-container {\n  margin: 0;\n  background-color: var(--google-grey-100,#f5f5f5);\n  border-top: 1px solid #e0e0e0;\n}\n:host code {\n  padding: 20px 40px;\n  display: block;\n  margin: 0;\n  font-size: 13px;\n}\n:host .tag {\n  color: #905;\n}\n:host .attr-name {\n  color: #690;\n}\n:host .attr-value {\n  color: #07a;\n}</style>\n<div class="demo-container">\n    <template is="dom-repeat" items="[[items]]" as="iconset">\n        <div class="iconset">\n            <p><strong>[[iconset.name]]</strong></p>\n            <ul>\n                <template is="dom-repeat" items="[[iconset.icons]]" as="icon">\n                    <li>\n                    <div id="icon">\n                        <iron-icon icon$="[[iconset.prefix]][[icon]]"></iron-icon>\n                        <div id="icon-text">[[iconset.prefix]][[icon]]</div>\n                    </div>\n                    </li>\n                </template>\n            </ul>\n        </div>\n    </template>\n</div>\n<div class="code-container">\n    <code><span class="tag">&lt;iron-icon</span> <span class="attr-name">icon="<strong><em><span class="attr-value">optional_iconset_name:icon_name</span></em></strong>"</span><span class="tag">&gt;&lt;/iron-icon&gt;</span></code>\n</div>'
      ],
      [
        '\n<style>:host {\n  display: block;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n  margin-bottom: 40px;\n}\n:host .demo-container {\n  padding: 20px 40px;\n}\n:host .demo-container .iconset:not(:first-of-type) {\n  border-top: 1px solid #ddd;\n}\n:host ul {\n  list-style-type: none;\n  padding: 0;\n}\n:host li {\n  display: inline-block;\n  width: 160px;\n  margin: 16px 8px;\n  text-align: center;\n}\n:host iron-icon {\n  font-size: 14px;\n  color: rgb(97,97,97);\n  display: inline-block;\n}\n:host .iconset:nth-of-type(9n+2) iron-icon {\n  color: #BE3300;\n}\n:host .iconset:nth-of-type(9n+3) iron-icon {\n  color: #0000B5;\n}\n:host .iconset:nth-of-type(9n+4) iron-icon {\n  color: #750075;\n}\n:host .iconset:nth-of-type(9n+5) iron-icon {\n  color: #AA5D00;\n}\n:host .iconset:nth-of-type(9n+6) iron-icon {\n  color: #DB0A5B;\n}\n:host .iconset:nth-of-type(9n+7) iron-icon {\n  color: #005500;\n}\n:host .iconset:nth-of-type(9n+8) iron-icon {\n  color: #CF000F;\n}\n:host .iconset:nth-of-type(9n) iron-icon {\n  color: #005f8b;\n}\n:host #icon-text {\n  margin-top: 8px;\n  font-size: 10px;\n  color: black;\n  text-align: center;\n}\n:host .code-container {\n  margin: 0;\n  background-color: var(--google-grey-100,#f5f5f5);\n  border-top: 1px solid #e0e0e0;\n}\n:host code {\n  padding: 20px 40px;\n  display: block;\n  margin: 0;\n  font-size: 13px;\n}\n:host .tag {\n  color: #905;\n}\n:host .attr-name {\n  color: #690;\n}\n:host .attr-value {\n  color: #07a;\n}</style>\n<div class="demo-container">\n    <template is="dom-repeat" items="[[items]]" as="iconset">\n        <div class="iconset">\n            <p><strong>[[iconset.name]]</strong></p>\n            <ul>\n                <template is="dom-repeat" items="[[iconset.icons]]" as="icon">\n                    <li>\n                    <div id="icon">\n                        <iron-icon icon\\$="[[iconset.prefix]][[icon]]"></iron-icon>\n                        <div id="icon-text">[[iconset.prefix]][[icon]]</div>\n                    </div>\n                    </li>\n                </template>\n            </ul>\n        </div>\n    </template>\n</div>\n<div class="code-container">\n    <code><span class="tag">&lt;iron-icon</span> <span class="attr-name">icon="<strong><em><span class="attr-value">optional_iconset_name:icon_name</span></em></strong>"</span><span class="tag">&gt;&lt;/iron-icon&gt;</span></code>\n</div>'
      ]
    );
    _templateObject_c88a4b20ecf111e88a72fd29f13ac06a = function() {
      return data;
    };
    return data;
  }
  var IconsetDemo = (function(_PolymerElement) {
    babelHelpers.inherits(IconsetDemo, _PolymerElement);
    function IconsetDemo() {
      babelHelpers.classCallCheck(this, IconsetDemo);
      return babelHelpers.possibleConstructorReturn(
        this,
        (IconsetDemo.__proto__ || Object.getPrototypeOf(IconsetDemo)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      IconsetDemo,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            this._getIconsFromNodeList();
            babelHelpers
              .get(
                IconsetDemo.prototype.__proto__ ||
                  Object.getPrototypeOf(IconsetDemo.prototype),
                "connectedCallback",
                this
              )
              .call(this);
          }
        },
        {
          key: "_getIconsFromNodeList",
          value: function _getIconsFromNodeList() {
            var set = document.head.querySelectorAll("iron-iconset-svg");
            this.set("items", []);
            for (var i = 0; i < set.length; i++) {
              for (
                var setName = set[i].getAttribute("name"),
                  g = set[i].querySelectorAll("svg > defs > g, svg > g"),
                  icons = [],
                  j = 0;
                j < g.length;
                j++
              ) {
                icons.push(g[j].getAttribute("id"));
              }
              this.push("items", {
                name:
                  setName !== void 0 && null !== setName
                    ? setName + " "
                    : "Icons",
                prefix:
                  setName !== void 0 && null !== setName ? setName + ":" : "",
                icons: icons
              });
            }
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_c88a4b20ecf111e88a72fd29f13ac06a()
            );
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              items: {
                name: "items",
                type: "Array",
                value: [],
                reflectToAttribute: !1,
                observer: !1
              }
            };
          }
        },
        {
          key: "tag",
          get: function get() {
            return "iconset-demo";
          }
        }
      ]
    );
    return IconsetDemo;
  })(_polymerElement.PolymerElement);
  _exports.IconsetDemo = IconsetDemo;
  window.customElements.define(IconsetDemo.tag, IconsetDemo);
});
