define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/polymer/lib/utils/async.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "../../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../../node_modules/@polymer/paper-styles/color.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@lrnwebcomponents/grid-plate/grid-plate.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(
  _polymerLegacy,
  _polymerDom,
  async,
  _ironIcons,
  _hardwareIcons,
  _ironAjax,
  _paperIconButton,
  _color,
  _paperTooltip,
  _appLocation,
  _appRoute,
  _gridPlate,
  _responsiveGridRow,
  _responsiveGridCol,
  _materializecssStyles
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_60ad0630f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n      :host([loading]) #content {\n        opacity: .2;\n      }\n      #content {\n        opacity: 1;\n        visibility: visible;\n        transition: all .4s ease;\n      }\n    </style>\n    <div id="hackycontainer"><style id="hackycsspotterhates"></style></div>\n    <iron-ajax\n      id="fulloutlinepath"\n      url="[[fullOutlinePath]]"\n      handle-as="json"\n      on-response="handleOutlineResponse"\n      last-response="{{outlineData}}"></iron-ajax>\n    <iron-ajax\n      id="pageajax"\n      params="[[requestParams]]"\n      url="[[sourcePath]]"\n      handle-as="json"\n      on-response="handleResponse"\n      last-response="{{pageData}}"\n      loading="{{_loading}}"></iron-ajax>\n    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:type/:id"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}">\n    </app-route>\n    <main id="etb-tool-nav" data-offcanvas="">\n      <div id="anchor"></div>\n      <div class="inner-wrap">\n        <section class="main-section etb-book" style="min-height: 318px;">\n          <h2 class="element-invisible">Content navigation</h2>\n          <div class="r-header row">\n            <div class="r-header__left">\n              <div class="book-navigation-header book-sibling-nav-container book-navigation-header-2">\n                <div class="book-navigation-header book-sibling-nav-container book-navigation-header-<?php print $count ?>">\n                  <lrnsys-dialog id="outlinepopover" data-voicecommand="open outline" class="black-text" hover-class="grey darken-3 white-text" label="Outline" header="Outline">\n                    <span slot="button">\n                      <iron-icon icon="explore"></iron-icon>\n                      Outline\n                    </span>\n                    <div class="elmsln-modal-content" id="block-mooc-helper-mooc-helper-toc-nav-modal">\n                      <div id="outlinemodal" on-tap="_modalTap"><slot name="outlinemodal"></slot></div>\n                    </div>\n                  </lrnsys-dialog>\n                  <div id="navigation"><slot name="navigation"></slot></div>\n                </div>\n              </div>\n            </div>\n            <div id="options" class="r-header__right">\n              <slot name="options"></slot>\n            </div>\n          </div>\n          <div class="elmsln-content-wrap" role="main">\n          <responsive-grid-row gutter="4">\n            <responsive-grid-col xl="3" lg="3" md="3" sm="4" xs="12">\n              <section id="block-mooc-nav-block-mooc-nav-nav" class="mooc-nav-block-left block block-mooc-nav-block contextual-links-region block-mooc-nav-block-mooc-nav column" role="navigation" aria-label$="[[outlineTitle]]">\n                <div class="block-mooc-nav-block-mooc-title black white-text">[[outlineTitle]]</div>\n                <div id="outline"><slot name="outline"></slot></div>\n              </section>\n              <div id="blocks"><slot name="blocks"></slot></div>\n            </responsive-grid-col>\n            <responsive-grid-col xl="8" lg="8" md="9" sm="7" xs="12">\n              <a id="main-content" class="scrollspy" data-scrollspy="scrollspy"></a>\n              <div class="column">\n                <div id="content"><slot name="content"></slot></div>\n              </div>\n            </responsive-grid-col>\n          </responsive-grid-row>\n        </section>\n        <a class="exit-off-canvas"></a>\n      </div>\n    </main>'
    ]);
    _templateObject_60ad0630f77011e8b89b0519890f95da = function _templateObject_60ad0630f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_60ad0630f77011e8b89b0519890f95da()
    ),
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
      var normalizedEvent = (0, _polymerDom.dom)(e),
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
        ("undefined" === typeof newValue
          ? "undefined"
          : babelHelpers.typeof(newValue)) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : "undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
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
        babelHelpers.typeof(this.pageData.data) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : "undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var data = this.pageData.data;
        if (
          babelHelpers.typeof(data.ops.redirect) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : "undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
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
            babelHelpers.typeof(this.outlineData.data) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : "undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            this.$.fulloutlinepath.generateRequest();
          }
          async.microTask.run(function() {
            window.dispatchEvent(new Event("resize"));
          });
        }
      }
    },
    handleOutlineResponse: function handleOutlineResponse(e) {
      var data = this.outlineData.data;
      if (
        ("undefined" === typeof data
          ? "undefined"
          : babelHelpers.typeof(data)) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : "undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
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
          babelHelpers.typeof(this.aliases[urlAlias]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : "undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
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
        0 < arguments.length && arguments[0] !== void 0
          ? arguments[0]
          : "anchor";
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
        (0, _polymerDom.dom)(this.$.hackycontainer).innerHTML = "";
      }
      var customStyle = document.createElement("style", "custom-style");
      customStyle.id = "hackycsspotterhates";
      customStyle.textContent = style;
      (0, _polymerDom.dom)(this.$.hackycontainer).appendChild(customStyle);
    }
  });
});
