import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "../node_modules/@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
import "./hax-context-item-textop.js";
import "./hax-toolbar.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        pointer-events: none;
        background-color: white;
      }
      paper-item {
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        height: 32px;
        padding: 0 8px;
        min-height: 32px;
      }
      paper-item:hover {
        background-color: #d3d3d3;
        cursor: pointer;
      }
      iron-icon {
        padding: 8px;
      }
      paper-item strong {
        padding: 8px;
        font-size: 12px;
      }
      :host(.hax-context-pin-top) hax-toolbar {
        position: fixed;
        top: 64px;
        opacity: .95;
      }
      :host(.hax-context-pin-bottom) hax-toolbar {
        position: fixed;
        bottom: 0;
        opacity: .95;
      }
    </style>
    <hax-toolbar selected="[[selection]]" hide-transform="">
      <hax-context-item-menu corner="left" slot="primary" selected-value="{{selectedValue}}" id="formatsize" icon="text-format" label="Format" event-name="text-tag">
        <paper-item value="p"><iron-icon icon="editor:format-textdirection-l-to-r"></iron-icon>Normal text <strong>&lt;P&gt;</strong></paper-item>
        <paper-item value="h2"><iron-icon icon="editor:title"></iron-icon>Title <strong>&lt;H2&gt;</strong></paper-item>
        <paper-item value="h3"><iron-icon icon="editor:title"></iron-icon>Content heading <strong>&lt;H3&gt;</strong></paper-item>
        <paper-item value="h4"><iron-icon icon="editor:text-fields"></iron-icon>Subheading <strong>&lt;H4&gt;</strong></paper-item>
        <paper-item value="h5"><iron-icon icon="editor:text-fields"></iron-icon>Deeper subheading <strong>&lt;H5&gt;</strong></paper-item>
        <paper-item value="blockquote"><iron-icon icon="editor:format-quote"></iron-icon>Quote<strong>&lt;blockquote&gt;</strong></paper-item>
        <paper-item value="code"><iron-icon icon="icons:code"></iron-icon>Code block<strong>&lt;code&gt;</strong></paper-item>
      </hax-context-item-menu>
      <hax-context-item-textop slot="primary" icon="editor:format-bold" label="Bold" event-name="text-bold"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-italic" label="Italic" event-name="text-italic"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:insert-link" label="Link" event-name="text-link"></hax-context-item-textop>
      <hax-context-item-menu slot="primary" selected-value="{{justifyValue}}" id="justify" icon="[[justifyIcon]]" label="Alignment">
        <paper-item value="" hidden=""></paper-item>
        <paper-item value="text-align-left">
          <iron-icon icon="editor:format-align-left"></iron-icon>
        </paper-item>
        <paper-item value="text-align-right">
          <iron-icon icon="editor:format-align-right"></iron-icon>
        </paper-item>
      </hax-context-item-menu>
      <hax-context-item-textop slot="primary" icon="editor:format-list-numbered" label="Numbered list" event-name="text-list-numbered" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-list-bulleted" label="Bulleted list" event-name="text-list-bulleted" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-indent-increase" label="Indent" event-name="text-indent" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-indent-decrease" label="Outdent" event-name="text-outdent" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-clear" label="Remove format" event-name="text-remove-format"></hax-context-item-textop>
      <hax-context-item slot="primary" icon="device:graphic-eq" label="Advanced item" event-name="insert-inline-gizmo"></hax-context-item>
      <hax-context-item-textop menu="" slot="more" icon="mdextra:unlink" event-name="text-unlink">Remove link</hax-context-item-textop>
      <hax-context-item-textop menu="" slot="more" icon="mdextra:subscript" event-name="text-subscript">Subscript</hax-context-item-textop>
      <hax-context-item-textop menu="" slot="more" icon="mdextra:superscript" event-name="text-superscript">Superscript</hax-context-item-textop>
      <hax-context-item-textop menu="" slot="more" icon="editor:format-strikethrough" event-name="text-strikethrough">Cross out</hax-context-item-textop>
    </hax-toolbar>
`,
  is: "hax-text-context",
  listeners: { "hax-context-item-selected": "_haxContextOperation" },
  properties: {
    justifyIcon: { type: String, value: "editor:format-align-left" },
    polyfillSafe: { type: Boolean },
    selectedValue: { type: String, value: "p", notify: !0 },
    justifyValue: { type: String, value: "text-align-left", notify: !0 },
    selection: { type: Boolean, value: !1 }
  },
  ready: function() {
    this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
  },
  _haxContextOperation: function(e) {
    let detail = e.detail,
      selection = window.getSelection();
    switch (detail.eventName) {
      case "text-align-left":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-align-center":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-align-right":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-justify-full":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "close-menu":
        this.$.justify.$.menu.hideMenu();
        this.$.formatsize.$.menu.hideMenu();
        break;
      case "insert-inline-gizmo":
        if (null != window.HaxStore.instance.activePlaceHolder) {
          let values = {
              text: window.HaxStore.instance.activePlaceHolder.toString()
            },
            type = "inline",
            haxElements = window.HaxStore.guessGizmo(type, values);
          if (0 < haxElements.length) {
            window.HaxStore.instance.haxAppPicker.presentOptions(
              haxElements,
              type,
              "Transform selected text to..",
              "gizmo"
            );
          }
        }
        break;
      case "text-bold":
        document.execCommand("bold");
        break;
      case "text-italic":
        document.execCommand("italic");
        break;
      case "text-underline":
        document.execCommand("underline");
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-subscript":
        document.execCommand("subscript");
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-superscript":
        document.execCommand("superscript");
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-remove-format":
        document.execCommand("removeFormat");
        break;
      case "text-strikethrough":
        document.execCommand("strikeThrough");
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-link":
        var href = "";
        if (typeof selection.focusNode.parentNode.href !== typeof void 0) {
          href = selection.focusNode.parentNode.href;
        }
        let url = prompt("Enter a URL:", href);
        if (url) {
          document.execCommand("createLink", !1, url);
        }
        break;
      case "text-unlink":
        document.execCommand("unlink");
        break;
      case "text-indent":
        document.execCommand("indent");
        break;
      case "text-outdent":
        document.execCommand("outdent");
        break;
      case "text-list-numbered":
        document.execCommand("insertOrderedList");
        break;
      case "text-list-bulleted":
        document.execCommand("insertUnorderedList");
        break;
    }
  },
  isSafari: function() {
    let ua = navigator.userAgent.toLowerCase();
    if (-1 != ua.indexOf("safari")) {
      if (!(-1 < ua.indexOf("chrome"))) {
        return !0;
      }
    }
    return !1;
  }
});
