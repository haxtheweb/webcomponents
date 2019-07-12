import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "../a11y-collapse.js";
/**
 * `a11y-collapse-group`
 * A group of a11y-collapse elements
 * @microcopy - the mental model for this element```
<a11y-collapse-group 
  global-options='{"prop": "value"}'     //Optional: An object that will automatica11y override and set properties for every a11y-collapse.
  radio>                                 //Optional: radio. If true, only one item in the group can be expanded at a time.
  <h2 slot="heading">Colors List</h2>    //Optional: Adds the slotted content above the group
  <a11y-collapse>...</a11y-collapse>     //An a11y-collapse item. See documentation for the a11y-collapse
</a11y-collapse-group>

CSS Mixins:
  --a11y-collapse-group                    //sets CSS for the a11y-collapse-group
  --a11y-collapse-group-heading            //sets CSS for the a11y-collapse-group heading
```
 *
 * @customElement
 * @polymer
 * @demo demo/accordion.html collapse groups
 */

class A11yCollapseGroup extends PolymerElement {
  static get tag() {
    return "a11y-collapse-group";
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          margin: var(--a11y-collapse-group-margin, 15px 0);
          --a11y-collapse-margin: 15px;

          @apply --a11y-collapse-group;
        }
        :host #heading {
          font-weight: bold;
          @apply --a11y-collapse-group-heading;
        }
        :host .wrapper {
          border-radius: 0;
          --a11y-collapse-margin: 0;
          --a11y-collapse-border-between: none;
        }
      </style>
      <div class="wrapper"><slot></slot></div>
    `;
  }
  static get properties() {
    return {
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
    };
  }
  constructor() {
    super();
    this.addEventListener("a11y-collapse-attached", function(e) {
      this._attachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
  }

  /**
   * Removes a detached item from the _items array.
   */
  _attachItem(item) {
    for (let key in this.globalOptions) {
      if (this.globalOptions.hasOwnProperty(key)) {
        item._overrideProp(key, this.globalOptions[key]);
      }
    }
    this.push("__items", item);
    this.notifyPath("__items");
  }

  /**
   * Removes a detached item from the _items array.
   */
  _detachItem(item) {
    for (let i = 0; i < this.__items.length; i++) {
      if (this.__items[i] === item) this.splice("_items", i, 1);
    }
  }

  /**
   * Toggles off all previous choices.
   */
  radioToggle(item) {
    if (this.radio && item.expanded) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] !== item) this.__items[i].toggle(false);
      }
    }
  }

  disconnectedCallback() {
    this.removeEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.removeEventListener("a11y-collapse-attached", function(e) {
      this.push("__items", e.detail);
    });
    this.removeEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yCollapseGroup.tag, A11yCollapseGroup);
export { A11yCollapseGroup };
