import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/hardware-icons.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/paper-styles/color.js";
import "@lrnwebcomponents/paper-search/paper-search-bar.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-slider/paper-slider.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "../node_modules/@polymer/app-layout/app-header/app-header.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "../node_modules/@polymer/app-route/app-location.js";
import "../node_modules/@polymer/app-route/app-route.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
import "../node_modules/@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js";
import "../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "../node_modules/@lrnwebcomponents/page-scroll-position/page-scroll-position.js";
import "../node_modules/@lrnwebcomponents/hax-body/hax-body.js";
import "../node_modules/@lrnwebcomponents/material-progress/material-progress.js";
import "../node_modules/@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
      paper-progress {
        --paper-progress-active-color: var(--paper-blue-300, blue);
        --paper-progress-secondary-color: var(--paper-yellow-300, yellow);
        --paper-progress-container-color: var(--paper-green-300, green);
        height: 24px;
        display: inline-block;
        vertical-align: text-top;
      }
      lrndesign-avatar {
        display: inline-block;
      }
      lrnsys-progress-circle {
        font-size: 64px;
      }
      .progress-icon {
        height: 40px;
        width: 40px;
        padding: 4px;
        display: inline-block;
        color: white;
        background-color: var(--paper-gray-300, gray);
        border-radius: 50%;
      }
      .progress-row {
        display: block;
        width: 100%;
      }
      .progress-left,
      .progress-right {
        padding: 16px;
        display: inline-block;
        height: 160px;
        vertical-align: text-top;
      }
      material-progress-histo {
        width: 100%;
        @apply(--paper-font-body2);
      }
      material-progress-bars {
        width: 100%;
        @apply(--paper-font-body2);
      }
      material-progress-bars > .bar > span {
        text-align: end;
        font-size: 14.4px;
        @apply(--layout-flex);
      }
      .bar {
        background-color: var(--paper-deep-orange-500);
      }
      .bar.run {
        background-color: var(--paper-purple-500);
      }
      .bar.hello {
        background-color: var(--paper-cyan-500);
      }
      .bar.world {
        background-color: var(--paper-orange-500);
      }
    </style>
    <iron-ajax id="dataajax" url="[[sourcePath]]" params="[[requestParams]]" handle-as="json" on-response="handleDataResponse" last-response="{{readTimeData}}"></iron-ajax>

    <div id="bodyloading" class="loading">
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      <h3 class="loading-text">Loading content..</h3>
    </div>
    <div>
    <material-progress-bars max="128" bar-height="22" animated="">
      <div class="bar" data-value="21">
        <iron-icon icon="av:video-library"></iron-icon>
      </div>
      <div class="bar run" data-value="13">
        <iron-icon icon="maps:directions-run"></iron-icon>
      </div>
      <div class="bar hello" data-value="50">
        <iron-icon icon="maps:directions-bike"></iron-icon>
        <span>Hello</span>
      </div>
      <div class="bar world" data-value="30">
        <span>World</span>
      </div>
    </material-progress-bars>
    <material-progress-histo bar-height="22" animated="">
      <div class="bar" data-value="21">
        <iron-icon icon="maps:directions-walk"></iron-icon>
      </div>
      <div class="bar run" data-value="13">
        <iron-icon icon="maps:directions-run"></iron-icon>
      </div>
      <div class="bar hello" data-value="50">
        <iron-icon icon="maps:directions-bike"></iron-icon>
        <span>Hello</span>
      </div>
      <div class="bar world" data-value="30">
        <span>World</span>
      </div>
    </material-progress-histo>
    <template is="dom-repeat" items="[[dashboardItems]]" as="item">
      <div class="progress-row">
        <div class="progress-left">
          <lrnsys-progress-circle status="disabled" class="flex" icon="[[item.meta.icon]]"></lrnsys-progress-circle>
        </div>
        <div class="progress-right">
          <h3 class="progress-item-title">[[item.attributes.title]]</h3>
          <div class="description-content">
            <div>
              <lrn-icon icon="network" class="progress-icon"></lrn-icon>
              <paper-progress value="70" secondary-progress="80"></paper-progress>
            </div>
            <div>
              <lrndesign-avatar src="[[userData.user.avatar]]" label="[[userData.user.display_name]]"></lrndesign-avatar>
              <paper-progress value="70" secondary-progress="80"></paper-progress>
            </div>
          </div>
        </div>
      </div>
    </template>
    </div>
`,
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
  _routeDataChanged: function(newValue) {
    if (typeof newValue !== typeof void 0) {
      this.requestParams[newValue.type] = newValue.id;
      if (this.progressChanged) {
        this.$.dataajax.generateRequest();
      }
    }
  },
  _showProgressChanged: function(newValue) {
    if (newValue && typeof this.routeData !== typeof void 0) {
      this.$.dataajax.generateRequest();
    }
  },
  handleDataResponse: function(obj) {
    let response = obj.detail.response.data;
    this.$.bodyloading.hidden = !0;
    this.userData = response.userdata;
    this.dashboardItems = this._toArray(response.items);
    console.log(response);
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
