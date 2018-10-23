define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MediaVideo = void 0;
  function _templateObject_95729880d6ff11e8a029219649e44dce() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_95729880d6ff11e8a029219649e44dce = function() {
      return data;
    };
    return data;
  }
  var MediaVideo = (function(_PolymerElement) {
    babelHelpers.inherits(MediaVideo, _PolymerElement);
    function MediaVideo() {
      babelHelpers.classCallCheck(this, MediaVideo);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MediaVideo.__proto__ || Object.getPrototypeOf(MediaVideo)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MediaVideo,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MediaVideo.prototype.__proto__ ||
                  Object.getPrototypeOf(MediaVideo.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MediaVideo.haxProperties,
              MediaVideo.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_95729880d6ff11e8a029219649e44dce()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Media video",
                description: "Automated conversion of media-video/",
                icon: "icons:android",
                color: "green",
                groups: ["Video"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "media-video";
          }
        }
      ]
    );
    return MediaVideo;
  })(_polymerElement.PolymerElement);
  _exports.MediaVideo = MediaVideo;
  window.customElements.define(MediaVideo.tag, MediaVideo);
});
