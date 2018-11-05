define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/paper-styles/color.js",
  "@lrnwebcomponents/paper-search/paper-search-bar.js",
  "@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-slider/paper-slider.js",
  "../node_modules/@polymer/app-layout/app-layout.js",
  "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "../node_modules/@polymer/app-layout/app-header/app-header.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js",
  "../node_modules/@polymer/app-route/app-location.js",
  "../node_modules/@polymer/app-route/app-route.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js",
  "../node_modules/@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js",
  "../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../node_modules/@lrnwebcomponents/page-scroll-position/page-scroll-position.js",
  "../node_modules/@lrnwebcomponents/hax-body/hax-body.js",
  "../node_modules/@lrnwebcomponents/material-progress/material-progress.js",
  "../node_modules/@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_9f623460e11b11e899fb13502c4163ea() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n      }\n      paper-progress {\n        --paper-progress-active-color: var(--paper-blue-300, blue);\n        --paper-progress-secondary-color: var(--paper-yellow-300, yellow);\n        --paper-progress-container-color: var(--paper-green-300, green);\n        height: 1.5em;\n        display: inline-block;\n        vertical-align: text-top;\n      }\n      lrndesign-avatar {\n        display: inline-block;\n      }\n      lrnsys-progress-circle {\n        font-size: 4em;\n      }\n      .progress-icon {\n        height: 2.5em;\n        width: 2.5em;\n        padding: .25em;\n        display: inline-block;\n        color: white;\n        background-color: var(--paper-gray-300, gray);\n        border-radius: 50%;\n      }\n      .progress-row {\n        display: block;\n        width: 100%;\n      }\n      .progress-left,\n      .progress-right {\n        padding: 1em;\n        display: inline-block;\n        height: 10em;\n        vertical-align: text-top;\n      }\n      material-progress-histo {\n        width: 100%;\n        @apply(--paper-font-body2);\n      }\n      material-progress-bars {\n        width: 100%;\n        @apply(--paper-font-body2);\n      }\n      material-progress-bars > .bar > span {\n        text-align: end;\n        font-size: 0.9em;\n        @apply(--layout-flex);\n      }\n      .bar {\n        background-color: var(--paper-deep-orange-500);\n      }\n      .bar.run {\n        background-color: var(--paper-purple-500);\n      }\n      .bar.hello {\n        background-color: var(--paper-cyan-500);\n      }\n      .bar.world {\n        background-color: var(--paper-orange-500);\n      }\n    </style>\n    <iron-ajax id="dataajax" url="[[sourcePath]]" params="[[requestParams]]" handle-as="json" on-response="handleDataResponse" last-response="{{readTimeData}}"></iron-ajax>\n\n    <div id="bodyloading" class="loading">\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n      <h3 class="loading-text">Loading content..</h3>\n    </div>\n    <div>\n    <material-progress-bars max="128" bar-height="22" animated="">\n      <div class="bar" data-value="21">\n        <iron-icon icon="av:video-library"></iron-icon>\n      </div>\n      <div class="bar run" data-value="13">\n        <iron-icon icon="maps:directions-run"></iron-icon>\n      </div>\n      <div class="bar hello" data-value="50">\n        <iron-icon icon="maps:directions-bike"></iron-icon>\n        <span>Hello</span>\n      </div>\n      <div class="bar world" data-value="30">\n        <span>World</span>\n      </div>\n    </material-progress-bars>\n    <material-progress-histo bar-height="22" animated="">\n      <div class="bar" data-value="21">\n        <iron-icon icon="maps:directions-walk"></iron-icon>\n      </div>\n      <div class="bar run" data-value="13">\n        <iron-icon icon="maps:directions-run"></iron-icon>\n      </div>\n      <div class="bar hello" data-value="50">\n        <iron-icon icon="maps:directions-bike"></iron-icon>\n        <span>Hello</span>\n      </div>\n      <div class="bar world" data-value="30">\n        <span>World</span>\n      </div>\n    </material-progress-histo>\n    <template is="dom-repeat" items="[[dashboardItems]]" as="item">\n      <div class="progress-row">\n        <div class="progress-left">\n          <lrnsys-progress-circle status="disabled" class="flex" icon="[[item.meta.icon]]"></lrnsys-progress-circle>\n        </div>\n        <div class="progress-right">\n          <h3 class="progress-item-title">[[item.attributes.title]]</h3>\n          <div class="description-content">\n            <div>\n              <lrn-icon icon="network" class="progress-icon"></lrn-icon>\n              <paper-progress value="70" secondary-progress="80"></paper-progress>\n            </div>\n            <div>\n              <lrndesign-avatar src="[[userData.user.avatar]]" label="[[userData.user.display_name]]"></lrndesign-avatar>\n              <paper-progress value="70" secondary-progress="80"></paper-progress>\n            </div>\n          </div>\n        </div>\n      </div>\n    </template>\n    </div>\n'
    ]);
    _templateObject_9f623460e11b11e899fb13502c4163ea = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9f623460e11b11e899fb13502c4163ea()
    ),
    is: "lrnapp-book-progress-dashboard",
    properties: {
      routeData: { type: Object, observer: "_routeDataChanged" },
      requestParams: { type: Object, value: { node: null } },
      sourcePath: { type: String },
      readTimeData: { type: Object, value: [] },
      userData: { type: Object, value: [] },
      showProgress: {
        type: Boolean,
        value: !1,
        reflectToAttribute: !0,
        observer: "_showProgressChanged"
      }
    },
    _routeDataChanged: function _routeDataChanged(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined") {
        this.requestParams[newValue.type] = newValue.id;
        if (this.progressChanged) {
          this.$.dataajax.generateRequest();
        }
      }
    },
    _showProgressChanged: function _showProgressChanged(newValue) {
      if (newValue && babelHelpers.typeof(this.routeData) !== "undefined") {
        this.$.dataajax.generateRequest();
      }
    },
    handleDataResponse: function handleDataResponse(obj) {
      var response = obj.detail.response.data;
      this.$.bodyloading.hidden = !0;
      this.userData = response.userdata;
      this.dashboardItems = this._toArray(response.items);
      console.log(response);
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
