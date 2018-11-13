define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js"
], function(_polymerLegacy, async) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_25469f20e70811e8b8162940bf613550() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        min-height: 80vh;\n      }\n      main {\n        transition: opacity 1s linear, visibility .6s linear;\n        width: 100%;\n        max-width: 640px;\n        margin: 0 auto;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n        opacity: 1;\n        visibility: visible;\n      }\n      @media only screen and (max-width: 800px) {\n        main {\n          padding: 0 32px;\n        }\n      }\n      article {\n        padding: 40px 0;\n      }\n      section {\n        width: 100%;\n        font-family: Linux Libertine;\n        color: #333;\n      }\n      section ::slotted(*) {\n        font-weight: 400;\n        font-style: normal;\n        font-size: 22px;\n        line-height: 30px;\n        margin: 0;\n        padding-bottom: 30px;\n        color: #333;\n        -webkit-hyphens: auto;\n        -moz-hyphens: auto;\n        hyphens: auto;\n      }\n      :host([has-image]) .article-image {\n        position: absolute;\n        background-color: var(--haxcms-color, black);\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        overflow: hidden;\n      }\n      .post-image-image {\n        background-size: cover;\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        padding-top: 33%;\n        z-index: 1;\n      }\n      .post-meta {\n        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;\n        padding-top: 60px;\n      }\n      :host([has-image]) .post-meta {\n        position: absolute;\n        bottom: 80px;\n        left: 30%;\n        right: 30%;\n        z-index: 9;\n        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n      }\n      .post-title {\n        font-weight: 700;\n        font-style: normal;\n        letter-spacing: -.04em;\n        font-size: 50px;\n        line-height: 1.1;\n        color: black;\n      }\n      :host([has-image]) .post-title {\n        color: white;\n        margin-bottom: 16px;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      /**\n       * Hide the slotted content during edit mode\n       */\n      :host([edit-mode]) #slot {\n        display: none;\n      }\n    </style>\n    <main>\n      <article>\n        <div class="article-image">\n        <template is="dom-if" if="[[hasImage]]">\n          <div id="image" class="post-image-image" style$="background-image: url(&quot;[[activeItem.metadata.image]]&quot;);"></div>\n        </template>\n          <div class="post-meta">\n            <h1 class="post-title">[[activeItem.title]]</h1>\n          </div>\n        </div>\n        <section id="contentcontainer">\n          <div id="slot">\n            <slot></slot>\n          </div>\n        </section>\n      </article>\n    </main>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        min-height: 80vh;\n      }\n      main {\n        transition: opacity 1s linear, visibility .6s linear;\n        width: 100%;\n        max-width: 640px;\n        margin: 0 auto;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n        opacity: 1;\n        visibility: visible;\n      }\n      @media only screen and (max-width: 800px) {\n        main {\n          padding: 0 32px;\n        }\n      }\n      article {\n        padding: 40px 0;\n      }\n      section {\n        width: 100%;\n        font-family: Linux Libertine;\n        color: #333;\n      }\n      section ::slotted(*) {\n        font-weight: 400;\n        font-style: normal;\n        font-size: 22px;\n        line-height: 30px;\n        margin: 0;\n        padding-bottom: 30px;\n        color: #333;\n        -webkit-hyphens: auto;\n        -moz-hyphens: auto;\n        hyphens: auto;\n      }\n      :host([has-image]) .article-image {\n        position: absolute;\n        background-color: var(--haxcms-color, black);\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        overflow: hidden;\n      }\n      .post-image-image {\n        background-size: cover;\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        padding-top: 33%;\n        z-index: 1;\n      }\n      .post-meta {\n        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;\n        padding-top: 60px;\n      }\n      :host([has-image]) .post-meta {\n        position: absolute;\n        bottom: 80px;\n        left: 30%;\n        right: 30%;\n        z-index: 9;\n        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n      }\n      .post-title {\n        font-weight: 700;\n        font-style: normal;\n        letter-spacing: -.04em;\n        font-size: 50px;\n        line-height: 1.1;\n        color: black;\n      }\n      :host([has-image]) .post-title {\n        color: white;\n        margin-bottom: 16px;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      /**\n       * Hide the slotted content during edit mode\n       */\n      :host([edit-mode]) #slot {\n        display: none;\n      }\n    </style>\n    <main>\n      <article>\n        <div class="article-image">\n        <template is="dom-if" if="[[hasImage]]">\n          <div id="image" class="post-image-image" style\\$="background-image: url(&quot;[[activeItem.metadata.image]]&quot;);"></div>\n        </template>\n          <div class="post-meta">\n            <h1 class="post-title">[[activeItem.title]]</h1>\n          </div>\n        </div>\n        <section id="contentcontainer">\n          <div id="slot">\n            <slot></slot>\n          </div>\n        </section>\n      </article>\n    </main>\n'
      ]
    );
    _templateObject_25469f20e70811e8b8162940bf613550 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_25469f20e70811e8b8162940bf613550()
    ),
    is: "simple-blog-post",
    properties: {
      activeItem: { type: Object, notify: !0 },
      hasImage: {
        type: Boolean,
        computed: "_computeHasImage(activeItem)",
        observer: "_hasImageChanged",
        reflectToAttribute: !0
      },
      editMode: { type: Boolean, reflectToAttribute: !0, value: !1 }
    },
    ready: function ready() {
      window.addEventListener("scroll", this._scrollListener.bind(this));
    },
    detached: function detached() {
      window.removeEventListener("scroll", this._scrollListener.bind(this));
    },
    _scrollListener: function _scrollListener() {
      if (this.hasImage) {
        var top =
          (window.pageYOffset || document.scrollTop) -
          (document.clientTop || 0);
        if (0 > top || 1500 < top) {
          return;
        }
        this.shadowRoot.querySelector("#image").style.transform =
          "translate3d(0px, " + top / 3 + "px, 0px)";
        this.shadowRoot.querySelector("#image").style.opacity =
          1 - Math.max(top / 700, 0);
      }
    },
    _hasImageChanged: function _hasImageChanged(newValue) {
      var _this = this;
      if (newValue) {
        async.microTask.run(function() {
          var rect = _this.shadowRoot
            .querySelector("#image")
            .getBoundingClientRect();
          _this.$.contentcontainer.style.paddingTop = rect.height + "px";
        });
      } else {
        this.$.contentcontainer.style.paddingTop = null;
      }
    },
    _computeHasImage: function _computeHasImage(activeItem) {
      if (
        babelHelpers.typeof(activeItem.metadata) !== "undefined" &&
        babelHelpers.typeof(activeItem.metadata.image) !== "undefined"
      ) {
        return !0;
      }
      return !1;
    }
  });
});
