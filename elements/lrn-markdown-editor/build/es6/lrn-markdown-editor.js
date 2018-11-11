import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-tabs/paper-tabs.js";
import "./node_modules/@polymer/marked-element/marked-element.js";
import "./node_modules/@polymer/iron-pages/iron-pages.js";
import "./lib/lrn-markdown-editor-editor.js";
Polymer({
  _template: html`
    <style>
       :host {
        display: block;
      }

      #split-pane {
        display: flex;
      }

      .split-pane>* {
        flex: 1 1 auto;
        min-height: 160px;
      }

      .preview-pane {
        background: lightblue;
      }

      paper-card {
        padding: 16px;
        width: calc(100% - 32px);
      }

      paper-tabs {
        background: #F5F5F5;
        border-style: solid;
        border-color: #DCDCDC;
        border-width: 1px;
        min-width: 500px;
      }

      marked-element.lrn-markdown-editor {
        width: 100%;
        word-wrap: break-word;
      }

      .container-flex {
        display: flex;
        flex-wrap: nowrap;
      }

      .split-pane .container-flex>* {
        width: 50%;
      }

      .split-pane marked-element {
        width: calc(100% - 32px);
        min-width: 150px;
        margin: 0 16px;
        padding: 0 16px;
        background: #FFF;
        border-left: solid #DCDCDC 1px;
      }
    </style>

    <div class="mtz-toolbar">
      <paper-tabs selected="{{selected}}">
        <paper-tab>Write</paper-tab>
        <paper-tab>Preview</paper-tab>
        <paper-tab>Split View</paper-tab>
      </paper-tabs>
    </div>

    <iron-pages selected="{{selected}}">

      <section>
        <paper-card>
          <lrn-markdown-editor-editor content="{{content}}"></lrn-markdown-editor-editor>
        </paper-card>
      </section>

      <section>
        <paper-card>
          <marked-element markdown="{{content}}"></marked-element>
        </paper-card>
      </section>

      <section class="split-pane">
        <paper-card>
          <div class="container-flex">
            <lrn-markdown-editor-editor content="{{content}}"></lrn-markdown-editor-editor>
            <marked-element class="preview-pane" markdown="{{content}}"></marked-element>
          </div>
        </paper-card>
      </section>

    </iron-pages>
`,
  is: "lrn-markdown-editor",
  properties: {
    content: { type: String, notify: !0 },
    selected: { type: String, value: "0", reflectToAttribute: !0 },
    layout: { type: String, value: 0 },
    cookies: { type: Boolean, value: !0 },
    elReady: { type: Boolean, value: !1 }
  },
  observers: ["_selectedChanged(selected)"],
  _selectedChanged: function(selected) {
    var root = this,
      cookieName = root._getCookieName();
    if (2 === selected) {
      root._createCookie(cookieName, "true", "30");
    } else if (2 !== selected && !0 === root.elReady) {
      root._eraseCookie(cookieName);
    }
  },
  _createCookie: function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + 1e3 * (60 * (60 * (24 * days))));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },
  _readCookie: function(name) {
    for (
      var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0, c;
      i < ca.length;
      i++
    ) {
      c = ca[i];
      while (" " == c.charAt(0)) c = c.substring(1, c.length);
      if (0 == c.indexOf(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  _eraseCookie: function(name) {
    this._createCookie(name, "", -1);
  },
  _getCookieName: function() {
    return "lrnmarkdowneditorsplitview";
  },
  ready: function() {
    var root = this;
    root.elReady = !0;
    var cookieName = root._getCookieName(),
      cookie = root._readCookie(cookieName);
    if (cookie && "true" === cookie) {
      root.selected = 2;
    }
  }
});
