import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-styles/color.js";
import "@lrnwebcomponents/paper-search/lib/paper-search-bar.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
import "@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/page-scroll-position/page-scroll-position.js";
import "@lrnwebcomponents/hax-body/hax-body.js";
import "@lrnwebcomponents/material-progress/material-progress.js";
import "@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js";

/**
`lrnapp-book-progress-dashboard`
A LRN element

@demo demo/index.html

@microcopy
  progress - the amount the student has moved through the active item(s)
  active item - pages of content the user is engaging with
  stats

*/
Polymer({
  _template: html`
    <custom-style>
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: block;
      }
      paper-progress {
        --paper-progress-active-color: var(--paper-blue-300, blue);
        --paper-progress-secondary-color: var(--paper-yellow-300, yellow);
        --paper-progress-container-color: var(--paper-green-300, green);
        height: 1.5em;
        display: inline-block;
        vertical-align: text-top;
      }
      lrndesign-avatar {
        display: inline-block;
      }
      lrnsys-progress-circle {
        font-size: 4em;
      }
      .progress-icon {
        height: 2.5em;
        width: 2.5em;
        padding: .25em;
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
        padding: 1em;
        display: inline-block;
        height: 10em;
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
        font-size: 0.9em;
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
    </custom-style>
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

  is: 'lrnapp-book-progress-dashboard',

  properties: {
    /**
     * Data about the active route; this includes item type and id.
     */
    routeData: {
      type: Object,
      observer: '_routeDataChanged',
    },
    /**
     * Params for the request for outline/book to load.
     */
    requestParams: {
      type: Object,
      value: {
        "node": null
      },
    },
    /**
     * Path to get data into the UI
     */
    sourcePath: {
      type: String,
    },
    /**
     * Read time data
     */
    readTimeData: {
      type: Object,
      value: [],
    },
    /**
     * User data.
     */
    userData: {
      type: Object,
      value: [],
    },
    /**
     * If this is visible; useful for toggling / activating.
     */
    showProgress: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: '_showProgressChanged',
    },
  },

  /**
   * Notice route data has changed.
   */
  _routeDataChanged: function (newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.requestParams[newValue.type] = newValue.id;
      // if we're visible kick off the call
      if (this.progressChanged) {
        this.$.dataajax.generateRequest();
      }
    }
  },

  /**
   * Showing element state has changed
   */
  _showProgressChanged: function (newValue, oldValue) {
    // ensure we are visible
    if (newValue && typeof this.routeData !== typeof undefined) {
      this.$.dataajax.generateRequest();
    }
  },

  /**
   * Response data.
   */
  handleDataResponse: function (obj) {
    let response = obj.detail.response.data;
    // show the info
    this.$.bodyloading.hidden = true;
    // split the data into two sets
    this.userData = response.userdata;
    this.dashboardItems = this._toArray(response.items);
    console.log(response);
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
