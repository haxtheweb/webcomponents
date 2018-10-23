import "@polymer/polymer/polymer.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@polymer/iron-pages/iron-pages.js";
import "paper-stepper/paper-stepper.js";
import "./gene-crossover-1.js";
import "./gene-crossover-2.js";
import "./gene-crossover-3.js";
import "./gene-crossover-4.js";
import "./gene-crossover-5.js";
import "animation-shared-styles/animation-shared-styles.js";
Polymer({
  _template: `
    <style is="custom-style" include="animation-shared-styles">
       :host {
        display: block;
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
      for (i = 0; i < count; i++) {
        array.push(i);
      }
    }
    console.log(array);
    return array;
  },

  ready: function() {
    var root = this;
    var ironPages = root.$$("iron-pages");
    if (ironPages.children) {
      if (ironPages.children.length) {
        root.count = ironPages.children.length;
      }
    }
  }
});
