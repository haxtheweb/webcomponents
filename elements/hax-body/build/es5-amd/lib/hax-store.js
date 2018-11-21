define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-toast/paper-toast.js",
  "../node_modules/@lrnwebcomponents/media-behaviors/media-behaviors.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./hax-app.js",
  "./hax-stax.js",
  "./hax-stax-browser.js",
  "./hax-blox.js",
  "./hax-blox-browser.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_99eb0360edcb11e88aa8b5030f652492() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n    <slot></slot>\n    <iron-ajax id="appstore" url="[[appStore.url]]" params="[[appStore.params]]" method="GET" content-type="application/json" handle-as="json" last-response="{{__appStoreData}}"></iron-ajax>\n'
    ]);
    _templateObject_99eb0360edcb11e88aa8b5030f652492 = function() {
      return data;
    };
    return data;
  }
  window.HaxStore = {};
  window.HaxStore.instance = null;
  window.HaxStore.requestAvailability = function() {
    if (!window.HaxStore.instance) {
      window.HaxStore.instance = document.createElement("hax-store");
    }
    document.body.appendChild(window.HaxStore.instance);
  };
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_99eb0360edcb11e88aa8b5030f652492()
    ),
    is: "hax-store",
    behaviors: [MediaBehaviors.Video, HAXBehaviors.PropertiesBehaviors],
    observers: ["_loadAppStoreData(__appStoreData, haxAutoloader)"],
    properties: {
      haxAppPicker: { type: Object },
      haxStaxPicker: { type: Object },
      haxManager: { type: Object },
      haxAutoloader: { type: Object },
      haxBodies: { type: Array, value: [] },
      activePlaceHolder: { type: Object, value: null },
      activeHaxBody: { type: Object },
      appStore: { type: Object, observer: "_appStoreChanged" },
      haxToast: { type: Object },
      haxPanel: { type: Object },
      haxExport: { type: Object },
      haxPreferences: { type: Object },
      activeHaxElement: { type: Object },
      activeNode: { type: Object },
      activeContainerNode: { type: Object },
      editMode: { type: Boolean, value: !1 },
      canSupportUploads: { type: Boolean, value: !1 },
      skipExitTrap: { type: Boolean, value: !1 },
      defaults: {
        type: Object,
        value: {
          image: {
            src: "stock.jpg",
            alt: "A beachfront deep in the heart of Alaska."
          },
          iframe: { src: "https://www.wikipedia.org/" }
        }
      },
      gizmoList: { type: Array, value: [] },
      elementList: { type: Object, value: {} },
      appList: { type: Array, value: [] },
      staxList: { type: Array, value: [] },
      bloxList: { type: Array, value: [] },
      globalPreferences: { type: Object, value: {} },
      activeApp: { type: Object, value: {} },
      validTagList: {
        type: Array,
        value: [
          "p",
          "div",
          "ol",
          "ul",
          "li",
          "a",
          "strong",
          "kbd",
          "em",
          "i",
          "b",
          "hr",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "code",
          "figure",
          "img",
          "iframe",
          "video",
          "audio",
          "section",
          "grid-plate",
          "template",
          "webview"
        ]
      },
      validGizmoTypes: {
        type: Array,
        value: [
          "data",
          "video",
          "audio",
          "text",
          "link",
          "file",
          "pdf",
          "image",
          "csv",
          "doc",
          "content",
          "text",
          "inline",
          "*"
        ]
      },
      _isSandboxed: {
        type: Boolean,
        value: function value() {
          var test = document.createElement("webview");
          if ("function" === typeof test.reload) {
            return !0;
          }
          return !1;
        }
      },
      __appStoreData: { type: Object }
    },
    isTextElement: function isTextElement(node) {
      if (
        null != node &&
        this.validTagList.includes(node.tagName.toLowerCase())
      ) {
        if (
          [
            "p",
            "ol",
            "ul",
            "li",
            "a",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "code",
            "figure"
          ].includes(node.tagName.toLowerCase())
        ) {
          return !0;
        }
      }
      return !1;
    },
    isGridPlateElement: function isGridPlateElement(node) {
      var tag = node.tagName.toLowerCase();
      if (this.validTagList.includes(tag)) {
        if (
          [
            "p",
            "ol",
            "ul",
            "li",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "code",
            "figure",
            "grid-plate"
          ].includes(tag)
        ) {
          return !0;
        }
      }
      return !1;
    },
    _appStoreChanged: function _appStoreChanged(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined") {
        if (babelHelpers.typeof(newValue.apps) === "undefined") {
          this.$.appstore.generateRequest();
        } else {
          this.__appStoreData = newValue;
        }
      }
    },
    _loadAppStoreData: function _loadAppStoreData(
      appDataResponse,
      haxAutoloader
    ) {
      var _this = this;
      if (
        babelHelpers.typeof(appDataResponse) !== "undefined" &&
        null != appDataResponse
      ) {
        if (babelHelpers.typeof(appDataResponse.autoloader) !== "undefined") {
          for (var i = 0, loader; i < appDataResponse.autoloader.length; i++) {
            loader = document.createElement(appDataResponse.autoloader[i]);
            (0, _polymerDom.dom)(haxAutoloader).appendChild(loader);
          }
        }
        if (babelHelpers.typeof(appDataResponse.apps) !== "undefined") {
          for (
            var apps = appDataResponse.apps, i = 0, app;
            i < apps.length;
            i++
          ) {
            app = document.createElement("hax-app");
            app.data = apps[i];
            if (
              babelHelpers.typeof(apps[i].connection.operations.add) !==
              "undefined"
            ) {
              async.microTask.run(function() {
                window.HaxStore.write("canSupportUploads", !0, _this);
              });
            }
            window.HaxStore.instance.appendChild(app);
          }
        }
        if (babelHelpers.typeof(appDataResponse.stax) !== "undefined") {
          for (
            var staxs = appDataResponse.stax, i = 0, stax;
            i < staxs.length;
            i++
          ) {
            stax = document.createElement("hax-stax");
            stax.data = staxs[i];
            window.HaxStore.instance.appendChild(stax);
          }
        }
        if (babelHelpers.typeof(appDataResponse.blox) !== "undefined") {
          for (
            var bloxs = appDataResponse.blox, i = 0, blox;
            i < bloxs.length;
            i++
          ) {
            blox = document.createElement("hax-blox");
            blox.data = bloxs[i];
            window.HaxStore.instance.appendChild(blox);
          }
        }
      }
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-register-properties",
        this._haxStoreRegisterProperties.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-app",
        this._haxStoreRegisterApp.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-stax",
        this._haxStoreRegisterStax.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-blox",
        this._haxStoreRegisterBlox.bind(this)
      );
      document.body.removeEventListener(
        "hax-store-write",
        this._writeHaxStore.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-manager",
        this._haxStoreRegisterManager.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-autoloader",
        this._haxStoreRegisterAutoloader.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-body",
        this._haxStoreRegisterBody.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-panel",
        this._haxStoreRegisterPanel.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-app-picker",
        this._haxStoreRegisterAppPicker.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-stax-picker",
        this._haxStoreRegisterStaxPicker.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-blox-picker",
        this._haxStoreRegisterBloxPicker.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-preferences",
        this._haxStoreRegisterPreferences.bind(this)
      );
      document.body.removeEventListener(
        "hax-register-export",
        this._haxStoreRegisterExport.bind(this)
      );
      document.body.removeEventListener(
        "hax-insert-content",
        this._haxStoreInsertContent.bind(this)
      );
    },
    attached: function attached() {
      var _this2 = this;
      window.onbeforeunload = function() {
        if (
          !window.HaxStore.instance.skipExitTrap &&
          window.HaxStore.instance.editMode
        ) {
          return "Are you sure you want to leave? Your work will not be saved!";
        }
      };
      window.addEventListener("paste", function(e) {
        if (
          _this2.isTextElement(window.HaxStore.instance.activeNode) &&
          !_this2.haxManager.opened
        ) {
          e.preventDefault();
          var text = "";
          if (e.clipboardData || e.originalEvent.clipboardData) {
            text = (e.originalEvent || e).clipboardData.getData("text/plain");
          } else if (window.clipboardData) {
            text = window.clipboardData.getData("Text");
          }
          var sel, range;
          if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
              range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(text));
            }
          } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
          }
        }
      });
      window.addEventListener("keypress", function(event) {
        var keyName = event.key;
        if (
          babelHelpers.typeof(window.HaxStore.instance.activeContainerNode) !==
            "undefined" &&
          "Enter" === keyName &&
          window.HaxStore.instance.editMode &&
          null !== window.HaxStore.instance.activeNode &&
          window.HaxStore.instance.activeContainerNode ===
            window.HaxStore.instance.activeNode &&
          !window.HaxStore.instance.haxAppPicker.opened
        ) {
          var activeNodeTagName =
              window.HaxStore.instance.activeContainerNode.tagName,
            selection = window.getSelection(),
            range = selection.getRangeAt(0).cloneRange(),
            tagTest = range.commonAncestorContainer.tagName;
          if (babelHelpers.typeof(tagTest) === "undefined") {
            tagTest = range.commonAncestorContainer.parentNode.tagName;
          }
          if (
            ["P", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
              activeNodeTagName
            ) &&
            !["UL", "OL", "LI"].includes(tagTest)
          ) {
            if (
              range.endOffset !== _this2.activeContainerNode.textContent.length
            ) {
              event.preventDefault();
              range.setStart(selection.focusNode, range.startOffset);
              var frag = document
                .createRange()
                .createContextualFragment(
                  "<hax-split-point></hax-split-point>"
                );
              range.insertNode(frag);
              var limit = window.HaxStore.instance.activeContainerNode,
                node = (0, _polymerDom.dom)(
                  window.HaxStore.instance.activeContainerNode
                ).querySelector("hax-split-point");
              if (null != node) {
                try {
                  _this2.__splitNode(node, limit);
                } catch (e) {}
              }
            } else {
              event.preventDefault();
              window.HaxStore.instance.fire("hax-insert-content", {
                tag: "p",
                content: ""
              });
            }
          }
        }
      });
      this._injectToast();
      this._buildPrimitiveDefinitions();
      this.fire("hax-store-ready", !0);
      window.HaxStore.ready = !0;
    },
    __splitNode: function __splitNode(node, limit) {
      var _this3 = this;
      window.HaxStore.write("activeNode", null, this);
      setTimeout(function() {
        var parent = limit.parentNode,
          parentOffset = _this3.__getNodeIndex(parent, limit),
          doc = node.ownerDocument,
          leftRange = doc.createRange();
        leftRange.setStart(parent, parentOffset);
        leftRange.setEndBefore(node);
        var left = leftRange.extractContents();
        (0, _polymerDom.dom)(_this3.activeHaxBody).insertBefore(left, limit);
        node.parentNode.removeChild(node);
        window.HaxStore.write("activeNode", limit, _this3);
      }, 100);
    },
    __getNodeIndex: function __getNodeIndex(parent, node) {
      var index = parent.childNodes.length;
      while (index--) {
        if (node === parent.childNodes[index]) {
          break;
        }
      }
      return index;
    },
    created: function created() {
      window.__startedSelection = !1;
      if (null == window.HaxStore.instance) {
        window.HaxStore.instance = this;
      }
      document.body.addEventListener(
        "hax-register-properties",
        this._haxStoreRegisterProperties.bind(this)
      );
      document.body.addEventListener(
        "hax-register-app",
        this._haxStoreRegisterApp.bind(this)
      );
      document.body.addEventListener(
        "hax-register-stax",
        this._haxStoreRegisterStax.bind(this)
      );
      document.body.addEventListener(
        "hax-register-blox",
        this._haxStoreRegisterBlox.bind(this)
      );
      document.body.addEventListener(
        "hax-store-write",
        this._writeHaxStore.bind(this)
      );
      document.body.addEventListener(
        "hax-register-manager",
        this._haxStoreRegisterManager.bind(this)
      );
      document.body.addEventListener(
        "hax-register-autoloader",
        this._haxStoreRegisterAutoloader.bind(this)
      );
      document.body.addEventListener(
        "hax-register-body",
        this._haxStoreRegisterBody.bind(this)
      );
      document.body.addEventListener(
        "hax-register-panel",
        this._haxStoreRegisterPanel.bind(this)
      );
      document.body.addEventListener(
        "hax-register-app-picker",
        this._haxStoreRegisterAppPicker.bind(this)
      );
      document.body.addEventListener(
        "hax-register-stax-picker",
        this._haxStoreRegisterStaxPicker.bind(this)
      );
      document.body.addEventListener(
        "hax-register-blox-picker",
        this._haxStoreRegisterBloxPicker.bind(this)
      );
      document.body.addEventListener(
        "hax-register-preferences",
        this._haxStoreRegisterPreferences.bind(this)
      );
      document.body.addEventListener(
        "hax-register-export",
        this._haxStoreRegisterExport.bind(this)
      );
      document.body.addEventListener(
        "hax-insert-content",
        this._haxStoreInsertContent.bind(this)
      );
      document.body.style.setProperty("--hax-ui-headings", "#d4ff77");
    },
    _buildPrimitiveDefinitions: function _buildPrimitiveDefinitions() {
      if (window.HaxStore.instance._isSandboxed) {
        this.setHaxProperties(
          {
            canScale: !0,
            canPosition: !0,
            canEditSource: !1,
            settings: {
              quick: [
                {
                  attribute: "src",
                  title: "Source",
                  description: "The URL for this video.",
                  inputMethod: "textfield",
                  icon: "link",
                  required: !0,
                  validationType: "url"
                }
              ],
              configure: [
                {
                  attribute: "src",
                  title: "Source",
                  description: "The URL for this video.",
                  inputMethod: "textfield",
                  icon: "link",
                  required: !0,
                  validationType: "url"
                }
              ],
              advanced: []
            }
          },
          "webview"
        );
      }
      this.setHaxProperties(
        {
          canScale: !0,
          canPosition: !0,
          canEditSource: !0,
          gizmo: {
            title: "Basic iframe",
            description: "A basic iframe",
            icon: "icons:fullscreen",
            color: "grey",
            groups: ["Content"],
            handles: [
              { type: "link", source: "src", height: "height", width: "width" }
            ],
            meta: { author: "W3C" }
          },
          settings: {
            quick: [
              {
                attribute: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "link",
                required: !0,
                validationType: "url"
              }
            ],
            configure: [
              {
                attribute: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "link",
                required: !0,
                validationType: "url"
              }
            ],
            advanced: []
          }
        },
        "iframe"
      );
      this.setHaxProperties(
        {
          canScale: !0,
          canPosition: !0,
          canEditSource: !1,
          gizmo: {
            title: "Basic image",
            description: "A basic img tag",
            icon: "image:image",
            color: "grey",
            groups: ["Image", "Media"],
            handles: [
              { type: "link", source: "src" },
              { type: "image", source: "src", height: "height", width: "width" }
            ],
            meta: { author: "W3C" }
          },
          settings: {
            quick: [
              {
                attribute: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "link",
                required: !0,
                validationType: "url"
              },
              {
                attribute: "alt",
                title: "Alt text",
                description: "Useful for screen readers and improved SEO.",
                inputMethod: "alt",
                icon: "accessibility"
              },
              {
                attribute: "height",
                title: "Height",
                description: "height in pixels of the item",
                inputMethod: "textfield",
                icon: "icons:swap-vert"
              },
              {
                attribute: "width",
                title: "Width",
                description: "width in pixels of the item",
                inputMethod: "textfield",
                icon: "icons:swap-horiz"
              }
            ],
            configure: [
              {
                attribute: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "link",
                required: !0,
                validationType: "url"
              },
              {
                attribute: "alt",
                title: "Alt text",
                description: "Useful for screen readers and improved SEO.",
                inputMethod: "alt",
                icon: "accessibility"
              },
              {
                attribute: "height",
                title: "Height",
                description: "height in pixels of the item",
                inputMethod: "textfield",
                icon: "icons:swap-vert"
              },
              {
                attribute: "width",
                title: "Width",
                description: "width in pixels of the item",
                inputMethod: "textfield",
                icon: "icons:swap-horiz"
              }
            ],
            advanced: []
          }
        },
        "img"
      );
      this.setHaxProperties(
        {
          canScale: !1,
          canPosition: !1,
          canEditSource: !1,
          gizmo: {
            title: "Basic link",
            description: "A basic a tag",
            icon: "icons:link",
            color: "grey",
            groups: ["Link"],
            handles: [
              { type: "link", source: "href", title: "innerText", alt: "title" }
            ],
            meta: { author: "W3C" }
          },
          settings: {
            quick: [
              {
                attribute: "href",
                title: "Link",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "icons:link",
                required: !0,
                validationType: "url"
              },
              {
                attribute: "title",
                title: "Title text",
                description: "Useful for screen readers and improved SEO.",
                inputMethod: "textfield",
                icon: "icons:accessibility"
              }
            ],
            configure: [
              {
                attribute: "innerText",
                title: "Text",
                description: "Text of the link",
                inputMethod: "textfield",
                required: !0
              },
              {
                attribute: "href",
                title: "Link",
                description: "The URL for this video.",
                inputMethod: "textfield",
                icon: "icons:link",
                required: !0,
                validationType: "url"
              },
              {
                attribute: "title",
                title: "Title text",
                description: "Useful for screen readers and improved SEO.",
                inputMethod: "textfield",
                icon: "icons:accessibility"
              },
              {
                attribute: "target",
                title: "Target",
                description: "Where to place the link.",
                inputMethod: "select",
                icon: "icons:launch",
                options: {
                  "": "Same window",
                  _blank: "New window",
                  _top: "Top window",
                  _parent: "Parent window"
                }
              }
            ],
            advanced: []
          }
        },
        "a"
      );
      this.setHaxProperties(
        {
          canScale: !1,
          canPosition: !1,
          canEditSource: !0,
          settings: { quick: [], configure: [], advanced: [] }
        },
        "p"
      );
      this.setHaxProperties(
        {
          canScale: !0,
          canPosition: !1,
          canEditSource: !1,
          settings: { quick: [], configure: [], advanced: [] }
        },
        "hr"
      );
    },
    _injectToast: function _injectToast() {
      var toast = document.createElement("paper-toast");
      toast.id = "haxtoast";
      toast.duration = 3e3;
      document.body.appendChild(toast);
      this.haxToast = toast;
    },
    _haxStoreRegisterManager: function _haxStoreRegisterManager(e) {
      if (e.detail && babelHelpers.typeof(this.haxManager) === "undefined") {
        this.haxManager = e.detail;
      }
    },
    _haxStoreRegisterAutoloader: function _haxStoreRegisterAutoloader(e) {
      if (e.detail && babelHelpers.typeof(this.haxAutoloader) === "undefined") {
        this.haxAutoloader = e.detail;
      }
    },
    _haxStoreRegisterAppPicker: function _haxStoreRegisterAppPicker(e) {
      if (e.detail && babelHelpers.typeof(this.haxAppPicker) === "undefined") {
        this.haxAppPicker = e.detail;
      }
    },
    _haxStoreRegisterStaxPicker: function _haxStoreRegisterStaxPicker(e) {
      if (e.detail && babelHelpers.typeof(this.haxStaxPicker) === "undefined") {
        this.haxStaxPicker = e.detail;
      }
    },
    _haxStoreRegisterBloxPicker: function _haxStoreRegisterBloxPicker(e) {
      if (e.detail && babelHelpers.typeof(this.haxBloxPicker) === "undefined") {
        this.haxBloxPicker = e.detail;
      }
    },
    closeAllDrawers: function closeAllDrawers() {
      var active =
          0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : !1,
        drawers = [
          "haxManager",
          "haxBloxPicker",
          "haxStaxPicker",
          "haxPreferences",
          "haxExport"
        ];
      for (var i in drawers) {
        if (active === this[drawers[i]]) {
          active.open();
          if ("haxManager" === drawers[i]) {
            setTimeout(function() {
              if (
                null !=
                active.querySelector("#activepage .iron-selected paper-input")
              ) {
                active
                  .querySelector("#activepage .iron-selected paper-input")
                  .focus();
              }
            }, 200);
          } else {
            setTimeout(function() {
              if (
                null !=
                active.querySelector(
                  "paper-checkbox,paper-input,textarea,paper-button"
                )
              ) {
                active
                  .querySelector(
                    "paper-checkbox,paper-input,textarea,paper-button"
                  )
                  .focus();
              }
            }, 100);
          }
        } else {
          this[drawers[i]].close();
        }
      }
    },
    _haxStoreInsertContent: function _haxStoreInsertContent(e) {
      if (e.detail) {
        var properties = {};
        if (babelHelpers.typeof(e.detail.properties) !== "undefined") {
          properties = e.detail.properties;
        }
        if (e.detail.replace && e.detail.replacement) {
          var node = window.HaxStore.haxElementToNode(
            e.detail.tag,
            e.detail.content,
            properties
          );
          if (this.activeNode !== this.activeContainerNode) {
            this.activeHaxBody.haxReplaceNode(
              this.activeNode,
              node,
              this.activeContainerNode
            );
          } else {
            this.activeHaxBody.haxReplaceNode(this.activeNode, node);
          }
        } else if (
          babelHelpers.typeof(e.detail.__type) !== "undefined" &&
          "inline" === e.detail.__type
        ) {
          var _node = window.HaxStore.haxElementToNode(
            e.detail.tag,
            e.detail.content,
            properties
          );
          if (null !== this.activePlaceHolder) {
            this.activePlaceHolder.deleteContents();
            this.activePlaceHolder.insertNode(_node);
          }
          this.activePlaceHolder = null;
        } else {
          this.activeHaxBody.haxInsert(
            e.detail.tag,
            e.detail.content,
            properties
          );
        }
      }
    },
    _haxStoreRegisterBody: function _haxStoreRegisterBody(e) {
      if (e.detail) {
        this.haxBodies.push(e.detail);
        this.activeHaxBody = e.detail;
        window.HaxStore.write("activeHaxBody", this.activeHaxBody, this);
        window.HaxStore.write("editMode", this.editMode, this);
      }
    },
    _haxStoreRegisterPanel: function _haxStoreRegisterPanel(e) {
      if (e.detail && babelHelpers.typeof(this.haxPanel) === "undefined") {
        this.haxPanel = e.detail;
      }
    },
    _haxStoreRegisterExport: function _haxStoreRegisterExport(e) {
      if (e.detail && babelHelpers.typeof(this.haxExport) === "undefined") {
        this.haxExport = e.detail;
      }
    },
    _haxStoreRegisterPreferences: function _haxStoreRegisterPreferences(e) {
      if (
        e.detail &&
        babelHelpers.typeof(this.haxPreferences) === "undefined"
      ) {
        this.haxPreferences = e.detail;
      }
    },
    computePolyfillSafe: function computePolyfillSafe() {
      if (document.head.createShadowRoot || document.head.attachShadow) {
        return !0;
      } else {
        console.log("Shadow DOM missing, can't safely use list operations.");
        return !1;
      }
    },
    _writeHaxStore: function _writeHaxStore(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !== "undefined" &&
        e.detail.property &&
        e.detail.owner
      ) {
        this.set(e.detail.property, e.detail.value);
        this.fire("hax-store-property-updated", {
          property: e.detail.property,
          value: e.detail.value,
          owner: e.detail.owner
        });
      }
    },
    _haxStoreRegisterApp: function _haxStoreRegisterApp(e) {
      if (e.detail) {
        e.detail.index = this.appList.length;
        this.push("appList", e.detail);
        window.HaxStore.write("appList", this.appList, this);
        if (
          babelHelpers.typeof(e.target.parentElement) !== "undefined" &&
          "HAX-STORE" === e.target.parentElement.tagName
        ) {
          (0, _polymerDom.dom)(e.target.parentElement).removeChild(e.target);
        }
      }
    },
    _haxStoreRegisterStax: function _haxStoreRegisterStax(e) {
      if (e.detail) {
        e.detail.index = this.staxList.length;
        this.push("staxList", e.detail);
        window.HaxStore.write("staxList", this.staxList, this);
        if (
          babelHelpers.typeof(e.target.parentElement) !== "undefined" &&
          "HAX-STORE" === e.target.parentElement.tagName
        ) {
          (0, _polymerDom.dom)(e.target.parentElement).removeChild(e.target);
        }
      }
    },
    _haxStoreRegisterBlox: function _haxStoreRegisterBlox(e) {
      if (e.detail) {
        e.detail.index = this.bloxList.length;
        this.push("bloxList", e.detail);
        window.HaxStore.write("bloxList", this.bloxList, this);
        if (
          babelHelpers.typeof(e.target.parentElement) !== "undefined" &&
          "HAX-STORE" === e.target.parentElement.tagName
        ) {
          (0, _polymerDom.dom)(e.target.parentElement).removeChild(e.target);
        }
      }
    },
    _haxStoreRegisterProperties: function _haxStoreRegisterProperties(e) {
      if (e.detail && e.detail.properties && e.detail.tag) {
        if (
          babelHelpers.typeof(this.elementList[e.detail.tag]) === "undefined"
        ) {
          var gizmo = e.detail.properties.gizmo;
          if (gizmo) {
            gizmo.tag = e.detail.tag;
            var gizmos = this.gizmoList;
            gizmos.push(gizmo);
            window.HaxStore.write("gizmoList", gizmos, this);
            if (
              babelHelpers.typeof(e.target.parentElement) !== "undefined" &&
              "HAX-AUTOLOADER" === e.target.parentElement.tagName
            ) {
              (0, _polymerDom.dom)(this.haxAutoloader).removeChild(e.target);
            }
          }
          this.set("elementList." + e.detail.tag, e.detail.properties);
          if (
            !this.validTagList.find(function(element) {
              return element === e.detail.tag;
            })
          ) {
            this.push("validTagList", e.detail.tag);
          }
        }
      }
    }
  });
  window.HaxStore.toArray = function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  };
  window.HaxStore.camelToDash = function(str) {
    return str
      .replace(/\W+/g, "-")
      .replace(/([a-z\d])([A-Z])/g, "$1-$2")
      .toLowerCase();
  };
  window.HaxStore.dashToCamel = function(str) {
    return str.replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase();
    });
  };
  window.HaxStore.htmlToHaxElements = function(html) {
    var elements = [],
      validTags = window.HaxStore.instance.validTagList,
      fragment = document.createElement("div");
    fragment.innerHTML = html;
    for (var children = fragment.childNodes, i = 0; i < children.length; i++) {
      if (
        babelHelpers.typeof(children[i].tagName) !== "undefined" &&
        validTags.includes(children[i].tagName.toLowerCase())
      ) {
        elements.push(window.HaxStore.nodeToHaxElement(children[i], null));
      }
    }
    return elements;
  };
  window.HaxStore.nodeToHaxElement = function(node) {
    var eventName =
        1 < arguments.length && arguments[1] !== void 0
          ? arguments[1]
          : "insert-element",
      props = {};
    if (babelHelpers.typeof(node.style) !== "undefined") {
      props.style = node.getAttribute("style");
    }
    if (null === props.style || "null" === props.style) {
      delete props.style;
    }
    if (babelHelpers.typeof(node.attributes.class) !== "undefined") {
      props.class = node.attributes.class.nodeValue.replace("hax-active", "");
    }
    if (babelHelpers.typeof(node.attributes.id) !== "undefined") {
      props.id = node.getAttribute("id");
    }
    if (babelHelpers.typeof(node.properties) !== "undefined") {
      for (var property in node.properties) {
        if (
          "class" != property &&
          "style" != property &&
          node.properties.hasOwnProperty(property) &&
          babelHelpers.typeof(node[property]) !== void 0 &&
          null != node[property] &&
          "" != node[property]
        ) {
          props[property] = node[property];
        } else if (!1 === node[property]) {
          props[property] = node[property];
        }
      }
      for (var attribute in node.attributes) {
        if (
          babelHelpers.typeof(node.attributes[attribute].name) !==
            "undefined" &&
          "class" != node.attributes[attribute].name &&
          "style" != node.attributes[attribute].name &&
          "id" != node.attributes[attribute].name &&
          node.attributes.hasOwnProperty(attribute) &&
          babelHelpers.typeof(node.attributes[attribute].value) !== void 0 &&
          null != node.attributes[attribute].value &&
          "" != node.attributes[attribute].value &&
          !node.properties.hasOwnProperty(
            window.HaxStore.dashToCamel(node.attributes[attribute].name)
          )
        ) {
          props[window.HaxStore.dashToCamel(node.attributes[attribute].name)] =
            node.attributes[attribute].value;
        }
      }
    } else {
      for (var attribute in node.attributes) {
        if (
          babelHelpers.typeof(node.attributes[attribute].name) !==
            "undefined" &&
          "class" != node.attributes[attribute].name &&
          "style" != node.attributes[attribute].name &&
          "id" != node.attributes[attribute].name &&
          node.attributes.hasOwnProperty(attribute) &&
          babelHelpers.typeof(node.attributes[attribute].value) !== void 0 &&
          null != node.attributes[attribute].value &&
          "" != node.attributes[attribute].value
        ) {
          props[window.HaxStore.dashToCamel(node.attributes[attribute].name)] =
            node.attributes[attribute].value;
        }
      }
    }
    var tag = node.tagName.toLowerCase();
    if (window.HaxStore.instance._isSandboxed && "iframe" === tag) {
      tag = "webview";
    }
    var slotContent = window.HaxStore.getHAXSlot(node);
    if ("a" === tag) {
      props.innerText = slotContent;
    } else if ("p" === tag || "ol" === tag || "ul" === tag || "div" === tag) {
      props.innerHTML = slotContent;
    }
    var element = { tag: tag, properties: props, content: slotContent };
    if (null !== eventName) {
      element.eventName = eventName;
    }
    return element;
  };
  window.HaxStore.haxElementToNode = function(tag, content, properties) {
    if (window.HaxStore.instance._isSandboxed && "iframe" === tag) {
      tag = "webview";
    }
    var frag = document.createElement(tag);
    frag.innerHTML = content;
    var newNode = frag.cloneNode(!0);
    for (var property in properties) {
      var attributeName = window.HaxStore.camelToDash(property);
      if (properties.hasOwnProperty(property)) {
        if (!0 === properties[property]) {
          newNode.setAttribute(attributeName, properties[property]);
        } else if (!1 === properties[property]) {
          newNode.removeAttribute(attributeName);
        } else if (
          null != properties[property] &&
          properties[property].constructor === Array &&
          !frag.properties[property].readOnly
        ) {
          newNode.set(attributeName, properties[property]);
        } else if (
          null != properties[property] &&
          properties[property].constructor === Object &&
          !frag.properties[property].readOnly
        ) {
          newNode.set(attributeName, properties[property]);
        } else {
          newNode.setAttribute(attributeName, properties[property]);
        }
      }
    }
    return newNode;
  };
  window.HaxStore.haxNodeToContent = function(node) {
    if (
      window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
    ) {
      console.log(node);
    }
    var prototype = Object.getPrototypeOf(node);
    if (
      babelHelpers.typeof(prototype.preProcessHaxNodeToContent) !== "undefined"
    ) {
      var clone = node.cloneNode();
      node = prototype.preProcessHaxNodeToContent(clone);
    }
    var tag = node.tagName.toLowerCase();
    if (window.HaxStore.instance._isSandboxed && "webview" === tag) {
      tag = "iframe";
    }
    var content = "";
    content += "<" + tag;
    for (
      var props = window.HaxStore.instance.elementList[tag],
        propvals = {},
        j = 0,
        l = node.attributes.length;
      j < l;
      ++j
    ) {
      var nodeName = node.attributes.item(j).nodeName,
        value = node.attributes.item(j).value;
      if (
        "style" != nodeName &&
        (babelHelpers.typeof(value) ===
          ("undefined" === typeof Object
            ? "undefined"
            : babelHelpers.typeof(Object)) ||
          value.constructor === Array)
      ) {
        propvals[nodeName] = JSON.stringify(value).replace(/"/g, "&quot;");
      } else if (null != value && "null" != value) {
        if (!0 === value || "true" === value) {
          propvals[nodeName] = !0;
        } else if (!(!1 === value)) {
          if ("string" === typeof value && "" !== value) {
            value = value.replace(/"/g, "&quot;");
            propvals[nodeName] = value;
          } else if ("" === value) {
            if ("" == value && "" != node.attributes.item(j).value) {
              value = node.attributes.item(j).value;
            }
            propvals[nodeName] = value;
          } else {
            propvals[nodeName] = value;
          }
        }
      }
    }
    if (babelHelpers.typeof(node.properties) !== "undefined") {
      for (var j in node.properties) {
        var nodeName = window.HaxStore.camelToDash(j),
          value = null;
        if (babelHelpers.typeof(node[j]) !== "undefined") {
          value = node[j];
        }
        if (
          !node.properties[j].readOnly &&
          value !== node.properties[j].value
        ) {
          if (
            null != value &&
            (babelHelpers.typeof(value) ===
              ("undefined" === typeof Object
                ? "undefined"
                : babelHelpers.typeof(Object)) ||
              value.constructor === Array)
          ) {
            propvals[nodeName] = JSON.stringify(value).replace(/"/g, "&quot;");
          } else if (null != value && "null" != value) {
            if (!0 === value || "true" === value) {
              propvals[nodeName] = !0;
            } else if (!(!1 === value)) {
              if ("string" === typeof value && "" !== value) {
                value = value.replace(/"/g, "&quot;");
                propvals[nodeName] = value;
              } else if ("" === value) {
                if ("" == value && "" != node.properties[j].value) {
                  value = node.properties[j].value;
                } else if ("" === value && "" == node.properties[j].value) {
                }
              } else {
                propvals[nodeName] = value;
              }
            }
          }
        }
      }
    }
    if (
      babelHelpers.typeof(props) !== "undefined" &&
      babelHelpers.typeof(props.saveOptions.unsetAttributes) !== "undefined"
    ) {
      for (var i in props.saveOptions.unsetAttributes) {
        delete propvals[props.saveOptions.unsetAttributes[i]];
      }
    }
    var delProps = ["inner-text", "tabindex", "guestinstance"];
    for (var delProp in delProps) {
      if (babelHelpers.typeof(propvals[delProps[delProp]]) !== "undefined") {
        delete propvals[delProps[delProp]];
      }
    }
    if (
      babelHelpers.typeof(propvals.id) !== "undefined" &&
      "" === propvals.id
    ) {
      delete propvals.id;
    }
    for (var i in propvals) {
      if (!0 === propvals[i]) {
        content += " " + i;
      } else {
        content += " " + i + '="' + propvals[i] + '"';
      }
    }
    if (
      [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
      ].includes(tag)
    ) {
      content += "/>";
    } else {
      content += ">";
    }
    if (
      babelHelpers.typeof(props) === "undefined" ||
      !props.saveOptions.wipeSlot
    ) {
      var slotnodes = (0, _polymerDom.dom)(node).getEffectiveChildNodes();
      if (0 < slotnodes.length) {
        for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
          if (babelHelpers.typeof(slotnodes[j].tagName) !== "undefined") {
            if (
              !window.HaxStore.HTMLPrimativeTest(slotnodes[j].tagName) &&
              "TEMPLATE" !== slotnodes[j].tagName
            ) {
              content += window.HaxStore.haxNodeToContent(slotnodes[j]);
            } else {
              slotnodes[j].setAttribute("data-editable", !1);
              slotnodes[j].removeAttribute("data-hax-ray");
              slotnodes[j].contentEditable = !1;
              content += slotnodes[j].outerHTML;
            }
          } else if (8 === slotnodes[j].nodeType) {
            content += "<!-- " + slotnodes[j].textContent + " -->";
          } else if (
            1 !== slotnodes[j].nodeType &&
            babelHelpers.typeof(slotnodes[j].textContent) !== "undefined" &&
            "undefined" !== slotnodes[j].textContent
          ) {
            content += slotnodes[j].textContent;
          }
        }
      }
    }
    if ("span" === tag) {
      content += "</" + tag + ">";
    } else if (!("hr" === tag || "br" === tag || "img" === tag)) {
      content += "</" + tag + ">" + "\n";
    }
    if (
      window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
    ) {
      console.log(content);
    }
    if ("function" === node.postProcesshaxNodeToContent) {
      content = node.postProcesshaxNodeToContent(content);
    }
    return content;
  };
  window.HaxStore.HTMLPrimativeTest = function(node) {
    if (
      babelHelpers.typeof(node.tagName) !== "undefined" &&
      -1 == node.tagName.indexOf("-")
    ) {
      return !0;
    }
    return !1;
  };
  window.HaxStore.getHAXSlot = function(node) {
    var content = "",
      slotnodes = (0, _polymerDom.dom)(node).children;
    if (0 < slotnodes.length) {
      for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
        if (babelHelpers.typeof(slotnodes[j].tagName) !== "undefined") {
          if (0 < slotnodes[j].tagName.indexOf("-")) {
            content +=
              "  " + window.HaxStore.haxNodeToContent(slotnodes[j]) + "\n";
          } else {
            content += "  " + slotnodes[j].outerHTML + "\n";
          }
        } else if (8 === slotnodes[j].nodeType) {
          content += "<!-- " + slotnodes[j].textContent + " -->";
        } else if (
          1 !== slotnodes[j].nodeType &&
          babelHelpers.typeof(slotnodes[j].textContent) !== "undefined" &&
          "undefined" !== slotnodes[j].textContent
        ) {
          content += slotnodes[j].textContent;
        }
      }
    }
    return content;
  };
  window.HaxStore.write = function(prop, value, obj) {
    obj.fire("hax-store-write", { property: prop, value: value, owner: obj });
  };
  window.HaxStore.guessGizmoType = function(guess) {
    if (babelHelpers.typeof(guess.source) !== "undefined") {
      if (-1 != guess.source.indexOf(".mp3")) {
        return "audio";
      } else if (
        -1 != guess.source.indexOf(".png") ||
        -1 != guess.source.indexOf(".jpg") ||
        -1 != guess.source.indexOf(".jpeg") ||
        -1 != guess.source.indexOf(".gif")
      ) {
        return "image";
      } else if (-1 != guess.source.indexOf(".pdf")) {
        return "pdf";
      } else if (-1 != guess.source.indexOf(".svg")) {
        return "svg";
      } else if (-1 != guess.source.indexOf(".csv")) {
        return "csv";
      } else if (
        "external" != window.HaxStore.instance.getVideoType(guess.source)
      ) {
        return "video";
      } else {
        return "*";
      }
    }
  };
  window.HaxStore.guessGizmo = function(guess, values) {
    var skipPropMatch =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : !1,
      matches = [];
    if (babelHelpers.typeof(guess) !== "undefined") {
      var store = window.HaxStore.instance;
      if (store.validGizmoTypes.includes(guess)) {
        for (var gizmoposition in store.gizmoList) {
          for (
            var gizmo = store.gizmoList[gizmoposition],
              props = {},
              match = !1,
              i = 0;
            i < gizmo.handles.length;
            i++
          ) {
            if (guess === gizmo.handles[i].type || ("*" === guess && !match)) {
              for (var property in gizmo.handles[i]) {
                if ("type" !== property) {
                  if (babelHelpers.typeof(values[property]) !== "undefined") {
                    match = !0;
                    props[gizmo.handles[i][property]] = values[property];
                  }
                }
              }
              if (match || skipPropMatch) {
                matches.push(
                  window.HaxStore.haxElementPrototype(gizmo, props, "")
                );
              }
            }
          }
        }
      }
    }
    return matches;
  };
  window.HaxStore.getHaxAppStoreTargets = function(type) {
    var targets = window.HaxStore.instance.appList.filter(function(app) {
      if (babelHelpers.typeof(app.connection.operations.add) !== "undefined") {
        var add = app.connection.operations.add;
        if (
          babelHelpers.typeof(add.acceptsGizmoTypes) !== "undefined" &&
          add.acceptsGizmoTypes.includes(type)
        ) {
          return !0;
        }
      }
      return !1;
    });
    return targets;
  };
  window.HaxStore.haxElementPrototype = function(gizmo, properties) {
    var content =
      2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : "";
    return {
      tag: gizmo.tag,
      properties: properties,
      content: content,
      gizmo: gizmo
    };
  };
  window.HaxStore.wipeSlot = function(element) {
    var slot =
      1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : "";
    if ("*" === slot) {
      while (null !== (0, _polymerDom.dom)(element).firstChild) {
        (0, _polymerDom.dom)(element).removeChild(
          (0, _polymerDom.dom)(element).firstChild
        );
      }
    } else {
      for (var i in (0, _polymerDom.dom)(element).childNodes) {
        if (
          babelHelpers.typeof((0, _polymerDom.dom)(element).childNodes[i]) !==
            "undefined" &&
          (0, _polymerDom.dom)(element).childNodes[i].slot === slot
        ) {
          (0, _polymerDom.dom)(element).removeChild(
            (0, _polymerDom.dom)(element).childNodes[i]
          );
        }
      }
    }
  };
  window.HaxStore.encapScript = function(html) {
    html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
    html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
    html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
    html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
    html = html.replace(
      /<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi,
      function(match) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      }
    );
    return html;
  };
  window.HaxStore.toast = function(message) {
    var duration =
      1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : 3e3;
    window.HaxStore.instance.haxToast.duration = duration;
    window.HaxStore.instance.haxToast.show(message);
  };
});
