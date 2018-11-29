/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@polymer/iron-pages/iron-pages.js";
import "@lrnwebcomponents/paper-stepper/paper-stepper.js";
import "./lib/gene-crossover-1.js";
import "./lib/gene-crossover-2.js";
import "./lib/gene-crossover-3.js";
import "./lib/gene-crossover-4.js";
import "./lib/gene-crossover-5.js";
/**
 * `gene-crossover`
 * `Gene animations`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 *  -
 */
let GeneCrossover = Polymer({
  _template: html`
    <style is="custom-style" include="animation-shared-styles">
       :host {
        display: block;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: 'Open Sans', sans-serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #6D6E71;
        text-align: center;
        font-size: 19.2px;
      }

      p {
        font-family: 'Open Sans', sans-serif;
      }
    </style>

    <!--Pages-->
    <iron-pages selected="[[activePage]]">
      <gene-crossover-1 selected="[[_isActive(activePage, 0)]]"></gene-crossover-1>
      <gene-crossover-2 selected="[[_isActive(activePage, 1)]]"></gene-crossover-2>
      <gene-crossover-3 selected="[[_isActive(activePage, 2)]]"></gene-crossover-3>
      <gene-crossover-4 selected="[[_isActive(activePage, 3)]]"></gene-crossover-4>
      <!-- <gene-crossover-5 selected="[[_isActive(activePage, 4)]]"></gene-crossover-5> -->
    </iron-pages>


    <!--Counter-->
    <template is="dom-if" if="[[count]]">
      <paper-stepper selected="{{activePage}}" progress-bar="">
        <template is="dom-repeat" items="[[_countToArray(count)]]">
          <paper-step></paper-step>
        </template>
      </paper-stepper>
    </template>
`,

  is: "gene-crossover",

  properties: {
    activePage: {
      type: String,
      value: 0
    },
    count: {
      type: Number,
      value: 0
    }
  },

  _isActive: function(activePage, index) {
    return activePage === index;
  },

  _countToArray: function(count) {
    var array = [];
    if (count) {
      for (var i = 0; i < count; i++) {
        array.push(i);
      }
    }
    return array;
  },

  ready: function() {
    var root = this;
    var ironPages = root.shadowRoot.querySelector("iron-pages");
    if (ironPages.children) {
      if (ironPages.children.length) {
        root.count = ironPages.children.length;
      }
    }
  }
});
export { GeneCrossover };
