import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "@polymer/paper-tabs/paper-tabs.js";
import "@polymer/paper-tabs/paper-tab.js";
/**
`tab-list`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        margin: 0 auto;
        list-style: none;
        display: flex;
        padding: 16px;
        border-bottom: 1px solid black;
      }
      paper-tab a {
        text-decoration: none;
      }
      paper-button {
        text-transform: unset;
      }
    </style>
    <paper-tabs>
      <template is="dom-repeat" items="[[tabs]]" as="tab">
        <paper-tab><a target="_blank" href="[[tab.link]]" tabindex="-1"><paper-button raised="">[[tab.label]]</paper-button></a></paper-tab>
      </template>
    </paper-tabs>
`,

  is: "tab-list",
  behaviors: [HAXBehaviors.PropertiesBehaviors],

  observers: ["_valueChanged(tabs.*)"],

  properties: {
    /**
     * List of tabs
     */
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * Notice an array has changed and update the DOM.
   */
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("tabs." + i + "." + j);
      }
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Tabs",
        description: "A list of links as tabs.",
        icon: "icons:tab",
        color: "grey",
        groups: ["Presentation", "Links"],
        handles: [],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "tabs",
            title: "Tabs",
            description: "Listing of tabs",
            inputMethod: "array",
            properties: [
              {
                property: "link",
                title: "Link",
                description: "link to go to",
                inputMethod: "textfield",
                required: true
              },
              {
                property: "label",
                title: "Label",
                description: "text to place on the tab",
                inputMethod: "textfield",
                required: true
              }
            ]
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
