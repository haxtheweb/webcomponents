import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "../a11y-collapse.js";
/**
`a11y-collapse-group`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 
  <a11y-collapse-group 
    global-options='{"prop": "value"}'     //Optional: An object that will automatica11y override and set properties for every a11y-collapse.
    radio>                                 //Optional: radio. If true, only one item in the group can be expanded at a time.
    <h2 slot="heading">Colors List</h2>    //Optional: Adds the slotted content above the group
    <a11y-collapse>...</a11y-collapse>     //An a11y-collapse item. See documentation for the a11y-collapse
  </a11y-collapse-group>

  CSS Mixins:
  --a11y-collapse-group                    //sets CSS for the a11y-collapse-group
  --a11y-collapse-group-heading            //sets CSS for the a11y-collapse-group heading

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        @apply --a11y-collapse-group;
      }
      :host #heading {
        font-weight: bold;
        @apply --a11y-collapse-group-heading;
      }
      :host .wrapper::slotted(a11y-collapse) {
        margin: 0;
        border-radius: 0;
      }
      :host .wrapper::slotted(a11y-collapse):not(:first-of-type) {
        border-top: none;
      }
    </style>
    <div class="wrapper"><slot id="heading"></slot> <slot></slot></div>
  `,

  is: "a11y-collapse-group",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * accordion-style: whole header of every a11y-collapse item acts as button? default is just icon.
     */
    accordion: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * is every each a11y-collapse item disabled?
     */
    disabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * an array of globalProperties to override every a11y-collapse item
     * For example, {"icon": "arrow-drop-down"} would set every item's icon to "arrow-drop-down"
     */
    globalOptions: {
      type: Object,
      value: {}
    },
    /**
     * is every a11y-collapse item radio button?
     */
    radio: {
      type: Boolean,
      value: false
    },
    /**
     * is radio button
     */
    __items: {
      type: Array,
      value: []
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  ready: function() {
    this.addEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.addEventListener("a11y-collapse-attached", function(e) {
      this._attachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
  },

  /**
   * Removes a detached item from the _items array.
   */
  _attachItem: function(item) {
    for (let key in this.globalOptions) {
      if (this.globalOptions.hasOwnProperty(key)) {
        item._overrideProp(key, this.globalOptions[key]);
      }
    }
    this.push("__items", item);
    this.notifyPath("__items");
  },

  /**
   * Removes a detached item from the _items array.
   */
  _detachItem: function(item) {
    for (let i = 0; i < this.__items.length; i++) {
      if (this.__items[i] === e.detail) this.splice("_items", i, 1);
    }
  },

  /**
   * Toggles off all previous choices.
   */
  radioToggle: function(item) {
    if (this.radio && item.expanded) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] !== item) this.__items[i].toggle(false);
      }
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  detached: function() {
    this.removeEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.removeEventListener("a11y-collapse-attached", function(e) {
      this.push("__items", e.detail);
    });
    this.removeEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    this.set("__items", []);
    this.notify("__items");
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
