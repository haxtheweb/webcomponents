import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "./node_modules/@polymer/polymer/lib/utils/async.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "./lib/paper-lightbox-popup.js";
(function() {
  Polymer({
    _template: html`
    <style>:host{display:block}:host::content .paper-lightbox-popup{position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;overflow:auto;text-align:center}:host::content .paper-lightbox-popup:before{content:'';display:inline-block;vertical-align:middle;width:0;height:100%}:host::content .paper-lightbox-popup_overlay{position:fixed;background-color:#000;width:100%;height:100%;top:0;left:0;opacity:.6;z-index:0}:host::content .paper-lightbox-popup_window{position:relative;display:inline-block;vertical-align:middle;padding:25px;margin:40px 0 20px;background-color:#fff;max-width:70%;height:auto;text-align:left;box-sizing:border-box;z-index:1}@media (max-width:568px){:host::content .paper-lightbox-popup_window{max-width:100%;margin:25px;padding:15px}}:host::content .paper-lightbox-popup_window .paper-lightbox_iframeWrapper{position:relative;padding-top:60%}:host::content .paper-lightbox-popup_window-image img{vertical-align:top;max-width:100%}:host::content .paper-lightbox-popup_window-iframe{width:70%;height:auto;max-width:1024px}@media (max-width:568px){:host::content .paper-lightbox-popup_window-iframe{width:calc(100% - 50px);margin:25px}}:host::content .paper-lightbox-popup_window-iframe iframe{position:absolute;width:100%;height:100%;top:0;left:0}:host::content .paper-lightbox-popup_close{position:absolute;left:0;top:0;width:18px;height:18px;padding:8px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background-color:#fff;border-radius:100px;cursor:pointer;-webkit-filter:drop-shadow(0 1px 2px rgba(0, 0, 0, .4));filter:drop-shadow(0 1px 2px rgba(0, 0, 0, .4))}</style>
    <paper-button raised="raised">
      <slot></slot>
    </paper-button>
`,
    is: "paper-lightbox",
    ready: function() {
      var t;
      return (
        (t = this),
        async.microTask.run(() => {
          return setTimeout(function() {
            return t._onLoad();
          });
        })
      );
    },
    _createPopup: function() {
      var t;
      return (
        (t = document.createElement("paper-lightbox-popup")),
        t.setAttribute("type", this.getAttribute("type")),
        t.setAttribute("src", this.getAttribute("src")),
        t.setAttribute("closing", this.getAttribute("closing")),
        t.setAttribute("class", this.getAttribute("class")),
        document.body.appendChild(t)
      );
    },
    _onLoad: function() {
      var t;
      return (
        (t = this),
        t.listen(
          t.shadowRoot.querySelector("paper-button"),
          "tap",
          "_createPopup"
        )
      );
    },
    open: function() {
      return this._createPopup();
    },
    close: function() {
      var t;
      return (
        (t = document.querySelector("paper-lightbox-popup")), t._removePopup()
      );
    }
  });
}.call(window));
