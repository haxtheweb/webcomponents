define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js",
  "./node_modules/@polymer/polymer/lib/utils/flush.js",
  "./node_modules/@polymer/polymer/lib/utils/async.js",
  "./node_modules/@polymer/paper-item/paper-item.js",
  "./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "./node_modules/@lrnwebcomponents/grid-plate/grid-plate.js",
  "./lib/hax-text-context.js",
  "./lib/hax-ce-context.js",
  "./lib/hax-plate-context.js",
  "./lib/hax-input-mixer.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _flattenedNodesObserver,
  _flush,
  async
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="hax-body">\n  <template strip-whitespace="">\n    <style>\n      :host {\n        display: block;\n        min-height: 32px;\n        min-width: 32px;\n        /*font-family: sans-serif;*/\n      }\n      :host #bodycontainer ::slotted(.hax-context-menu) {\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        visibility: hidden;\n        opacity: 0;\n        transition: all .3s ease;\n        z-index: 100;\n        float: left;\n        display: block;\n      }\n      :host #bodycontainer ::slotted(#haxinputmixer) {\n        z-index: 10000000;\n      }\n      :host #bodycontainer ::slotted(.hax-context-visible) {\n        visibility: visible;\n        opacity: 1;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {\n        outline: none;\n        transition:\n          .6s width ease-in-out,\n          .6s height ease-in-out,\n          .6s margin ease-in-out;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(p):empty {\n        background: #f8f8f8;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):hover {\n        outline: 1px dotted #d3d3d3;\n        outline-offset: 2px;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(* [data-editable]):hover {\n        outline: 1px dotted #d3d3d3;\n        outline-offset: 2px;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):before {\n        content: \'\';\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        width: 32px;\n        transition: .6s all ease;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):hover:before {\n        content: \'\';\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        width: 32px;\n        transition: .6s all ease;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*.hax-active[data-editable]) {\n        cursor: text !important;\n        outline: 1px dashed #c3c3c3 !important;\n        outline-offset: 4px;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] .hax-active) {\n        cursor: text !important;\n        outline: 1px dashed #c3c3c3 !important;\n        outline-offset: 4px;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*.hax-active[data-editable]):before {\n        content: \'\';\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        width: 32px;\n        transition: .6s all ease;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(code.hax-active[data-editable]) {\n        display: block;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(hr[data-editable]) {\n        height:4px;\n        background-color: #EEEEEE;\n        padding-top: 8px;\n        padding-bottom: 8px;\n      }\n      /** Fix to support safari as it defaults to none */\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {\n        -webkit-user-select: text;\n        cursor:pointer;\n      }\n\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]::-moz-selection),\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] *::-moz-selection) {\n        background-color: var(--hax-body-highlight, --paper-yellow-300);\n        color: black;\n      }\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]::selection),\n      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] *::selection) {\n        background-color: var(--hax-body-highlight, --paper-yellow-300);\n        color: black;\n      }\n      #bodycontainer {\n        -webkit-user-select: text;\n        user-select: text;\n      }\n\n      #contextcontainer {\n        display: none;\n      }\n      :host([edit-mode])[hax-ray-mode] #bodycontainer ::slotted(*[data-editable]) {\n        outline: 1px dashed #d3d3d3;\n        outline-offset: 4px;\n      }\n      :host([edit-mode])[hax-ray-mode] #bodycontainer ::slotted(*[data-editable]):before {\n        content: attr(data-hax-ray) " " attr(resource) " " attr(typeof) " " attr(property) " " attr(content);\n        font-size: 10px;\n        font-style: italic;\n        left: unset;\n        right: unset;\n        top: unset;\n        background-color: #d3d3d3;\n        color: #000000;\n        bottom: unset;\n        width: auto;\n        padding: 8px;\n        margin: 0;\n        z-index: 1;\n        margin: -16px 0 0 0;\n        float: left;\n        line-height: 2;\n      }\n    </style>\n    <div id="bodycontainer" class="ignore-activation">\n      <slot id="body"></slot>\n    </div>\n    <div id="contextcontainer">\n      <hax-text-context id="textcontextmenu" class="hax-context-menu ignore-activation"></hax-text-context>\n      <hax-ce-context id="cecontextmenu" class="hax-context-menu ignore-activation"></hax-ce-context>\n      <hax-plate-context id="platecontextmenu" class="hax-context-menu ignore-activation"></hax-plate-context>\n      <hax-input-mixer id="haxinputmixer" class="hax-context-menu ignore-activation"></hax-input-mixer>\n    </div>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="esc" on-keys-pressed="_escKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="del backspace" on-keys-pressed="_delKeyPressed"></iron-a11y-keys>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="shift+tab" on-keys-pressed="_tabBackKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="tab" on-keys-pressed="_tabKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="up" on-keys-pressed="_upKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>\n    <iron-a11y-keys target="[[activeContainerNode]]" keys="down" on-keys-pressed="_downKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>\n\n  </template>\n\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "hax-body",
    listeners: {
      focusin: "_focusIn",
      mousedown: "_focusIn",
      "hax-context-item-selected": "_haxContextOperation",
      "hax-input-mixer-update": "_haxInputMixerOperation",
      "place-holder-replace": "replacePlaceholder"
    },
    behaviors: [simpleColorsBehaviors],
    properties: {
      editMode: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        observer: "_editModeChanged"
      },
      globalPreferences: {
        type: Object,
        value: {},
        observer: "_globalPreferencesUpdated"
      },
      haxRayMode: { type: Boolean, value: !1, reflectToAttribute: !0 },
      activeNode: {
        type: Object,
        value: null,
        notify: !0,
        observer: "_activeNodeChanged"
      },
      activeContainerNode: {
        type: Object,
        value: null,
        notify: !0,
        observer: "_activeContainerNodeChanged"
      }
    },
    ready: function ready() {
      var _this = this;
      this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
      this._observer = new _flattenedNodesObserver.FlattenedNodesObserver(
        this,
        function(info) {
          (0, _flush.flush)();
          if (0 < info.addedNodes.length) {
            info.addedNodes.map(function(node) {
              if (_this._haxElementTest(node)) {
                if (_this._HTMLPrimativeTest(node)) {
                  node.contentEditable = _this.editMode;
                }
                node.setAttribute("data-editable", _this.editMode);
                node.setAttribute("data-hax-ray", node.tagName);
                _this.fire("hax-body-tag-added", { node: node });
              }
            });
          }
          if (0 < info.removedNodes.length) {
            info.removedNodes.map(function(node) {
              if (
                _this._haxElementTest(node) &&
                !node.classList.contains("hax-active")
              ) {
                _this.fire("hax-body-tag-removed", { node: node });
              }
            });
          }
        }
      );
    },
    attached: function attached() {
      this.__tabTrap = !1;
      this.fire("hax-register-body", this);
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.addEventListener(
        "selectstart",
        this._selectionChange.bind(this)
      );
      document.body.addEventListener(
        "mouseup",
        this._selectionMouseUp.bind(this)
      );
      window.addEventListener("scroll", this._keepContextVisible.bind(this));
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.removeEventListener(
        "selectstart",
        this._selectionChange.bind(this)
      );
      document.body.removeEventListener(
        "mouseup",
        this._selectionMouseUp.bind(this)
      );
      window.removeEventListener("scroll", this._keepContextVisible.bind(this));
    },
    _keepContextVisible: function _keepContextVisible() {
      var el = !1;
      if (this.$.textcontextmenu.classList.contains("hax-context-visible")) {
        el = this.$.textcontextmenu;
      } else if (
        this.$.cecontextmenu.classList.contains("hax-context-visible")
      ) {
        el = this.$.cecontextmenu;
      }
      if (el) {
        if (this.elementInViewport(el)) {
          el.classList.remove("hax-context-pin-bottom");
          el.classList.remove("hax-context-pin-top");
        } else {
          if (this.__OffBottom) {
            el.classList.add("hax-context-pin-top");
          } else {
            el.classList.add("hax-context-pin-bottom");
          }
        }
      }
    },
    elementInViewport: function elementInViewport(el) {
      var top =
          el.offsetTop -
          32 -
          window.HaxStore.instance.haxPanel.$.drawer.offsetHeight,
        left = el.offsetLeft,
        width = el.offsetWidth,
        height = el.offsetHeight;
      while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }
      this.__OffBottom = top < window.pageYOffset + window.innerHeight;
      return (
        top < window.pageYOffset + window.innerHeight &&
        left < window.pageXOffset + window.innerWidth &&
        top + height > window.pageYOffset &&
        left + width > window.pageXOffset
      );
    },
    _selectionChange: function _selectionChange() {
      window.__startedSelection = !0;
    },
    _selectionMouseUp: function _selectionMouseUp() {
      if (window.__startedSelection && this.editMode) {
        try {
          var selection = window.getSelection(),
            range = selection.getRangeAt(0),
            newRange = range.cloneRange();
          window.__startedSelection = !1;
          if (
            "HAX-BODY" ===
              newRange.startContainer.parentNode.parentNode.parentElement
                .tagName ||
            "HAX-BODY" ===
              newRange.startContainer.parentNode.parentElement.tagName
          ) {
            window.HaxStore.write("activePlaceHolder", newRange, this);
          }
        } catch (err) {}
      }
    },
    replacePlaceholder: function replacePlaceholder(e) {
      var _this2 = this;
      if ("text" === e.detail) {
        var p = document.createElement("p");
        this.haxReplaceNode(
          this.activeNode,
          p,
          (0, _polymerDom.dom)(this.activeNode).parentNode
        );
        setTimeout(function() {
          window.HaxStore.write("activeNode", p, _this2);
          p.focus();
        }, 100);
      } else {
        this.replaceElementWorkflow();
      }
    },
    replaceElementWorkflow: function replaceElementWorkflow() {
      var element = window.HaxStore.nodeToHaxElement(this.activeNode, null),
        type = "*",
        skipPropMatch = !1;
      if (
        "place-holder" === element.tag &&
        babelHelpers.typeof(element.properties.type) !== "undefined"
      ) {
        type = element.properties.type;
        skipPropMatch = !0;
      }
      var props = {};
      if (
        babelHelpers.typeof(
          window.HaxStore.instance.elementList[element.tag]
        ) !== "undefined" &&
        !1 !== window.HaxStore.instance.elementList[element.tag].gizmo &&
        babelHelpers.typeof(
          window.HaxStore.instance.elementList[element.tag].gizmo.handles
        ) !== "undefined" &&
        0 <
          window.HaxStore.instance.elementList[element.tag].gizmo.handles.length
      ) {
        for (
          var gizmo = window.HaxStore.instance.elementList[element.tag].gizmo,
            i = 0;
          i < gizmo.handles.length;
          i++
        ) {
          for (var prop in gizmo.handles[i]) {
            if (
              "type" !== prop &&
              babelHelpers.typeof(
                element.properties[gizmo.handles[i][prop]]
              ) !== "undefined"
            ) {
              props[prop] = element.properties[gizmo.handles[i][prop]];
            }
          }
        }
      }
      var haxElements = window.HaxStore.guessGizmo(type, props, skipPropMatch);
      if (0 < haxElements.length) {
        var tag = this.activeNode.tagName.toLowerCase(),
          humanName = tag.replace("-", " ");
        if (
          babelHelpers.typeof(window.HaxStore.instance.elementList[tag]) !==
            "undefined" &&
          !1 !== window.HaxStore.instance.elementList[tag].gizmo
        ) {
          humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
        }
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          "__convert",
          "Transform ".concat(humanName, " to.."),
          "gizmo"
        );
      } else {
        window.HaxStore.toast("Sorry, this can not be transformed!", 5e3);
      }
    },
    _globalPreferencesUpdated: function _globalPreferencesUpdated(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined" && null != newValue) {
        this.haxRayMode = newValue.haxRayMode;
      }
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !== "undefined" &&
        e.detail.property
      ) {
        if ("object" === babelHelpers.typeof(e.detail.value)) {
          this.set(e.detail.property, null);
        }
        this.set(e.detail.property, e.detail.value);
      }
    },
    haxClearBody: function haxClearBody() {
      var confirm =
          0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : !0,
        status = !0;
      if (confirm) {
        status = prompt("Are you sure you want to delete all content?");
      }
      if (status) {
        window.HaxStore.wipeSlot(this);
      }
    },
    haxInsert: function haxInsert(tag, content) {
      var _this3 = this,
        properties =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : {},
        tags = window.HaxStore.instance.validTagList;
      if (tags.includes(tag)) {
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
              !newNode.properties[property].readOnly
            ) {
              newNode.set(attributeName, properties[property]);
            } else if (
              null != properties[property] &&
              properties[property].constructor === Object &&
              !newNode.properties[property].readOnly
            ) {
              newNode.set(attributeName, properties[property]);
            } else {
              newNode.setAttribute(attributeName, properties[property]);
            }
          }
        }
        if (
          null !== window.HaxStore.instance.activePlaceHolder &&
          babelHelpers.typeof(
            window.HaxStore.instance.activePlaceHolder.style
          ) !== "undefined"
        ) {
          newNode.style.width =
            window.HaxStore.instance.activePlaceHolder.style.width;
          newNode.style.float =
            window.HaxStore.instance.activePlaceHolder.style.float;
          newNode.style.margin =
            window.HaxStore.instance.activePlaceHolder.style.margin;
          newNode.style.display =
            window.HaxStore.instance.activePlaceHolder.style.display;
          this.haxReplaceNode(
            window.HaxStore.instance.activePlaceHolder,
            newNode,
            (0, _polymerDom.dom)(window.HaxStore.instance.activePlaceHolder)
              .parentNode
          );
          window.HaxStore.instance.activePlaceHolder = null;
        } else if (null !== this.activeContainerNode) {
          if (
            "GRID-PLATE" !== newNode.tagName &&
            "GRID-PLATE" === this.activeContainerNode.tagName &&
            this.activeContainerNode !== this.activeNode
          ) {
            newNode.setAttribute("slot", this.activeNode.getAttribute("slot"));
            (0, _polymerDom.dom)(this.activeContainerNode).insertBefore(
              newNode,
              this.activeNode
            );
          } else {
            (0, _polymerDom.dom)(this).insertBefore(
              newNode,
              this.activeContainerNode.nextElementSibling
            );
          }
        } else {
          (0, _polymerDom.dom)(this).appendChild(newNode);
        }
        this.$.textcontextmenu.highlightOps = !1;
        setTimeout(function() {
          window.HaxStore.write("activeContainerNode", newNode, _this3);
          window.HaxStore.write("activeNode", newNode, _this3);
          newNode.focus();
          if ("function" === typeof newNode.scrollIntoViewIfNeeded) {
            newNode.scrollIntoViewIfNeeded(!0);
          } else {
            newNode.scrollIntoView({ behavior: "smooth", inline: "center" });
          }
        }, 100);
        return !0;
      }
      return !1;
    },
    haxToContent: function haxToContent() {
      this.hideContextMenus();
      var __active = this.activeNode;
      window.HaxStore.write("activeNode", null, this);
      window.HaxStore.write("activeContainerNode", null, this);
      var children = (0, _polymerDom.dom)(this.$.body).getDistributedNodes();
      if (this.globalPreferences.haxDeveloperMode) {
        console.log(children);
      }
      for (var content = "", i = 0, len = children.length; i < len; i++) {
        if (this._haxElementTest(children[i])) {
          children[i].removeAttribute("data-editable");
          children[i].removeAttribute("data-hax-ray");
          children[i].contentEditable = !1;
          content += window.HaxStore.haxNodeToContent(children[i]);
          if ("grid-plate" === children[i].tagName.toLowerCase()) {
            this._applyContentEditable(this.editMode, children[i]);
          }
        } else if (8 === children[i].nodeType) {
          content += "<!-- " + children[i].textContent + " -->";
        } else if (
          1 !== children[i].nodeType &&
          babelHelpers.typeof(children[i].textContent) !== "undefined" &&
          "undefined" !== children[i].textContent
        ) {
          content += children[i].textContent;
        }
      }
      content = content.replace(/\scontenteditable=\"false\"/g, "");
      content = content.replace(/\sdata-editable=\"true\"/g, "");
      content = content.replace(/\sdata-editable=\"false\"/g, "");
      content = content.replace(/\sdata-editable=\""/g, "");
      content = content.replace(/\sdata-editable/g, "");
      content = content.replace(/\scontenteditable/g, "");
      content = content.replace(/\sdraggable/g, "");
      content = content.replace(/\sdata-draggable/g, "");
      content = content.replace(/\sdata-hax-ray=\".*?\"/g, "");
      var parentTag = this.parentNode.tagName.toLowerCase(),
        string = "style-scope " + parentTag + " x-scope",
        re = new RegExp(string, "g");
      content = content.replace(re, "");
      string = "style-scope " + parentTag;
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      string = "x-scope " + parentTag + "-0";
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      var tags = window.HaxStore.instance.validTagList;
      tags.push("hax-preview");
      for (var i in tags) {
        string = "style-scope " + tags[i];
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0 ";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
      }
      content = content.replace(/\sclass=\"\"/g, "");
      content = content.replace(/\sclass=\"\s\"/g, "");
      this._applyContentEditable(this.editMode);
      window.HaxStore.write("activeNode", __active, this);
      window.HaxStore.write("activeContainerNode", __active, this);
      content = window.HaxStore.encapScript(content);
      if (this.globalPreferences.haxDeveloperMode) {
        console.log(content);
      }
      return content;
    },
    haxDuplicateNode: function haxDuplicateNode(node) {
      var _this4 = this,
        parent =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : this;
      this.hideContextMenus();
      var nodeClone = (0, _polymerDom.dom)(node).cloneNode(!0);
      if (
        "webview" === nodeClone.tagName.toLowerCase() &&
        window.HaxStore.instance._isSandboxed &&
        babelHelpers.typeof(nodeClone.guestinstance) !== "undefined"
      ) {
        delete nodeClone.guestinstance;
      }
      if (null !== node) {
        (0, _polymerDom.dom)(parent).insertBefore(
          nodeClone,
          (0, _polymerDom.dom)(node).nextSibling
        );
      } else {
        (0, _polymerDom.dom)(parent).appendChild(nodeClone);
      }
      setTimeout(function() {
        if (parent === _this4) {
          window.HaxStore.write("activeContainerNode", nodeClone, _this4);
        }
        window.HaxStore.write("activeNode", nodeClone, _this4);
      }, 100);
      return !0;
    },
    hideContextMenus: function hideContextMenus() {
      this._hideContextMenu(this.$.textcontextmenu);
      this._hideContextMenu(this.$.cecontextmenu);
      this._hideContextMenu(this.$.platecontextmenu);
      this._hideContextMenu(this.$.haxinputmixer);
      this.$.textcontextmenu.highlightOps = !1;
    },
    positionContextMenus: function positionContextMenus(node, container) {
      var tag = node.tagName.toLowerCase();
      if (window.HaxStore.instance._isSandboxed && "webview" === tag) {
        tag = "iframe";
      }
      var props = window.HaxStore.instance.elementList[tag],
        w = Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        ),
        offsetmenu = -39,
        offsetplate = -31;
      if (800 > w) {
        offsetmenu = 0;
        offsetplate = 0;
      }
      if (babelHelpers.typeof(props) !== "undefined" && "P" !== node.tagName) {
        this.__activeContextType = this.$.cecontextmenu;
        props.element = node;
        this.__activeContextType.setHaxProperties(props);
      } else {
        this.__activeContextType = this.$.textcontextmenu;
      }
      this._positionContextMenu(
        this.__activeContextType,
        container,
        offsetmenu,
        -37
      );
      this._positionContextMenu(
        this.$.platecontextmenu,
        container,
        offsetplate,
        0,
        !1
      );
      if (!this._HTMLPrimativeTest(node) && node !== container) {
        container.contentEditable = !1;
      } else if (this._HTMLPrimativeTest(container)) {
        container.contentEditable = !0;
      }
    },
    haxMoveGridPlate: function haxMoveGridPlate(direction, node, container) {
      this.hideContextMenus();
      switch (direction) {
        case "first":
          if (null !== container.previousElementSibling) {
            (0, _polymerDom.dom)(this).insertBefore(
              container,
              (0, _polymerDom.dom)(this).firstChild
            );
          }
          break;
        case "up":
          if (null !== container.previousElementSibling) {
            (0, _polymerDom.dom)(this).insertBefore(
              container,
              container.previousElementSibling
            );
          }
          break;
        case "down":
          if (null !== container.nextElementSibling) {
            (0, _polymerDom.dom)(this).insertBefore(
              container.nextElementSibling,
              container
            );
          }
          break;
        case "last":
          if (null !== container.nextElementSibling) {
            (0, _polymerDom.dom)(this).appendChild(container);
          }
          break;
      }
      this.positionContextMenus(node, container);
      setTimeout(function() {
        if ("function" === typeof container.scrollIntoViewIfNeeded) {
          container.scrollIntoViewIfNeeded(!0);
        } else {
          container.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
      }, 250);
      return !0;
    },
    haxReplaceNode: function haxReplaceNode(node, replacement) {
      var parent =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : this;
      this.hideContextMenus();
      try {
        if (null != node.getAttribute("slot")) {
          replacement.setAttribute("slot", node.getAttribute("slot"));
        }
        (0, _polymerDom.dom)(parent).replaceChild(replacement, node);
      } catch (e) {
        console.log(e);
      }
      return replacement;
    },
    haxChangeTagName: function haxChangeTagName(node, tagName) {
      this.hideContextMenus();
      for (
        var replacement = document.createElement(tagName),
          i = 0,
          l = node.attributes.length;
        i < l;
        ++i
      ) {
        var nodeName = node.attributes.item(i).nodeName,
          value = node.attributes.item(i).value;
        replacement.setAttribute(nodeName, value);
      }
      replacement.innerHTML = node.innerHTML;
      (0, _polymerDom.dom)(this).replaceChild(replacement, node);
      return replacement;
    },
    haxDeleteNode: function haxDeleteNode(node) {
      var parent =
        1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : this;
      this.hideContextMenus();
      if (
        null != this.activeContainerNode &&
        null !== this.activeContainerNode.previousElementSibling
      ) {
        this.activeContainerNode.previousElementSibling.focus();
        if (
          null != this.activeContainerNode &&
          window.HaxStore.instance.isTextElement(this.activeContainerNode) &&
          "" !== (0, _polymerDom.dom)(this.activeContainerNode).textContent
        ) {
          try {
            var range = document.createRange(),
              sel = window.getSelection();
            range.setStart(this.activeContainerNode, 1);
            range.collapse(!0);
            sel.removeAllRanges();
            sel.addRange(range);
            this.activeContainerNode.focus();
          } catch (e) {
            console.log(e);
          }
        }
      } else if (
        null != this.activeContainerNode &&
        null !== this.activeContainerNode.nextElementSibling
      ) {
        this.activeContainerNode.nextElementSibling.focus();
      } else {
        window.HaxStore.write("activeContainerNode", null, this);
        window.HaxStore.write("activeNode", null, this);
      }
      try {
        return (0, _polymerDom.dom)(parent).removeChild(node);
      } catch (e) {
        console.log(e);
      }
    },
    importContent: function importContent(html) {
      var _this5 = this,
        clear =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !0;
      if (clear) {
        window.HaxStore.wipeSlot(this, "*");
      }
      setTimeout(function() {
        html = window.HaxStore.encapScript(html);
        var validTags = window.HaxStore.instance.validTagList,
          fragment = document.createElement("div");
        fragment.insertAdjacentHTML("beforeend", html);
        while (null !== fragment.firstChild) {
          if (
            babelHelpers.typeof(fragment.firstChild.tagName) !== "undefined" &&
            validTags.includes(fragment.firstChild.tagName.toLowerCase())
          ) {
            if (
              window.HaxStore.instance._isSandboxed &&
              "iframe" === fragment.firstChild.tagName.toLowerCase()
            ) {
              for (
                var replacement = document.createElement("webview"),
                  j = 0,
                  l = fragment.firstChild.attributes.length;
                j < l;
                ++j
              ) {
                var nodeName = fragment.firstChild.attributes.item(j).nodeName,
                  value = fragment.firstChild.attributes.item(j).value;
                if ("height" === nodeName || "width" === nodeName) {
                  replacement.style[nodeName] == value;
                }
                replacement.setAttribute(nodeName, value);
              }
              (0, _polymerDom.dom)(_this5).appendChild(replacement);
            } else {
              (0, _polymerDom.dom)(_this5).appendChild(fragment.firstChild);
            }
          } else {
            fragment.removeChild(fragment.firstChild);
          }
        }
      }, 200);
    },
    _haxContextOperation: function _haxContextOperation(e) {
      var _this6 = this,
        detail = e.detail,
        haxElement;
      switch (detail.eventName) {
        case "p":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
        case "code":
        case "blockquote":
          this.$.textcontextmenu.selectedValue = detail.eventName;
          window.HaxStore.write(
            "activeContainerNode",
            this.haxChangeTagName(this.activeContainerNode, detail.eventName),
            this
          );
          break;
        case "text-align-left":
          this.activeNode.style.textAlign = null;
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          break;
        case "text-align-right":
          this.activeNode.style.textAlign = "right";
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          break;
        case "grid-plate-convert":
          this.replaceElementWorkflow();
          break;
        case "grid-plate-duplicate":
          if (this.activeNode === this.activeContainerNode) {
            this.haxDuplicateNode(this.activeNode);
          } else {
            this.haxDuplicateNode(this.activeNode, this.activeContainerNode);
          }
          break;
        case "grid-plate-delete":
          var tag = this.activeNode.tagName.toLowerCase(),
            humanName = tag.replace("-", " ");
          if (
            babelHelpers.typeof(window.HaxStore.instance.elementList[tag]) !==
              "undefined" &&
            !1 !== window.HaxStore.instance.elementList[tag].gizmo
          ) {
            humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
          }
          window.HaxStore.instance.haxAppPicker.presentOptions(
            [
              { icon: "thumb-up", color: "green", title: "Yes" },
              { icon: "thumb-down", color: "red", title: "No" }
            ],
            "",
            "Remove this `".concat(humanName, "`?"),
            "delete"
          );
          break;
        case "grid-plate-first":
          this.haxMoveGridPlate(
            "first",
            this.activeNode,
            this.activeContainerNode
          );
          break;
        case "grid-plate-up":
          this.haxMoveGridPlate(
            "up",
            this.activeNode,
            this.activeContainerNode
          );
          break;
        case "hax-manager-open":
          window.HaxStore.write("activeHaxElement", {}, this);
          window.HaxStore.instance.haxManager.resetManager(
            parseInt(detail.value)
          );
          window.HaxStore.instance.haxManager.toggleDialog();
          break;
        case "grid-plate-down":
          this.haxMoveGridPlate(
            "down",
            this.activeNode,
            this.activeContainerNode
          );
          break;
        case "grid-plate-last":
          this.haxMoveGridPlate(
            "last",
            this.activeNode,
            this.activeContainerNode
          );
          break;
        case "close-menu":
          window.HaxStore.write("activeContainerNode", null, this);
          window.HaxStore.write("activeNode", null, this);
          break;
        case "hax-edit-property":
          var haxInputMixer = this.$.haxinputmixer;
          haxInputMixer.label = detail.target.label;
          haxInputMixer.options = detail.target.options;
          haxInputMixer.icon = detail.target.icon;
          haxInputMixer.description = detail.target.description;
          haxInputMixer.required = detail.target.required;
          haxInputMixer.validation = detail.target.validation;
          haxInputMixer.validationType = detail.target.validationType;
          haxInputMixer.inputMethod = detail.target.inputMethod;
          haxInputMixer.value = "";
          if (
            babelHelpers.typeof(detail.target.propertyToBind) !== "undefined" &&
            null != detail.target.propertyToBind &&
            !1 != detail.target.propertyToBind
          ) {
            haxInputMixer.propertyToBind = detail.target.propertyToBind;
            if (
              babelHelpers.typeof(
                this.activeNode[detail.target.propertyToBind]
              ) !== "undefined"
            ) {
              haxInputMixer.value = this.activeNode[
                detail.target.propertyToBind
              ];
            } else {
              haxInputMixer.value = this.activeNode.getAttribute(
                detail.target.propertyToBind
              );
            }
          }
          this._positionContextMenu(
            haxInputMixer,
            this.$.cecontextmenu,
            -6,
            -116
          );
          haxInputMixer.style.width = null;
          break;
        case "hax-align-left":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = null;
          this.activeNode.style.display = null;
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          break;
        case "hax-align-center":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = "0 auto";
          this.activeNode.style.display = "block";
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          break;
        case "hax-align-right":
          this.activeNode.style.float = "right";
          this.activeNode.style.margin = null;
          this.activeNode.style.display = null;
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          break;
        case "hax-size-change":
          this.activeNode.style.width = detail.value + "%";
          setTimeout(function() {
            _this6.positionContextMenus(
              _this6.activeNode,
              _this6.activeContainerNode
            );
          }, 1e3);
          break;
        case "hax-manager-configure":
          this._hideContextMenu(this.$.haxinputmixer);
          window.HaxStore.instance.haxManager.resetManager();
          haxElement = window.HaxStore.nodeToHaxElement(
            window.HaxStore.instance.activeNode
          );
          window.HaxStore.write("activeHaxElement", haxElement, this);
          window.HaxStore.instance.haxManager.editExistingNode = !0;
          window.HaxStore.instance.haxManager.selectStep("configure");
          window.HaxStore.instance.haxManager.toggleDialog();
          setTimeout(function() {
            window.HaxStore.instance.haxManager.$.preview.$.configurebutton.focus();
          }, 100);
          break;
        case "hax-manager-configure-container":
          window.HaxStore.write(
            "activeNode",
            window.HaxStore.instance.activeContainerNode,
            this
          );
          this._hideContextMenu(this.$.haxinputmixer);
          window.HaxStore.instance.haxManager.resetManager();
          haxElement = window.HaxStore.nodeToHaxElement(
            window.HaxStore.instance.activeNode
          );
          window.HaxStore.write("activeHaxElement", haxElement, this);
          window.HaxStore.instance.haxManager.editExistingNode = !0;
          window.HaxStore.instance.haxManager.selectStep("configure");
          window.HaxStore.instance.haxManager.toggleDialog();
          setTimeout(function() {
            window.HaxStore.instance.haxManager.$.preview.$.configurebutton.focus();
          }, 100);
          break;
      }
    },
    _haxInputMixerOperation: function _haxInputMixerOperation(e) {
      var mixer = e.detail.inputMixer;
      if (null != mixer.propertyToBind) {
        this.activeNode[mixer.propertyToBind] = mixer.value;
      } else if (null != mixer.slotToBind) {
        item = document.createElement("span");
        item.style.height = "inherit";
        item.innerHTML = mixer.value;
        item.slot = mixer.slotToBind;
        this.activeNode.appendChild(item);
      }
      this._hideContextMenu(this.$.haxinputmixer);
    },
    _focusIn: function _focusIn(e) {
      var _this7 = this;
      if (this.editMode && !this.__tabTrap) {
        var normalizedEvent = (0, _polymerDom.dom)(e),
          local = normalizedEvent.localTarget,
          tags = window.HaxStore.instance.validTagList,
          containerNode = local,
          activeNode = null;
        if (
          this._haxElementTest(containerNode) &&
          null != containerNode.parentNode
        ) {
          while ("HAX-BODY" != containerNode.parentNode.tagName) {
            if (
              null === activeNode &&
              tags.includes(containerNode.tagName.toLowerCase()) &&
              "LI" !== containerNode.tagName &&
              "B" !== containerNode.tagName &&
              "I" !== containerNode.tagName &&
              "STRONG" !== containerNode.tagName &&
              "EM" !== containerNode.tagName
            ) {
              activeNode = containerNode;
            }
            containerNode = containerNode.parentNode;
          }
          if (null === activeNode) {
            activeNode = containerNode;
          } else if (
            !window.HaxStore.instance.isGridPlateElement(containerNode)
          ) {
            activeNode = containerNode;
          } else if (
            ["UL", "OL", "LI", "P", "GRID-PLATE"].includes(
              containerNode.tagName
            ) &&
            ["UL", "OL", "LI"].includes(activeNode.tagName)
          ) {
            activeNode = containerNode;
          }
          if (
            this.activeContainerNode !== containerNode &&
            tags.includes(containerNode.tagName.toLowerCase()) &&
            !containerNode.classList.contains("ignore-activation")
          ) {
            window.HaxStore.write("activeContainerNode", containerNode, this);
            e.stopPropagation();
          } else if (containerNode.classList.contains("ignore-activation")) {
            e.stopPropagation();
          }
          if (
            this.activeNode !== activeNode &&
            tags.includes(containerNode.tagName.toLowerCase()) &&
            !activeNode.classList.contains("ignore-activation")
          ) {
            setTimeout(function() {
              window.HaxStore.write("activeNode", activeNode, _this7);
            }, 50);
            e.stopPropagation();
          }
        }
      } else {
        this.__tabTrap = !1;
      }
    },
    _editModeChanged: function _editModeChanged(newValue, oldValue) {
      if (babelHelpers.typeof(oldValue) !== "undefined") {
        this._applyContentEditable(newValue);
        if (
          !1 !== newValue &&
          babelHelpers.typeof(this.activeNode) !== "undefined" &&
          null !== this.activeNode
        ) {
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
        }
      }
      if (!1 === newValue) {
        this.hideContextMenus();
      }
    },
    _haxResolvePreviousElement: function _haxResolvePreviousElement(node) {
      node = (0, _polymerDom.dom)(node).previousElementSibling;
      while (
        babelHelpers.typeof(node.tagName) !== "undefined" &&
        "HAX-" === node.tagName.substring(0, 4)
      ) {
        node = (0, _polymerDom.dom)(node).previousElementSibling;
      }
      return node;
    },
    _haxElementTest: function _haxElementTest(node) {
      if (
        babelHelpers.typeof(node.tagName) !== "undefined" &&
        "HAX-" !== node.tagName.substring(0, 4)
      ) {
        return !0;
      }
      return !1;
    },
    _HTMLPrimativeTest: function _HTMLPrimativeTest(node) {
      if (
        babelHelpers.typeof(node.tagName) !== "undefined" &&
        -1 == node.tagName.indexOf("-")
      ) {
        return !0;
      }
      return !1;
    },
    _applyContentEditable: function _applyContentEditable(status) {
      var target =
          1 < arguments.length && arguments[1] !== void 0
            ? arguments[1]
            : this.$.body,
        children = (0, _polymerDom.dom)(target).getDistributedNodes();
      if (0 === children.length) {
        children = (0, _polymerDom.dom)(target).getEffectiveChildNodes();
      }
      for (var i = 0, len = children.length; i < len; i++) {
        if (this._HTMLPrimativeTest(children[i])) {
          children[i].contentEditable = status;
        }
        if (this._haxElementTest(children[i])) {
          if (status) {
            children[i].setAttribute("data-editable", status);
            children[i].setAttribute("data-hax-ray", children[i].tagName);
          } else {
            children[i].removeAttribute("data-editable");
            children[i].removeAttribute("data-hax-ray");
          }
        }
      }
    },
    _activeContainerNodeChanged: function _activeContainerNodeChanged(
      newValue
    ) {
      if (
        this.editMode &&
        babelHelpers.typeof(newValue) !== "undefined" &&
        null !== newValue
      ) {
        var tag = newValue.tagName.toLowerCase();
        if ("grid-plate" === tag) {
          newValue.editMode = this.editMode;
          this._applyContentEditable(this.editMode, newValue);
        }
      }
    },
    _activeNodeChanged: function _activeNodeChanged(newValue, oldValue) {
      var _this8 = this;
      if (babelHelpers.typeof(oldValue) !== "undefined" && null != oldValue) {
        oldValue.classList.remove("hax-active");
      }
      if (
        this.editMode &&
        babelHelpers.typeof(newValue) !== "undefined" &&
        null !== newValue
      ) {
        var tag = newValue.tagName.toLowerCase();
        newValue.classList.add("hax-active");
        this.$.textcontextmenu.selectedValue = tag;
        setTimeout(function() {
          _this8.positionContextMenus(
            newValue,
            window.HaxStore.instance.activeContainerNode
          );
        }, 25);
        if ("right" == newValue.style.textAlign) {
          this.$.textcontextmenu.justifyIcon = "editor:format-align-right";
          this.$.textcontextmenu.justifyValue = "text-align-right";
        } else if ("left" == newValue.style.textAlign) {
          this.$.textcontextmenu.justifyIcon = "editor:format-align-left";
          this.$.textcontextmenu.justifyValue = "text-align-left";
        } else if ("left" == newValue.style.float) {
          this.$.cecontextmenu.justifyIcon = "editor:format-align-left";
          this.$.cecontextmenu.justifyValue = "hax-align-left";
        } else if ("right" == newValue.style.float) {
          this.$.cecontextmenu.justifyIcon = "editor:format-align-right";
          this.$.cecontextmenu.justifyValue = "hax-align-right";
        } else if ("0 auto" == newValue.style.margin) {
          this.$.cecontextmenu.justifyIcon = "editor:format-align-center";
          this.$.cecontextmenu.justifyValue = "hax-align-center";
        }
      } else if (null === newValue) {
        this.hideContextMenus();
        this.$.textcontextmenu.justifyIcon = "editor:format-align-left";
        this.$.textcontextmenu.justifyValue = "text-align-left";
      }
    },
    _positionContextMenu: function _positionContextMenu(
      menu,
      target,
      xoffset,
      yoffset
    ) {
      var matchStyle =
        4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : !0;
      try {
        (0, _polymerDom.dom)(this).insertBefore(menu, target);
      } catch (err) {
        try {
          (0, _polymerDom.dom)(target.parentNode).insertBefore(menu, target);
        } catch (err2) {}
      }
      if (matchStyle) {
        menu.style.width = target.style.width;
      }
      var style = target.currentStyle || window.getComputedStyle(target);
      if (0 != parseInt(style.marginLeft)) {
        xoffset = xoffset + parseInt(style.marginLeft);
      } else {
        xoffset = xoffset + parseInt(target.offsetLeft) - this.offsetLeft;
      }
      if (null != xoffset) {
        menu.style["margin-left"] = xoffset + "px";
      }
      if (null != yoffset) {
        menu.style["margin-top"] = yoffset + "px";
      }
      menu.classList.add("hax-context-visible");
      async.microTask.run(this._keepContextVisible());
    },
    _hideContextMenu: function _hideContextMenu(menu) {
      menu.classList.remove("hax-context-visible");
      menu.classList.remove("hax-context-pin-top");
      menu.classList.remove("hax-context-pin-bottom");
      (0, _polymerDom.dom)(this.$.contextcontainer).appendChild(menu);
    },
    _escKeyPressed: function _escKeyPressed(e) {
      if (this.editMode) {
        e.preventDefault();
        e.stopPropagation();
        if (this.$.textcontextmenu.highlightOps) {
          this.$.textcontextmenu.highlightOps = !1;
          window.HaxStore.write("activeNode", this.activeContainerNode, this);
          this.activeContainerNode.focus();
        } else if (this.activeNode === this.activeContainerNode) {
          window.HaxStore.write("activeContainerNode", null, this);
          window.HaxStore.write("activeNode", null, this);
          document.body.focus();
        } else {
          window.HaxStore.write("activeNode", this.activeContainerNode, this);
          this.activeContainerNode.focus();
        }
      }
    },
    _delKeyPressed: function _delKeyPressed(e) {
      var _this9 = this;
      if (this.editMode) {
        var activeNodeTextContent = (0, _polymerDom.dom)(
          this.activeContainerNode
        ).textContent;
        if ("" === activeNodeTextContent) {
          e.preventDefault();
          e.stopPropagation();
          this.haxDeleteNode(this.activeContainerNode);
        } else if (
          window.HaxStore.instance.isTextElement(
            this._haxResolvePreviousElement(this.activeContainerNode)
          )
        ) {
          var selection = window.getSelection(),
            range = selection.getRangeAt(0).cloneRange(),
            tagTest = range.commonAncestorContainer.tagName;
          if (babelHelpers.typeof(tagTest) === "undefined") {
            tagTest = range.commonAncestorContainer.parentNode.tagName;
          }
          if (
            0 === range.startOffset &&
            0 === range.endOffset &&
            !["UL", "OL", "LI"].includes(tagTest)
          ) {
            e.preventDefault();
            e.stopPropagation();
            while (this.activeContainerNode.firstChild) {
              this._haxResolvePreviousElement(
                this.activeContainerNode
              ).appendChild(this.activeContainerNode.firstChild);
            }
            setTimeout(function() {
              _this9.haxDeleteNode(_this9.activeContainerNode);
            }, 100);
          }
        }
      }
    },
    _upKeyPressed: function _upKeyPressed() {
      if (
        this.editMode &&
        "" === (0, _polymerDom.dom)(this.activeContainerNode).textContent
      ) {
        var node = this._haxResolvePreviousElement(this.activeContainerNode);
        try {
          node.focus();
        } catch (e) {}
      }
    },
    _downKeyPressed: function _downKeyPressed() {
      if (
        this.editMode &&
        "" === (0, _polymerDom.dom)(this.activeContainerNode).textContent
      ) {
        var node = (0, _polymerDom.dom)(this.activeContainerNode);
        try {
          node.nextElementSibling.focus();
        } catch (e) {}
      }
    },
    _tabKeyPressed: function _tabKeyPressed(e) {
      if (this.editMode) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var focus = !1,
          node = this.activeContainerNode,
          activeNodeTagName = this.activeContainerNode.tagName;
        try {
          var selection = window.getSelection(),
            range = selection.getRangeAt(0).cloneRange(),
            tagTest = range.commonAncestorContainer.tagName;
          if (babelHelpers.typeof(tagTest) === "undefined") {
            tagTest = range.commonAncestorContainer.parentNode.tagName;
          }
          if (
            ["UL", "OL", "LI"].includes(activeNodeTagName) ||
            ["UL", "OL", "LI"].includes(tagTest)
          ) {
            if (this.polyfillSafe) {
              document.execCommand("indent");
              this.__tabTrap = !0;
            }
          } else {
            while (!focus) {
              if (null == (0, _polymerDom.dom)(node).nextSibling) {
                focus = !0;
              } else if (
                "function" === (0, _polymerDom.dom)(node).nextSibling.focus
              ) {
                (0, _polymerDom.dom)(node).nextSibling.focus();
                focus = !0;
              } else {
                node = (0, _polymerDom.dom)(node).nextSibling;
              }
            }
          }
        } catch (e) {}
      }
    },
    _tabBackKeyPressed: function _tabBackKeyPressed(e) {
      if (this.editMode) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var node = (0, _polymerDom.dom)(this.activeContainerNode)
            .previousSibling,
          activeNodeTagName = this.activeContainerNode.tagName,
          selection = window.getSelection();
        try {
          var range = selection.getRangeAt(0).cloneRange();
          if (
            ["UL", "OL", "LI"].includes(activeNodeTagName) ||
            ["UL", "OL", "LI"].includes(
              range.commonAncestorContainer.parentElement.tagName
            )
          ) {
            if (this.polyfillSafe) {
              document.execCommand("outdent");
              this.__tabTrap = !0;
            }
          } else {
            if (null != node) {
              while (null != node && !this._haxElementTest(node)) {
                node = (0, _polymerDom.dom)(node).previousSibling;
              }
            }
            if (null != node) {
              setTimeout(function() {
                node.focus();
              }, 100);
            }
          }
        } catch (e) {}
      }
    }
  });
});
