import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`per-spec-tive`
Giving learners a new perspective on education.

@demo ../../demo/index.html

@microcopy - the mental model for this app
 - perspective - a change in viewpoint, angle of seeing something
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        transition: .6s all linear;
        background-color: transparent;
        opacity: 1;
      }
      :host([outline-loading]) {
        opacity: .6;
        background-color: #999999;
      }
      paper-card {
        width: 250px;
        height: 250px;
      }
      #list {
        min-height: 50vh;
        width: 100%;
      }
    </style>
    <iron-ajax auto="" id="endpoint" url="[[endPoint]]" loading="{{outlineLoading}}" handle-as="json" last-response="{{_outlineData}}" debounce-duration="300"></iron-ajax>
    <iron-list grid="" id="list" items="[[outline]]">
      <template>
        <paper-card heading="[[item.title]]" image="" elevation="1" animated-shadow="true">
          <div class="card-content">
            A card
          </div>
          <div class="card-actions">
            <paper-icon-button icon="add"></paper-icon-button>
            <paper-icon-button icon="delete"></paper-icon-button>
          </div>
        </paper-card>
      </template>
    </iron-list>
`,

  is: "per-spec-tive",

  properties: {
    /**
     * State of outline loading
     */
    outlineLoading: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Location of data to kick us off
     */
    endPoint: {
      type: String
    },
    /**
     * Outline data loaded from endPoint.
     */
    _outlineData: {
      type: Object,
      observer: "_outlineRawDataChanged"
    },
    /**
     * Outline
     */
    outline: {
      type: Array,
      observer: "_outlineChanged"
    }
  },

  /**
   * Notice outline data has changed off the end point
   */
  _outlineRawDataChanged: function(newValue, oldValue) {
    if (newValue != null && typeof newValue.items !== typeof undefined) {
      this.set("outline", []);
      this.set("outline", newValue.items);
    }
  },

  /**
   * Notice items in the outline have changed.
   */
  _outlineChanged: function(newValue, oldValue) {},

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
