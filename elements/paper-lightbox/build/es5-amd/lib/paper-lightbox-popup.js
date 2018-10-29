define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js"
], function(
  _polymerLegacy,
  async,
  _ironIcons,
  _ironAjax,
  _ironResizableBehavior
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_e1599680db3311e8923997103a686534() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>:host{display:block}:host::content .paper-lightbox-popup{position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;overflow:auto;text-align:center}:host::content .paper-lightbox-popup::before{content:\'\';display:inline-block;vertical-align:middle;width:0;height:100%}:host::content .paper-lightbox-popup_overlay{position:fixed;background-color:#000;width:100%;height:100%;top:0;left:0;opacity:.6;z-index:0}:host::content .paper-lightbox-popup_window{position:relative;display:inline-block;vertical-align:middle;padding:25px;margin:40px 0 20px;background-color:#fff;max-width:70%;height:auto;text-align:left;box-sizing:border-box;z-index:1}@media (max-width:568px){:host::content .paper-lightbox-popup_window{max-width:100%;margin:25px;padding:15px}}:host::content .paper-lightbox-popup_window .paper-lightbox_iframeWrapper{position:relative;padding-top:60%}:host::content .paper-lightbox-popup_window-image img{vertical-align:top;max-width:100%}:host::content .paper-lightbox-popup_window-iframe{width:70%;height:auto;max-width:1024px}@media (max-width:568px){:host::content .paper-lightbox-popup_window-iframe{width:calc(100% - 50px);margin:25px}}:host::content .paper-lightbox-popup_window-iframe iframe{position:absolute;width:100%;height:100%;top:0;left:0}:host::content .paper-lightbox-popup_close{position:absolute;left:0;top:0;width:18px;height:18px;padding:8px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background-color:#fff;border-radius:100px;cursor:pointer;-webkit-filter:drop-shadow(0 1px 2px rgba(0, 0, 0, .4));filter:drop-shadow(0 1px 2px rgba(0, 0, 0, .4))}</style>\n    <template is="dom-if" if="{{ _isAjax(type) }}">\n      <iron-ajax auto="auto" url="{{ src }}" handle-as="text" on-response="_ajaxResponse"></iron-ajax>\n    </template>\n    <slot></slot>\n'
    ]);
    _templateObject_e1599680db3311e8923997103a686534 = function() {
      return data;
    };
    return data;
  }
  (function() {
    (0, _polymerLegacy.Polymer)({
      _template: (0, _polymerLegacy.html)(
        _templateObject_e1599680db3311e8923997103a686534()
      ),
      is: "paper-lightbox-popup",
      behaviors: [_ironResizableBehavior.IronResizableBehavior],
      listeners: { "iron-resize": "_onResize" },
      _createPopup: function _createPopup() {
        var e, t, n, o;
        if (
          ((n = this),
          this._removeBackgroundFocus(),
          (this.container = document.createElement("div")),
          this.container.classList.add("paper-lightbox-popup"),
          "ajax" !== this._getType() && this.container.classList.add("opening"),
          (e = document.createElement("iron-icon")),
          e.classList.add("paper-lightbox-popup_close"),
          e.setAttribute("icon", "icons:close"),
          e.setAttribute("tabindex", "0"),
          (n.window = document.createElement("div")),
          n.window.classList.add("paper-lightbox-popup_window"),
          n.window.appendChild(e),
          this.container.appendChild(n.window),
          (o = document.createElement("div")),
          o.classList.add("paper-lightbox-popup_overlay"),
          this.container.appendChild(o),
          n.appendChild(this.container),
          (t = document.querySelector(".paper-lightbox-lockScroll")),
          void 0 === t || null === t)
        )
          return n._removeScrolling();
      },
      _getImageRatio: function _getImageRatio(e, t) {
        var n;
        return (
          (n = this),
          e > t
            ? n.window.classList.add("landscape")
            : n.window.classList.add("portrait")
        );
      },
      _isAjax: function _isAjax(e) {
        var t;
        if (((t = this), "ajax" === e)) return !0;
      },
      _parseAjax: function _parseAjax(e) {
        var t, n;
        return (
          (n = this),
          (t = document.createElement("div")),
          (t.innerHTML = e),
          [].forEach.call(t.children, function(e) {
            return (
              n.window.appendChild(e), n.container.classList.add("opening")
            );
          })
        );
      },
      _ajaxResponse: function _ajaxResponse(e) {
        var t;
        return (
          (t = this),
          (t.ajaxResponse = e.target.lastResponse),
          this._createAjax()
        );
      },
      _createAjax: function _createAjax() {
        var e;
        return (
          (e = this),
          this._fireCustomEvents("onBeforeOpen"),
          this._createPopup(),
          this._parseAjax(e.ajaxResponse),
          e.window.classList.add("paper-lightbox-popup_window-ajax"),
          this._fireCustomEvents("onAfterOpen"),
          this._closePopupEvent()
        );
      },
      _createImage: function _createImage() {
        var e, t;
        return (
          (t = this),
          (e = new Image()),
          this._fireCustomEvents("onBeforeOpen"),
          (e.onload = function() {
            return (
              t._createPopup(),
              t._getImageRatio(e.naturalWidth, e.naturalHeight),
              t.window.classList.add("paper-lightbox-popup_window-image"),
              t.window.appendChild(e),
              t._onResize(),
              t._fireCustomEvents("onAfterOpen"),
              t._closePopupEvent()
            );
          }),
          (e.src = t.getAttribute("src"))
        );
      },
      _createIframe: function _createIframe() {
        var e, t, n, o, i;
        return (
          (n = this),
          (i = n.getAttribute("src")),
          (e = document.createElement("iframe")),
          (o = i.replace("/watch?v=", "/embed/")),
          e.setAttribute("frameborder", "0"),
          e.setAttribute("allowfullscreen", ""),
          this._fireCustomEvents("onBeforeOpen"),
          (t = document.createElement("div")),
          t.classList.add("paper-lightbox_iframeWrapper"),
          -1 < i.indexOf("youtube.com/watch?v=")
            ? e.setAttribute("src", o + "?autoplay=1")
            : e.setAttribute("src", i + "?autoplay=1"),
          this._createPopup(),
          n.window.classList.add("paper-lightbox-popup_window-iframe"),
          setTimeout(function() {
            return t.appendChild(e), n.window.appendChild(t);
          }, 100),
          this._fireCustomEvents("onAfterOpen"),
          this._closePopupEvent()
        );
      },
      _createInline: function _createInline() {
        var e, t;
        return (
          (t = this),
          (e = document.querySelector(t.getAttribute("src"))),
          this._fireCustomEvents("onBeforeOpen"),
          this._createPopup(),
          t.window.classList.add("paper-lightbox-popup_window-inline"),
          t.window.appendChild(e.cloneNode(!0)),
          this._fireCustomEvents("onAfterOpen"),
          this._closePopupEvent()
        );
      },
      _getType: function _getType() {
        var e;
        return (e = this), e.getAttribute("type");
      },
      _launchPopup: function _launchPopup() {
        var e;
        switch (((e = this), this._getType())) {
          case "image":
            return this._createImage();
          case "inline":
            return this._createInline();
          case "iframe":
            return this._createIframe();
        }
      },
      _removePopup: function _removePopup() {
        var e, t, n;
        return (
          (t = this),
          (n = this.container),
          (this.window = void 0),
          (e = 0),
          null !== t.getAttribute("closing") &&
            void 0 !== t.getAttribute("closing") &&
            (e = t.getAttribute("closing")),
          this._resetBackgroundFocus(),
          t.unlisten(document, "keyup", "_closeWithEsc"),
          this._fireCustomEvents("onBeforeClose"),
          n.classList.remove("opening"),
          setTimeout(function() {
            return n.classList.add("closing");
          }, 0),
          setTimeout(function() {
            return (
              t._addScrolling(),
              document.body.removeChild(t),
              t._fireCustomEvents("onAfterClose")
            );
          }, e)
        );
      },
      _closePopupEvent: function _closePopupEvent() {
        var e, t, n;
        return (
          (t = this),
          (n = t.querySelector(".paper-lightbox-popup_overlay")),
          (e = t.querySelector(".paper-lightbox-popup_close")),
          t.listen(n, "tap", "_removePopup"),
          t.listen(e, "tap", "_removePopup"),
          (t._closeWithEsc = function(e) {
            var n;
            if (((n = e.which || e.keyCode), 27 === n)) return t._removePopup();
          }),
          t.listen(document, "keyup", "_closeWithEsc"),
          e.addEventListener("keypress", function(e) {
            var n;
            if (((n = e.which || e.keyCode), 13 === n)) return t._removePopup();
          })
        );
      },
      _addScrolling: function _addScrolling() {
        var e, t, n;
        for (
          e = document.documentElement,
            e.classList.remove("lock"),
            t = document.querySelector(".paper-lightbox-lockScroll"),
            n = t.children,
            t.style.height = "",
            e.style.height = "",
            document.body.style.height = "",
            t.style.overflow = "";
          t.firstElementChild;

        ) {
          document.body.appendChild(t.firstElementChild);
        }
        return (
          (document.body.scrollTop = this.bodyScroll),
          document.body.removeChild(t),
          (document.body.style.overflow = "")
        );
      },
      _removeScrolling: function _removeScrolling() {
        var e, t, n, o;
        for (
          this.bodyScroll = document.body.scrollTop,
            n = document.documentElement,
            n.classList.add("lock"),
            o = document.createElement("div"),
            o.classList.add("paper-lightbox-lockScroll"),
            e = document.body.children,
            t = e.length,
            o.style.height = "100%",
            n.style.height = "100%",
            document.body.style.height = "100%",
            o.style.overflow = "hidden";
          document.body.firstElementChild;

        ) {
          if (
            (o.appendChild(document.body.firstElementChild),
            o.children.length === t)
          )
            return (
              document.body.appendChild(o), void (o.scrollTop = this.bodyScroll)
            );
        }
      },
      _removeBackgroundFocus: function _removeBackgroundFocus() {
        var e, t;
        return (
          (t =
            "a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]"),
          (e = document.querySelectorAll(t)),
          [].forEach.call(e, function(e) {
            return (e.oldTabIndex = e.tabIndex), (e.tabIndex = -1);
          })
        );
      },
      _resetBackgroundFocus: function _resetBackgroundFocus() {
        var e, t;
        return (
          (t =
            "a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]"),
          (e = document.querySelectorAll(t)),
          [].forEach.call(e, function(e) {
            return (e.tabIndex = e.oldTabIndex);
          })
        );
      },
      _defineCustomEvents: function _defineCustomEvents() {
        var e, t, n;
        return (
          (n = this),
          (e = [
            "onBeforeOpen",
            "onAfterOpen",
            "onBeforeClose",
            "onAfterClose"
          ]),
          (t = e.length),
          [].forEach.call(e, function(e) {
            return (
              (n[e] = void 0),
              document.createEvent
                ? ((n[e] = document.createEvent("HTMLEvents")),
                  n[e].initEvent(e.toLowerCase(), !0, !0))
                : ((n.e = document.createEventObject()),
                  (n.e.eventType = e.toLowerCase())),
              (n[e].eventName = e.toLowerCase())
            );
          })
        );
      },
      _fireCustomEvents: function _fireCustomEvents(e) {
        var t;
        return (
          (t = this),
          void 0 === t[e] && t._defineCustomEvents(),
          document.createEvent
            ? t.dispatchEvent(t[e])
            : t.fireEvent("on" + t[e].eventType, t[e])
        );
      },
      _onResize: function _onResize() {
        var e;
        if (this.window && this.window.classList.contains("portrait"))
          return (
            (e = this.window.querySelector("img")),
            (e.style.maxHeight = 0.8 * window.innerHeight + "px")
          );
      },
      ready: function ready() {
        var e;
        return (
          (e = this),
          async.microTask.run(function() {
            return setTimeout(function() {
              return e._defineCustomEvents(), e._onLoad();
            });
          })
        );
      },
      _onLoad: function _onLoad() {
        return this._launchPopup();
      }
    });
  }.call(window));
});
