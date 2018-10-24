import "@polymer/paper-tabs/paper-tabs.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/iron-pages/iron-pages.js";
import "./lrn-markdown-editor-editor.js";
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
        min-height: 10em;
      }

      .preview-pane {
        background: lightblue;
      }

      paper-card {
        padding: 1em;
        width: calc(100% - 2em);
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
        width: calc(100% - 2em);
        min-width: 150px;
        margin: 0 1em;
        padding: 0 1em;
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
    content: {
      type: String,
      notify: true
    },
    selected: {
      type: String,
      value: "0",
      reflectToAttribute: true
    },
    layout: {
      type: String,
      value: 0
    },
    cookies: {
      type: Boolean,
      value: true
    },
    elReady: {
      type: Boolean,
      value: false
    }
  },

  observers: ["_selectedChanged(selected)"],

  _selectedChanged: function(selected) {
    var root = this;
    var cookieName = root._getCookieName();
    // get current cookies
    // if the 'split-view' pane is selected
    if (selected === 2) {
      // add a cookie for lrn-markdown-editor-splitview
      root._createCookie(cookieName, "true", "30");
    } else if (selected !== 2 && root.elReady === true) {
      /**
       * @todo: this is erasing the cookie erroneously
       */
      root._eraseCookie(cookieName);
    }
  },

  _createCookie: function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },

  _readCookie: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
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
    // tell others we are ready
    root.elReady = true;
    // get the cookie for splitview
    var cookieName = root._getCookieName();
    var cookie = root._readCookie(cookieName);
    // if there is a cookie set for splitview
    if (cookie && cookie === "true") {
      // show splitview pane
      root.selected = 2;
    }
  }
});
