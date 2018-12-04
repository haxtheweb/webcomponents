import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "../../node_modules/@polymer/polymer/lib/utils/async.js";
import "../../node_modules/@polymer/iron-icons/iron-icons.js";
import "../../node_modules/@polymer/iron-icons/hardware-icons.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../../node_modules/@polymer/paper-styles/color.js";
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@lrnwebcomponents/grid-plate/grid-plate.js";
import "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";
import "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";
import "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
      :host([loading]) #content {
        opacity: .2;
      }
      #content {
        opacity: 1;
        visibility: visible;
        transition: all .4s ease;
      }
    </style>
    <div id="hackycontainer"><style id="hackycsspotterhates"></style></div>
    <iron-ajax
      id="fulloutlinepath"
      url="[[fullOutlinePath]]"
      handle-as="json"
      on-response="handleOutlineResponse"
      last-response="{{outlineData}}"></iron-ajax>
    <iron-ajax
      id="pageajax"
      params="[[requestParams]]"
      url="[[sourcePath]]"
      handle-as="json"
      on-response="handleResponse"
      last-response="{{pageData}}"
      loading="{{_loading}}"></iron-ajax>
    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route
      route="{{route}}"
      pattern="[[endPoint]]/:type/:id"
      data="{{data}}"
      tail="{{tail}}"
      query-params="{{queryParams}}">
    </app-route>
    <main id="etb-tool-nav" data-offcanvas="">
      <div id="anchor"></div>
      <div class="inner-wrap">
        <section class="main-section etb-book" style="min-height: 318px;">
          <h2 class="element-invisible">Content navigation</h2>
          <div class="r-header row">
            <div class="r-header__left">
              <div class="book-navigation-header book-sibling-nav-container book-navigation-header-2">
                <div class="book-navigation-header book-sibling-nav-container book-navigation-header-<?php print $count ?>">
                  <lrnsys-dialog id="outlinepopover" data-voicecommand="open outline" class="black-text" hover-class="grey darken-3 white-text" label="Outline" header="Outline">
                    <span slot="button">
                      <iron-icon icon="explore"></iron-icon>
                      Outline
                    </span>
                    <div class="elmsln-modal-content" id="block-mooc-helper-mooc-helper-toc-nav-modal">
                      <div id="outlinemodal" on-tap="_modalTap"><slot name="outlinemodal"></slot></div>
                    </div>
                  </lrnsys-dialog>
                  <div id="navigation"><slot name="navigation"></slot></div>
                </div>
              </div>
            </div>
            <div id="options" class="r-header__right">
              <slot name="options"></slot>
            </div>
          </div>
          <div class="elmsln-content-wrap" role="main">
          <responsive-grid-row gutter="4">
            <responsive-grid-col xl="3" lg="3" md="3" sm="4" xs="12">
              <section id="block-mooc-nav-block-mooc-nav-nav" class="mooc-nav-block-left block block-mooc-nav-block contextual-links-region block-mooc-nav-block-mooc-nav column" role="navigation" aria-label$="[[outlineTitle]]">
                <div class="block-mooc-nav-block-mooc-title black white-text">[[outlineTitle]]</div>
                <div id="outline"><slot name="outline"></slot></div>
              </section>
              <div id="blocks"><slot name="blocks"></slot></div>
            </responsive-grid-col>
            <responsive-grid-col xl="8" lg="8" md="9" sm="7" xs="12">
              <a id="main-content" class="scrollspy" data-scrollspy="scrollspy"></a>
              <div class="column">
                <div id="content"><slot name="content"></slot></div>
              </div>
            </responsive-grid-col>
          </responsive-grid-row>
        </section>
        <a class="exit-off-canvas"></a>
      </div>
    </main>`,
  is: "mooc-content",
  observers: ["_routeChanged(data, route, endPoint)"],
  properties: {
    sourcePath: { type: String },
    fullOutlinePath: { type: String },
    route: { type: Object, notify: !0 },
    currentTitle: { type: String },
    requestParams: { type: Object, notify: !0, value: { node: null } },
    pageData: { type: Object, value: {} },
    outlineData: { type: Object, value: {} },
    resetScroll: { type: Boolean, value: !1 },
    responseData: { type: Object, value: {} },
    basePath: { type: String },
    elmslnCourse: { type: String },
    outlineTitle: { type: String },
    nid: { type: Number },
    _loading: { type: Boolean, observer: "_contentLoading", value: !1 },
    loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
    aliases: { type: Array },
    activeNodeItem: { type: Object, value: null }
  },
  _modalTap: function _modalTap(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget;
    if ("LRNSYS-BUTTON" === local.tagName) {
      if (null != this.activeNodeItem) {
        this.activeNodeItem.classList.remove("book-menu-item-active");
      }
      this.activeNodeItem = local;
      this.activeNodeItem.classList.add("book-menu-item-active");
      this.$.outlinepopover.toggleDialog();
    }
  },
  _contentLoading: function _contentLoading(newValue, oldValue) {
    var _this = this;
    if (
      ("undefined" === typeof newValue ? "undefined" : typeof newValue) !==
        ("undefined" === typeof void 0 ? "undefined" : typeof void 0) &&
      !newValue
    ) {
      setTimeout(function() {
        _this.loading = !1;
        _this._resetScroll("anchor");
        _this.$["main-content"].focus();
      }, 500);
    } else {
      this.loading = !0;
    }
  },
  handleResponse: function handleResponse(e) {
    if (
      typeof this.pageData.data !==
      ("undefined" === typeof void 0 ? "undefined" : typeof void 0)
    ) {
      var data = this.pageData.data;
      if (
        typeof data.ops.redirect !==
        ("undefined" === typeof void 0 ? "undefined" : typeof void 0)
      ) {
        this.set("route.path", data.ops.redirect);
        this._routeChanged(this.data, this.route, this.endPoint);
      } else {
        this.outlineTitle = data.bookOutline.subject;
        this.$.content.innerHTML = data.content;
        this.$.navigation.innerHTML = data.topNavigation;
        this.$.outline.innerHTML = data.bookOutline.content;
        this.$.options.innerHTML = data.options;
        this.__injectStyle(data.styles);
        window.Drupal.attachBehaviors(document, window.Drupal.settings);
        if (
          typeof this.outlineData.data ===
          ("undefined" === typeof void 0 ? "undefined" : typeof void 0)
        ) {
          this.$.fulloutlinepath.generateRequest();
        }
        async.microTask.run(() => {
          window.dispatchEvent(new Event("resize"));
        });
      }
    }
  },
  handleOutlineResponse: function handleOutlineResponse(e) {
    var data = this.outlineData.data;
    if (
      ("undefined" === typeof data ? "undefined" : typeof data) !==
      ("undefined" === typeof void 0 ? "undefined" : typeof void 0)
    ) {
      this.$.outlinemodal.innerHTML = data.outline;
      this.aliases = data.aliases;
    }
  },
  _routeChanged: function _routeChanged(data, route, endPoint) {
    if ("string" === typeof route.path) {
      var urlAlias = route.path.replace("/" + this.elmslnCourse + "/", "");
      if (route.path.startsWith("/" + this.elmslnCourse + "/node/")) {
        var tmp = route.path.split("/");
        if (
          !isNaN(parseFloat(tmp[tmp.length - 1])) &&
          isFinite(tmp[tmp.length - 1])
        ) {
          this.nid = tmp[tmp.length - 1];
          this.requestParams.node = this.nid;
          this.$.pageajax.generateRequest();
          if (this.$.outlinepopover.$.modal.opened) {
            this.$.outlinepopover.$.modal.opened = !1;
          }
          return;
        } else if ("edit" == tmp[tmp.length - 1]) {
          window.location.reload();
        }
      } else if (
        typeof this.aliases[urlAlias] !==
        ("undefined" === typeof void 0 ? "undefined" : typeof void 0)
      ) {
        this.nid = this.aliases[urlAlias].replace("node/", "");
        this.requestParams.node = this.nid;
        this.$.pageajax.generateRequest();
        if (this.$.outlinepopover.$.modal.opened) {
          this.$.outlinepopover.$.modal.opened = !1;
        }
        return;
      } else if ("" == urlAlias) {
        this.requestParams.node = this.nid;
        this.set("route.path", "/" + this.elmslnCourse + "/node/" + this.nid);
        this.$.pageajax.generateRequest();
        return;
      }
    }
    if ("" != this.elmslnCourse) {
      window.location.reload();
    }
  },
  _resetScroll: function _resetScroll() {
    var item =
      0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : "anchor";
    this.resetScroll = !0;
    this.$[item].scrollIntoView({ block: "nearest", behavior: "smooth" });
  },
  _toArray: function _toArray(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },
  __injectStyle: function __injectStyle(style) {
    if (null != this.shadowRoot.querySelector("#hackycsspotterhates")) {
      dom(this.$.hackycontainer).innerHTML = "";
    }
    var customStyle = document.createElement("style", "custom-style");
    customStyle.id = "hackycsspotterhates";
    customStyle.textContent = style;
    dom(this.$.hackycontainer).appendChild(customStyle);
  }
});
