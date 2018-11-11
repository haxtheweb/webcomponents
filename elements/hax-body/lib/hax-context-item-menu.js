import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/neon-animation/neon-animation.js";
import "./hax-toolbar-menu.js";
/**
`hax-context-item-menu`
An icon / button that has support for multiple options via drop down.

@demo demo/index.html

@microcopy - the mental model for this element
 - panel - the flyout from left or right side that has elements that can be placed
 - button - an item that expresses what interaction you will have with the content.

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
        height: 32px;
        box-sizing: border-box;
      }
      :host hax-toolbar-menu ::slotted(*):hover {
        background-color: #cccccc;
      };
      :host hax-toolbar-menu ::slotted(*) {
        height: 32px;
      };
    </style>
    <hax-toolbar-menu corner="[[corner]]" id="menu" icon="[[icon]]" tooltip="[[label]]" tooltip-direction="[[direction]]" selected="{{selectedValue}}" reset-on-select="[[resetOnSelect]]">
      <slot id="items"></slot>
    </hax-toolbar-menu>
`,

  is: "hax-context-item-menu",

  properties: {
    /**
     * corner
     */
    corner: {
      type: String,
      value: ""
    },
    /**
     * Internal flag to allow blocking the event firing if machine selects tag.
     */
    _blockEvent: {
      type: Boolean,
      value: false
    },
    /**
     * Should we reset the selection after it is made
     */
    resetOnSelect: {
      type: Boolean,
      value: false
    },
    /**
     * Value.
     */
    selectedValue: {
      type: Number,
      reflectToAttribute: true,
      notify: true,
      value: 0,
      observer: "_selectedUpdated"
    },
    /**
     * Direction for the tooltip
     */
    direction: {
      type: String,
      value: "top"
    },
    /**
     * Icon for the button.
     */
    icon: {
      type: String,
      value: "editor:text-fields",
      reflectToAttribute: true
    },
    /**
     * Icon for the button.
     */
    iconClass: {
      type: String,
      value: "black-text",
      reflectToAttribute: true
    },
    /**
     * Label for the button.
     */
    label: {
      type: String,
      value: "editor:text-fields",
      reflectToAttribute: true
    },
    /**
     * Name of the event to bubble up as being tapped.
     * This can be used to tell other elements what was
     * clicked so it can take action appropriately.
     */
    eventName: {
      type: String,
      value: "button",
      reflectToAttribute: true
    }
  },

  /**
   * Notice the selected value has changed.
   */
  _selectedUpdated: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof null &&
      typeof oldValue !== typeof undefined &&
      typeof oldValue !== typeof null
    ) {
      let children = dom(this.$.items).getDistributedNodes();
      var item = new Object();
      var j = 0;
      // check for tag match since we have to filter out text nodes
      for (var i = 0, len = children.length; i < len; i++) {
        if (children[i].tagName === "PAPER-ITEM") {
          if (j === newValue) {
            item = children[i];
            len = i;
            continue;
          }
          j++;
        }
      }
      // ensure we have a value; if so, this becomes the event to look for
      // also use our flag to ensure machine setting the tag default doesn't
      // equate to firing off a selected event.
      if (
        !this._blockEvent &&
        typeof item.attributes !== typeof undefined &&
        typeof item.attributes.value !== typeof undefined &&
        typeof item.attributes.value.value !== typeof undefined
      ) {
        // weird but this makes the menu close when we fire up an event
        // that indicates something higher should do something. This
        // avoids an annoying UX error where the menu stays open for
        // no reason.
        this.$.menu.hideMenu();
        this.fire("hax-context-item-selected", {
          target: item,
          eventName: item.attributes.value.value
        });
      }
      // we only block 1 time if it's available
      if (this._blockEvent) {
        this._blockEvent = false;
      }
    }
  }
});
