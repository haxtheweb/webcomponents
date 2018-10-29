define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-dropdown/iron-dropdown.js"
], function(_polymerLegacy, _polymerDom, async) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_463819e0dbb711e89c808f067d68f3be() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      iron-dropdown {\n        @apply(--paper-morph-dropdown);\n      }\n      .dropdown-content {\n        @apply(--paper-morph-content);\n      }\n      #morpher {\n        position: fixed;\n        display: none;\n        background-color: var(--paper-morph-background, #fff);\n      }\n    </style>\n    <span id="fabContainer" class="dropdown-trigger"><slot name="dropdown-trigger"></slot></span>\n    <span id="contentContainer" class="dropdown-content"><slot name="dropdown-content"></slot></span>\n    <paper-material id="morpher"></paper-material>\n'
    ]);
    _templateObject_463819e0dbb711e89c808f067d68f3be = function() {
      return data;
    };
    return data;
  }
  (function(Polymer) {
    Polymer({
      _template: (0, _polymerLegacy.html)(
        _templateObject_463819e0dbb711e89c808f067d68f3be()
      ),
      is: "paper-fab-morph",
      properties: {
        isOverlayContent: { type: Boolean, value: !1 },
        duration: { type: Number, value: 200 },
        horizontalAlign: {
          type: String,
          value: "left",
          reflectToAttribute: !0
        },
        verticalAlign: { type: String, value: "top", reflectToAttribute: !0 },
        horizontalOffset: { type: Number, value: 0, notify: !0 },
        verticalOffset: { type: Number, value: 0, notify: !0 }
      },
      observers: [
        "_updateOverlayPosition(verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)"
      ],
      ready: function ready() {
        this._fab = this.$.fabContainer;
        this._content = this.$.contentContainer;
        if (this.isOverlayContent) {
          this._fab.addEventListener(
            "tap",
            function() {
              this._content.open();
            }.bind(this)
          );
          this._overlay = this._content;
        } else {
          var dropdown = document.createElement("iron-dropdown");
          (0, _polymerDom.dom)(dropdown).appendChild(this._content);
          (0, _polymerDom.dom)(this.root).appendChild(dropdown);
          this._overlay = dropdown;
          this._dropdown = dropdown;
          this._fab.addEventListener(
            "tap",
            function() {
              this._dropdown.open();
            }.bind(this)
          );
          this._updateOverlayPosition(
            this.verticalAlign,
            this.horizontalAlign,
            this.verticalOffset,
            this.horizontalOffset
          );
        }
        this._overlay.addEventListener(
          "iron-overlay-opened",
          function() {
            this._morphOpen();
          }.bind(this)
        );
        this._overlay.addEventListener(
          "iron-overlay-closed",
          function() {
            this._morphClose();
          }.bind(this)
        );
      },
      open: function open() {
        this._overlay.open();
      },
      close: function close() {
        this._overlay.close();
      },
      _updateOverlayPosition: function _updateOverlayPosition(
        verticalAlign,
        horizontalAlign,
        verticalOffset,
        horizontalOffset
      ) {
        if (this._dropdown) {
          var d = this._dropdown;
          d.verticalAlign = verticalAlign;
          d.horizontalAlign = horizontalAlign;
          d.verticalOffset = verticalOffset;
          d.horizontalOffset = horizontalOffset;
        }
      },
      _morphOpen: function _morphOpen() {
        var fab = this._fab,
          content = this._content,
          fabRect = fab.getBoundingClientRect(),
          morpher = this.$.morpher,
          ms = morpher.style;
        ms.display = "block";
        ms.top = fabRect.top + "px";
        ms.left = fabRect.left + "px";
        ms.width = fabRect.width + "px";
        ms.height = fabRect.height + "px";
        ms.borderRadius = "50%";
        ms.transitionDuration = this.duration + "ms";
        fab.style.visibility = "hidden";
        content.style.visibility = "hidden";
        var contentRect = content.getBoundingClientRect();
        ms.top = contentRect.top + "px";
        ms.left = contentRect.left + "px";
        ms.width = contentRect.width + "px";
        ms.height = contentRect.height + "px";
        ms.borderRadius = "";
        async.microTask.run(function() {
          morpher.style.display = "none";
          content.style.visibility = "visible";
        });
      },
      _morphClose: function _morphClose() {
        var fab = this._fab,
          content = this._content,
          contentRect = fab.getBoundingClientRect(),
          morpher = this.$.morpher,
          ms = morpher.style;
        morpher.style.display = "block";
        async.microTask.run(function() {
          var fabRect = fab.getBoundingClientRect();
          ms.top = fabRect.top + "px";
          ms.left = fabRect.left + "px";
          ms.width = fabRect.width + "px";
          ms.height = fabRect.height + "px";
          ms.borderRadius = "50%";
          async.microTask.run(function() {
            morpher.style.display = "none";
            fab.style.visibility = "visible";
          });
        });
      }
    });
  })(_polymerLegacy.Polymer);
});
