import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/paper-toast/paper-toast.js";
import "../node_modules/@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "../node_modules/@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./hax-app.js";
import "./hax-stax.js";
import "./hax-stax-browser.js";
import "./hax-blox.js";
import "./hax-blox-browser.js";
window.HaxStore = {};
window.HaxStore.instance = null;
window.HaxStore.requestAvailability = function() {
  if (!window.HaxStore.instance) {
    window.HaxStore.instance = document.createElement("hax-store");
  }
  document.body.appendChild(window.HaxStore.instance);
};
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
    </style>
    <slot></slot>
    <iron-ajax id="appstore" url="[[appStore.url]]" params="[[appStore.params]]" method="GET" content-type="application/json" handle-as="json" last-response="{{__appStoreData}}"></iron-ajax>
`,
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
      value: function() {
        let test = document.createElement("webview");
        if ("function" === typeof test.reload) {
          return !0;
        }
        return !1;
      }
    },
    __appStoreData: { type: Object }
  },
  isTextElement: function(node) {
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
  isGridPlateElement: function(node) {
    let tag = node.tagName.toLowerCase();
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
  _appStoreChanged: function(newValue) {
    if (typeof newValue !== typeof void 0) {
      if (typeof newValue.apps === typeof void 0) {
        this.$.appstore.generateRequest();
      } else {
        this.__appStoreData = newValue;
      }
    }
  },
  _loadAppStoreData: function(appDataResponse, haxAutoloader) {
    if (typeof appDataResponse !== typeof void 0 && null != appDataResponse) {
      if (typeof appDataResponse.autoloader !== typeof void 0) {
        for (var i = 0; i < appDataResponse.autoloader.length; i++) {
          let loader = document.createElement(appDataResponse.autoloader[i]);
          dom(haxAutoloader).appendChild(loader);
        }
      }
      if (typeof appDataResponse.apps !== typeof void 0) {
        for (var apps = appDataResponse.apps, i = 0; i < apps.length; i++) {
          let app = document.createElement("hax-app");
          app.data = apps[i];
          if (typeof apps[i].connection.operations.add !== typeof void 0) {
            async.microTask.run(() => {
              window.HaxStore.write("canSupportUploads", !0, this);
            });
          }
          window.HaxStore.instance.appendChild(app);
        }
      }
      if (typeof appDataResponse.stax !== typeof void 0) {
        for (var staxs = appDataResponse.stax, i = 0; i < staxs.length; i++) {
          let stax = document.createElement("hax-stax");
          stax.data = staxs[i];
          window.HaxStore.instance.appendChild(stax);
        }
      }
      if (typeof appDataResponse.blox !== typeof void 0) {
        for (var bloxs = appDataResponse.blox, i = 0; i < bloxs.length; i++) {
          let blox = document.createElement("hax-blox");
          blox.data = bloxs[i];
          window.HaxStore.instance.appendChild(blox);
        }
      }
    }
  },
  detached: function() {
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
  attached: function() {
    window.onbeforeunload = function() {
      if (
        !window.HaxStore.instance.skipExitTrap &&
        window.HaxStore.instance.editMode
      ) {
        return "Are you sure you want to leave? Your work will not be saved!";
      }
    };
    window.addEventListener("paste", e => {
      if (
        this.isTextElement(window.HaxStore.instance.activeNode) &&
        !this.haxManager.opened
      ) {
        e.preventDefault();
        let text = "";
        if (e.clipboardData || e.originalEvent.clipboardData) {
          text = (e.originalEvent || e).clipboardData.getData("text/plain");
        } else if (window.clipboardData) {
          text = window.clipboardData.getData("Text");
        }
        let sel, range;
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
    window.addEventListener("keypress", event => {
      const keyName = event.key;
      if (
        typeof window.HaxStore.instance.activeContainerNode !== typeof void 0 &&
        "Enter" === keyName &&
        window.HaxStore.instance.editMode &&
        null !== window.HaxStore.instance.activeNode &&
        window.HaxStore.instance.activeContainerNode ===
          window.HaxStore.instance.activeNode &&
        !window.HaxStore.instance.haxAppPicker.opened
      ) {
        const activeNodeTagName =
          window.HaxStore.instance.activeContainerNode.tagName;
        var selection = window.getSelection();
        const range = selection.getRangeAt(0).cloneRange();
        var tagTest = range.commonAncestorContainer.tagName;
        if (typeof tagTest === typeof void 0) {
          tagTest = range.commonAncestorContainer.parentNode.tagName;
        }
        if (
          ["P", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
            activeNodeTagName
          ) &&
          !["UL", "OL", "LI"].includes(tagTest)
        ) {
          if (range.endOffset !== this.activeContainerNode.textContent.length) {
            event.preventDefault();
            range.setStart(selection.focusNode, range.startOffset);
            var frag = document
              .createRange()
              .createContextualFragment("<hax-split-point></hax-split-point>");
            range.insertNode(frag);
            const limit = window.HaxStore.instance.activeContainerNode;
            var node = dom(
              window.HaxStore.instance.activeContainerNode
            ).querySelector("hax-split-point");
            if (null != node) {
              try {
                this.__splitNode(node, limit);
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
  __splitNode: function(node, limit) {
    window.HaxStore.write("activeNode", null, this);
    setTimeout(() => {
      var parent = limit.parentNode,
        parentOffset = this.__getNodeIndex(parent, limit),
        doc = node.ownerDocument,
        leftRange = doc.createRange();
      leftRange.setStart(parent, parentOffset);
      leftRange.setEndBefore(node);
      var left = leftRange.extractContents();
      dom(this.activeHaxBody).insertBefore(left, limit);
      node.parentNode.removeChild(node);
      window.HaxStore.write("activeNode", limit, this);
    }, 100);
  },
  __getNodeIndex: function(parent, node) {
    var index = parent.childNodes.length;
    while (index--) {
      if (node === parent.childNodes[index]) {
        break;
      }
    }
    return index;
  },
  created: function() {
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
  _buildPrimitiveDefinitions: function() {
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
  _injectToast: function() {
    var toast = document.createElement("paper-toast");
    toast.id = "haxtoast";
    toast.duration = 3e3;
    document.body.appendChild(toast);
    this.haxToast = toast;
  },
  _haxStoreRegisterManager: function(e) {
    if (e.detail && typeof this.haxManager === typeof void 0) {
      this.haxManager = e.detail;
    }
  },
  _haxStoreRegisterAutoloader: function(e) {
    if (e.detail && typeof this.haxAutoloader === typeof void 0) {
      this.haxAutoloader = e.detail;
    }
  },
  _haxStoreRegisterAppPicker: function(e) {
    if (e.detail && typeof this.haxAppPicker === typeof void 0) {
      this.haxAppPicker = e.detail;
    }
  },
  _haxStoreRegisterStaxPicker: function(e) {
    if (e.detail && typeof this.haxStaxPicker === typeof void 0) {
      this.haxStaxPicker = e.detail;
    }
  },
  _haxStoreRegisterBloxPicker: function(e) {
    if (e.detail && typeof this.haxBloxPicker === typeof void 0) {
      this.haxBloxPicker = e.detail;
    }
  },
  closeAllDrawers: function(active = !1) {
    let drawers = [
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
          setTimeout(() => {
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
          setTimeout(() => {
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
  _haxStoreInsertContent: function(e) {
    if (e.detail) {
      var properties = {};
      if (typeof e.detail.properties !== typeof void 0) {
        properties = e.detail.properties;
      }
      if (e.detail.replace && e.detail.replacement) {
        let node = window.HaxStore.haxElementToNode(
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
        typeof e.detail.__type !== typeof void 0 &&
        "inline" === e.detail.__type
      ) {
        let node = window.HaxStore.haxElementToNode(
          e.detail.tag,
          e.detail.content,
          properties
        );
        if (null !== this.activePlaceHolder) {
          this.activePlaceHolder.deleteContents();
          this.activePlaceHolder.insertNode(node);
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
  _haxStoreRegisterBody: function(e) {
    if (e.detail) {
      this.haxBodies.push(e.detail);
      this.activeHaxBody = e.detail;
      window.HaxStore.write("activeHaxBody", this.activeHaxBody, this);
      window.HaxStore.write("editMode", this.editMode, this);
    }
  },
  _haxStoreRegisterPanel: function(e) {
    if (e.detail && typeof this.haxPanel === typeof void 0) {
      this.haxPanel = e.detail;
    }
  },
  _haxStoreRegisterExport: function(e) {
    if (e.detail && typeof this.haxExport === typeof void 0) {
      this.haxExport = e.detail;
    }
  },
  _haxStoreRegisterPreferences: function(e) {
    if (e.detail && typeof this.haxPreferences === typeof void 0) {
      this.haxPreferences = e.detail;
    }
  },
  computePolyfillSafe: function() {
    if (document.head.createShadowRoot || document.head.attachShadow) {
      return !0;
    } else {
      console.log("Shadow DOM missing, can't safely use list operations.");
      return !1;
    }
  },
  _writeHaxStore: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
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
  _haxStoreRegisterApp: function(e) {
    if (e.detail) {
      e.detail.index = this.appList.length;
      this.push("appList", e.detail);
      window.HaxStore.write("appList", this.appList, this);
      if (
        typeof e.target.parentElement !== typeof void 0 &&
        "HAX-STORE" === e.target.parentElement.tagName
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  },
  _haxStoreRegisterStax: function(e) {
    if (e.detail) {
      e.detail.index = this.staxList.length;
      this.push("staxList", e.detail);
      window.HaxStore.write("staxList", this.staxList, this);
      if (
        typeof e.target.parentElement !== typeof void 0 &&
        "HAX-STORE" === e.target.parentElement.tagName
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  },
  _haxStoreRegisterBlox: function(e) {
    if (e.detail) {
      e.detail.index = this.bloxList.length;
      this.push("bloxList", e.detail);
      window.HaxStore.write("bloxList", this.bloxList, this);
      if (
        typeof e.target.parentElement !== typeof void 0 &&
        "HAX-STORE" === e.target.parentElement.tagName
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  },
  _haxStoreRegisterProperties: function(e) {
    if (e.detail && e.detail.properties && e.detail.tag) {
      if (typeof this.elementList[e.detail.tag] === typeof void 0) {
        let gizmo = e.detail.properties.gizmo;
        if (gizmo) {
          gizmo.tag = e.detail.tag;
          let gizmos = this.gizmoList;
          gizmos.push(gizmo);
          window.HaxStore.write("gizmoList", gizmos, this);
          if (
            typeof e.target.parentElement !== typeof void 0 &&
            "HAX-AUTOLOADER" === e.target.parentElement.tagName
          ) {
            dom(this.haxAutoloader).removeChild(e.target);
          }
        }
        this.set("elementList." + e.detail.tag, e.detail.properties);
        if (
          !this.validTagList.find(element => {
            return element === e.detail.tag;
          })
        ) {
          this.push("validTagList", e.detail.tag);
        }
      }
    }
  }
});
window.HaxStore.toArray = obj => {
  return Object.keys(obj).map(function(key) {
    return obj[key];
  });
};
window.HaxStore.camelToDash = str => {
  return str
    .replace(/\W+/g, "-")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase();
};
window.HaxStore.dashToCamel = str => {
  return str.replace(/-([a-z])/g, function(g) {
    return g[1].toUpperCase();
  });
};
window.HaxStore.htmlToHaxElements = html => {
  let elements = [];
  const validTags = window.HaxStore.instance.validTagList;
  let fragment = document.createElement("div");
  fragment.innerHTML = html;
  const children = fragment.childNodes;
  for (var i = 0; i < children.length; i++) {
    if (
      typeof children[i].tagName !== typeof void 0 &&
      validTags.includes(children[i].tagName.toLowerCase())
    ) {
      elements.push(window.HaxStore.nodeToHaxElement(children[i], null));
    }
  }
  return elements;
};
window.HaxStore.nodeToHaxElement = (node, eventName = "insert-element") => {
  let props = {};
  if (typeof node.style !== typeof void 0) {
    props.style = node.getAttribute("style");
  }
  if (null === props.style || "null" === props.style) {
    delete props.style;
  }
  if (typeof node.attributes.class !== typeof void 0) {
    props.class = node.attributes.class.nodeValue.replace("hax-active", "");
  }
  if (typeof node.attributes.id !== typeof void 0) {
    props.id = node.getAttribute("id");
  }
  if (typeof node.properties !== typeof void 0) {
    for (var property in node.properties) {
      if (
        "class" != property &&
        "style" != property &&
        node.properties.hasOwnProperty(property) &&
        typeof node[property] !== void 0 &&
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
        typeof node.attributes[attribute].name !== typeof void 0 &&
        "class" != node.attributes[attribute].name &&
        "style" != node.attributes[attribute].name &&
        "id" != node.attributes[attribute].name &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== void 0 &&
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
        typeof node.attributes[attribute].name !== typeof void 0 &&
        "class" != node.attributes[attribute].name &&
        "style" != node.attributes[attribute].name &&
        "id" != node.attributes[attribute].name &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== void 0 &&
        null != node.attributes[attribute].value &&
        "" != node.attributes[attribute].value
      ) {
        props[window.HaxStore.dashToCamel(node.attributes[attribute].name)] =
          node.attributes[attribute].value;
      }
    }
  }
  let tag = node.tagName.toLowerCase();
  if (window.HaxStore.instance._isSandboxed && "iframe" === tag) {
    tag = "webview";
  }
  let slotContent = window.HaxStore.getHAXSlot(node);
  if ("a" === tag) {
    props.innerText = slotContent;
  } else if ("p" === tag || "ol" === tag || "ul" === tag || "div" === tag) {
    props.innerHTML = slotContent;
  }
  let element = { tag: tag, properties: props, content: slotContent };
  if (null !== eventName) {
    element.eventName = eventName;
  }
  return element;
};
window.HaxStore.haxElementToNode = (tag, content, properties) => {
  if (window.HaxStore.instance._isSandboxed && "iframe" === tag) {
    tag = "webview";
  }
  var frag = document.createElement(tag);
  frag.innerHTML = content;
  var newNode = frag.cloneNode(!0);
  for (var property in properties) {
    let attributeName = window.HaxStore.camelToDash(property);
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
window.HaxStore.haxNodeToContent = node => {
  if (
    window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
  ) {
    console.log(node);
  }
  let prototype = Object.getPrototypeOf(node);
  if (typeof prototype.preProcessHaxNodeToContent !== typeof void 0) {
    let clone = node.cloneNode();
    node = prototype.preProcessHaxNodeToContent(clone);
  }
  let tag = node.tagName.toLowerCase();
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
      (typeof value === typeof Object || value.constructor === Array)
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
  if (typeof node.properties !== typeof void 0) {
    for (var j in node.properties) {
      var nodeName = window.HaxStore.camelToDash(j),
        value = null;
      if (typeof node[j] !== typeof void 0) {
        value = node[j];
      }
      if (!node.properties[j].readOnly && value !== node.properties[j].value) {
        if (
          null != value &&
          (typeof value === typeof Object || value.constructor === Array)
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
    typeof props !== typeof void 0 &&
    typeof props.saveOptions.unsetAttributes !== typeof void 0
  ) {
    for (var i in props.saveOptions.unsetAttributes) {
      delete propvals[props.saveOptions.unsetAttributes[i]];
    }
  }
  let delProps = ["inner-text", "tabindex", "guestinstance"];
  for (var delProp in delProps) {
    if (typeof propvals[delProps[delProp]] !== typeof void 0) {
      delete propvals[delProps[delProp]];
    }
  }
  if (typeof propvals.id !== typeof void 0 && "" === propvals.id) {
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
  if (typeof props === typeof void 0 || !props.saveOptions.wipeSlot) {
    let slotnodes = dom(node).getEffectiveChildNodes();
    if (0 < slotnodes.length) {
      for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
        if (typeof slotnodes[j].tagName !== typeof void 0) {
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
          typeof slotnodes[j].textContent !== typeof void 0 &&
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
window.HaxStore.HTMLPrimativeTest = node => {
  if (
    typeof node.tagName !== typeof void 0 &&
    -1 == node.tagName.indexOf("-")
  ) {
    return !0;
  }
  return !1;
};
window.HaxStore.getHAXSlot = node => {
  let content = "";
  var slotnodes = dom(node).children;
  if (0 < slotnodes.length) {
    for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
      if (typeof slotnodes[j].tagName !== typeof void 0) {
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
        typeof slotnodes[j].textContent !== typeof void 0 &&
        "undefined" !== slotnodes[j].textContent
      ) {
        content += slotnodes[j].textContent;
      }
    }
  }
  return content;
};
window.HaxStore.write = (prop, value, obj) => {
  obj.fire("hax-store-write", { property: prop, value: value, owner: obj });
};
window.HaxStore.guessGizmoType = guess => {
  if (typeof guess.source !== typeof void 0) {
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
window.HaxStore.guessGizmo = (guess, values, skipPropMatch = !1) => {
  var matches = [];
  if (typeof guess !== typeof void 0) {
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
                if (typeof values[property] !== typeof void 0) {
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
window.HaxStore.getHaxAppStoreTargets = type => {
  let targets = window.HaxStore.instance.appList.filter(app => {
    if (typeof app.connection.operations.add !== typeof void 0) {
      let add = app.connection.operations.add;
      if (
        typeof add.acceptsGizmoTypes !== typeof void 0 &&
        add.acceptsGizmoTypes.includes(type)
      ) {
        return !0;
      }
    }
    return !1;
  });
  return targets;
};
window.HaxStore.haxElementPrototype = (gizmo, properties, content = "") => {
  return {
    tag: gizmo.tag,
    properties: properties,
    content: content,
    gizmo: gizmo
  };
};
window.HaxStore.wipeSlot = (element, slot = "") => {
  if ("*" === slot) {
    while (null !== dom(element).firstChild) {
      dom(element).removeChild(dom(element).firstChild);
    }
  } else {
    for (var i in dom(element).childNodes) {
      if (
        typeof dom(element).childNodes[i] !== typeof void 0 &&
        dom(element).childNodes[i].slot === slot
      ) {
        dom(element).removeChild(dom(element).childNodes[i]);
      }
    }
  }
};
window.HaxStore.encapScript = html => {
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
window.HaxStore.toast = (message, duration = 3e3) => {
  window.HaxStore.instance.haxToast.duration = duration;
  window.HaxStore.instance.haxToast.show(message);
};
